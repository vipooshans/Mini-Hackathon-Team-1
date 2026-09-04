import { useTranslation } from "react-i18next";
import { useLowData } from "../../context/LowDataContext.jsx";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { lowData, toggleLowData } = useLowData();

  return (
    <div className="lang-switcher" role="group" aria-label="Language and data mode">
      <button
        type="button"
        className={i18n.language === "en" ? "is-active" : ""}
        onClick={() => i18n.changeLanguage("en")}
        aria-pressed={i18n.language === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={i18n.language?.startsWith("si") ? "is-active" : ""}
        onClick={() => i18n.changeLanguage("si")}
        aria-pressed={i18n.language?.startsWith("si")}
      >
        සිං
      </button>
      <button
        type="button"
        className={i18n.language?.startsWith("ta") ? "is-active" : ""}
        onClick={() => i18n.changeLanguage("ta")}
        aria-pressed={i18n.language?.startsWith("ta")}
      >
        தமிழ்
      </button>
      <button
        type="button"
        className={lowData ? "is-active" : ""}
        onClick={toggleLowData}
        aria-pressed={lowData}
        title="Low-data mode"
      >
        Low data
      </button>
    </div>
  );
}
