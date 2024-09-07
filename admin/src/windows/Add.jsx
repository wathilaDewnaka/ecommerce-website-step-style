import { useEffect, useState } from "react";
import upload from "../assests/upload.jpg";
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';

export default function Add({ url }) {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Women"
    });
    const [loading, setLoading] = useState(false); // New loading state
    const nav = useNavigate();

    const changeHandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((data) => ({
            ...data, [name]: value
        }));
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 0.05, // Maximum size in MB
            maxWidthOrHeight: 750, // Maximum width or height
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Image compression error:", error);
            return file; // Return the original file if compression fails
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when the request starts

        const token = localStorage.getItem('admintoken');

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("price", data.price);

        if (image) {
            const compressedImage = await compressImage(image);
            formData.append("image", compressedImage);
        }

        try {
            const response = await axios.post(`${url}/api/product/add`, formData, { headers: { token } });
            console.log(response)
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Women"
                });
                setImage(null);
                toast.success(response.data.message);
            } else {
                if (response.data.message === "NULL") {
                    nav("/");
                }
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error adding product");
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('admintoken');
            console.log(token)
            try {
                const res = await axios.get(`${url}/api/admin/validate`, {
                    headers: { token }
                });

                console.log(res)
                
                if (!res.data.success) {
                    localStorage.removeItem("admintoken");
                    window.location.href = "http://localhost:5174";
                }
            } catch (error) {
                console.log(error)
                localStorage.removeItem("admintoken");
                window.location.href = "http://localhost:5174";
            }
        };

        load();
    }, [nav, url]);

    return (
        <section className="w-full p-4 bg-slate-50 sm:p-10">
            <form onSubmit={submitHandler} className="flex flex-col gap-y-5 max-w-[555px]">
                <h4 className="pb-2 text-2xl font-bold uppercase">Products Upload</h4>

                <div className="flex flex-col h-24 gap-y-2 max-w-100">
                    <p>Upload Product Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : upload}
                            alt="upload-context"
                            className="h-24 cursor-pointer"
                        />
                    </label>
                    <input
                        type="file"
                        id="image"
                        hidden
                        required
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className="flex flex-col py-3 gap-y-2 max-w-100">
                    <p>Product Name</p>
                    <input
                        onChange={changeHandle}
                        value={data.name}
                        type="text"
                        name="name"
                        placeholder="Type here..."
                        className="px-3 py-1 outline-none ring-1 ring-slate-900/10"
                        required
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <p>Product Description</p>
                    <textarea
                        onChange={changeHandle}
                        value={data.description}
                        name="description"
                        rows="6"
                        placeholder="Write content here..."
                        className="px-3 py-1 outline-none resize-none ring-1 ring-slate-900/10"
                        required
                    />
                </div>

                <div className="flex items-center medium-10 gap-x-6">
                    <div className="flex flex-col gap-y-2">
                        <p>Product Category</p>
                        <select
                            onChange={changeHandle}
                            value={data.category}
                            name="category"
                            className="pl-2 outline-none ring-1 ring-slate-900/10"
                        >
                            <option value="Women">Women</option>
                            <option value="Men">Men</option>
                            <option value="Boys">Boys</option>
                            <option value="Girls">Girls</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <p>Product Price</p>
                        <input
                            onChange={changeHandle}
                            value={data.price}
                            type="number"
                            placeholder="Rs. 1000"
                            name="price"
                            className="w-24 pl-2 outline-none ring-1 ring-slate-900/10"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center py-2 text-white bg-black rounded text-wrap sm:w-5/12 gap-x-2"
                    disabled={loading} // Disable button when loading is true
                >
                    <FaPlus />
                    {loading ? "Adding..." : "Add Product"} {/* Change button text when loading */}
                </button>
            </form>
        </section>
    );
}
