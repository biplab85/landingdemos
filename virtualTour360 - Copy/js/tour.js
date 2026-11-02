import * as THREE from 'three';

/* =========================================================================
   TOUR DATA — edit here to update stops, hotspots and content.
   Positions are in the 3D studio's coordinates (metres). x: left(-)/right(+),
   y: height, z: entrance(+) to back wall(-). Hotspot directions are computed
   from these, so moving content only needs new coordinates.
   ========================================================================= */
const SITE = 'https://www.sklentr.com/';
const CONTACT = {
  email: 'info@sklentr.com', phone: '+1 647-997-0557', phoneHref: 'tel:+16479970557',
  address: 'Toronto, Ontario, Canada', calendly: 'https://calendly.com/sklentr', whatsapp: 'https://wa.me/16479970557',
};
const SERVICES = [
  { title: 'Website Design', site: 'Web Development', text: 'Make your offer clear and the next step easy.', pos: [-10.6, 5.6, -6] },
  { title: 'Mobile Apps & MVPs', site: 'Mobile App Development · MVP Development', text: 'Build an app around your users and the tasks they complete. Build a focused first version and learn from real users.', pos: [-10.6, 5.6, -11.4] },
  { title: 'SEO & Marketing', site: 'SEO Services', text: 'Help the right people discover your business.', pos: [-10.6, 5.6, -16.8] },
  { title: 'Paid Ads', site: 'Paid Ads', text: 'Put your offer in front of the right audience.', pos: [-10.6, 2.2, -6] },
  { title: 'Video Editing', site: 'Video Editing', text: 'Turn your footage into content people want to watch.', pos: [-10.6, 2.2, -11.4] },
  { title: 'Business Consultation', site: 'Business Consulting', text: 'Find a practical direction for your business.', pos: [-10.6, 2.2, -16.8] },
];
const PROJECTS = [
  ['KindredCare', 'Healthcare / Elderly care', 'A care marketplace helping families explore caregivers through compatibility information, interview support, and flexible service options.', 'kindredcare'],
  ['GAinData', 'SaaS / Data analytics', 'A data platform combining survey creation, synthetic data tools, and project dashboards for businesses working with limited datasets.', 'gaindata'],
  ['Agile Sourcing', 'Fashion / Sustainable design', 'A fashion platform helping designers explore concepts, publish visual content, and review audience responses before making production decisions.', 'agile-sourcing'],
  ['AI Farming', 'AgriTech', 'An urban-farming platform bringing together growing guidance, plant information, and a neighbourhood marketplace for sharing or selling produce.', 'ai-farming'],
  ['Get Takaful', 'FinTech', 'A digital platform for explaining a community-based Takaful concept and supporting transparent participation and governance workflows.', 'get-takaful'],
  ['RoboReg', 'Regulatory / Pharma', 'A regulatory information management platform designed to help pharmaceutical and medical-device teams organise submission documents and collaborate on shared workflows.', 'roboreg'],
  ['ByTheLook', 'Fashion', 'A fashion shopping platform connecting influencer-curated outfits with customers, with tools for purchasing complete looks and coordinating the supply behind them.', 'bythelook'],
  ['Popup2gether', 'Retail / Events', 'A platform connecting emerging brands with retail spaces and complementary businesses so they can plan shared pop-up experiences.', 'popup2gether'],
  ['MedTouch', 'Healthcare', 'A healthcare information platform designed to bring patient records and connected data into a shared workflow for clinical teams.', 'medtouch'],
  ['Medoptix', 'Pharma / Supply chain', 'A pharmaceutical supply-chain planning platform bringing demand information, vendor evaluation, and regulatory monitoring into one working interface.', 'medoptix'],
  ['KoutuRemix', 'Sustainability / Fashion', 'An upcycling marketplace connecting garment owners with designers and fabric suppliers to explore new uses for existing clothes.', 'kouturemix'],
  ['Navigotech', 'Accessibility / Hardware', 'A digital platform supporting the commercial journey for a wheelchair sensor system, from product demonstrations to installation and customer management.', 'navigotech'],
].map(([name, cat, text, slug], i) => ({ name, cat, text, url: `${SITE}portfolio/${slug}/`, pos: [10.6, 5.4 - Math.floor(i / 6) * 2.9, -4 - (i % 6) * 3.7] }));
const STAGES = [
  { title: 'Discover', text: 'We learn about your business, audience, goals, and current challenges.', pos: [0, 6.25, -32] },
  { title: 'Plan', text: 'After the discussion, we propose the scope, timeline, and price for your approval.', pos: [0, 6.25, -38.5] },
  { title: 'Create', text: 'We deliver the agreed website, mobile app, content, campaign, or MVP, with review points along the way.', pos: [0, 6.25, -45] },
  { title: 'Review', text: 'We assess the work and agree on the next priorities for your business.', pos: [0, 6.25, -51.5] },
];
const TECH = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Laravel', 'Node.js', 'React Native', 'Flutter', 'PostgreSQL', 'WordPress', 'Google Gemini', 'OpenAI', 'Claude'];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const linkBtn = (href, label, primary) => `<a class="pill${primary ? ' primary' : ''}" href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
const contactLinks = () => `<div class="links">${linkBtn(CONTACT.calendly, 'Book a call', true)}${linkBtn('mailto:' + CONTACT.email, CONTACT.email)}${linkBtn(CONTACT.phoneHref, CONTACT.phone)}${linkBtn(CONTACT.whatsapp, 'WhatsApp')}</div>`;

