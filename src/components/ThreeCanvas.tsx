import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import backgroundVideo from '../assets/video_202606251959.mp4';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Loading Framework Metrics State
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── 1. SCENE ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#060d1f', 0.012); // Fog blends models into the dark background

    // ── 2. CAMERA ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 2.2, 9.0); // Aligned with initial scrollY = 0

    // ── 3. RENDERER ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // ── 4. CONTROLS ───────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.target.set(0, 1.3, 0); // Aligned with initial scrollY = 0
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.minDistance = 2.5;
    controls.maxDistance = 22;

    // ── 5. LIGHTS ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xb8ccff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8e8, 4.0);
    keyLight.position.set(0, 5, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x88bbff, 2.5);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    const lampLight = new THREE.PointLight(0xffcc55, 3.5, 14);
    lampLight.position.set(2, 1.5, 3);
    scene.add(lampLight);

    const lampLight2 = new THREE.PointLight(0xff9933, 2.5, 12);
    lampLight2.position.set(-2, 2.0, 2);
    scene.add(lampLight2);

    const bounceLight = new THREE.HemisphereLight(0xffdd88, 0x1a1a3a, 1.0);
    scene.add(bounceLight);

    // Static orbit lights
    const orbitLightColors = [0xffaa00, 0x3366ff, 0xff3300, 0xff8800];
    orbitLightColors.forEach((c, i) => {
      const pl = new THREE.PointLight(c, 2.0, 6);
      const angle = (i * Math.PI * 2) / orbitLightColors.length;
      pl.position.set(Math.cos(angle) * 2.6, 1.2, Math.sin(angle) * 2.6);
      scene.add(pl);
    });

    // ── 6. GROUND PLANE (SHADOW CATCHER) ──────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── 8. STARS ──────────────────────────────────────────────────────────────
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = Math.random() * 70 + 8;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.14, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── 9. ON-DEMAND RENDERING SYSTEM & SCROLL ANIMATION ────────────────────────
    let heroModel: THREE.Group | null = null;

    const render = () => {
      renderer.render(scene, camera);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const t = Math.min(scrollY / 800, 1); // Normalize scroll over 800px

      if (heroModel) {
        // Rotate the model slightly for parallax depth on scroll
        heroModel.rotation.y = t * 0.45;
      }

      // Camera starts at (0, 2.2, 9.0) and smoothly interpolates to (2.2, 3.6, 5.5)
      const startPos = new THREE.Vector3(0, 2.2, 9.0);
      const endPos = new THREE.Vector3(2.2, 3.6, 5.5);
      camera.position.lerpVectors(startPos, endPos, t);

      // Camera target shifts from the center of the scene to Arahant Mahinda
      const startTarget = new THREE.Vector3(0, 1.3, 0);
      const endTarget = new THREE.Vector3(0.3, 2.3, -0.3);
      controls.target.lerpVectors(startTarget, endTarget, t);

      controls.update();
      render();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    controls.addEventListener('change', render);

    // ── 10. DRACO LOADER & GLTF LOADING ───────────────────────────────────────
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Load Hero Model (King, Monk, and Deer)
    loader.load(
      '/Hitem3d-1781983799154.glb',
      (gltf) => {
        const model = gltf.scene;
        heroModel = model; // Save reference for scroll animation
        
        const box    = new THREE.Box3().setFromObject(model);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Scale: Make it significantly larger for "another level user experience"
        const sf = 6.4 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(sf);
        
        // Position: Lower it so that the King and deer sit perfectly on the grass floor of the video background!
        model.position.set(-center.x * sf, -2.1 - box.min.y * sf, -center.z * sf);
        
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });
        scene.add(model);
        
        // Update positions immediately on load based on current scroll
        onScroll();

        // Flag loading as fully completed to trigger smooth UI entry transition
        setIsLoaded(true);
      },
      (xhr) => {
        // Track download metrics progress hook
        if (xhr.total > 0) {
          const progress = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(progress);
        }
      },
      (err) => console.error('Hero load error:', err)
    );

    // Initial render
    render();

    // ── 11. RESIZE ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    };
    window.addEventListener('resize', onResize);

    // ── 12. CLEANUP ───────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      controls.removeEventListener('change', render);
      
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      renderer.dispose();
      controls.dispose();
      dracoLoader.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#060d1f' }}>
      
      {/* ── LOADER OVERLAY INTERFACE SECTION ───────────────────────────────── */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#060d1fc0',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            transition: 'opacity 0.6s ease-out',
            fontFamily: 'sans-serif',
            color: '#ffffff'
          }}
        >
          {/* Spiritual/Cultural Loading Accent Ring */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '3px solid rgba(245, 158, 11, 0.1)',
                borderTop: '3px solid #f59e0b',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px' }}>
              🪷
            </span>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f3f4f6', margin: '0 0 8px 0' }}>
            Initializing Engine
          </h2>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 20px 0', fontFamily: 'monospace' }}>
            Assembling 3D Heritage Matrix Layer...
          </p>

          {/* Graphical Progress Fill Tube */}
          <div style={{ width: '200px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #eab308)',
                boxShadow: '0 0 12px #f59e0b',
                transition: 'width 0.2s ease-out'
              }}
            />
          </div>
          
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#eab308', marginTop: '8px', fontWeight: 'bold' }}>
            {loadingProgress}%
          </span>
        </div>
      )}

      {/* CSS Spin Animation Style Node Vector Rule */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* HTML Background Video playing behind the transparent 3D scene */}
      <video
        ref={videoRef}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      
      {/* Transparent WebGL Canvas sitting on top of the video */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'block',
          zIndex: 1,
          pointerEvents: 'auto',
        }}
      />
    </div>
  );
}