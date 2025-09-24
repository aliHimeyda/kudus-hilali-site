import React, { useEffect, useRef, useState } from "react";
import i18n from "i18next"; 
import "./language-switcher.css";

const LANGS = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [curr, setCurr] = useState(i18n.language?.split("-")[0] || "en");
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Sayfanın yönünü dile göre güncelle
  // useEffect(() => {
  //   const dir = i18n.dir(curr);
  //   document.documentElement.setAttribute("dir", dir);
  //   document.documentElement.lang = curr;
  // }, [curr]);

  // i18n dil değiştiğinde local state’i senkronla (başka yerden değişirse)
 useEffect(() => {
  const handler = () => {
    window.location.reload();
  };

  i18n.on("languageChanged", handler);

  return () => {
    i18n.off("languageChanged", handler);
  };
}, []);


  

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentLang = LANGS.find((l) => l.code === curr) || LANGS[1];

  const toggle = () => setOpen((o) => !o);

  const changeLanguage = async (code) => {
    await i18n.changeLanguage(code);
    setCurr(code);
    setOpen(false);
  };

  // Klavye ile menüde gezinme
  const onMenuKeyDown = (e) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll('[role="menuitemradio"]') || []
    );
    const idx = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = items[(idx + 1) % items.length] || items[0];
      next.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length] || items[0];
      prev.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  return (
    <div className="lang-switcher">
      <button
        ref={btnRef}
        className="lang-btn"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="lang-menu"
        title="Change language"
      >
        <span className="lang-code">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`chevron ${open ? "rotated" : ""}`}
          viewBox="0 0 20 20"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path d="M5.5 7.5l4.5 4 4.5-4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div
          id="lang-menu"
          className="lang-menu"
          role="menu"
          aria-label="Select language"
          ref={menuRef}
          onKeyDown={onMenuKeyDown}
        >
          {LANGS.map((l, i) => {
            const selected = l.code === curr;
            return (
              <button
                key={l.code}
                role="menuitemradio"
                aria-checked={selected}
                className={`lang-item ${selected ? "selected" : ""}`}
                onClick={() => changeLanguage(l.code)}
                tabIndex={0}
              >
                <span className="bullet" aria-hidden="true" />
                <span className="label">{l.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
