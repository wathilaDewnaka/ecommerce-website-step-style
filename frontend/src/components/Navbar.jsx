import { useContext, useState } from "react";
import { MdHomeFilled, MdCategory, MdShop2, MdContacts, MdMenu, MdClose } from "react-icons/md";
import { FaBasketShopping, FaCircleUser } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { FiPackage } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from "../context/ShopContext";

import logo from "../assets/logo.png";


export default function Navbar({setShowLogin}) {
  const [isActive, setIsActive] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const { calculateQuantity, token, setToken } = useContext(ShopContext)

  
  const nav = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    nav("/")
  }
  
  return (
    <header className="fixed left-0 right-0 z-40 h-10 mx-auto">
      <div className="bg-white max-padd-container">
        <div className="flex justify-between py-4 max-xs:px-2">
          <div className="flex justify-center pt-2 gap-x-20">
            <Link to={"/"}>
              <img src={logo} alt="Logo" height={75} width={100} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-x-5 xl:gap-x-10 medium-15">
              <a
                href="/#home"
                onClick={() => setIsActive("home")}
                className={isActive === "home" ?  "active-link" : "" }
              >
                <div className="flex items-center justify-center pt-3 transition-all duration-100 gap-x-1 active-link">
                  <MdHomeFilled /> Home
                </div>
              </a>

              <a
                href="/#shop"
                onClick={() => setIsActive("shop")}
                className={isActive === "shop" ? "active-link" : "" }
              >
                <div className="flex items-center justify-center pt-3 transition-all duration-100 gap-x-1 active-link">
                  <MdShop2 /> Shop
                </div>
              </a>

              <a
                href="/#app"
                onClick={() => setIsActive("app")}
                className={isActive === "app" ? "active-link" : ""}
              >
                <div className="flex items-center justify-center pt-3 transition-all duration-100 gap-x-1 active-link">
                  <MdCategory /> Get App
                </div>
              </a>
              <a
                href="/#contact"
                onClick={() => setIsActive("contact")}
                className={isActive === "contact" ? "active-link" : ""}
              >
                <div className="flex items-center justify-center pt-3 transition-all duration-100 gap-x-1 active-link">
                  <MdContacts /> Contact
                </div>
              </a>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <nav
            className={`md:hidden fixed top-20 right-8 p-12 bg-white rounded-3xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-transform transition-opacity duration-300 ease-out ${
              mobileMenu ? "opacity-100 translate-x-0 flex items-center flex-col gap-y-12" : "opacity-0 translate-x-full"
            }`}
          >
            <a
              href="/#home"
              onClick={() => setIsActive("home")}
              className={isActive === "home" ? "active-link" : ""}
            >
              <div className="flex items-center justify-center transition-all duration-100 gap-x-1 active-link">
                <MdHomeFilled /> Home
              </div>
            </a>
            <a
              href="/#shop"
              onClick={() => setIsActive("shop")}
              className={isActive === "shop" ? "active-link" : ""}
            >
              <div className="flex items-center justify-center transition-all duration-100 gap-x-1 active-link">
                <MdShop2 /> Shop
              </div>
            </a>
            <a
              href="/#app"
              onClick={() => setIsActive("app")}
              className={isActive === "app" ? "active-link" : ""}
            >
              <div className="flex items-center justify-center transition-all duration-100 gap-x-1 active-link">
                <MdCategory /> Get App
              </div>
            </a>
            <a
              href="/#contact"
              onClick={() => setIsActive("contact")}
              className={isActive === "contact" ? "active-link" : ""}
            >
              <div className="flex items-center justify-center transition-all duration-100 gap-x-1 active-link">
                <MdContacts /> Contact
              </div>
            </a>
          </nav>

          {/* Mobile Menu Toggle and Other Elements */}
          <div className="flex items-center justify-center pt-2 ml-6 mr-4 gap-x-6">
            {/* Mobile Menu Icon */}
            {!mobileMenu ? (
              <MdMenu
                onClick={() => setMobileMenu(!mobileMenu)}
                className="mb-1 text-2xl cursor-pointer md:hidden hover:text-secondary"
                aria-label="Open Menu"
              />
            ) : (
              <MdClose
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-2xl cursor-pointer md:hidden hover:text-secondary"
                aria-label="Close Menu"
              />
            )}

            {/* Shopping Cart and Login Button */}
            <div className="flex items-center justify-between gap-x-2 sm:gap-x-5">
              <Link to={"/cart"} className="pt-3 pr-3 sm:pr-0">
                <FaBasketShopping className="text-xl" aria-label="Shopping Cart" />
                <span className="relative flex justify-center w-5 h-5 pb-1 text-white bg-orange-600 rounded-full text-md -top-7 -right-3">{calculateQuantity()}</span>
              </Link>
              
            {token === "" ? (<button className="px-4 py-2 mb-2 ml-4 text-gray-500 transition duration-300 border border-gray-500 rounded-full btn-outline hover:bg-gray-500 hover:text-white" onClick={() => setShowLogin(true)}>
              Login
            </button>) : 
              <div className="relative group">
                <FaCircleUser className="text-2xl cursor-pointer" />
              
                <ul className="absolute right-0 flex-col hidden w-24 p-3 transition-opacity duration-300 ease-in-out rounded shadow-sm opacity-0 bg-white/90 backdrop-blur-sm ring-1 ring-slate-900/10 group-hover:flex group-hover:opacity-100">
                  <li className="flex justify-center pt-2 cursor-pointer gap-x-2" onClick={() => nav("/my-orders")}>
                    <FiPackage className="text-[19px]" />
                    <p>Orders</p>
                  </li>
              
                  <hr className="my-2" />
              
                  <li onClick={logout} className="flex justify-center cursor-pointer gap-x-2">
                    <TbLogout className="text-[19px]" />
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            
              
            }
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}