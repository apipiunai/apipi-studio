import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

import { useTheme } from "../../providers/ThemeProvider";

function renderPrimitiveGeometry(type) {


    switch (type) {
        case "cubo":
            return <boxGeometry args={[1, 1, 1]} />;
        case "esfera":
            return <sphereGeometry args={[0.7, 32, 32]} />;
        case "cilindro":
            return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
        case "cono":
            return <coneGeometry args={[0.6, 1.2, 32]} />;
        case "plano":
            return <planeGeometry args={[1.5, 1.5]} />;
        case "círculo":
            return <circleGeometry args={[0.8, 32]} />;
        case "anillo":
            return <ringGeometry args={[0.4, 0.8, 32]} />;
        case "toro":
            return <torusGeometry args={[0.6, 0.2, 16, 100]} />;
        case "cápsula":
            return <capsuleGeometry args={[0.4, 0.8, 16, 32]} />;
        case "tetraedro":
            return <tetrahedronGeometry args={[0.8]} />;
        case "octaedro":
            return <octahedronGeometry args={[0.8]} />;
        case "dodecaedro":
            return <dodecahedronGeometry args={[0.8]} />;
        case "icosaedro":
            return <icosahedronGeometry args={[0.8]} />;
        default:
            return <boxGeometry args={[1, 1, 1]} />;
    }
}

function Model({ model, setSelectedModel, selectedModel }) {

    const { theme } = useTheme();

    const isSelected = selectedModel?.id === model.id;

    // Si el modelo proviene de un archivo GLB / GLTF importado
    if (model.gltfScene) {
        return (
            <primitive
                object={model.gltfScene}
                position={model.position ?? [0, 0, 0]}
                rotation={model.rotation ?? [0, 0, 0]}
                scale={Array.isArray(model.scale) ? model.scale : [model.scale ?? 1, model.scale ?? 1, model.scale ?? 1]}
                onClick={(e) => {
                    e.stopPropagation();
                    selectedModel?.id === model.id ? setSelectedModel(null) : setSelectedModel(model);
                }}
            />
        );
    }

    return (
        <mesh
            position={model.position ?? [0, 0, 0]}
            rotation={model.rotation ?? [0, 0, 0]}
            scale={Array.isArray(model.scale) ? model.scale : [model.scale ?? 1, model.scale ?? 1, model.scale ?? 1]}
            onClick={(e) => {
                e.stopPropagation();
                selectedModel?.id === model.id ? setSelectedModel(null) : setSelectedModel(model);
            }}
        >
            {renderPrimitiveGeometry(model.type)}
            <meshStandardMaterial
                color={isSelected ? "yellow" : model.color ?? "gray"}
                roughness={isSelected ? 0.2 : model.roughness}
                metalness={isSelected ? 0.4 : model.metalness}
                transparent
                opacity={model.opacity}
            />
        </mesh>
    );
}

export default function Scene3D({ models = [], selectedModel, setSelectedModel, showAxis, showGrid }) {
    return (
        <Canvas style={{ position: "fixed", width: "100vw", height: "100vh", top: 0, left: 0 }} camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.4} />

            <directionalLight
                position={[5, 10, 5]}
                intensity={2}
                castShadow
            />

            <directionalLight
                position={[-5, 5, -5]}
                intensity={0.8}
            />

            <directionalLight
                position={[0, 3, -8]}
                intensity={0.5}
            />

            {/* Suelo */}
            <gridHelper
                opacity={0.1}
                args={[20, 20, "#222", "#222"]}
                position={[0, 0, 0]}
                material-transparent
                visible={showGrid}
            />
            {/* Ejes X/Y/Z */}
            <axesHelper args={[10]} visible={showAxis} />

            {models.map((model) => (
                <Model
                    key={model.id}
                    model={model}
                    setSelectedModel={setSelectedModel}
                    selectedModel={selectedModel}
                />
            ))}

            <OrbitControls />
        </Canvas>
    );
}