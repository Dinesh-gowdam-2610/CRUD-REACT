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
} from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getComments, getOrders } from "../../services/publicApi";

function AppHeader() {
  const [comments, setComments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    getComments().then((res) => {
      setComments(res.comments);
    });
    getOrders().then((res) => {
      setOrders(res.products);
    });
  }, []);

  const handleProfileClick = () => {
    // Navigate to the profile page
    history.push("/profile");
  };

  const handleLogoutClick = () => {
    // Redirect to login page on logout
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
    <div className="AppHeader">
      <Image
        width={40}
        // src="https://yt3.ggpht.com/ytc/AMLnZu83ghQ28n1SqADR-RbI2BGYTrqqThAtJbfv9jcq=s176-c-k-c0x00ffffff-no-rj"
      />
      <Typography.Title>Kibana Dashboard</Typography.Title>
      <Space>
        <Badge count={comments.length} dot>
          <MailOutlined
            style={{ fontSize: 24 }}
            onClick={() => setCommentsOpen(true)}
          />
        </Badge>
        <Badge count={orders.length}>
          <BellFilled
            style={{ fontSize: 24 }}
            onClick={() => setNotificationsOpen(true)}
          />
        </Badge>
        <Dropdown overlay={avatarMenu} trigger={["click"]}>
          <Avatar
            style={{ cursor: "pointer" }}
            src="https://www.gravatar.com/avatar/?d=mp"
            alt="User Avatar"
          />
        </Dropdown>
      </Space>
      <Drawer
        title="Comments"
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        maskClosable
      >
        <List
          dataSource={comments}
          renderItem={(item) => <List.Item>{item.body}</List.Item>}
        />
      </Drawer>
      <Drawer
        title="Notifications"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        maskClosable
      >
        <List
          dataSource={orders}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text strong>{item.title}</Typography.Text> has been
              ordered!
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}

export default AppHeader;
