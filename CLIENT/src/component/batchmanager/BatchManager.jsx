import { useEffect, useState, React, useCallback } from "react";
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
  const [EditMode, setEditMode] = useState(false);

  async function handleUpdate(id) {
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
        <CustomModal
          showPopup={showPopup}
          User={selectedUser}
          setShowPopup={setShowPopup}
          setRefetch={setRefetch}
        />
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
                <tr
                  i={i}
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

function CustomModal({
  showPopup = false,
  User = {},
  setShowPopup,
  setRefetch,
}) {
  const [EditMode, setEditMode] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [batchCourse, setBatchCourse] = useState([]);
  const handleDelete = useCallback(async function handleDelete(id) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you want to delete permanently?") === true) {
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
    }
  }, []);
  useEffect(() => {
    fetchAPI();
  }, []);
  async function fetchAPI() {
    setLoading(true);
    const response = await fetch(`http://localhost:8000/api/batchcourse`);
    const body = await response.json();
    setBatchCourse(body);
    setLoading(false);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target.name.value);
    const formData = new FormData(event.target);
    fetch(`http://localhost:8000/batchmanager/${User.id}`, {
      method: "PUT",
      body: formData,
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then(function (response) {
        // eslint-disable-next-line no-undef
        alert("You updated successfully");
        setRefetch((v) => v + 1);
      })
      .catch((err) => console.log(err));
    // const data = await res.json();
    // console.log(data);
    // setErrorMessage(data.message);
  };
  return (
    <Modal isOpen={showPopup}>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {User ? (
            <div>
              <div>
                <img
                  src={`http://localhost:8000/images/${User.image}`}
                  alt="profilepic"
                  style={{
                    height: "175px",
                    borderRadius: "10px",
                    border: "2px solid violet",
                  }}
                />
              </div>
              <h3 className="h3batchmanagerdetil" style={{ height: "0.5px" }}>
                {!EditMode && User.name}
                {EditMode && (
                  <input
                    name="name"
                    placeholder={User.name}
                    className="edit-inputfield"
                    type="text"
                  />
                )}
              </h3>
              <br />
              <p className="batchmanagerdetil">Batch Manager</p>
              <p className="batchmanagerdetil">
                Designation: {!EditMode && User.designation}
                {EditMode && (
                  <select  placeholder={User.designation} name='designation' required>
                  
                  <option value='Assistant'>Assistant</option>
                  <option value='Associate'>Associate</option>
                  <option value='Mentor'>Mentor</option>
                  <option value='cashier'>cashier</option>
                </select>
                )}
              </p>
              <p className="batchmanagerdetil">
                Gender:{!EditMode && User.gender}
                {EditMode && (
                 <select placeholder={User.gender} name='gender' id='gender' required>
                 
                 <option>Female</option>
                 <option>Male</option>
                 <option>Transgender Woman</option>
                 <option>Transgender Man</option>
                 <option>Non Binary</option>
               </select>
                )}
              </p>
              <p className="batchmanagerdetil">Email :{User.email}</p>
              <p className="batchmanagerdetil">
                Phone : {!EditMode && User.phone}
                {EditMode && (
                  <input name="phone" placeholder={User.phone} className="edit-inputfield" type="text" />
                )}
              </p>
              <p className="batchmanagerdetil">
                Batch :{!EditMode && User.batch}
                {Loading && <>Loading Courses</>}
                {EditMode && !Loading && (
                  <select className="batchmanagerdetil" name="batch">
                    {batchCourse.map((i, key) =>
                      i.batch.map((j, key) => (
                        <option key={key} value={j}>
                          {j}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </p>
              <p className="batchmanagerdetil">
                Course :{!EditMode && User.course}
                {Loading && <>Loading Courses</>}
                {EditMode && !Loading && (
                  <select className="batchmanagerdetil" name="course">
                    {batchCourse.map((i, key) =>
                      i.course.map((j, key) => (
                        <option key={key} value={j}>
                          {j}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </p><br />
              {EditMode && (
                <p>
                  Image: <input type="file" name="image" id="image" />
                </p>
              )}
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter>
          {EditMode && <Button type="submit">Update</Button>}
          <Button onClick={() => setEditMode((o) => !o)}>
            {!EditMode ? <>Edit</> : <>Cancel Edit</>}
          </Button>
          <Button onClick={() => handleDelete(User.id)}>Delete</Button>
          <Button onClick={() => setShowPopup((o) => !o)}>Cancel</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
