import { Route, Switch, Router } from "react-router-dom";
// import Customers from "../../Pages/Customers";
import Dashboard from "../../pages/Dashboard";
import Orders from "../../pages/Orders";

import Inventory from "../../pages/inventory";

function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/orders" component={Orders} />
        {/* <Route path="/customers" element={<Customers />}></Route> */}
      </Switch>
    </Router>
  );
}
export default AppRoutes;
