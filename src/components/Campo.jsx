import Button from "./Button";
import { useTheme } from "../providers/ThemeProvider";
import { useIdioma } from "../providers/IdiomaProvider";

export default function Campo({ nombre, valor, onChange, onArrayChange, onAddLinea, onDeleteLinea }) {
    const { theme } = useTheme();
    const { t } = useIdioma();
    if (Array.isArray(valor)) {
        return (
            <div style={{ marginBottom: 15, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label>{nombre}</label>
                    <Button onClick={() => onAddLinea(nombre)} text={t("comun.anadirLinea")} style={{ background: theme.main, color: "white" }} />
                </div>

                {valor.map((item, idx) => (
                    <div key={idx} style={{ border: `1px solid ${theme.border}`, borderRadius: 6, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                        {typeof item === "object" && item !== null ? (
                            Object.keys(item).map((subKey) => {
                                if (Array.isArray(item[subKey])) {
                                    return (
                                        <Campo
                                            key={subKey}
                                            nombre={subKey}
                                            valor={item[subKey]}
                                            onChange={(childK, childV) => {
                                                const newItem = { ...item, [childK]: childV };
                                                onArrayChange(nombre, idx, null, newItem);
                                            }}
                                            onArrayChange={(childK, childIdx, childSubK, childV) => {
                                                const childArr = [...(item[childK] || [])];
                                                if (childSubK !== null) {
                                                    childArr[childIdx] = { ...childArr[childIdx], [childSubK]: childV };
                                                } else {
                                                    childArr[childIdx] = childV;
                                                }
                                                const newItem = { ...item, [childK]: childArr };
                                                onArrayChange(nombre, idx, null, newItem);
                                            }}
                                            onAddLinea={(childK) => {
                                                const childArr = item[childK] || [];
                                                const plantilla = childArr.length > 0 && typeof childArr[0] === "object"
                                                    ? Object.keys(childArr[0]).reduce((acc, k) => ({ ...acc, [k]: "" }), {})
                                                    : {};
                                                const newItem = { ...item, [childK]: [...childArr, plantilla] };
                                                onArrayChange(nombre, idx, null, newItem);
                                            }}
                                            onDeleteLinea={(childK, childIdx) => {
                                                const childArr = (item[childK] || []).filter((_, i) => i !== childIdx);
                                                const newItem = { ...item, [childK]: childArr };
                                                onArrayChange(nombre, idx, null, newItem);
                                            }}
                                        />
                                    );
                                }
                                return (
                                    <div key={subKey} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <label>{subKey}</label>
                                        <input
                                            className="input-campo"
                                            style={{background: "transparent", color: theme.text1, border: `1px solid ${theme.border}`}}
                                            type="text"
                                            value={item[subKey] ?? ""}
                                            onChange={(e) => onArrayChange(nombre, idx, subKey, e.target.value)}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <input
                                className="input-campo"
                                style={{background: "transparent", color: theme.text1, border: `1px solid ${theme.border}`}}
                                type="text"
                                value={item ?? ""}
                                onChange={(e) => onArrayChange(nombre, idx, null, e.target.value)}
                            />
                        )}
                        <Button onClick={() => onDeleteLinea(nombre, idx)} text={t("comun.eliminarLinea")} style={{ background: theme.error, color: "white" }} />

                        {/* <button type="button" onClick={() => onDeleteLinea(nombre, idx)}>
                            Eliminar línea
                        </button> */}
                    </div>
                ))}
            </div>
        );
    }

    if (typeof valor === "boolean") {
        return (
            <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                    type="checkbox"
                    checked={valor}
                    onChange={(e) => onChange(nombre, e.target.checked)}
                />
                <label>{nombre}</label>
            </div>
        );
    }

    if (typeof valor === "object" && valor !== null) {
        return (
            <div style={{ marginBottom: 15, border: "1px solid #ccc", borderRadius: 6, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: "bold" }}>{nombre}</label>
                {Object.keys(valor).map((subKey) => (
                    <Campo
                        key={subKey}
                        nombre={subKey}
                        valor={valor[subKey]}
                        onChange={(childKey, childVal) => {
                            onChange(nombre, { ...valor, [childKey]: childVal });
                        }}
                        onArrayChange={(childKey, idx, subK, val) => {
                            const arr = [...(valor[childKey] || [])];
                            if (subK !== null) {
                                arr[idx] = { ...arr[idx], [subK]: val };
                            } else {
                                arr[idx] = val;
                            }
                            onChange(nombre, { ...valor, [childKey]: arr });
                        }}
                        onAddLinea={(childKey) => {
                            const arr = valor[childKey] || [];
                            const plantilla = arr.length > 0 && typeof arr[0] === "object"
                                ? Object.keys(arr[0]).reduce((acc, k) => ({ ...acc, [k]: "" }), {})
                                : {};
                            onChange(nombre, { ...valor, [childKey]: [...arr, plantilla] });
                        }}
                        onDeleteLinea={(childKey, idx) => {
                            const arr = (valor[childKey] || []).filter((_, i) => i !== idx);
                            onChange(nombre, { ...valor, [childKey]: arr });
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <label>{nombre}</label>
            <input
                className="input-campo" 
                type="text"
                value={valor ?? ""}
                onChange={(e) => onChange(nombre, e.target.value)}
                style={{background: "transparent", color: theme.text1, border: `1px solid ${theme.border}`}}
            />
        </div>
    );
}
