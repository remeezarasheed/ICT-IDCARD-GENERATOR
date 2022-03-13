import { useLayoutEffect, useState  } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import ValidationError from './ValidationError'
import "./login.css"

function Login() {

    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()

        const form = e.target;
        const user = {
            email: form[0].value,
            password: form[1].value
        }

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const data = await res.json()
            localStorage.setItem("token", data.token)
            setErrorMessage(data.message)
        } catch(err) {
            setErrorMessage(err)
        }
    }

    useLayoutEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? navigate("/home"): null)
        .catch(err => setErrorMessage(err)) 
    }, [navigate])

    return (
        <>
        <div className="login-main" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assests/bg23.png)`}}>
        <div className="login-mai">
            <img src={`${process.env.PUBLIC_URL}/assests/logotak.png`} alt='logo' width="130px" align="right"></img>
            <br/><br/><div className="loginlabel">Login here</div>
            <form onSubmit={(e) => handleLogin(e)}>
             <input placeholder="email" className="usernamelog" type="text" name="email" id="email" />
             <br />
              <input placeholder="Password" className="passwordlog" type="password" name="password" id="password" />
                <br />
                <input className="buttonlog" type="submit" value="Login"/>
                          
                </form>
            <div>
            {errorMessage === "Success" ? <Navigate to="/home"/>: <ValidationError message={errorMessage} />}
            </div>
            <br/>
            <br/>
                <div><Link className="registerbutton" to="/forgotPassword" style={{textDecoration:"none", color:"#f8961e", fontWeight:"bolder"}}>Forgot Password</Link></div>
          
            <div className="logother">
                <br/>
                    <h3>Don't have an account?</h3>
                    <Link className="registerbutton" to="/register" style={{textDecoration:"none", color:"#f8961e", fontWeight:"bolder"}}>Register here</Link>
                </div> 
                </div>
        </div>

        </>
    )
}

export default Login;