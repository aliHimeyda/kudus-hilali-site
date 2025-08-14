import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./projectdetailspage.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import CauseCard from "../../components/recentcause/cause";
import CookiePopup from "../../components/message/message";

const ProjectDetailsPage = () => {
  const { projectid } = useParams();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    Phonenumber: "",
    city: "",
    honor: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [ischecked, setCheck] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const handleAccept = () => {
    console.log("Cookies accepted!");
  };

  const handleManage = () => {
    console.log("Opening preferences...");
  };
  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(
        `http://mediumslateblue-pony-639793.hostingersite.com/backend/projects/projects_CRUD.php?id=${projectid}`
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
        `http://mediumslateblue-pony-639793.hostingersite.com/backend/projects/projects_CRUD.php?category=${category}`
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

  const handleCustomFocus = () => {
    setFormData({ ...formData, amount: "" });
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
    <div
      className="project-details-container d-flex flex-column justify-content-center mt-5"
      style={{ width: "90vw" }}
    >
      <CookiePopup
        show={showPopup}
        onClose={closePopup}
        onAccept={handleAccept}
        onManage={handleManage}
      />
      <div
        className="image-section mb-4 d-flex w-100"
        style={{
          backgroundImage: `url(${project.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          borderRadius: "10px",
        }}
      ></div>

      <div className="title-section mb-2 fw-bold fs-4">{project.title}</div>

      <div
        className="desc-section mb-4 text-secondary"
        style={{ fontSize: "14px" }}
      >
        {project.explanation}
      </div>

      <div className="target-section mb-4 d-flex flex-column w-100">
        <h4 className="fw-bold fs-5">Target</h4>
        <div className="target-value d-flex align-items-center justify-content-center my-2">
          <div
            className="circle-progress border border-danger rounded-circle me-3 d-flex align-items-center justify-content-center"
            style={{ width: "70px", height: "70px" }}
          >
            <div className="percentage fw-bold">{totalProgress}%</div>
          </div>
          <div className="d-flex flex-row align-items-end gap-4">
            <div className="d-flex flex-column">
              <p>Goal:</p>
              <span>${project.goal}</span>
            </div>
            <p>-</p>
            <div className="d-flex flex-column">
              <p>Raised:</p>
              <span>${project.raised}</span>
            </div>
            <p>-</p>
            <div className="d-flex flex-column">
              <p>To Go:</p>
              <span>${remaining}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-section mb-4 d-flex flex-column w-100 mt-4">
        <h4 className="fw-bold fs-5">Donate Now</h4>
        <form onSubmit={handleSubmit} className="d-flex flex-column w-100 mt-3">
          <div className="row g-2 mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
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
                placeholder="Email"
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
                placeholder="Phone"
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
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="dedicateCheck"
              onChange={() => setCheck(!ischecked)}
            />
            <label className="form-check-label" htmlFor="dedicateCheck">
              Dedicate my donation in honor or in memory of someone
            </label>
            {ischecked && (
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Type Honor or Someone's Name"
                value={formData.honor}
                onChange={(e) =>
                  setFormData({ ...formData, honor: e.target.value })
                }
              />
            )}
          </div>

          <input
            type="number"
            className="form-control mb-3"
            placeholder="$00.00"
            value={formData.amount}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            required
          />

          {error && <div className="text-danger mb-2">{error}</div>}

          <button onClick={openPopup} type="submit" className="btn btn-success">
            Donate Now
          </button>
        </form>
      </div>

      <div className="mission-section mb-4">
        <h4 className="fw-bold fs-5">Our Mission & Objective</h4>
        <p className="text-secondary">{project.mission}</p>
        <p className="text-secondary">{project.objective}</p>
      </div>

      <div className="more-section mb-4">
        <h4 className="fw-bold fs-5">More Related Projects</h4>
        <div className="d-flex flex-wrap gap-4 mt-3">
          {relatedProjects.map((cause) => (
            <CauseCard key={cause.id} value={cause} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
