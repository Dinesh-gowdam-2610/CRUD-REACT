import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { Spin } from "antd";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import Inventory from "./pages/inventory";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customers";
import Orders from "./pages/Orders";
import SideMenu from "./components/Sidemenu";
import "./styles/index.css";
import "./styles/App.css"; // Importing CSS file for global styles

const AppRoutes = () => {
  const location = useLocation();
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  // Show loading spinner when switching between auth routes.
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // When the route changes, set loading true and simulate a delay.
    setAuthLoading(true);
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isAuthRoute) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {authLoading ? (
          <Spin size="large" />
        ) : (
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
          </Switch>
        )}
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu />
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/orders" component={Orders} />
          <Route path="/customers" component={Customer} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </div>
      <AppFooter />
    </>
  );
};

const App = () => {
  return (
    <div className="App">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

export default App;
