"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import Button from "../ButtonComponent";
import { getProductsByTitle } from "@/services/ProductService";

import right from "@/images/vectors/Right.svg";
import searchIcon from "@/images/vectors/search.svg";

const SearchFilterComponents = ({
  additionalClass,
}: {
  additionalClass?: string;
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [productsByTitle, setProductsByTitle] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const selectRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchText);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    const getPorducts = async () => {
      if (debouncedQuery !== "") {
        setLoading(true);
        let data = await getProductsByTitle(debouncedQuery);
        setProductsByTitle(data);
        setLoading(false);
      } else {
        setProductsByTitle([]);
      }
    };
    getPorducts();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        !(event.target instanceof HTMLButtonElement) &&
        !(event.target instanceof HTMLImageElement)
      ) {
        setIsOpen(false);
        setSearchText("");
        setDebouncedQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpenSearch = () => {
    setIsOpen((isOpen) => !isOpen);
    setSearchText("");
    setDebouncedQuery("");
  };

  return (
    <div ref={selectRef} className={`${additionalClass} relative rounded-md`}>
      <button
        className={`absolute rounded-md flex items-center justify-end top-1/2 -translate-y-1/2 right-0 h-[40px] w-[40px]`}
        onClick={toggleOpenSearch}
      >
        <Image
          src={searchIcon}
          alt="search icon"
          width={20}
          height={20}
          className="w-[18px] h-[18px]"
        />
      </button>

      <motion.input
        initial={{
          width: "0",
          visibility: "hidden",
          paddingRight: "0",
          display: "hidden",
        }}
        animate={{
          width: isOpen
  ? window.innerWidth <= 768
    ? "calc(100vw - 80px)"
    : window.innerWidth <= 1024
    ? "400px" 
    : window.innerWidth <= 1440
    ? "280px" 
    : "340px"
  : "0",

          visibility: isOpen ? "visible" : "hidden",
          paddingRight: isOpen ? "38px" : "0",
          display: isOpen ? "block" : "hidden",
        }}
        transition={{
          duration: 0.3,
        }}
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        placeholder="Пошук..."
        className={`border-b bg-white py-2 pl-2 text-[16px] border-b-darkSilver focus:outline-none focus:border-b-[1px] focus:border-b-darkBlack`}
      />

      {isOpen && debouncedQuery && (
        <div className="absolute top-12 rounded-md left-0 w-full h-auto z-50 bg-white border py-1 px-2">
          <div className="flex flex-col items-center justify-start">
            {loading ? (
              <span className="text-center text-[16px] font-medium text-gray-500">
                Завантаження...
              </span>
            ) : productsByTitle && productsByTitle.length > 0 ? (
              productsByTitle.map((prod) => (
                <Link
                  href={`/catalog/${prod.handle}`}
                  onClick={() => setSearchText("")}
                  key={prod.handle}
                  className="group w-full flex flex-row gap-5 justify-start items-center relative py-2 after:absolute after:w-[90%] after:h-[1px] after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:bg-silver after:bg-opacity-15"
                >
                  <Image
                    alt="watch photo"
                    src={prod.image}
                    width={100} 
                    height={110}
                    className="w-20 h-20 rounded-md"
                    quality={100}
                  />

                  <div className="flex flex-col gap-2 items-start ">
                    <span className="text-[14px] group-hover:underline">
                      {prod.title}
                    </span>
                    {prod.discount !== 0 ? (
                      <p className="flex  gap-3">
                        <span className="font-light text-[15px] text-silver line-through">
                          {Number(
                            Number(prod.price) / (1 - prod.discount / 100)
                          )}
                        </span>
                        <span className="text-[15px] text-darkBlack font-medium">
                          {Number(prod.price)} грн
                        </span>
                      </p>
                    ) : (
                      <span className="font-medium text-[15px] text-onyx">
                        {Number(prod.price)} грн
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <span className="text-center text-[16px] font-medium text-gray-500">
                Товарів не знайдено
              </span>
            )}
            {!loading && (
              <div className="w-full flex justify-start items-center group">
                <Button
                  tag="a"
                  text="Перейти в каталог"
                  background="transparent"
                  className="text-[14px] md:text-[16px] font-medium  group-hover:text-onyx  group-hover:font-bold transition-all duration-300 transform !px-[15px] underline decoration-transparent group-hover:decoration-darkBlack decoration-2"
                  href="/catalog"
                />
                <Image
                  src={right}
                  alt="arrow"
                  className="transition-transform duration-300 group-hover:translate-x-5"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterComponents;
