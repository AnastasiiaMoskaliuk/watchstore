import LegalSection from "@/app/sections/legal-page/LegalSection ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Montre d`Art  - Угода користувача",
  description: "Інформація",
  icons: { icon: "@/app/favicon.ico" }
};

export const generateViewport = () => ({
	initialScale: 1.0,
	width: "device-width",
 });

const Page = () => {
  return (
    <>
      <LegalSection />
    </>
  );
};

export default Page;
