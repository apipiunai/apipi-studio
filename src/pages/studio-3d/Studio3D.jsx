import { useState, useEffect } from "react"

import { useAuth } from "../../providers/AuthProvider"
import { useTheme } from "../../providers/ThemeProvider"
import { useIdioma } from "../../providers/IdiomaProvider"
import { useWindowSize } from "../../providers/WindowSizeProvider"

import Header3D from "./Header3D"
import Scene3D from "./Scene3D"
import Items3D from "./Items3D"
import ItemSettings from "./ItemSettings"


export default function Studio3D() {

    const { theme } = useTheme()
    const { t } = useIdioma()
    const { width } = useWindowSize()

    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);

    const [showItems, setShowItems] = useState(false);

    const [showGrid, setShowGrid] = useState(true);
    const [showAxis, setShowAxis] = useState(true);

    return (
        <>
            <Header3D 
                showAxis={showAxis} 
                setShowAxis={setShowAxis} 
                showGrid={showGrid} 
                setShowGrid={setShowGrid} 
                showItems={showItems} 
                setShowItems={setShowItems} 
                setSelectedModel={setSelectedModel} 
                selectedModel={selectedModel} 
                setModels={setModels} 
                models={models}
            />
            <Items3D 
                models={models} 
                setModels={setModels} 
                selectedModel={selectedModel} 
                show={showItems} 
                setSelectedModel={setSelectedModel}
            />
            <Scene3D 
                models={models} 
                selectedModel={selectedModel} 
                setSelectedModel={setSelectedModel} 
                showAxis={showAxis} 
                showGrid={showGrid} 
            />
            {selectedModel && <ItemSettings 
                selectedModel={selectedModel} 
                setSelectedModel={setSelectedModel}
                setModels={setModels} 
                models={models}
            />}
        </>
    )
}