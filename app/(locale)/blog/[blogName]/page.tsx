import type { Metadata } from "next";
import { Loader } from "@mantine/core";

import RelatedBlogs from "@/app/sections/article-page/RelatedBlogs";
import ArticleSection from "@/app/sections/article-page/ArticleSection";

interface PageProps {
  params: Promise<{ blogName: string }>;
}

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

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const blogName = resolvedParams.blogName;

  if (!blogName) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] w-full">
        <Loader className="animate-spin rounded-full border-4 border-darkBlack border-b-transparent w-10 h-10" />
      </div>
    );
  }

  return (
    <>
      <ArticleSection blogName={blogName} />
      <RelatedBlogs currentHandle={blogName} />
    </>
  );
};

export default Page;
