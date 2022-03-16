import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import BmNav from './BmNav';
import "./approvedlist.css"


function Approvedlist(props) {

const {id} = useParams();
const [list,setList] = useState([]);

    useEffect(()=>{
        fetchAPI();
    });

    async function fetchAPI() {
        const response = await fetch(`/${id}/showmyapprove`,{
            headers:{
                "x-access-token": localStorage.getItem("token")
                }
        });
        const body = await response.json();
        setList(body);
    }
    return (
        <div className='body12'>
            <BmNav />
            <div>
<div style={{paddingTop:"60px", textAlign:"center"}}>
            <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success mb-3"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Export to excel"/>
</div>
<div  className="table-wrapper32">
                   <table class="fl-table32" id="table-to-xls" >
                <thead>
                <tr>
               <th>Sl.No </th>
               <th>Name  </th>
               <th>Gender</th>
               <th>Course</th>
               <th>Batch </th>
               <th>Start Date</th>
               <th>End Date</th>
               <th>Status</th>
               <th>Updated at</th>

               </tr>
               </thead>
               <tbody >
               {list.map((i,key)=>
                <tr key={key}>
                <td>{key+1}</td>
               <td>{i.fullname}</td>
               <td> {i.gender}</td>
               <td>{i.course}</td>
               <td> {i.batch}</td>
               <td>{i.coursesd}</td>
               <td>{i.coursesend}</td>
               <td>{i.approvedstatus}</td>
               <td>{i.updatedAt.substring(0,10)}</td>

               </tr>
               )}
                              </tbody>


               </table>
                
               </div>
               </div>
        </div>
    );
}

export default Approvedlist;