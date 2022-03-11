import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"
import {Button} from '@mui/material'
import "./bmNav.css"


function BmNav(props) {


    const navigate = useNavigate();
    const [userDetails, setUserDetails]=useState({});

    useEffect(() => {
        fetchData();
        },[]);

    async function fetchData() {
        const response = await fetch(`http://localhost:8000/userdetails`,{
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
        <div className="navbar">
            {
                
                <>
                 <FaSignOutAlt  style={{fontSize:"25px", color:"gray", float:"right", cursor:"pointer"}} alt="Sign Out" onClick={logout}/>
                 <br/>
                 <Button variant="contained"><Link to={`/bmhome`} style={{textDecoration:"none", color:"white" }}>Home</Link></Button> 
                 <Button variant="contained"><Link to={`/bmhome`}  style={{textDecoration:"none", color:"white" }}>Pending</Link></Button>  
                  <Button variant="contained"><Link to={`/bmhome`}  style={{textDecoration:"none", color:"white" }}>Rejected </Link></Button> 
                    </>

            
            
                    }
            
        </div>
    );
}

export default BmNav;