"use client";
import React, { useState, useEffect } from "react";

import { BlogData } from "@/config/types";
import { getBlogs } from "@/services/BlogService";

import BlogSkeleton from "./BlogSceleton";
import BlogCardComponent from "@/components/blog-page/BlogCardComponent";

const BlogSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 300);
  }, [blogs]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result: BlogData[] = await getBlogs();
        setBlogs(result);
        setIsLoading(true);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  const cardsPerPage = 8;
  const totalProducts = blogs.length;
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const paginatedFilteredBlogData = blogs.slice(startIndex, endIndex);

  const totalPages = Math.ceil(totalProducts / cardsPerPage);

  const generatePaginationRange = () => {
    const range: (number | string)[] = [];
    const totalPages = Math.ceil(blogs.length / cardsPerPage);

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      if (currentPage > 3) {
        range.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (currentPage < totalPages - 2) {
        range.push("...");
      }
      range.push(totalPages);
    }
    return range;
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginationRange = generatePaginationRange();

  return (
    <section className="flex flex-row mt-[32px] mb-[100px] lg:mb-[180px] mx-[50px] lg:justify-between">
      <div className="flex flex-col w-full">
        <h1 className="font-frontrunner text-center text-black leading-[50px] mb-4 md:mb-[20px] text-[40px] lg:text-[45px] lg:mb-[25px] xl:text-[60px]">
          Блоги
        </h1>

        <div className="w-full mt-[32px] flex flex-wrap justify-center md:justify-center gap-10">
          {isLoading && blogs.length != 0
            ? paginatedFilteredBlogData.map((item, index) => (
                <BlogCardComponent
                  className="overflow-hidden rounded-lg shadow-lg w-full md:w-[45%] lg:w-[31%] xl:w-[23%]"
                  key={index}
                  id={item.id}
                  categories={item.categories}
                  heading={item.heading}
                  image={item.image}
                  description={item.description}
                  date={item.date}
                  handle={item.handle}
                />
              ))
            : Array.from({ length: cardsPerPage }).map((_, index) => (
                <BlogSkeleton
                  key={index}
                  className="overflow-hidden rounded-lg shadow-lg w-[90%] md:w-[45%] lg:w-[30%] xl:w-[23%]"
                />
              ))}
        </div>

        {isLoading && totalProducts > cardsPerPage && (
          <div className="mt-[58px] flex justify-center items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handleChangePage(currentPage - 1)}
              className={`h-7 w-3 text-darkBlack rounded-sm ${
                currentPage === 1 ? "opacity-0" : " hover:font-extrabold"
              }`}
            >
              &lt;
            </button>

            {paginationRange.map((range, index) =>
              range === "..." ? (
                <button
                  key={index}
                  className="h-[28px] rounded-sm text-center text-[10px] bg-pearl text-silver px-2"
                  disabled
                >
                  ...
                </button>
              ) : (
                <button
                  key={index}
                  className={`h-7 w-7 rounded-sm ${
                    currentPage === range
                      ? "bg-darkBlack text-white"
                      : "bg-pearl text-silver hover:font-bold"
                  }`}
                  onClick={() => handleChangePage(range as number)}
                >
                  {range}
                </button>
              )
            )}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handleChangePage(currentPage + 1)}
              className={`h-7 w-3 text-darkBlack rounded-sm ${
                currentPage === totalPages
                  ? "opacity-0"
                  : " hover:font-extrabold"
              }`}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
