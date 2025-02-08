import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { getUserToken } from "../services/api";
import "../styles/Login.css";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState(""); // Add state for password
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Add state for success message
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await getUserToken(emailOrPhone);
      const isEmail = emailOrPhone.includes("@");
      const dataObject = isEmail
        ? { email: emailOrPhone }
        : { phoneNumber: emailOrPhone };
      const response = await axios.post(
        "http://localhost:3000/user/login",
        {
          ...dataObject, // Include email or phoneNumber in the request
          password, // Include password in the request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adding the authorization header
          },
        }
      );
      // Assuming the response contains a token
      setSuccess(response.data.message); // Set success message
      if (response.status === 200 && response.statusText === "OK") {
        setTimeout(() => {
          history.push({
            pathname: "/dashboard",
            state: { token }, // Pass token as state
          });
        }, 2000); // Redirect to UserList page after 2 seconds
      } else {
        setError(
          "Invalid credentials or something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("User not registered. Redirecting to sign-up page...");
      setTimeout(() => {
        history.push("/signup");
      }, 3000); // Redirect to sign-up page after 3 seconds
    }
  };

  return (
    <div className="login-container">
      <h1>Login to Your Account</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}{" "}
      {/* Display success message */}
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
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
