import React, { FC } from "react";

const BlogSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} w-[80%] lg:w-[100%] flex flex-col border rounded-lg drop-shadow-lg`}
    >
      <div className="animate-pulse w-full h-[200px] md:h-[300px] rounded-t-lg bg-gray-300"></div>
      <div className="flex flex-col px-[12px] md:px-[24px] pt-[24px] pb-[20px] justify-between ">
        <div className="animate-pulse h-4 w-3/4 bg-gray-300 rounded-sm"></div>
        <div className="flex flex-wrap gap-2 w-full mt-2">
          <div className="animate-pulse h-4 w-1/4 bg-gray-300 rounded-md"></div>
          <div className="animate-pulse h-4 w-1/4 bg-gray-300 rounded-md"></div>
          <div className="animate-pulse h-4 w-1/4 bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex flex-col gap-2 w-full mt-4">
          <div className="animate-pulse h-3 w-full bg-gray-300 rounded-sm"></div>
          <div className="animate-pulse h-3 w-full bg-gray-300 rounded-sm"></div>
          <div className="animate-pulse h-3 w-full bg-gray-300 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
