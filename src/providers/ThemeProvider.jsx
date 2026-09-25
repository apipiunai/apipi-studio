import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};




const palettes = {
    default: {
        background: "#ffffff",
        card: "#ffffff",
        cardBox: "#e9e9e9ff",
        header: "#ffffff",
        sidebar: "#ffffff",
        border: "#d4d4d4ff",
        main: "#007accff",
        text1: "#1a1a1a",
        text2: "#4a4a4a",
        textContrast1: "#fff",
        textContrast2: "#e6f3ff",
        code: "#618993ff",
        hover: "#c5e6ffff",
        lightHover: "#f0f9ffff",
        darkHover: "#72b5e1ff",
        icon: "#333",
        iconContrast: "#fff",
        tableHeader: "#daeefdff",
        tableRow1: "#f7fbff",
        tableRow2: "#ffffff",
        chart1: "#007accff",
        chart2: "#00bcd4ff",
        chart3: "#ef5350ff",
        chart4: "#26a69aff",
        chart5: "#5c6bc0ff",
        chart6: "#1565c0ff",
        pieBack: "#cbcbcbff",
        button: "#007accff",
        cancelButton: "#987ccfff",
        clearButton: "#ef5350ff",
        tooltip: "#555",
        error: "#cf6260ff",
        warning: "#ffde26ff",
        success: "#26a69aff",
    },
    dark: {
        background: "#121212", 
        card: "#222",       
        cardBox: "#555",
        header: "#444",  
        sidebar: "#444",   
        border: "#333",     
        main: "#6ac2fdff",
        text1: "#ffffff",      
        text2: "#b0b0b0",      
        textContrast1: "#333", 
        textContrast2: "#ffffff", 
        code: "#9bcbd7ff",
        hover: "#888",    
        lightHover: "#666", 
        darkHover: "#72b5e1ff",  
        icon: "#e0e0e0",       
        iconContrast: "#000000", 
        tableHeader: "#444", 
        tableRow1: "#555",   
        tableRow2: "#666",   
        chart1: "#ff6b6b",     
        chart2: "#4ecdc4",     
        chart3: "#ffe66d",     
        chart4: "#1a535c",     
        chart5: "#ff9f43",     
        chart6: "#a55eea",     
        pieBack: "#888",
        button: "#6ab0ffff",     
        cancelButton: "#7370caff", 
        clearButton: "#ef5350",  
        tooltip: "#000000",    
        error: "#ef5350",
        warning: "#ffde26",
        success: "#26a69a",
    }
};

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem("theme") || "default";
    });

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const theme = palettes[mode];

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};