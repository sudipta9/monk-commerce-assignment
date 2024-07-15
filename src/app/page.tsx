"use client";
import AddProduct from "@/components/addProduct";
import ProductList from "@/components/productList";
import { Product } from "@/types/products";
import React from "react";

const HomePage = () => {
  const [products, setProducts] = React.useState<Product[]>([]);

  return (
    // applying drawer context here so that we can open the add product drawer from product list
    <>
      <ProductList products={products} setProducts={setProducts} />
      <AddProduct products={products} setProducts={setProducts} />
    </>
  );
};

export default HomePage;
