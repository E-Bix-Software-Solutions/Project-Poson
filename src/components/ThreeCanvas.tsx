import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ── GPU grass wind shader ─────────────────────────────────────────────────────
const GRASS_VERT = /* glsl */ `
  uniform float uTime;
  attribute float aWindPhase;
  attribute vec3  aColor;
  varying   vec3  vColor;
  varying   float vHeight;
  void main() {
    vec3 pos  = position;
    float top = max(0.0, pos.y / 0.32);
    float sw  = sin(uTime * 1.4 + aWindPhase) * 0.12
              + cos(uTime * 0.9 + aWindPhase * 0.5) * 0.06;
    pos.x    += sw * top * top;
    vColor    = aColor;
    vHeight   = top;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;
const GRASS_FRAG = /* glsl */ `
  varying vec3  vColor;
  varying float vHeight;
  void main() {
    gl_FragColor = vec4(mix(vColor * 0.7, vColor * 1.3, vHeight), 1.0);
  }
`;

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── 1. SCENE ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#060d1f");
    scene.fog = new THREE.FogExp2("#060d1f", 0.016);

    // ── 2. CAMERA ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      300,
    );
    camera.position.set(0, 3.0, 9.0);

    // ── 3. RENDERER ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
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
    scene.add(new THREE.AmbientLight(0xb8ccff, 2.0));

    const moonLight = new THREE.DirectionalLight(0xddeeff, 4.5);
    moonLight.position.set(-5, 14, -6);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 100;
    moonLight.shadow.camera.left = -18;
    moonLight.shadow.camera.right = 18;
    moonLight.shadow.camera.top = 18;
    moonLight.shadow.camera.bottom = -18;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    // ── FIX: use .position.set() — Object.assign doesn't work on Vector3 ──────
    const keyLight = new THREE.DirectionalLight(0xfff8e8, 5.5);
    keyLight.position.set(0, 8, 10);
    scene.add(keyLight);

    // const rimLight = new THREE.DirectionalLight(0x88bbff, 3.5);
    // rimLight.position.set(0, 5, -10);
    // scene.add(rimLight);

    // const leftLight = new THREE.DirectionalLight(0xffcc88, 2.5);
    // leftLight.position.set(-8, 4, 3);
    // scene.add(leftLight);

    // const rightLight = new THREE.DirectionalLight(0xff8c2a, 2.2);
    // rightLight.position.set(8, 4, 3);
    // scene.add(rightLight);

    const lampLight = new THREE.PointLight(0xffcc55, 4, 14);
    lampLight.position.set(2, 1.5, 3);
    scene.add(lampLight);

    const lampLight2 = new THREE.PointLight(0xff9933, 3, 12);
    lampLight2.position.set(-2, 2.0, 2);
    scene.add(lampLight2);

    scene.add(new THREE.HemisphereLight(0xffdd88, 0x1a1a3a, 1.2));

    // ── 6. GROUND — black stone base ─────────────────────────────────────────
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0f,
      roughness: 0.92,
      metalness: 0.18,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── 6b. STONE SLABS ───────────────────────────────────────────────────────
    const slab1Mat = new THREE.MeshStandardMaterial({
      color: 0x12121a,
      roughness: 0.85,
      metalness: 0.25,
    });
    const slab2Mat = new THREE.MeshStandardMaterial({
      color: 0x0e0e16,
      roughness: 0.78,
      metalness: 0.3,
    });

    const stoneLayouts: [number, number, number, number, number][] = [
      [1.2, 0.8, 0.55, 0.06, 0.4],
      [-1.4, 1.2, 0.42, 0.05, 1.1],
      [2.5, 2.0, 0.38, 0.07, 0.7],
      [-2.8, 1.6, 0.5, 0.05, 2.1],
      [3.5, 0.5, 0.6, 0.08, 0.9],
      [-3.8, 0.8, 0.48, 0.06, 1.8],
      [6.0, 1.5, 0.65, 0.09, 1.2],
      [-6.5, 2.0, 0.5, 0.06, 0.6],
      [1.8, 5.0, 0.42, 0.05, 1.9],
      [-2.0, 4.5, 0.38, 0.07, 0.8],
      [8.0, 0.0, 0.7, 0.1, 0.5],
      [-8.5, 1.0, 0.6, 0.08, 1.7],
    ];
    stoneLayouts.forEach(([x, z, r, h, rot], i) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r * 1.1, h, 6 + (i % 3)),
        i % 2 === 0 ? slab1Mat : slab2Mat,
      );
      mesh.position.set(x, h / 2, z);
      mesh.rotation.y = rot;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // ── 6c. GPU GRASS ─────────────────────────────────────────────────────────
    const BLADE_COUNT = 600;
    const bladeGeo = new THREE.PlaneGeometry(0.05, 0.32, 1, 3);
    const bPos = bladeGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < bPos.count; i++) {
      const norm = (bPos.getY(i) + 0.16) / 0.32;
      bPos.setX(i, bPos.getX(i) + norm * norm * 0.04);
    }
    bladeGeo.computeVertexNormals();

    const windPhaseArr = new Float32Array(BLADE_COUNT);
    const colorArr = new Float32Array(BLADE_COUNT * 3);
    const cA = new THREE.Color(0x0f2a0a);
    const cB = new THREE.Color(0x3d6b22);
    const tmp = new THREE.Color();
    for (let i = 0; i < BLADE_COUNT; i++) {
      windPhaseArr[i] = Math.random() * Math.PI * 2;
      tmp.lerpColors(cA, cB, Math.random());
      colorArr[i * 3] = tmp.r;
      colorArr[i * 3 + 1] = tmp.g;
      colorArr[i * 3 + 2] = tmp.b;
    }
    bladeGeo.setAttribute(
      "aWindPhase",
      new THREE.InstancedBufferAttribute(windPhaseArr, 1),
    );
    bladeGeo.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(colorArr, 3),
    );

    const bladeMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: GRASS_VERT,
      fragmentShader: GRASS_FRAG,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, BLADE_COUNT);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < BLADE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const minR = i < BLADE_COUNT * 0.5 ? 1.5 : 5.0;
      const maxR = i < BLADE_COUNT * 0.5 ? 12.0 : 28.0;
      const radius = minR + Math.random() * (maxR - minR);
      dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.4;
      dummy.scale.set(0.8 + Math.random() * 0.4, 0.6 + Math.random() * 0.8, 1);
      dummy.updateMatrix();
      grassMesh.setMatrixAt(i, dummy.matrix);
    }
    grassMesh.instanceMatrix.needsUpdate = true;
    scene.add(grassMesh);

    // ── 6d. PEBBLES ───────────────────────────────────────────────────────────
    const pebbleMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 5, 4),
      new THREE.MeshStandardMaterial({
        color: 0x181820,
        roughness: 0.7,
        metalness: 0.35,
      }),
      60,
    );
    for (let i = 0; i < 60; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.0 + Math.random() * 14.0;
      const s = 0.03 + Math.random() * 0.07;
      dummy.position.set(Math.cos(a) * r, s * 0.5, Math.sin(a) * r);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      dummy.scale.set(
        s,
        s * (0.4 + Math.random() * 0.4),
        s * (0.8 + Math.random() * 0.4),
      );
      dummy.updateMatrix();
      pebbleMesh.setMatrixAt(i, dummy.matrix);
    }
    pebbleMesh.instanceMatrix.needsUpdate = true;
    scene.add(pebbleMesh);

    // ── 7. FULL MOON ──────────────────────────────────────────────────────────
    const MOON_POS = new THREE.Vector3(-5, 9, -16);

    const halo2Mat = new THREE.MeshBasicMaterial({
      color: 0xfff0a0,
      transparent: true,
      opacity: 0.05,
    });
    const halo2 = new THREE.Mesh(
      new THREE.SphereGeometry(2.8, 16, 16),
      halo2Mat,
    );
    halo2.position.copy(MOON_POS);
    scene.add(halo2);

    const moonGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfff6c8,
      transparent: true,
      opacity: 0.2,
    });
    const moonGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 16, 16),
      moonGlowMat,
    );
    moonGlow.position.copy(MOON_POS);
    scene.add(moonGlow);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xfffee4,
        emissive: 0xfff8c0,
        emissiveIntensity: 1.2,
        roughness: 0.8,
      }),
    );
    moon.position.copy(MOON_POS);
    scene.add(moon);

    const moonPointLight = new THREE.PointLight(0xfff5cc, 4.0, 90);
    moonPointLight.position.copy(MOON_POS);
    scene.add(moonPointLight);

    // const moonFillLight = new THREE.PointLight(0xd0e8ff, 2.2, 70);
    // moonFillLight.position.copy(MOON_POS);
    // scene.add(moonFillLight);

    // ── 8. STARS ──────────────────────────────────────────────────────────────
    const starCount = 250;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = Math.random() * 70 + 8;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.14,
          sizeAttenuation: true,
        }),
      ),
    );

    // ── 9. HERO MODEL ─────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;

    loader.load(
      "/Hitem3d-1781983799154-compressed.glb",
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const sf = 4.5 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(sf);
        model.position.set(-center.x * sf, -box.min.y * sf, -center.z * sf);
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        scene.add(model);
        const nc = new THREE.Box3()
          .setFromObject(model)
          .getCenter(new THREE.Vector3());
        controls.target.set(nc.x, nc.y, nc.z);
        controls.update();
        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
        }
      },
      undefined,
      (err) => console.error("Hero load error:", err),
    );

    // ── 10. VESAK LANTERNS ────────────────────────────────────────────────────
    let lanternMixer: THREE.AnimationMixer | null = null;
    let lanternRef: THREE.Object3D | null = null;

    loader.load(
      "/vesak-lanterns-compressed_compressed.glb",
      (gltf) => {
        const l = gltf.scene;
        const box = new THREE.Box3().setFromObject(l);
        const size = box.getSize(new THREE.Vector3());
        const ctr = box.getCenter(new THREE.Vector3());
        const sc = 1.8 / Math.max(size.x, size.y, size.z);
        l.scale.setScalar(sc);
        l.position.set(-ctr.x * sc, 7.5 + -box.min.y * sc, -ctr.z * sc - 3.0);
        l.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = false;
            o.receiveShadow = false;
          }
        });
        scene.add(l);
        lanternRef = l;
        if (gltf.animations?.length) {
          lanternMixer = new THREE.AnimationMixer(l);
          gltf.animations.forEach((clip) =>
            lanternMixer!.clipAction(clip).play(),
          );
        }
        // [0xffaa00, 0xff6600, 0xffddaa, 0xff3300, 0xffcc00].forEach(
        //   (color, i) => {
        //     const ang = (i / 5) * Math.PI * 2;
        //     const pl = new THREE.PointLight(color, 1.5, 4);
        //     pl.position.set(
        //       l.position.x + Math.cos(ang) * 0.8,
        //       l.position.y + 0.2,
        //       l.position.z + Math.sin(ang) * 0.8,
        //     );
        //     scene.add(pl);
        //   },
        // );
      },
      undefined,
      (err) => console.error("Vesak lanterns load error:", err),
    );

    // ── 11. MANGO TREE FOREST ─────────────────────────────────────────────────
    const forestLayout: [number, number, number, number][] = [
      [-8, -9, 0.3, 1.0],
      [-4, -11, 0.1, 1.1],
      [0, -12, 0.0, 1.15],
      [4, -11, -0.1, 1.05],
      [8, -9, -0.3, 0.95],
      [-11, -15, 0.2, 1.25],
      [-4, -16, 0.0, 1.2],
      [4, -16, 0.0, 1.2],
      [11, -15, -0.2, 1.3],
      [-13, -5, 0.8, 1.0],
      [13, -5, -0.8, 0.95],
      [-10, 0, 0.6, 0.78],
      [10, 0, -0.6, 0.75],
    ];
    const mangoMixers: THREE.AnimationMixer[] = [];

    loader.load(
      "/mango-tree-compressed.glb",
      (gltf) => {
        forestLayout.forEach(([x, z, rotY, sc]) => {
          const tree = gltf.scene.clone(true);
          const box = new THREE.Box3().setFromObject(tree);
          const size = box.getSize(new THREE.Vector3());
          const base = (5.5 / Math.max(size.x, size.y, size.z)) * sc;
          tree.scale.setScalar(base);
          const rb = new THREE.Box3().setFromObject(tree);
          tree.position.set(x, -rb.min.y, z);
          tree.rotation.y = rotY;
          tree.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) {
              o.castShadow = false;
              o.receiveShadow = false;
            }
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
      (err) => console.error("Mango tree load error:", err),
    );

    // ── 12. ANIMATION LOOP ────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      mixer?.update(dt);
      lanternMixer?.update(dt);
      mangoMixers.forEach((m) => m.update(dt));

      // Grass wind — single uniform write, GPU does the work
      bladeMat.uniforms.uTime.value = t;

      if (lanternRef) {
        lanternRef.rotation.z = Math.sin(t * 0.55) * 0.04;
        lanternRef.rotation.x = Math.cos(t * 0.4) * 0.02;
        lanternRef.position.y += Math.sin(t * 0.75) * 0.0003;
      }

      lampLight.intensity = 4.0 + 1.0 * Math.sin(t * 7.3) * Math.cos(t * 3.1);
      lampLight2.intensity = 3.0 + 0.8 * Math.cos(t * 5.7) * Math.sin(t * 2.9);

      moonGlowMat.opacity = 0.15 + 0.1 * Math.sin(t * 0.5);
      halo2Mat.opacity = 0.04 + 0.03 * Math.sin(t * 0.3 + 1);
      moonPointLight.intensity = 3.8 + 0.9 * Math.sin(t * 0.4);
      moonFillLight.intensity = 2.0 + 0.5 * Math.sin(t * 0.35 + 0.8);

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
    window.addEventListener("resize", onResize);

    // ── 14. CLEANUP ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
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
      style={{ display: "block", width: "100vw", height: "100vh" }}
    />
  );
}
