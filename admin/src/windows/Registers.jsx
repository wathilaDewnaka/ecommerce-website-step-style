import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registers({ url }) {
    const [otp, setOtp] = useState({}); // Updated to object instead of array
    const nav = useNavigate()

    async function loadReg() {
        try {
            const res = await axios.get(`${url}/api/admin/otps`);
            if (res.data.success) {
                setOtp(res.data.otp);
            }
            if (res.data.message === "NULL"){
                nav("/")
            }
        } catch (error) {
            console.error("Error fetching OTPs:", error);
        }
    }

    async function reset(){
        const res = await axios.post("${url}/api/admin/reset")
    }

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('admintoken');
            try {
                const res = await axios.get(`${url}/api/admin/validate`, {
                    headers: { token }
                });

                if (!res.data.success) {
                    localStorage.removeItem("admintoken");
                    nav("/");
                }
            } catch (error) {
                localStorage.removeItem("admintoken");
                nav("/");
            }
        };

        load();
        loadReg()
    }, []);

    return (
        <section className="box-border w-full p-4 sm:p-10 bg-slate-50">
            <h4 className="pb-2 text-2xl font-bold uppercase">Register Request Admin OTP</h4>
            
            <div className="mt-5 overflow-auto">
                <table className="w-full">
                    <thead>
                        <tr className="py-12 text-lg text-gray-800 border-b border-slate-900/20 text-start">
                            <th className="p-1 text-left">Email</th>
                            <th className="p-1 text-left">OTP</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.entries(otp).map(([email, otpCode]) => (
                            <tr key={email} className="p-6 text-lg text-left text-gray-800 border-b border-slate-900/20">
                                <td className="p-1">{email}</td>
                                <td className="p-1">{otpCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                
            </div>  

            <button
                    onClick={reset}
                    className="flex items-center justify-center py-2 mt-5 text-white bg-black rounded text-wrap sm:w-5/12 gap-x-2"
                   
                >
                    Reset Register
                </button>  
        </section>

        
    );
}
