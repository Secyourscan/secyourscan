import { useQuery } from "@tanstack/react-query";

interface MetricsData {
  breaches: number;
  exposedRecords: string;
  exposedEmails: string;
  exposedPasswords: string;
}

const fetchMetrics = async (): Promise<MetricsData> => {
  const response = await fetch("https://secyourscan.aryan4.com.np/v1/metrics");
  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }
  const data = await response.json();

  // Transform the API response to match our interface
  return {
    breaches: Number(data.Breaches_Count), // Ensure number type
    exposedRecords:
      (Number(data.Breaches_Records) / 1000000000).toFixed(1) + "B",
    exposedEmails:
      (Number(data.Pastes_Count.replace(/,/g, "")) / 1000000000).toFixed(1) +
      "B",
    exposedPasswords: (Number(data.Pastes_Records) / 1000000).toFixed(1) + "M",
  };
};

export const useMetrics = () => {
  return useQuery<MetricsData>({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
