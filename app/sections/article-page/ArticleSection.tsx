"use client";
import Image from "next/image";
import React, { FC, useState, useEffect } from "react";

import { BlogData, Paragraph } from "@/config/types";
import { getBlogByHandle } from "@/services/BlogService";

import ParagraphsComponent from "@/components/article-page/ParagraphsComponent";
import ShareSocialLinksComponent from "@/components/article-page/ShareSocialLinksComponent";
import BlogDetailSkeleton from "./BlogDetailSkeleton";

const ArticleSection = ({ blogName }: { blogName: string }) => {
  const [articleData, setArticleData] = useState<BlogData>();
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 1500);
  }, [articleData]);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const fetchedArticleData: BlogData = await getBlogByHandle(blogName);
        setArticleData(fetchedArticleData);
        setIsLoading(true);
      } catch (error) {
        console.error("Failed to fetch article data", error);
      }
    };

    fetchArticleData();
  }, []);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: articleData?.heading,
    description: articleData?.description,
    image: articleData?.image?.originalSrc || "",
    author: {
      "@type": "Person",
      name: articleData?.handle,
    },
    datePublished: articleData?.date,
    articleSection: articleData?.categories,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://https://watchstore.pp.ua/blog/${articleData?.handle}`,
    },
  };

  if (!isLoading) {
    return <BlogDetailSkeleton />;
  }

  const ArticleInformation: FC = () => {
    return (
      <>
        {articleData?.image?.originalSrc && (
          <Image
            className="object-contain w-[360px] xl:w-[380px]"
            src={articleData.image.originalSrc}
            width={600}
            height={300}
            alt={articleData.image.alt || ""}
          />
        )}
        <div className="flex flex-wrap items-center gap-[5px] text-[#787A80] text-[14px] md:gap-[10px] md:text-[16px]">
          <p className="font-semibold">{articleData?.date}</p>
          {articleData?.categories?.map((category, index) => (
            <p
              key={index}
              className={
                "text-darkBlack border-darkBlack border py-[4px] px-[6px] text-[12px] rounded-2xl"
              }
            >
              {category}
            </p>
          ))}
        </div>
      </>
    );
  };

  return (
    <section className="mx-[50px] mb-[50px] mt-[15px] flex flex-col items-center md:mt-[20px] lg:mt-[50px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <h1 className="font-frontrunner text-black text-center lg:leading-[60px] mb-4 md:mb-[20px] text-[25px] md:text-[35px] lg:text-[45px] lg:mb-[25px] xl:text-[60px] ">
        {articleData?.heading || ""}
      </h1>

      <hr className="bg-[#E5E8ED] w-[100%]" />

      <div className="flex flex-col items-center gap-[50px] lg:items-start lg:flex-row lg:gap-[80px] pt-[32px] ">
        {articleData && (
          <div className="flex flex-col items-center lg:items-start gap-[20px] lg:w-[30%]">
            <ArticleInformation />
            <ShareSocialLinksComponent />
          </div>
        )}

        <div className="flex flex-col items-start gap-[15px] md:gap-[24px] lg:w-[80%]">
          <p className="text-[18px] font-bold lg:text-[20px]">
            {articleData?.description}
          </p>
          {articleData?.paragraphs?.map(
            (paragraph: Paragraph, index: number) => (
              <ParagraphsComponent key={index} paragraph={paragraph} />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
