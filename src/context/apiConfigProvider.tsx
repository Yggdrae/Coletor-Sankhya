import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getData, saveData } from "@/src/service/storage";
import { setAxiosBaseURL } from "@/src/service/api";

const DOMAIN_STORAGE_KEY = "domain";

type DomainConfig = {
  domain: string;
  port: string;
};

type ApiContextType = {
  domain: string | null;
  port: string | null;
  isLoading: boolean;
  isFirstConfig: boolean;
  saveDomain: (domain: string, port: string) => Promise<void>;
};

const ApiConfigContext = createContext<ApiContextType | undefined>(undefined);

export function ApiConfigProvider({ children }: { children: ReactNode }) {
  const [domain, setDomain] = useState<string | null>(null);
  const [port, setPort] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstConfig, setIsFirstConfig] = useState(false);

  useEffect(() => {
    const loadDomain = async () => {
      try {
        const savedConfig = (await getData(
          DOMAIN_STORAGE_KEY
        )) as DomainConfig | null;

        if (savedConfig) {
          setDomain(savedConfig.domain);
          setPort(savedConfig.port);
          const url = `http://${savedConfig.domain}:${savedConfig.port}`;
          setAxiosBaseURL(url);
        } else {
          setIsFirstConfig(true);
        }
      } catch (error) {
        console.error("Failed to load domain from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDomain();
  }, []);

  const saveDomain = async (newDomain: string, newPort: string) => {
    try {
      const config: DomainConfig = {
        domain: newDomain.trim(),
        port: newPort.trim(),
      };

      await saveData(DOMAIN_STORAGE_KEY, config);

      setDomain(config.domain);
      setPort(config.port);
      setIsFirstConfig(false);

      const url = `http://${config.domain}:${config.port}`;
      setAxiosBaseURL(url);
    } catch (error) {
      console.error("Failed to save domain:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <ApiConfigContext.Provider
      value={{ domain, port, isLoading, isFirstConfig, saveDomain }}
    >
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
