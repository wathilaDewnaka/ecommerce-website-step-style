import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbArrowRight } from "react-icons/tb";
import { LuMoveUpRight } from "react-icons/lu";
import { FaPlus, FaMinus } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import Error from "../windows/Error";

export default function Product() {
  const { all_products, addToCart, removeCart, url, cartItems } = useContext(ShopContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = all_products.find((e) => e._id === productId);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) {
    return <Error />;
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      addToCart(product._id, selectedSize, selectedColor);
    } else {
      addToCart(product._id, "M", "Black");
    }
  };

  const handleRemoveFromCart = () => {
    if (selectedColor && selectedSize) {
      removeCart(product._id, selectedSize, selectedColor);
    } else {
      removeCart(product._id, "M", "Black")
    }
  };

  return (
    <section className="px-2 py-24 sm:px-10 max-padd-container">
      <div className="flex flex-wrap items-center px-2 py-4 mt-3 font-bold capitalize bg-gray-200 sm:px-10 text-md max-padd-container gap-x-2 medium-16">
        <span className="cursor-pointer" onClick={() => (navigate("/"))}>Home </span><TbArrowRight /> {product.name}
      </div>

      <section className="flex flex-col gap-8 px-2 py-4 bg-gray-200 max-padd-container xl:flex-row">
        <div className="flex py-5 ml-0 sm:ml-10 xl:flex-1 gap-x-2">
          <div className="flex flex-col justify-center gap-[7px] bg-gray-200 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-[430px] rounded-lg bg-gray-200 w-[400px]"
            />
          </div>
        </div>

        <div className="flex flex-col xl:flex-[1.5] bg-white px-6 py-2 rounded-xl mr-0 sm:mr-10 shadow-lg pb-10">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-baseline mt-3 text-2xl font-bold text-gray-800 gap-x-6">
            <div>Rs. {product.price}.00</div>
          </div>
          <p className="mt-4 text-gray-600 lg:pr-10">
            {product.description || "A premium quality product crafted with care and precision to meet your expectations."}
          </p>

          <div className="my-6">
            <h4 className="mb-2 text-xl font-semibold text-gray-800">Select Color:</h4>
            <div className="flex gap-3">
              {["black", "gray-200", "yellow-300", "orange-600"].map((color) => (
                <div
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 bg-${color} border rounded-sm cursor-pointer ${
                    selectedColor === color ? "ring-2 ring-black" : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <div className="my-6">
            <h4 className="mb-2 text-xl font-semibold text-gray-800">Select Size:</h4>
            <div className="flex gap-3">
              {["S", "M", "L", "XL"].map((size) => (
                <div
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`flex items-center justify-center w-10 h-10 border rounded-sm cursor-pointer ${
                    selectedSize === size ? "ring-2 ring-black" : ""
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-y-2 gap-4 mb-8 max-w-[555px] flex-wrap sm:flex-row">
            <button 
              onClick={() => navigate("/cart")} 
              className="flex justify-center py-2 text-white transition-colors bg-black rounded-sm sm:px-20 gap-x-2 hover:bg-gray-800"
            >
              Go To Cart <LuMoveUpRight className="text-xl" />
            </button>

            {!cartItems[product._id] ? (
              <FaPlus 
                onClick={handleAddToCart} 
                className="text-white bg-black rounded-sm h-[38px] w-[38px] p-2 cursor-pointer hover:bg-gray-800 transition-colors"
              />
            ) : (
              <div className="flex justify-center text-white bg-black rounded-sm gap-y-2 itm max-w-24">
                <FaMinus 
                  onClick={handleRemoveFromCart} 
                  className="w-8 h-8 p-2 transition-colors cursor-pointer hover:bg-gray-800"
                />
                <p className="pr-2">{cartItems[product._id]}</p>
                <FaPlus 
                  onClick={handleAddToCart} 
                  className="text-white bg-orange-600 rounded-sm h-[38px] w-[38px] p-2 cursor-pointer hover:bg-orange-500 transition-colors"
                />
              </div>
            )}
          </div>

          <p className="text-gray-700">Category: {product.category}</p>
        </div>
      </section>

      <div className="mt-20 max-padd-container">
        <div className="h-8 mb-3 text-center text-white bg-black w-52">Product Description</div>
        <div className="flex pt-3 pb-16">
          <p className="text-gray-600 text-md lg:pr-10">{product.description} The default color will be black and the default size is Medium !</p>
        </div>
        
      </div>
    </section>
  );
}
