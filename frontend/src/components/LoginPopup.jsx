import { useState, useContext } from "react";
import { FaXmark, FaEye, FaEyeSlash } from "react-icons/fa6";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from 'axios';

export default function LoginPopup({ setShowLogin }) {
    const [state, setState] = useState('login');
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { url, setToken } = useContext(ShopContext);
    
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const changeHandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData(data => ({ ...data, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        let newUrl = url;
        
        if (state === "login") {
            newUrl += "/api/user/login";
        } else if (state === "Sign Up"){
            newUrl += "/api/user/send-otp";
        } else if(state === "OTP"){
            newUrl += "/api/user/register";
        } else if(state === "Forget Password"){
            newUrl += "/api/user/forget-password";
        } else if(state === "Forget Password OTP"){
            newUrl += "/api/user/reset-password";  
        }

        try {
            const res = await axios.post(newUrl, data);

            if (res.data.success && state === "Forget Password OTP") {
                toast.success("Password reset successfully!");
                setToken(res.data.token);
                setShowLogin(false);
                document.body.style.overflow = "auto";
                localStorage.setItem("token", res.data.token);
            } else if (res.data.success && state === "Forget Password") {
                toast.success("OTP Sent!");
                setState("Forget Password OTP");
            } else if (res.data.success && state === "Sign Up") {
                toast.success("OTP Sent!");
                setState("OTP");
            } else if (res.data.success && state === "login") {
                setToken(res.data.token);
                setShowLogin(false);
                document.body.style.overflow = "auto";
                toast.success("User logged in successfully!");
                localStorage.setItem("token", res.data.token);
            } else if (res.data.success && state === "OTP") {
                setToken(res.data.token);
                setShowLogin(false);
                document.body.style.overflow = "auto";
                toast.success("User registered and logged in successfully!");
                localStorage.setItem("token", res.data.token);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        document.body.style.overflow = "auto";
        setShowLogin(false);
    };

    return (
        <div className="absolute z-50 flex items-center justify-center w-full h-full overflow-hidden overscroll-none bg-black/40">
            <form onSubmit={onLogin} className="bg-white w-[466px] p-7 rounded-lg shadow-md">
                <div className="flex items-baseline justify-between">
                    <h4 className="text-2xl font-bold">
                        {state === "Forget Password OTP" ? "Forget Password OTP" : state !== "OTP" ? state.charAt(0).toUpperCase() + state.slice(1).toLowerCase() : "OTP Verification"}
                    </h4>
                    <FaXmark onClick={closeModal} className="cursor-pointer medium-20 text-slate-900/70" />
                </div>

                <div className="flex flex-col gap-4 my-6">
                    {(state !== 'OTP' && state !== "Forget Password OTP") ? (
                        <>
                            {state === "Sign Up" && (
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={changeHandle}
                                    placeholder="Name"
                                    className="p-2 pl-4 border rounded-md outline-none border-slate-900/20"
                                    required
                                />
                            )}

                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={changeHandle}
                                placeholder="Email"
                                className="p-2 pl-4 border rounded-md outline-none border-slate-900/20"
                                required
                            />

                            {state !== "Forget Password" && (
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        onChange={changeHandle}
                                        placeholder="Password"
                                        className="w-full p-2 pl-4 border rounded-md outline-none border-slate-900/20"
                                        required
                                    />
                                    <span
                                        onClick={togglePasswordVisibility}
                                        className="absolute cursor-pointer right-3 top-2 text-slate-600"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            )}
                            
                        </>
                    ) : (
                        state === "OTP" ? (
                            <>
                                <p className="pb-6">We have just sent you a six digit one-time passcode to {data.email}. Please enter it to verify your email address. Check your spam folder if the email is not there! OTP is valid for 10 minutes.</p>
                                
                                <input
                                    type="text"
                                    name="otp"
                                    value={data.otp}
                                    onChange={changeHandle}
                                    placeholder="OTP Number"
                                    className="p-2 pl-4 border rounded-md outline-none border-slate-900/20"
                                    required
                                />
                            </>
                        ) : (
                            <>
                                <p className="pb-6">We have just sent you a six digit one-time passcode to {data.email}. Please enter it to verify your email address. Check your spam folder if the email is not there! OTP is valid for 10 minutes.</p>
                                
                                <input
                                    type="text"
                                    name="otp"
                                    value={data.otp}
                                    onChange={changeHandle}
                                    placeholder="OTP Number"
                                    className="p-2 pl-4 border rounded-md outline-none border-slate-900/20"
                                    required
                                />

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={data.newPassword}
                                        onChange={changeHandle}
                                        placeholder="New Password"
                                        className="w-full p-2 pl-4 border rounded-md outline-none border-slate-900/20"
                                        required
                                    />
                                    <span
                                        onClick={togglePasswordVisibility}
                                        className="absolute cursor-pointer right-3 top-2 text-slate-600"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmNewPassword"
                                        value={data.confirmNewPassword}
                                        onChange={changeHandle}
                                        placeholder="Confirm Password"
                                        className="w-full p-2 pl-4 border rounded-md outline-none border-slate-900/20"
                                        required
                                    />
                                    <span
                                        onClick={togglePasswordVisibility}
                                        className="absolute cursor-pointer right-3 top-2 text-slate-600"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </>
                        )
                    )}
                </div>

                <button type="submit" className="w-full py-3 text-white bg-orange-600 rounded-md" disabled={loading}>
                    {loading ? "Processing..." : (state === "Forget Password" ? "Reset Password" : (state === "login" || state === "Forget Password OTP") ? "Login" : "Create an account")}
                </button>

                {(state !== "OTP" && state !== "Forget Password") &&
                    <div className="flex items-baseline mt-6 mb-4 gap-x-3">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms" className="relative bottom-1">
                            By clicking continue you agree to our <span>Terms & Conditions</span>
                        </label>
                    </div>
                }
                
                {state === "Sign Up" ? (
                    <p>
                        Already have an account? <span onClick={() => setState("login")} className="text-orange-600 cursor-pointer">Login</span>
                    </p>
                ) : state === "login" ? (
                    <div>
                        <p>
                            Don't have an account? <span onClick={() => setState("Sign Up")} className="text-orange-600 cursor-pointer">Sign Up</span>
                        </p>
                        <p className="text-orange-600 cursor-pointer" onClick={() => setState("Forget Password")}>
                            Forget password?
                        </p>
                    </div>
                ) : ""}
            </form>
        </div>
    );
}
