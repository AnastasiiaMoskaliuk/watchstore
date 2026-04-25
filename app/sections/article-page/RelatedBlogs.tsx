"use client";

import { useEffect, useState } from "react";
import { getBlogs } from "@/services/BlogService";
import BlogCardComponent from "@/components/blog-page/BlogCardComponent";
import { BlogData } from "@/config/types";

interface RelatedBlogsProps {
  currentHandle: string;
}

export default function RelatedBlogs({ currentHandle }: RelatedBlogsProps) {
  const [blogs, setBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const allBlogs: BlogData[] = await getBlogs();

        const filtered = allBlogs.filter(
          (blog) => blog.handle !== currentHandle,
        );

        const shuffled = [...filtered].sort(() => 0.5 - Math.random());

        setBlogs(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch related blogs:", error);
      }
    };

    fetchBlogs();
  }, [currentHandle]);

  if (!blogs.length) return null;

  return (
    <section className="mt-[100px] w-full">
      <h2 className="font-frontrunner text-black text-center leading-[50px] mb-4 md:mb-[20px] text-[35px] lg:text-[40px] lg:mb-[25px] xl:text-[45px] ">
        Останні статті
      </h2>

      <div className="flex flex-wrap justify-center gap-10">
        {blogs.map((blog, index) => (
          <BlogCardComponent
            key={index}
            className="overflow-hidden rounded-lg shadow-lg w-full md:w-[45%] lg:w-[30%] xl:w-[23%]"
            id={blog.id}
            categories={blog.categories}
            heading={blog.heading}
            image={blog.image}
            description={blog.description}
            date={blog.date}
            handle={blog.handle}
          />
        ))}
      </div>
    </section>
  );
}
