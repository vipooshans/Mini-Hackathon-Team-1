export default function DynamicStringList({ label, values = [], onChange, placeholder = "" }) {
  const update = (idx, val) => {
    const next = [...values];
    next[idx] = val;
    onChange(next);
  };
  const remove = (idx) => onChange(values.filter((_, i) => i !== idx));
  const add = () => onChange([...values, ""]);

  return (
    <fieldset className="dyn-list">
      <legend className="rf-label">{label}</legend>
      {values.map((v, idx) => (
        <div className="dyn-list__row" key={idx}>
          <input
            className="rf-input"
            value={v}
            onChange={(e) => update(idx, e.target.value)}
            placeholder={placeholder}
            aria-label={`${label} ${idx + 1}`}
          />
          <button type="button" className="btn" onClick={() => remove(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={add}>
        + Add
      </button>
    </fieldset>
  );
}
