import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./FullPizza.module.scss"; // Импорт SCSS

const FullPizza = () => {
  const [pizza, setPizza] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          "https://67b7b6bf2bddacfb270fc23c.mockapi.io/items/" + id
        );
        setPizza(data);
      } catch (error) {
        alert("данного товара нет");
        navigate("/");
      }
    }
    fetchPizza();
  }, []);

  if (!pizza) {
    return <div className="container">Загрузка...</div>;
  }

  return (
    <div className="container">
      <img className={styles.pizzaImage} src={pizza.imageUrl} />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} UAH</h4>
    </div>
  );
};

export default FullPizza;
