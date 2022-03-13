import React, { useEffect, useState } from 'react';
import "./userhome.css";
import Navbuttons from './Navbuttons';


function Userhome(props) {
        const [userDetails, setUserDetails]=useState({});
    
        useEffect(() => {
            fetchData();
            });
    
        async function fetchData() {
            const response = await fetch(`/userdetails`,{
                headers:{
                    "x-access-token": localStorage.getItem("token")
                    }
            }
            );
            const body = await response.json();
            setUserDetails(body);
        }

    return (
        <>
        <div className='row'>
            <div className='column left'>
                <Navbuttons />
            {
                userDetails.role==="user"? 
                <>
               
                 <h3>Student Profile</h3>
                 <br/>
                 <img src={`/images/${userDetails.image}`} alt="profilepic" style={{height:"175px", borderRadius:"10px", border:"2px solid violet"}} />
                <h3 className='h3detil' style={{height:"0.5px"}}>{userDetails.name}</h3>
                <br />
                <p className='userdetil'>Student</p> 
                <p className='userdetil'>Course: {userDetails.course}</p>
                <p className='userdetil'>Gender:{userDetails.gender}</p>
                <p className='userdetil'>{userDetails.email}</p>
                <br />
                <hr />

                </>
                : <p>You're not authorized to view this page</p>
            }
            
            </div>
            </div>
        </>
    );
}

export default Userhome;