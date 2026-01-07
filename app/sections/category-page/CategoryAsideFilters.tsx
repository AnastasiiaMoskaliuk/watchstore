"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { CardProps } from "@/config/types";
import FiltersSkeleton from "./FilterSceleton";
import { useAlert } from "@/hooks/alertContext";
import Button from "@/components/ButtonComponent";
import { getProducts } from "@/services/ProductService";
import { useCustomPagination } from "@/hooks/useCustomPagination";
import CustomFilterComponent from "@/components/filters-component/CustomFilterComponent";

import ArrowUp from "@/images/category-section/arrow-up.svg";

import Close from "@/images/cart-component/close.svg";
import { keys } from "@mantine/core";

const CategoryAsideFilters = ({
  handleUpdateProducts,
  handleChangeTotalProducts,
  limit,
  filtersData,
  sort,
  reverse,
  setSort,
  setReverse,
  setIsStart,
  isFilter,
  handleToggleFilter,
  isOpenFilters,
  isSearchLoading,
  handleToggleIsSearch,
}: {
  handleUpdateProducts: (newProducts: CardProps[]) => void;
  handleChangeTotalProducts: (num: number) => void;
  limit: number;
  filtersData: any;
  sort: string;
  reverse: boolean;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStart: React.Dispatch<React.SetStateAction<boolean>>;
  isFilter: boolean;
  handleToggleFilter: (value: boolean) => void;
  isOpenFilters: boolean;
  isSearchLoading: boolean;
  handleToggleIsSearch: (value: boolean) => void;
}) => {
  const { setPageInfo, setTotalPages, pageInfo, currentPage, setCurrentPage } =
    useCustomPagination();
  const [searchText, setSearchText] = useState<string>("");
  const [priceRangeFromObject, setPriceRangeFromObject] = useState<
    [number, number]
  >([0, 10]);
  const [priceRangeLimit, setPriceRangeLimit] = useState<[number, number]>([
    0, 10,
  ]);
  const [productType, setProductType] = useState<string>("");
  const [checkboxItems, setCheckboxItems] = useState([]);
  const [checkboxes, setCheckboxes] = useState<Record<string, string[]>>({});
  const [previousPage, setPreviousPage] = useState<number>(0);
  const [savedFilters, setSavedFilters] = useState<any>();
  const [isReset, setIsReset] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);
  const { setInfoMessage } = useAlert();

  useEffect(() => {
    const saved = localStorage.getItem("categoryFilters");
    const savedFilters = saved ? JSON.parse(saved) : null;
    setSavedFilters(savedFilters);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getProductData(true);
    };

    if (productType) {
      fetchData();
    }
  }, [productType]);

  useEffect(() => {
    const filtersToSave = {
      productType,
      priceRange: priceRangeFromObject,
      priceRangeLimit: priceRangeLimit,
      checkboxes,
    };
    localStorage.setItem("categoryFilters", JSON.stringify(filtersToSave));
  }, [productType, priceRangeFromObject, checkboxes]);

  useEffect(() => {
    if (isReset) {
      const getData = async () => {
        await getProductData(true);
      };
      getData();

      setIsReset(false);
    }
  }, [isReset]);

  useEffect(() => {
    if (isFilter) {
      const getData = async () => {
        await getProductData(false);
      };
      getData();
    }
  }, [currentPage]);

  useEffect(() => {
    if (isFilter) {
      const getData = async () => {
        await getProductData(true);
      };
      getData();
    }
  }, [sort, reverse]);

  useEffect(() => {
    if (isFilter) {
      if (
        savedFilters &&
        savedFilters?.productType &&
        savedFilters?.productType != ""
      ) {
        if (savedFilters.productType) {
          changeProductType(savedFilters.productType);
        }

        if (
          savedFilters.priceRange[0] !== 0 &&
          savedFilters.priceRange[1] !== 10
        ) {
          setPriceRangeFromObject(savedFilters.priceRange);
        }

        if (savedFilters.checkboxes) {
          setCheckboxes(savedFilters.checkboxes || {});
        }
      } else {
        if (productType === "" && filtersData.buttons) {
          setProductType(filtersData.buttons.value[0]);
        }

        priceRangeFromObject[0] === 0 && priceRangeFromObject[1] === 10
          ? setPriceRangeFromObject(
              filtersData.priceRange.values.filter(
                (item: any) => item.title === filtersData.buttons.value[0]
              )[0].value
            )
          : null;

        priceRangeLimit
          ? setPriceRangeLimit(
              filtersData.priceRange.values.filter(
                (item: any) => item.title === filtersData.buttons.value[0]
              )[0].value
            )
          : null;

        setCheckboxItems(
          filtersData.checkboxes.filter(
            (item: any) => item.title === filtersData.buttons.value[0]
          )[0].checkboxes
        );
      }
    }
  }, [filtersData]);

  useEffect(() => {
    if (isFilter && priceRangeFromObject === filtersData.priceRange.value) {
      const getData = async () => {
        await getProductData(false);
      };
      getData();
    }
  }, [priceRangeFromObject]);

  useEffect(() => {
    handleToggleIsSearch(true);
    setTimeout(() => {
      handleToggleIsSearch(false);
    }, 1000);

    if (isFilter) {
      const getData = async () => {
        await getProductData(true);
      };
      getData();
    }
  }, [productType, checkboxes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        handleToggleFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProductData = async (isForm: boolean) => {
    const selectedFilters = {
      productType: productType,
      minPrice: priceRangeFromObject[0],
      maxPrice: priceRangeFromObject[1],
      searchText: searchText,
      vendor: checkboxes["Бренд"] || [],
    };

    let keysWithValues: string[] = [];

	 console.log("lizi ",checkboxes);
    if (Object.keys(checkboxes).length !== 0) {
      Object.entries(checkboxes).flatMap(([key, values]) => {
		if(values.length > 0){
        if (key !== "Бренд") {
          let keysStrings = "";
          values.map((value, i) => {
            keysStrings += `tag:${key
              .replaceAll(" ", "_")
              .toLowerCase()}-${value.replaceAll(" ", "_").toLowerCase()}${
              i + 1 === values.length ? "" : " "
            }`;
          });

          let newStrng = keysStrings.replaceAll(" ", " OR ");

          keysWithValues.push(newStrng);
        }
		}
      });
    }
	 console.log("ttt", keysWithValues);
    let finalString = keysWithValues.join(" AND ");

console.log("yyy ",finalString);

    let data;
    if (currentPage == 1 || isForm) {
      data = await getProducts(
        selectedFilters,
        finalString,
        limit,
        "",
        sort,
        reverse,
        true,
        setInfoMessage
      );
      setCurrentPage(1);
    } else if (previousPage < currentPage) {
      data = await getProducts(
        selectedFilters,
        finalString,
        limit,
        pageInfo.endCursor,
        sort,
        reverse,
        true,
        setInfoMessage
      );
    } else {
      data = await getProducts(
        selectedFilters,
        finalString,
        limit,
        pageInfo.startCursor,
        sort,
        reverse,
        false,
        setInfoMessage
      );
    }
    setPreviousPage(currentPage);
    setPageInfo(data.pageInfo);
    setTotalPages(data.count === 0 ? 1 : Math.ceil(data.count / limit));
    handleUpdateProducts([...data.products]);
    handleChangeTotalProducts(data.count);
    setIsStart(false);
  };

  const handleCheckboxChange = (title: string, value: string) => {
    setCheckboxes((prev) => {
      const currentValues = prev[title] || [];
      return {
        ...prev,
        [title]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleSubmitFilters = async () => {
    await getProductData(true);
  };

  const handleSubmitFiltersPrice = async () => {
    await getProductData(true);

    handleToggleIsSearch(true);
    setTimeout(() => {
      handleToggleIsSearch(false);
    }, 1000);
  };

  const handleResetFilters = async () => {
    setProductType(filtersData.buttons.value[0]);

    setPriceRangeFromObject(
      filtersData.priceRange.values.filter(
        (item: any) => item.title === filtersData.buttons.value[0]
      )[0].value
    );

    setPriceRangeLimit(
      filtersData.priceRange.values.filter(
        (item: any) => item.title === filtersData.buttons.value[0]
      )[0].value
    );

    setCheckboxes({});

    setSort("CREATED_AT");
    setReverse(true);
    setIsReset(true);
  };

  const changeProductType = (type: string) => {
    if (type !== productType) {
      setProductType(type);

      setCheckboxes({});

      setPriceRangeFromObject(
        filtersData.priceRange.values.filter(
          (item: any) => item.title === type
        )[0].value
      );

      setPriceRangeLimit(
        filtersData.priceRange.values.filter(
          (item: any) => item.title === type
        )[0].value
      );

      setCheckboxItems(
        filtersData.checkboxes.filter((item: any) => item.title === type)[0]
          .checkboxes
      );
    }
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRangeFromObject(value);
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitFilters();
  };

  return (
    <>
      {!isFilter ? (
        <FiltersSkeleton />
      ) : (
        <>
          <aside className="hidden xl:block sticky w-[440px] h-fit pt-[43px] pb-[93px] pr-[80px] top-0 left-0">
            <form
              onSubmit={handleSubmitForm}
              className="pb-5 flex flex-col gap-5 font-poppins ">
              {filtersData.buttons.title && (
                <CustomFilterComponent
                  title={filtersData.buttons.title}
                  type="buttons"
                  items={filtersData.buttons.value}
                  activeButton={productType}
                  onChangeButton={changeProductType}
                />
              )}

              {filtersData.priceRange.title && (
                <CustomFilterComponent
                  title={filtersData.priceRange.title}
                  type="price"
                  limit={priceRangeLimit}
                  rangeValue={priceRangeFromObject}
                  step={1}
                  onRangeChange={handlePriceChange}
                  onApplyClick={handleSubmitFiltersPrice}
                />
              )}

              {checkboxItems.length > 0 &&
                checkboxItems.map((item: any) => (
                  <CustomFilterComponent
                    key={`${productType}-${item.title}`}
                    title={item.title}
                    type="checkboxes"
                    items={item.value}
                    selectedItems={checkboxes[item.title]}
                    onItemChange={(value: string) =>
                      handleCheckboxChange(item.title, value)
                    }
                    isSearchCheckBoxes={item.title === "Бренд" ? true : false}
                  />
                ))}

              <div className="flex flex-row justify-center gap-[10px]">
                <Button
                  text="Скидання"
                  className="w-[70%] font-medium"
                  type="submit"
                  background="white"
                  bordered
                  onClick={handleResetFilters}
                />
              </div>
            </form>
          </aside>

          <motion.div
            className="xl:hidden absolute top-0 left-0 w-screen bg-black bg-opacity-50 z-50"
            initial={{
              opacity: 0,
              visibility: "hidden",
            }}
            animate={{
              opacity: isOpenFilters ? 1 : 0,
              visibility: isOpenFilters ? "visible" : "hidden",
            }}>
            <motion.div
              ref={selectRef}
              className="h-screen flex flex-col w-3/4 mini:w-[380px] bg-white "
              initial={{
                translateX: "100%",
              }}
              animate={{
                translateX: isOpenFilters ? "0" : "-100%",
              }}
              transition={{ duration: 0.3 }}>
              <div className="bg-pearl flex items-center text-[24px] p-5">
                <h2 className="text-black font-frontrunner flex-1 text-center">
                  Фільтри
                </h2>
                <button
                  className="ml-auto"
                  onClick={() => {
                    handleToggleFilter(false);
                  }}>
                  <Image
                    src={Close}
                    alt="close button"
                    className="object-fit w-5 h-5"
                  />
                </button>
              </div>
              <form
                onSubmit={handleSubmitForm}
                className="flex-1 flex flex-col gap-5 font-poppins overflow-y-scroll p-5">
                {filtersData.buttons.title && (
                  <CustomFilterComponent
                    title={filtersData.buttons.title}
                    type="buttons"
                    items={filtersData.buttons.value}
                    activeButton={productType}
                    onChangeButton={changeProductType}
                  />
                )}
                {filtersData.priceRange.title && (
                  <CustomFilterComponent
                    title={filtersData.priceRange.title}
                    type="price"
                    limit={priceRangeLimit}
                    rangeValue={priceRangeFromObject}
                    step={1}
                    onRangeChange={handlePriceChange}
                    onApplyClick={handleSubmitFiltersPrice}
                  />
                )}

                {checkboxItems.length > 0 &&
                  checkboxItems.map((item: any) => (
                    <CustomFilterComponent
                      key={item.title}
                      title={item.title}
                      type="checkboxes"
                      items={item.value}
                      selectedItems={checkboxes[item.title]}
                      onItemChange={(value: string) =>
                        handleCheckboxChange(item.title, value)
                      }
                      isSearchCheckBoxes={item.title === "Бренд" ? true : false}
                    />
                  ))}
              </form>
              <div className="bg-pearl flex items-center justify-center text-[24px] p-5">
                <Button
                  text="Скидання"
                  className="w-[70%] text-[14px] md:text-[16px] font-medium py-[8px] px-[9px]"
                  type="submit"
                  background="white"
                  bordered
                  onClick={handleResetFilters}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default CategoryAsideFilters;
