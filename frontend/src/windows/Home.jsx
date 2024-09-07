import { useEffect, useState, useContext } from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories"; // Fixed spelling here
import ProductDisplay from "../components/ProductDisplay";
import AppGet from "../components/AppGet";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";

export default function Home() {
    const [category, setCategory] = useState("all");

    return (
        <>
            <Hero />
            <Categories category={category} setCategory={setCategory} />
            <ProductDisplay category={category} />
            <AppGet />
            <Footer />
        </>
    );
}
