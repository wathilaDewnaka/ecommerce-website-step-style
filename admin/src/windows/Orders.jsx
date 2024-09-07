import { useEffect, useState } from "react";
import { FaBox } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Orders({ url }) {
    const [order, setOrder] = useState([]);
    const nav = useNavigate()

    
    const loadOrders = async () => {
        const token = localStorage.getItem('admintoken')
        const res = await axios.get(url + "/api/order/list", {headers: {token}});

        if (res.data.success) {
            setOrder(res.data.data);
        } else {
            if (res.data.message === "NULL"){
                nav("/")
            }
            toast.error("Error");
        }
    };

    const statusHandle = async (e, orderId) => {
        const res = await axios.post(url + "/api/order/set-status", {orderId, status: e.target.value})

        if(res.data.success){
            await loadOrders()
            toast.success("Status changed successfully")
        } else{
            toast.error("Failed to update status")
        }
    }

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('admintoken');
            try {
                const res = await axios.get(`${url}/api/admin/validate`, {
                    headers: {token }
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
        loadOrders()
    }, []);

    return (
        <section className="box-border w-full p-4 sm:p-10 bg-slate-50">
            <h4 className="text-2xl font-bold uppercase">Total Orders</h4>
            <div className="mt-5 overflow-auto">
                <table className="w-full">
                    <thead>
                        <tr className="py-12 border-b border-slate-900/20 text-start">
                            <th className="hidden p-1 text-left sm:flex">Package</th>
                            <th className="p-1 text-left">Order</th>
                            <th className="p-1 text-left">Item Count</th>
                            <th className="p-1 text-left">Price</th>
                            <th className="p-1 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((order, idx) => (
                            <tr key={idx} className="p-6 text-left border-b border-r-black border-r-slate-900/20 border-b-slate-900">
                                <td className="hidden p-1 sm:table-cell">
                                    <FaBox />
                                </td>
                                <td className="p-1">
                                    <div className="pb-2">
                                        <p>
                                            {order.items.map((item, idx) =>
                                                idx === order.items.length - 1
                                                    ? `${item.name} X ${item.quantity} (Size : ${item.size},Color : ${item.color})`
                                                    : `${item.name} X ${item.quantity} (Size : ${item.size},Color : ${item.color}), `
                                            )}
                                        </p>
                                    </div>
                                    <hr className="w-1/2" />
                                    <div>
                                        <h5>{`${order.address.firstName} ${order.address.lastName}`}</h5>
                                        <div>
                                            <p>{`${order.address.street},`}</p>
                                            <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                                        </div>
                                        <p>{order.address.phone}</p>
                                        <p>{order.address.email}</p>
                                    </div>
                                </td>
                                <td className="p-1">{order.items.length}</td>
                                <td className="p-1"><p>Amount : Rs. {order.amount}</p><p>Discount : Rs. {order.discount}</p><p>Mode : Rs. {order.mode}</p></td>
                                <td className="p-1">
                                    <select onChange={(event) => statusHandle(event, order._id)} value={order.status}>
                                        <option value={"Product Loading"}>Product Loading</option>
                                        <option value={"Out for delivery"}>Out for delivery</option>
                                        <option value={"Delivered"}>Delivered</option>
                                        <option value={"Canceled"}>Canceled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
