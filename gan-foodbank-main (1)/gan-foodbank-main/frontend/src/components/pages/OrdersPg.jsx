import { useState, useEffect } from "react"
import axios from "axios";

import OrdersCard from "../pageFeatures/OrdersCard";

const OrdersPg = ()=>{
  const [orders, setOrders] = useState([])
  const [groupId, setGroupId] = useState(0)
  const [currentOrderGroup, setCurrentOrderGroup] = useState([])
  //const [orderItems, setOrderItems] = useState([])
  const [dbResponse, setDbResponse] = useState("")
  //Db and useEffect statements
  const handleOrdersDB = async ()=>{
    try {
      await axios.get("http://localhost:3000/orders")
      .then((response)=>{
        //console.log(response.data)
        setOrders(response.data.db)
        //setCurrentOrderGroup(response.data.currentGroup)
        setGroupId(response.data.currentGroup)
      })
    } catch(error) {
      console.log(error.message)
    }
    //console.log(orders[currentOrderGroup].order_items)
  }
  /*
  
  */
  
  useEffect(() => {
    handleOrdersDB()
  }, [dbResponse])
  //useEffect(()=>{
  //  updateOrderItems()
  //}, [groupId])

  const handleOnChangeOrderGroup = (e) => {
    setGroupId(e.target.value)
    //setCurrentOrderGroup(orders[e.target.value].order_items)
    updateOrderItems(e.target.value)
    console.log(currentOrderGroup)
  }

  const handleRecieveOrder = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/ordersOld`, {group_id: groupId, order_id: id})
      .then((response)=>{
        setDbResponse(response.data)
      })
    } catch (error) {
      console.log(error.message)
    }
  }
  const updateOrderItems = async (id)=>{
    try {
      await axios.get(`http://localhost:3000/orders/${id}`)
      .then((response)=>{
        setCurrentOrderGroup(response.data.items)
        console.log(response.data)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  return (<div>
    
    <form action="">
        <select name="orderGroup" id="orderGroup" onChange={handleOnChangeOrderGroup} >
          {orders.map((group)=>(
              <option key={group.order_id} value={group.index}>Group {group.order_id}</option>
            ))}
        </select>
    </form>
    <table>
        <thead>
            <tr><th>id</th><th>item</th><th>amount</th></tr>
        </thead>
        <tbody>
            <tr>
            <td>orders_id</td>
            <td>name</td>
            <td>amount</td>
            </tr>
            {currentOrderGroup.length > 0 && currentOrderGroup.map((order)=>(
                <OrdersCard key={order.id} {...order} handleRecieveOrder={handleRecieveOrder} />
            ))}
        </tbody>
    </table>
  </div>)
}
export default OrdersPg
/*
{PageHeader, Link, AuthenticationChecker, currentUser, updateUser}
<PageHeader Link={Link} user={currentUser} />
    <AuthenticationChecker updateUser={updateUser} />
*/