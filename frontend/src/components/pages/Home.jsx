import logo from '../../assets/GananoqueFoodBank.png'
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import api from "../../api.js";


const Home = () => {
  const [inventory, setInventory] = useState([])

  const loadReport = async () => {
    try {
      api.get("/inventory")
      .then((response)=>{
        setInventory(()=>response.data)
      })
    } 
    catch(error) {
      console.log(error.message)
    }
  }

    const token = Cookies.get("jwt-authorization")

    let userData = null

    if (token) {
        userData = jwtDecode(token)
    }
useEffect( () => {
  loadReport()
}, [])

  return(
    <div className="homeContainer">
        <div>
      <title>Home</title>
            <img src={logo}></img>
        <h1>Welcome {userData?.first_name}!</h1>
      <h1>Dashboard</h1>
      <h2>This will serve as the main landing page of the app, showing relevant top level info at a glance</h2>
            <h1>Database reports</h1>
            <p>Current list of items below desired stock level</p>
        </div>
            <div className="tableDiv">
          <table>
            <thead>
              <tr>
                <th>
                  Item
                </th>
                <th>
                  Count
                </th>
                <th>
                  Par
                </th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item)=>(
                item.stock < item.par ?
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.stock}</td>
                    <td>{item.par}</td>
                  </tr>
                : ""
              ))}
            </tbody>
          </table>
      </div>
    </div>
  )
}

export default Home