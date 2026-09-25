import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { 
        padding: 20 
    },
    table: { 
        display: 'flex',
        flexDirection: 'column',
        width: '100%', 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderColor: '#bfbfbf',
        borderRightWidth: 0, 
        borderBottomWidth: 0 
    },
    tableRow: { 
        display: 'flex',
        flexDirection: 'row' 
    },
    tableColHeader: { 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderColor: '#bfbfbf',
        borderLeftWidth: 0, 
        borderTopWidth: 0, 
        backgroundColor: '#f0f0f0' 
    },
    tableCol: { 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderColor: '#bfbfbf',
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    },
    tableCellHeader: { 
        fontWeight: 'bold' 
    },
    tableCell: { 
        color: '#222222'
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 14,
        marginBottom: 6,
        color: '#1f2937'
    }
});

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

export default function PDF({ headers = [], data = [], fileName = "tabla_datos.pdf" }) {
    const PDFDocument = () => {
        const A4_PORTRAIT_WIDTH = 595.28;
        const A4_LANDSCAPE_WIDTH = 841.89;
        const PAGE_PADDING = 20;

        const structuredTables = extractStructuredTables(headers, data);

        const maxCols = structuredTables.reduce(
            (max, t) => Math.max(max, t.headers.length),
            0
        );

        const isLandscape = maxCols > 5;
        const pageWidth = isLandscape ? A4_LANDSCAPE_WIDTH : A4_PORTRAIT_WIDTH;
        const availableWidth = pageWidth - PAGE_PADDING * 2;

        const renderTable = (tableHeaders, tableData, title = null) => {
            if (!tableHeaders || tableHeaders.length === 0) return null;

            const charWidthFactor = 5.8;
            const colEstimatedWidths = tableHeaders.map((header) => {
                const label = String(typeof header === 'object' ? header.label || header.key : header);
                return Math.max(label.length * charWidthFactor + 10, 40);
            });

            const totalEstimatedWidth = colEstimatedWidths.reduce((sum, w) => sum + w, 0);

            const zoom = totalEstimatedWidth > availableWidth 
                ? Math.max(0.35, availableWidth / totalEstimatedWidth) 
                : 1;

            const headerFontSize = Math.max(4.5, Math.round(9 * zoom * 10) / 10);
            const cellFontSize = Math.max(4, Math.round(7.5 * zoom * 10) / 10);
            const cellPadding = Math.max(2, Math.round(4 * zoom));

            const colWidths = colEstimatedWidths.map(
                (w) => `${(w / totalEstimatedWidth) * 100}%`
            );

            return (
                <View key={title || 'main-table'} style={{ marginBottom: 10 }}>
                    {title && (
                        <Text style={styles.sectionTitle}>
                            {formatTitle(title)}
                        </Text>
                    )}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            {tableHeaders.map((header, i) => (
                                <View key={`header-${i}`} style={[styles.tableColHeader, { width: colWidths[i] }]}>
                                    <Text 
                                        wrap={false}
                                        style={[
                                            styles.tableCellHeader, 
                                            { 
                                                fontSize: headerFontSize, 
                                                margin: cellPadding 
                                            }
                                        ]}
                                    >
                                        {typeof header === 'object' ? header.label || header.key : header}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {tableData.map((row, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={styles.tableRow}>
                                {tableHeaders.map((header, colIndex) => {
                                    const key = typeof header === 'object' ? header.key : header;
                                    let value = typeof row === 'object' && row !== null ? row[key] : row;
                                    
                                    let displayValue = "";
                                    if (value !== null && value !== undefined) {
                                        displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                                    }

                                    return (
                                        <View key={`cell-${rowIndex}-${colIndex}`} style={[styles.tableCol, { width: colWidths[colIndex] }]}>
                                            <Text style={[styles.tableCell, { fontSize: cellFontSize, margin: cellPadding }]}>
                                                {displayValue}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </View>
            );
        };

        return (
            <Document>
                <Page size="A4" orientation={isLandscape ? "landscape" : "portrait"} style={styles.page}>
                    {structuredTables.map((t) => renderTable(t.headers, t.data, t.title))}
                </Page>
            </Document>
        );
    };

    return (
        <PDFDownloadLink document={<PDFDocument />} fileName={fileName}>
            {() => (
                <img 
                    src="images/pdf.png" 
                    alt="Descargar PDF" 
                    height={25} 
                    width={25}
                    style={{ 
                        cursor: 'pointer', 
                        transition: 'opacity 0.2s'
                    }} 
                />
            )}
        </PDFDownloadLink>
    );
}




