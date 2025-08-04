import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme.css";
import { Link } from "react-router-dom";
const Signuppage = () => {
  return (
    <section className="lsf-section bg-home d-flex align-items-center position-relative w-100">
      <div className="bg-overlay"></div>
      <div className="container-signup">
        <div className="row">
          <div className="col-12">
            <div className="card form-signin border-0 p-4 rounded shadow">
              <form>
                <div className="text-center mb-4">
                  <Link to="/" className="text-primary h4 text-uppercase">
                    Kudus Hilali
                  </Link>
                </div>
                <h5 className="card-title">Register your account</h5>

                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Harry"
                  />
                  <label htmlFor="floatingInput">First Name</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="floatingEmail">Email Address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    I Accept{" "}
                    <a href="#" className="text-primary">
                      Terms And Condition
                    </a>
                  </label>
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
