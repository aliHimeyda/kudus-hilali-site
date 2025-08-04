import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme.css";
import { Link } from "react-router-dom";
const Forgotpassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Burada e-posta doğrulama işlemi yapılabilir
    setStep("code");
  };

  const handleCodeSubmit = () => {
    // Burada kod doğrulama yapılabilir
    setStep("reset");
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Şifre sıfırlama işlemi burada yapılır (API çağrısı vs.)
    alert("Password reset successful!");
  };

  return (
    <section
      className="bg-home d-flex align-items-center position-relative w-100"
      style={{
        background: "url('/assets/heroimage.webp') center",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card form-signin border-0 p-4 rounded shadow">
              <form
                onSubmit={
                  step === "reset" ? handleResetSubmit : handleEmailSubmit
                }
              >
                <div className="text-center mb-4">
                  <Link to="/" className="text-primary h4 text-uppercase">
                    Kudus Hilali
                  </Link>
                </div>

                {step === "email" && (
                  <>
                    <h5 className="card-title">Reset your password</h5>
                    <p className="text-muted">
                      Please enter your email address. You will receive a link
                      to create a new password via email.
                    </p>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <button className="btn btn-primary w-100" type="submit">
                      Send
                    </button>
                  </>
                )}

                {step === "code" && (
                  <>
                    <h5 className="card-title">Enter verification code</h5>
                    <p className="text-muted">
                      We’ve sent a 4-digit code to your email address.
                    </p>
                    <div
                      className="d-flex justify-content-between mb-3"
                      style={{ gap: "10px" }}
                    >
                      {code.map((value, index) => (
                        <input
                          key={index}
                          type="text"
                          className="form-control text-center"
                          maxLength={1}
                          style={{ width: "60px", fontSize: "24px" }}
                          value={value}
                          onChange={(e) =>
                            handleCodeChange(index, e.target.value)
                          }
                        />
                      ))}
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      type="button"
                      onClick={handleCodeSubmit}
                    >
                      Submit Code
                    </button>
                  </>
                )}

                {step === "reset" && (
                  <>
                    <h5 className="card-title">Create new password</h5>
                    <p className="text-muted">
                      Enter and confirm your new password.
                    </p>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="newPassword">New Password</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    <button className="btn btn-primary w-100" type="submit">
                      Reset Password
                    </button>
                  </>
                )}

                <div className="col-12 text-center mt-3">
                  <p className="mb-0 mt-3">
                    <span className="text-dark me-2">
                      Remember your password ?
                    </span>
                    <a
                      href="auth-bs-login.html"
                      className="text-dark fw-semibold"
                    >
                      Sign in
                    </a>
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
export default Forgotpassword;
