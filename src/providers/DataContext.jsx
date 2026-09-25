import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "../api/apiClient";
import { useAuth } from "./AuthContext";



const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};

export function DataProvider({ children }) {


    const { token, verifyToken, activarMensaje } = useAuth();

    // Ref para siempre leer el token más reciente sin recapturar el closure
    const tokenRef = useRef(token);
    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    // Semáforo para evitar múltiples retries simultáneos
    const isRefreshingRef = useRef(false);
    const retryQueueRef = useRef([]);

    const withTokenRetry = useCallback(async (fn, retries = 2, delay = 1000) => {
        try {
            // Intento inicial con el token actual
            return await fn(tokenRef.current);
        } catch (err) {
            // Verificamos si es un error de token (401, 403, falta de token o mensaje específico)
            const status = err?.response?.status;
            const msg = (err?.response?.data?.mensaje || "").toLowerCase();
            const isHtmlResponse = typeof err?.response?.data === 'string'
                && err.response.data.trim().startsWith('<');
            const isTokenError =
                status === 401 ||
                (status === 403 && !isHtmlResponse) ||
                msg.includes("token") ||
                msg.includes("caducad") ||
                msg.includes("expirad") ||
                !tokenRef.current;

            if (isTokenError) {
                console.warn("Detectado error de token o sesión expirada. Intentando refrescar...");

                let newToken;
                if (isRefreshingRef.current) {
                    // Si ya se está refrescando, esperamos a que termine
                    newToken = await new Promise((resolve, reject) => {
                        retryQueueRef.current.push({ resolve, reject });
                    });
                } else {
                    isRefreshingRef.current = true;
                    try {
                        newToken = await verifyToken();
                        // Despachamos a todos los que estaban esperando
                        retryQueueRef.current.forEach(p => p.resolve(newToken));
                    } catch (refreshErr) {
                        retryQueueRef.current.forEach(p => p.reject(refreshErr));
                        throw refreshErr;
                    } finally {
                        retryQueueRef.current = [];
                        isRefreshingRef.current = false;
                    }
                }

                // Reintentamos la llamada original con el nuevo token
                try {
                    return await fn(newToken);
                } catch (retryErr) {
                    // Si falla incluso con el nuevo token, reintentamos por robustez si quedan intentos
                    if (retries > 0) {
                        console.warn(`Fallo tras refrescar token. Reintentando de nuevo (${retries} restantes)...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return withTokenRetry(fn, retries - 1, delay);
                    }
                    throw retryErr;
                }
            } else {
                // Si es un error distinto (red, 500, etc.), reintentamos simplemente si quedan intentos
                if (retries > 0) {
                    console.warn(`Error de red o servidor detectado. Reintentando (${retries} restantes)...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return withTokenRetry(fn, retries - 1, delay);
                }
                throw err;
            }
        }
    }, [verifyToken]);

   


    const getDevices = useCallback(async () => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/devices', {}, { headers: { Authorization: currentToken } })
                .then(res => {

                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error obteniendo dispositivos")
                        return []
                    }
                    return res.data
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo obteniendo dispositivos")
            return [];
        });

    }, [withTokenRetry]);


    const getMuestras = useCallback(async (body) => {

        return withTokenRetry(currentToken =>
            apiClient.post('pred/muestras', body, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        if (res.data === "No existen muestras") {
                            activarMensaje("warning", "No existen muestras")
                            return false
                        }
                        activarMensaje("error", "Error obteniendo muestras")
                        return false
                    }
                    return res.data
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo obteniendo muestras")
            return [];
        });


    }, [withTokenRetry]);


    const editarMuestras = useCallback(async (body) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/editmuestras', body, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error editando muestras")
                        return false
                    }
                    activarMensaje("success", "Muestras editadas correctamente")
                    return true
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo editando muestras")
            return false;
        });

    }, [withTokenRetry]);


    const getPredicciones = useCallback(async (body) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/predicciones', body, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        if (res.data === "No existen predicciones") {
                            activarMensaje("warning", "No existen predicciones")
                            return false
                        }
                        activarMensaje("error", "Error obteniendo predicciones")
                        return false
                    }
                    return res.data
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo obteniendo predicciones")
            return false;
        });

    }, [withTokenRetry]);


    const getDevice = useCallback(async (name) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/device', { name: name }, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error obteniendo configuración del dispositivo")
                        return null
                    }
                    return res.data[0]
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo obteniendo configuración del dispositivo")
            return null;
        });
    }, [withTokenRetry]);


    const addDevice = useCallback(async (body) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/add-device', body, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error añadiendo dispositivo")
                        return false
                    }
                    activarMensaje("success", "Dispositivo añadido correctamente")
                    return true
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo al añadir dispositivo")
            return false;
        });
    }, [withTokenRetry]);


    const editDevice = useCallback(async (body) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/edit-device', body, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error editando dispositivo")
                        return false
                    }
                    activarMensaje("success", "Dispositivo actualizado correctamente")
                    return true
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo al editar dispositivo")
            return false;
        });
    }, [withTokenRetry]);


    const deleteDevice = useCallback(async (body) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/delete-device', body, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error eliminando dispositivo")
                        return false
                    }
                    activarMensaje("success", "Dispositivo eliminado correctamente")
                    return true
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo al eliminar dispositivo")
            return false;
        });
    }, [withTokenRetry]);


    const getModelos = useCallback(async () => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/modelos', {}, { headers: { Authorization: currentToken } })
                .then(res => {

                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error obteniendo modelos")
                        return []
                    }
                    return res.data
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo obteniendo modelos")
            return [];
        });

    }, [withTokenRetry]);


    const activarModelo = useCallback(async (idModelo) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/updatemodelos', { idmodelo: idModelo }, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error activando modelo")
                        return []
                    }
                    activarMensaje("success", "Modelo activado correctamente")
                    return res.data
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo activando modelo")
            return [];
        });

    }, [withTokenRetry]);


    const desactivarModelo = useCallback(async (idModelo) => {

        return withTokenRetry(currentToken =>
            apiClient.post('/pred/desactivarmodelo', { idmodelo: idModelo }, { headers: { Authorization: currentToken } })
                .then(res => {
                    if (typeof res.data === "string") {
                        activarMensaje("error", "Error desactivando modelo")
                        return false
                    }
                    activarMensaje("success", "Modelo desactivado correctamente")
                    return true
                })
        ).catch(err => {
            activarMensaje("error", "Error definitivo desactivando modelo")
            return false;
        });

    }, [withTokenRetry]);


    return (
        <DataContext.Provider value={{
            getDevices, getMuestras, addDevice, editDevice, getDevice, editarMuestras, getPredicciones, getModelos, activarModelo, deleteDevice, desactivarModelo
        }}>
            {children}
        </DataContext.Provider>
    );
}