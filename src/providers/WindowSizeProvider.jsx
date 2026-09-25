import { createContext, useContext, useState, useEffect } from "react";

const WindowSizeContext = createContext();

export const useWindowSize = () => {
    const context = useContext(WindowSizeContext);
    if (!context) {
        throw new Error("useWindowSize must be used within a WindowSizeProvider");
    }
    return context;
};

export function WindowSizeProvider({ children }) {
    
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);



    return (
        <WindowSizeContext.Provider value={{ width, height }}>
            {children}
        </WindowSizeContext.Provider>
    );
}