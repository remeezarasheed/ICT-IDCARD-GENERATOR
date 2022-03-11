import { useEffect, useState ,React} from "react";
import "./BatchManager.css";

import "reactjs-popup/dist/index.css";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Header from "../header/Header.jsx";
import "../header/Header.css";

export default function BatchManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [Refetch, setRefetch] = useState(0);
  const [Data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [Error, setError] = useState();

  async function handleDelete(id) {
    // eslint-disable-next-line no-restricted-globals
    if(confirm("Do you want to delete permanently?")=== true){

    
    fetch(`http://localhost:8000/batchmanager/${id}`, {
      method: "DELETE",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
      })
      .then((data) => {
        setRefetch((v) => v + 1);
        setShowPopup((previous) => !previous);
      })
      .catch((e) => console.log(e.message));
  }}
  async function handleUpdate( id ) {
    fetch(`http://localhost:8000/batchmanager/${id}`, {
      method: "PUT",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
      })
      // .then((data) => setRefetch((v) => v + 1))
      .catch((e) => console.log(e.message));
  }
  useEffect(() => {
    fetchAPI();
  }, [Refetch]);

  async function fetchAPI() {
    setIsLoading(true);
    setError();
    try {
      const response = await fetch(`http://localhost:8000/batchmanager`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      const body = await response.json();
      setData(body);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  if (isLoading) return <>Loading</>;
  if (Error) return <>Error</>;
  console.log(selectedUser);
  return (
    <>
      <Header />
      <div className="batchManager">
        <Modal isOpen={showPopup}>
          <ModalBody>
            {selectedUser ? (
              <div>
                <div>
                  <img
                    src={`http://localhost:8000/images/${selectedUser.image}`}
                    alt="profilepic"
                    style={{
                      height: "175px",
                      borderRadius: "10px",
                      border: "2px solid violet",
                    }}
                  />
                </div>
                <h3 className="h3batchmanagerdetil" style={{ height: "0.5px" }}>
                  {selectedUser.name}
                </h3>
                <br />
                <p className="batchmanagerdetil">Batch Manager</p>
                <p className="batchmanagerdetil">
                  Designation: {selectedUser.designation}
                </p>
                <p className="batchmanagerdetil">
                  Gender:{selectedUser.gender}
                </p>
                <p className="batchmanagerdetil">Email :{selectedUser.email}</p>
                <p className="batchmanagerdetil">Phone :{selectedUser.phone}</p>
                <p className="batchmanagerdetil">Batch :{selectedUser.batch}</p>
                <p className="batchmanagerdetil">
                  Course :{selectedUser.course}
                </p>
              </div>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleUpdate(selectedUser.id)}>Edit</Button>
            <Button onClick={() => handleDelete(selectedUser.id)}>
              Delete
            </Button>
            <Button onClick={() => setShowPopup((o) => !o)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>COURSE</th>
              <th>BATCH</th>
            </tr>
          </thead>
          <tbody>
            {Data &&
              Data.map((v, i) => (
                <tr i={i}
                  onClick={() => {
                    console.log("this");
                    setShowPopup(true);
                    setSelectedUser({
                      id: v._id,
                      name: v.name,
                      email: v.email,
                      gender: v.gender,
                      phone: v.phone,
                      designation: v.designation,
                      course: v.course,
                      batch: v.batch,
                      image: v.image,
                    });
                  }}
                  key={i}
                >
                  <td>{i + 1}</td>
                  <td>{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.course}</td>
                  <td>{v.batch}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
