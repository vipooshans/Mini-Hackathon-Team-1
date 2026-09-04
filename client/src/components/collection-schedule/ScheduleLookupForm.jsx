import { useState } from "react";
import { getAreas, getDistricts, municipalities } from "../../services/collection-schedule/locationOptions.js";

function ScheduleLookupForm({ loading, onLookup, onLocationChange }) {
  const [municipality, setMunicipality] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");
  const districts = getDistricts(municipality);
  const areas = getAreas(municipality, district);

  function handleMunicipalityChange(event) {
    setMunicipality(event.target.value);
    setDistrict("");
    setArea("");
    setMessage("");
    onLocationChange();
  }

  function handleDistrictChange(event) {
    setDistrict(event.target.value);
    setArea("");
    setMessage("");
    onLocationChange();
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!municipality) return setMessage("Please select your municipal council.");
    if (!district) return setMessage("Please select your district.");
    if (!area) return setMessage("Please select your area or ward.");
    if (!areas.includes(area)) return setMessage("Please select a valid area or ward.");
    setMessage("");
    onLookup({ municipality, district, area });
  }

  return (
    <form className="lookup-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="municipality">Municipal council</label>
        <select id="municipality" value={municipality} onChange={handleMunicipalityChange}>
          <option value="">Select your council</option>
          {municipalities.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="district">District</label>
        <select id="district" value={district} onChange={handleDistrictChange} disabled={!municipality}>
          <option value="">{municipality ? "Select your district" : "Choose a council first"}</option>
          {districts.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="area">Area or ward</label>
        <select
          id="area"
          value={area}
          onChange={(event) => {
            setArea(event.target.value);
            setMessage("");
            onLocationChange();
          }}
          disabled={!district}
        >
          <option value="">{district ? "Select your area" : "Choose a district first"}</option>
          {areas.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      {message && <p className="form-message" role="alert">{message}</p>}
      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Finding schedule..." : "Find my next pickup"}
      </button>
    </form>
  );
}

export default ScheduleLookupForm;
