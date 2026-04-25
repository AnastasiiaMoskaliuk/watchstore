"use client";
import Link from "next/link";
import Image from "next/image";
import React, { FC, useState } from "react";

import { CardProps } from "@/config/types";
import { useCart } from "@/hooks/useCart";

import Basket from "@/images/card-component/busket.svg";

const CardComponent: FC<CardProps & { className?: string }> = ({
  className,
  id,
  handle,
  title,
  price,
  discount,
  image,
  quantity,
}) => {
  const { addToCart, isOpen, changeOpenState } = useCart();

  const handleAddToBasket = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("add_to_backet"));
    !isOpen && changeOpenState(true);

    addToCart(
      {
        id: id,
        handle: handle,
        title: title,
        price: +price,
        image: image,
        quantity: 1,
        maxQuantity: quantity,
      },
      1
    );
  };

  return (
    <Link
      href={`/catalog/${handle}`}
      className={`${className} group/card relative flex flex-col items-center justify-between gap-[10px] font-poppins w-[250px]`}>
      <div className="relative rounded-md overflow-hidden ">
        {discount !== 0 && (
          <div className="absolute z-10 bg-[red] text-white rounded-md px-2 py-1 top-2 left-2 font-semibold">
            - {discount}%
          </div>
        )}
        <div className="w-[250px] h-[240px] md:h-[320px] ">
          <Image
            src={image}
            width={250}
            height={440}
            alt={`image of ${title}`}
            className="object-cover h-[240px] md:h-[320px] group-hover/card:scale-110 duration-300"
            loading="lazy"
            fetchPriority="high"
          />
        </div>
        {quantity > 0 ? null : (
          <div className="absolute w-full h-full top-0 left-0 z-[2] bg-black bg-opacity-40 flex items-center justify-center">
            <span className="w-2/3 text-center py-1 px-2 text-[24px] leading-none text-white bg-darkSilver rounded-lg">
              Немає в наявності!
            </span>
          </div>
        )}

        <button
          onClick={(e) => handleAddToBasket(e, id)}
          className="absolute group bg-[#ffffff] border border-darkSilver font-default rounded-full w-[50px] h-[50px] bottom-2 right-2 flex justify-center items-center hover:bg-darkBlack hover:border-[#fff] duration-300">
          <Image
            src={Basket}
            width={30}
            height={30}
            alt="basket image"
            className="w-[28px] h-[28px] group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert transition duration-300"
          />
        </button>
      </div>

      <span className=" text-silver text-default text-center group-hover/card:underline group-hover/card:text-onyx transition-all duration-300">{title}</span>
      {discount !== 0 ? (
        <p className="flex gap-3">
          <span className="font-light text-xl text-silver line-through">
            {Number(Number(price) / (1 - discount / 100)).toFixed(2)}
          </span>
          <span className="text-xl text-darkBlack font-medium">
            {Number(price)} грн
          </span>
        </p>
      ) : (
        <span className="font-normal text-xl text-onyx">
          {Number(price)} грн
        </span>
      )}
    </Link>
  );
};

export default CardComponent;
