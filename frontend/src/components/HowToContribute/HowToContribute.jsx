import React, { useEffect, useRef, useState } from "react";
import "./HowToContribute.css";
import Bottomline from "../bottomline/bottomline";
import Morebtn from "../btns/morebtn";
import { useTranslation } from "react-i18next";

const HowToContribute = () => {
  const [visible, setVisible] = useState(false);
  const contributeRef = useRef(null);
  const { t, i18n } = useTranslation();

  const isAr = i18n.language?.startsWith("ar"); // <-- dil kontrolü

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (contributeRef.current) observer.observe(contributeRef.current);
    return () => { if (contributeRef.current) observer.unobserve(contributeRef.current); };
  }, []);

  return (
    <>
      <div
        ref={contributeRef}
        className={`d-flex flex-column justify-content-center align-items-center mt-5 pt-5 animate-section ${
          visible ? "fade-in-up" : ""
        }`}
      >
        <h4 className="h4">{t("contribute_do_something")}</h4>
        <h2 className="h2">{t("contribute_how")}</h2>

        <div className="contribute-container">
          {/* Sol görseller */}
          {/* Sol Görseller */}
          <div className="imagesection">
            <div className="playiconshadow">
              <div className="play-icon">
                <img
                  decoding="async"
                  loading="lazy"
                  src="/assets/playVector.svg"
                  alt={t("contribute_play_alt")}
                />
              </div>
            </div>
            <img
              decoding="async"
              loading="lazy"
              src="/assets/4000.webp"
              alt={t("contribute_scene_alt")}
              className="img-top"
            />
            <div className="img-boxed">
              <img
                decoding="async"
                loading="lazy"
                src="/assets/200.webp"
                alt={t("contribute_helping_alt")}
                className="img-bottom"
              />
            </div>

            <div className="small-rect" />
            <div className="faded-square" />
          </div>

          {/* Sağ içerik */}
          {/* not: content-section üzerinde hizalama sınıfı bırakmadim ki
              tek tek metinleri kontrol edelim */}
          <div className="content-section">
            <h3
              className={`headline ${isAr ? "rtl-text text-end" : ""}`}
              dir={isAr ? "rtl" : "ltr"}
            >
              {t("contribute_headline")} <span>{t("contribute_headline_span")}</span>
            </h3>

            <p className={`desc ${isAr ? "rtl-text text-end" : ""}`} dir={isAr ? "rtl" : "ltr"}>
              {t("contribute_desc1")}
            </p>
            <p className={`desc ${isAr ? "rtl-text text-end" : ""}`} dir={isAr ? "rtl" : "ltr"}>
              {t("contribute_desc2")}
            </p>

            <p className={`icon-title ${isAr ? "rtl-text text-end" : ""}`} dir={isAr ? "rtl" : "ltr"}>
              {t("contribute_ways")}
            </p>
            <br />

            <div className="donationcontainer d-flex justify-content-center align-items-center gap-4">
  {/* Kart 1 */}
  <div className="icon-card d-flex flex-row gap-2">
    <div className="icon-bg" />
    {/* SATIR: Arapça ise ikon-sağda/metin-solda için row'u ters çevir */}
    <div className={`d-flex align-items-center gap-4 ${isAr ? "flex-row-reverse" : "flex-row"}`}>
      <div className="image-container">
        <img
          decoding="async"
          loading="lazy"
          src="/assets/DonationVector.webp"
          alt={t("contribute_donation_alt")}
          className="icon-img"
        />
      </div>

      {/* METİN BLOĞU: RTL + sağa hizalı */}
      <div className={isAr ? "rtl-text text-end" : ""} dir={isAr ? "rtl" : "ltr"}>
        <p className="icon-title">{t("contribute_contact_title")}</p>
        <p className="icon-text">{t("contribute_contact_text")}</p>
      </div>
    </div>
  </div>

  {/* Kart 2 */}
  <div className="icon-card d-flex flex-row gap-2">
    <div className="icon-bg" />
    <div className={`d-flex align-items-center gap-4 ${isAr ? "flex-row-reverse" : "flex-row"}`}>
      <div className="image-container">
        <img
          decoding="async"
          loading="lazy"
          src="/assets/Volunteerector.webp"
          alt={t("contribute_volunteer_alt")}
          className="icon-img"
        />
      </div>

      <div className={isAr ? "rtl-text text-end" : ""} dir={isAr ? "rtl" : "ltr"}>
        <p className="icon-title">{t("contribute_spread_title")}</p>
        <p className="icon-text">{t("contribute_spread_text")}</p>
      </div>
    </div>
  </div>
</div>


            <Morebtn title={t("contribute_find_more")} path={"/Projects"} />
          </div>
        </div>
      </div>
      <Bottomline />
    </>
  );
};

export default HowToContribute;
