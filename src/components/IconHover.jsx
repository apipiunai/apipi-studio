import { useMemo, cloneElement } from "react";
import { useTheme } from "../providers/ThemeProvider";

export default function IconHover({ icon, onClick, style }) {

    const { theme } = useTheme();
    const handleClick = onClick;

    const styledIcon = useMemo(() => {
        return cloneElement(icon, {
            onClick: handleClick,
            sx: {
                color: theme.icon,
                cursor: "pointer",
                borderRadius: "50%",
                padding: "5px",
                transition: "background-color 0.3s ease",
                "&:hover": {
                    backgroundColor: theme.lightHover,
                },
                ...style
            }
        });
    }, [icon, handleClick, theme]);

    return styledIcon;
}