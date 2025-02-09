import React, { useState } from "react";
import { signUpUser, getDefaultToken } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "../styles/SignUp.css";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { token } = await getDefaultToken();
      await signUpUser(
        {
          username: userName,
          email,
          phoneNumber: phone,
          newPassword: password,
          reEnterPassword,
        },
        // Add token as the second argument
        // "token" is the token you get from the getUserToken function
        token
      );
      alert("Sign-up successful! Please log in.");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error signing up:", error?.response?.data?.message);
      const errMessage = error?.response?.data?.message
        ? error?.response?.data?.message
        : error?.response?.data?.error;

      setError(errMessage);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-icon"
          />
        </div>
        <div className="password-container">
          <input
            type={showReEnterPassword ? "text" : "password"}
            placeholder="Re-enter Password"
            value={reEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showReEnterPassword ? faEyeSlash : faEye}
            onClick={() => setShowReEnterPassword(!showReEnterPassword)}
            className="password-toggle-icon"
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account ? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
