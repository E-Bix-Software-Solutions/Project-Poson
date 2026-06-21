import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── 1. SCENE ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#060d1f');
    scene.fog = new THREE.FogExp2('#060d1f', 0.025); // lighter fog so model stays visible

    // ── 2. CAMERA ─────────────────────────────────────────────────────────────
    // Pulled back more + raised slightly to frame full model
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 2.0, 5.5);

    // ── 3. RENDERER ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;

    // ── 4. CONTROLS ───────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.2, 0); // aim at model center
    controls.maxPolarAngle = Math.PI * 0.75;
    controls.minDistance = 2.0;
    controls.maxDistance = 18;

    // ── 5. LIGHTS — MAXED ─────────────────────────────────────────────────────

    // Strong ambient — no dark patches anywhere
    const ambientLight = new THREE.AmbientLight(0xc8d8ff, 3.0);
    scene.add(ambientLight);

    // Primary moonlight from top-left
    const moonLight = new THREE.DirectionalLight(0xddeeff, 6.0);
    moonLight.position.set(-5, 12, -5);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 80;
    moonLight.shadow.camera.left = -12;
    moonLight.shadow.camera.right = 12;
    moonLight.shadow.camera.top = 12;
    moonLight.shadow.camera.bottom = -12;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    // Front key — face-on, very bright, warm white
    const keyLight = new THREE.DirectionalLight(0xfff8e8, 6.5);
    keyLight.position.set(0, 5, 8);
    scene.add(keyLight);

    // Top-down fill so top of model is always lit
    const topLight = new THREE.DirectionalLight(0xffffff, 4.0);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    // Rim / back light — blue-white halo around model
    const rimLight = new THREE.DirectionalLight(0x88bbff, 4.5);
    rimLight.position.set(0, 4, -8);
    scene.add(rimLight);

    // Left fill
    const leftLight = new THREE.DirectionalLight(0xffcc88, 3.5);
    leftLight.position.set(-6, 3, 3);
    scene.add(leftLight);

    // Right fill (saffron)
    const rightLight = new THREE.DirectionalLight(0xff8c2a, 3.0);
    rightLight.position.set(6, 3, 3);
    scene.add(rightLight);

    // Warm lamp — flickering
    const lampLight = new THREE.PointLight(0xffcc55, 9, 20);
    lampLight.position.set(2, 1.5, 3);
    scene.add(lampLight);

    const lampLight2 = new THREE.PointLight(0xff9933, 7, 16);
    lampLight2.position.set(-2, 2.0, 2);
    scene.add(lampLight2);

    // Ground bounce
    const bounceLight = new THREE.HemisphereLight(0xffdd88, 0x1a1a3a, 2.2);
    scene.add(bounceLight);

    // 4 orbit color lights (Buddhist flag colors) circling model
    const orbitLightColors = [0xffaa00, 0x3366ff, 0xff3300, 0xff8800];
    const orbitLights: THREE.PointLight[] = orbitLightColors.map((c) => {
      const pl = new THREE.PointLight(c, 3.0, 7);
      scene.add(pl);
      return pl;
    });

    // ── 6. GROUND PLANE ───────────────────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#060d1f', roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── 7. FULL MOON ──────────────────────────────────────────────────────────
    // Moon position in sky — visible top-left
    const MOON_POS = new THREE.Vector3(-5, 8, -14);

    // Outer atmospheric halo (large, very transparent)
    const halo2Geo = new THREE.SphereGeometry(2.8, 32, 32);
    const halo2Mat = new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.05 });
    const halo2 = new THREE.Mesh(halo2Geo, halo2Mat);
    halo2.position.copy(MOON_POS);
    scene.add(halo2);

    // Inner glow halo
    const moonGlowGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const moonGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: 0.20 });
    const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
    moonGlow.position.copy(MOON_POS);
    scene.add(moonGlow);

    // Moon disk itself
    const moonGeo = new THREE.SphereGeometry(1.2, 48, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xfffee4,
      emissive: 0xfff8c0,
      emissiveIntensity: 1.2,
      roughness: 0.8,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.copy(MOON_POS);
    scene.add(moon);

    // Moon's own point light — casts real moonlit light onto scene & model
    const moonPointLight = new THREE.PointLight(0xfff5cc, 4.5, 80);
    moonPointLight.position.copy(MOON_POS);
    scene.add(moonPointLight);

    // A second, softer moon light for wider fill
    const moonFillLight = new THREE.PointLight(0xd0e8ff, 2.5, 60);
    moonFillLight.position.copy(MOON_POS);
    scene.add(moonFillLight);

    // ── 8. STARS ──────────────────────────────────────────────────────────────
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 180;
      starPositions[i * 3 + 1] = Math.random() * 70 + 6;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 180;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── 9. LANTERNS ───────────────────────────────────────────────────────────
    const buddhistColors = [0xffaa00, 0x1a4fd4, 0xe63c00, 0xffffff, 0xe87c2a];
    const lanternGroups: THREE.Group[] = [];

    const createLantern = (x: number, y: number, z: number, colorHex: number) => {
      const group = new THREE.Group();
      const bodyGeo = new THREE.OctahedronGeometry(0.22, 0);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex, emissive: colorHex,
        emissiveIntensity: 2.5, roughness: 0.15,
        transparent: true, opacity: 0.9,
      });
      group.add(new THREE.Mesh(bodyGeo, bodyMat));

      const innerLight = new THREE.PointLight(colorHex, 3.0, 4.0);
      group.add(innerLight);

      const str = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.4, 4),
        new THREE.MeshBasicMaterial({ color: 0xaaaaaa })
      );
      str.position.y = 0.32;
      group.add(str);

      const frillMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.2 });
      for (let i = -1; i <= 1; i++) {
        const frill = new THREE.Mesh(
          new THREE.CylinderGeometry(0.01, 0.005, 0.28 + Math.random() * 0.1, 4),
          frillMat
        );
        frill.position.set(i * 0.1, -0.28, 0.04 * (i % 2));
        group.add(frill);
      }
      group.position.set(x, y, z);
      return group;
    };

    [
      [-2.2, 3.2, 0.0,  buddhistColors[0]],
      [ 2.2, 3.0, -0.4, buddhistColors[1]],
      [ 0.0, 3.6, -1.0, buddhistColors[2]],
      [-1.1, 2.8, -0.7, buddhistColors[3]],
      [ 1.2, 3.4, 0.4,  buddhistColors[4]],
    ].forEach(([x, y, z, c]) => {
      const lg = createLantern(x as number, y as number, z as number, c as number);
      scene.add(lg);
      lanternGroups.push(lg);
    });

    // ── 10. SILHOUETTE TREES ──────────────────────────────────────────────────
    const createTree = (x: number, z: number, h: number) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.09, h * 0.35, 5),
        new THREE.MeshStandardMaterial({ color: 0x1a1010 })
      );
      trunk.position.set(x, (h * 0.35) / 2, z);
      const top = new THREE.Mesh(
        new THREE.ConeGeometry(h * 0.22, h * 0.75, 5),
        new THREE.MeshStandardMaterial({ color: 0x0a120a })
      );
      top.position.set(x, h * 0.35 + (h * 0.75) / 2, z);
      scene.add(trunk, top);
    };
    [[-7,-9,3.5],[-5,-11,4],[-9,-8,3],[-10,-7,2.8],[6,-10,3.8],[8,-9,4.2],[7,-12,5],[9,-8,3.5]].forEach(
      ([x,z,h]) => createTree(x,z,h)
    );

    // ── 11. LOAD 3D MODEL ─────────────────────────────────────────────────────
    let mixer: THREE.AnimationMixer | null = null;
    let modelRef: THREE.Object3D | null = null;
    const loader = new GLTFLoader();

    loader.load(
      '/Hitem3d-1781983799154.glb',
      (gltf) => {
        const model = gltf.scene;

        // Auto-fit: compute bounding box and scale + center to fill view
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Scale so the tallest dimension fits ~2.8 units
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2.8;
        const scaleFactor = targetSize / maxDim;
        model.scale.setScalar(scaleFactor);

        // Re-center horizontally; sit on ground
        model.position.x = -center.x * scaleFactor;
        model.position.y = -box.min.y * scaleFactor;
        model.position.z = -center.z * scaleFactor;

        model.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        scene.add(model);
        modelRef = model;

        // Aim camera target at model center after scaling
        const newBox = new THREE.Box3().setFromObject(model);
        const newCenter = newBox.getCenter(new THREE.Vector3());
        controls.target.set(newCenter.x, newCenter.y, newCenter.z);
        controls.update();

        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
        }
      },
      undefined,
      (err) => console.error('Model load error:', err)
    );

    // ── 12. ANIMATION LOOP ────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      mixer?.update(dt);

      // Smooth Y-axis rotation of the model
      if (modelRef) {
        modelRef.rotation.y = t * 0.45;
      }

      // Colored orbit lights circling at model height
      orbitLights.forEach((pl, i) => {
        const angle = t * 0.7 + (i * Math.PI * 2) / orbitLights.length;
        pl.position.set(
          Math.cos(angle) * 2.6,
          1.2 + Math.sin(t * 0.6 + i) * 0.5,
          Math.sin(angle) * 2.6
        );
        pl.intensity = 2.5 + 1.5 * Math.sin(t * 1.8 + i * 0.9);
      });

      // Lantern sway
      lanternGroups.forEach((lg, i) => {
        const freq = 0.8 + i * 0.25;
        const phase = i * 1.1;
        lg.rotation.z = Math.sin(t * freq + phase) * 0.06;
        lg.rotation.x = Math.cos(t * freq * 0.7 + phase) * 0.03;
        const light = lg.children.find((c) => c instanceof THREE.PointLight) as THREE.PointLight | undefined;
        if (light) light.intensity = 2.5 + 1.2 * Math.sin(t * 2.2 + phase);
      });

      // Lamp flicker
      lampLight.intensity  = 8.0 + 2.0 * Math.sin(t * 7.3) * Math.cos(t * 3.1);
      lampLight2.intensity = 6.5 + 1.5 * Math.cos(t * 5.7) * Math.sin(t * 2.9);

      // Moon pulse — glow halo breathes
      moonGlowMat.opacity = 0.15 + 0.10 * Math.sin(t * 0.5);
      halo2Mat.opacity    = 0.04 + 0.03 * Math.sin(t * 0.3 + 1);
      // Moon light gentle pulse
      moonPointLight.intensity = 4.0 + 1.0 * Math.sin(t * 0.4);
      moonFillLight.intensity  = 2.2 + 0.6 * Math.sin(t * 0.35 + 0.8);

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── 13. RESIZE ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── 14. CLEANUP ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      controls.dispose();
      mixer?.stopAllAction();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
}