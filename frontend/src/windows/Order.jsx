import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";

export default function Order() {
    const { calculateTotal, all_products, cartItems, token, url, discount, size, color, setDiscount, isSecondEffectDone } = useContext(ShopContext);
    const nav = useNavigate();

    const getTotalDiscount = async () => {
        const res = await axios.post(url + "/api/coupons/get-discount", {}, { headers: { token } });
        setDiscount(res.data.discount);

        if(!res.data.success){
            setDiscount(0)
        }
    };

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    });

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("Stripe"); // Default to Stripe

    useEffect(() => {
        axios.get("https://restcountries.com/v3.1/all").then((response) => {
            const countryOptions = response.data.map((country) => ({
                value: country.name.common,
                label: country.name.common,
            }));
            setCountries(countryOptions);
        });
        
    }, []);

    useEffect(() => {
        if(isSecondEffectDone){
            getTotalDiscount()
            
        }
    },[isSecondEffectDone])

    
    useEffect(() => {
        if (selectedCountry) {
            axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
                country: selectedCountry
            })
            .then((response) => {
                const cityOptions = response.data.data.map((city) => ({
                    value: city,
                    label: city,
                }));
                setCities(cityOptions);
            })
            .catch((error) => {
                console.error("Error fetching cities:", error);
                setCities([]);
            });
        }
    }, [selectedCountry]);

    const changeHandle = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption.value);
        setData((prevData) => ({ ...prevData, country: selectedOption.value, city: "" }));
        setCities([]); // Clear cities when country changes
    };

    const handleCityChange = (selectedOption) => {
        setData((prevData) => ({ ...prevData, city: selectedOption.value }));
    };

    const handlePaymentMethodChange = (selectedOption) => {
        setPaymentMethod(selectedOption.value);
    };

    const placeOrder = async (event) => {
        event.preventDefault();

        let orderItems = [];

        all_products.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id], size: size[item._id], color: color[item._id] };
                
                // Remove description and image
                delete itemInfo.description;
                delete itemInfo.image;
                
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: calculateTotal(),
            discount: discount,
            paymentMethod: paymentMethod // Include payment method in the order data
        };

        try {
            if (paymentMethod === "COD") {
                // For COD, just place the order and redirect
                let res = await axios.post(url + "/api/order/place/", orderData, {
                    headers: { token },
                });

                if (res.data.success) {
                    const { session_url } = res.data;
                    window.location.replace(session_url);
                } else {
                    toast.error("Error placing the order.");
                }
            } else if (paymentMethod === "Stripe") {
                // For Stripe, handle the Stripe payment flow
                let res = await axios.post(url + "/api/order/place/", orderData, {
                    headers: { token },
                });

                if (res.data.success) {
                    const { session_url } = res.data;
                    window.location.replace(session_url);
                } else {
                    toast.error("Error placing the order.");
                }
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error("Order placement failed.");
        }
    };

    return (
        <section className="max-padd-container py-28 xl:py-32">
            <form className="flex flex-col gap-20 px-2 sm:px-5 xl:flex-row xl:gap-28" onSubmit={placeOrder}>
                <div className="flex flex-col flex-1 gap-3 text-[95%]">
                    <h3 className="mb-4 ml-2 text-2xl font-bold sm:text-3xl">Delivery Information</h3>
                    <div className="flex gap-3">
                        <input
                            onChange={changeHandle}
                            name="firstName"
                            value={data.firstName}
                            type="text"
                            placeholder="First name"
                            required
                            className="w-1/2 h-10 p-1 pl-3 rounded-sm outline-none ring-1 ring-slate-900/15"
                        />
                        <input
                            onChange={changeHandle}
                            name="lastName"
                            value={data.lastName}
                            type="text"
                            placeholder="Last name"
                            required
                            className="w-1/2 h-10 p-1 pl-3 rounded-sm outline-none ring-1 ring-slate-900/15"
                        />
                    </div>

                    <input
                        onChange={changeHandle}
                        name="email"
                        value={data.email}
                        type="email"
                        placeholder="Email address"
                        required
                        className="h-10 p-1 pl-3 rounded-sm outline-none ring-1 ring-slate-900/15"
                    />
                    <input
                        type="text"
                        onChange={changeHandle}
                        name="phone"
                        value={data.phone}
                        placeholder="Phone number"
                        required
                        className="h-10 p-1 pl-3 rounded-sm outline-none ring-1 ring-slate-900/15"
                    />

                    <input
                        onChange={changeHandle}
                        name="street"
                        value={data.street}
                        type="text"
                        placeholder="Street"
                        required
                        className="h-10 p-1 pl-3 rounded-sm outline-none ring-1 ring-slate-900/15"
                    />

                    <div className="flex gap-3">
                        <Select
                            options={countries}
                            value={countries.find((option) => option.value === data.country)}
                            onChange={handleCountryChange}
                            placeholder="Country"
                            className="w-1/2"
                            required
                        />
                        <Select
                            options={cities}
                            value={cities.find((option) => option.value === data.city)}
                            onChange={handleCityChange}
                            placeholder="City"
                            className="w-1/2"
                            required
                            isDisabled={!selectedCountry}
                        />
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            onChange={changeHandle}
                            name="zipcode"
                            value={data.zipcode}
                            placeholder="ZIP Code"
                            required
                            className="w-1/2 h-10 p-1 pl-3 rounded-sm outline-none ring-1 ring-slate-900/15"
                        />
                        <input
                            type="text"
                            onChange={changeHandle}
                            name="state"
                            value={data.state}
                            placeholder="State"
                            required
                            className="w-1/2 h-10 p-1 pl-3 rounded-sm outline-none ring-1 ring-slate-900/15"
                        />
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <div className="flex flex-col gap-2">
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
                                <h4>Rs. {discount}</h4>
                            </div>
                            <hr />

                            <div className="flex justify-between py-3">
                                <h4 className="text-xl font-bold">Total :</h4>
                                <h4 className="text-xl font-bold">
                                    Rs. {calculateTotal() > 0 ? calculateTotal() - discount + 350 : calculateTotal()}
                                </h4>
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <Select
                                    options={[
                                        { value: "Stripe", label: "Pay with Card" },
                                        { value: "COD", label: "Cash on Delivery" }
                                    ]}
                                    value={{ value: paymentMethod, label: paymentMethod === "COD" ? "Cash on Delivery" : "Pay with Card" }}
                                    onChange={handlePaymentMethodChange}
                                    placeholder="Select Payment Method"
                                    className="w-2/3"
                                    required
                                />

                                <button type="submit" className="w-2/3 py-2 text-white bg-orange-600">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}
