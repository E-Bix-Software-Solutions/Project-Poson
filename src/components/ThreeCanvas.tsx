import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── 1. SCENE ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#060d1f');
    scene.fog = new THREE.FogExp2('#060d1f', 0.016);

    // ── 2. CAMERA ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 3.0, 9.0);

    // ── 3. RENDERER ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Optimized pixel ratio
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // ── 4. CONTROLS ───────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    // Disable damping so we don't need a continuous frame loop for controls updating
    controls.enableDamping = false;
    controls.target.set(0, 1.8, 0);
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.minDistance = 2.5;
    controls.maxDistance = 22;

    // ── 5. LIGHTS ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xb8ccff, 1.6);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xddeeff, 4.5);
    moonLight.position.set(-5, 14, -6);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width  = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near   = 0.5;
    moonLight.shadow.camera.far    = 100;
    moonLight.shadow.camera.left   = -18;
    moonLight.shadow.camera.right  =  18;
    moonLight.shadow.camera.top    =  18;
    moonLight.shadow.camera.bottom = -18;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    const keyLight = new THREE.DirectionalLight(0xfff8e8, 4.0);
    keyLight.position.set(0, 5, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x88bbff, 2.5);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    // Warm lamps - now static
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

    // ── 6. GROUND PLANE ───────────────────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#060d1f', roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── 7. FULL MOON ──────────────────────────────────────────────────────────
    const MOON_POS = new THREE.Vector3(-5, 9, -16);

    const halo2Geo = new THREE.SphereGeometry(2.8, 32, 32);
    const halo2Mat = new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.05 });
    const halo2 = new THREE.Mesh(halo2Geo, halo2Mat);
    halo2.position.copy(MOON_POS);
    scene.add(halo2);

    const moonGlowGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const moonGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: 0.18 });
    const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
    moonGlow.position.copy(MOON_POS);
    scene.add(moonGlow);

    const moonGeo = new THREE.SphereGeometry(1.2, 48, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xfffee4, emissive: 0xfff8c0, emissiveIntensity: 1.2, roughness: 0.8,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.copy(MOON_POS);
    scene.add(moon);

    const moonPointLight = new THREE.PointLight(0xfff5cc, 3.0, 70);
    moonPointLight.position.copy(MOON_POS);
    scene.add(moonPointLight);

    // ── 8. STARS ──────────────────────────────────────────────────────────────
    const starCount = 600; // Further optimized star count
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

    // ── 9. ON-DEMAND RENDERING SYSTEM ──────────────────────────────────────────
    // Renders the scene only when needed, avoiding constant CPU/GPU execution
    const render = () => {
      renderer.render(scene, camera);
    };

    // Trigger render when controls change (zoom, pan, rotate)
    controls.addEventListener('change', render);

    // ── 10. DRACO LOADER & GLTF LOADING ───────────────────────────────────────
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Load Hero Model (Aggressively compressed)
    loader.load(
      '/Hitem3d-opt.glb',
      (gltf) => {
        const model = gltf.scene;
        const box    = new THREE.Box3().setFromObject(model);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const sf     = 4.5 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(sf);
        model.position.set(-center.x * sf, -box.min.y * sf, -center.z * sf);
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });
        scene.add(model);
        
        const nb = new THREE.Box3().setFromObject(model);
        const nc = nb.getCenter(new THREE.Vector3());
        controls.target.set(nc.x, nc.y, nc.z);
        controls.update();
        render(); // Render once model is loaded
      },
      undefined,
      (err) => console.error('Hero load error:', err)
    );

    // Load Vesak Lanterns (Aggressively compressed)
    loader.load(
      '/vesak-lanterns-opt.glb',
      (gltf) => {
        const l     = gltf.scene;
        const box   = new THREE.Box3().setFromObject(l);
        const size  = box.getSize(new THREE.Vector3());
        const ctr   = box.getCenter(new THREE.Vector3());
        const scale = 1.8 / Math.max(size.x, size.y, size.z);
        l.scale.setScalar(scale);
        l.position.set(-ctr.x * scale, 7.5 + (-box.min.y * scale), -ctr.z * scale - 3.0);
        
        l.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) { 
            const mesh = o as THREE.Mesh;
            mesh.castShadow = false; 
            mesh.receiveShadow = false; 
            if (mesh.material && 'emissive' in mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.emissive = new THREE.Color(0xffaa44);
              mat.emissiveIntensity = 1.5;
            }
          }
        });
        scene.add(l);

        // Collective glow PointLight
        const lanternGlow = new THREE.PointLight(0xffaa44, 3.5, 10);
        lanternGlow.position.set(l.position.x, l.position.y + 0.2, l.position.z);
        scene.add(lanternGlow);
        
        render(); // Render once lanterns are loaded
      },
      undefined,
      (err) => console.error('Vesak lanterns load error:', err)
    );

    // Load Mango Tree Forest (Aggressively compressed)
    const forestLayout: [number, number, number, number][] = [
      [ -8,  -9,  0.30, 1.00],
      [ -4, -11,  0.10, 1.10],
      [  0, -12,  0.00, 1.15],
      [  4, -11, -0.10, 1.05],
      [  8,  -9, -0.30, 0.95],
      [-11, -15,  0.20, 1.25],
      [ -4, -16,  0.00, 1.20],
      [  4, -16,  0.00, 1.20],
      [ 11, -15, -0.20, 1.30],
      [-13,  -5,  0.80, 1.00],
      [ 13,  -5, -0.80, 0.95],
      [-10,   0,  0.60, 0.78],
      [ 10,   0, -0.60, 0.75],
    ];

    loader.load(
      '/mango-tree-opt.glb',
      (gltf) => {
        forestLayout.forEach(([x, z, rotY, sc]) => {
          const tree = gltf.scene.clone(true);
          const box  = new THREE.Box3().setFromObject(tree);
          const size = box.getSize(new THREE.Vector3());
          const base = (5.5 / Math.max(size.x, size.y, size.z)) * sc;
          tree.scale.setScalar(base);
          const rb = new THREE.Box3().setFromObject(tree);
          tree.position.set(x, -rb.min.y, z);
          tree.rotation.y = rotY;
          tree.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) { o.castShadow = false; o.receiveShadow = false; }
          });
          scene.add(tree);
        });
        
        render(); // Render once trees are loaded
      },
      undefined,
      (err) => console.error('Mango tree load error:', err)
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
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
}