import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";

export const ShopContext = createContext(null);

export default function ShopContentProvider(props) {
  const [cartItems, setCartItems] = useState({});
  const [color, setColor] = useState({});
  const [size, setSize] = useState({});
  const [token, setToken] = useState("");
  const [all_products, setAll_products] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [isFirstEffectDone, setIsFirstEffectDone] = useState(false);
  const [isSecondEffectDone, setIsSecondEffectDone] = useState(false);

  const url = "https://ecommerce-website-step-style-backend.vercel.app";

  const addToCart = async (itemId, sizeValue, colorValue) => {
    try {
      if (!cartItems[itemId]){
        toast.success("Product added to cart successfully");
      }

      setCartItems((prev) => ({
        ...prev,
        [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
      }));
      setSize((prev) => ({ ...prev, [itemId]: sizeValue }));
      setColor((prev) => ({ ...prev, [itemId]: colorValue.split("-")[0].charAt(0).toUpperCase() + colorValue.split("-")[0].slice(1) }));

      if (token) {
        await axios.post(url + "/api/cart/add", { itemId, size: sizeValue, color: colorValue }, { headers: { token } });
      }
    } catch (error) {
      toast.error("Error adding product to cart");
    }
  };

  const removeCart = async (itemId) => {
    try {
      setCartItems((prev) => {
        const updatedItems = { ...prev };
        let itemRemoved = false;
  
        if (updatedItems[itemId] > 1) {
          updatedItems[itemId] -= 1;
        } else {
          itemRemoved = true;
          delete updatedItems[itemId];
        }
  
        if (itemRemoved) {
          setSize((prev) => {
            const updatedSize = { ...prev };
            delete updatedSize[itemId];
            return updatedSize;
          });
  
          setColor((prev) => {
            const updatedColor = { ...prev };
            delete updatedColor[itemId];
            return updatedColor;
          });
  
          toast.success("Product removed from cart successfully");
        }

        return updatedItems;
      });
  
      if (token) {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      }
    } catch (error) {
      toast.error("Error removing product from cart");
    }
  };

  const calculateTotal = () => {
    let newTotal = 0;
  
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const info = all_products.find((product) => product._id === item);
        if (info) {
          newTotal += info.price * cartItems[item];
        }
      }
    }

    return newTotal;

  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(url + "/api/product/list");
      setAll_products(res.data.data);
    } catch (error) {
      toast.error("Error fetching products");
    }
  };

  const loadCart = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      setCartItems(response.data.cartData);
      setSize(response.data.sizeData);
      setColor(response.data.colorData);
    } catch (error) {
      toast.error("Error loading cart");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);

        await fetchProducts();
        await loadCart(storedToken);
      } else {
        
        await fetchProducts();
      }

      

      setIsFirstEffectDone(true);

    };

    loadData();
  }, []);

  useEffect(() => {
    if (isFirstEffectDone) {
      setIsSecondEffectDone(true)
      calculateTotal();
    }
  }, [isFirstEffectDone, cartItems, all_products]);

  const contextValue = {
    all_products,
    cartItems,
    discount,
    setDiscount,
    setCartItems,
    addToCart,
    removeCart,
    calculateTotal,
    url,
    token,
    setToken,
    calculateQuantity: () => {
      let quantity = 0;
      for (const item in cartItems) {
        if (cartItems[item] > 0 &&  all_products.some(product => product._id === item)) {
          quantity += cartItems[item];
        }
      }
      return quantity;
    },
    color,
    size,
    setCartItems,
    isSecondEffectDone
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
}
