"use client";

import React, { FC, useEffect, useState } from "react";

import { motion } from "framer-motion";
import Image from "next/image";

import searchIcon from "@/images/vectors/search.svg";

type FilterComponentProps = {
  type: "checkboxes" | "buttons" | "search" | "price";
  title: string;

  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  clearSearchQuery?: () => void;

  items?: string[];
  selectedItems?: string[];
  onItemChange?: (item: string) => void;
  isSearchCheckBoxes?: boolean;

  rangeValue?: [number, number];
  limit?: [number, number];
  step?: number;
  onApplyClick?: () => void;
  onRangeChange?: (value: [number, number]) => void;

  activeButton?: string;
  onChangeButton?: (value: string) => void;
};

const CustomFilterComponent: FC<FilterComponentProps> = ({
  type,
  title,
  items,
  selectedItems = [],
  onItemChange,
  rangeValue = [0, 1],
  limit = [0, 1],
  step,
  onApplyClick,
  onRangeChange,
  searchQuery,
  onSearchChange,
  clearSearchQuery,
  activeButton,
  onChangeButton,
  isSearchCheckBoxes = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [filteredCheckboxes, setFilteredCheckboxes] = useState(
    title === "Бренд" ? items?.sort((a, b) => a.localeCompare(b)) : items
  );
  const [checkboxesText, setCheckboxesText] = useState("");

  useEffect(() => {
    setFilteredCheckboxes(
      items?.filter((item) =>
        item.toLowerCase().includes(checkboxesText.toLowerCase())
      )
    );
  }, [checkboxesText]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="relative flex flex-col gap-[10px] border-b text-[16px] border-silver border-opacity-20 pb-5">
        <div
          className={`flex justify-between items-center ${
            type === "checkboxes" ? "cursor-pointer" : ""
          }`}
          onClick={toggleOpen}>
          <h3 className="font-semibold text-[18px] relative">
            {title}
            {selectedItems && selectedItems.length > 0 && (
              <span className="absolute -right-5 top-0 w-4 h-4 text-[10px] text-white bg-darkBlack rounded-full flex items-center justify-center">
                {selectedItems.length}
              </span>
            )}
          </h3>

          {type === "checkboxes" && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}>
              <span className="text-5xl text-darkBlack !select-none">+</span>
            </motion.div>
          )}
        </div>

        {type === "search" && (
          <div className="flex gap-3">
            <input
              className="rounded-sm bg-white py-[8px] border pl-3 pr-10 w-full border-[#D7DADD] focus:outline-none focus:border-[1px] focus:border-darkBlack"
              type="text"
              placeholder="Напишіть сюди"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={clearSearchQuery}
                className="absolute right-20 top-[59px] -translate-y-1/2 text-gray-500 hover:text-gray-700 text-[25px]">
                ✕
              </button>
            )}
            <button
              // onClick={onApplyClick}
              type="submit"
              className="text-white px-4 p-2 border rounded-[4px] border-[#D7DADD] bg-darkBlack hover:bg-darkSilver">
              OK
            </button>
          </div>
        )}

        {type === "price" && (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex gap-5 justify-between items-center ">
                <div className="flex-1">
                  <input
                    type="number"
                    onInvalid={(e) => e.preventDefault()}
                    value={rangeValue[0]}
                    onChange={(e) =>
                      onRangeChange?.([+e.target.value, rangeValue[1]])
                    }
                    className="w-1/2 text-center p-2 border-t border-l border-b rounded-l-[4px]  border-[#D7DADD] focus:outline-none focus:border-[1px] focus:border-darkBlack"
                    placeholder="Мінімальна ціна"
                    min={limit[0]}
                    max={limit[1]}
                  />
                  <input
                    type="number"
                    value={rangeValue[1]}
                    onInvalid={(e) => e.preventDefault()}
                    onChange={(e) =>
                      onRangeChange?.([rangeValue[0], +e.target.value])
                    }
                    className="w-1/2 text-center p-2 border rounded-r-[4px] border-[#D7DADD] focus:outline-none focus:border-[1px] focus:border-darkBlack"
                    placeholder="Максимальна ціна"
                    min={limit[0]}
                    max={limit[1]}
                  />
                </div>

                <button
                  onClick={onApplyClick}
                  type="submit"
                  className="text-white px-4 p-2 border rounded-[4px] border-[#D7DADD] bg-darkBlack hover:bg-darkSilver">
                  OK
                </button>
              </div>
            </div>
          </>
        )}

        {type === "buttons" && (
          <>
            <div className=" flex flex-row flex-wrap gap-[5px]">
              {items?.map((btn) => (
                <button
                rel="canonical"
                  key={btn}
                  onClick={(e) => {
                    e.preventDefault();
                    onChangeButton?.(btn);
                  }}
                  className={`${
                    activeButton === btn
                      ? "bg-darkBlack text-white"
                      : "bg-white text-darkBlack border-darkBlack border rounded-md"
                  } py-[6px] px-[12px] font-medium rounded-md`}>
                  {btn}
                </button>
              ))}
            </div>
          </>
        )}

        {type === "checkboxes" && (
          <motion.div
            initial={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
            animate={
              isOpen
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}>
            {isSearchCheckBoxes && (
              <div className="relative flex gap-3 w-full pb-3">
                <Image
                  src={searchIcon}
                  width={20}
                  height={20}
                  alt="search icon"
                  className="absolute bottom-6 left-0"
                />
                <input
                  className="bg-white py-[8px] border-b pl-8 pr-5 w-full border-b-[#D7DADD] focus:outline-none focus:border-b-[1px] focus:border-b-darkBlack"
                  type="text"
                  placeholder="Пошук"
                  value={checkboxesText}
                  onChange={(e) => setCheckboxesText(e.target.value)}
                />
                {checkboxesText && (
                  <button
                    onClick={() => setCheckboxesText("")}
                    className="absolute bottom-5 right-0 text-gray-500 hover:text-gray-700 text-[16px]">
                    ✕
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col justify-start items-start overflow-y-scroll h-auto max-h-[400px]">
              {filteredCheckboxes?.slice().map((item, index) => (
                <label
                  key={`${title.toLowerCase()}-${item}`}
                  htmlFor={`checkbox-item-${title.toLowerCase()}-${item}`}
                  className="flex gap-2 cursor-pointer w-full h-full px-3 py-2 hover:bg-gray-200 rounded-md  transition-all duration-200">
                  <input
                    id={`checkbox-item-${title.toLowerCase()}-${item}`}
                    type="checkbox"
                    className="w-[20px] h-[20px] appearance-none border-2 border-gray-400 rounded-sm checked:bg-darkBlack checked:border-darkBlack checked:after:content-['✔'] checked:after:flex checked:after:justify-center checked:after:items-center checked:after:w-full checked:after:h-full checked:after:text-white focus:outline-none focus:ring-0"
                    checked={
                      selectedItems ? selectedItems.includes(item) : false
                    }
                    onChange={() => onItemChange?.(item)}
                  />
                  <span className="first-letter:uppercase">{item}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default CustomFilterComponent;
