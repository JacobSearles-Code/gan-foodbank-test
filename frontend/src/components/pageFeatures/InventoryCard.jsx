const InventoryCard = ({index, name, category_name, stock, selected, currentAction, handleOnSelect,setUpForEditing, handleAddToNewOrder, handleRemoveItemFromOrder}) => {
    return (
        <tr>
            {currentAction != "selectItemNameToEdit" && <td>{selected && "**" } {name} {selected && "**" }</td>} 
            {currentAction === "selectItemNameToEdit" && <td><button className="invTableBtn" onClick={() => setUpForEditing("editName", index)} >{name}</button></td>}
            {currentAction != "selectItemCategoryToEdit" && <td>{category_name}</td>} 
            {currentAction === "selectItemCategoryToEdit" && <td><button className="invTableBtn" onClick={() => setUpForEditing("editCategory", index)} >{category_name}</button></td>}
            {currentAction != "selectStockToEdit" && <td>{stock}</td>} 
            {currentAction === "selectStockToEdit" && <td><button className="invTableBtn" onClick={() => setUpForEditing("editStock", index)} >{stock}</button></td>}
            {currentAction === "delete" && <td><button className="invTableBtn" onClick={() => handleOnSelect(index)} >{selected ? "Unselect" : "Select"}</button></td>}
            {currentAction === "order" && 
                <td>{selected ?  
                <button className="invTableBtn" onClick={() => handleRemoveItemFromOrder("unknown", index)} >Remove Item</button> 
                : <button className="invTableBtn" onClick={() => handleAddToNewOrder(name, 3, index)} >Order Item</button>}
            </td>}
        </tr>
    )
}
export default InventoryCard