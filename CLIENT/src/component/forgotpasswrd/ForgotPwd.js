import { useLayoutEffect, useState  } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ValidationError from '../login/ValidationError.js';

import "./forgotPwd.css"

function ForgotPwd(props) {

    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    async function handleLogin(e) 
    {
        e.preventDefault()
        console.log(e.target);

        const form = e.target;
        const user = {
            email: form[0].value,
            name: form[1].value
        }
        try {
            const res = await fetch("/api/forgetpwd", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const data = await res.json()
            
            setErrorMessage(data.message)
        } catch(err) 
        {
            setErrorMessage(err)
        }
        console.log(errorMessage);
    }

    return (
        <>
        <div className="login-main" style={{minWidth:"100vh", backgroundImage: "linear-gradient(to top, #d16323 0%, #e9d62d 100%)"}}>
        <div className="login-mai">
                <div className="loginlabel">ICTAK ID Generator</div>
                <br></br>
                <h3>Please authenticate yourself by filling  <br /> same data filled up during sign-up.</h3>
                <form onSubmit={(e) => handleLogin(e)}>
                <input placeholder="email" className="usernamelog" type="text" name="email" id="email" />
                <br />
                <input placeholder="Name" className="usernamelog" type="text" name="name" id="name" />
                <br />
              
                <input className="buttonlog" type="submit" value="Reset"/>     
                <div  className='errorMessage'>{errorMessage === "success" ?  <h4> New Credential is Successfully sent to your Email  </h4> : errorMessage ===  "Invalid Email/Name"? <h3>Authentication Failed</h3>:<div/>}</div>                      
                </form><br/><br/>
            
        
          
        
        
        </div>
        </div>

        </>
    );
}

export default ForgotPwd;