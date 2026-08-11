const EditItemStringForm = ({value, inventoryItemFormValue, handleOnChangeItemForm, handleOnSubmitStringValueEdit}) => {
    return (
        <div>
            <form onSubmit={()=>handleOnSubmitStringValueEdit(inventoryItemFormValue, value)}>
                <input 
                    type="text"
                    id={value}
                    name={value}
                    placeholder={value}
                    value={inventoryItemFormValue}
                    onChange={handleOnChangeItemForm}
                />
                <button className="tableBtn" type="submit" >Submit</button>
            </form>
        </div>
    )
}

export default EditItemStringForm