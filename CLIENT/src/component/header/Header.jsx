import React from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  async function logout() {     
    // eslint-disable-next-line no-restricted-globals
    if(confirm("Do you want to logout?")=== true){
    localStorage.removeItem("token")
    await navigate("/")
    }
}
  return (
    <div>
      <div className="head">
        <div className="topCenter">
          <Link className="link" to="/adminhome">
            Home
          </Link>
          <Link className="link" to="/batchmanagers">
            Batch Managers
          </Link>
          <Link className="link" to="/newbatchmanagers">
            New Batch Manager
          </Link>
          <Link className="link" to="/formcontrol">
            Form Controls
          </Link>
          <Link className="link" to="/" onClick={logout}>
            Signout
          </Link>
        </div>
        <div className="topRight">
          <img
            className="topImg"
            src="https://www.whatsappimages.in/wp-content/uploads/2020/12/Cute-Girl-Images-For-Whatsapp-Dp-Free-Download-2.jpg"
            alt="profilepic"
          />
        </div>
      </div>
    </div>
  );
}
