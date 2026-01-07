import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogData } from "@/config/types";

const BlogCardComponent: FC<BlogData & { className?: string }> = ({
  className,
  id,
  categories,
  heading,
  image,
  description,
  date,
  handle,
}) => {
  return (
    <>
      <Link
        href={`/blog/${handle}`}
        className={`${className} w-[80%] lg:w-[100%] flex flex-col items-center border rounded-lg drop-shadow-lg`}
      >
        {image && (
          <Image
            src={image.originalSrc}
            alt={image.alt || "Blog Image"}
            width={600}
            height={300}
            className="object-cover rounded-t-lg w-full h-[200px] md:h-[300px]"
          />
        )}

        <div className="flex flex-col gap-[12px] px-[12px] md:px-[24px] pt-[24px] pb-[20px] justify-between h-full">
          <div className="flex flex-col gap-[10px]">
            <h3 className="text-[14px] font-bold hover:text-darkBlack md:text-[16px] lg:text-[20px] hover:underline">
              {heading}
            </h3>
            <div className="flex flex-wrap items-center gap-[12px]">
              <p className="text-[#787A80] text-[11px] md:text-[14px]">{date}</p>
              {categories?.map((category, index) => (
                <p
                  key={index}
                  className={
                    "text-darkBlack border-darkBlack border py-[4px] px-[6px] text-[12px] md:text-[14px] rounded-2xl"
                  }
                >
                  {category}
                </p>
              ))}
            </div>
          </div>
          <p className="text-[14px] md:text-[16px] line-clamp-3">
            {description}
          </p>
        </div>
      </Link>
    </>
  );
};

export default BlogCardComponent;
