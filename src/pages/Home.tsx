import React, { useContext, useEffect } from "react";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../Pagination/Pagination";
import { SearchContext } from "../App";
import { useSelector } from "react-redux";
import { setCategoryId, setCurrentPage } from "../redux/slices/filterSlice";
import { fetchPizzas, Pizza } from "../redux/slices/pizzaSlice";
import { useAppDispatch } from "../redux/store";
import { RootState } from "../redux/store";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const categoryId = useSelector((state: RootState) => state.filter.categoryId);
  const sortType = useSelector(
    (state: RootState) => state.filter.sort.sortProperty
  );
  const currentPage = useSelector(
    (state: RootState) => state.filter.currentPage
  );
  const { items, status } = useSelector((state: RootState) => state.pizza);
  const { searchValue } = useContext(SearchContext);

  const onChangeCategory = (id: number): void => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number: number): void => {
    dispatch(setCurrentPage(number));
  };

  const getPizzas = async (): Promise<void> => {
    const order = sortType.includes("-") ? "asc" : "desc";
    const sortBy = sortType.replace("-", "");
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    dispatch(
      fetchPizzas({
        order,
        sortBy,
        category,
        search,
        currentPage,
      })
    );

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getPizzas();
  }, [categoryId, sortType, searchValue, currentPage]);

  const pizzas = items.map((obj: Pizza) => (
    <PizzaBlock key={obj.id} {...obj} />
  ));
  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕 </h2>
          <p>Не удалось получить запрос</p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
