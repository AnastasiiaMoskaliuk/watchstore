import React from "react";

const AboutUsSection = () => {
  return (
    <section
      id="about-us"
      className="container flex flex-col justify-between gap-[40px] items-center py-[80px] lg:gap-[100px] lg:flex-row lg:py-[110px] "
    >
      <div className="flex flex-col text-center lg:text-left lg:w-[500px]">
        <h2 className="font-frontrunner mb-6 text-[28px] md:text-[35px] lg:text-[45px]">
          Про нас
        </h2>
        <p className="text-gray-600 leading-7">
          Ми спеціалізуємося на продажу брендових годинників, пропонуючи
          найкращі моделі від відомих світових виробників. Наша мета — надати
          клієнтам високоякісні та стильні аксесуари, що підкреслюють
          індивідуальність та статус. Ми працюємо тільки з перевіреними
          брендами, забезпечуючи вас надійними і елегантними годинниками для
          будь-якого випадку.
        </p>
      </div>
      <div className="w-[90%] rounded-xl overflow-hidden lg:w-[700px]">
        <video
          src="https://res.cloudinary.com/dmxhv1hjs/video/upload/v1736802637/xlj051tileq5rksjo7cd.mp4"
          width="100%"
          height="auto"
          style={{ aspectRatio: "16/9", objectFit: "contain" }}
          controls={false}
          autoPlay
          muted
          loop
        ></video>
      </div>
    </section>
  );
};

export default AboutUsSection;
