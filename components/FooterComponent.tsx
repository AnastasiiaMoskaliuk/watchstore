import Link from "next/link";
import Image from "next/image";

import Logo from "@/images/logo.svg";
import Tiktok from "@/images/social-networks/tiktok.svg";
import Facebook from "@/images/social-networks/facebook.svg";
import Telegram from "@/images/social-networks/telegram.svg";
import Instagram from "@/images/social-networks/instagram.svg";

const SocialObject = [
  {
    href: "https://www.tiktok.com/@montre_d.art_",
    title: "Tiktok",
    image: Tiktok,
  },
  {
    href: "https://www.instagram.com/montre_d.art_",
    title: "Instagram",
    image: Instagram,
  },
  {
    href: "https://www.facebook.com/montre_d.art_",
    title: "Facebook",
    image: Facebook,
  },
];
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col  items-center gap-[40px] pt-[40px] ">
      <div className=" px-[20px] lg:px-[60px] flex flex-col gap-[50px] items-center w-[100%]">
        <div className="flex flex-col items-center">
          <Link href="/" className="px-[20px]">
            <Image
              src={Logo}
              alt="Logo"
              width={380}
              height={80}
              className="w-[380px] h-[80px]"
              loading="lazy"
            />
          </Link>
          <p className="font-[800] font-poppins mt-[-13px] text-[12px] tracking-[0.20em] ">by SoftLion</p>
        </div>

        <div
          className={` flex flex-col gap-[10px]  w-max items-center`}
        >
          <p className="font-[700] text-[16px] tracking-[0.10em]">Стежити за нами</p>
          <div className="flex gap-[12px] items-center ">
            {SocialObject.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white shadow-lg rounded-[50%] p-[8px] transition-all duration-300 hover:bg-darkBlack group"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  height={12}
                  className="h-[18px] w-[18px] transition-all duration-300 group-hover:filter group-hover:brightness-0 group-hover:invert"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-pearl w-[100%] py-[20px] text-center text-silver min-h-[60px] px-[20px] leading-[25px] flex flex-col items-center gap-[15px] md:relative">
        <Link
          href="https://t.me/Montre_dArt_bot"
          className="md:absolute md:right-[20px] md:top-[50%] md:translate-y-[-50%] flex items-center gap-[8px] bg-blue-500 text-white px-[8px] md:px-[15px] py-[8px] rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          target="_blank"
        >
          <Image src={Telegram} alt="telegram" className="w-[15px] h-[15px]" />
          <p className="text-[14px] font-semibold">Підтримка</p>
        </Link>
        <p className="text-center">
          © Авторські права {currentYear} Montre d'Art - Усі права захищені.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
