import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getData, saveData } from "@/src/service/storage";
import { setAxiosBaseURL } from "@/src/service/api";

const DOMAIN_STORAGE_KEY = "@api_domain";

type ApiContextType = {
  domain: string | null;
  isLoading: boolean;
  saveDomain: (domain: string) => Promise<void>;
};

const ApiConfigContext = createContext<ApiContextType | undefined>(undefined);

export function ApiConfigProvider({ children }: { children: ReactNode }) {
  const [domain, setDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDomain = async () => {
      try {
        const savedDomain = (await getData(DOMAIN_STORAGE_KEY)) as
          | string
          | null;

        if (savedDomain) {
          setDomain(savedDomain);
          setAxiosBaseURL(savedDomain);
        }
      } catch (error) {
        console.error("Failed to load domain from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDomain();
  }, []);

  const saveDomain = async (newDomain: string) => {
    try {
      let formattedDomain = newDomain;
      if (
        !formattedDomain.startsWith("http://") &&
        !formattedDomain.startsWith("https://")
      ) {
        formattedDomain = `http://${formattedDomain}`;
      }

      await saveData(DOMAIN_STORAGE_KEY, formattedDomain);
      setDomain(formattedDomain);
      setAxiosBaseURL(formattedDomain);
    } catch (error) {
      console.error("Failed to save domain:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <ApiConfigContext.Provider value={{ domain, isLoading, saveDomain }}>
      {children}
    </ApiConfigContext.Provider>
  );
}

export function useApiConfig() {
  const ctx = useContext(ApiConfigContext);
  if (!ctx)
    throw new Error("useApiConfig deve ser usado dentro de ApiConfigProvider");
  return ctx;
}
