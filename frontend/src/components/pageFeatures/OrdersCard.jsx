const OrdersCard = ({id, name, amount, handleRecieveOrder}) => {
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{amount}</td>
            {id === "pending" && <td><button onClick={()=>handleRecieveOrder(id)} >Recieved</button></td> }
        </tr>
    )
}
export default OrdersCard
//<button className="adminPgBtn" onClick={()=>prepAction(index, "edit")} >edit</button> <button className="adminPgBtn" onClick={()=>prepAction(index, "delete")} >delete</button>