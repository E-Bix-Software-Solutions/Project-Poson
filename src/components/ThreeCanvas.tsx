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
    scene.fog = new THREE.FogExp2('#060d1f', 0.016);

    // ── 2. CAMERA ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 3.0, 9.0);

    // ── 3. RENDERER ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    // ── 4. CONTROLS ───────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.8, 0);
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.minDistance = 2.5;
    controls.maxDistance = 22;

    // ── 5. LIGHTS ─────────────────────────────────────────────────────────────

    const ambientLight = new THREE.AmbientLight(0xb8ccff, 2.0);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xddeeff, 4.5);
    moonLight.position.set(-5, 14, -6);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width  = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near   = 0.5;
    moonLight.shadow.camera.far    = 100;
    moonLight.shadow.camera.left   = -18;
    moonLight.shadow.camera.right  =  18;
    moonLight.shadow.camera.top    =  18;
    moonLight.shadow.camera.bottom = -18;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    const keyLight = new THREE.DirectionalLight(0xfff8e8, 5.0);
    keyLight.position.set(0, 5, 10);
    scene.add(keyLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 2.8);
    topLight.position.set(0, 14, 0);
    scene.add(topLight);

    const rimLight = new THREE.DirectionalLight(0x88bbff, 3.5);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    const leftLight = new THREE.DirectionalLight(0xffcc88, 2.5);
    leftLight.position.set(-8, 4, 3);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xff8c2a, 2.2);
    rightLight.position.set(8, 4, 3);
    scene.add(rightLight);

    // Reduced lamp intensity — forest is darker/moodier now
    const lampLight = new THREE.PointLight(0xffcc55, 4, 14);
    lampLight.position.set(2, 1.5, 3);
    scene.add(lampLight);

    const lampLight2 = new THREE.PointLight(0xff9933, 3, 12);
    lampLight2.position.set(-2, 2.0, 2);
    scene.add(lampLight2);

    const bounceLight = new THREE.HemisphereLight(0xffdd88, 0x1a1a3a, 1.2);
    scene.add(bounceLight);

    const orbitLightColors = [0xffaa00, 0x3366ff, 0xff3300, 0xff8800];
    const orbitLights: THREE.PointLight[] = orbitLightColors.map((c) => {
      const pl = new THREE.PointLight(c, 2.5, 7);
      scene.add(pl);
      return pl;
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
    const moonGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: 0.20 });
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

    const moonPointLight = new THREE.PointLight(0xfff5cc, 4.0, 90);
    moonPointLight.position.copy(MOON_POS);
    scene.add(moonPointLight);

    const moonFillLight = new THREE.PointLight(0xd0e8ff, 2.2, 70);
    moonFillLight.position.copy(MOON_POS);
    scene.add(moonFillLight);

    // ── 8. STARS ──────────────────────────────────────────────────────────────
    const starCount = 1200;
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

    const loader = new GLTFLoader();

    // ── 9. HERO MODEL — scaled up to 4.5 target size ─────────────────────────
    let mixer: THREE.AnimationMixer | null = null;
    let modelRef: THREE.Object3D | null = null;

    loader.load(
      '/Hitem3d-1781983799154.glb',
      (gltf) => {
        const model = gltf.scene;
        const box    = new THREE.Box3().setFromObject(model);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        // Increased from 2.8 → 4.5 for a larger hero presence
        const sf     = 4.5 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(sf);
        model.position.set(-center.x * sf, -box.min.y * sf, -center.z * sf);
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });
        scene.add(model);
        modelRef = model;
        const nb = new THREE.Box3().setFromObject(model);
        const nc = nb.getCenter(new THREE.Vector3());
        controls.target.set(nc.x, nc.y, nc.z);
        controls.update();
        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
        }
      },
      undefined,
      (err) => console.error('Hero load error:', err)
    );

    // ── 10. VESAK LANTERNS GLB ────────────────────────────────────────────────
    // Minimized (scale 1.8) and repositioned to sit just below navbar (~top 8% of screen)
    // In world space that's a high y position behind the hero, spread wide on x.
    let lanternMixer: THREE.AnimationMixer | null = null;
    let lanternRef: THREE.Object3D | null = null;

    loader.load(
      '/vesak-lanterns.glb',
      (gltf) => {
        const l     = gltf.scene;
        const box   = new THREE.Box3().setFromObject(l);
        const size  = box.getSize(new THREE.Vector3());
        const ctr   = box.getCenter(new THREE.Vector3());
        // Minimized: 1.8 world units wide (was 5.0)
        const scale = 1.8 / Math.max(size.x, size.y, size.z);
        l.scale.setScalar(scale);
        // Position: wide spread along x, pushed high (y≈7.5) so they sit near navbar bottom
        // z pushed back so they don't overlap the hero
        l.position.set(-ctr.x * scale, 7.5 + (-box.min.y * scale), -ctr.z * scale - 3.0);
        l.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) { o.castShadow = false; o.receiveShadow = false; }
        });
        scene.add(l);
        lanternRef = l;

        if (gltf.animations?.length) {
          lanternMixer = new THREE.AnimationMixer(l);
          gltf.animations.forEach((clip) => lanternMixer!.clipAction(clip).play());
        }

        // Subtle glow — reduced intensity since lanterns are small decorative elements now
        const glowColors = [0xffaa00, 0xff6600, 0xffddaa, 0xff3300, 0xffcc00];
        glowColors.forEach((color, i) => {
          const ang = (i / glowColors.length) * Math.PI * 2;
          const pl  = new THREE.PointLight(color, 1.5, 4);
          pl.position.set(
            l.position.x + Math.cos(ang) * 0.8,
            l.position.y + 0.2,
            l.position.z + Math.sin(ang) * 0.8
          );
          scene.add(pl);
        });
      },
      undefined,
      (err) => console.error('Vesak lanterns load error:', err)
    );

    // ── 11. MANGO TREE FOREST — dimmer, moodier lighting ─────────────────────
    // Forest layout unchanged; tree-specific fill lights removed so the forest
    // reads as dark silhouette shapes lit only by moon + ambient.
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

    const mangoMixers: THREE.AnimationMixer[] = [];

    loader.load(
      '/mango-tree.glb',
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
            if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; }
          });
          scene.add(tree);

          if (gltf.animations?.length) {
            const m = new THREE.AnimationMixer(tree);
            gltf.animations.forEach((clip) => m.clipAction(clip).play());
            mangoMixers.push(m);
          }
        });
      },
      undefined,
      (err) => console.error('Mango tree load error:', err)
    );

    // ── 12. ANIMATION LOOP ────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t  = clock.getElapsedTime();

      mixer?.update(dt);
      lanternMixer?.update(dt);
      mangoMixers.forEach((m) => m.update(dt));

      if (modelRef) modelRef.rotation.y = t * 0.45;

      if (lanternRef) {
        lanternRef.rotation.z = Math.sin(t * 0.55) * 0.04;
        lanternRef.rotation.x = Math.cos(t * 0.40) * 0.02;
        lanternRef.position.y += Math.sin(t * 0.75) * 0.0003;
      }

      orbitLights.forEach((pl, i) => {
        const angle = t * 0.7 + (i * Math.PI * 2) / orbitLights.length;
        pl.position.set(
          Math.cos(angle) * 2.6,
          1.2 + Math.sin(t * 0.6 + i) * 0.5,
          Math.sin(angle) * 2.6
        );
        pl.intensity = 2.2 + 1.3 * Math.sin(t * 1.8 + i * 0.9);
      });

      lampLight.intensity  = 4.0 + 1.0 * Math.sin(t * 7.3) * Math.cos(t * 3.1);
      lampLight2.intensity = 3.0 + 0.8 * Math.cos(t * 5.7) * Math.sin(t * 2.9);

      moonGlowMat.opacity = 0.15 + 0.10 * Math.sin(t * 0.5);
      halo2Mat.opacity    = 0.04 + 0.03 * Math.sin(t * 0.3 + 1);
      moonPointLight.intensity = 3.8 + 0.9 * Math.sin(t * 0.4);
      moonFillLight.intensity  = 2.0 + 0.5 * Math.sin(t * 0.35 + 0.8);

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
      lanternMixer?.stopAllAction();
      mangoMixers.forEach((m) => m.stopAllAction());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
}