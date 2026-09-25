import { useTheme } from "../providers/ThemeProvider";


export default function InputText({ value, setValue, placeholder, style, type = "text" }) {
    const { theme } = useTheme();
    return (
        <>
            <input type={type} name="username"
                style={{
                    backgroundColor: theme.card,
                    border: `1px solid ${theme.border}`,
                    padding: 10,
                    borderRadius: 5,
                    color: theme.text1,
                    ...style,
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder} />
            <style>{`
            input::placeholder {
                color: ${theme.text2};
                opacity: 0.5;
                font-size: 12px;
            }
        `}</style>
        </>
    );
}