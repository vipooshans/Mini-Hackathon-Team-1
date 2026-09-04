import { useState } from "react";
import { getDistricts, municipalities } from "../../services/collection-schedule/scheduleData.js";

function ScheduleLookupForm({ onLookup }) {
  const [municipality, setMunicipality] = useState("");
  const [district, setDistrict] = useState("");
  const [message, setMessage] = useState("");
  const districts = getDistricts(municipality);

  function handleMunicipalityChange(event) {
    setMunicipality(event.target.value);
    setDistrict("");
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!municipality || !district) {
      setMessage("Select your municipal council and area to continue.");
      return;
    }

    setMessage("");
    onLookup(municipality, district);
  }

  return (
    <form className="lookup-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="municipality">Municipal council</label>
      <select id="municipality" value={municipality} onChange={handleMunicipalityChange}>
        <option value="">Select your council</option>
        {municipalities.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>

      <label htmlFor="district">Area or ward</label>
      <select
        id="district"
        value={district}
        onChange={(event) => setDistrict(event.target.value)}
        disabled={!municipality}
      >
        <option value="">{municipality ? "Select your area" : "Choose a council first"}</option>
        {districts.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>

      {message && <p className="form-message" role="alert">{message}</p>}
      <button className="primary-button" type="submit">Find my next pickup <span aria-hidden="true">→</span></button>
    </form>
  );
}

export default ScheduleLookupForm;
