import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';



function Home(props) {
    const navigate = useNavigate()

    useEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isloggedIn || data.role==="user" ? navigate("/userhome"):  
                     data.isloggedIn || data.role==="admin" ? navigate("/adminhome"): 
                     data.isloggedIn || data.role==="bm" ? navigate("/bmhome"): null)
    })
    return (
        <div style={{display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"}}>
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
        </div>
    );
}

export default Home;