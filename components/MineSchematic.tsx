
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface SensorData {
  id: string;
  name: string;
  value: string;
  type: 'pressure' | 'flow' | 'temp';
  pos: [number, number, number];
  color: string;
}

const sensors: SensorData[] = [
  { id: 's1', name: "2111水文监测孔 (水压)", value: "-35", type: 'pressure', pos: [-6, 2, 2], color: "#eab308" },
  { id: 's2', name: "403主运反倔管道流量计A管", value: "-37", type: 'flow', pos: [-4, 2, -1], color: "#22d3ee" },
  { id: 's3', name: "水仓管道流量A管", value: "-2", type: 'flow', pos: [0, 4, -2], color: "#22d3ee" },
  { id: 's4', name: "2-2水仓矿化度", value: "-40", type: 'temp', pos: [3, 3, -1], color: "#eab308" },
  { id: 's5', name: "四盘区泄水巷水文监测孔 (水压)", value: "-21", type: 'pressure', pos: [4, 1, 3], color: "#ffffff" },
  { id: 's6', name: "中央风井底水文监测孔1# (水压)", value: "-13", type: 'pressure', pos: [0, -1, 8], color: "#ffffff" },
  { id: 's7', name: "西翼斜巷管道流量B管", value: "-10", type: 'flow', pos: [-2, -1, 5], color: "#ffffff" },
  { id: 's8', name: "21404采空区温度", value: "-23", type: 'temp', pos: [6, 6, -3], color: "#eab308" },
];

const MineSchematic: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [projectedLabels, setProjectedLabels] = useState<any[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

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

      // Pulsing ring
      const ringGeo = new THREE.RingGeometry(0.3, 0.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.name = "pulse";
      group.add(ring);

      scene.add(group);
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
        setSelectedId(intersects[0].object.userData.id);
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

      // Project labels to 2D
      const labels = sensors.map((s) => {
        const v = new THREE.Vector3(...s.pos);
        v.project(camera);
        return {
          id: s.id,
          name: s.name,
          value: s.value,
          x: (v.x * 0.5 + 0.5) * width,
          y: (-(v.y * 0.5) + 0.5) * height,
          visible: v.z < 1,
          color: s.color
        };
      });
      setProjectedLabels(labels);

      renderer.render(scene, camera);
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
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden bg-[#030816]">
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Floating Labels Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedLabels.map((l) => (
          l.visible && (
            <div
              key={l.id}
              className={`absolute transition-all duration-300 ${
                hoveredId === l.id || selectedId === l.id ? 'z-50 scale-105' : 'z-10'
              }`}
              style={{
                left: l.x,
                top: l.y,
              }}
            >
              {/* Leader Line */}
              <div className="absolute bottom-0 left-0 w-[1px] h-12 bg-white/20 origin-bottom rotate-[-30deg]"></div>
              
              {/* Label Content */}
              <div
                className={`label-item pointer-events-auto cursor-pointer absolute bottom-12 left-4 min-w-[160px] p-2 bg-black/60 border border-white/20 backdrop-blur-md rounded-sm transition-colors ${
                  hoveredId === l.id || selectedId === l.id ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : ''
                }`}
                onClick={() => setSelectedId(l.id)}
              >
                <div className="text-[10px] text-white/80 font-medium whitespace-nowrap mb-0.5">
                  {l.name}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white tracking-tight">
                    数据: <span className="font-mono text-cyan-400">{l.value}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }}></div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-white/40"></div>
                <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-white/40"></div>
              </div>
            </div>
          )
        ))}
      </div>

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
          <span className="text-[11px] text-slate-300">水压/水文</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span className="text-[11px] text-slate-300">流量/管道</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <span className="text-[11px] text-slate-300">综合测孔</span>
        </div>
      </div>
    </div>
  );
};

export default MineSchematic;
