import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./bmHome.css";
import Navbuttons from "./BmNav";

function Bmhome(props) {
  const [userDetails, setUserDetails] = useState({});
  

  useEffect(() => {
    fetchData();
   
  },);

  async function fetchData() {
    const response = await fetch(`/bmdetails`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const body = await response.json();
    setUserDetails(body);
  }

  

  return (
    <>
      <div className="row">
        <div className="column left">
          <Navbuttons />
          {
            <>
              <h3>BM Profile</h3>
              <br />
              <img
                src={`/images/${userDetails.image}`}
                alt="profilepic"
                style={{
                  height: "175px",
                  borderRadius: "10px",
                  border: "2px solid violet",
                }}
              />
              <h3 className="h3detil" style={{ height: "0.5px" }}>
                {userDetails.name}
              </h3>
              <br />
              <p className="userdetil">Batch Manager</p>
              <p className="userdetil">Course: {userDetails.course}</p>
              <p className="userdetil">Gender:{userDetails.gender}</p>
              <p className="userdetil">{userDetails.email}</p>
              <br />
              <hr />
            </>
          }
        </div>
        <div className="column right">

        </div>
      </div>
    </>
  );
}

export default Bmhome;
