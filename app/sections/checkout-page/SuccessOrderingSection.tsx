"use client";
import Image from "next/image";
import { Modal } from "@mantine/core";
import { Loader } from "@mantine/core";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

import { useCart } from "@/hooks/useCart";
import { useAlert } from "@/hooks/alertContext";
import { CreateOrder } from "@/services/OrderService";

import Button from "@/components/ButtonComponent";

import Thanks from "@/images/checkout-page/Thanks.png";

const SuccessOrderingSection = ({ orderId }: { orderId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [opened, { open, close }] = useDisclosure(true);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const { totalAmount } = useCart();

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
      open();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (opened) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [opened]);

  useEffect(() => {
    localStorage.removeItem("basicInfo");
    localStorage.removeItem("paymentInfo");
    localStorage.removeItem("shippingInfo");
    localStorage.removeItem("cartProducts");
  }, []);

  useEffect(() => {
    const createLiqPayOrder = async () => {
      // const response = await CreateOrder(
      //   orderInfo,
      //   {
      //     sendReceipt: "true",
      //     sendFulfillmentReceipt: "true",
      //     inventoryBehaviour: "BYPASS",
      //   },
      //   setInfoMessage
      // );
      // if (response.status == 200) {
      // }
    };
    createLiqPayOrder();
  }, []);

  return (
    <div className="relative flex justify-center">
      {status === "loading" && (
        <div className="container mt-[50px] flex justify-center">
          <Loader className="animate-spin rounded-full border-[4px] md:border-[6px] border-darkBlack border-b-transparent w-10 h-10 md:w-20 md:h-20" />
        </div>
      )}
      {status === "success" && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
        />
      )}

      {showModal && status === "success" && (
        <>
          {opened && (
            <div className="fixed inset-0 bg-[grey] bg-opacity-30 backdrop-blur-sm z-50" />
          )}
          <Modal
            opened={opened}
            onClose={close}
            className="container"
            withCloseButton={false}
            size="lg"
            classNames={{
              root: "top-[5%] lg:top-[9%] z-[1000] absolute left-0 right-0 bottom-0 md:w-[80%] lg:w-[70%] xl:w-[51%]",
              body: "p-0",
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 50 }}
            >
              <div className="flex flex-col items-center bg-white rounded-[32px] pt-[40px]">
                <h1 className="font-frontrunner text-center text-black text-[28px] md:text-[32px] md:mb-[20px] lg:text-[36px] md:px-[15px]">
                  Дякуємо, що обрали нас!
                </h1>
                <p className="text-center text-[#424551] font-poppins text-[silver] px-[15px] mt-[5px] md:mt-0">
                  Ваше замовлення{" "}
                  <span className="font-semibold underline text-darkBlack">
                    №{orderId}
                  </span>{" "}
                  успішно оброблено. Очікуйте підтвердження найближчим часом.
                </p>
                <Button
                  href="/"
                  tag="a"
                  text="На головну сторінку"
                  className="mt-[20px] md:mt-[40px] mb-[10px] focus:outline-none focus:ring-0"
                />
                <Image
                  src={Thanks}
                  alt="thanks"
                  className="object-cover rounded-[32px]"
                />
              </div>
            </motion.div>
          </Modal>
        </>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center bg-white rounded-[32px] pt-[40px]">
          <h1 className="font-frontrunner text-center text-black text-[28px] md:text-[32px] md:mb-[20px] lg:text-[36px] md:px-[15px]">
            Упс... Сталася помилка
          </h1>
          <p className="text-center text-black text-[16px] md:text-[18px] lg:text-[20px]">
            Спробуйте перезавантажити сторінку або зверніться до підтримки, якщо
            проблема не зникне.
          </p>
        </div>
      )}
    </div>
  );
};

export default SuccessOrderingSection;
