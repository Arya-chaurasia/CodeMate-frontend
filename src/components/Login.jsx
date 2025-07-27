import axios from 'axios';
import React from 'react'
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {

  const [emailId, setEmailid] = useState();
  const [password, setPassword] = useState()
  const [firstName, setFirstname] = useState()
  const [lastName, setLastName] = useState()
  const [loginForm, setLoginForm] = useState(true)
  const [error, setError] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {

      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password
      }, {
        withCredentials: true
      })
      dispatch(addUser(res.data))
      return navigate("/")
    } catch (err) {
      setError(err?.response?.data || "something went wrong")
      console.error(err, "error in login")
    }
  }

    const handleSignUp = async () => {
    try {

      const res = await axios.post(BASE_URL + "/signup", {
        firstName,
        lastName,
        emailId,
        password
      }, {
        withCredentials: true
      })
      dispatch(addUser(res.data?.data))
      return navigate("/profile")
    } catch (err) {
      setError(err?.response?.data || "something went wrong")
      console.error(err, "error in login")
    }
  }
  return (
    <div className="justify-center flex my-12">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{loginForm ? "Login" : "Sign up"}</h2>
          <div>
            {!loginForm &&
              <>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input"
                    onChange={(e) => setFirstname(e.target.value)}
                  />

                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </>
            }
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email Id</legend>
              <input
                type="text"
                value={emailId}
                className="input"
                onChange={(e) => setEmailid(e.target.value)}
              />

            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="text"
                value={password}
                className="input"
                onChange={(e) => setPassword(e.target.value)}
              />

            </fieldset>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              onClick={loginForm ? handleLogin : handleSignUp}
            >{loginForm ? "Login" : "Sign up"}</button>
          </div>
          <p 
          className='cursor-pointer m-auto p-2'
          onClick={()=> setLoginForm((value => ! value))}> {loginForm ? "New user? Sign up here" : "Existing User? Login here"}</p>
        </div>
      </div>
    </div>
  )
}

export default Login