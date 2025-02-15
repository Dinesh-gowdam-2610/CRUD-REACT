import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Card,
  Space,
  Statistic,
  Table,
  Typography,
  Row,
  Col,
  Spin,
  Layout,
  Button,
  Modal,
  Form,
  Input,
  message,
  ConfigProvider,
} from "antd";
import { getAllUsers, updateUsers, deleteUser } from "../../services/api";
import {
  getCustomers,
  getInventory,
  getOrders,
  getRevenue,
} from "../../services/publicApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../../styles/index.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Custom scrollbar styles injected via a <style> tag
const scrollbarStyles = `
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .ant-table-body {
    scrollbar-width: thin;
  }
`;

const { Content } = Layout;

// DashboardCard component
const DashboardCard = ({ title, value, icon }) => (
  <Card>
    <Space direction="horizontal">
      {icon}
      <Statistic title={title} value={value} />
    </Space>
  </Card>
);

// RecentOrders component
const RecentOrders = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrders().then((res) => {
      // Use slice to avoid mutating the response array
      setDataSource(res.products.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Typography.Text style={{ display: "flex", justifyContent: "center" }}>
        Recent Orders
      </Typography.Text>
      <Table
        columns={[
          { title: "Title", dataIndex: "title" },
          { title: "Quantity", dataIndex: "quantity" },
          { title: "Price", dataIndex: "discountedPrice" },
        ]}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
      />
    </>
  );
};

// DashboardChart component
const DashboardChart = () => {
  const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevenue().then((res) => {
      if (res && res.carts) {
        const labels = res.carts.map((cart) => `User-${cart.userId}`);
        const data = res.carts.map((cart) => cart.discountedTotal);
        setRevenueData({
          labels,
          datasets: [
            {
              label: "Revenue",
              data: data,
              backgroundColor: "rgba(255, 0, 0, 1)",
            },
          ],
        });
      }
      setLoading(false);
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 16 } } },
      title: { display: true, text: "Order Revenue" },
    },
  };

  return (
    <Card style={{ width: "100%", minHeight: "400px" }}>
      {loading ? (
        <Spin tip="Loading Chart..." />
      ) : (
        <div style={{ position: "relative", width: "100%", height: "400px" }}>
          <Bar options={options} data={revenueData} />
        </div>
      )}
    </Card>
  );
};

// UserList component
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
        // Set a timeout to simulate session expiry if needed
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
            style={{ borderColor: "#ff4d4f", width: 80 }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Typography.Text style={{ display: "flex", justifyContent: "center" }}>
        User List
      </Typography.Text>
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
              <Table
                dataSource={users}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: "No record found" }}
              />
            </Col>
          </Row>
        )}
      </Content>
      <Modal
        title="Edit User"
        open={isEditModalVisible}
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
    </>
  );
};

// DashboardPage wraps the Dashboard in a scrolling layout with custom scrollbar styles.
const DashboardPage = () => (
  <ConfigProvider
    theme={{
      components: {
        Layout: {
          bodyBg: "#fff",
        },
      },
    }}
  >
    <style>{scrollbarStyles}</style>
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Layout>
        <Content
          style={{
            padding: "24px",
            margin: 0,
            overflowY: "auto",
            height: "100vh",
            position: "relative",
          }}
        >
          <Content style={{ padding: "20px", overflowY: "auto" }}>
            <Space size={20} direction="vertical" style={{ width: "100%" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <DashboardCard
                    icon={
                      <ShoppingCartOutlined
                        style={{
                          color: "green",
                          backgroundColor: "rgba(0,255,0,0.25)",
                          borderRadius: 20,
                          fontSize: 24,
                          padding: 8,
                        }}
                      />
                    }
                    title={"Orders"}
                    value={getOrders()?.total || 0}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <DashboardCard
                    icon={
                      <ShoppingOutlined
                        style={{
                          color: "blue",
                          backgroundColor: "rgba(0,0,255,0.25)",
                          borderRadius: 20,
                          fontSize: 24,
                          padding: 8,
                        }}
                      />
                    }
                    title={"Inventory"}
                    value={getInventory()?.total || 0}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <DashboardCard
                    icon={
                      <UserOutlined
                        style={{
                          color: "purple",
                          backgroundColor: "rgba(0,255,255,0.25)",
                          borderRadius: 20,
                          fontSize: 24,
                          padding: 8,
                        }}
                      />
                    }
                    title={"Customer"}
                    value={getCustomers()?.total || 0}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <DashboardCard
                    icon={
                      <DollarCircleOutlined
                        style={{
                          color: "red",
                          backgroundColor: "rgba(255,0,0,0.25)",
                          borderRadius: 20,
                          fontSize: 24,
                          padding: 8,
                        }}
                      />
                    }
                    title={"Revenue"}
                    value={getOrders()?.discountedTotal || 0}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <DashboardChart />
                </Col>
                <Col xs={24} lg={12}>
                  <RecentOrders />
                </Col>
                <Col xs={24} lg={12}>
                  <UserList />
                </Col>
              </Row>
            </Space>
          </Content>
        </Content>
      </Layout>
    </Layout>
  </ConfigProvider>
);

export default DashboardPage;
