import { useTheme } from "../../providers/ThemeProvider"

import Card from "../../components/Card"
import IconHover from '../../components/IconHover';
import Desplegable from "../../components/Desplegable";

import GamepadIcon from '@mui/icons-material/Gamepad';
import OpacityIcon from '@mui/icons-material/Opacity';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import TextureIcon from '@mui/icons-material/Texture';

const textures = [
    { name: "color", opacity: 1, roughness: 0.4, metalness: 0.2, color: "gray" },

    // Metales
    { name: "metal", opacity: 1, roughness: 0.4, metalness: 0.9, color: "gray" },
    { name: "steel", opacity: 1, roughness: 0.3, metalness: 1, color: "#8A8A8A" },
    { name: "aluminum", opacity: 1, roughness: 0.25, metalness: 1, color: "#BFC3C5" },
    { name: "iron", opacity: 1, roughness: 0.65, metalness: 1, color: "#454545" },
    { name: "copper", opacity: 1, roughness: 0.3, metalness: 1, color: "#B87333" },
    { name: "brass", opacity: 1, roughness: 0.3, metalness: 1, color: "#C5A34A" },
    { name: "gold", opacity: 1, roughness: 0.2, metalness: 1, color: "#D4AF37" },
    { name: "chrome", opacity: 1, roughness: 0.05, metalness: 1, color: "#D9D9D9" },
    { name: "silver", opacity: 1, roughness: 0.2, metalness: 1, color: "#C0C0C0" },
    { name: "titanium", opacity: 1, roughness: 0.35, metalness: 1, color: "#777B80" },

    // Plásticos
    { name: "plastic", opacity: 1, roughness: 0.2, metalness: 0.5, color: "gray" },
    { name: "hard plastic", opacity: 1, roughness: 0.3, metalness: 0, color: "#303030" },
    { name: "matte plastic", opacity: 1, roughness: 0.75, metalness: 0, color: "#444444" },
    { name: "rubber", opacity: 1, roughness: 0.9, metalness: 0, color: "#111111" },
    { name: "silicone", opacity: 1, roughness: 0.65, metalness: 0, color: "#777777" },

    // Cristales
    { name: "glass", opacity: 0.5, roughness: 0.1, metalness: 0.1, color: "white" },
    { name: "frosted glass", opacity: 0.6, roughness: 0.45, metalness: 0, color: "#EEEEEE" },
    { name: "dark glass", opacity: 0.45, roughness: 0.1, metalness: 0, color: "#222222" },
    { name: "blue glass", opacity: 0.45, roughness: 0.05, metalness: 0, color: "#5BA9D6" },

    // Pinturas
    { name: "paint", opacity: 1, roughness: 0.35, metalness: 0.1, color: "#555555" },
    { name: "matte paint", opacity: 1, roughness: 0.8, metalness: 0, color: "#555555" },
    { name: "glossy paint", opacity: 1, roughness: 0.15, metalness: 0.1, color: "#555555" },
    { name: "powder coat", opacity: 1, roughness: 0.6, metalness: 0.2, color: "#444444" },

    // Madera
    { name: "wood", opacity: 1, roughness: 0.7, metalness: 0, color: "#8B5A2B" },
    { name: "dark wood", opacity: 1, roughness: 0.75, metalness: 0, color: "#3B2414" },
    { name: "light wood", opacity: 1, roughness: 0.7, metalness: 0, color: "#C89B6D" },

    // Piedra / construcción
    { name: "concrete", opacity: 1, roughness: 0.9, metalness: 0, color: "#888888" },
    { name: "cement", opacity: 1, roughness: 0.95, metalness: 0, color: "#999999" },
    { name: "stone", opacity: 1, roughness: 0.85, metalness: 0, color: "#777777" },
    { name: "marble", opacity: 1, roughness: 0.3, metalness: 0, color: "#E5E5E5" },
    { name: "brick", opacity: 1, roughness: 0.9, metalness: 0, color: "#9B4A35" },

    // Cerámica
    { name: "ceramic", opacity: 1, roughness: 0.25, metalness: 0, color: "#EEEEEE" },
    { name: "porcelain", opacity: 1, roughness: 0.15, metalness: 0, color: "#FFFFFF" },

    // Textiles
    { name: "fabric", opacity: 1, roughness: 1, metalness: 0, color: "#555555" },
    { name: "leather", opacity: 1, roughness: 0.65, metalness: 0, color: "#542F1F" },

    // Papel
    { name: "paper", opacity: 1, roughness: 0.9, metalness: 0, color: "#F5F0E6" },
    { name: "cardboard", opacity: 1, roughness: 1, metalness: 0, color: "#A67B5B" },

    // Materiales especiales
    { name: "ice", opacity: 0.55, roughness: 0.15, metalness: 0, color: "#C9EFFF" },
    { name: "water", opacity: 0.4, roughness: 0.05, metalness: 0, color: "#4FA3D1" },
    { name: "wax", opacity: 0.8, roughness: 0.35, metalness: 0, color: "#E8D7A8" },
    { name: "ceramic glazed", opacity: 1, roughness: 0.1, metalness: 0, color: "#FFFFFF" },

    // Emisivos
    { name: "emissive white", opacity: 1, roughness: 0.4, metalness: 0, color: "#FFFFFF" },
    { name: "emissive red", opacity: 1, roughness: 0.4, metalness: 0, color: "#FF0000" },
    { name: "emissive green", opacity: 1, roughness: 0.4, metalness: 0, color: "#00FF00" },
    { name: "emissive blue", opacity: 1, roughness: 0.4, metalness: 0, color: "#0088FF" },

    // Especiales para interfaz / prototipado
    { name: "wireframe", opacity: 1, roughness: 0.5, metalness: 0, color: "#FFFFFF" },
    { name: "transparent", opacity: 0.25, roughness: 0.2, metalness: 0, color: "#FFFFFF" },
];


