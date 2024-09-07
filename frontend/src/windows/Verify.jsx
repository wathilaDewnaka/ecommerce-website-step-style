import { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function Verify() {
    const { token, url, discount, isSecondEffectDone } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const nav = useNavigate();

    const hasRun = useRef(false);

    const verifyPayment = async () => {
        const res = await axios.post(url + "/api/order/verify", { success, orderId });

        if (res.data.success) {
            const couponRes = await axios.post(url + "/api/coupons/remove-coupon-user", {}, { headers: { token } });
            nav("/my-orders");
            toast.success("Order placed successfully");
        } else {
            await axios.post(url + "/api/coupons/deactive-coupon", { discount }, { headers: { token } });
            nav("/");
            toast.error("Error when placing order");
        }
    };
    
    useEffect(() => {
        if (!hasRun.current && isSecondEffectDone) {
            verifyPayment();
            hasRun.current = true;
        }
    }, [isSecondEffectDone]); 

    return (
        <section>
            <div className="min-h-[60vh] grid">
                <div className="w-24 h-24 border-4 rounded-full border-t-orange-600 place-self-center animate-spin"></div>
            </div>
        </section>
    );
}
