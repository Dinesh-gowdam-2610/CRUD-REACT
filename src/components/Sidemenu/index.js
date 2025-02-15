// filepath: /c:/Dinesh/Vscode/REACT-NODE-SIGNUP-CRUD/src/components/Sidemenu/index.js
import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const history = useHistory();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          history.push(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Dashboard",
            icon: <AppstoreOutlined />,
            key: "/dashboard",
          },
          {
            label: "inventory",
            key: "/inventory",
            icon: <ShopOutlined />,
          },
          {
            label: "Orders",
            key: "/orders",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Customers",
            key: "/customers",
            icon: <UserOutlined />,
          },
        ]}
      ></Menu>
    </div>
  );
}

export default SideMenu;