export default function ItemSettings({ selectedModel, setSelectedModel, setModels, models = [] }) {
    const { theme } = useTheme()

    const updateSelectedModel = (updatedFields) => {
        setModels(models.map((m) => m.id === selectedModel.id ? { ...m, ...updatedFields } : m))
        if (setSelectedModel) {
            setSelectedModel((prev) => prev ? { ...prev, ...updatedFields } : prev)
        }
    }

    const currentModel = models.find((m) => m.id === selectedModel.id) || selectedModel

    return (
        <>
            <Card style={{ zIndex: 9999, display: "flex", gap: 2.5, padding: "5px 10px", position: "absolute", borderRadius: 50, bottom: 15 }}>
                <Desplegable style={{ transform: "translateY(-5px)", border: "none", borderRadius: 50, padding: "5px 10px" }} icon={<IconHover icon={<GamepadIcon style={{ fontSize: 20 }} />} />}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        <KeyboardDoubleArrowLeftIcon onClick={(e) => updateSelectedModel({ position: [currentModel.position[0] - 0.1, currentModel.position[1], currentModel.position[2]] })} style={{ cursor: "pointer" }} />
                        <KeyboardDoubleArrowRightIcon onClick={(e) => updateSelectedModel({ position: [currentModel.position[0] + 0.1, currentModel.position[1], currentModel.position[2]] })} style={{ cursor: "pointer" }} />
                        <KeyboardDoubleArrowDownIcon onClick={(e) => updateSelectedModel({ position: [currentModel.position[0], currentModel.position[1] - 0.1, currentModel.position[2]] })} style={{ cursor: "pointer" }} />
                        <KeyboardDoubleArrowUpIcon onClick={(e) => updateSelectedModel({ position: [currentModel.position[0], currentModel.position[1] + 0.1, currentModel.position[2]] })} style={{ cursor: "pointer" }} />
                        <KeyboardDoubleArrowDownIcon onClick={(e) => updateSelectedModel({ position: [currentModel.position[0], currentModel.position[1], currentModel.position[2] + 0.1] })} style={{ transform: "rotate(45deg)", cursor: "pointer" }} />
                        <KeyboardDoubleArrowUpIcon onClick={(e) => updateSelectedModel({ position: [currentModel.position[0], currentModel.position[1], currentModel.position[2] - 0.1] })} style={{ transform: "rotate(45deg)", cursor: "pointer" }} />
                    </div>
                </Desplegable>

                <Desplegable style={{ transform: "translateY(-5px)", border: "none", borderRadius: 50, padding: "5px 10px" }} icon={<IconHover icon={<OpacityIcon style={{ fontSize: 20 }} />} />}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={currentModel.opacity ?? 1}
                        onChange={(e) => updateSelectedModel({ opacity: parseFloat(e.target.value) })}
                    />
                </Desplegable>
                <Desplegable style={{ transform: "translateY(-5px)", border: "none", borderRadius: 50, padding: "5px 10px" }} icon={<IconHover icon={<LineWeightIcon style={{ fontSize: 20 }} />} />}>
                    <input
                        type="range"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={currentModel.scale ?? 1}
                        onChange={(e) => updateSelectedModel({ scale: parseFloat(e.target.value) })}
                    />
                </Desplegable>
                <Desplegable style={{ transform: "translateY(-5px)", border: "none", padding: 0 }} icon={<IconHover icon={<TextureIcon style={{ fontSize: 20 }} />} />}>
                    <div className="thin-scroll" style={{ maxHeight: "500px", fontSize: "small", overflow: "auto", padding: "10px 10px", borderRadius: 10 }}>
                        {textures.map((texture) => (
                            <div style={{ padding: "5px", cursor: "pointer" }} key={texture.name}
                                onClick={() => {
                                    updateSelectedModel({ metalness: texture.metalness, roughness: texture.roughness, color: texture.color, opacity: texture.opacity })
                                    setSelectedModel(null)
                                }}>
                                {texture.name}
                    </div>
                        ))}
                </div>
            </Desplegable>
        </Card >
        </>
    )
}

