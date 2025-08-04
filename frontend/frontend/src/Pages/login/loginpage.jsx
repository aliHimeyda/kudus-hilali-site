import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme.css";
import { Link } from "react-router-dom";
const Loginpage = () => {
  return (
    <section
      className="lsf-section bg-home d-flex align-items-center position-relative w-100"
      
    >
      <div className="bg-overlay"></div>
      <div className="container-login">
        <div className="row">
          <div className="col-12">
            <div className="card form-signin border-0 p-4 rounded shadow">
              <form>
                <div className="text-center mb-4">
                  <Link href="/" className="text-primary h4 text-uppercase">
                    Kudus Hilali
                  </Link>
                </div>
                <h5 className="card-title">Please sign in</h5>

                <div className="form-floating mb-2">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                  />
                  <label htmlFor="floatingInput">Email address</label>
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

                <div className="d-flex justify-content-between">
                  <div className="mb-3">
                    <div className="form-check">
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
                        Remember me
                      </label>
                    </div>
                  </div>
                  <p className="forgot-pass mb-0 mx-2">
                    <Link to="/forgotpage" className="text-dark fw-semibold">
                      Forgot password ?
                    </Link>
                  </p>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Sign in
                </button>

                <div className="col-12 text-center mt-3">
                  <p className="mb-0 mt-3">
                    <span className="text-dark me-2">
                      Don't have an account ?
                    </span>
                    <Link to="/signup" className="text-dark fw-semibold">
                      Sign Up
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
export default Loginpage;
