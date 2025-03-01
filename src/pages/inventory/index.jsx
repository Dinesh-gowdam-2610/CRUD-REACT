import React, { useEffect, useState } from "react";
import { Avatar, Rate, Table } from "antd";
import { getInventory } from "../../services/publicApi";

function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getInventory().then((res) => {
      setDataSource(
        res.products.map((product) => ({ ...product, key: product.id }))
      );
      setLoading(false);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Full viewport height
        overflow: "hidden",
      }}
    >
      <Table
        loading={loading}
        style={{ width: "100%" }}
        columns={[
          {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            render: (link) => <Avatar src={link} />,
          },
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => <span>${value}</span>,
          },
          {
            title: "Rating",
            dataIndex: "rating",
            render: (rating) => <Rate value={rating} allowHalf disabled />,
          },
          {
            title: "Stock",
            dataIndex: "stock",
          },
          {
            title: "Brand",
            dataIndex: "brand",
          },
          {
            title: "Category",
            dataIndex: "category",
          },
        ]}
        dataSource={dataSource}
        pagination={{ pageSize: 9 }} // Display 8 records per page
        scroll={{ y: "calc(100vh - 250px)" }}
      />
    </div>
  );
}

export default Inventory;
