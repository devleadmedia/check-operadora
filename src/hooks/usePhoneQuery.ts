import { Checker } from "@/services/checker";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function usePhoneQuery() {
  const checker = new Checker();
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["phone-portability", phoneNumber],
    queryFn: async () => {
      if (!phoneNumber) return null;
      return checker.phonePortate(phoneNumber);
    },
    enabled: !!phoneNumber,
    retry: false,
  });

  const searchPhone = (number: string) => {
    const cleanNumber = number.replace(/\D/g, "");
    setPhoneNumber(cleanNumber);
    refetch();
  };

  const reset = () => {
    setPhoneNumber("");
  };

  return {
    searchPhone,
    data,
    isLoading,
    isError,
    error,
    reset,
    hasResult: !!data && !data.error,
    hasError: !!data?.error || isError,
  };
}
