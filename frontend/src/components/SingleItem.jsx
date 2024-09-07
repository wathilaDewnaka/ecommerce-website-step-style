import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus, FaUpRightAndDownLeftFromCenter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export default function SingleItem({ item }) {
    const { addToCart, cartItems, removeCart, setToken, setCartItems } = useContext(ShopContext);

    // Clear cart and token if cartItems is empty
    if (!cartItems) {
        localStorage.removeItem('token');
        setCartItems({});
        setToken("");
    }

    return (
        <div className="shadow-sm max-w-56">
            <div className="relative group">
                <img 
                    src={item.image || 'fallback-image-url'} 
                    alt={item.name || 'Product Image'} 
                    className="w-full h-60 rounded-tl-2xl rounded-tr-2xl" 
                    loading="lazy"
                />

                <div className="absolute flex justify-center right-3 bottom-3 gap-x-3">
                    <Link to={`/product/${item._id}`} className="w-8 h-8 p-2 bg-white rounded-full shadow-inner cursor-pointer">
                        <FaUpRightAndDownLeftFromCenter />
                    </Link>

                    {!cartItems[item._id] ? (
                        <FaPlus 
                            className="w-8 h-8 p-2 bg-white rounded-full shadow-inner cursor-pointer" 
                            onClick={() => addToCart(item._id, "M", "Black")} 
                        />
                    ) : (
                        <div className="flex justify-center gap-2 bg-white rounded-full">
                            <FaMinus 
                                className="w-8 h-8 p-2 rounded-full cursor-pointer" 
                                onClick={() => removeCart(item._id, "M", "Black")} 
                            />
                            <p>{cartItems[item._id]}</p>
                            <FaPlus 
                                className="w-6 h-6 p-1 mt-1 mr-1 bg-orange-600 rounded-full cursor-pointer" 
                                onClick={() => addToCart(item._id, "M", "Black")} 
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-1 sm:p-3">
                <div className="flex justify-between">
                    <h5 className="text-sm sm:text-[1rem] font-bold text-gray-900/50">{item.category}</h5>
                    <div className="text-yellow-600 text-sm sm:text-[1rem]">Rs. {item.price}</div>
                </div>

                <h4 className="mt-3 mb-1 font-bold medium-18 line-clamp-1 sm:mt-0">{item.name}</h4>
                <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
            </div>
        </div>
    );
}
