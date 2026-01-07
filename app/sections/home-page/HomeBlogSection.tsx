"use client";
import React, { useState, useEffect } from "react";

import { BlogData } from "@/config/types";
import { getShortBlogs } from "@/services/BlogService";

import Button from "@/components/ButtonComponent";
import BlogCardComponent from "@/components/blog-page/BlogCardComponent";

const HomeBlogSection = () => {
  const [blogsData, setBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await getShortBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="container pt-[80px] lg:pt-[110px] ">
      <div className="flex flex-col justify-center items-center mb-[58px] lg:flex-row lg:justify-between xl:items-baseline gap-[5px]">
        <h1 className="font-frontrunner text-black text-center leading-[50px] mb-4 md:mb-[20px] text-[40px] lg:text-[45px] lg:mb-[25px] xl:text-[60px] ">
          Останні статті
        </h1>
        <Button text="Всі блоги" tag="a" href="/blog" />
      </div>
      <div className="flex flex-wrap justify-center gap-8 xl:gap-10 lg:justify-center ">
        {blogsData.map((item, index) => (
            <BlogCardComponent
              key={index}
              id={item.id}
              heading={item.heading}
              image={item.image}
              description={item.description}
              categories={item.categories}
              date={item.date}
              handle={item.handle}
              className="w-[90%] lg:!w-[31%] "
            />
        ))}
      </div>
    </section>
  );
};

export default HomeBlogSection;
