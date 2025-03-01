import React, { useEffect, useState } from "react";
import { Avatar, Table } from "antd";
import { getCustomers } from "../../services/publicApi";

function Customers() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCustomers().then((res) => {
      // setDataSource(res.users);

      setDataSource(res.users.map((user) => ({ ...user, key: user.id })));
      setLoading(false);
    });
  }, []);

  return (
    <Table
      loading={loading}
      style={{ width: "100%" }}
      columns={[
        {
          title: "Photo",
          dataIndex: "image",
          render: (link) => <Avatar src={link} />,
        },
        {
          title: "First Name",
          dataIndex: "firstName",
        },
        {
          title: "Last Name",
          dataIndex: "lastName",
        },
        {
          title: "Email",
          dataIndex: "email",
        },
        {
          title: "Phone",
          dataIndex: "phone",
        },
        {
          title: "Address",
          dataIndex: "address",
          render: (address) => (
            <span>
              {address.address}, {address.city}
            </span>
          ),
        },
      ]}
      dataSource={dataSource}
      pagination={{ pageSize: 5 }} // Display 5 records per page
    />
  );
}

export default Customers;
