import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SendMessage({ url }) {
    const [data, setData] = useState({
        subject: "",
        message: "",
    });
    const [isDisabled, setIsDisabled] = useState(true);  // Track if the button should be disabled
    const [isSubmitting, setIsSubmitting] = useState(false);  // Track if the form is being submitted
    const nav = useNavigate();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        // Disable button if subject or message is empty or while submitting the form
        setIsDisabled(!data.subject || !data.message || isSubmitting);
    }, [data, isSubmitting]); // Runs whenever data or isSubmitting changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);  // Disable the button when API request starts

        const token = localStorage.getItem('admintoken');
        
        try {
            const res = await axios.post(url + '/api/admin/send-message', data, { headers: { token } });

            if (res.data.success) {
                toast.success("Message sent to users");
            } else {
                if (res.data.message === "NULL") {
                    nav("/");
                }
                toast.error("Failed to send messages");
            }
        } catch (error) {
            toast.error("An error occurred while sending the message");
        } finally {
            setIsSubmitting(false);  // Re-enable the button once the request is done
        }
    };

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
    }, []);

    return (
        <section className="box-border w-full p-4 sm:p-10 bg-slate-50">
            <h4 className="text-2xl font-bold uppercase">Send Messages to Users</h4>
            <form onSubmit={handleSubmit} className="mt-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="subject">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={data.subject}
                        onChange={handleChange}
                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={data.message}
                        onChange={handleChange}
                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="5"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    disabled={isDisabled}  // Disable the button if fields are empty or while submitting
                >
                    {isSubmitting ? "Sending..." : "Send"}  {/* Change text to show request is in progress */}
                </button>
            </form>
        </section>
    );
}
