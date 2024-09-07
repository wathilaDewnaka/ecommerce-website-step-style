import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import SingleItem from "./SingleItem";
import { useState } from "react";
import { useEffect } from "react";

export default function ProductDisplay({ category }) {
  const { all_products } = useContext(ShopContext);

  // Define the desired order of categories
  const categoryOrder = ["Men", "Women", "Boys", "Girls"];

  // Sort products based on the desired order
  const sortedProducts = all_products
    .filter(item => category === "all" || category === item.category)
    .sort((a, b) => {
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });

    // State to handle loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (all_products.length === 0) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [all_products]);
    
    if (loading) {
        return (
            <section>
                <div className="min-h-[60vh] grid">
                    <div className="w-24 h-24 border-4 rounded-full border-t-orange-600 place-self-center animate-spin"></div>
                    <p className="text-center">Products are loading...</p>
                </div>
            </section>
        );
    }

  return (
    <div className="px-5 pt-8 pb-16 sm:px-10 max-padd-container xl:pb-28">
      <h2 className="text-2xl font-bold sm:text-3xl">Our Greatest Products</h2>
      <div className="grid grid-cols-2 gap-8 mt-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {sortedProducts.map((item) => (
          <div key={item._id}>
            <SingleItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
