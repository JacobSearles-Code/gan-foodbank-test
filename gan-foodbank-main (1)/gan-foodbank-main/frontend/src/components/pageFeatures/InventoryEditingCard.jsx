const InventoryEditingCard = ({inventoryItem, currentAction, handleAddNewItem, handleEditItem, handleOnChangeItemForm}) => {
    return (
        <div>
            <form onSubmit={currentAction === "edit" ? () => handleEditItem(inventoryItem.item_id) : handleAddNewItem}>
                <input 
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Item Name"
                    value={inventoryItem.name}
                    onChange={handleOnChangeItemForm}
                />
                <input 
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Item Category"
                    value={inventoryItem.category}
                    onChange={handleOnChangeItemForm}
                />
                <input 
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Item stock"
                    value={inventoryItem.stock}
                    onChange={handleOnChangeItemForm}
                />
                <button className="invOptionBtn" type="submit">{currentAction === "editing" ? "Save" : "Add"}</button>
            </form>
        </div>
    )
}

export default InventoryEditingCard