import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState("");

    const [loading, setLoading] = useState(true);

    const [idMessage, setIdMessage] = useState(0);
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                if (loading) {
                    setLoading(false);
                }
            }, 5000);
        }
    }, [loading]);

    const activarMensaje = (type, text) => {
        setIdMessage(idMessage + 1);
        setMessages(prev => [...prev, { type, text, id: idMessage }]);
        setTimeout(() => {
            setMessages(prev => prev.filter((message) => message.id !== idMessage));
        }, 5000);
    }

    // Ref para que refreshToken/verifyToken lean siempre el token y user más recientes
    const tokenRef = useRef(token);
    useEffect(() => { tokenRef.current = token; }, [token]);

    // Promesa compartida para evitar múltiples refreshes simultáneos
    const refreshPromiseRef = useRef(null);

    const refreshToken = useCallback(async (retries = 2) => {
        // Si ya hay un refresh en curso, reutilizamos la misma promesa
        if (refreshPromiseRef.current) return refreshPromiseRef.current;

        const attempt = () => apiClient.post('/refresh')
            .then((response) => {
                const data = response.data;
                setToken(data.token);
                return data.token;
            });

        refreshPromiseRef.current = (async () => {
            try {
                return await attempt();
            } catch (error) {
                window.location.href = "/";
            }
        })();

        refreshPromiseRef.current.finally(() => {
            refreshPromiseRef.current = null;
        });

        return refreshPromiseRef.current;
    }, []);

   





    return (
        <AuthContext.Provider value={{ }}>
            {children}
        </AuthContext.Provider>
    );
};
