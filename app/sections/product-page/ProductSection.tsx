"use client";
import Image from "next/image";
import "@mantine/carousel/styles.css";
import { Loader } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import React, { FC, useEffect, useState } from "react";

import { Product } from "@/config/types";
import { useCart } from "@/hooks/useCart";
import { useAlert } from "@/hooks/alertContext";
import Button from "@/components/ButtonComponent";
import TitleComponents from "@/components/TitleComponents";
import { getProductByHandle } from "@/services/ProductService";

import LeftArrow from "@/images/product-page/left.svg";
import RightArrow from "@/images/product-page/right.svg";

interface productProps {
  productName: string;
}

interface EmblaApi {
  scrollTo: (index: number) => void;
}

const ProductSection: FC<productProps> = ({ productName }) => {
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);
  const [maxQuantity, setMaxQuantity] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [embla, setEmbla] = useState<EmblaApi | null>(null);

  const { setInfoMessage } = useAlert();
  const { addToCart, isOpen, changeOpenState } = useCart();

  useEffect(() => {
    if (embla) embla.scrollTo(activeSlide);
  }, [activeSlide, embla]);

  const slides = product?.images?.map((item, index) => (
    <Carousel.Slide key={index} className="flex justify-center">
      <Image
        src={item}
        width={350}
        height={365}
        alt={`Image${index + 1}`}
        loading="lazy"
        className="w-[90%] h-auto object-cover rounded-xl"
      />
    </Carousel.Slide>
  ));

  const handleQuantityChange = (value: number | string | undefined) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    if (!isNaN(numericValue as number)) {
      setQuantity(numericValue as number);
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(quantity + 1, maxQuantity);
    handleQuantityChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(quantity - 1, 1);
    handleQuantityChange(newValue);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData: Product = await getProductByHandle(
          productName,
          setInfoMessage,
        );
        if (productData) {
          setProduct(productData);
          setQuantity(productData.quantity && productData.quantity > 0 ? 1 : 0);
          setIsOutOfStock(productData.quantity === 0);
          setMaxQuantity(productData.quantity || 0);

          setIsLoading(true);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };
    console.log("ПЕРЕВІРКА ПРОПСІВ:", productName);
    fetchProduct();
  }, [productName]);

  if (!isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] w-full ">
        <Loader className="animate-spin rounded-full border-4 border-darkBlack border-b-transparent w-10 h-10" />
      </div>
    );
  }

  let higherDescription: string[] = [];
  let lowerDescription: any[] = [];

  if (product?.description) {
    const description = product?.description.split("&") || ["", ""];
    if (description.length > 1) {
      higherDescription = description[0]
        .split("_")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      lowerDescription = description[1].split(";").map((item) => {
        const [key, value] = item.split(":").map((part) => part.trim());
        return { key, value };
      });
    }
  }

  const handleAddToBasket = (id: string) => {
    window.dispatchEvent(new CustomEvent("add_to_backet"));
    !isOpen && changeOpenState(true);

    if (product) {
      addToCart(
        {
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: +product.price,
          image: product.images[0],
          quantity: quantity,
          maxQuantity: maxQuantity,
        },
        quantity,
      );
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.title,
    image: product?.images,
    description:
      product?.description ?? "Купити якісний годинник з доставкою по Україні.",
    sku: product?.id,
    brand: {
      "@type": "Brand",
      name: product?.vendor,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product?.price,
      availability:
        (product?.quantity ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://watchstore.pp.ua/catalog/${product?.handle}`,
    },
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <TitleComponents
        text="годинник"
        additionalText="ідеальний аксесуар для кожного моменту"
      />

      <div className="flex flex-row items-start px-[40px] lg:px-[125px] md:px-[75px] mt-[30px]">
        <Button
          bordered
          className="flex !items-start text-[12px] py-[8px] px-[9px]"
          text="Повернутись до каталогу"
          href="/catalog"
          icon="back"
          background="transparent"
          tag="a"
        />
      </div>

      <div className="flex flex-col gap-[80px] md:gap-[50px] lg:gap-[100px] xl:gap-[50px] justify-items-center lg:justify-between xl:justify-items-center py-[30px] px-[30px] lg:px-[80px] xl:px-[100px] md:flex-row xl:py-[65px] ">
        <div className="hidden xl:flex xl:flex-wrap xl:flex-row xl:justify-start xl:gap-6 w-[50%] h-full ">
          {product?.images?.map((item, index) => (
            <Image
              key={index}
              src={item}
              width={400}
              height={400}
              alt={`Image${index + 1}`}
              loading="lazy"
              className="object-cover rounded-xl xl:w-[45%] "
            />
          ))}
        </div>

        <div className="flex flex-col items-center xl:hidden">
          <Carousel
            className="group flex items-center max-w-[550px]"
            slideGap="lg"
            loop
            getEmblaApi={(api) => setEmbla(api)}
            onSlideChange={setActiveSlide}
            nextControlIcon={
              <Image
                src={RightArrow}
                alt="RightArrow"
                width={40}
                className="lg:opacity-0 lg:group-hover:opacity-100 duration-300 right-0 bg-darkBlack rounded-lg p-[5px]"
              />
            }
            previousControlIcon={
              <Image
                src={LeftArrow}
                alt="LeftArrow"
                width={40}
                className="lg:opacity-0 lg:group-hover:opacity-100 duration-300 left-0 bg-darkBlack rounded-lg p-[5px]"
              />
            }
          >
            {slides}
          </Carousel>

          <div className="flex gap-[8px] mt-[20px]">
            {product?.images?.slice(0, 6).map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className="focus:outline-hidden"
              >
                <Image
                  src={item}
                  width={100}
                  height={100}
                  alt={`Mini-image ${index}`}
                  className={`object-cover rounded-lg cursor-pointer opacity-[50%]${
                    activeSlide === index
                      ? "opacity-[100%] ring-2 ring-darkBlack"
                      : ""
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center font-poppins w-full md:w-[50%]">
          <h2 className="text-[36px] xl:text-[40px] leading-9">
            {product?.title}
          </h2>

          <div className="flex mt-[15px] items-center">
            {product && product?.discount > 0 ? (
              <>
                <span className="text-[16px] xl:text-[22px] ml-[8px] text-[grey] mt-[5px] line-through">
                  {Number(
                    Number(product?.price) / (1 - product?.discount / 100),
                  ).toFixed(2)}
                </span>

                <span className="text-[24px] xl:text-[30px] ml-[8px] mr-[10px] font-semibold">
                  {Number(product?.price)} грн
                </span>

                {product?.discount !== 0 && (
                  <div className="bg-[red] text-white rounded-lg px-2 top-2 left-2 font-semibold h-fit">
                    - {product?.discount}%
                  </div>
                )}
              </>
            ) : (
              <span className="text-[24px] xl:text-[30px] font-semibold">
                {Number(product?.price)} грн
              </span>
            )}
          </div>

          <div className="w-full xl:w-[80%]">
            <h3 className="text-[20px] mt-[20px] font-semibold text-left w-full xl:w-[80%]">
              Опис товару
            </h3>
            {higherDescription.length > 0 ? (
              higherDescription.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[14px] my-[15px] text-silver text-left"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-[14px] my-[15px] text-silver text-left">
                Цей годинник — ідеальне поєднання елегантності та
                функціональності. Високоякісні матеріали, стильний дизайн і
                точний механізм створюють неперевершене враження. Ідеальний
                аксесуар для будь-якого випадку.
              </p>
            )}
          </div>
          <hr className="block w-full xl:w-[80%]" />

          <div className="my-[15px] w-full xl:w-[80%] text-silver text-[14px] text-center space-y-[10px]">
            <h3 className="text-[20px] mt-[20px] font-semibold w-full xl:w-[80%] text-left">
              Характеристики
            </h3>
            {lowerDescription.length != 0 ? (
              lowerDescription.map((property, index) => (
                <div key={index} className="flex justify-between items-start">
                  <span className="text-start">{property.key}</span>
                  <span className="text-end">{property.value}</span>
                </div>
              ))
            ) : (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-wrap justify-evenly">
                    <span>{`——`}</span>
                    <span>{`——`}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          <hr className="block w-full xl:w-[80%]" />

          {isOutOfStock && (
            <p className="text-vividRed mt-[25px]">Товару немає в наявності!</p>
          )}

          <div className="flex items-center my-[25px] space-x-[40px] w-full xl:w-[80%]">
            <div className="flex items-center border-2 rounded-md overflow-hidden">
              <button
                onClick={handleDecrement}
                className={`w-[50px] h-[40px] border-r ${
                  quantity > 1 && !isOutOfStock
                    ? "hover:bg-darkBlack hover:text-snow bg-snow"
                    : "bg-gray-200 bg-opacity-80 cursor-not-allowed text-[gray]"
                }`}
                disabled={quantity <= 1 || isOutOfStock}
              >
                -
              </button>
              <span className="w-[50px] h-[40px] flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className={`w-[50px] h-[40px] border-l ${
                  quantity < maxQuantity && !isOutOfStock
                    ? "hover:bg-darkBlack hover:text-snow bg-snow"
                    : "bg-gray-200 bg-opacity-80 cursor-not-allowed text-[gray]"
                }`}
                disabled={quantity >= maxQuantity || isOutOfStock}
              >
                +
              </button>
            </div>
            <Button
              text="Купити"
              className="mini:w-[80%] w-[100%] px-[50px]"
              onClick={() => handleAddToBasket(product?.id || "")}
              disabled={isOutOfStock}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProductSection;

{
  /* 
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "TimeStone",
            "item": "https://www.google.com.ua/?hl=uk"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Годинники",
            "item": "https://www.google.com.ua/?hl=uk"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Molumenzeit S 2",
            "item": "https://www.google.com.ua/?hl=uk"
          }
        ]
      }
    </script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "11"
        },
        "name": "Molumenzeit S 2",
        "image": "https://cdn.shopify.com/s/files/1/0897/4191/8494/files/bluewatch.jpg?v=1729085317",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud",
        "brand": "ferferf",
        "offers": {
          "priceCurrency": "UAH",
          "price": "10000.00",
          "priceValidUntil": "2025-05-05",
          "availability": "https://schema.org/InStock",
          "url": "https://timestone.com/product/Molumenzeit S 2",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "70.00",
              "currency": "UAH"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "name": "Ukraine",
              "addressCountry": "UA"
            },
            "applicableCountry": {
              "@type": "Country",
              "name": "Ukraine",
              "addressCountry": "UA"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 2,
                "unitText": "BusinessDay",
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 3,
                "maxValue": 5,
                "unitText": "BusinessDay",
                "unitCode": "DAY"
              }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "name": "30-Day Return Policy",
            "url": "https://example.com/return-policy",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "applicableCountry": {
              "@type": "Country",
              "name": "UA"
            },
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn",
            "itemCondition": "https://schema.org/NewCondition",
            "merchantReturnDays": 30
          }
        }
      }
    </script>
  */
}
