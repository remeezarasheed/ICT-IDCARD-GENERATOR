import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { Button } from "@mui/material";

export default function Header() {
  const navigate = useNavigate();
  function logout() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to logout?") === true) {
      navigate("/");
      localStorage.removeItem("token");
       
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
          <Button className="link"  onClick={logout}>
            Signout
          </Button>
        </div>
       
      </div>
    </div>
  );
}
