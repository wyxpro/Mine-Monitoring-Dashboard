
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

interface SensorData {
  id: string;
  name: string;
  value: string;
  type: 'pressure' | 'flow' | 'temp';
  pos: [number, number, number];
  color: string;
}

interface MineSchematicProps {
  showLabels?: boolean;
  onSelectSensor?: (sensor: SensorData) => void;
}

const sensors: SensorData[] = [
  { id: 's1', name: "探放水孔装置1", value: "-35", type: 'pressure', pos: [-6, 2, 2], color: "#eab308" },
  { id: 's2', name: "探放水孔装置2", value: "-37", type: 'flow', pos: [-4, 2, -1], color: "#22d3ee" },
  { id: 's3', name: "探放水孔装置3", value: "-2", type: 'flow', pos: [0, 4, -2], color: "#22d3ee" },
  { id: 's4', name: "探放水孔装置4", value: "-40", type: 'temp', pos: [3, 3, -1], color: "#eab308" },
  { id: 's5', name: "探放水孔装置5", value: "-21", type: 'pressure', pos: [4, 1, 3], color: "#ffffff" },
  { id: 's6', name: "探放水孔装置6", value: "-13", type: 'pressure', pos: [0, -1, 8], color: "#ffffff" },
  { id: 's7', name: "探放水孔装置7", value: "-10", type: 'flow', pos: [-2, -1, 5], color: "#ffffff" },
  { id: 's8', name: "探放水孔装置8", value: "-23", type: 'temp', pos: [6, 6, -3], color: "#eab308" },
];  

