import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";

const PageHeader = () => {
  const handleLogout = (e)=>{
    e.preventDefault()
    Cookies.remove("jwt-authorization")
  }

  const token = Cookies.get("jwt-authorization");

  let userData = null;

  if (token) {
    userData = jwtDecode(token);
  }

  return (
    <div>
      <header>
        <h1>Gananoque Food Bank App</h1>
        {/* Use the "to" parameter to set which route a link will use */}
        <nav className='navBar'>
          <Link className='navLink' to="/home">Home</Link>
          <Link className='navLink' to="/inventory">Inventory</Link>
          <Link className='navLink' to="/count">Count</Link>
          <Link className='navLink' to="/orders">Orders</Link>
          {userData?.role === 1 && <Link className='navLink' to="/admin">Admin Dashboard</Link>}
          <button onClick={handleLogout}><Link to="/">Logout</Link></button>
        </nav>
      </header>
    </div>
  )
}

export default PageHeader;