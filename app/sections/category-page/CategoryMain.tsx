"use client";
import Script from "next/script";
import React, { useState, createContext, useEffect, useMemo } from "react";
import { CardProps } from "@/config/types";
import CategorySection from "./CategorySection";
import { useAlert } from "@/hooks/alertContext";
import { getFilters } from "@/services/ProductService";
import CategoryAsideFilters from "./CategoryAsideFilters";
import { PaginationProvider } from "@/hooks/useCustomPagination";
import RecommendedProducts from "./RecommendedProducts";

export const ProductsContext = createContext<CardProps[]>([]);
const LIMIT = 12;

// Приймаємо початкові товари з сервера через пропси
const CategoryMain = ({
  initialProducts = [],
}: {
  initialProducts?: CardProps[];
}) => {
  const [filters, setFilters] = useState({});

  // Ініціалізація стану даними з сервера (це важливо для SEO)
  const [products, setProducts] = useState<CardProps[]>(initialProducts);
  const [totalProducts, setTotalProducts] = useState<number>(
    initialProducts.length,
  );

  const [isStart, setIsStart] = useState<boolean>(true);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("CREATED_AT");
  const [reverse, setReverse] = useState<boolean>(true);
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const { setInfoMessage } = useAlert();

  const catalogSchema = useMemo(() => {
    if (!products || products.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Каталог годинників",
      description: "Каталог годинників з доставкою по Україні.",
      url: "https://watchstore.pp.ua/catalog",
      mainEntity: {
        "@type": "ItemList",
        name: "Годинники",
        numberOfItems: totalProducts || products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.title,
            image:
              product.image || "https://watchstore.pp.ua/default-watch.jpg",
            sku: product.id?.toString().split("/").pop() || product.id,
            offers: {
              "@type": "Offer",
              price: parseFloat(String(product.price || 0)).toFixed(2),
              priceCurrency: "UAH",
              availability:
                product.quantity > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `https://watchstore.pp.ua/catalog/${product.handle}`,
            },
          },
        })),
      },
    };
  }, [products, totalProducts]);

  useEffect(() => {
    const fetchFilters = async () => {
      const data = await getFilters(setInfoMessage);
      if (data?.priceRange?.values?.[0]?.value?.[1] !== undefined) {
        setFilters(data);
        setIsFilter(true);
      }
    };
    fetchFilters();
  }, [setInfoMessage]);

  const handleChangeTotalProducts = (num: number) => setTotalProducts(num);
  const handleUpdateProducts = (newProducts: CardProps[]) =>
    setProducts(newProducts);
  const handleToggleFilter = (value: boolean) => setIsOpenFilters(value);
  const handleToggleIsSearch = (value: boolean) => setIsSearchLoading(value);

  return (
    <>
      <PaginationProvider>
        <ProductsContext.Provider value={products}>
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
          <div className="mt-20 border-t border-pearl">
            <RecommendedProducts title="Вам також може сподобатись:" />
          </div>
          {products.length > 0 && catalogSchema && (
            <Script
              id="catalog-schema"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(catalogSchema),
              }}
            />
          )}
        </ProductsContext.Provider>
      </PaginationProvider>
    </>
  );
};

export default CategoryMain;
