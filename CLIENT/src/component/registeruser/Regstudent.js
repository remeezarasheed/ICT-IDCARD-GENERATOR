import { useLayoutEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Coursedropdown from '../home/Coursedropdown';
import ValidationError from '../login/ValidationError'

function Regstudent () {

    const [errorMessage, setErrorMessage] = useState("")
    let navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault()

            const formData = new FormData(e.target);

        try {
            const res = await fetch("/api/studentregister", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            setErrorMessage(data.message)
        } catch (err) {
            setErrorMessage(err)
        }
    }

    useLayoutEffect(() => {
        <Coursedropdown />
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? navigate("/home"): null)
        .catch(err => setErrorMessage(err)) 
    }, [navigate])

 

    return (
        <>
                <div className='body1'>

        <div className="container">
            <div className="title">Register</div>
            <div className="content">

            <form encType='multipart/form-data' onSubmit={(e) => handleRegister(e)}>
            <div className='user-details'>

                <div className='input-box'>
                <span className='details'>Mail Address</span>
                <input placeholder='Mail Address' className='umail' type="email" name="email" id="email" required />
                </div>

                <div className='input-box'>
                <span className='details'>Full Name</span>
                <input placeholder='Full Name' className='fname' type="text" name="name" id="name" required />
                </div>

                <div className='input-box'>
                <span className='details'>Gender</span>  
                <select className="selectclass" placeholder='Gender' name="gender" id="gender"required>
                <option>Female</option>
                <option>Male</option>
                <option>Transgender Woman</option>
                <option>Transgender Man</option>
                <option>Non Binary</option>
                </select>
                </div>
                <div className='input-box'>
                <span className='details'>Profile Pictrue</span>  
                <div class="upload-btn-wrapper">
                <input className="upload" type="file" accept=".png, .jpg, .jpeg" name="image" required />
                <br/><i className='applylabel'>Accepted file formats are .png,.jpg/jpeg (best dimension is 100w*125h in px)</i>
                </div>
                </div>

                <div className='input-box'>
                <span className='details'>Password</span>  
                <input placeholder='Password' className='password' name="password" type="password" required/>
                </div>

                <div className='input-box'>
                <Coursedropdown />
                </div>

                

                
                </div>
                <div className='errormessage'>{errorMessage === "Success" ? <Navigate to="/"/>: <ValidationError message={errorMessage} />}</div>
                
                <div className='button'>
                <input type="submit" className='regbutton' value="Register" />
                </div>

                <div className="logotherss">
                    <p>Already have an account?</p>
                    <Link to="/"  style={{textDecoration:"none", color:"#f8961e", fontWeight:"bolder"}}>Login</Link>
                </div>
            </form>
        </div>
        </div>
        </div>
        </>
    )
}
export default Regstudent