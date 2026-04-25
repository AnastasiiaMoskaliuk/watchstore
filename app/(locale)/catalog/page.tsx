import CategoryMain from "@/app/sections/category-page/CategoryMain";
import { getProducts } from "@/services/ProductService";
import type { Metadata } from "next";
type Props = {
  params: { categoryId?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = "Годинники";
  const baseUrl = "https://watchstore.pp.ua";

  return {
    title: `${categoryName} купити в Україні — каталог моделей | Montre d'Art`,
    description: `Бажаєте купити ${categoryName.toLowerCase()}? Замовте оригінальні аксесуари у Montre d'Art: великий вибір, гарантія якості та швидка доставка. Обирайте свій стиль!`,
    keywords: [categoryName, "купити", "Україна", "ціна", "Montre dArt"],
    alternates: {
      canonical: `${baseUrl}/catalog`,
    },
    openGraph: {
      title: `${categoryName} купити в Україні — Montre d'Art`,
      description: `Великий вибір моделей у категорії ${categoryName.toLowerCase()}. Доставка та гарантія.`,
      url: `${baseUrl}/catalog`,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export const generateViewport = () => ({
  initialScale: 1.0,
  width: "device-width",
});

export default async function CategoryPage() {
  const productsData = await getProducts({});
  const initialProducts = productsData?.products || productsData || [];

  return (
    <>
      <CategoryMain initialProducts={initialProducts} />
    </>
  );
}
