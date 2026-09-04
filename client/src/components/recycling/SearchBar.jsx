import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce.js";
import { suggestWasteGuides } from "../../services/wasteGuideService.js";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search waste type or item",
  showSuggestions = true,
}) {
  const debounced = useDebounce(value, 350);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!showSuggestions || !debounced || debounced.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    suggestWasteGuides(debounced.trim())
      .then((res) => {
        if (!cancelled) {
          setSuggestions(res.data || []);
          setOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, showSuggestions]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    setOpen(false);
    onSearch?.(value.trim());
  };

  return (
    <form className="rg-search" onSubmit={submit} ref={wrapRef} role="search">
      <label className="rf-label" htmlFor="rg-search-input">
        Search waste type or item
      </label>
      <div className="rg-search__row">
        <input
          id="rg-search-input"
          className="rf-input"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="rg-suggest-list"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
      {open && suggestions.length > 0 && (
        <ul id="rg-suggest-list" className="rg-suggest" role="listbox">
          {suggestions.map((s) => (
            <li key={s._id}>
              <button
                type="button"
                className="rg-suggest__item"
                role="option"
                onClick={() => {
                  onChange(s.name);
                  setOpen(false);
                  onSearch?.(s.name);
                }}
              >
                <span>{s.name}</span>
                <span className="rg-suggest__cat">{s.category}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
