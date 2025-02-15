import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getAllUsers, updateUsers, deleteUser } from "../services/api";
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../styles/UserList.css";

const { Header, Content } = Layout;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const token = location.state?.token || localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setError("No token found. Please log in.");
          history.push("/login");
          return;
        }
        const data = await getAllUsers(token);
        setUsers(data);
        setDataLoaded(true);
        const timeoutId = setTimeout(() => {
          setError("Session expired. Please log in again.");
          history.push("/login");
        }, 3000000);
        return () => clearTimeout(timeoutId);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, [token, history]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      await updateUsers(
        {
          userId: selectedUser._id,
          username: values.username,
          email: values.email,
          phoneNumber: values.phoneNumber,
        },
        token
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, ...values } : user
        )
      );
      message.success("User updated successfully");
      setIsEditModalVisible(false);
      setSelectedUser(null);
      form.resetFields();
    } catch (err) {
      console.error("Error updating user:", err);
      message.error("Failed to update user. Please try again later.");
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleDeleteClick = (user) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteUser(user, token);
          setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
          message.success("User deleted successfully");
        } catch (err) {
          console.error("Error deleting user:", err);
          message.error("Failed to delete user. Please try again later.");
        }
      },
    });
  };

  const handleLoginRedirect = () => {
    history.push("/login");
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
            style={{ width: 80 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record)}
            style={{
              borderColor: "#ff4d4f",
              width: 80,
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Header
        style={{
          color: "#fff",
          fontSize: "1.5rem",
          textAlign: "center",
          height: "64px",
          lineHeight: "64px",
        }}
      >
        User Dashboard
      </Header>
      <Content className={`dashboard-content ${dataLoaded ? "fade-in" : ""}`}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!dataLoaded ? (
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            <Spin size="large" />
            <p>Loading data...</p>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="User List">
                <Table
                  dataSource={users}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  locale={{ emptyText: "No record found" }}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Content>
      {/* Edit Modal */}
      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Save"
      >
        <Spin spinning={!dataLoaded}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter a username" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter an email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please enter a phone number" },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Layout>
  );
};

export default UserList;
