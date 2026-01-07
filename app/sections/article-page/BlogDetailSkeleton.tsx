const BlogDetailSkeleton = () => {
  return (
    <div className="mx-[50px] mb-[50px] mt-[15px] flex flex-col items-center md:mt-[20px] lg:mt-[50px]">
      <h1 className="bg-gray-300 animate-pulse rounded-md mb-4 md:mb-[20px] w-[90%] h-[40px]"></h1>
      <hr className="bg-gray-300 animate-pulse w-[100%] h-[2px]" />
      <div className="w-full flex flex-col lg:flex-row lg:items-start gap-[50px] lg:gap-[80px] pt-[32px]">
        <div className="flex flex-col items-center lg:items-start gap-[10px]">
          <div className="bg-gray-300 animate-pulse rounded-md w-[360px] xl:w-[380px] h-[200px] md:h-[250px]"></div>
          <div className="flex flex-wrap gap-[10px] text-[#787A80] text-[14px] md:text-[16px]">
            <div className="bg-gray-300 animate-pulse rounded-md w-[80px] h-[20px]"></div>
            <div className="bg-gray-300 animate-pulse rounded-md w-[100px] h-[20px]"></div>
            <div className="bg-gray-300 animate-pulse rounded-md w-[100px] h-[20px]"></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="bg-gray-300 animate-pulse rounded-md w-[70px] h-[20px]"></div>
            <div className="h-6 w-6 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="h-6 w-6 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="h-6 w-6 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="h-6 w-6 bg-gray-300 animate-pulse rounded-md"></div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[15px] lg:w-[80%]">
          {[...Array(16)].map((_, index) => (
            <div
              key={index}
              className={`bg-gray-300 animate-pulse rounded-md ${
                index % 4 === 3
                  ? "w-[70%] h-[10px] md:h-[15px]" 
                  : "w-[100%] "
              } ${index % 4 === 0 ? "h-[20px] lg:h-[25px] mb-[5px]" : "h-[10px] md:h-[15px]"} ${
                index % 4 === 3 ? "mb-[20px]" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;
