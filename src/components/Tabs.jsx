import { useState } from "react";
import { useTheme } from "../providers/ThemeProvider";

export default function Tabs({ tabs, tab, setTab, style }) {

    const { theme } = useTheme();
    const [over, setOver] = useState(null);


    return (
        <div style={{ display: "flex", overflowX: "auto", width: "100%" }}>
            {tabs.map((item, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "15px",
                        borderBottom: tab === index ? `3px solid ${theme.main}` : 
                            over === index && tab !== index
                                ? `3px solid ${theme.lightHover}` : "3px solid transparent",
                       transition: "all 0.1s ease",
                        cursor: "pointer",
                        ...style
                    }}
                    onMouseEnter={() => setOver(index)}
                    onMouseLeave={() => setOver(null)}
                    onClick={() => setTab(index)}
                >
                    {item}
                </div>
            ))}
        </div>
    );

   
}