import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme.css";
import { Link, useNavigate } from "react-router-dom";

const Signuppage = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !email || !password) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8888/kudus_hilali/kudus-hilali-site/backend/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Sunucuya bağlanırken bir hata oluştu.");
    }
  };

  return (
    <section className="lsf-section bg-home d-flex align-items-center position-relative w-100">
      <div className="bg-overlay"></div>
      <div className="container-signup">
        <div className="row">
          <div className="col-12">
            <div className="card form-signin border-0 p-4 rounded shadow">
              <form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <Link to="/" className="text-primary h4 text-uppercase">
                    Kudus Hilali
                  </Link>
                </div>
                <h5 className="card-title">Register your account</h5>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingFirstName"
                    placeholder="Harry"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label htmlFor="floatingFirstName">First Name</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="floatingEmail">Email Address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Register
                </button>

                <div className="col-12 text-center mt-3">
                  <p className="mb-0 mt-3">
                    <span className="text-dark me-2">
                      Already have an account ?
                    </span>
                    <Link to="/login" className="text-dark fw-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signuppage;