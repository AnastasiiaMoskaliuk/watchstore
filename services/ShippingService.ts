import axios from "axios";
import { BASE_URL } from "@/config/config";
import { InfoMessage } from "@/config/types";

let isStart = 0;

export const getCities = async (
  city: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/cities`, {
      params: { city },
    });
    return data?.[0]?.Addresses || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      }
    }
    return [];
  }
};

export const getStreets = async (
  street: string,
  settlementRef: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    if (isStart > 0) {
      const { data } = await axios.get(`${BASE_URL}/streets`, {
        params: { street, settlementRef },
      });
      isStart++;
      return data?.[0]?.Addresses || [];
    }
    isStart++;
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      }
    }
    return [];
  }
};

export const getPostomates = async (
  findByString: string,
  cityName: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    if (isStart > 0) {
      const { data } = await axios.get(`${BASE_URL}/postomates`, {
        params: { findByString, cityName },
      });
      isStart++;
      return data || [];
    }
    isStart++;
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      }
    }
    return [];
  }
};

export const getDepartments = async (
  findByString: string,
  cityName: string,
  setInfoMessage?: (message: InfoMessage) => void
): Promise<any> => {
  try {
    if (isStart > 0) {
      const { data } = await axios.get(`${BASE_URL}/departments`, {
        params: { findByString, cityName },
      });
      isStart++;
      return data || [];
    }
    isStart++;
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (setInfoMessage) {
          setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      }
    }
    return [];
  }
};
