import React from "react";
import type { Metadata } from "next";

import ArticleSection from "@/app/sections/article-page/ArticleSection";

export const metadata: Metadata = {
  title: "Montre d`Art — Стаття про годинники ",
  description: "Читайте статті про найкращі годинники, новинки та поради з вибору стильного аксесуару. Знайдіть корисну інформацію та тренди в світі годинників.",
  keywords: [
    "Статті про годинники",
    "Тренди годинників",
    "Поради по вибору годинників",
    "Історія годинників",
    "Унікальні моделі годинників",
    "Годинникові новинки",
  ],
};

const Page = ({ params }: { params: any }) => {
  const blogName = params.blogName;

  return (
    <>
      <ArticleSection blogName={blogName} />
    </>
  );
};

export default Page;
