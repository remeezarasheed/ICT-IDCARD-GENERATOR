import React, { useEffect, useState } from "react";
import "./userhomed.css";
import Navbuttons from "./Navbuttons";

function Userhomed(props) {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    fetchData();
  });

  async function fetchData() {
    const response = await fetch(`/userdetails`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const body = await response.json();
    setUserDetails(body);
  }

  return (
    <>
      <div
        className="body2"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assests/bg.png)`,
        }}
      >
        {userDetails.role === "user" ? (
          <>
            <Navbuttons />
            <aside className="profilecard">
              <div className="profileheaderr">
                <div className="a">
                  <img
                    src={`/images/${userDetails.image}`}
                    alt="prof"
                  />
                </div>

                <h1 className="profilenameh1">{userDetails.name}</h1>

                <h2 className="profilenameh2">{userDetails.designation}</h2>
              </div>

              <div className="profilebio">
                <p className="profilepara">Course: {userDetails.course}</p>
                <p className="profilepara">Gender:{userDetails.gender}</p>
                <p className="profilepara">{userDetails.email}</p>
              </div>
            </aside>
          </>
        ) : (
          <p>You're not authorized to view this page</p>
        )}
      </div>
    </>
  );
}
export default Userhomed;
