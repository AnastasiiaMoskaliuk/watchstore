import axios from "axios";
import { BASE_URL } from "@/config/config";

export const getBlogs = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/blog`);
    return response.data;
  } catch (error) {
    console.error("Error getting blogs:", error);
    throw error;
  }
};

export const getBlogByHandle = async (handle: string): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/blog/${handle}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting blog with ID ${handle}:`, error);
    throw error;
  }
};

export const getShortBlogs = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/blog/top`);
    return response.data;
  } catch (error) {
    console.error("Error getting blogs:", error);
    throw error;
  }
};
