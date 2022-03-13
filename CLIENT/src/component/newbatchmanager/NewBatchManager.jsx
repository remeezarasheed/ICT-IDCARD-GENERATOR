import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import ValidationError from '../login/ValidationError.js';
import Validation from './Validation.js';
import Coursedropdown from '../home/Coursedropdown.js';
import './NewBatchManager.css';
import Header from '../header/Header.jsx';
import '../header/Header.css';

export default function NewBatchManager() {
  const [Refetch, setRefetch] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  let navigate = useNavigate();
  async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch("/batchmanager/", {
        method: "POST",
        body: formData,
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        // eslint-disable-next-line no-undef
        alert('You registered successfully');   
        })
      const data = await res.json();
      setErrorMessage(data.message);
    } catch (err) {
      setErrorMessage(err);
    }
  }

  useEffect(() => {
    fetch('/isUserAuth', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    })
      .then(res => res.json())
      .then(data => (data.isLoggedIn ? null : navigate('/home')))
      .catch(err => setErrorMessage(err));
  }, [navigate,Refetch]);

  return (
    <>
    <Header/>,
    <div className='register-batch-manager'>
      <div>
        <h1>batch manager sign up</h1>
      </div>
      <div>
        <form onSubmit={handleRegister}>
          <div>
            <div>
              <input type='text' name='name' placeholder='Name' required />
              <select placeholder='Gender' name='gender' id='gender' required>
                <option  disabled selected hidden>
                  Gender
                </option>
                <option>Female</option>
                <option>Male</option>
                <option>Transgender Woman</option>
                <option>Transgender Man</option>
                <option>Non Binary</option>
              </select>
              <input type='text' name='phone' placeholder='Phone' required />
              <input type='email' name='email' placeholder='Email' required />
            </div>
            <div>
              <select name='designation' required>
                <option  disabled selected hidden>
                  Designation
                </option>
                <option value='Assistant'>Assistant</option>
                <option value='Associate'>Associate</option>
                <option value='Mentor'>Mentor</option>
                <option value='cashier'>cashier</option>
              </select>
              <Coursedropdown />
              <input
                className='upload'
                type='file'
                accept='.png, .jpg, .jpeg'
                name='image'
                required
              />
            </div>
    
          </div>
          <button type='submit' >Register</button>
        </form>
      </div>
    </div>
    </>
  );
}
