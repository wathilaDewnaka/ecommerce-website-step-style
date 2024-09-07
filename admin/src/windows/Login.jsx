import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({ log, setLog, url }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState("");
  const nav = useNavigate()
  const [state, setState] = useState('Login');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigate = useNavigate(); // Correct variable name to navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
        let newUrl = url;
        
        if (state === "Register") {
            newUrl += "/api/admin/send-otp";
        } else if (state === "Login"){
            newUrl += "/api/admin/login";
        } else if (state === "Admin Verify OTP"){
            newUrl += "/api/admin/register";
        }
        
       const res = await axios.post(newUrl, {
         email,
         password,
         otp
       });

      if (res.data.success && state === "Login") {
        toast.success('Login successfully');
        localStorage.setItem('admintoken', res.data.token)
        setLog(res.data.token)
        navigate('/add');
      } else if (res.data.success && state === "Register" || !res.data.success && res.data.message === "OTP Already Sent to Management"){
        if(res.data.success){
            toast.success(res.data.message);
        }else{
            toast.error(res.data.message)
        }    
        setState("Admin Verify OTP");
      } else if(res.data.success && state === "Admin Verify OTP"){
        toast.success('Registered and logged successfully');
        setLog(res.data.token); // Assuming you want to set log to true on successful login
        localStorage.setItem('admintoken', res.data.token)
      } else{
        toast.error(res.data.message)
      }
      
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error during login:', error);
    }
  }

  useEffect(() => {
    console.log(localStorage.getItem("admintoken"))
    if (localStorage.getItem("admintoken")){
      navigate("/add")
    }
  })

  return (
    <div className="p-6 mx-auto mt-10 bg-white rounded-lg shadow-md w-96">
      <h2 className="mb-6 text-2xl font-bold text-center">{state}</h2>
      <form onSubmit={handleSubmit}>
        {state !== "Admin Verify OTP" ? (
          <>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder='Email Address'
                required
              />
            </div>

            {state === "Login" && (
              <div className="relative mb-6">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on state
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder='Password'
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              We have sent the admin of StepStyle an OTP code to verify. If you are approved, our StepStyle management will send you an email with the OTP code to verify your account. You can't request new OTP codes.
            </p>

            <div className="mb-4">
              <label htmlFor="otp" className="block mb-2 font-medium text-gray-700">
                Admin OTP Code:
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder='Admin Verify OTP Code'
                required
              />
            </div>

            <div className="relative mb-6">
              <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"} // Toggle input type based on state
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder='Password'
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </>
        )}
        
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {state === "Login" ? "Login" : "Create admin account"} 
        </button>

        {state === "Login" ? (
          <div>
            <p className="mt-3 text-blue-600 cursor-pointer" onClick={() => setState("Register")}>
              Create an admin account?
            </p>
            <p>If you forget your password, please contact the site admin.</p>
          </div>
        ) : (
          <div>
            <p className="mt-3 text-blue-600 cursor-pointer" onClick={() => setState("Login")}>
              Log in with admin account
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
