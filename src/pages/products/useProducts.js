import { useEffect, useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("warung_products")) || []);
  }, []);

  const save = (data) => {
    setProducts(data);
    localStorage.setItem("warung_products", JSON.stringify(data));
  };

  const add = (product) => save([product, ...products]);
  const update = (product) =>
    save(products.map(p => p.code === product.code ? product : p));
  const remove = (code) =>
    save(products.filter(p => p.code !== code));

  return { products, add, update, remove };
};
