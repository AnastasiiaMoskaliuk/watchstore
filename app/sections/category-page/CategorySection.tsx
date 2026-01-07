"use client";
import { motion } from "framer-motion";
import { usePagination } from "@mantine/hooks";
import React, { useContext, useEffect, useState } from "react";

import { CardProps } from "@/config/types";
import ProductSceleton from "./ProductSceleton";
import { ProductsContext } from "./CategoryMain";
import CardComponent from "@/components/CardComponent";
import CustomSelect from "@/components/SelectComponent";
import { useCustomPagination } from "@/hooks/useCustomPagination";
import { all } from "axios";
import Button from "@/components/ButtonComponent";
import LoaderComponent from "@/components/LoaderComponent";

const CategorySection = ({
  isFilter,
  totalProducts,
  limit,
  sort,
  reverse,
  setSort,
  setReverse,
  isStart,
  handleToggleFilter,
  isOpenFilters,
  isSearchLoading,
}: {
  isFilter: boolean;
  totalProducts: number;
  limit: number;
  sort: string;
  reverse: boolean;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
  isStart: boolean;
  handleToggleFilter: (value: boolean) => void;
  isOpenFilters: boolean;
  isSearchLoading: boolean;
}) => {
  const { goToPage, currentPage } = useCustomPagination();
  const allProducts = useContext(ProductsContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isStart) {
      if (allProducts.length != 0) {
        setTimeout(() => {
          setIsLoading(false);
        }, 30);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 21000);
      }
    }
  }, [allProducts]);

  useEffect(() => {
    if (currentPage === 1) {
      pagination.setPage(0);
      goToPage(1);
    }
  }, [currentPage]);

  const pagination = usePagination({
    total: Math.ceil(totalProducts / limit),
    initialPage: 1,
    siblings: 1,
    boundaries: 1,
  });

  const generatePaginationRange = () => {
    const range = [];
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = pagination.active;
    if (currentPage !== 1) {
      range.push(1);
    }
    if (currentPage > 3) {
      range.push("...");
    }
    if (currentPage > 2) {
      range.push(currentPage - 1);
    }
    range.push(currentPage);
    if (currentPage < totalPages - 1) {
      range.push(currentPage + 1);
    }
    if (currentPage === totalPages - 1) {
      range.push(totalPages);
    }
    if (currentPage < totalPages - 2) {
      range.push("...");
    }
    return range;
  };

  const handleChangePage = (range: number) => {
    pagination.setPage(range);
    goToPage(range);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleChangeSorting = (value: string) => {
    let newValue = value == "HPRICE" || value == "LPRICE" ? "PRICE" : value;

    if (value === "HPRICE") setReverse(true);
    if (value === "LPRICE") setReverse(false);
    if (value === null || value === "") {
      setReverse(true);
      newValue = "CREATED_AT";
    }

    setSort(newValue);
  };

  return (
    <section className="px-5 lg:px-[60px] md:px-[30px] xl:pr-[0px] xl:pt-[43px] pb-[70px] flex-1">
      <div
        className={`${
          !isFilter ? "opacity-0" : "opacity-100"
        } xl:opacity-100 flex sticky bg-white z-40 xl:z-10 top-0 py-5 left-0 xl:relative h-auto flex-row items-center justify-center mini:justify-between flex-wrap gap-5 xl:justify-end`}>
        <Button
          className="!w-52 py-[12px] md:py-[22px] xl:hidden"
          text="Фільтри"
          onClick={() => handleToggleFilter(true)}
        />

        <CustomSelect
        className="!w-52 "
          left
          placeholder="Сортувати за"
          options={[
            { value: "CREATED_AT", label: "Новинки" },
            { value: "HPRICE", label: "Дорощі товари" },
            { value: "LPRICE", label: "Дешевші товари" },
            { value: "BEST_SELLING", label: "Топ продажів" },
          ]}
          onSelect={handleChangeSorting}
          sort={sort}
        />
      </div>

      {isLoading ? (
        <div className="mt-[32px] grid grid-cols-1 justify-center place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {Array.from({ length: limit }, (_, index) => (
            <ProductSceleton key={index} />
          ))}
        </div>
      ) : isSearchLoading ? (
        <LoaderComponent />
      ) : allProducts.length === 0 && !isStart ? (
        <motion.div
          className="text-center text-gray-500 text-lg py-[40px] lg:py-[60px] lg:text-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}>
          Товару з даними характеристиками не знайдено
        </motion.div>
      ) : (
        <>
          <div className="w-full mt-[32px] flex flex-wrap justify-around gap-[30px]  ">
            {allProducts.map((card: CardProps) => (
              <CardComponent {...card} key={card.id} />
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-10 items-center text-[18px]">
            <button
              disabled={pagination.active === 1}
              onClick={() => handleChangePage(pagination.active - 1)}
              className="h-7 w-3 text-darkBlack rounded-sm disabled:opacity-0 hover:font-extrabold">
              &lt;
            </button>
            {generatePaginationRange().map((range, index) =>
              range === "..." ? (
                <button
                  key={index}
                  className="h-[28px] rounded-sm text-center text-[10px] bg-pearl text-silver px-2">
                  ...
                </button>
              ) : (
                <button
                  key={index}
                  className={`h-7 w-7 rounded-sm ${
                    pagination.active === range
                      ? "bg-darkBlack text-white"
                      : "bg-pearl text-silver hover:font-bold"
                  }`}
                  onClick={() => handleChangePage(range as number)}>
                  {range}
                </button>
              )
            )}
            <button
              disabled={pagination.active === Math.ceil(totalProducts / limit)}
              onClick={() => handleChangePage(pagination.active + 1)}
              className="h-7 w-3 text-darkBlack rounded-sm disabled:opacity-0 hover:font-extrabold ">
              &gt;
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default CategorySection;
