import { useQuery } from "@tanstack/react-query";
import { getJadwalSholatById, getKotaSholat } from "@/api/api-sholat";

export function useSholat(selectedCityId) {
  return useQuery({
    queryKey: ["jadwal-sholat", selectedCityId],
    queryFn: () => getJadwalSholatById(selectedCityId),
    enabled: !!selectedCityId
  });
}

export function useKotaSholat() {
  return useQuery({
    queryKey: ["kota-sholat"],
    queryFn: getKotaSholat
  });
}