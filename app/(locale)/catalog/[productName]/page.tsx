import type { Metadata } from "next";

import ProductSection from "@/app/sections/product-page/ProductSection";

export const metadata: Metadata = {
  title: "Montre d`Art — Годинник, що створює стиль",
  description: "Годинники, які підкреслюють вашу індивідуальність. Знайдіть свій ідеальний аксесуар у Montre d`Art.",
  keywords: [
    "Елегантні годинники",
    "Чернівці",
    "онлайн-магазин годинників",
    "унікальні дизайни",
    "купити годинник",
    "стильний аксесуар",
    "подарунок",
  ],
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = ({ params }: { params: any }) => {
  const productName = params.productName;

  return (
    <>
      <ProductSection productName={productName} />
    </>
  );
};

export default Page;
