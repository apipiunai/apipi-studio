import { useTheme } from "../providers/ThemeProvider";

export default function Spinner({style, size = 42, color}) {
    const { theme } = useTheme();
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            backgroundColor: theme.background,
            ...style
        }}>
            <style>{`
                @keyframes spin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .spinner {
                    width: ${size}px;
                    height: ${size}px;
                    border: 3px solid #e0e0e0;
                    border-top-color: ${color || theme.main};
                    border-radius: 50%;
                    animation: spin 0.75s linear infinite;
                }
            `}</style>
            <div className="spinner" />
        </div>
    )
}