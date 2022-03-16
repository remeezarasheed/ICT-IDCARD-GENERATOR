import React, { useEffect, useState } from 'react';
import "./formcontrol.css";
import Header from '../header/Header.jsx';
import '../header/Header.css';


function Formcontrol(props) {
    const [userDetails, setUserDetails]=useState({});
    const [batchCourse,setBatchCourse] = useState([]);

    
    useEffect(() => {
        fetchData();
        fetchbatchc();
        },[batchCourse]);
    async function fetchbatchc() {
            const response = await fetch(`/api/batchcourse`);
            const body = await response.json();
            setBatchCourse(body);
        }

    async function fetchData() {
        const response = await fetch(`/admindetails`,{
            headers:{
                "x-access-token": localStorage.getItem("token")
                }
        }
        );
        const body = await response.json();
        setUserDetails(body);
    }


    //deleting course
    async function deletingCourse(e) {
        const form = e.target;
        const course = {
           course: form[0].value,
        }
        console.log(course)
        const res = await fetch(`/api/delcourse`, {
            method: "POST", 
            headers:{
                "Content-type": "application/json",
                "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify(course),

        })
        const data = await res.json();
        console.log(data)
    }



    //deleting a batch
    async function deletingBatch(e) {
        const form = e.target;
        const batch = {
           batch: form[0].value,
        }
        console.log(batch)
        const res = await fetch(`/api/delbatch`, {
            method: "POST", 
            headers:{
                "Content-type": "application/json",
                "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify(batch),

        })
        const data = await res.json();
        console.log(data)
    }


    //adding a course

    async function addingCourse(e) {
        const form = e.target;
        const course = {
           course: form[0].value,
        }
        console.log(course)
        const res = await fetch(`/api/addcourse`, {
            method: "PUT", 
            headers:{
                "Content-type": "application/json",
                "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify(course),

        })
        const data = await res.json();
        console.log(data)
    }
    //adding a course ends

    //adding a batch

    async function addingBatch(e) {
        const form = e.target;
        const batch = {
           batch: form[0].value,
        }
        const res = await fetch(`/api/addbatch`, {
            method: "PUT", 
            headers:{
                "Content-type": "application/json",
                "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify(batch),

        })
        const data = await res.json();
        console.log(data)
    }
    //adding a batch ends


    return (
       
        <>
         <Header />
        
         {
          //checking user level (front end)
           userDetails.role==="admin" ?
<div className='body1'>
    <div className='container'>
    <p className="title1" style={{textAlign:"center"}}>Admin Formcontrol</p>
    <div className="title">Delete Form Data</div> 
<br />
<div>
<form onSubmit={(e) => deletingCourse(e)}>
<div className='input-box'>

   <span className='details'>Course</span>  
   <select className="selectclass" name="course">
   {batchCourse.map((i,key)=> 
   i.course.map((j,key)=>
   <option key={key} value={j}>{j}</option>
   ))}
   </select>
</div>
<br/>
   <input className="controlbutton" type="submit" value="DELETE"/> 
</form>
<br />

<form onSubmit={(e) => deletingBatch(e)}>
<span className='details'>Batch</span>  
   <select className="selectclass" name="batch">
   {batchCourse.map((i,key)=> 
   i.batch.map((j,key)=>
   <option key={key} value={j}>{j}</option>
   ))}
   </select>
   <br /><br />
   <input className="controlbutton" type="submit" value="DELETE"/> 
   </form>
   </div>

{/* adding options */}
<br />

<p className="title">Add Data to Form</p>
<br />
<form onSubmit={(e) => addingCourse(e)}>
<div className='input-box'>
<span className='details'>Add Course Menu</span>  
<input className='selectclass' type="text" name="course" required/> 
</div>
<br />
<input className="controlbutton" type="submit" value="Add"/> 
</form>
<br />
<form onSubmit={(e) => addingBatch(e)}>
<div className='input-box'>
<span className='details'>Add Batch Menu</span>  
<input className='selectclass'type="text" name="batch" required/> 
</div>
<br />
<input className="controlbutton"  type="submit" value="Add"/> 
</form>
{/* adding options ends */}

</div>
</div>
:
<p>Not Authorized</p>
           
        }
        </>
    );
}
export default Formcontrol;