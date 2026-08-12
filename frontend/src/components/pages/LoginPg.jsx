import { useState } from "react";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import api from "../../api.js";


const LoginPg = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    name: "",
    password: ""
  })

  const [loginResponse, setLoginResponse] = useState("")

  const handleOnChangeLogin = (e)=> {
    setLoginData((prevData) => {
      return{...prevData, [e.target.name]: e.target.value};
    })
  }

  const handleOnSubmitLogin = (e) => {
    e.preventDefault()
    handleLogin()
    setLoginData({name: "",password: ""})
  }

  const handleLogin = async () => {
    try {
      const response = await api.post("/", loginData);

      console.log("LOGIN RESPONSE:", response);
      console.log("TOKEN:", response.data.token);

      setLoginResponse(response.data.message);

      if (response.status === 200) {
        Cookies.set(
            "jwt-authorization",
            response.data.token
        );

        console.log(
            "COOKIE:",
            Cookies.get("jwt-authorization")
        );

        navigate("/home");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      console.error("RESPONSE:", err.response?.data);

      setLoginResponse(
          err.response?.data?.message ||
          "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="logDiv">
      {loginResponse != "" && <p>{loginResponse}</p>}

      <form onSubmit={handleOnSubmitLogin}>
        <label htmlFor="name">Username: </label>
        <input
          type="text"
          name="name"
          id="name"
          value={loginData.name}
          onChange={handleOnChangeLogin}
          placeholder="Enter username"
          required
        />

        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          value={loginData.password}
          onChange={handleOnChangeLogin}
          placeholder="Enter password"
          required
        />

        <button>Login</button>
      </form>
    </div>
  )
}

export default LoginPg