import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

type useContextType = {
    userName: string;
    setUserName: Dispatch<SetStateAction<string>>;
    accessToken: string | undefined;
    setAccessToken: Dispatch<SetStateAction<string | undefined>>
};

const userContext = createContext<useContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [userName, setUserName] = useState("");
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined)

    return (
        <userContext.Provider
            value={{ userName, setUserName, accessToken, setAccessToken }}
        >
            {children}
        </userContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(userContext);
    if (!ctx)
        throw new Error("useUser deve ser usado dentro de userProvider");
    return ctx;
}
