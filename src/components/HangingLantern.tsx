import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export default function HangingLantern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── 1. SCENE & CAMERA ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    
    // We use a tight frustum camera to focus on the lantern
    const camera = new THREE.PerspectiveCamera(40, 120 / 220, 0.1, 100);
    camera.position.set(0, 0.05, 2.8);

    // ── 2. RENDERER ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "low-power" // Keep it extremely light
    });
    renderer.setSize(120, 220);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;

    // ── 3. LIGHTS ─────────────────────────────────────────────────────────────
    // Warm ambient light to illuminate the paper texture
    const ambientLight = new THREE.AmbientLight(0xfff3d6, 1.6);
    scene.add(ambientLight);

    // A directional light from the top-front to highlight the structure
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(1, 2, 2);
    scene.add(dirLight);

    // A glowing point light inside the lantern to give a beautiful, warm glow
    const glowLight = new THREE.PointLight(0xffaa44, 4.5, 10);
    glowLight.position.set(0, 0, 0);
    scene.add(glowLight);

    // ── 4. LOADING THE LANTERN ────────────────────────────────────────────────
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let lanternGroup: THREE.Group | null = null;

    loader.load(
      '/vesak-lanterns-opt.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Center and scale the model perfectly within our small viewport
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const scale = 1.3 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        
        // Pivot point at the top of the lantern so it swings naturally like a pendulum!
        const topOffset = box.max.y * scale;
        model.position.set(-center.x * scale, 0.45 - topOffset, -center.z * scale);

        // We wrap it in a parent group so we can swing it from the top pivot (0, 0.45, 0)
        lanternGroup = new THREE.Group();
        lanternGroup.position.set(0, 0.45, 0);
        lanternGroup.add(model);
        scene.add(lanternGroup);

        // Apply beautiful emissive materials to make it glow
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            const mesh = o as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            if (mesh.material && 'emissive' in mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.emissive = new THREE.Color(0xff7722);
              mat.emissiveIntensity = 2.2;
              mat.roughness = 0.3;
            }
          }
        });
      },
      undefined,
      (err) => console.error('Hanging lantern load error:', err)
    );

    // ── 5. ANIMATION LOOP (SWINGING IN THE WIND) ──────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();

      if (lanternGroup) {
        // Gentle double-pendulum swing simulation
        // Swing left-right (Z-axis) and a bit front-back (X-axis)
        lanternGroup.rotation.z = Math.sin(time * 1.8) * 0.12 + Math.sin(time * 3.1) * 0.03;
        lanternGroup.rotation.x = Math.cos(time * 1.4) * 0.06 + Math.sin(time * 2.5) * 0.02;
        // Subtle twisting rotation (Y-axis)
        lanternGroup.rotation.y = Math.sin(time * 0.8) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── 6. CLEANUP ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      dracoLoader.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '64px', // Hanging right below the navbar
        left: '24px', 
        width: '120px', 
        height: '220px', 
        zIndex: 10, 
        pointerEvents: 'none',
        // Filter drop shadow to make the lantern stand out and glow!
        filter: 'drop-shadow(0 0 16px rgba(255, 119, 34, 0.45))'
      }}
    >
      {/* Visual hanging string */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1.5px',
          height: '42px',
          background: 'linear-gradient(180deg, rgba(201, 146, 58, 0.8) 0%, rgba(255, 119, 34, 0.4) 100%)',
          boxShadow: '0 0 4px rgba(255, 119, 34, 0.2)'
        }}
      />
      
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block' 
        }} 
      />
    </div>
  );
}
