import React, { useEffect, useState } from "react";
import "../registeruser/regstud.css";

function Coursedropdown(props) {
  const [batchCourse, setBatchCourse] = useState([]);

  useEffect(() => {
    fetchAPI();
  }, []);

  async function fetchAPI() {
    const response = await fetch(`/api/batchcourse`);
    const body = await response.json();
    setBatchCourse(body);
  }
  return (
    <div>
      <div>
        {/* <label>Course Details: </label> */}
        <span className="details">Course</span>
        <select className="selectclass" name="course">
          {batchCourse.map((i, key) =>
            i.course.map((j, key) => (
              <option key={key} value={j}>
                {j}
              </option>
            ))
          )}
        </select>
      </div>
      <br />
      <div>
        {/* <label >Batch Details: </label> */}
        <span className="details">Batch</span>
        <select className="selectclass" name="batch">
          {batchCourse.map((i, key) =>
            i.batch.map((j, key) => (
              <option key={key} value={j}>
                {j}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}

export default Coursedropdown;
