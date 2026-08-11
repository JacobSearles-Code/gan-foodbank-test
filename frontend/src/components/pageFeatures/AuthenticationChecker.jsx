import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode} from "jwt-decode";

const AuthenticationChecker = ({updateUser}) => {
  const navigate =useNavigate();
  const [currentUser] = useState(()=>{
    const jwtToken = Cookies.get("jwt-authorization");
    if (!jwtToken)
    {
        return "";
    }
    try{
        const decodedToken = jwtDecode(jwtToken);
        return [decodedToken.name, decodedToken.role];
    }catch{
        return "";
    }
  });
  useEffect(()=>{
    if (!currentUser)
    {
        navigate("/unauthorized");
    } else {
      updateUser(currentUser)
    }
  })
  return(
    <div>
    </div>
  )
}

export default AuthenticationChecker