const info = (kicker, title, pos, html) => ({ type: 'info', kicker, title, pos, html });
const STOPS = [
  {
    id: 'reception', file: '01-reception', zone: 'Reception & Welcome', title: 'Welcome to Sklentr', pos: [0, 1.7, 11], yaw: 0, pitch: 4,
    text: 'Marketing. Websites. Mobile apps. Built for you. Start here and follow the green markers through the studio.',
    links: ['services', 'studio', 'portfolio'],
    hotspots: [
      info('Reception', 'Welcome to Sklentr', [0, 4.5, 0.3], `<p><strong>Marketing. Websites. Mobile apps. Built for you.</strong></p><p>We design websites, build mobile apps and MVPs, and support your business with SEO, paid ads, video editing, and consultation.</p><p>This tour walks you through each part of the studio: services, the studio floor, our portfolio, how we work, and how to start a project with us.</p><div class="links">${linkBtn(SITE, 'Visit sklentr.com', true)}</div>`),
      info('Reception', 'How this tour works', [0, 2.3, 5.2], `<ul><li>Drag, swipe or use the arrow keys to look around.</li><li><strong style="color:var(--green)">Green markers</strong> take you to the next area.</li><li><strong style="color:var(--orange)">Orange points</strong> open details about what you are looking at.</li><li>Press <strong>Start tour</strong> for a guided walk-through.</li></ul>`),
    ],
  },
  {
    id: 'services', file: '02-services', zone: 'Services Wall', title: 'What we do', pos: [-7.6, 1.7, -11.4], yaw: -80, pitch: 10, fov: 90,
    text: 'Six service areas covering design, development, marketing, video and consultation. Click a panel for details.',
    links: ['reception', 'studio', 'portfolio'],
    hotspots: SERVICES.map((s, i) => info(`Service 0${i + 1}`, s.title, s.pos, `<span class="meta">${esc(s.site)}</span><p>${esc(s.text)}</p><p>Tell us what you have in mind. We will discuss the work, then prepare a proposal and price.</p>${contactLinks()}`)),
  },
  {
    id: 'studio', file: '03-studio', zone: 'Studio Floor', title: 'Development, design, marketing & creative', pos: [0, 1.7, -14], yaw: 0, pitch: 6,
    text: 'The working floor, grouped by discipline. Each sign marks a studio area.',
    links: ['reception', 'services', 'portfolio', 'discover'],
    hotspots: [
      info('Development Studio', 'Websites, apps & MVPs', [-4.6, 4.3, -9.6], `<p>This area represents our engineering work: websites, mobile applications, MVPs and digital products.</p><p>For an MVP we build a focused first version so you can learn from real users before investing further.</p><div class="chips">${TECH.slice(0, 8).map(t => `<span>${t}</span>`).join('')}</div>`),
      info('Design Studio', 'UI/UX & interface design', [-4.6, 4.3, -18], `<p>Design is where offers become clear and next steps become easy: user flows, interface concepts and design reviews, worked through together with the developers who build them.</p>`),
      info('Digital Marketing Studio', 'SEO, social & paid ads', [4.6, 4.3, -9.6], `<p>Helping the right people discover your business and putting your offer in front of the right audience: SEO, content and social, and paid advertising campaigns.</p>`),
      info('Creative Production', 'Video editing', [4.6, 4.3, -18], `<p>Turning your footage into content people want to watch: promotional videos, social content and product demonstrations.</p>`),
    ],
  },
  {
    id: 'portfolio', file: '04-portfolio', zone: 'Portfolio Gallery', title: 'Selected projects', pos: [7.6, 1.7, -13], yaw: 90, pitch: 8, fov: 95,
    text: 'Twelve projects from the Sklentr portfolio. Click a frame to read about it and open the case study.',
    links: ['reception', 'studio', 'services', 'discover'],
    hotspots: PROJECTS.map(p => info(p.cat, p.name, p.pos, `<p>${esc(p.text)}</p><div class="links">${linkBtn(p.url, 'View case study', true)}${linkBtn(SITE + 'portfolio/', 'All projects')}</div><p class="note">Project description as published on sklentr.com. The frame in the studio is an illustration, not a product screenshot.</p>`)),
  },
  {
    id: 'discover', file: '05-discover-plan', zone: 'Project Planning · Steps 1–2', title: 'Discover → Plan', pos: [0, 1.7, -35.2], yaw: 0, pitch: 16,
    text: 'How every project starts: understanding your business, then agreeing the scope, timeline and price.',
    links: ['studio', 'create'],
    hotspots: STAGES.slice(0, 2).map((s, i) => info(`Workflow · Step ${i + 1}`, s.title, s.pos, `<p>${esc(s.text)}</p>${stageList(i)}`)),
  },
  {
    id: 'create', file: '06-create-review', zone: 'Project Planning · Steps 3–4', title: 'Create → Review', pos: [0, 1.7, -48.2], yaw: 0, pitch: 14,
    text: 'Delivering the agreed scope with review points, then deciding the next priorities together.',
    links: ['discover', 'consultation'],
    hotspots: STAGES.slice(2).map((s, i) => info(`Workflow · Step ${i + 3}`, s.title, s.pos, `<p>${esc(s.text)}</p>${stageList(i + 2)}`)),
  },
  {
    id: 'consultation', file: '07-consultation', zone: 'Client Consultation Room', title: 'Let’s discuss your project', pos: [0, 1.7, -56.5], yaw: -20, pitch: 0,
    text: 'Project discovery, business consultation and scope planning happen here.',
    links: ['create', 'contact'],
    hotspots: [
      info('Consultation', 'Client Consultation Room', [-10.6, 4.2, -60], `<p>A small task, a new website, a mobile app, or ongoing marketing. Tell us what you have in mind. We will discuss the work, then prepare a proposal and price.</p>${contactLinks()}`),
      info('Consultation', 'Business consultation', [0, 1.1, -61], `<p>Find a practical direction for your business. Consultation sessions cover discovery, priorities and scope planning before any build begins.</p><div class="links">${linkBtn(CONTACT.calendly, 'Book a consultation', true)}</div>`),
    ],
  },
  {
    id: 'contact', file: '08-contact', zone: 'Contact & Technology', title: 'Start your project', pos: [0, 1.7, -66.5], yaw: -40, pitch: 4, fov: 90,
    text: 'Reach the team, book a call, and see the technologies we build with.',
    links: ['consultation', 'reception'],
    hotspots: [
      info('Contact', 'Let’s talk about your project', [-10.6, 4.2, -67.5], `<ul><li>Email: <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li><li>Phone: <a href="${CONTACT.phoneHref}">${CONTACT.phone}</a></li><li>${CONTACT.address}</li></ul>${contactLinks()}`),
      info('Technology Showcase', 'The stack we build with', [10.6, 4.2, -62], `<p>Technologies listed on sklentr.com:</p><div class="chips">${TECH.map(t => `<span>${t}</span>`).join('')}</div>`),
      info('Sklentr', 'sklentr.com', [0, 5, -71.6], `<p>Websites · Apps & MVPs · SEO & Marketing · Paid Ads · Video · Consultation</p><div class="links">${linkBtn(SITE, 'Visit sklentr.com', true)}${linkBtn(SITE + 'portfolio/', 'Portfolio')}</div>`),
    ],
  },
];
function stageList(active) {
  return `<ul>${STAGES.map((s, i) => `<li style="${i === active ? 'color:var(--green);font-weight:600' : ''}">${i + 1}. ${s.title}</li>`).join('')}</ul>`;
}
const byId = Object.fromEntries(STOPS.map((s, i) => [s.id, { ...s, index: i }]));
STOPS.forEach((s, i) => (s.index = i));

