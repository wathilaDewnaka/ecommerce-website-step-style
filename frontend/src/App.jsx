import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./windows/Home";
import LoginPopup from "./components/LoginPopup";
import Cart from "./windows/Cart";
import Error from "./windows/Error"
import Verify from "./windows/Verify";
import MyOrders from "./windows/MyOrders";
import Order from "./windows/Order";
import Product from './components/Product';

function App() {
    const [login, setShowLogin] = useState(false);

    return (
      <Router>
        <ToastContainer/>
        {login ? <LoginPopup setShowLogin={setShowLogin} /> : null}
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path='/product/:productId' element={<Product/>}/>
          <Route path="/order" element={<Order/>} />
          <Route path="/verify" element={<Verify/>}/>
          <Route path="/my-orders" element={<MyOrders/>}/>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </Router>
    );
}

export default App
