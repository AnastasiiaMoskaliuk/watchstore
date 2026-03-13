import type { Metadata } from "next";
import { Loader } from "@mantine/core";
import ProductSection from "@/app/sections/product-page/ProductSection";

interface PageProps {
  params: Promise<{ productName: string }>;
}

export const metadata: Metadata = {
  title: "Montre d`Art — Годинник",
  description: "Опис товару",
};

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const nameFromUrl = resolvedParams.productName;

  if (!nameFromUrl) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] w-full ">
        <Loader className="animate-spin rounded-full border-4 border-darkBlack border-b-transparent w-10 h-10" />
      </div>
    );
  }

  return (
    <>
      <ProductSection productName={nameFromUrl} />
    </>
  );
};

export default Page;
