import { useState, useEffect } from "react";
import axios from "axios";

const InventoryCount = () => {
    const [inventory, setInventory] = useState([])
    const [inventoryPostResponse, setInventoryPostResponse] = useState("")
    const [filters, setFilters] = useState({nameFilter: "", categoryFilter: "", sortBy: ""})


    const handleInventoryDB = async ()=>{

        //console.log(filters.nameFilter != "")
        try {
            await axios.get("http://localhost:3000/inventory")
                .then((response)=>{
                    setInventory(()=>response.data)
                })
        } catch(error) {
            console.log(error.message)
        }
    }

    const search = async (event) => {
        setFilters({...filters, nameFilter: event.target.value})
    }

    useEffect(() => {
        handleInventoryDB()
    }, [inventoryPostResponse])
    useEffect(()=>{
        const applyFilters = async ()=>{
            console.log(filters)
            try {
                await axios.patch("http://localhost:3000/inventoryFilters", filters)
                    .then((response)=>{
                        setInventoryPostResponse(()=>response.data)
                    })
            } catch (error) {
                console.log(error.message)
            }
        }
        applyFilters()
    }, [filters])

    return (
        <div className="container">
            <title>Inventory Page</title>

            <h1>Inventory</h1>
            <p>Page for listing current inventory totals and adjustments</p>
            <input className="searchBar" placeholder="Type to search..." onChange={search} />

            <table>
                <thead>
                <tr>
                    <th>ITEM</th>
                    <th>IN SYSTEM</th>
                    <th>COUNT</th>
                </tr>
                </thead>
                <tbody>
                {inventory.map((item)=>(
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.stock}</td>
                        <td><input type="text" /></td>
                    </tr>
                ))}
                </tbody>
            </table>


        </div>
    )
}

export default InventoryCount