import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export function createPrimitiveGeometry(type) {
    switch (type) {
        case "cubo":
            return new THREE.BoxGeometry(1, 1, 1);
        case "esfera":
            return new THREE.SphereGeometry(0.7, 32, 32);
        case "cilindro":
            return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        case "cono":
            return new THREE.ConeGeometry(0.6, 1.2, 32);
        case "plano":
            return new THREE.PlaneGeometry(1.5, 1.5);
        case "círculo":
            return new THREE.CircleGeometry(0.8, 32);
        case "anillo":
            return new THREE.RingGeometry(0.4, 0.8, 32);
        case "toro":
            return new THREE.TorusGeometry(0.6, 0.2, 16, 100);
        case "cápsula":
            return new THREE.CapsuleGeometry(0.4, 0.8, 16, 32);
        case "tetraedro":
            return new THREE.TetrahedronGeometry(0.8);
        case "octaedro":
            return new THREE.OctahedronGeometry(0.8);
        case "dodecaedro":
            return new THREE.DodecahedronGeometry(0.8);
        case "icosaedro":
            return new THREE.IcosahedronGeometry(0.8);
        default:
            return new THREE.BoxGeometry(1, 1, 1);
    }
}

export function exportSceneToGLTF(models = [], options = { binary: true, filename: 'escena-3d.glb' }) {
    if (!models || models.length === 0) return;

    const exportScene = new THREE.Scene();

    models.forEach((m) => {
        let objectToExport;

        if (m.gltfScene) {
            objectToExport = m.gltfScene.clone(true);
        } else {
            const geometry = createPrimitiveGeometry(m.type);
            const material = new THREE.MeshStandardMaterial({
                color: m.color || 0x808080, // Mantener color del modelo neutro o configurado
                roughness: typeof m.roughness === 'number' ? m.roughness : 0.4,
                metalness: typeof m.metalness === 'number' ? m.metalness : 0.2,
                transparent: true,
                opacity: typeof m.opacity === 'number' ? m.opacity : 1,
            });
            objectToExport = new THREE.Mesh(geometry, material);
        }

        objectToExport.name = `${m.type}_${m.id}`;

        if (m.position) {
            objectToExport.position.set(m.position[0] || 0, m.position[1] || 0, m.position[2] || 0);
        }
        if (m.rotation) {
            objectToExport.rotation.set(m.rotation[0] || 0, m.rotation[1] || 0, m.rotation[2] || 0);
        }
        if (m.scale !== undefined) {
            if (Array.isArray(m.scale)) {
                objectToExport.scale.set(m.scale[0] || 1, m.scale[1] || 1, m.scale[2] || 1);
            } else {
                const s = Number(m.scale) || 1;
                objectToExport.scale.set(s, s, s);
            }
        }

        exportScene.add(objectToExport);
    });

    const exporter = new GLTFExporter();
    exporter.parse(
        exportScene,
        (result) => {
            let blob;
            let extension = options.binary ? 'glb' : 'gltf';
            let fileName = options.filename || `escena-3d.${extension}`;

            if (result instanceof ArrayBuffer) {
                blob = new Blob([result], { type: 'application/octet-stream' });
            } else {
                const output = JSON.stringify(result, null, 2);
                blob = new Blob([output], { type: 'application/json' });
            }

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        },
        (error) => {
            console.error('Error al exportar la escena GLTF/GLB:', error);
        },
        { binary: options.binary !== false }
    );
}
