import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function formatTitle(str) {
    return String(str)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractStructuredTables(headers, data) {
    const tables = [];
    if (!data || data.length === 0) return tables;

    const sample = data[0] || {};
    const allKeys = headers && headers.length > 0
        ? headers.map((h) => (typeof h === 'object' ? h.key : h))
        : Object.keys(sample);

    const scalarKeys = [];
    const objectKeys = [];
    const arrayKeys = [];

    allKeys.forEach((key) => {
        const val = sample[key];
        if (Array.isArray(val)) {
            arrayKeys.push(key);
        } else if (val !== null && typeof val === 'object') {
            objectKeys.push(key);
        } else {
            scalarKeys.push(key);
        }
    });

    // 1. Tabla principal escalar
    if (scalarKeys.length > 0) {
        tables.push({
            title: null,
            headers: scalarKeys,
            data: data.map((row) => {
                const r = {};
                scalarKeys.forEach((k) => (r[k] = row?.[k]));
                return r;
            })
        });
    }

    // 2. Tablas para objetos anidados (ej. Nómina: trabajador, empresa, devengos, deducciones, etc.)
    objectKeys.forEach((objKey) => {
        const objData = data
            .map((row) => row?.[objKey] || {})
            .filter((o) => Object.keys(o).length > 0);

        if (objData.length > 0) {
            const subSample = objData[0];
            const subScalarKeys = [];
            const subNestedObjects = [];

            Object.keys(subSample).forEach((k) => {
                const subVal = subSample[k];
                if (subVal !== null && typeof subVal === 'object' && !Array.isArray(subVal)) {
                    subNestedObjects.push(k);
                } else if (!Array.isArray(subVal)) {
                    subScalarKeys.push(k);
                }
            });

            if (subScalarKeys.length > 0) {
                tables.push({
                    title: formatTitle(objKey),
                    headers: subScalarKeys,
                    data: objData
                });
            }

            subNestedObjects.forEach((nestedKey) => {
                const nestedData = objData
                    .map((o) => o?.[nestedKey] || {})
                    .filter((o) => Object.keys(o).length > 0);

                if (nestedData.length > 0) {
                    const nestedKeys = Object.keys(nestedData[0]);
                    tables.push({
                        title: `${formatTitle(objKey)} - ${formatTitle(nestedKey)}`,
                        headers: nestedKeys,
                        data: nestedData
                    });
                }
            });
        }
    });

    // 3. Tablas para arrays y arrays anidados (ej. Pedidos -> Detalle, Líneas)
    arrayKeys.forEach((arrKey) => {
        const arrayItems = data.flatMap((row) => row?.[arrKey] || []);
        if (arrayItems.length > 0) {
            if (typeof arrayItems[0] === 'object' && arrayItems[0] !== null) {
                const arrScalarKeys = [];
                const nestedArrayKeys = [];

                const allItemKeys = Array.from(
                    new Set(
                        arrayItems.flatMap((it) =>
                            typeof it === 'object' && it !== null ? Object.keys(it) : []
                        )
                    )
                );

                allItemKeys.forEach((k) => {
                    if (arrayItems.some((it) => Array.isArray(it?.[k]))) {
                        nestedArrayKeys.push(k);
                    } else {
                        arrScalarKeys.push(k);
                    }
                });

                if (arrScalarKeys.length > 0) {
                    tables.push({
                        title: formatTitle(arrKey),
                        headers: arrScalarKeys,
                        data: arrayItems.map((it) => {
                            const r = {};
                            arrScalarKeys.forEach((k) => (r[k] = it?.[k]));
                            return r;
                        })
                    });
                }

                nestedArrayKeys.forEach((nestedArrKey) => {
                    const nestedItems = [];
                    arrayItems.forEach((it, idx) => {
                        const subArr = it?.[nestedArrKey] || [];
                        const parentRef = it?.numero || it?.ref || it?.id || `#${idx + 1}`;
                        subArr.forEach((subIt) => {
                            if (typeof subIt === 'object' && subIt !== null) {
                                nestedItems.push({
                                    pedido: parentRef,
                                    ...subIt
                                });
                            } else {
                                nestedItems.push({
                                    pedido: parentRef,
                                    valor: subIt
                                });
                            }
                        });
                    });

                    if (nestedItems.length > 0) {
                        const nestedHeaders = Array.from(
                            new Set(nestedItems.flatMap((it) => Object.keys(it)))
                        );
                        tables.push({
                            title: `${formatTitle(arrKey)} - ${formatTitle(nestedArrKey)}`,
                            headers: nestedHeaders,
                            data: nestedItems
                        });
                    }
                });
            } else {
                tables.push({
                    title: formatTitle(arrKey),
                    headers: [arrKey],
                    data: arrayItems.map((v) => ({ [arrKey]: v }))
                });
            }
        }
    });

    return tables;
}

export default function Excel({ headers = [], data = [], fileName = "tabla_datos.xlsx" }) {
    const handleDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        const structuredTables = extractStructuredTables(headers, data);

        structuredTables.forEach((table, index) => {
            if (!table.headers || table.headers.length === 0) return;

            // Fila de separación entre tablas
            if (index > 0) {
                worksheet.addRow([]);
            }

            // Título si existe
            if (table.title) {
                const titleRow = worksheet.addRow([table.title]);
                titleRow.font = { bold: true, size: 11, color: { argb: 'FF1F2937' } };
            }

            // Cabecera de la tabla
            const headerRow = worksheet.addRow(table.headers);
            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: table.title ? 'FFE5E7EB' : 'FFF0F0F0' }
            };

            // Filas de datos
            table.data.forEach((row) => {
                const rowValues = table.headers.map((key) => {
                    let val = typeof row === 'object' && row !== null ? row[key] : row;
                    if (val !== null && val !== undefined && typeof val === 'object') {
                        val = JSON.stringify(val);
                    }
                    return val ?? "";
                });
                worksheet.addRow(rowValues);
            });
        });

        // Auto-ajustar ancho de columnas según el contenido máximo
        worksheet.columns.forEach((column) => {
            let maxLen = 12;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellVal = cell.value ? String(cell.value) : "";
                if (cellVal.length > maxLen) {
                    maxLen = Math.min(cellVal.length + 3, 50);
                }
            });
            column.width = maxLen;
        });

        // Generar y descargar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);
    };

    return (
        <img 
            src="images/csv.png" 
            alt="Descargar Excel" 
            height={25} 
            width={25}
            onClick={handleDownload}
            style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
        />
    );
}