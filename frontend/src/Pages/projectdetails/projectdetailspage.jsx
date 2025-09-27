import React, { useState, useEffect } from "react";
import "./projectdetailspage.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import CauseCard from "../../components/recentcause/cause";
import CookiePopup from "../../components/message/message";
import Preloader from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";

const ProjectDetailsPage = () => {
  const { projectid } = useParams();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    Phonenumber: "",
    city: "",
    honor: "",
    amount: "",
  });
  const [setError] = useState("");
  const [ischecked, setCheck] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);
  const [preloading, setPreLoading] = useState(true);

  useEffect(() => {
    // Örnek: 2.5 sn sonra kapat
    const t = setTimeout(() => setPreLoading(false), 0);
    return () => clearTimeout(t);
  }, []);
  const handleAccept = () => {
    console.log("Cookies accepted!");
  };

  const handleManage = () => {
    console.log("Opening preferences...");
  };
  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(
        `http://kudushilali.org/backend/projects/projects_CRUD.php?id=${projectid}`,
        {
          params: {
            lang: i18n.language,
          },
        }
      );
      if (res.data.status === "success" && res.data.data.length > 0) {
        setProject(res.data.data[0]);
        fetchRelatedProjects(res.data.data[0].category);
      }
    } catch (err) {
      console.error("Proje detayı alınırken hata:", err);
    }
    setLoading(false);
  };

  const fetchRelatedProjects = async (category) => {
    try {
      const res = await axios.get(
        `http://kudushilali.org/backend/projects/projects_CRUD.php?category=${encodeURIComponent(
          category
        )}`,
        {
          params: {
            lang: i18n.language,
          },
        }
      );
      if (res.data.status === "success") {
        const filtered = res.data.data.filter(
          (p) => p.id !== parseInt(projectid)
        );
        setRelatedProjects(filtered.slice(0, 3)); // En fazla 3 proje göster
      }
    } catch (err) {
      console.error("İlgili projeler alınırken hata:", err);
    }
  };
  const openpopupmetod = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.Phonenumber ||
      !formData.city
    ) {
      alert("Lütfen tüm zorunlu alanları doldurun!");
      return; // Popup açılmasın
    }
    openPopup();
  };
  useEffect(() => {
    fetchProjectDetails();
  }, [projectid]);

  const handleAmountChange = (val) => {
    if (val > project?.goal - project?.raised) {
      setError(
        `Amount exceeds remaining goal of $${project.goal - project.raised}`
      );
      return;
    }
    if (val < 0) {
      setError("Amount cannot be negative");
      return;
    }
    setError("");
    setFormData({ ...formData, amount: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Donation submitted:", formData);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (!project) return <p className="text-center mt-5">Project not found.</p>;

  const remaining = project.goal - project.raised;
  const totalProgress = Math.min(
    100,
    Math.round(
      ((project.raised + Number(formData.amount || 0)) / project.goal) * 100
    )
  );

  return (
    <>
      <Preloader show={preloading} />
      <div
        className="project-details-container d-flex flex-column justify-content-center align-items-center mt-5"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        style={{ width: "90vw" }}
      >
        <CookiePopup
          show={showPopup}
          onClose={closePopup}
          onAccept={handleAccept}
          onManage={handleManage}
        />
        <div
          className="image-section mb-4 d-flex"
          style={{
            backgroundImage: `url(${project.image})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            borderRadius: "10px",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div className="title-section mb-2 fw-bold fs-4">{project.title}</div>

        <div className="desc-section mb-4 text-secondary">
          {project.explanation}
        </div>

        <div className="target-section mb-4 d-none flex-column w-100">
          <h4 className="fw-bold fs-5">{t("project_target")}</h4>
          <div className="target-value d-flex align-items-center justify-content-center my-2">
            <div
              className="circle-progress border border-danger rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{ width: "70px", height: "70px" }}
            >
              <div className="percentage fw-bold">{totalProgress}%</div>
            </div>
            <div className="d-flex flex-row align-items-end gap-4">
              <div className="d-flex flex-column">
                <p>{t("project_goal")}</p>
                <span>${project.goal}</span>
              </div>
              <p>-</p>
              <div className="d-flex flex-column">
                <p>{t("project_raised")}</p>
                <span>${project.raised}</span>
              </div>
              <p>-</p>
              <div className="d-flex flex-column">
                <p>{t("project_togo")}</p>
                <span>${remaining}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-section mb-4 d-flex flex-column w-100 mt-4">
          <h4 className="fw-bold fs-5">{t("project_join_efforts")}</h4>
          <h6 className="fw-bold">{t("project_join_intro")}</h6>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column w-100 mt-3"
          >
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("form_fullname")}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  placeholder={t("form_email")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("form_phone")}
                  value={formData.Phonenumber}
                  onChange={(e) =>
                    setFormData({ ...formData, Phonenumber: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("form_city")}
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-check mb-3 d-none">
              <input
                className="form-check-input"
                type="checkbox"
                id="dedicateCheck"
                onChange={() => setCheck(!ischecked)}
              />
              <label className="form-check-label" htmlFor="dedicateCheck">
                {t("form_dedicate")}
              </label>
              {ischecked && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder={t("form_dedicate_placeholder")}
                  value={formData.honor}
                  onChange={(e) =>
                    setFormData({ ...formData, honor: e.target.value })
                  }
                />
              )}
            </div>

            <input
              type="number"
              className="form-control mb-3 d-none"
              placeholder="$00.00"
              value={formData.amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              required
            />

            <button
              onClick={openpopupmetod}
              type="submit"
              className="btn btn-success"
            >
              {t("form_learn_more")}
            </button>
          </form>
        </div>

        <div className="mission-section mb-4 d-none">
          <h4 className="fw-bold fs-5">{t("project_mission_objective")}</h4>
          <p className="text-secondary">{project.mission}</p>
          <p className="text-secondary">{project.objective}</p>
        </div>

        <div className="more-section mb-4 ">
          <h4 className="fw-bold fs-5 text-center">
            {t("project_more_related")}
          </h4>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mt-3">
            {relatedProjects.map((cause) => (
              <CauseCard key={cause.id} value={cause} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
