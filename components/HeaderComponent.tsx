"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useDisclosure } from "@mantine/hooks";
import React, { FC, useState, useEffect } from "react";
import { Modal, Button, ActionIcon } from "@mantine/core";

import { useAlert } from "@/hooks/alertContext";
import MainButton from "@/components/ButtonComponent";
import { getUser, updateRefreshToken } from "@/services/AuthService";

import Logo from "@/images/logo.svg";
import Close from "@/images/vectors/close.svg";
import Burger from "@/images/vectors/burger.svg";
import Basket from "@/images/vectors/basket.svg";
import SearchFilterComponents from "./filters-component/SearchFilterComponents";

const navData = [
  { link: "/#about-us", text: "Про нас" },
  { link: "/contact-us", text: "Контакти" },
  { link: "/legal", text: "Допомога" },
  { link: "/blog", text: "Блоги" },
];

const Header = () => {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const { products, changeOpenState } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setInfoMessage } = useAlert();
  const [userName, setUserName] = useState("Кабінет");

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          if (accessToken) {
            setIsLoggedIn(true);
          } else {
            const tokens = await updateRefreshToken(setInfoMessage);
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            setIsLoggedIn(true);
          }
          const { user } = await getUser();
          setUserName(`${user.firstName}` || "");
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchTokens();
  }, [pathname]);

  const HeaderNavigation: FC<{ className?: string }> = ({ className }) => {
    return (
      <div
        className={`${className} flex flex-col gap-[25px] z-30 items-center justify-center xl:flex-row`}
      >
        <div className="flex flex-col xl:flex-row gap-[40px]  xl:mr-[20px] ">
          <nav className="flex flex-col text-silver xl:flex-row ">
            {navData.map((item, index) => (
              <div key={index} className="relative group xl:mx-[15px]">
                <MainButton
                  tag="a"
                  background="transparent"
                  text={item.text}
                  href={item.link}
                  onClick={() => {
                    close();
                  }}
                  className="group-hover:text-darkBlack transition-all duration-300 transform xl:!px-[0px]"
                />
                <span className="hidden xl:block absolute left-1/2 bottom-4 w-0 h-[2px] bg-darkBlack text-center transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </div>
            ))}
          </nav>

          <MainButton text="Годинники" tag="a" href="/catalog" />
        </div>

        <div className="flex gap-[23px]">
          <SearchFilterComponents additionalClass="hidden xl:block" />
          <div className="flex flex-col xl:flex-row xl:gap-[18px]">
            <div className="flex flex-row justify-center gap-[14px] mt-[30px] mb-[22px] xl:my-0 text-silver hover:text-onyx hover:font-bold xl:hover:font-normal transition-all duration-300">
              <button
                className="relative transition-transform duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  close();
                  changeOpenState(true);
                }}
              >
                {products.length > 0 && (
                  <div className="absolute rounded-full w-4 h-4 flex items-center justify-center text-[12px] bg-[red] text-white -right-3.5 -top-[3.2px]">
                    {products.length}
                  </div>
                )}
                <Image src={Basket} alt="Basket" />
              </button>
              <p
                className="xl:hidden cursor-pointer ml-[4px]"
                onClick={(e) => {
                  e.preventDefault();
                  close();
                  changeOpenState(true);
                }}
              >
                Корзина
              </p>
            </div>
            {!isLoggedIn ? (
              <>
                <MainButton
                  text="Увійти"
                  tag="a"
                  href="/auth"
                  background="transparent"
                  className="!px-[0px] !py-[6px] text-onyx font-semibold"
                />
              </>
            ) : (
              <>
                <MainButton
                  text={userName}
                  tag="a"
                  icon="profile"
                  background="transparent"
                  href="/account"
                  className="gap-[9px] text-silver hover:text-onyx hover:font-bold !px-[4px] !py-[2px] block transition-all duration-300 xl:text-[0px]"
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const HeaderLogo = () => {
    return (
      <Link href="/" onClick={close}>
        <Image src={Logo} alt="Logo" loading="lazy" />
      </Link>
    );
  };

  return (
    <header
      className={`px-[20px] lg:px-[60px] relative bg-white duration-300 ease-in-out mb-[40px]`}
    >
      <div className="flex justify-between items-center py-[20px] gap-[30px]">
        <HeaderLogo />

        <div className="xl:hidden z-50 block absolute right-[60px] lg:right-[120px] top-1/2 -translate-y-1/2">
          <SearchFilterComponents />
        </div>

        <Button
          onClick={open}
          className="xl:hidden ml-[60px] sm:px-0 hover:bg-transparent"
        >
          <Image src={Burger} alt="Burger" />
        </Button>

        <HeaderNavigation className="hidden xl:flex" />

        <Modal
          opened={opened}
          onClose={close}
          title=""
          fullScreen
          withCloseButton={false}
          radius={0}
          transitionProps={{ transition: "scale-x", duration: 200 }}
          className="xl:hidden"
          styles={{
            body: {
              padding: "0",
            },
            content: {
              backgroundColor: "#ffffff",
              zIndex: 9999,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            },
            header: {
              backgroundColor: "#ffffff",
            },
          }}
        >
          <div className="container flex justify-between items-center py-[20px] mb-[40px]">
            <HeaderLogo />

            <ActionIcon
              variant="transparent"
              onClick={close}
              className="w-[24px] h-[24px]"
            >
              <Image src={Close} alt="Close" />
            </ActionIcon>
          </div>

          <HeaderNavigation />
        </Modal>
      </div>
    </header>
  );
};

export default Header;
