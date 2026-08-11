const NewOrderCard = ({orderItems, handleSubmitNewOrder, handleRemoveItemFromOrder, handleAdjustUnitQuatity})=>{
    return ( <div>

        {orderItems.map((item)=>(
            <p key={item.index} >
                <button onClick={()=>handleRemoveItemFromOrder(item.index, item.inventoryIndex)} ><b>X</b></button>
                {item.name} - {item.unitAmount} per unit | 
                <button onClick={()=>handleAdjustUnitQuatity(item.index, 1)} >+</button>
                {item.unitQuantity} Units
                {item.unitQuantity > 1 && <button onClick={()=>handleAdjustUnitQuatity(item.index, -1)} >-</button>}
            </p>
        ))}
        <button onClick={handleSubmitNewOrder} >Submit Order</button>
    </div> )
}
export default NewOrderCard