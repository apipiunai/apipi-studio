import { useTheme } from "../providers/ThemeProvider";
import { useIdioma } from "../providers/IdiomaProvider";
import { useRef } from "react";

export default function DatePicker({ value, setValue, style, placeholder }) {
  const { theme } = useTheme();
  const { diccionario } = useIdioma();
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  // 3. Función para abrir el calendario programáticamente
  const handleWrapperClick = () => {
    if (inputRef.current) {
      try {
        inputRef.current.showPicker(); // Método estándar moderno
      } catch (error) {
        // Fallback para navegadores antiguos
        inputRef.current.focus();
      }
    }
  };

  const textToShow = diccionario[placeholder] || placeholder;

  return (
    <div className="date-picker-wrapper" onClick={handleWrapperClick} style={{ cursor: "pointer" }}>
      <style>{`
        .date-picker-wrapper {
          min-width: 150px;
          position: relative;
          width: fit-content;
        }

        .date-picker-input {
          padding: 10px 10px;
          border-radius: 5px;
          border: 1px solid ${theme.border};
          background-color: ${theme.card};
          font-size: 16px;
          color: white;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        /* Ocultar el icono nativo si prefieres un diseño más limpio */
        .date-picker-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          color: ${theme.main};
        }

        .fake-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          padding: 0 10px; 
          display: flex;
          align-items: center;
          color: ${theme.main};
          opacity: 0.5;
          pointer-events: none;
          font-family: inherit;
          font-size: 16px;
        }
      `}</style>

      <input
        ref={inputRef} // 4. Asignamos la referencia
        type="date"
        className="date-picker-input"
        value={value}
        onChange={handleChange}
        style={{
          background: theme.card,
          cursor: "pointer",
          color: theme.text1,
          ...style,
        }}
      />

      {!value && <span className="fake-placeholder">{textToShow}</span>}
    </div>
  );
}