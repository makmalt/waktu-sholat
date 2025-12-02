import { useQuery } from "@tanstack/react-query";
import { getAllDoa } from "@/api/api-doa";

export function useDoa() {
  return useQuery({
    queryKey: ["all-doa"],
    queryFn: getAllDoa,
  });
}
