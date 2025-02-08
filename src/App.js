// filepath: /c:/Dinesh/Vscode/REACT-NODE-SIGNUP-CRUD/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserList from "./components/UserList"; // Example component

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={UserList} /> {/* Example route */}
        <Route path="/" component={Login} /> {/* Default route */}
      </Switch>
    </Router>
  );
};

export default App;
