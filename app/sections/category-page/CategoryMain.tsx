"use client";
import Script from "next/script";
import React, { useState, createContext, useEffect } from "react";

import { CardProps } from "@/config/types";
import CategorySection from "./CategorySection";
import { useAlert } from "@/hooks/alertContext";
import { getFilters } from "@/services/ProductService";
import CategoryAsideFilters from "./CategoryAsideFilters";
import TitleComponents from "@/components/TitleComponents";
import { PaginationProvider } from "@/hooks/useCustomPagination";

export const ProductsContext = createContext<CardProps[]>([]);
const LIMIT = 12;

const CategoryMain = () => {
  const [filters, setFilters] = useState({});
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [products, setProducts] = useState<CardProps[]>([]);
  const [isStart, setIsStart] = useState<boolean>(true);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("CREATED_AT");
  const [reverse, setReverse] = useState<boolean>(true);

  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Годинники для кожного моменту",
    numberOfItems: totalProducts,
    itemListElement: products.map((product: CardProps, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://watchstore.pp.ua/catalog/${product.handle}`,
      name: product.title,
      image: product.image,
    })),
  };
  
  const { setInfoMessage } = useAlert();

  useEffect(() => {
    const fetchFilters = async () => {
      const data = await getFilters(setInfoMessage);

      console.log("filters response:", data);
      const maxPrice = data?.priceRange?.values?.[0]?.value?.[1];

      if (maxPrice !== undefined && maxPrice !== 10) {
        setFilters(data);
        setIsFilter(true);
      }
    };
    fetchFilters();
  }, []);

  const handleChangeTotalProducts = (num: number) => {
    setTotalProducts(num);
  };

  const handleUpdateProducts = (newProducts: CardProps[]) => {
    setProducts(newProducts);
  };

  const handleToggleFilter = (value: boolean) => {
    setIsOpenFilters(value);
  };

  const handleToggleIsSearch = (value: boolean) => {
    setIsSearchLoading(value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isOpenFilters) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [isOpenFilters]);

  return (
    <>
      <PaginationProvider>
        <ProductsContext.Provider value={products}>
          <TitleComponents
            text="Годинники для кожного моменту"
            additionalText={`Кількість годинників: ${totalProducts} `}
          />
          <div className="xl:flex xl:pr-[60px] xl:pl-[75px]">
            <CategoryAsideFilters
              isFilter={isFilter}
              handleUpdateProducts={handleUpdateProducts}
              handleChangeTotalProducts={handleChangeTotalProducts}
              limit={LIMIT}
              filtersData={filters}
              sort={sort}
              setSort={setSort}
              reverse={reverse}
              setReverse={setReverse}
              setIsStart={setIsStart}
              handleToggleFilter={handleToggleFilter}
              isOpenFilters={isOpenFilters}
              isSearchLoading={isSearchLoading}
              handleToggleIsSearch={handleToggleIsSearch}
            />
            <CategorySection
              isFilter={isFilter}
              isStart={isStart}
              totalProducts={totalProducts}
              limit={LIMIT}
              setSort={setSort}
              setReverse={setReverse}
              reverse={reverse}
              sort={sort}
              handleToggleFilter={handleToggleFilter}
              isOpenFilters={isOpenFilters}
              isSearchLoading={isSearchLoading}
            />
          </div>
          <Script
            id="category-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(categorySchema),
            }}
          />
        </ProductsContext.Provider>
      </PaginationProvider>
    </>
  );
};

export default CategoryMain;
