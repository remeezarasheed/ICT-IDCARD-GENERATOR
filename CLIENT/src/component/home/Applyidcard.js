import { Box } from '@mui/material';
import React, { useLayoutEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ValidationError from '../login/ValidationError';
import Coursedropdown from './Coursedropdown';
import Navbuttons from './Navbuttons';
import "./applycard.css";


function Applyidcard(props) {
    const {id} = useParams();
    const [getrolestatus,setGetrolestatus] = useState([]);
    const [errorMessage, setErrorMessage] = useState("")
    let navigate = useNavigate();
    

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





    async function handleRegister(e) {
        e.preventDefault()

            const formData = new FormData(e.target);

        try {
            const res = await fetch(`/api/${id}/apply/`, {
                method: "PUT",
                body: formData,
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                }
            })
            const data = await res.json()
            setErrorMessage(data.message)
        } catch (err) {
            setErrorMessage(err)
        }
    }

    useLayoutEffect(() => {
        <Coursedropdown />
        fetchData()
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? null : navigate("/"))
        .catch(err => setErrorMessage(err)) 
    },[id])
   
    return (
        <> 
        <div className="regmai">
        <Box >
        <Navbuttons />
        </Box>
        <div className='body1'>
        
        <div className="container">
            <div className="title">Apply Your ID card here</div>
            <div className="content">
            <form encType='multipart/form-data' onSubmit={(e) => handleRegister(e)}>
            <div className='user-details'>

                {getrolestatus.map((i,key)=>
                <div className='input-box' key={key}>
                <span className='details'>Mail Address</span>
                <input disabled defaultValue={i.email}  className='umail1' type="email" name="email" id="email" required />
                </div>
                )}
               


                <div className='input-box'>
                <span className='details'>Full name</span>
                <input className='fname1' type="text" name="fullname" id="name" required />
                </div>

                <div className='input-box'>
                <span className='details'>Gender</span> 
                <select placeholder='Gender' className='selectclass' type="text" name="gender" id="gender" required>
                <option>Female</option>
                <option>Male</option>
                <option>Transgender Woman</option>
                <option>Transgender Man</option>
                <option>Non Binary</option>
                </select>
                </div>
                
                

                <div className='input-box'>  
                <span className='details'>Phone Number</span>            
                <input className="phone1" type="number" name='phone' id="phone" required />
                </div>
                

                <div className='input-box'>  
                <span className='details'>Course Start Date</span>            
                <input placeholder='Course start date' className="coursesd1" type="date" name="coursesd" id="coursesd" required/>
                </div>


                <div className='input-box'>  
                <span className='details'>Course End Date</span>  
                <input placeholder='Course end date' className="coursesend1" type="date" name="coursesend" id="coursesend" required/>
                </div>
                
                <div className='input-box'>
                <Coursedropdown />
                </div>

                <div className='input-box'>  
                <span className='details'>ID Card Image</span>  
                <input type="file" accept=".png, .jpg, .jpeg" name="regimage" required/>
                <label className="applylabel">Accepted file formats are .png,.jpg/jpeg (best dimension is 100w*125h in px)</label>
                </div>

                

                </div>
                <div>{errorMessage === "Success" ? <Navigate to="/userhome"/>: <ValidationError message={errorMessage} />}</div>
                
                <div className='button'>
                <input type="submit" className='regbutton1' value="Apply" />
                </div>
           
            </form>
            </div>
        </div>
        </div>
        </div>
      
        
        </>
    )
}
export default Applyidcard;