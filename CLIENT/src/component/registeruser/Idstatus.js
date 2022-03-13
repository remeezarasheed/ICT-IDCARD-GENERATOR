import { Button } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbuttons from '../home/Navbuttons';
import Userhome from '../home/Userhome';
import "./idstatus.css"
function Idstatus(props) {
    const {id} = useParams();
    const [getrolestatus,setGetrolestatus] = useState([]);

    useEffect(() => {
        fetchData();
        });


    async function fetchData() {
        const response = await fetch(`/api/${id}/getroleandstatus`,{
            headers:{
                "x-access-token": localStorage.getItem("token")
                }
        }
        );
        const body = await response.json();
        setGetrolestatus(body);
    }


    
    function downloadpdf() {
        fetch(`/api/${id}/generate-pdf`,{
            headers:{
                "x-access-token": localStorage.getItem("token")
                }
        }
        ).then((res) => { return res.blob(); })
.then((data) => {
  var a = document.createElement("a");
  a.href = window.URL.createObjectURL(data);
  a.download = "FILENAME";
  a.click();
});
    }

    return (
        <>
        <Box sx={{ display: { xs: 'none', lg: 'block', md: 'block', xl: 'none' } }}>
        <Userhome />
        </Box>
        <div className="column right">
        <Box sx={{ display: { xs: 'block', lg: 'none', md: 'none', xl: 'block' } }}>
        <Navbuttons />
        <Button variant="outlined" style={{color:"white", border:"1px solid white"}}  disableElevation className='middleme'>Current Status</Button>

        </Box>
       
            {
                getrolestatus.map((i,key)=>
                <div key={key}>
                    { i.approvedstatus === "pending" || i.approvedstatus === "approved" || i.approvedstatus === "rejected" ?
                <table className='table1' key={key}>
                    <tbody>
                    <tr className='tr1'>
                        <td style={{padding:"25px"}}><img className='round' src={`/images/${i.regimage}`} alt="profpic" height="50px"/></td>
                        <td style={{padding:"25px"}}><span className="idststat">{i.email}</span>
                                                    <br /> <span className='small'>Created at: {i.updatedAt.substring(0,10)}</span></td>
                        <td style={{padding:"25px"}} className="idststat">{i.fullname}</td>

                        { i.approvedstatus==="pending"? <td style={{padding:"25px"}}><Button size="small" variant="contained" color="primary">Pending</Button></td> :
                        i.approvedstatus==="rejected" ? <td style={{padding:"25px"}}><Button size="small" variant="contained" color="error">Rejected</Button></td> :
                        i.approvedstatus==="approved" ? <td style={{padding:"25px"}}><span className="approved">Approved</span>
                                                                                      <br/>
                                                                                      <Button size="small" variant="contained" color="success" onClick={downloadpdf}>Download</Button>
                                                                                      </td> : null


                        }
                        
                        
                    </tr>
                    </tbody>
                    
                </table> 
                :
                <Button variant="outlined" style={{color:"white", border:"1px solid white", marginTop:"50vh"}}  disableElevation className='middleme'>You should apply first!</Button>

            }
                </div>
                )
            }
        </div>
        </>
    );
   
}

export default Idstatus;