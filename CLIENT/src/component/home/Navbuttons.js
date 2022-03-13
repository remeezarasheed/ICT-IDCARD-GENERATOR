import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"
import {Button} from '@mui/material'
import "./navbar.css"


function Navbuttons(props) {
    const navigate = useNavigate();
    const [userDetails, setUserDetails]=useState({});

    useEffect(() => {
        fetchData();
        },[]);

    async function fetchData() {
        const response = await fetch(`/userdetails`,{
            headers:{
                "Content-type": "aplication/json",
                "x-access-token": localStorage.getItem("token")
                }
        }
        );
        const body = await response.json();
        setUserDetails(body);
    }
    async function logout() {     
        // eslint-disable-next-line no-restricted-globals
        if(confirm("Do you want to logout?")=== true){
        localStorage.removeItem("token")
        await navigate("/")
        }
    }



    return (
 <div className='nav1'>
            {
                userDetails.role==="user"? 
                <>
<FaSignOutAlt  style={{fontSize:"25px", color:"gray", float:"right", cursor:"pointer"}} alt="Sign Out" onClick={logout}/>
                 <br/>
                 <Button variant="contained"><Link to={`/userhome`} style={{textDecoration:"none", color:"white" }}>Home</Link></Button> 
                  { userDetails.approvedstatus === "rejected" || userDetails.approvedstatus === "approved" || userDetails.approvedstatus === "pending" 
                  ?  
                  <Button variant="contained">
                  <Link to={`/${userDetails.id}/applyidcard`} style={{textDecoration:"none", color:"white" }}>
                  Reapply
                  </Link>
                 </Button>  
                  :
                 <Button variant="contained">
                  <Link to={`/${userDetails.id}/applyidcard`} style={{textDecoration:"none", color:"white" }}>
                      Apply
                    </Link>
                    </Button>  }

                    <Button variant="contained">
                  <Link to={`/${userDetails.id}/idstatus`} style={{textDecoration:"none", color:"white" }}>
                      Status
                    </Link>
                    </Button> 
                    </>

            : null
                    }
            
        </div>
    );
}

export default Navbuttons;