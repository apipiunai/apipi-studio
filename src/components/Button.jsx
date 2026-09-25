import { useTheme } from "../providers/ThemeProvider";


export default function Button({ text, style, onClick, children }) {
    
    const { theme } = useTheme();
    
    return (
        <button type={onClick ? "button" : "submit"} onClick={onClick} style={{ border: "none", textTransform: "uppercase", color: theme.textContrast2, cursor: "pointer", textAlign: "center", padding: "10px", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", backgroundColor: theme.main, ...style }}>
            {text || children}
        </button>
    )
}