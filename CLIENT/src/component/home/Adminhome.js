import React, { useEffect, useState } from "react";
import Header from '../header/Header.jsx';
import '../header/Header.css';
//import './Adminhome.css';
function Adminhome(props) {
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
      fetchData();
    });
  
    async function fetchData() {
      const response = await fetch(`http://localhost:8000/admindetails`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      const body = await response.json();
      setUserDetails(body);
    }
  
    return (
      <>
      <Header />
        <div
          className="body2"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/bg.png)`,
          }}
        >
          {userDetails.role === "admin" ? (
            <>
              
              <aside class="profile-card111111111">
                <header>
                  <div class="a">
                    <img
                      src={`http://localhost:8000/images/${userDetails.image}`}
                      alt="prof"
                    />
                  </div>
  
                  <h1>{userDetails.name}</h1>
  
                  <h2>{userDetails.designation}</h2>
                </header>
  
                <div class="profile-bio11111111">
                  <p>Course: {userDetails.course}</p>
                  <p>Gender:{userDetails.gender}</p>
                  <p>{userDetails.email}</p>
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

export default Adminhome;