import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getOrders } from "../../services/publicApi";

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getOrders().then((res) => {
      setDataSource(
        res.products.map((product) => ({ ...product, key: product.id }))
      );

      console.log(res);
      setLoading(false);
    });
  }, []);

  return (
    <Table
      loading={loading}
      columns={[
        { id: "id", title: "ID", dataIndex: "id" },
        { title: "Title", dataIndex: "title" },
        {
          title: "Price",
          dataIndex: "price",
          render: (value) => <span>$ {value}</span>,
        },
        {
          title: "DiscountedPrice",
          dataIndex: "discountedTotal",
          render: (value) => <span>$ {value}</span>,
        },
        { title: "Quantity", dataIndex: "quantity" },
        { title: "Total", dataIndex: "total" },
      ]}
      dataSource={dataSource}
      pagination={{ pageSize: 5 }} // show 5 records per page
      style={{ width: "100%" }}
    />
  );
}

export default Orders;
