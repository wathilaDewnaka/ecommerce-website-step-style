import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaBox } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";

export default function MyOrders() {
    const { url, token } = useContext(ShopContext);
    const [data, setData] = useState([]);

    const loadOrders = async () => {
        try {
            const res = await axios.post(
                `${url}/api/order/userorders`,
                {},
                { headers: { token }}
            );

            setData(res.data.data);
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    };

    const track = () => {
        loadOrders()
        toast.success("Orders updated successfully !")
    }

    useEffect(() => {
        if (token) {
            loadOrders();
        }
    }, [token]); // Include token in the dependency array

    return (
        <section className="pt-20 max-padd-container">
            <div className="px-2 py-10 sm:px-10">
                <h4 className="text-2xl font-bold">My Orders</h4>
                
                <table className="w-full mt-8 text-[10px] sm:text-[16px]">
                    <thead>
                        <tr className="py-12 border-b border-r-slate-900/20 text-start">
                            <th className="hidden p-1 text-left sm:table-cell">Package</th>
                            <th className="p-1 text-left">Title</th>
                            <th className="p-1 text-left">Price</th>
                            <th className="p-1 text-left">Item Count</th>
                            <th className="p-1 text-left">Status</th>
                            <th className="p-1 text-left">Track</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((order, idx) => (
                            <tr key={idx} className="p-6 text-left border-b border-r-slate-900/20">
                                <td className="hidden p-1 sm:table-cell"><FaBox className="text-2xl text-orange-600"/></td>

                                <td className="p-1">
                                    <p>
                                        {order.items.map((item, idx) => (
                                            (idx === order.items.length - 1)
                                                ? item.name + " X " + item.quantity + " (Size : " + item.size + ",Color : " + item.color + ")" 
                                                : item.name + " X " + item.quantity+ " (Size : " + item.size + ",Color : " + item.color + ")" + " , " 
                
                                        ))}
                                    </p>
                                </td>

                                <td className="w-20 p-1 sm:w-40">
                                    <p>Amount : <span className="block mb-1 sm:inline sm:mb-0">Rs. {order.amount}</span></p>
                                    <p>Discount : <span className="block mb-1 sm:inline sm:mb-0">Rs. {order.discount}</span></p>
                                    <p>Payment : <span className="block mb-1 sm:inline sm:mb-0">{order.mode}</span></p>
                                </td>
                                
                            
                                <td className="p-1">
                                    {order.items.length}
                                </td>

                                <td className="p-1">
                                    <p>
                                        <span className="hidden lg:flex">&#x25cf;</span>
                                        <b>{order.status}</b>
                                    </p>
                                </td>

                                <td className="p-1">
                                    <button className="w-10 py-1 rounded-sm sm:w-20 bg-slate-200" onClick={track}>Track Order</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
