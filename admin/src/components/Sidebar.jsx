import { NavLink } from "react-router-dom";
import { BsPlusSquare, BsCardChecklist, BsCardList } from "react-icons/bs";
import { FaPercentage } from "react-icons/fa";
import { FaCashRegister } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";

export default function Sidebar() {
    const baseClass = "flex justify-center gap-x-2 cursor-pointer h-10 max-w-60 border border-slate-900/15 bg-transparent items-center";
    const activeClass = "ml-5 bg-slate-100";

    return (
        <div className="w-1/5 min-h-screen border-r border-slate-900/10">
            <div className="flex flex-col gap-10 pt-4 sm:pt-10 pl-[20%] w-full">
                
                <NavLink 
                    to="/add" 
                    className={({ isActive }) =>
                        isActive ? `${baseClass} ${activeClass}` : baseClass
                    }
                >
                    <BsPlusSquare aria-label="Add Items" />
                    <p className="hidden lg:flex">Add Items</p>
                </NavLink>

                <NavLink 
                    to="/list" 
                    className={({ isActive }) =>
                        isActive ? `${baseClass} ${activeClass}` : baseClass
                    }
                >
                    <BsCardList aria-label="List" />
                    <p className="hidden lg:flex">List</p>
                </NavLink>

                <NavLink 
                    to="/orders" 
                    className={({ isActive }) =>
                        isActive ? `${baseClass} ${activeClass}` : baseClass
                    }
                >
                    <BsCardChecklist aria-label="Orders" />
                    <p className="hidden lg:flex">Orders</p>
                </NavLink>

                <NavLink 
                    to="/coupons" 
                    className={({ isActive }) =>
                        isActive ? `${baseClass} ${activeClass}` : baseClass
                    }
                >
                    <FaPercentage aria-label="Coupons"/>
                    <p className="hidden lg:flex">Manage Coupons</p>
                </NavLink>

                <NavLink 
                    to="/message" 
                    className={({ isActive }) =>
                        isActive ? `${baseClass} ${activeClass}` : baseClass
                    }
                >
                    <MdMessage aria-label="Messages"/>
                    <p className="hidden lg:flex">Send Messages</p>
                </NavLink>

                <NavLink 
                    to="/register" 
                    className={({ isActive }) =>
                        isActive ? `${baseClass} ${activeClass}` : baseClass
                    }
                >
                    <FaCashRegister aria-label="Coupons"/>
                    <p className="hidden lg:flex">Manage Register</p>
                </NavLink>
            
            </div>
        </div>
    );
}
