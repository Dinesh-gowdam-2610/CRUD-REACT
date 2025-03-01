import React, { useEffect, useState } from "react";
import { BellFilled, MailOutlined } from "@ant-design/icons";
import {
  Badge,
  Drawer,
  Image,
  List,
  Space,
  Typography,
  Avatar,
  Dropdown,
  Menu,
  Spin,
  Row,
  Col,
} from "antd";
import { useHistory } from "react-router-dom";
import { getComments, getOrders } from "../../services/publicApi";
import "../../styles/appHeader.css"; // External CSS for additional styling

function AppHeader() {
  const [comments, setComments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const commentsRes = await getComments();
      const ordersRes = await getOrders();
      setComments(commentsRes.comments);
      setOrders(ordersRes.products);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleProfileClick = () => {
    history.push("/profile");
  };

  const handleLogoutClick = () => {
    history.push("/login");
  };

  const avatarMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfileClick}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogoutClick}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="app-header">
      <Row align="middle" justify="space-between">
        {/* Left side: Dashboard Title */}
        <Col>
          <Typography.Title level={4} className="header-title">
            My Dashboard
          </Typography.Title>
        </Col>
        {/* Right side: Image and Icons */}
        <Col>
          <Space className="header-actions" size="middle">
            <Image width={40} />
            <Badge count={comments.length} dot>
              <MailOutlined
                className="header-icon"
                style={{ fontSize: 24 }}
                onClick={() => setCommentsOpen(true)}
              />
            </Badge>
            <Badge count={orders.length}>
              <BellFilled
                className="header-icon"
                style={{ fontSize: 24 }}
                onClick={() => setNotificationsOpen(true)}
              />
            </Badge>
            <Dropdown overlay={avatarMenu} trigger={["click"]}>
              <Avatar
                className="header-avatar"
                style={{ cursor: "pointer" }}
                src="https://www.gravatar.com/avatar/?d=mp"
                alt="User Avatar"
              />
            </Dropdown>
          </Space>
        </Col>
      </Row>
      {/* Comments Drawer */}
      <Drawer
        title="Comments"
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        maskClosable
      >
        {loading ? (
          <Spin>
            <div style={{ height: "100px" }} />
          </Spin>
        ) : (
          <List
            dataSource={comments}
            renderItem={(item) => <List.Item>{item.body}</List.Item>}
          />
        )}
      </Drawer>
      {/* Notifications Drawer */}
      <Drawer
        title="Notifications"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        maskClosable
      >
        {loading ? (
          <Spin>
            <div style={{ height: "100px" }} />
          </Spin>
        ) : (
          <List
            dataSource={orders}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.title}</Typography.Text> has been
                ordered!
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </header>
  );
}

export default AppHeader;
