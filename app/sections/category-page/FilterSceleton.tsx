import React, { FC } from "react";

const FiltersSkeleton: FC = () => {
  return (
    <>
      <div className="hidden xl:flex flex-col gap-10 w-[480px] relative pt-[43px] pb-[93px] pl-[30px] pr-[50px] bg-white rounded-md shadow-md">
        <div>
          <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex gap-2">
            <div className="animate-pulse h-8 w-[80px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-8 w-[80px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-8 w-[80px] bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex gap-10 items-center">
            <div className="flex gap-1 flex-1">
              <div className="animate-pulse h-8 w-1/2 bg-gray-300 rounded-md"></div>
              <div className="animate-pulse h-8 w-1/2 bg-gray-300 rounded-md"></div>
            </div>
            <div className="animate-pulse h-8 w-[50px] bg-gray-300 rounded-md"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex flex-col gap-2">
            <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-2/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-full bg-gray-300 rounded-sm"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex flex-col gap-2">
            <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-2/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-full bg-gray-300 rounded-sm"></div>
          </div>
        </div>

        <div>
          <div className="animate-pulse h-4 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
          <div className="flex flex-col gap-2">
            <div className="animate-pulse h-4 w-1/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-2/3 bg-gray-300 rounded-sm"></div>
            <div className="animate-pulse h-4 w-full bg-gray-300 rounded-sm"></div>
          </div>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <div className="animate-pulse h-10 w-[160px] bg-gray-300 rounded-md"></div>
        </div>
      </div>

      <div className="flex w-full z-50 mini:justify-between flex-wrap gap-5 xl:justify-end justify-center absolute items-center bg-pearl xl:hidden px-5 lg:px-[60px] md:px-[30px] py-[22px]">
        <div className="animate-pulse h-[60px] w-[220px] bg-gray-300 rounded-md"></div>
        <div className="animate-pulse h-[60px] w-[220px] bg-gray-300 rounded-md"></div>
      </div>
    </>
  );
};

export default FiltersSkeleton;
