import React, { useEffect, useState } from "react";
import BmNav from "./BmNav";
import { Button } from "@mui/material";
import './PendingList.css';

export default function PendingList() {

    const [pendingList, setpendingList] = useState([]);
    const [Refetch, setRefetch] = useState(0);
    useEffect(() => {
        fetchPendingList();
      }, [Refetch]);

    async function fetchPendingList() {
        const response = await fetch(`/showmypendingilst`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        const body = await response.json();
        setpendingList(body);
      }
    
      async function approveUser(_id){
        const response = await fetch(`/${_id}/approved`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
              "x-access-token": localStorage.getItem("token"),
            },
          });
          const body = await response.json();
          alert("Approved Successfully")
          setRefetch((v) => v + 1);
      }
    
      async function rejectedUser(_id){
        const response = await fetch(`/${_id}/rejected`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
              "x-access-token": localStorage.getItem("token"),
            },
          });
          alert("Rejected the User")
          setRefetch((v) => v + 1);
      }


  return (
      <>
      <div className="pendingbody">
      <BmNav />
    <div  className="table-wrapper32">
     <table className="fl-table32">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>IMAGE</th>
              <th>EMAIL</th>
              <th>COURSE</th>
              <th>BATCH</th>
              <th >START DATE</th>
              <th >END DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pendingList &&
              pendingList.map((v, i) => (
                <tr
                  style={{fontSize:"12px"}}
                  key={i}
                >
                  <td>{i + 1}</td>
                  <td>{v.fullname}</td>
                  <td> <img
                src={`/images/${v.image}`}
                alt="profilepic"
                style={{
                  height: "50px",
                  borderRadius: "10px",
                  border: "2px solid violet",
                }}
              /></td>
                  <td>{v.email}</td>
                  <td>{v.course}</td>
                  <td>{v.batch}</td>
                  <td>{v.coursesd}</td>
                  <td>{v.coursesend}</td>
                  <td>
                    <Button color="success" onClick={() => approveUser(v._id)}>Approve</Button><br />
                    <Button color="error" onClick={() => rejectedUser(v._id)}>Reject</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
    </div>
      </div>
    
    </>
  );
}
