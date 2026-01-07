import BlogSection from "@/app/sections/blog-page/BlogSection";
import { PaginationProvider } from "@/hooks/useCustomPagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art - Блоги про годинники",
  description:
    "Читайте цікаві статті про годинники, тренди, поради щодо вибору та догляду. Дізнайтесь більше про світ годинникового мистецтва.",
  keywords: [
    "Блоги про годинники",
    "Модні тренди годинників",
    "Як вибрати годинник",
    "Догляд за годинниками",
    "Онлайн-магазин годинників",
  ],
  openGraph: {
    title: "Montre d`Art - Блоги про годинники",
    description:
      "Відкрийте для себе цікаві факти, рекомендації та натхнення у світі годинникового мистецтва. Читайте наші блоги!",
    url: "https://montre-d-art.store/blog",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const Page = () => {
  return (
    <>
      <BlogSection />
    </>
  );
};

export default Page;
