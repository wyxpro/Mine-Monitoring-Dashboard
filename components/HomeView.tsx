
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Header from './Header';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  currentTime: Date;
}

interface ModuleInfo {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
  iconType: 'blocks' | 'pump' | 'shield' | 'tower' | 'radar' | 'warning-cubes' | 'screen';
  active?: boolean;
}

const modules: ModuleInfo[] = [
  { id: 'geology', name: "地质保障系统", pos: [-35, 2, -25], color: '#10b981', iconType: 'blocks' }, 
  { id: 'drainage', name: "主排水系统", pos: [-42, 0, 10], color: '#06b6d4', iconType: 'pump' },
  { id: 'warning', name: "水文监测预警系统", pos: [-25, -2, 40], color: '#f59e0b', iconType: 'shield', active: true },
  { id: 'well', name: "专用井壁监测", pos: [0, 5, -40], color: '#3b82f6', iconType: 'tower' },
  { id: 'surface', name: "地表移动在线监测与预测系统", pos: [35, 2, -25], color: '#8b5cf6', iconType: 'radar' },
  { id: 'concealed', name: "隐蔽致灾", pos: [45, 0, 15], color: '#d946ef', iconType: 'warning-cubes' }, 
  { id: 'hazard', name: "水害预警", pos: [28, -2, 42], color: '#ef4444', iconType: 'screen' },
];

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, currentTime }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);
  const hoveredNodeRef = useRef<string | null>(null);
  const onNavigateRef = useRef(onNavigate);
  
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    if (!mountRef.current || !labelContainerRef.current) return;
    const container = mountRef.current;
    const labelContainer = labelContainerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01040a);
    scene.fog = new THREE.FogExp2(0x01040a, 0.001);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(0, 120, 240);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.06;
    controls.enablePan = false;
    controls.minDistance = 150;
    controls.maxDistance = 800;

    // --- High-Fidelity Space Background ---
    const coreGroup = new THREE.Group();
    const haloGeo = new THREE.SphereGeometry(300, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({ 
      color: 0x1e3a8a, 
      transparent: true, 
      opacity: 0.08, 
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending 
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    coreGroup.add(halo);
    scene.add(coreGroup);

    const galaxyPoints = 20000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPos = new Float32Array(galaxyPoints * 3);
    const galaxyColors = new Float32Array(galaxyPoints * 3);

    const parameters = {
      count: galaxyPoints,
      size: 0.8,
      radius: 800,
      branches: 3,
      spin: 1.2,
      randomness: 0.2,
      randomnessPower: 4,
      insideColor: '#ff8a5c',
      outsideColor: '#2b58c1'
    };

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for(let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (radius * 0.5);
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      galaxyPos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      galaxyPos[i3 + 1] = randomY - 100;
      galaxyPos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);
      
      galaxyColors[i3] = mixedColor.r;
      galaxyColors[i3 + 1] = mixedColor.g;
      galaxyColors[i3 + 2] = mixedColor.b;
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    const galaxyMaterial = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.4
    });

    const galaxy = new THREE.Points(galaxyGeo, galaxyMaterial);
    scene.add(galaxy);

    const starCount = 6000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 2000 + Math.random() * 3000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ size: 2, color: 0xffffff, transparent: true, opacity: 0.6, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    // --- Interactive 3D Monitoring Platform ---
    const platformGroup = new THREE.Group();
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(32, 6, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x051a3d, 
        metalness: 1, 
        roughness: 0.2,
        emissive: 0x001122 
      })
    );
    platformGroup.add(chassis);

    const neonCyan = new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.8 });
    const edgeOffset = 15.85;
    [-edgeOffset, edgeOffset].forEach(x => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6.1, 32.1), neonCyan);
      b.position.x = x;
      platformGroup.add(b);
    });
    [-edgeOffset, edgeOffset].forEach(z => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(32.1, 6.1, 0.3), neonCyan);
      b.position.z = z;
      platformGroup.add(b);
    });

    const reactor = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x00f2ff, emissive: 0x00f2ff, emissiveIntensity: 6 })
    );
    reactor.position.y = 3.4;
    platformGroup.add(reactor);
    scene.add(platformGroup);

    // Platform Label
    const platformLabel = document.createElement('div');
    platformLabel.className = 'absolute pointer-events-none flex flex-col items-center z-50';
    platformLabel.innerHTML = `
      <div class="px-8 py-2.5 bg-[#0a192f]/60 border-y border-cyan-400/30 backdrop-blur-3xl flex flex-col items-center shadow-[0_0_40px_rgba(0,242,255,0.15)]">
        <span class="text-white text-xl font-black tracking-[0.8em] drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] whitespace-nowrap uppercase">监测平台</span>
        <div class="mt-2 w-[140%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_cyan] animate-pulse"></div>
      </div>
    `;
    labelContainer.appendChild(platformLabel);

    const nodeGroups: THREE.Group[] = [];
    const labelElements: HTMLElement[] = [];

    modules.forEach((m) => {
      const g = new THREE.Group();
      g.position.set(...m.pos);
      
      const baseCol = new THREE.Color(m.color).lerp(new THREE.Color(0x0a192f), 0.7);
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(12, 1.5, 12),
        new THREE.MeshStandardMaterial({ color: baseCol, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.95 })
      );
      g.add(base);

      const mat = new THREE.MeshPhongMaterial({ color: m.color, emissive: m.color, emissiveIntensity: 0.9 });
      const wireMat = new THREE.MeshBasicMaterial({ color: m.color, wireframe: true, transparent: true, opacity: 0.7 });

      let icon: THREE.Object3D;
      if (m.iconType === 'shield') {
        icon = new THREE.Group();
        const o = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.3, 16, 32), mat);
        const i = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff }));
        icon.add(o, i);
      } else if (m.iconType === 'tower') {
        icon = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 2, 8, 4, 1, true), wireMat);
      } else if (m.iconType === 'blocks') {
        icon = new THREE.Group();
        for(let j=0; j<4; j++) {
          const b = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 4), mat);
          b.position.y = j * 1.5;
          icon.add(b);
        }
      } else if (m.iconType === 'radar') {
        icon = new THREE.Mesh(new THREE.OctahedronGeometry(3, 0), wireMat);
      } else if (m.iconType === 'warning-cubes') {
        icon = new THREE.Group();
        const c = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), mat);
        const o = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.15, 16, 32), mat);
        o.rotation.x = Math.PI/2;
        icon.add(c, o);
      } else if (m.iconType === 'pump') {
        icon = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, 0.5, 64, 8), mat);
      } else {
        icon = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1), wireMat);
      }
      icon.position.y = 7.5;
      g.add(icon);

      nodeGroups.push(g);
      scene.add(g);

      const el = document.createElement('div');
      el.className = 'absolute pointer-events-auto cursor-pointer flex flex-col items-center z-10';
      el.innerHTML = `
        <div class="label-box px-12 py-5 bg-[#030816]/90 border-t-4 rounded-t-sm shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col items-center min-w-[280px] transition-all duration-700 backdrop-blur-3xl" style="border-top-color: ${m.color}">
          <div class="text-white font-black text-[18px] tracking-[0.4em] whitespace-nowrap mb-2.5 uppercase drop-shadow-[0_0_10px_${m.color}]">${m.name}</div>
          <div class="w-4 h-4 rotate-45" style="background-color: ${m.color}; box-shadow: 0 0 30px ${m.color}"></div>
        </div>
        <div class="w-[2px] h-24 bg-gradient-to-t from-transparent via-${m.color}/30 to-white/80" style="background-image: linear-gradient(to top, transparent, ${m.color}66, white)"></div>
        <div class="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-white/80 -mt-2.5"></div>
      `;

      el.onclick = () => { 
        if(m.id === 'warning') onNavigateRef.current('dashboard');
        else if(m.id === 'drainage') onNavigateRef.current('water-disaster');
        else if(m.id === 'hazard') onNavigateRef.current('drainage');
      };
      el.onmouseenter = () => { hoveredNodeRef.current = m.id; setHoveredId(m.id); controls.autoRotate = false; };
      el.onmouseleave = () => { hoveredNodeRef.current = null; setHoveredId(null); controls.autoRotate = true; };

      labelContainer.appendChild(el);
      labelElements.push(el);

      const pts = [new THREE.Vector3(0,0,0), new THREE.Vector3(m.pos[0]*0.5, -8, m.pos[2]*0.5), new THREE.Vector3(m.pos[0], 0, m.pos[2])];
      const crv = new THREE.CatmullRomCurve3(pts);
      scene.add(new THREE.Mesh(new THREE.TubeGeometry(crv, 32, 0.1, 8, false), new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.1 })));
    });

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const mainLight = new THREE.PointLight(0xffffff, 200, 1000);
    mainLight.position.set(0, 150, 120);
    scene.add(mainLight);

    const updateProjection = () => {
      const v = new THREE.Vector3();
      v.set(0, 8, 0).project(camera);
      platformLabel.style.left = `${(v.x * 0.5 + 0.5) * width}px`;
      platformLabel.style.top = `${(-(v.y * 0.5) + 0.5) * height}px`;
      platformLabel.style.transform = 'translate(-50%, -100%)';
      platformLabel.style.display = v.z > 1 ? 'none' : 'flex';

      modules.forEach((m, i) => {
        v.set(...m.pos).add(new THREE.Vector3(0, 10, 0));
        v.project(camera);
        const el = labelElements[i];
        if (v.z > 1) {
          el.style.display = 'none';
        } else {
          el.style.display = 'flex';
          el.style.left = `${(v.x * 0.5 + 0.5) * width}px`;
          el.style.top = `${(-(v.y * 0.5) + 0.5) * height}px`;
          el.style.transform = 'translate(-50%, -100%) scale(0.85)';
          
          const box = el.querySelector('.label-box') as HTMLElement;
          if (hoveredNodeRef.current === m.id) {
            el.style.zIndex = '100';
            box.style.backgroundColor = `${m.color}33`;
            box.style.boxShadow = `0 0 80px ${m.color}88`;
            el.style.transform = 'translate(-50%, -100%) scale(1)';
          } else {
            el.style.zIndex = '10';
            box.style.backgroundColor = 'rgba(3, 8, 26, 0.9)';
            box.style.boxShadow = 'none';
          }
        }
      });
    };

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      updateProjection();
      const t = Date.now() * 0.001;
      
      galaxy.rotation.y = t * 0.015;
      coreGroup.rotation.y = -t * 0.005;

      nodeGroups.forEach((n, i) => {
        const ic = n.children[1];
        if (ic) {
          ic.rotation.y += 0.008;
          ic.position.y = 7.5 + Math.sin(t + i) * 0.4;
        }
      });
      platformGroup.rotation.y += 0.001;
      reactor.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      labelElements.forEach(l => l.remove());
      platformLabel.remove();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-[#01040a] flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at center, rgba(16, 42, 77, 0.15) 0%, rgba(1, 4, 10, 1) 100%)' }}></div>
      <Header currentTime={currentTime} title="XXX 矿水文地质智能监测中心" />
      <div ref={mountRef} className="flex-1 cursor-move relative z-10" />
      <div ref={labelContainerRef} className="absolute inset-0 pointer-events-none z-20 overflow-hidden" />

      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none z-0"></div>
    </div>
  );
};

export default HomeView;
