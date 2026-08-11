const EditItemIntForm = ({item, inventoryItemForm, handleOnChangeItemForm, handleOnSubmitStockEdit}) => {
    return (
        <div>
            <form>
                <button type="submit" formAction={()=>handleOnSubmitStockEdit(parseInt(item.stock) + parseInt(inventoryItemForm.stock))} >Add</button>
                <input 
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Item stock"
                    value={inventoryItemForm}
                    onChange={handleOnChangeItemForm}
                />
                <button className="tableBtn" type="submit" formAction={()=>handleOnSubmitStockEdit(parseInt(item.stock) - parseInt(inventoryItemForm.stock))} >Subtract</button>
            </form>
        </div>
    )
}

export default EditItemIntForm