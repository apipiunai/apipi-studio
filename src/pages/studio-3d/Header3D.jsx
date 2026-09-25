import { useAuth } from "../../providers/AuthProvider"
import { useTheme } from "../../providers/ThemeProvider"
import { useIdioma } from "../../providers/IdiomaProvider"
import { useWindowSize } from "../../providers/WindowSizeProvider"

import Card from "../../components/Card"
import IconHover from '../../components/IconHover';
import Desplegable from "../../components/Desplegable";

import CategoryIcon from '@mui/icons-material/Category';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LayersIcon from '@mui/icons-material/Layers';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { exportSceneToGLTF } from "./exportScene";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRef } from "react";

const primitives = [
    { name: "cubo", icon: null },
    { name: "esfera", icon: null },
    { name: "cilindro", icon: null },
    { name: "cono", icon: null },
    { name: "plano", icon: null },
    { name: "círculo", icon: null },
    { name: "anillo", icon: null },
    { name: "toro", icon: null },
    { name: "cápsula", icon: null },
    { name: "tetraedro", icon: null },
    { name: "octaedro", icon: null },
    { name: "dodecaedro", icon: null },
    { name: "icosaedro", icon: null }
];


export default function Header3D({showAxis, setShowAxis, showGrid, setShowGrid, showItems, setShowItems, selectedModel, setSelectedModel, setModels, models = []}) {
    const { theme } = useTheme()
    const { t } = useIdioma()
    const { width } = useWindowSize()
    const fileInputRef = useRef(null)

    const handleImportGLTF = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const contents = e.target.result;
            const loader = new GLTFLoader();

            loader.parse(
                contents,
                "",
                (gltf) => {
                    const scene = gltf.scene || gltf.scenes?.[0];
                    const fileName = file.name.replace(/\.[^/.]+$/, "");
                    const newModel = {
                        id: models.length ? Math.max(...models.map(m => m.id)) + 1 : 1,
                        type: fileName || "modelo",
                        gltfScene: scene,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                        opacity: 1,
                        roughness: 0.4,
                        metalness: 0.2
                    };

                    setModels((prev) => [...prev, newModel]);
                    setSelectedModel(newModel);
                },
                (error) => {
                    console.error("Error al cargar el archivo GLB/GLTF:", error);
                }
            );
        };

        reader.readAsArrayBuffer(file);
        event.target.value = "";
    };

    return (
        <>
            <input 
                ref={fileInputRef} 
                type="file" 
                accept=".glb,.gltf" 
                style={{ display: "none" }} 
                onChange={handleImportGLTF} 
            />
            <div style={{ zIndex: 9999, display: "flex", gap: 5, padding: "5px 15px", position: "absolute",  top: width > 450 ? 15 : 55 }}>

            <Card style={{ zIndex: 9999, display: "flex", gap: 0, padding: "5px 10px", borderRadius: 50,}}>
                <IconHover icon={<Grid3x3Icon style={{ fontSize: 20, color: showGrid ? theme.main : "" }} />} onClick={() => setShowGrid(!showGrid)} />
                <IconHover icon={<ShuffleIcon style={{ fontSize: 20, color: showAxis ? theme.main : "" }} />} onClick={() => setShowAxis(!showAxis)} />
            </Card>

            <Card style={{ zIndex: 9999, display: "flex", gap: 2.5, padding: "5px 10px", borderRadius: 50,}}>

                <IconHover icon={<FileUploadIcon style={{ fontSize: 20 }} />} onClick={() => fileInputRef.current?.click()} />

                {models.length > 0 && <Desplegable style={{ border: "none", transform: "translateY(5px)", padding: 10, fontSize: 12 }} icon={<IconHover icon={<DownloadIcon style={{ fontSize: 20 }} />} />}>
                    <div
                        onClick={() => exportSceneToGLTF(models, { binary: true, filename: 'escena-3d.glb' })}
                        style={{ display: "flex", alignItems: "center",cursor: "pointer", fontWeight: 500, fontSize: "small" }}
                    >
                        GLB
                    </div>
                    <div
                        onClick={() => exportSceneToGLTF(models, { binary: false, filename: 'escena-3d.gltf' })}
                        style={{ display: "flex", alignItems: "center", cursor: "pointer", marginTop: 5 }}
                    >
                        GLTF
                    </div>
                </Desplegable>}

                <Desplegable style={{border: "none", transform: "translateY(5px)", padding: "15px 10px", fontWeight: 500, fontSize: "small", display: "flex", flexDirection: "column",gap: 10}} icon={<IconHover icon={<CategoryIcon style={{ fontSize: 20 }} />} />}>
                    {primitives.map((primitive, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                const newModel = {
                                    id: models.length ? models[models.length-1].id + 1 : 1,
                                    type: primitive.name,
                                    position: [0, 0, 0],
                                    rotation: [0, 0, 0],
                                    scale: [1, 1, 1],
                                    opacity: 1,
                                    roughness: 0.4,
                                    metalness: 0.2
                                };
                                setModels((prev) => [...prev, newModel]);
                                setSelectedModel(newModel);
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            {/* <IconHover icon={primitive.icon} /> */}
                            {primitive.name}
                        </div>
                    ))}
                </Desplegable>

               {selectedModel ? <IconHover onClick={() => {
                const newModel = {
                    id: models.length ? Math.max(...models.map(m => m.id)) + 1 : 1,
                    type: selectedModel.type,
                    gltfScene: selectedModel.gltfScene ? selectedModel.gltfScene.clone(true) : undefined,
                    position: [selectedModel.position[0] + 0.2, selectedModel.position[1], selectedModel.position[2]],
                    rotation: selectedModel.rotation,
                    scale: selectedModel.scale,
                    opacity: selectedModel.opacity,
                    roughness: selectedModel.roughness,
                    metalness: selectedModel.metalness
                };
                setModels((prev) => [...prev, newModel]);
                setSelectedModel(newModel);
               }} icon={<ContentCopyIcon style={{ fontSize: 20 }} />} /> : null}

                {models.length > 0 && <IconHover icon={<LayersIcon style={{ fontSize: 20, color: showItems ? theme.main : "" }} />} onClick={() => setShowItems(!showItems)} />}
            </Card>
        </div>
        </>
    )
}