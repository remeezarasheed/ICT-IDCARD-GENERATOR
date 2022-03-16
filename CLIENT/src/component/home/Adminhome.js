import React, { useEffect, useState } from "react";
import Header from '../header/Header.jsx';
import '../header/Header.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import './Adminhome.css';
function Adminhome(props) {
    const [userDetails, setUserDetails] = useState({});
    const [value, onChange] = useState(new Date());

    useEffect(() => {
      fetchData();
    });
  
    async function fetchData() {
      const response = await fetch(`/admindetails`, {
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
          style={{minHeight:"100vh",minWidth:"100vw",
            backgroundImage: `url(${process.env.PUBLIC_URL}/assests/adminhome.png)`,
          }}
        >
          {userDetails.role === "admin" ? (
            <>
            <div className="admincalender" style={{float:"right",padding:"15px",paddingTop:"5%"}}>
            <Calendar onChange={onChange} value={value} />
            </div>
              
              <aside style={{width: "100%",
 display: "flex",
 height: "100vh",
 position:"absolute",
 top:"35%",
 left:"45%",
 alignContent:"center"
 }}>
                <header>
                  <div class="a">
                    <img
                      src={`/images/${userDetails.image}`}
                      alt="prof"
                      height="125px"
                    />
                  </div>
  
                  <h1>{userDetails.name}</h1>
                  <p>{userDetails.email}</p>
                </header>
  
             
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