
import { useTheme } from "../../providers/ThemeProvider"
import CancelIcon from '@mui/icons-material/Cancel';
import Card from "../../components/Card";

export default function Items3D({ models, setModels, selectedModel, setSelectedModel, show }) {
    const { theme } = useTheme()
    return (
        <>
            {show && models.length > 0 && <Card className="thin-scroll" style={{ position: "fixed",maxHeight: "500px", fontSize: "small", maxHeight: "50%", overflow: "auto", top: "50%", right: 15, transform: "translateY(-50%)", borderRadius: 10, padding: 10, zIndex: 9999, width: 250, gap: 10, display: "flex", flexDirection: "column" }}>
                {models.map((model) => (
                    <div key={model.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span onClick={() => { selectedModel?.id === model.id ? setSelectedModel(null) : setSelectedModel(model) }} style={{ color: selectedModel?.id === model.id ? theme.main : "", display: "flex", alignItems: "center", cursor: "pointer" }}>{model.id} - {model.type}</span>
                        <div onClick={() => { 
                            setModels(models.filter((m) => m.id !== model.id)); 
                            
                            if(selectedModel?.id === model.id) { 
                                setSelectedModel(null) 
                            } 
                            
                        }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                            <CancelIcon className="cursor-zoom" fontSize="20px" style={{ color: theme.error }} /> 
                        </div>
                    </div>
                ))}
            </Card>}
         
        </>
    )
}
