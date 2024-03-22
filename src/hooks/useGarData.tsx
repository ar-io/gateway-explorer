import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { garQueryBuilder } from "@/lib/query";

export const useGarData = () => {
  const { network } = useNetwork();
  return useQuery(garQueryBuilder(network));
}
