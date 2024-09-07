import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function Coupons({ url }) {
    const [coupons, setCoupons] = useState([]); // renamed to plural and initialized as an array
    const [data, setData] = useState({
        code: "",
        discount: "",
        expiryDate: "",
        maxUsageCount: ""
    });
    const today = new Date().toISOString().split("T")[0];
    const nav = useNavigate()

    const changeHandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((data) => ({
            ...data,
            [name]: value
        }));
    };

    const couponHandler = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('admintoken')
        const response = await axios.post(`${url}/api/coupons/add-coupon`, data, {headers: {token}});

        if (response.data.success) {
            setData({
                code: "",
                discount: "",
                expiryDate: "",
                maxUsageCount: ""
            });
            toast.success("Coupon added successfully");
            loadCoupons(); // reload coupons after adding a new one
        } else {
            if (response.data.message === "NULL"){
                nav("/")
            }
            toast.error("Error adding the coupon");
        }
    };

    const loadCoupons = async () => {
        const response = await axios.get(`${url}/api/coupons/list-coupon`);
        console.log(response)

        if (response.data.success) {
            setCoupons(response.data.data); // correct state to set the retrieved coupons
        } else {
            toast.error("Error retrieving coupons");
        }
    };

    const removeData = async (_id) => {
        const token = localStorage.getItem('admintoken')
        const response = await axios.post(`${url}/api/coupons/remove-coupon`, {id : _id}, {headers : {token}});
 
        if (response.data.success) {
            toast.success("Coupon removed successfully")
        } else {
            if (response.data.message === "NULL"){
                nav("/")
            }
            toast.error("Error removing coupon");
        }

        loadCoupons()
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
        loadCoupons(); // call the function to load coupons
    }, []);

    return (
        <section className="w-full p-4 bg-slate-50 sm:p-10">
            <form className="flex flex-col gap-y-5 max-w-[880px]" onSubmit={couponHandler}>
                <h4 className="pb-2 text-2xl font-bold uppercase">Manage Coupons</h4>
                <div className="flex flex-row flex-wrap gap-x-3">
                    <div>
                        <input
                            onChange={changeHandle}
                            value={data.code}
                            type="text"
                            name="code"
                            placeholder="Coupon code"
                            className="px-3 py-1 mb-3 outline-none ring-1 ring-slate-900/10 sm:mb-0"
                            required
                        /> 
                    </div>

                    <div>
                        <input
                            onChange={changeHandle}
                            value={data.discount}
                            type="number"
                            name="discount"
                            placeholder="Discount"
                            className="px-3 py-1 mb-3 outline-none ring-1 ring-slate-900/10 sm:mb-0"
                            required
                        />
                    </div>

                    <div>
                        <input
                            onChange={changeHandle}
                            value={data.maxUsageCount}
                            type="number"
                            name="maxUsageCount"
                            placeholder="Maximum usage"
                            className="px-3 py-1 mb-3 outline-none ring-1 ring-slate-900/10 sm:mb-0"
                            required
                        />
                    </div>

                    <div>
                        <input
                            onChange={changeHandle}
                            value={data.expiryDate}
                            type="date"
                            name="expiryDate"
                            placeholder="Valid until"
                            className="px-3 py-1 mb-3 outline-none ring-1 ring-slate-900/10 sm:mb-0"
                            min={today}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="h-10 text-white bg-black rounded-sm">Add Coupon</button>
            </form>

            <h4 className="pb-2 text-2xl font-bold uppercase mt-7">All Coupons</h4>

            <table className="w-full">
                <thead>
                    <tr className="py-12 text-lg text-gray-800 border-b border-slate-900/20 text-start">
                        <th className="p-1 text-left">Coupon Code</th>
                        <th className="p-1 text-left">Discount</th>
                        <th className="p-1 text-left">Usage / Max Usage</th>
                        <th className="p-1 text-left">Validity</th>
                        <th className="p-1 text-left">Remove</th>
                    </tr>
                </thead>

                <tbody>
                    {coupons.map((item) => (
                        <tr key={item._id} className="p-6 text-lg text-left text-gray-800 border-b border-slate-900/20">
                            <td className="p-1">{item.code}</td>
                            <td className="p-1">{item.discount}</td>
                            <td className="p-1">{item.usageCount} / {item.maxUsageCount}</td>
                            <td className="p-1">{item.expiryDate.split("T")[0]}</td>
                            <td className="p-1 cursor-pointer" onClick={() => removeData(item._id)}><TbTrash /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