/* ========================= renderer & panorama ========================= */
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const RES = renderer.capabilities.maxTextureSize >= 8192 && Math.max(screen.width, screen.height) * devicePixelRatio > 1400 ? '8k' : '4k';

// Equirect sampling that matches how the panoramas were rendered (three.js convention:
// u = atan(d.z, d.x) / 2π + 0.5, v = asin(d.y) / π + 0.5).
const panoShader = {
  vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D map; uniform float opacity; varying vec3 vDir; const float PI = 3.141592653589793;
    void main(){ vec3 d = normalize(vDir); vec2 uv = vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5);
      gl_FragColor = vec4(texture2D(map, uv).rgb, opacity); }`,
};
function makeSphere(r) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 96, 64), new THREE.ShaderMaterial({
    ...panoShader, uniforms: { map: { value: null }, opacity: { value: 1 } }, side: THREE.BackSide, transparent: true, depthWrite: false, depthTest: false,
  }));
  scene.add(m); return m;
}
const sphereA = makeSphere(100), sphereB = makeSphere(90);
sphereB.renderOrder = 1; sphereB.visible = false;

const loader = new THREE.TextureLoader();
const texCache = new Map();
function loadPano(stop) {
  if (texCache.has(stop.id)) return texCache.get(stop.id);
  const p = new Promise((res, rej) => loader.load(`images/panos/${RES}/${stop.file}.jpg`, t => {
    t.colorSpace = THREE.NoColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy(); renderer.initTexture(t); res(t);
  }, undefined, rej));
  texCache.set(stop.id, p); return p;
}

/* ========================= view state & controls ========================= */
const view = { yaw: 0, pitch: 0, fov: 75, tYaw: 0, tPitch: 0, tFov: 75 };
const FOV_MIN = 30, FOV_MAX = 95;
let autoRotate = false, lastInteract = performance.now();
const keys = new Set();
const pointers = new Map();
let pinchDist = 0;

function interacted() { lastInteract = performance.now(); if (tour.on) stopTour(); }
stage.addEventListener('pointerdown', e => {
  stage.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  stage.classList.add('dragging'); interacted();
  if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinchDist = Math.hypot(a.x - b.x, a.y - b.y); }
});
stage.addEventListener('pointermove', e => {
  const p = pointers.get(e.pointerId); if (!p) return;
  if (pointers.size === 1) {
    const k = view.fov / stage.clientHeight;
    view.tYaw -= (e.clientX - p.x) * k; view.tPitch += (e.clientY - p.y) * k;
  } else if (pointers.size === 2) {
    p.x = e.clientX; p.y = e.clientY;
    const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinchDist) view.tFov *= pinchDist / d; pinchDist = d; return;
  }
  p.x = e.clientX; p.y = e.clientY;
});
const endPointer = e => { pointers.delete(e.pointerId); pinchDist = 0; if (!pointers.size) stage.classList.remove('dragging'); };
stage.addEventListener('pointerup', endPointer); stage.addEventListener('pointercancel', endPointer);
stage.addEventListener('wheel', e => { e.preventDefault(); view.tFov += e.deltaY * 0.04; interacted(); }, { passive: false });

addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input, textarea')) return;
  const k = e.key.toLowerCase();
  if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's', '+', '=', '-', '_'].includes(k)) { keys.add(k); interacted(); e.preventDefault(); return; }
  if (k === 'escape') { closeDrawer(); hideHelp(); return; }
  if (!intro.classList.contains('hide')) { if (k === 'enter' || k === ' ') { e.preventDefault(); startFromIntro(true); } return; }
  if (k === ' ') { e.preventDefault(); tour.on ? stopTour() : startTour(); }
  else if (k === ']' || k === 'pagedown') go(STOPS[(current.index + 1) % STOPS.length].id);
  else if (k === '[' || k === 'pageup') go(STOPS[(current.index - 1 + STOPS.length) % STOPS.length].id);
  else if (k >= '1' && k <= String(STOPS.length)) go(STOPS[+k - 1].id);
  else if (k === 'h') go('reception');
  else if (k === 'm') toggleMap();
  else if (k === 'f') toggleFull();
  else if (k === 'r') toggleRotate();
  else if (k === '?' || k === '/') showHelp();
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());

/* ========================= hotspots ========================= */
const hsLayer = document.getElementById('hotspots');
let hsItems = [];
const ICON_INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="#f3b351" stroke-width="2.6" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg>';
const ICON_NAV = '<svg viewBox="0 0 24 24" fill="none" stroke="#1eff85" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
function dirTo(from, to) { return new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]).normalize(); }
function buildHotspots(stop) {
  hsLayer.innerHTML = ''; hsItems = [];
  const add = (el, dir) => { hsLayer.appendChild(el); hsItems.push({ el, dir }); };
  stop.hotspots.forEach(h => {
    const el = document.createElement('button');
    el.className = 'hs info'; el.setAttribute('aria-label', `${h.title}: more information`);
    el.innerHTML = `<span class="dot">${ICON_INFO}</span><span class="tag">${esc(h.title)}</span>`;
    el.addEventListener('click', e => { e.stopPropagation(); openDrawer(h); });
    add(el, dirTo(stop.pos, h.pos));
  });
  stop.links.forEach(id => {
    const t = byId[id];
    const el = document.createElement('button');
    el.className = 'hs nav'; el.setAttribute('aria-label', `Go to ${t.zone}`);
    el.innerHTML = `<span class="dot">${ICON_NAV}</span><span class="tag">${t.index + 1} · ${esc(t.zone)}</span>`;
    el.addEventListener('click', e => { e.stopPropagation(); go(id); });
    const target = [t.pos[0], 0.35, t.pos[2]];
    add(el, dirTo(stop.pos, target));
  });
}
const tmpV = new THREE.Vector3();
function placeHotspots() {
  const w = stage.clientWidth, h = stage.clientHeight;
  for (const { el, dir } of hsItems) {
    tmpV.copy(dir).multiplyScalar(50).project(camera);
    const visible = tmpV.z < 1 && Math.abs(tmpV.x) < 1.2 && Math.abs(tmpV.y) < 1.2 && !transition.active;
    el.hidden = !visible;
    if (visible) el.style.transform = `translate(${((tmpV.x + 1) / 2) * w}px, ${((1 - tmpV.y) / 2) * h}px) translate(-50%, -50%)`;
  }
}

/* ========================= navigation & transitions ========================= */
let current = null;
const transition = { active: false, t: 0 };
async function go(id, opts = {}) {
  const stop = byId[id]; if (!stop || (current && current.id === id && !opts.force) || transition.active) return;
  closeDrawer();
  const tex = await loadPano(stop);
  const prev = current; current = stop;
  updateUI(stop);
  if (!prev) {
    sphereA.material.uniforms.map.value = tex;
    setView(stop.yaw, stop.pitch, stop.fov || 75, true);
  } else {
    // turn toward the destination, then cross-fade with a slight zoom
    const d = dirTo(prev.pos, stop.pos);
    view.tYaw = nearestAngle(view.yaw, THREE.MathUtils.radToDeg(Math.atan2(d.x, -d.z))); view.tPitch = 0;
    sphereB.material.uniforms.map.value = tex; sphereB.material.uniforms.opacity.value = 0; sphereB.visible = true;
    transition.active = true; transition.t = 0; transition.fromFov = view.fov;
    transition.done = () => {
      sphereA.material.uniforms.map.value = tex; sphereB.visible = false; transition.active = false;
      setView(stop.yaw, stop.pitch, stop.fov || 75, false);
    };
  }
  buildHotspots(stop);
  if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
  stop.links.forEach(l => loadPano(byId[l]).catch(() => {}));
  const next = STOPS[(stop.index + 1) % STOPS.length]; loadPano(next).catch(() => {});
}
function nearestAngle(from, to) { let d = ((to - from + 540) % 360) - 180; return from + d; }
function setView(yaw, pitch, fov, snap) {
  view.tYaw = nearestAngle(view.yaw, yaw); view.tPitch = pitch; view.tFov = fov;
  if (snap) { view.yaw = view.tYaw; view.pitch = pitch; view.fov = fov; }
}

/* ========================= guided tour ========================= */
const STOP_SECONDS = 12;
const tour = { on: false, t: 0 };
function startTour() {
  tour.on = true; tour.t = 0; autoRotate = false; syncButtons();
  if (current.index === STOPS.length - 1) go(STOPS[0].id);
  toast('Guided tour started. Drag or press Space to pause.');
}
function stopTour() { if (!tour.on) return; tour.on = false; syncButtons(); document.getElementById('prog').style.width = '0'; }
function tickTour(dt) {
  if (!tour.on || transition.active) return;
  tour.t += dt;
  view.tYaw += dt * 6; // slow pan while presenting
  document.getElementById('prog').style.width = Math.min(100, (tour.t / STOP_SECONDS) * 100) + '%';
  if (tour.t >= STOP_SECONDS) {
    tour.t = 0;
    if (current.index < STOPS.length - 1) go(STOPS[current.index + 1].id);
    else { stopTour(); openDrawer(byId.contact.hotspots[0]); }
  }
}

/* ========================= UI ========================= */
const $ = id => document.getElementById(id);
const intro = $('intro'), help = $('help'), drawer = $('drawer');
function updateUI(stop) {
  $('capNum').textContent = stop.index + 1;
  $('capZone').textContent = stop.zone;
  $('capTitle').textContent = stop.title;
  $('capText').textContent = stop.text;
  $('mapLabel').textContent = `${stop.index + 1}. ${stop.zone}`;
  document.querySelectorAll('.thumb').forEach((t, i) => { t.classList.toggle('active', i === stop.index); if (i === stop.index) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
  document.querySelectorAll('.map .pt').forEach((p, i) => p.classList.toggle('active', i === stop.index));
  const at = document.querySelector('.thumb.active'); if (at) at.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}
function openDrawer(h) {
  $('drKicker').textContent = h.kicker; $('drTitle').textContent = h.title; $('drBody').innerHTML = h.html;
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); $('drClose').focus({ preventScroll: true });
}
function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
function showHelp() { help.classList.remove('hide'); $('helpClose').focus(); }
function hideHelp() { help.classList.add('hide'); }
function toggleMap() {
  const m = $('map'); m.classList.toggle('closed');
  $('btnMap').setAttribute('aria-expanded', String(!m.classList.contains('closed')));
}
function toggleFull() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => toast('Fullscreen is not available here'));
  else document.exitFullscreen?.();
}
function toggleRotate() { autoRotate = !autoRotate; if (autoRotate) stopTour(); syncButtons(); }
function syncButtons() {
  $('btnRotate').setAttribute('aria-pressed', String(autoRotate));
  $('btnFull').setAttribute('aria-pressed', String(!!document.fullscreenElement));
  $('lblTour').textContent = tour.on ? 'Pause tour' : 'Start tour';
  $('icoTour').innerHTML = tour.on ? '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
}
let toastTimer;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }

// thumbnails
STOPS.forEach((s, i) => {
  const b = document.createElement('button'); b.className = 'thumb'; b.setAttribute('role', 'listitem');
  b.innerHTML = `<img src="images/thumbs/${s.file}.jpg" alt="" loading="lazy"><span>${i + 1}. ${esc(s.zone)}</span>`;
  b.addEventListener('click', () => { stopTour(); go(s.id); });
  $('thumbs').appendChild(b);
});

// floor plan (top-down: entrance on the left, back wall on the right)
(function buildMap() {
  const svg = $('mapSvg'), W = 360, H = 96, Z0 = 24, L = 96, HW = 22, pad = 4;
  const mx = z => pad + ((Z0 - z) / L) * (W - pad * 2), my = x => pad + ((x + HW / 2) / HW) * (H - pad * 2);
  const ns = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent = svg) => { const n = document.createElementNS(ns, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };
  el('rect', { x: pad, y: pad, width: W - pad * 2, height: H - pad * 2, rx: 6, fill: '#0e1218', stroke: 'rgba(255,255,255,.25)', 'stroke-width': 1.2 });
  el('rect', { x: mx(0) - 1, y: my(-6.5), width: 3, height: my(6.5) - my(-6.5), fill: '#f3b351' }); // logo wall
  el('path', { d: `M${mx(5.2)} ${my(-3)} A 9 14 0 0 1 ${mx(5.2)} ${my(3)}`, fill: 'none', stroke: '#e8e4dc', 'stroke-width': 2 }); // desk
  for (let r = 0; r < 4; r++) for (const x of [-4.6, 4.6]) el('rect', { x: mx(-8 - r * 4.2 + 0.6), y: my(x - 1.3), width: mx(-8 - r * 4.2 - 2.1) - mx(-8 - r * 4.2 + 0.6), height: my(x + 1.3) - my(x - 1.3), fill: '#27303b', rx: 1 });
  el('line', { x1: mx(-6 + 2.4), y1: my(-10.7), x2: mx(-16.8 - 2.4), y2: my(-10.7), stroke: '#f3b351', 'stroke-width': 3 }); // services wall
  el('line', { x1: mx(-4 + 1.6), y1: my(10.7), x2: mx(-22.5 - 1.6), y2: my(10.7), stroke: '#1eff85', 'stroke-width': 3 }); // portfolio wall
  [-32, -38.5, -45, -51.5].forEach((z, i) => el('line', { x1: mx(z), y1: my(-5.2), x2: mx(z), y2: my(5.2), stroke: i % 2 ? '#1eff85' : '#f3b351', 'stroke-width': 1.6, 'stroke-dasharray': '2 2' }));
  el('circle', { cx: mx(-61), cy: my(0), r: 9, fill: 'none', stroke: '#f3b351', 'stroke-width': 1.2 });
  el('rect', { x: mx(-72) - 3, y: my(-6), width: 3, height: my(6) - my(-6), fill: '#f3b351' }); // end logo wall
  const cone = el('path', { d: 'M0 0 L26 -11 A 28 28 0 0 1 26 11 Z', fill: 'rgba(30,255,133,.22)', stroke: 'none' });
  STOPS.forEach((s, i) => {
    const g = el('g', { class: 'pt', tabindex: 0, role: 'button', 'aria-label': `Stop ${i + 1}: ${s.zone}` });
    el('title', {}, g).textContent = `${i + 1}. ${s.zone}`;
    el('circle', { class: 'bg', cx: mx(s.pos[2]), cy: my(s.pos[0]), r: 8 }, g);
    el('text', { x: mx(s.pos[2]), y: my(s.pos[0]) + 0.5 }, g).textContent = i + 1;
    const goTo = () => { stopTour(); go(s.id); };
    g.addEventListener('click', goTo); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(); } });
  });
  svg.insertBefore(cone, svg.querySelector('.pt'));
  window.__updateCone = () => {
    if (!current) return;
    // world yaw 0 looks toward -z, which is +x on this map; yaw +90 (toward +x) is +y on the map
    cone.setAttribute('transform', `translate(${mx(current.pos[2])} ${my(current.pos[0])}) rotate(${view.yaw})`);
  };
})();

// buttons
$('btnHome').onclick = () => { stopTour(); go('reception'); };
$('btnHelp').onclick = showHelp;
$('helpClose').onclick = hideHelp;
help.addEventListener('click', e => { if (e.target === help) hideHelp(); });
$('btnFull').onclick = toggleFull;
document.addEventListener('fullscreenchange', syncButtons);
$('btnRotate').onclick = toggleRotate;
$('btnMap').onclick = toggleMap;
$('btnPrev').onclick = () => { stopTour(); go(STOPS[(current.index - 1 + STOPS.length) % STOPS.length].id); };
$('btnNext').onclick = () => { stopTour(); go(STOPS[(current.index + 1) % STOPS.length].id); };
$('btnTour').onclick = () => (tour.on ? stopTour() : startTour());
$('btnThumbs').onclick = () => { const c = $('bottom').classList.toggle('compact'); $('btnThumbs').setAttribute('aria-pressed', String(!c)); };
$('drClose').onclick = closeDrawer;
if (matchMedia('(max-width: 760px)').matches) { toggleMap(); $('bottom').classList.add('compact'); $('btnThumbs').setAttribute('aria-pressed', 'false'); }

function startFromIntro(withTour) {
  if (!current) return;
  intro.classList.add('hide'); autoRotate = false; syncButtons();
  setView(current.yaw, current.pitch, current.fov || 75, false);
  if (withTour) startTour();
}
$('introTour').onclick = () => startFromIntro(true);
$('introFree').onclick = () => startFromIntro(false);

/* ========================= loop ========================= */
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 0.1);
  // keyboard
  const kspd = 70 * dt * (view.fov / 75);
  if (keys.has('arrowleft') || keys.has('a')) view.tYaw -= kspd;
  if (keys.has('arrowright') || keys.has('d')) view.tYaw += kspd;
  if (keys.has('arrowup') || keys.has('w')) view.tPitch += kspd;
  if (keys.has('arrowdown') || keys.has('s')) view.tPitch -= kspd;
  if (keys.has('+') || keys.has('=')) view.tFov -= 40 * dt;
  if (keys.has('-') || keys.has('_')) view.tFov += 40 * dt;
  // idle drift on the intro screen / auto-rotate
  if (!intro.classList.contains('hide') || autoRotate) view.tYaw += dt * 4;
  tickTour(dt);

  view.tPitch = THREE.MathUtils.clamp(view.tPitch, -85, 85);
  view.tFov = THREE.MathUtils.clamp(view.tFov, FOV_MIN, FOV_MAX);
  const s = 1 - Math.pow(0.0008, dt);
  view.yaw += (view.tYaw - view.yaw) * s; view.pitch += (view.tPitch - view.pitch) * s; view.fov += (view.tFov - view.fov) * s;

  if (transition.active) {
    transition.t += dt / 0.9;
    const t = Math.min(transition.t, 1), e = t * t * (3 - 2 * t);
    sphereB.material.uniforms.opacity.value = e;
    camera.fov = view.fov - 22 * Math.sin(Math.PI * Math.min(1, t * 1.1)) * (1 - e * 0.6);
    if (t >= 1) transition.done();
  } else camera.fov = view.fov;
  camera.updateProjectionMatrix();

  const y = THREE.MathUtils.degToRad(view.yaw), p = THREE.MathUtils.degToRad(view.pitch);
  camera.lookAt(Math.cos(p) * Math.sin(y), Math.sin(p), -Math.cos(p) * Math.cos(y));
  renderer.render(scene, camera);
  placeHotspots();
  window.__updateCone();
  requestAnimationFrame(frame);
}

const startId = byId[location.hash.slice(1)] ? location.hash.slice(1) : 'reception';
go(startId).then(() => {
  $('loading').innerHTML = '<span style="color:var(--green)">●</span><span>Ready. Press Enter to start the tour.</span>';
  frame();
}).catch(() => { $('loading').textContent = 'The studio images could not be loaded. Please check the images folder.'; });
