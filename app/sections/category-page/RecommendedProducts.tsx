"use client";
import Image from "next/image";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

import { CardProps } from "@/config/types";
import { useAlert } from "@/hooks/alertContext";
import CardComponent from "@/components/CardComponent";
import { getProducts } from "@/services/ProductService";
import ProductSceleton from "../category-page/ProductSceleton";

import ImgArrow from "@/images/vectors/arrow.svg";

interface RecommendedSliderProps {
  title?: string;
  productType?: string;
}

const RecommendedSlider = ({
  title = "Можливо, вам сподобається",
  productType = "",
}: RecommendedSliderProps) => {
  const [products, setProducts] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const { setInfoMessage } = useAlert();

  const isMobile = useMediaQuery("(max-width: 767.98px)");
  const isTablet = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023.98px)",
  );
  const isLaptop = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1439.98px)",
  );
  const isXlLaptop = useMediaQuery(
    "(min-width: 1440px) and (max-width: 1919.98px)",
  );
  const isDesktop = useMediaQuery("(min-width: 1920px)");

  const getItemsPerView = () => {
    if (isMobile) return 1;
    if (isTablet) return 3;
    if (isLaptop) return 4;
    if (isXlLaptop) return 5;
    if (isDesktop) return 5;
    return 1;
  };

  const itemsCount = getItemsPerView();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await getProducts(
          {
            productType: productType,
            minPrice: 0,
            maxPrice: 100000,
            searchText: "",
          },
          "",
          12,
          "",
          "BEST_SELLING",
          true,
          true,
          setInfoMessage,
        );
        if (response.products) {
          setProducts(response.products);
          setLoading(true);
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchRecommended();
  }, [productType, setInfoMessage]);

  if (loading && products.length === 0) return null;

  return (
    <section className="py-[60px] lg:py-[100px] border-t border-pearl">
      <div className="flex flex-col mx-[20px] lg:mx-[60px] mb-[40px] gap-[10px]">
        <h2 className="font-frontrunner text-center text-[28px] md:text-[35px] lg:text-[45px] lg:text-left">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-w-full justify-items-center">
        {products.slice(0, itemsCount).map((product) => (
          <CardComponent key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedSlider;
