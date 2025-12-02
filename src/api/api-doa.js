import axios from "axios";

export const getAllDoa = async () => {
  try {
    const response = await axios.get("https://api.myquran.com/v2/doa/all");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching doa data:", error);
    return [];
  }
};
