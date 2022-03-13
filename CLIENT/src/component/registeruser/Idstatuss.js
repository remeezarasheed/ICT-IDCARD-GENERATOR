import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbuttons from '../home/Navbuttons';
import "./idstatuss.css"
function Idstatuss(props) {
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
      <div className="body3">
         
        <div>
        <Navbuttons />
<>
            {
                getrolestatus.map((i,key)=>
                <div key={key}>
                    { i.approvedstatus === "pending" || i.approvedstatus === "approved" || i.approvedstatus === "rejected" ?
                <table className='table1' key={key}>
                    <tbody>
                    <tr className='tr1'>
                   <td style={{padding:"15px"}}><img className='round' src={`/images/${i.regimage}`} alt="profpic" height="150px"/></td>
                    </tr>  <tr> <td style={{padding:"5px"}}><span className="idststat">{i.email}</span>
                                                    <br /> <span className='small'>Created at: {i.updatedAt.substring(0,10)}</span></td>
                    </tr>  <tr>  <td style={{padding:"5px"}} className="idststat">{i.fullname}</td>  </tr>

                        { i.approvedstatus==="pending"? <tr><td style={{padding:"10px"}}><Button size="small" variant="contained" color="primary">Pending</Button></td> </tr> :
                        i.approvedstatus==="rejected" ? <tr><td style={{padding:"10px"}}><Button size="small" variant="contained" color="error">Rejected</Button></td> </tr> :
                        i.approvedstatus==="approved" ? <tr><td style={{padding:"10px"}}><span className="approved">Approved</span>
                                                                                      <br/>
                                                                                      <Button size="small" variant="contained" color="success" onClick={downloadpdf}>Download</Button>
                                                                                      </td> </tr> : null


                        }
                        
                    </tbody>           
                </table> 
                :
                <Button variant="outlined" style={{color:"white", border:"1px solid white", marginTop:"50vh"}}  disableElevation className='middleme'>You should apply first!</Button>

            }
                </div>
                )
                
            }</>
            </div>
            </div>
    </>
    );
   
}

export default Idstatuss;