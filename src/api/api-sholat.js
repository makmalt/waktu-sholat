import axios from "axios";

export const getKotaSholat = async () => {
  try {
    const response = await axios.get(
      "https://api.myquran.com/v2/sholat/kota/semua"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching kota data:", error);
  }
};

export const getJadwalSholatById = async (id) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const response = await axios.get(
      `https://api.myquran.com/v2/sholat/jadwal/${id}/${today}`
    );
    return response.data.data.jadwal;
  } catch (error) {
    console.error("Error fetching jadwal data:", error);
    return null;
  }
};
