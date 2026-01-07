import SuccessOrderingSection from "@/app/sections/checkout-page/SuccessOrderingSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Успішне замовлення",
  description: "Швидке оформлення замовлення",
  icons: { icon: "@/app/favicon.ico" },
  other: { "Cache-Control": "no-store" },
};

export const generateViewport = () => ({
  initialScale: 1.0,
  width: "device-width",
});

const Page = ({ params }: { params: any }) => {
  const orderId = params.orderId;
  return (
    <>
      <SuccessOrderingSection orderId={orderId} />
    </>
  );
};

export default Page;
