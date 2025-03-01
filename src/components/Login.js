import React, { useState } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { getUserToken } from "../services/api";
import { Spin } from "antd";
import "../styles/Login.css";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await getUserToken(emailOrPhone);
      const isEmail = emailOrPhone.includes("@");
      const dataObject = isEmail
        ? { email: emailOrPhone }
        : { phoneNumber: emailOrPhone };
      const response = await axios.post(
        "http://localhost:3000/user/login",
        {
          ...dataObject,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      if (response.status === 200 && response.statusText === "OK") {
        localStorage.setItem("token", token); // Store token in localStorage
        setTimeout(() => {
          setLoading(false);
          history.push({
            pathname: "/dashboard",
            state: { token },
          });
        }, 2000);
      } else {
        setError(
          "Invalid credentials or something went wrong. Please try again."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("User not registered. Redirecting to sign-up page...");
      setLoading(false);
      setTimeout(() => {
        history.push("/signup");
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <h1>Login to Your Account</h1>
      {location.state?.message && (
        <div className="error-message">{location.state.message}</div>
      )}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading ? (
        <Spin tip="Logging in..." className="custom-spin" />
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;