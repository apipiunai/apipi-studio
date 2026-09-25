import { useContext, createContext, useEffect, useState } from "react";

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {


    const apiFactura = (body) => {
        fetch("http://localhost:5000/factura", {
            method: "POST",
            body: body,
        })
            .then((response) => { return response.json() })
            .catch((error) => { alert("Error:", error) });
    }

    const apiAlbaran = (body) => {
        fetch("http://localhost:5000/albaran", {
            method: "POST",
            body: body,
        })
            .then((response) => { return response.json() })
            .catch((error) => { alert("Error:", error) });
    }
}


return (
    <ModelContext.Provider value={{ apiFactura, apiAlbaran }}>
        {children}
    </ModelContext.Provider>
);


export const useModel = () => useContext(ModelContext);