const MineSchematic: React.FC<MineSchematicProps> = ({ showLabels = true, onSelectSensor }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const showLabelsRef = useRef<boolean>(showLabels);

  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Hard cleanup to remove any stale overlay children from previous hot reloads
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030816);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(15, 12, 20);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Grid Floor
    const grid = new THREE.GridHelper(50, 50, 0x1e293b, 0x0f172a);
    grid.position.y = -5;
    scene.add(grid);

    // Ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Tunnel Generation (Wireframe Architectural Style)
    const createTunnelSegment = (start: [number, number, number], end: [number, number, number]) => {
      const vStart = new THREE.Vector3(...start);
      const vEnd = new THREE.Vector3(...end);
      const direction = new THREE.Vector3().subVectors(vEnd, vStart);
      const length = direction.length();
      
      const geometry = new THREE.BoxGeometry(0.8, 0.8, length);
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 }));
      
      const pivot = new THREE.Object3D();
      pivot.position.copy(vStart);
      pivot.lookAt(vEnd);
      line.position.z = length / 2;
      pivot.add(line);
      scene.add(pivot);

      // Add "Floor" of tunnel for solid feel
      const floorGeo = new THREE.PlaneGeometry(0.7, length);
      const floorMat = new THREE.MeshBasicMaterial({ color: 0x0a192f, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = Math.PI / 2;
      floor.position.z = length / 2;
      pivot.add(floor);
    };

    // Construct a network
    const network = [
      [[-10, 2, 0], [10, 2, 0]],
      [[-5, 2, -5], [-5, 2, 10]],
      [[5, 2, -5], [5, 2, 10]],
      [[-10, -1, 5], [10, -1, 5]],
      [[-2, -1, 0], [-2, -1, 15]],
      [[0, 4, -5], [0, 4, 5]],
      [[6, 6, -10], [6, 6, 5]],
      [[-6, 2, 2], [-6, 5, 2]],
    ];
    network.forEach(([s, e]) => createTunnelSegment(s as any, e as any));

    // Sensor Nodes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactiveObjects: THREE.Object3D[] = [];

    const sensorObjectMap: Record<string, THREE.Object3D> = {};
    const labelObjects: Record<string, CSS2DObject> = {};
    sensors.forEach((s) => {
      const group = new THREE.Group();
      group.position.set(...s.pos);
      
      // Node marker
      const geo = new THREE.SphereGeometry(0.2, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: s.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { id: s.id };
      group.add(mesh);
      interactiveObjects.push(mesh);
      sensorObjectMap[s.id] = mesh;

      // Pulsing ring
      const ringGeo = new THREE.RingGeometry(0.3, 0.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.name = "pulse";
      group.add(ring);

      scene.add(group);
    });

    // Create CSS2D labels anchored to sensors (auto-follow camera)
    sensors.forEach((s) => {
      const div = document.createElement('div');
      div.className = 'pointer-events-none';
      div.innerHTML = `
        <div class="absolute w-[1px] h-4 bg-white/30 bottom-0 left-1/2 -translate-x-1/2"></div>
        <div class="label-item pointer-events-auto cursor-pointer absolute bottom-[1rem] left-1/2 -translate-x-1/2 min-w-[160px] p-2 bg-black/60 border border-white/20 backdrop-blur-md rounded-sm">
          <div class="text-[10px] text-white/80 font-medium whitespace-nowrap mb-0.5">${s.name}</div>
          <div class="flex items-center justify-between">
            <div class="text-xs font-bold text-white tracking-tight">数据: <span class="font-mono text-cyan-400">${s.value}</span></div>
            <div class="w-1.5 h-1.5 rounded-full" style="background-color:${s.color}"></div>
          </div>
          <div class="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-white/40"></div>
          <div class="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-white/40"></div>
        </div>
      `;
      const labelObj = new CSS2DObject(div);
      labelObj.position.set(0, 0.9, 0);
      const anchor = sensorObjectMap[s.id];
      anchor.add(labelObj);
      labelObjects[s.id] = labelObj;
      (div.querySelector('.label-item') as HTMLElement).onclick = () => { 
        setSelectedId(s.id);
        onSelectSensor?.(s);
      };
      labelObj.visible = showLabelsRef.current;
    });

    // Interaction handlers
    const onMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);
      if (intersects.length > 0) {
        const id = intersects[0].object.userData.id;
        setSelectedId(id);
        const sensor = sensors.find(s => s.id === id);
        if (sensor) onSelectSensor?.(sensor);
      } else {
        setSelectedId(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Animation loop
    let frame = 0;
    const animate = () => {
      frame += 0.05;
      controls.update();

      // Pulse animation
      scene.traverse((obj) => {
        if (obj.name === "pulse") {
          obj.scale.setScalar(1 + Math.sin(frame) * 0.2);
          (obj as any).material.opacity = 0.4 + Math.sin(frame) * 0.2;
          obj.lookAt(camera.position);
        }
      });

      // Hover check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);
      if (intersects.length > 0) {
        setHoveredId(intersects[0].object.userData.id);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredId(null);
        document.body.style.cursor = 'default';
      }

      // Toggle label visibility only (position handled by CSS2D)
      sensors.forEach((s) => {
        const obj = labelObjects[s.id];
        if (obj) {
          obj.visible = showLabelsRef.current;
        }
      });

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);
    };
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden bg-[#030816]">
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Floating Labels are rendered by CSS2DRenderer and appended to mountRef */}

      {/* HUD Elements */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 pointer-events-none opacity-60">
        <div className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Spatial Tracking Active</div>
        <div className="w-32 h-[1px] bg-gradient-to-l from-cyan-500 to-transparent"></div>
        <div className="text-[9px] text-slate-500">ZOOM: SCROLL | ROTATE: L-DRAG | PAN: R-DRAG</div>
      </div>

      {/* Sensor Legend */}
      <div className="absolute bottom-6 left-6 p-4 border border-white/5 bg-black/40 backdrop-blur-md rounded flex gap-6 z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-[11px] text-slate-300">预警装置</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span className="text-[11px] text-slate-300">在线装置</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <span className="text-[11px] text-slate-300">离线装置</span>
        </div>
      </div>
    </div>
  );
};

export default MineSchematic;
