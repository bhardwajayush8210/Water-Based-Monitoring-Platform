import React, { useState, useEffect, useRef } from "react";
import { Translate, Search, ChevronDown } from "react-bootstrap-icons";

// Complete List of 133 Google Translate Supported Languages
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "hy", name: "Armenian" },
  { code: "as", name: "Assamese (অসমীয়া)" },
  { code: "ay", name: "Aymara" },
  { code: "az", name: "Azerbaijani" },
  { code: "bm", name: "Bambara" },
  { code: "eu", name: "Basque" },
  { code: "be", name: "Belarusian" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "bho", name: "Bhojpuri (भोजपुरी)" },
  { code: "bs", name: "Bosnian" },
  { code: "bg", name: "Bulgarian" },
  { code: "ca", name: "Catalan" },
  { code: "ceb", name: "Cebuano" },
  { code: "ny", name: "Chichewa" },
  { code: "zh-CN", name: "Chinese Simplified (中文)" },
  { code: "zh-TW", name: "Chinese Traditional (繁體中文)" },
  { code: "co", name: "Corsican" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "dv", name: "Dhivehi" },
  { code: "doi", name: "Dogri" },
  { code: "nl", name: "Dutch" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian" },
  { code: "ee", name: "Ewe" },
  { code: "tl", name: "Filipino" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French (Français)" },
  { code: "fy", name: "Frisian" },
  { code: "gl", name: "Galician" },
  { code: "ka", name: "Georgian" },
  { code: "de", name: "German (Deutsch)" },
  { code: "el", name: "Greek" },
  { code: "gn", name: "Guarani" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "ht", name: "Haitian Creole" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian" },
  { code: "iw", name: "Hebrew" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "hmn", name: "Hmong" },
  { code: "hu", name: "Hungarian" },
  { code: "is", name: "Icelandic" },
  { code: "ig", name: "Igbo" },
  { code: "ilo", name: "Ilocano" },
  { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian (Italiano)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "jw", name: "Javanese" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "gom", name: "Konkani" },
  { code: "ko", name: "Korean (한국어)" },
  { code: "kri", name: "Krio" },
  { code: "ku", name: "Kurdish (Kurmanji)" },
  { code: "ckb", name: "Kurdish (Sorani)" },
  { code: "ky", name: "Kyrgyz" },
  { code: "lo", name: "Lao" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian" },
  { code: "ln", name: "Lingala" },
  { code: "lt", name: "Lithuanian" },
  { code: "lg", name: "Luganda" },
  { code: "lb", name: "Luxembourgish" },
  { code: "mk", name: "Macedonian" },
  { code: "mai", name: "Maithili" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "mt", name: "Maltese" },
  { code: "mi", name: "Maori" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "mni-Mtei", name: "Meiteilon (Manipuri)" },
  { code: "lus", name: "Mizo" },
  { code: "mn", name: "Mongolian" },
  { code: "my", name: "Myanmar (Burmese)" },
  { code: "ne", name: "Nepali (नेपाली)" },
  { code: "no", name: "Norwegian" },
  { code: "or", name: "Odia (Oriya)" },
  { code: "om", name: "Oromo" },
  { code: "ps", name: "Pashto" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "qu", name: "Quechua" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "sm", name: "Samoan" },
  { code: "sa", name: "Sanskrit" },
  { code: "gd", name: "Scots Gaelic" },
  { code: "nso", name: "Sepedi" },
  { code: "sr", name: "Serbian" },
  { code: "st", name: "Sesotho" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "so", name: "Somali" },
  { code: "es", name: "Spanish (Español)" },
  { code: "su", name: "Sundanese" },
  { code: "sw", name: "Swahili" },
  { code: "sv", name: "Swedish" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "th", name: "Thai" },
  { code: "ti", name: "Tigrinya" },
  { code: "ts", name: "Tsonga" },
  { code: "tr", name: "Turkish" },
  { code: "tk", name: "Turkmen" },
  { code: "ak", name: "Twi" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "ug", name: "Uyghur" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "cy", name: "Welsh" },
  { code: "xh", name: "Xhosa" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "zu", name: "Zulu" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLang, setSelectedLang] = useState(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    return match ? match[1] : "en";
  });

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (langCode) => {
    setSelectedLang(langCode);
    setIsOpen(false);
    setSearchTerm("");

    // Set Google Translate persistence cookies
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;

    const googleSelect = document.querySelector(".goog-te-combo");

    if (googleSelect) {
      googleSelect.value = langCode;

      googleSelect.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
      googleSelect.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );
    } else {
      console.log("Google translate not ready");

      setTimeout(() => {
        const retrySelect = document.querySelector(".goog-te-combo");

        if (retrySelect) {
          retrySelect.value = langCode;

          retrySelect.dispatchEvent(
            new Event("change", {
              bubbles: true,
            }),
          );
          retrySelect.dispatchEvent(
            new Event("input", {
              bubbles: true,
            }),
          );
        } else {
          window.location.reload();
        }
      }, 500);
    }
  };

  const selectedLangObject =
    LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="wm-lang-container notranslate" ref={dropdownRef}>
      <button
        type="button"
        className="wm-lang-btn notranslate"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <Translate className="wm-lang-icon" size={16} />
        <span className="wm-lang-current">{selectedLangObject.name}</span>
        <ChevronDown
          size={12}
          className="wm-lang-chevron"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div className="wm-lang-dropdown notranslate">
          {/* Search Input Header */}
          <div className="wm-lang-search-box">
            <Search size={14} className="wm-lang-search-icon" />
            <input
              type="text"
              className="wm-lang-search-input notranslate"
              placeholder="Search language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Scrollable Language List */}
          <div className="wm-lang-list">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`wm-lang-option ${
                    selectedLang === lang.code ? "wm-lang-option-active" : ""
                  }`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.name}
                </button>
              ))
            ) : (
              <div className="wm-lang-no-results">No language found</div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .wm-lang-container {
          position: relative;
          display: inline-block;
        }

        .wm-lang-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          padding: 0 12px;
          height: 38px;
          color: #ffffff;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .wm-lang-btn:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.12);
        }

        .wm-lang-icon {
          color: rgba(255, 255, 255, 0.85);
          flex-shrink: 0;
        }

        .wm-lang-current {
          max-width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wm-lang-chevron {
          color: rgba(255, 255, 255, 0.6);
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        /* Dropdown Box */
        .wm-lang-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          width: 230px;
          background: #0B1C2C;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
          z-index: 1000;
          overflow: hidden;
          animation: wmFadeIn 0.15s ease;
        }

        @keyframes wmFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Search Input */
        .wm-lang-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .wm-lang-search-icon {
          color: rgba(255, 255, 255, 0.5);
          flex-shrink: 0;
        }

        .wm-lang-search-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #ffffff;
          font-size: 13px;
          font-family: inherit;
        }

        .wm-lang-search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        /* Scrollable List */
        .wm-lang-list {
          max-height: 220px;
          overflow-y: auto;
          padding: 4px 0;
        }

        .wm-lang-list::-webkit-scrollbar {
          width: 5px;
        }
        .wm-lang-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .wm-lang-option {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 8px 14px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.12s ease, color 0.12s ease;
        }

        .wm-lang-option:hover {
          background: rgba(20, 184, 166, 0.15);
          color: #5EEAD4;
        }

        .wm-lang-option-active {
          background: rgba(20, 184, 166, 0.25);
          color: #5EEAD4;
          font-weight: 600;
        }

        .wm-lang-no-results {
          padding: 12px;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.45);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
