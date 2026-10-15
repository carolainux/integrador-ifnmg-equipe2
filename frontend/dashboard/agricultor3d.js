// Agricultor 3D v2 — AgroSensor (Three.js r128, só formas básicas, sem arquivos externos)
// Cena: agricultor regando o canteiro; plantas reagem à água; sensor mostra a umidade do solo.
(function () {
  const box = document.getElementById('agricultor-3d');
  if (!box || !window.THREE) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (e) {
    return; // sem WebGL: simplesmente não mostra o boneco
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  box.appendChild(renderer.domElement);

  const M = THREE.MathUtils;
  const suave = (a, b, x) => M.smoothstep(x, a, b);
  const lerp = (a, b, k) => a + (b - a) * k;

  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
  const alvo = new THREE.Vector3(0.55, 0.95, 0);
  const dirCam = new THREE.Vector3(0.12, 0.22, 1).normalize();

  // ---------- LUZES ----------
  scene.add(new THREE.HemisphereLight(0xdff4ff, 0x2c5a34, 0.85));
  const sol = new THREE.DirectionalLight(0xffe6bd, 1.0);
  sol.position.set(-2.5, 6, 4.5);
  sol.target.position.set(0.55, 0, 0);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  sol.shadow.camera.left = -4; sol.shadow.camera.right = 4;
  sol.shadow.camera.top = 4;   sol.shadow.camera.bottom = -4;
  sol.shadow.camera.near = 1;  sol.shadow.camera.far = 20;
  sol.shadow.bias = -0.0005;
  scene.add(sol, sol.target);
  const contraluz = new THREE.DirectionalLight(0x6ff2b0, 0.45); // brilho esmeralda na borda
  contraluz.position.set(4, 3, -5);
  scene.add(contraluz);

  // ---------- AJUDANTES ----------
  const mat = (cor, extra) => new THREE.MeshStandardMaterial(Object.assign({ color: cor, roughness: 0.85, metalness: 0 }, extra));
  const mesh = (geo, cor, pai, x = 0, y = 0, z = 0, sombra = true) => {
    const m = new THREE.Mesh(geo, cor.isMaterial ? cor : mat(cor));
    m.position.set(x, y, z);
    m.castShadow = sombra;
    m.receiveShadow = true;
    pai.add(m);
    return m;
  };

  const mundo = new THREE.Group();
  scene.add(mundo);

  // ---------- CHÃO ----------
  mesh(new THREE.CylinderGeometry(2.6, 2.45, 0.14, 64), 0x4a9a45, mundo, 0.55, -0.07, 0);
  mesh(new THREE.CylinderGeometry(2.45, 2.1, 0.55, 64), 0x6b4428, mundo, 0.55, -0.41, 0);

  // ---------- CANTEIRO ----------
  const BX = 1.5; // posição x do canteiro
  const matCanteiro = mat(0x5b3a22);
  mesh(new THREE.BoxGeometry(0.95, 0.16, 2.7), matCanteiro, mundo, BX, 0.08, 0);
  const madeira = mat(0x9a6b3c, { roughness: 0.7 });
  mesh(new THREE.BoxGeometry(0.07, 0.22, 2.84), madeira, mundo, BX - 0.51, 0.11, 0);
  mesh(new THREE.BoxGeometry(0.07, 0.22, 2.84), madeira, mundo, BX + 0.51, 0.11, 0);
  mesh(new THREE.BoxGeometry(1.09, 0.22, 0.07), madeira, mundo, BX, 0.11, -1.39);
  mesh(new THREE.BoxGeometry(1.09, 0.22, 0.07), madeira, mundo, BX, 0.11, 1.39);

  // ---------- PLANTAS ----------
  const folhaGeo = new THREE.SphereGeometry(0.15, 10, 8);
  const petalaGeo = new THREE.SphereGeometry(0.03, 6, 6);
  const corSeca = new THREE.Color(0x6a4527);
  const corUmida = new THREE.Color(0x2b1a0e);
  const plantas = [];
  for (let i = 0; i < 5; i++) {
    const g = new THREE.Group();
    g.position.set(BX, 0.16, -1 + i * 0.5);
    mundo.add(g);

    const matMonte = mat(0x6a4527);
    mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.06, 18), matMonte, g, 0, 0, 0, false);

    const folhas = [];
    for (let k = 0; k < 8; k++) {
      const pivo = new THREE.Group();
      pivo.position.y = 0.05 + (k % 2) * 0.04;
      pivo.rotation.y = k * Math.PI / 4 + i;
      g.add(pivo);
      const cor = k % 3 === 0 ? 0x66c05a : (k % 3 === 1 ? 0x4fae48 : 0x3f9a3c);
      const f = mesh(folhaGeo, cor, pivo, 0.12, 0, 0);
      f.scale.set(1.3, 0.28, 0.75);
      folhas.push(pivo);
    }
    mesh(new THREE.SphereGeometry(0.07, 10, 10), 0x57b24a, g, 0, 0.09, 0);

    const flor = new THREE.Group();
    flor.position.y = 0.05;
    g.add(flor);
    mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.28, 6), 0x3f9a3c, flor, 0, 0.14, 0, false);
    mesh(new THREE.SphereGeometry(0.045, 10, 10), 0xffc83d, flor, 0, 0.3, 0, false);
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3;
      mesh(petalaGeo, 0xffffff, flor, Math.cos(a) * 0.06, 0.3, Math.sin(a) * 0.06, false);
    }
    flor.scale.setScalar(0.001);

    plantas.push({ g, folhas, flor, matMonte, z: g.position.z, umido: 0, fase: i * 1.3 });
  }

  // ---------- SENSOR AGROSENSOR ----------
  const SX = 2.3, SZ = 0.7;
  const sensor = new THREE.Group();
  sensor.position.set(SX, 0, SZ);
  mundo.add(sensor);
  mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.7, 12), 0xf1f5f2, sensor, 0, 0.35, 0);
  mesh(new THREE.BoxGeometry(0.2, 0.14, 0.14), 0x0f8a2f, sensor, 0, 0.75, 0);
  const painel = mesh(new THREE.BoxGeometry(0.3, 0.02, 0.22), mat(0x1b2e55, { roughness: 0.3, metalness: 0.4 }), sensor, 0, 0.88, 0);
  painel.rotation.z = 0.3;
  const matLed = new THREE.MeshBasicMaterial({ color: 0x7dffb0 });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), matLed);
  led.position.set(0, 0.76, 0.075);
  sensor.add(led);

  // leitura flutuante (canvas -> sprite)
  const cvL = document.createElement('canvas');
  cvL.width = 320; cvL.height = 160;
  const cl = cvL.getContext('2d');
  const texL = new THREE.CanvasTexture(cvL);
  let ultimaLeitura = -1;
  function desenharLeitura(pct) {
    cl.clearRect(0, 0, 320, 160);
    cl.fillStyle = 'rgba(2,42,22,0.88)';
    cl.strokeStyle = '#1f9a55';
    cl.lineWidth = 4;
    cl.beginPath();
    if (cl.roundRect) cl.roundRect(6, 6, 308, 148, 26); else cl.rect(6, 6, 308, 148);
    cl.fill(); cl.stroke();
    cl.fillStyle = '#a7f3d0';
    cl.font = '600 26px sans-serif';
    cl.textAlign = 'left';
    cl.fillText('Umidade do solo', 28, 46);
    cl.fillStyle = '#ffffff';
    cl.font = 'bold 64px sans-serif';
    cl.fillText(pct + '%', 28, 108);
    cl.fillStyle = 'rgba(255,255,255,0.15)';
    cl.fillRect(28, 124, 264, 12);
    cl.fillStyle = '#34d399';
    cl.fillRect(28, 124, 264 * pct / 100, 12);
    texL.needsUpdate = true;
  }
  desenharLeitura(40);
  const leitura = new THREE.Sprite(new THREE.SpriteMaterial({ map: texL, transparent: true, depthWrite: false }));
  leitura.scale.set(1.0, 0.5, 1);
  leitura.position.set(SX, 1.45, SZ);
  mundo.add(leitura);

  // ---------- FAZENDEIRO ----------
  const pele = mat(0xe2a981, { roughness: 0.7 });
  const jeans = mat(0x2f5384);
  const couro = mat(0x4a301c, { roughness: 0.6 });
  const palha = mat(0xe3c37a);
  const verde = mat(0x2f6f42);

  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const c = cv.getContext('2d');
  c.fillStyle = '#2f6f42'; c.fillRect(0, 0, 128, 128);
  c.fillStyle = 'rgba(8,30,18,0.5)';
  for (let i = 0; i < 128; i += 32) { c.fillRect(i, 0, 12, 128); c.fillRect(0, i, 128, 12); }
  c.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 16; i < 128; i += 32) { c.fillRect(i, 0, 3, 128); c.fillRect(0, i, 128, 3); }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = 4;
  const camisa = mat(0xffffff, { map: tex });

  const agricultor = new THREE.Group(); // olha para +x
  agricultor.position.set(-0.35, 0, 0);
  mundo.add(agricultor);

  const corpo = new THREE.Group();
  corpo.position.y = 0.95;
  agricultor.add(corpo);

  // pernas e botas
  function criarPerna(z) {
    const q = new THREE.Group();
    q.position.set(0, 0.95, z);
    agricultor.add(q);
    mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.82, 14), jeans, q, 0, -0.41, 0);
    mesh(new THREE.CylinderGeometry(0.115, 0.12, 0.14, 14), couro, q, 0, -0.78, 0);
    mesh(new THREE.BoxGeometry(0.36, 0.14, 0.19), couro, q, 0.07, -0.88, 0);
    return q;
  }
  const pernaCam = criarPerna(0.15);
  const pernaFundo = criarPerna(-0.15);

  // quadril
  mesh(new THREE.BoxGeometry(0.4, 0.24, 0.6), jeans, corpo, 0, 0, 0);
  mesh(new THREE.BoxGeometry(0.43, 0.05, 0.63), couro, corpo, 0, 0.1, 0);
  mesh(new THREE.BoxGeometry(0.05, 0.06, 0.09), 0xd9b24a, corpo, 0.22, 0.1, 0, false); // fivela

  // tronco
  const tronco = new THREE.Group();
  tronco.position.y = 0.1;
  corpo.add(tronco);
  mesh(new THREE.BoxGeometry(0.42, 0.72, 0.62), camisa, tronco, 0, 0.36, 0);
  mesh(new THREE.BoxGeometry(0.05, 0.42, 0.38), jeans, tronco, 0.22, 0.28, 0);        // peitilho
  mesh(new THREE.BoxGeometry(0.47, 0.05, 0.07), jeans, tronco, 0, 0.74, 0.17);       // alças
  mesh(new THREE.BoxGeometry(0.47, 0.05, 0.07), jeans, tronco, 0, 0.74, -0.17);
  mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.1, 12), pele, tronco, 0, 0.78, 0); // pescoço

  // cabeça
  const cabeca = new THREE.Group();
  cabeca.position.set(0.02, 1.0, 0);
  tronco.add(cabeca);
  mesh(new THREE.SphereGeometry(0.22, 28, 24), pele, cabeca, 0, 0, 0);
  mesh(new THREE.SphereGeometry(0.045, 10, 10), pele, cabeca, 0, 0, 0.22);
  mesh(new THREE.SphereGeometry(0.045, 10, 10), pele, cabeca, 0, 0, -0.22);
  const matOlho = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
  [-1, 1].forEach((l) => {
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), matOlho);
    o.position.set(0.195, 0.03, l * 0.085);
    cabeca.add(o);
    mesh(new THREE.BoxGeometry(0.02, 0.016, 0.065), 0x4a2f1c, cabeca, 0.205, 0.095, l * 0.088, false);
  });
  mesh(new THREE.SphereGeometry(0.035, 10, 10), mat(0xd49669), cabeca, 0.215, -0.015, 0, false); // nariz
  [-1, 1].forEach((l) => {
    const b = mesh(new THREE.SphereGeometry(0.045, 10, 8), 0x5a3a22, cabeca, 0.205, -0.045, l * 0.035, false);
    b.scale.set(0.6, 0.55, 1.2);
  });
  const sorriso = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 6, 14, Math.PI), new THREE.MeshBasicMaterial({ color: 0x7a2e24 }));
  sorriso.position.set(0.2, -0.085, 0);
  sorriso.rotation.y = Math.PI / 2;
  sorriso.scale.y = -1;
  cabeca.add(sorriso);

  // chapéu de palha
  mesh(new THREE.CylinderGeometry(0.34, 0.6, 0.07, 44), palha, cabeca, 0, 0.16, 0);
  mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.22, 32), palha, cabeca, 0, 0.27, 0);
  const copa = mesh(new THREE.SphereGeometry(0.24, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), palha, cabeca, 0, 0.38, 0);
  copa.scale.y = 0.45;
  mesh(new THREE.CylinderGeometry(0.287, 0.287, 0.06, 32), 0x7a2e24, cabeca, 0, 0.21, 0);

  // braços (ombro → cotovelo → mão)
  function criarBraco(z) {
    const ombro = new THREE.Group();
    ombro.position.set(0, 0.68, z);
    tronco.add(ombro);
    mesh(new THREE.SphereGeometry(0.1, 14, 12), verde, ombro, 0, 0, 0);
    mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.34, 12), verde, ombro, 0, -0.17, 0);
    const cotovelo = new THREE.Group();
    cotovelo.position.y = -0.34;
    ombro.add(cotovelo);
    mesh(new THREE.SphereGeometry(0.075, 12, 10), verde, cotovelo, 0, 0, 0);
    mesh(new THREE.CylinderGeometry(0.07, 0.058, 0.3, 12), pele, cotovelo, 0, -0.15, 0);
    mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.06, 12), verde, cotovelo, 0, -0.03, 0); // punho dobrado
    const mao = new THREE.Group();
    mao.position.y = -0.32;
    cotovelo.add(mao);
    mesh(new THREE.SphereGeometry(0.068, 12, 10), pele, mao, 0, 0, 0);
    return { ombro, cotovelo, mao };
  }
  const bracoCam = criarBraco(0.35);
  const bracoFundo = criarBraco(-0.35);

  // regador (preso à mão; o pivô cancela a rotação do braço para o regador ficar nivelado)
  const pivoRegador = new THREE.Group();
  bracoCam.mao.add(pivoRegador);
  const regador = new THREE.Group();
  pivoRegador.add(regador);
  const azul = mat(0x3a8fd0, { roughness: 0.4, metalness: 0.3 });
  const azulEscuro = mat(0x2a6fa8, { roughness: 0.4, metalness: 0.3 });
  mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.3, 24), azul, regador, 0.22, 0, 0);
  const aro = mesh(new THREE.TorusGeometry(0.17, 0.014, 8, 24), azulEscuro, regador, 0.22, 0.15, 0, false);
  aro.rotation.x = Math.PI / 2;
  const agua0 = mesh(new THREE.CircleGeometry(0.16, 20), new THREE.MeshBasicMaterial({ color: 0x1d4f7a }), regador, 0.22, 0.152, 0, false);
  agua0.rotation.x = -Math.PI / 2;
  mesh(new THREE.TorusGeometry(0.14, 0.024, 8, 20), azulEscuro, regador, 0.07, 0.04, 0, false); // alça
  const bico = mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.5, 10), azul, regador, 0.58, 0.155, 0);
  bico.rotation.z = -1.0;
  const rosa = mesh(new THREE.CylinderGeometry(0.07, 0.045, 0.05, 14), azulEscuro, regador, 0.81, 0.3, 0);
  rosa.rotation.z = -1.0;
  const ponta = new THREE.Object3D();
  ponta.position.set(0.8, 0.29, 0);
  regador.add(ponta);
  const baseBico = new THREE.Object3D();
  baseBico.position.set(0.7, 0.23, 0);
  regador.add(baseBico);

  // ---------- ÁGUA (partículas instanciadas) ----------
  const NA = 280;
  const gotas = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.03, 6, 5),
    new THREE.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.9 }),
    NA
  );
  gotas.frustumCulled = false;
  mundo.add(gotas);
  const P = [];
  for (let i = 0; i < NA; i++) P.push({ vivo: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, t: 0, dur: 1, s: 1 });
  const dummy = new THREE.Object3D();
  let cursor = 0, acumulo = 0;
  function emitir(x, y, z, vx, vy, vz, dur, s) {
    for (let n = 0; n < NA; n++) {
      const i = (cursor + n) % NA;
      const p = P[i];
      if (!p.vivo) {
        cursor = i + 1;
        p.vivo = true; p.x = x; p.y = y; p.z = z; p.vx = vx; p.vy = vy; p.vz = vz; p.t = 0; p.dur = dur; p.s = s;
        return;
      }
    }
  }

  // ---------- GRAMA, FLORES E PEDRAS ----------
  const tufoGeo = new THREE.ConeGeometry(0.05, 0.3, 5);
  const tufoMat = [mat(0x5fb552), mat(0x3f9a3c), mat(0x7ccb62)];
  const tufos = [];
  const livre = (x, z) =>
    !(x > 0.9 && x < 2.2 && Math.abs(z) < 1.55) &&   // canteiro
    !(Math.abs(x + 0.35) < 0.6 && Math.abs(z) < 0.6) && // fazendeiro
    !(Math.abs(x - SX) < 0.3 && Math.abs(z - SZ) < 0.3); // sensor
  let tentativas = 0;
  while (tufos.length < 48 && tentativas++ < 400) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 2.3;
    const x = 0.55 + Math.cos(a) * r, z = Math.sin(a) * r;
    if (!livre(x, z)) continue;
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    for (let k = 0; k < 3; k++) {
      const cone = new THREE.Mesh(tufoGeo, tufoMat[k]);
      cone.position.set((k - 1) * 0.04, 0.15, 0);
      cone.rotation.z = (k - 1) * 0.28;
      t.add(cone);
    }
    t.scale.setScalar(0.7 + rnd() * 0.8);
    t.userData.fase = rnd() * 6;
    mundo.add(t);
    tufos.push(t);
  }
  const coresFlor = [0xffffff, 0xffd84a, 0xff8fb1];
  let nf = 0; tentativas = 0;
  while (nf < 16 && tentativas++ < 300) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 2.3;
    const x = 0.55 + Math.cos(a) * r, z = Math.sin(a) * r;
    if (!livre(x, z)) continue;
    mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 4), 0x3f9a3c, mundo, x, 0.06, z, false);
    mesh(new THREE.SphereGeometry(0.03, 8, 8), coresFlor[nf % 3], mundo, x, 0.13, z, false);
    nf++;
  }
  nf = 0; tentativas = 0;
  while (nf < 4 && tentativas++ < 200) {
    const a = rnd() * Math.PI * 2, r = 1.7 + rnd() * 0.5;
    const x = 0.55 + Math.cos(a) * r, z = Math.sin(a) * r;
    if (!livre(x, z)) continue;
    const pedra = mesh(new THREE.DodecahedronGeometry(0.1 + rnd() * 0.08, 0), 0x8b8f87, mundo, x, 0.05, z);
    pedra.scale.y = 0.65;
    pedra.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    nf++;
  }

  // ---------- BORBOLETAS ----------
  function criarBorboleta(cor, cx, cy, cz, ax, az, vel, fase) {
    const g = new THREE.Group();
    mundo.add(g);
    const corpoB = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.12, 6), new THREE.MeshBasicMaterial({ color: 0x2a2a2a }));
    corpoB.rotation.z = Math.PI / 2;
    g.add(corpoB);
    const asaGeo = new THREE.CircleGeometry(0.075, 12);
    const asaMat = new THREE.MeshBasicMaterial({ color: cor, side: THREE.DoubleSide });
    const pivos = [];
    [-1, 1].forEach((l) => {
      const pivo = new THREE.Group();
      g.add(pivo);
      const asa = new THREE.Mesh(asaGeo, asaMat);
      asa.rotation.x = -Math.PI / 2;
      asa.position.set(0, 0, l * 0.075);
      asa.scale.set(1.1, 1, 1);
      pivo.add(asa);
      pivos.push({ pivo, l });
    });
    return { g, pivos, cx, cy, cz, ax, az, vel, fase };
  }
  const borboletas = [
    criarBorboleta(0xffb347, 1.5, 0.95, 0.1, 1.0, 1.2, 0.55, 0),
    criarBorboleta(0xff8fd0, 0.3, 1.25, 0.9, 1.3, 0.8, 0.42, 2.4),
  ];
  function posBorboleta(b, tt) {
    const a = tt * b.vel + b.fase;
    return [b.cx + Math.cos(a) * b.ax, b.cy + Math.sin(tt * 2.1 + b.fase) * 0.1, b.cz + Math.sin(a * 1.3) * b.az];
  }

  // ---------- TAMANHO / MOUSE ----------
  function ajustar() {
    const w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    const tanV = Math.tan(M.degToRad(camera.fov / 2));
    const d = Math.max(2.55 / (tanV * camera.aspect), 1.8 / tanV);
    camera.position.copy(alvo).addScaledVector(dirCam, d);
    camera.lookAt(alvo);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(ajustar).observe(box);
  ajustar();

  let mx = 0, mxS = 0;
  window.addEventListener('mousemove', (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; });

  // ---------- ANIMAÇÃO ----------
  const CICLO = 8;
  let t = 1.2, umidLida = 40;
  const wA = new THREE.Vector3(), wB = new THREE.Vector3(), lA = new THREE.Vector3(), lB = new THREE.Vector3(), dirAgua = new THREE.Vector3();
  const invMundo = new THREE.Matrix4();

  function atualizar(dt) {
    t += dt;
    const u = (t % CICLO) / CICLO;
    // k = 0 (parado) → 1 (regando)
    const k = suave(0.1, 0.25, u) * (1 - suave(0.8, 0.95, u));
    const respira = Math.sin(t * 1.8);

    // fazendeiro: gira varrendo o canteiro enquanto rega
    agricultor.rotation.y = k * (-0.18 + 0.52 * Math.cos(u * Math.PI * 4));
    corpo.position.y = 0.95 + respira * 0.008;
    tronco.rotation.z = -0.12 * k + respira * 0.01;
    cabeca.rotation.z = -0.22 * k + Math.sin(t * 0.9) * 0.02;
    cabeca.rotation.y = Math.sin(t * 0.6) * 0.1 * (1 - k);
    pernaCam.rotation.z = Math.sin(t * 0.8) * 0.015;
    pernaFundo.rotation.z = -Math.sin(t * 0.8) * 0.015;

    // braço do regador
    const shC = lerp(0.25, 0.95, k) + respira * 0.015;
    const elC = lerp(0.35, 0.5, k);
    bracoCam.ombro.rotation.z = shC;
    bracoCam.cotovelo.rotation.z = elC;
    const tilt = lerp(0.05, -0.95, suave(0.3, 1, k));
    pivoRegador.rotation.z = -(shC + elC) - tronco.rotation.z;
    regador.rotation.z = tilt + Math.sin(t * 5) * 0.01 * k;
    // braço livre
    bracoFundo.ombro.rotation.z = -0.1 + 0.15 * k + Math.sin(t * 1.8 + 1) * 0.03;
    bracoFundo.cotovelo.rotation.z = 0.3 + 0.2 * k;

    // água: nasce na ponta do regador
    mundo.updateMatrixWorld(true);
    invMundo.copy(mundo.matrixWorld).invert();
    ponta.getWorldPosition(wA);
    baseBico.getWorldPosition(wB);
    lA.copy(wA).applyMatrix4(invMundo);
    lB.copy(wB).applyMatrix4(invMundo);
    dirAgua.copy(lA).sub(lB).normalize();
    const fluxo = M.clamp((k - 0.62) / 0.3, 0, 1);
    acumulo += 110 * fluxo * dt;
    while (acumulo >= 1) {
      acumulo -= 1;
      const v = 1.5 + Math.random() * 0.3;
      emitir(
        lA.x, lA.y, lA.z + (Math.random() - 0.5) * 0.05,
        dirAgua.x * v + (Math.random() - 0.5) * 0.15,
        dirAgua.y * v + (Math.random() - 0.5) * 0.12,
        dirAgua.z * v + (Math.random() - 0.5) * 0.15,
        2, 1
      );
    }

    // física das gotas + respingos + rega das plantas
    for (let i = 0; i < NA; i++) {
      const p = P[i];
      if (p.vivo) {
        p.t += dt;
        p.vy -= 6 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        const noCanteiro = p.x > BX - 0.5 && p.x < BX + 0.5 && Math.abs(p.z) < 1.35;
        const nivel = noCanteiro ? 0.17 : 0.03;
        if (p.y <= nivel || p.t > p.dur) {
          if (p.s >= 1 && p.y <= nivel) {
            for (let n = 0; n < 2; n++) {
              emitir(p.x, nivel + 0.01, p.z, p.vx * 0.12 + (Math.random() - 0.5) * 0.5, 0.7 + Math.random() * 0.8, p.vz * 0.12 + (Math.random() - 0.5) * 0.5, 0.4, 0.5);
            }
            if (noCanteiro) {
              for (let j = 0; j < plantas.length; j++) {
                const d = (p.z - plantas[j].z) / 0.3;
                plantas[j].umido = Math.min(1, plantas[j].umido + 0.035 * Math.exp(-d * d));
              }
            }
          }
          p.vivo = false;
        }
      }
      if (p.vivo) { dummy.position.set(p.x, p.y, p.z); dummy.scale.setScalar(p.s); }
      else { dummy.position.set(0, -10, 0); dummy.scale.setScalar(0.0001); }
      dummy.updateMatrix();
      gotas.setMatrixAt(i, dummy.matrix);
    }
    gotas.instanceMatrix.needsUpdate = true;

    // plantas
    let media = 0;
    plantas.forEach((pl) => {
      pl.umido = Math.max(0, pl.umido - 0.1 * dt);
      media += pl.umido;
      pl.g.scale.setScalar(0.92 + 0.2 * pl.umido);
      const vento = Math.sin(t * 1.6 + pl.fase);
      pl.g.rotation.z = vento * 0.035;
      pl.folhas.forEach((f, idx) => { f.rotation.z = 0.12 + 0.38 * pl.umido + Math.sin(t * 2 + idx + pl.fase) * 0.03; });
      pl.flor.scale.setScalar(0.001 + suave(0.45, 0.85, pl.umido) * 0.999);
      pl.matMonte.color.lerpColors(corSeca, corUmida, pl.umido);
    });
    media /= plantas.length;
    matCanteiro.color.lerpColors(new THREE.Color(0x5b3a22), new THREE.Color(0x35200f), media);

    // sensor
    umidLida += ((38 + 50 * media) - umidLida) * Math.min(1, dt * 1.5);
    const pct = Math.round(umidLida);
    if (pct !== ultimaLeitura) { ultimaLeitura = pct; desenharLeitura(pct); }
    matLed.color.setHSL(0.4, 1, 0.5 + 0.2 * Math.sin(t * 3));
    leitura.position.y = 1.45 + Math.sin(t * 1.5) * 0.02;

    // grama ao vento
    tufos.forEach((tf) => { tf.rotation.z = Math.sin(t * 1.8 + tf.userData.fase) * 0.08; });

    // borboletas
    borboletas.forEach((b) => {
      const [x, y, z] = posBorboleta(b, t);
      const [x2, , z2] = posBorboleta(b, t + 0.05);
      b.g.position.set(x, y, z);
      b.g.rotation.y = Math.atan2(-(z2 - z), x2 - x);
      const bat = 0.15 + (Math.sin(t * 22 + b.fase) * 0.5 + 0.5) * 0.95;
      b.pivos.forEach((w) => { w.pivo.rotation.x = -w.l * bat; });
    });

    // câmera/mundo acompanham o mouse suavemente
    mxS += (mx - mxS) * Math.min(1, dt * 3);
    mundo.rotation.y = -0.25 + mxS * 0.12;
    const ent = Math.min(1, t / 1.6);
    mundo.scale.setScalar(0.92 + 0.08 * (1 - Math.pow(1 - ent, 3)));
  }

  const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ultimo = performance.now();
  function animar() {
    const agora = performance.now();
    const dt = Math.min((agora - ultimo) / 1000, 0.05);
    ultimo = agora;
    atualizar(dt);
    renderer.render(scene, camera);
    if (!parado) requestAnimationFrame(animar);
  }

  if (parado) {
    for (let i = 0; i < 120; i++) atualizar(1 / 30); // quadro estático já "vivo"
  }
  animar();
})();
