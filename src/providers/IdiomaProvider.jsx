import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const IdiomaContext = createContext();

export const useIdioma = () => {
    const context = useContext(IdiomaContext);
    if (!context) {
        throw new Error('useIdioma must be used within a IdiomaProvider');
    }
    return context;
};

export const IdiomaProvider = ({ children }) => {
    const [idioma, setIdioma] = useState(() => {
        return localStorage.getItem("idioma") || "ingles";
    });

    const [diccionario, setDiccionario] = useState({});

    useEffect(() => {
        localStorage.setItem("idioma", idioma);
        const actualizarDiccionario = async () => {
            try {
                const response = await fetch("diccionario.json");
                const data = await response.json();
                setDiccionario(data[idioma] || {});
            } catch (error) {
                console.error("Error cargando el diccionario:", error);
                setDiccionario({});
            }
        }
        actualizarDiccionario();
    }, [idioma]);

    // Función t para obtener traducciones con soporte para claves anidadas (ej: "perfil.titulo")
    const t = useCallback((path) => {
        const keys = path.split('.');
        let result = diccionario;
        for (const key of keys) {
            if (result && result[key] !== undefined) {
                result = result[key];
            } else {
                return path; // Retorna la clave si no encuentra la traducción
            }
        }
        return result;
    }, [diccionario]);

    return (
        <IdiomaContext.Provider value={{ idioma, setIdioma, diccionario, t }}>
            {children}
        </IdiomaContext.Provider>
    );
};
