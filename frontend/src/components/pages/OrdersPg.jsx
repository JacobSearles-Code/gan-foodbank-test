import { useState, useEffect } from "react";
import api from "../../api.js";

import OrdersCard from "../pageFeatures/OrdersCard.jsx";

const OrdersPg = () => {
  const [orders, setOrders] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [currentOrderGroup, setCurrentOrderGroup] = useState([]);
  const [dbResponse, setDbResponse] = useState("");

  //
  // Load all orders
  //
  const handleOrdersDB = async () => {
    try {
      const response = await api.get("/orders");

      setOrders(response.data);

      // Automatically select the first order
      if (response.data.length > 0) {
        const firstOrder = response.data[0];

        setGroupId(firstOrder.order_id);
        setCurrentOrderGroup(firstOrder.items || []);
      } else {
        setGroupId("");
        setCurrentOrderGroup([]);
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  //
  // Load orders when page opens
  //
  useEffect(() => {
    handleOrdersDB();
  }, [dbResponse]);

  //
  // Change selected order
  //
  const handleOnChangeOrderGroup = (e) => {
    const id = Number(e.target.value);

    setGroupId(id);

    const selectedOrder = orders.find(
      (order) => order.order_id === id
    );

    if (selectedOrder) {
      setCurrentOrderGroup(
        selectedOrder.items || []
      );
    } else {
      setCurrentOrderGroup([]);
    }
  };

  //
  // Receive order
  //
  const handleRecieveOrder = async (id) => {
    try {
      const response = await api.patch(
        `/orders/${groupId}`,
        {
          receivedDate: new Date()
            .toISOString()
            .split("T")[0],

          status: 2,

          items: currentOrderGroup,
        }
      );

      setDbResponse(response.data);

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <form>
        <select
          name="orderGroup"
          id="orderGroup"
          value={groupId}
          onChange={handleOnChangeOrderGroup}
        >
          {orders.map((order) => (
            <option
              key={order.order_id}
              value={order.order_id}
            >
              Group {order.order_id}
            </option>
          ))}
        </select>
      </form>

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>item</th>
            <th>amount</th>
          </tr>
        </thead>

        <tbody>
          {currentOrderGroup.length > 0 ? (
            currentOrderGroup.map((order) => (
              <OrdersCard
                key={order.id}
                {...order}
                handleRecieveOrder={handleRecieveOrder}
              />
            ))
          ) : (
            <tr>
              <td colSpan="3">
                No items in this order
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPg;