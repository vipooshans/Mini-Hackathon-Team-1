import { useState, useRef } from "react";
import { validateReportForm } from "../../utils/validateReportForm.js";
import { createReport } from "../../services/reportService.js";
import LocationPicker from "./LocationPicker.jsx";

/**
 * Sri Lankan districts — all 25 administrative districts.
 */
const SRI_LANKAN_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

const WASTE_TYPES = [
  "Illegal Dumping",
  "Overflowing Bin",
  "Uncollected Garbage",
];

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * ReportForm — controlled form for submitting waste reports.
 *
 * Includes:
 * - District / waste type / description fields
 * - Interactive Leaflet map for location picking
 * - Image upload with preview (up to 3 images, 5MB each)
 * - Sends FormData for multipart upload
 *
 * Styled with rf-* classes matching the Fraunces/Outfit design system.
 */
function ReportForm() {
  const [formData, setFormData] = useState({
    district: "",
    wasteType: "",
    description: "",
    address: "",
  });

  const [mapCoords, setMapCoords] = useState(null);
  const [images, setImages] = useState([]); // { file: File, preview: string }[]
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleLocationChange = (coords) => {
    setMapCoords(coords);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) return;

    const validFiles = files.slice(0, remaining).filter((file) => {
      if (file.size > MAX_FILE_SIZE) return false;
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return false;
      return true;
    });

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const payload = {
      ...formData,
      location: mapCoords ? { lat: mapCoords.lat, lng: mapCoords.lng } : undefined,
    };

    const validationErrors = validateReportForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build FormData for multipart upload
    const fd = new FormData();
    fd.append("district", formData.district);
    fd.append("wasteType", formData.wasteType);
    fd.append("description", formData.description);

    if (formData.address.trim()) {
      fd.append("address", formData.address.trim());
    }

    if (mapCoords) {
      fd.append("lat", mapCoords.lat.toString());
      fd.append("lng", mapCoords.lng.toString());
    }

    images.forEach((img) => {
      fd.append("images", img.file);
    });

    setSubmitStatus("submitting");

    try {
      await createReport(fd);
      setSubmitStatus("success");
      setFormData({ district: "", wasteType: "", description: "", address: "" });
      setMapCoords(null);
      // Revoke object URLs
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setErrors({});
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(err.message || "Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="report-card">
      <div className="report-card__header">
        <h2 className="report-card__title">Report a Waste Issue</h2>
        <p className="report-card__subtitle">
          Help keep your community clean by reporting waste problems in your area.
        </p>
      </div>

      {submitStatus === "success" && (
        <div className="rf-alert rf-alert--success">
          <span>✓</span>
          <span>Your report has been submitted successfully. Thank you for helping keep Sri Lanka clean.</span>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="rf-alert rf-alert--error">
          <span>!</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* District */}
        <div className={`rf-group${errors.district ? " rf-group--error" : ""}`}>
          <label className="rf-label" htmlFor="district">District</label>
          <select
            className="rf-select"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
          >
            <option value="">Select your district</option>
            {SRI_LANKAN_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && <span className="rf-error">{errors.district}</span>}
        </div>

        {/* Waste Type */}
        <div className={`rf-group${errors.wasteType ? " rf-group--error" : ""}`}>
          <label className="rf-label" htmlFor="wasteType">Waste Type</label>
          <select
            className="rf-select"
            id="wasteType"
            name="wasteType"
            value={formData.wasteType}
            onChange={handleChange}
          >
            <option value="">Select waste type</option>
            {WASTE_TYPES.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {errors.wasteType && <span className="rf-error">{errors.wasteType}</span>}
        </div>

        {/* Description */}
        <div className={`rf-group${errors.description ? " rf-group--error" : ""}`}>
          <label className="rf-label" htmlFor="description">Description</label>
          <textarea
            className="rf-textarea"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the waste issue — location details, how long it's been there…"
            rows={4}
          />
          {errors.description && <span className="rf-error">{errors.description}</span>}
        </div>

        {/* Address (optional) */}
        <div className="rf-group">
          <label className="rf-label" htmlFor="address">
            Address <span className="rf-optional">(optional)</span>
          </label>
          <input
            className="rf-input"
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address or landmark"
          />
        </div>

        {/* Location Picker (Leaflet Map) */}
        <LocationPicker value={mapCoords} onChange={handleLocationChange} />

        {/* Image Upload */}
        <div className="rf-images">
          <span className="rf-images__label">
            Photos <span className="rf-optional">(optional, up to {MAX_IMAGES})</span>
          </span>

          <div
            className="rf-images__dropzone"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <span className="rf-images__icon">📷</span>
            <span className="rf-images__text">
              {images.length >= MAX_IMAGES
                ? `Maximum ${MAX_IMAGES} images reached`
                : "Click to add photos"}
            </span>
            <span className="rf-images__hint">JPEG, PNG, or WebP — max 5MB each</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageSelect}
            className="rf-images__input"
            aria-label="Upload images"
          />

          {images.length > 0 && (
            <div className="rf-images__grid">
              {images.map((img, i) => (
                <div className="rf-images__thumb" key={i}>
                  <img src={img.preview} alt={`Upload ${i + 1}`} />
                  <button
                    type="button"
                    className="rf-images__remove"
                    onClick={() => removeImage(i)}
                    aria-label={`Remove image ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="rf-btn rf-btn--primary"
          disabled={submitStatus === "submitting"}
        >
          {submitStatus === "submitting" ? (
            <>
              <span className="rf-spinner" /> Submitting…
            </>
          ) : (
            "Submit Report"
          )}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
