// src/hooks/useApi.ts
import { useLoader } from "../context/LoaderContext";

export const useApi = () => {
  const { setLoading } = useLoader();

  const fetchData = async (url: string, options?: RequestInit) => {
    try {
      setLoading(true);
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (err) {
      console.error("API error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData };
};
