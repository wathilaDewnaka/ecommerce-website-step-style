import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Cart() {
    const { cartItems, removeCart, calculateTotal, url, all_products, token, discount, setDiscount, color, size, isSecondEffectDone } = useContext(ShopContext);
    const [coupon, setCoupon] = useState("");
    const nav = useNavigate();

    const getTotalDiscount = async () => {
        const res = await axios.post(url + "/api/coupons/get-discount", {}, { headers: { token } });
        setDiscount(res.data.discount);

        if(!res.data.success){
            setDiscount(0);
        }
    };

    const couponHandler = async (ev) => {
        ev.preventDefault();
        
        const total = await calculateTotal();
        if (discount > 0) {
            toast.error("Only one coupon is allowed per order");
            return;
        }

        const res = await axios.post(url + "/api/coupons/redeem-coupon", { couponCode: coupon }, { headers: { token } });
        
        if (res.data.success) {
            if (total - 1000 > res.data.discount) {
                toast.success(res.data.message);
            }
        } else {
            toast.error(res.data.message);
        }
        getTotalDiscount();
    };

    useEffect(() => {
        async function load() {
            if (isSecondEffectDone) {
                await getTotalDiscount();
                
                const total = await calculateTotal();
                
                if (discount > total - 1000 && discount > 0) {
                    await axios.post(url + "/api/coupons/deactive-coupon", { discount }, { headers: { token } });
                    toast.error("Insufficient total to claim the coupon");
                    await getTotalDiscount();
                }
            }
        }
        load();
    }, [calculateTotal]);

    return (
        <section className="pt-20 max-padd-container">
            <div className="px-2 py-10 sm:px-10">
                <table className="w-full text-[12px] sm:text-[16px]">
                    <thead>
                        <tr className="text-gray-700 border-b border-slate-900/2 regular-14 xs:regular-16 text-start">
                            <th className="p-1 text-left">Products</th>
                            <th className="p-1 text-left">Title</th>
                            <th className="p-1 text-left">Size/Color</th>
                            <th className="p-1 text-left">Price</th>
                            <th className="p-1 text-left">Quantity</th>
                            <th className="p-1 text-left">Total</th>
                            <th className="p-1 text-left">Remove</th>
                        </tr>
                    </thead>

                    <tbody>
                        {all_products.map((item) => {
                            if (cartItems[item._id] > 0) {
                                return (
                                    <tr key={item._id} className="p-6 text-left text-gray-800 border-b border-slate-900/20 medium-14">
                                        <td className="!p-2">
                                            <img src={item.image} alt="product" height={50} width={50} className="m-1 rounded-lg ring-1 ringslate-900/5" />
                                        </td>

                                        <td className="!p-2">
                                            <div className="line-clamp-3">
                                                {item.name}
                                            </div>
                                        </td>

                                        <td className="p-2">
                                            <p>Size : <span className="block mb-0 sm:inline sm:mb-0">{size[item._id]}</span></p>
                                            <p>Color : <span className="block mb-0 sm:inline sm:mb-0">{color[item._id].split("-")[0].charAt(0).toUpperCase() + color[item._id].split("-")[0].slice(1)}</span></p>
                                        </td>

                                        <td className="!p-2">
                                            Rs. {item.price}
                                        </td>

                                        <td className="!p-2">
                                            {cartItems[item._id]}
                                        </td>

                                        <td className="!p-2">
                                            Rs. {item.price * cartItems[item._id]}
                                        </td>

                                        <td className="!p-2">
                                            <div className="font-bold">
                                                <TbTrash onClick={() => removeCart(item._id)} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table>

                <div className="flex flex-col gap-20 mt-20 xl:flex-row">
                    <div className="flex flex-col flex-1 gap-2">
                        <h4 className="text-2xl font-bold sm:text-4xl">Summary</h4>

                        <div>
                            <div className="flex justify-between py-3">
                                <h4>Subtotal :</h4>
                                <h4>Rs. {calculateTotal()}</h4>
                            </div>
                            <hr />

                            <div className="flex justify-between py-3">
                                <h4>Shipping Fee :</h4>
                                <h4>{calculateTotal() > 0 ? "Rs. 350" : "Rs. 0"}</h4>
                            </div>
                            <hr />

                            <div className="flex justify-between py-3">
                                <h4>Coupon Discount :</h4>
                                <h4>Rs. {discount > calculateTotal() - 1000 ? "0" : discount}</h4>
                            </div>
                            <hr />

                            <div className="flex justify-between py-3">
                                <h4 className="text-xl font-bold">Total :</h4>
                                <h4 className="text-xl font-bold">
                                    Rs. {calculateTotal() > 0 ? discount > calculateTotal() - 1000 ? calculateTotal() + 350 : calculateTotal() - discount + 350 : calculateTotal()}
                                </h4>
                            </div>

                            <button className="w-full py-2 text-white bg-orange-600" onClick={async () => await calculateTotal() > 0 ? nav("/order") : toast.error("Total should be greater than zero")}>Proceed to Checkout</button>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 gap-8">
                        <h4 className="font-bold capitalize">enter your coupon code :</h4>

                        <form onSubmit={couponHandler} className="flex justify-between h-[2.8rem] bg-slate-100 w-full max-w-[488px] rounded">
                            <input type="text" placeholder="Coupon code" onChange={(e) => setCoupon(e.target.value)} className="pl-3 bg-transparent border-none outline-none" required />
                            <button type="submit" className="relative px-10 py-3 text-white bg-black rounded">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
