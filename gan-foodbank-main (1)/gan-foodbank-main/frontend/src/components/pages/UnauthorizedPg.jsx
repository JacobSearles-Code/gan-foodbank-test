import { Link } from "react-router-dom";
const UnauthorizedPg = () => {
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <h3>Please Sign In</h3>
      <Link to="/login">Go back to Login</Link>
    </div>
  )
}

export default UnauthorizedPg