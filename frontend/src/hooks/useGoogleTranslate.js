import { useEffect } from "react";

export function useGoogleTranslate() {
  useEffect(() => {
    if (!document.getElementById("google_translate_element")) {
      const div = document.createElement("div");
      div.id = "google_translate_element";
      div.style.display = "none";

      document.body.appendChild(div);
    }
  }, []);

  const changeLanguage = (langCode) => {
    const tryChange = () => {
      const combo = document.querySelector(".goog-te-combo");

      if (combo) {
        combo.value = langCode;

        combo.dispatchEvent(new Event("change", { bubbles: true }));

        return true;
      }

      return false;
    };

    if (!tryChange()) {
      let count = 0;

      const timer = setInterval(() => {
        count++;

        if (tryChange() || count > 20) {
          clearInterval(timer);
        }
      }, 200);
    }
  };

  return {
    changeLanguage,
  };
}
