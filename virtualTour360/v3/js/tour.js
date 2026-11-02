import * as THREE from 'three';

/* =========================================================================
   TOUR DATA. Edit this section to update rooms, hotspots and content.

   Every room has a photo (images/scenes/…) and can have a 360° panorama
   (images/panoramas/<file>.jpg, 2:1 equirectangular). When the panorama file
   exists it is used automatically; otherwise the photo is shown.

   Hotspot positions use image coordinates: u = 0 (left) … 1 (right),
   v = 0 (top) … 1 (bottom).
   - `u, v`   position on the photo
   - `pano`   per-room settings for the 360° image:
       view:  { u, v }               where the visitor looks first
       spots: [[u, v], …]            one entry per hotspot, same order as `hotspots`
       logo:  { u, v, width }        optional crisp Sklentr logo on a wall (width in degrees)
   Open the page with ?edit to click on a panorama and copy exact u/v values.
   ========================================================================= */
const SITE = 'https://www.sklentr.com/';
const CONTACT = {
  email: 'info@sklentr.com', phone: '+1 647-997-0557', phoneHref: 'tel:+16479970557',
  address: 'Toronto, Ontario, Canada', calendly: 'https://calendly.com/sklentr', whatsapp: 'https://wa.me/16479970557',
};
const SERVICES = [
  ['Website Design', 'Web Development', 'Make your offer clear and the next step easy.'],
  ['Mobile Apps & MVPs', 'Mobile App · MVP Development', 'Build an app around your users and the tasks they complete. Build a focused first version and learn from real users.'],
  ['SEO & Marketing', 'SEO Services', 'Help the right people discover your business.'],
  ['Paid Ads', 'Paid Ads', 'Put your offer in front of the right audience.'],
  ['Video Editing', 'Video Editing', 'Turn your footage into content people want to watch.'],
  ['Business Consultation', 'Business Consulting', 'Find a practical direction for your business.'],
];
const PROJECTS = [
  ['KindredCare', 'Healthcare', 'A care marketplace helping families explore caregivers through compatibility information, interview support, and flexible service options.', 'kindredcare'],
  ['GAinData', 'SaaS · Data', 'A data platform combining survey creation, synthetic data tools, and project dashboards for businesses working with limited datasets.', 'gaindata'],
  ['Agile Sourcing', 'Fashion', 'A fashion platform helping designers explore concepts, publish visual content, and review audience responses before making production decisions.', 'agile-sourcing'],
  ['AI Farming', 'AgriTech', 'An urban-farming platform bringing together growing guidance, plant information, and a neighbourhood marketplace for sharing or selling produce.', 'ai-farming'],
  ['Get Takaful', 'FinTech', 'A digital platform for explaining a community-based Takaful concept and supporting transparent participation and governance workflows.', 'get-takaful'],
  ['RoboReg', 'Regulatory', 'A regulatory information management platform designed to help pharmaceutical and medical-device teams organise submission documents and collaborate on shared workflows.', 'roboreg'],
  ['ByTheLook', 'Fashion', 'A fashion shopping platform connecting influencer-curated outfits with customers, with tools for purchasing complete looks and coordinating the supply behind them.', 'bythelook'],
  ['Popup2gether', 'Retail', 'A platform connecting emerging brands with retail spaces and complementary businesses so they can plan shared pop-up experiences.', 'popup2gether'],
  ['MedTouch', 'Healthcare', 'A healthcare information platform designed to bring patient records and connected data into a shared workflow for clinical teams.', 'medtouch'],
  ['Medoptix', 'Pharma', 'A pharmaceutical supply-chain planning platform bringing demand information, vendor evaluation, and regulatory monitoring into one working interface.', 'medoptix'],
  ['KoutuRemix', 'Sustainability', 'An upcycling marketplace connecting garment owners with designers and fabric suppliers to explore new uses for existing clothes.', 'kouturemix'],
  ['Navigotech', 'Accessibility', 'A digital platform supporting the commercial journey for a wheelchair sensor system, from product demonstrations to installation and customer management.', 'navigotech'],
];
const STAGES = [
  ['Discover', 'We learn about your business, audience, goals, and current challenges.'],
  ['Plan', 'After the discussion, we propose the scope, timeline, and price for your approval.'],
  ['Create', 'We deliver the agreed website, mobile app, content, campaign, or MVP, with review points along the way.'],
  ['Review', 'We assess the work and agree on the next priorities for your business.'],
];
const TECH = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Laravel', 'Node.js', 'React Native', 'Flutter', 'PostgreSQL', 'WordPress', 'Google Gemini', 'OpenAI', 'Claude'];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cta = (href, label, ghost) => `<a class="cta sm${ghost ? ' ghost' : ''}" href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
const contactLinks = () => `<div class="links">${cta(CONTACT.calendly, 'Book a call')}${cta('mailto:' + CONTACT.email, 'Email', true)}${cta(CONTACT.whatsapp, 'WhatsApp', true)}</div>`;
const service = i => { const [, site, text] = SERVICES[i]; return `<div class="tag">${esc(site)}</div><p class="lead">${esc(text)}</p><p>Tell us what you have in mind. We will discuss the work, then prepare a proposal and price.</p>${contactLinks()}`; };
const steps = active => `<ol class="steps">${STAGES.map(([t, d], i) => `<li class="${i === active ? 'on' : ''}"><b>${t}</b><span>${esc(d)}</span></li>`).join('')}</ol>`;
const info = (u, v, kicker, title, html) => ({ kind: 'info', u, v, kicker, title, html });
const nav = (u, v, to) => ({ kind: 'nav', u, v, to });

// v3: every room is a genuine 360° panorama rendered from the 3D Sklentr office.
// Hotspots are placed by their real position in the office (metres), so they line up exactly.
const at = (x, y, z) => [x, y, z];
const spot = (pos, kicker, title, html) => ({ kind: 'info', at: pos, kicker, title, html });
const walk = (to, pos) => ({ kind: 'nav', to, at: pos });
const projectCards = `<div class="cards">${PROJECTS.map(([n, c, d, slug]) => `<a class="card" href="${SITE}portfolio/${slug}/" target="_blank" rel="noopener"><small>${esc(c)}</small><b>${esc(n)}</b><span>${esc(d)}</span></a>`).join('')}</div><div class="links">${cta(SITE + 'portfolio/', 'Full portfolio')}</div><p class="note">Descriptions as published on sklentr.com.</p>`;

const ROOMS = [
  {
    id: 'entrance', file: '01-entrance', pos: at(0, 1.6, 10.6), look: at(0, 2.0, 4.3), zone: 'Main entrance', title: 'Welcome to Sklentr',
    text: 'Marketing. Websites. Mobile apps. Built for you.',
    hotspots: [
      spot(at(0, 2.25, 4.3), 'Welcome', 'Welcome to Sklentr', `<p class="lead">Marketing. Websites. Mobile apps. Built for you.</p><p>We design websites, build mobile apps and MVPs, and support your business with SEO, paid ads, video editing, and consultation.</p><p>Follow the gold arrows to walk through the studio, or choose <b>Begin tour</b>.</p><div class="links">${cta(SITE, 'Visit sklentr.com')}</div>`),
      spot(at(-3.3, 0.9, 9.6), 'Waiting lounge', 'Our services', `<div class="cards">${SERVICES.map(([t, , d]) => `<div class="card"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div>${contactLinks()}`),
      walk('reception', at(2.2, 0.3, 7.9)),
    ],
  },
  {
    id: 'reception', file: '02-reception', pos: at(2.2, 1.6, 7.9), look: at(0, 1.6, 4.3), zone: 'Reception', title: 'Reception & waiting area',
    text: 'Our front desk, the Sklentr wall and a lounge for visitors.',
    hotspots: [
      spot(at(-0.2, 1.3, 4.7), 'Front desk', 'How the tour works', `<ul><li>Drag, swipe or use the arrow keys to look around — up, down and all the way round.</li><li><b>Gold arrows</b> walk you to the next room.</li><li><b>Glowing points</b> open details about what you are looking at.</li><li>Open <b>Rooms</b> at the top right to jump anywhere.</li></ul>`),
      walk('hallway', at(0, 0.3, 2.0)),
      walk('cafe', at(-13, 0.3, 7.6)),
      walk('design', at(11.4, 0.3, 8.4)),
      walk('entrance', at(0, 0.3, 10.6)),
    ],
  },
  {
    id: 'hallway', file: '03-hallway', pos: at(0, 1.6, 2.0), look: at(0, 1.5, -4), zone: 'Main hallway', title: 'The heart of the studio',
    text: 'Development teams to each side, meeting rooms and the CEO office ahead.',
    hotspots: [
      spot(at(0, 2.3, 4.0), 'About', 'Who we are', `<p class="lead">A digital agency combining development, design, marketing, creative production and business consultation.</p><p>Websites, mobile apps and MVPs, SEO and paid ads, video editing and consultation — under one roof.</p>`),
      spot(at(-16, 2.6, 3.98), 'Portfolio', 'Selected projects', projectCards),
      walk('web', at(-10.3, 0.3, -1)),
      walk('mobile', at(10.3, 0.3, -1)),
      walk('collab', at(0.6, 0.3, -1.9)),
      walk('reception', at(2.2, 0.3, 7.9)),
    ],
  },
  {
    id: 'web', file: '04-web-dev', pos: at(-13.0, 1.6, -5.8), look: at(-17, 1.2, -3), zone: 'Web development team', title: 'Web development',
    text: 'Developers building websites and web applications.',
    hotspots: [
      spot(at(-15.5, 1.15, -3.25), 'Service 01', 'Website Design & Development', service(0)),
      spot(at(-19.7, 1.75, -6), 'Technology', 'The stack we build with', `<p>Technologies listed on sklentr.com.</p><div class="chips">${TECH.map(t => `<span>${t}</span>`).join('')}</div>`),
      spot(at(-8.7, 1.5, -5.9), 'Code review', 'How we build', `<p class="lead">Clean, maintainable code, reviewed together before it ships.</p>${steps(2)}`),
      walk('hallway', at(-10.3, 0.3, 0.5)),
      walk('meeting', at(-1.6, 0.3, -6.3)),
    ],
  },
  {
    id: 'mobile', file: '05-mobile-dev', pos: at(13.6, 1.6, -5.8), look: at(19, 1.2, -6), zone: 'Mobile app team', title: 'Mobile app development',
    text: 'Android and iOS apps, built and tested on real devices.',
    hotspots: [
      spot(at(19.2, 1.05, -6), 'Service 02', 'Mobile Apps & MVPs', service(1)),
      spot(at(7.1, 1.75, -8.6), 'Interface design', 'UI/UX for apps', `<p class="lead">Interfaces designed around your users and the tasks they complete.</p><p>Screens are prototyped, reviewed and tested on devices before release.</p>`),
      walk('hallway', at(10.3, 0.3, 0.5)),
      walk('collab', at(0.6, 0.3, -1.9)),
    ],
  },
  {
    id: 'meeting', file: '06-meeting', pos: at(-1.6, 1.6, -6.3), look: at(-3.5, 1.0, -8.6), zone: 'Meeting room', title: 'Team meeting in progress',
    text: 'Where projects are planned, reviewed and agreed.',
    hotspots: [
      spot(at(-0.15, 1.7, -8.6), 'How we work', 'Discover → Plan → Create → Review', steps(-1)),
      spot(at(-3.5, 0.85, -8.6), 'Consultation', 'Tell us what you have in mind', `<p class="lead">A small task, a new website, a mobile app, or ongoing marketing.</p><p>We will discuss the work, then prepare a proposal and price.</p>${contactLinks()}`),
      walk('ceo', at(1.3, 0.3, -7.9)),
      walk('collab', at(0.6, 0.3, -1.9)),
    ],
  },
  {
    id: 'ceo', file: '07-ceo-office', pos: at(1.3, 1.6, -7.9), look: at(3.6, 1.0, -9.8), zone: 'CEO office', title: 'The CEO’s office',
    text: 'Strategy, partnerships and business consultation.',
    hotspots: [
      spot(at(3.6, 0.85, -9.3), 'Service 06', 'Business Consultation', service(5)),
      spot(at(6.7, 1.6, -8.8), 'Our approach', 'Practical direction', `<p class="lead">Find a practical direction for your business.</p>${steps(0)}`),
      walk('meeting', at(-1.6, 0.3, -6.3)),
      walk('collab', at(0.6, 0.3, -1.9)),
    ],
  },
  {
    id: 'collab', file: '08-collaboration', pos: at(0.6, 1.6, -1.9), look: at(3.2, 1.4, -4.7), zone: 'Collaboration area', title: 'Ideas, reviews & problem solving',
    text: 'Where designers, developers and marketers work things out together.',
    hotspots: [
      spot(at(3.2, 1.55, -4.7), 'Workflow', 'From idea to delivery', steps(-1)),
      spot(at(-4.3, 1.0, -3.4), 'Service 03', 'SEO & Marketing', service(2)),
      spot(at(5.6, 1.2, -1.6), 'Service 04', 'Paid Ads', service(3)),
      walk('meeting', at(-1.6, 0.3, -6.3)),
      walk('ceo', at(1.3, 0.3, -7.9)),
      walk('hallway', at(0, 0.3, 2.0)),
    ],
  },
  {
    id: 'design', file: '09-design-pm', pos: at(11.4, 1.6, 8.4), look: at(9, 1.0, 7.2), zone: 'Design & project management', title: 'Design & delivery',
    text: 'UI/UX designers and project managers keeping work on track.',
    hotspots: [
      spot(at(9, 1.2, 7.0), 'Design studio', 'UI/UX design', `<p class="lead">User flows, interface concepts and design reviews, worked through with the developers who build them.</p><p>The goal: make your offer clear and the next step easy.</p>`),
      spot(at(19.7, 1.6, 8), 'Project management', 'Scope, timeline & reviews', steps(1)),
      spot(at(15.4, 1.1, 9.6), 'Service 05', 'Video Editing', service(4)),
      walk('reception', at(2.2, 0.3, 7.9)),
      walk('hallway', at(0, 0.3, 2.0)),
    ],
  },
  {
    id: 'cafe', file: '10-cafe', pos: at(-13, 1.6, 7.6), look: at(-13, 1.2, 10.8), zone: 'Studio café', title: 'Start your project',
    text: 'Grab a coffee and let’s talk about what you want to build.',
    hotspots: [
      spot(at(-13, 1.25, 10.6), 'Contact', 'Let’s talk', `<ul><li>Email · <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li><li>Phone · <a href="${CONTACT.phoneHref}">${CONTACT.phone}</a></li><li>${CONTACT.address}</li></ul>${contactLinks()}`),
      spot(at(-16.5, 0.9, 6.6), 'Book', 'Book a consultation', `<p class="lead">Pick a time that suits you and we will talk through your project.</p><div class="links">${cta(CONTACT.calendly, 'Open calendar')}</div>`),
      walk('reception', at(2.2, 0.3, 7.9)),
      walk('hallway', at(0, 0.3, 2.0)),
    ],
  },
];
ROOMS.forEach((r, i) => (r.index = i));
// direction in the panorama from this room's camera to a point in the office
function worldUV(from, to) {
  const d = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]).normalize();
  return [((Math.atan2(d.z, d.x) / (2 * Math.PI) + 0.5) + 1) % 1, 0.5 - Math.asin(d.y) / Math.PI];
}

const byId = Object.fromEntries(ROOMS.map(r => [r.id, r]));
const EDIT = new URLSearchParams(location.search).has('edit');

/* ========================= sound ========================= */
// Soft UI sounds synthesised with Web Audio, so no audio files are needed.
const sound = (() => {
  let ctx = null, on = true;
  try { on = localStorage.getItem('sklentr-tour-sound') !== 'off'; } catch {}
  const ensure = () => { if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); } if (ctx?.state === 'suspended') ctx.resume(); return ctx; };
  function click() {
    if (!on || !ensure()) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'sine'; o.frequency.setValueAtTime(1250, t); o.frequency.exponentialRampToValueAtTime(620, t + 0.09);
    f.type = 'lowpass'; f.frequency.value = 2400;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    o.connect(f).connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.15);
  }
  function whoosh() {
    if (!on || !ensure()) return;
    const t = ctx.currentTime, len = 1.3, buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = 'bandpass'; f.Q.value = 0.8;
    f.frequency.setValueAtTime(260, t); f.frequency.exponentialRampToValueAtTime(1300, t + 0.55); f.frequency.exponentialRampToValueAtTime(340, t + len);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(f).connect(g).connect(ctx.destination); s.start(t); s.stop(t + len);
  }
  function toggle() { on = !on; try { localStorage.setItem('sklentr-tour-sound', on ? 'on' : 'off'); } catch {} if (on) click(); return on; }
  return { click, whoosh, toggle, get on() { return on; } };
})();

/* ========================= renderer ========================= */
const $ = id => document.getElementById(id);
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.autoClear = false;
stage.appendChild(renderer.domElement);
const maxTex = renderer.capabilities.maxTextureSize;
const wantHD = Math.max(screen.width, screen.height) * devicePixelRatio > 1300;

const camA = new THREE.PerspectiveCamera(60, 1, 0.01, 200);
const camB = new THREE.PerspectiveCamera(60, 1, 0.01, 200);
camA.rotation.order = camB.rotation.order = 'YXZ';

const panoShader = {
  vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D map; uniform float opacity; varying vec3 vDir; const float PI = 3.141592653589793;
    void main(){ vec3 d = normalize(vDir); vec2 uv = vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5);
      gl_FragColor = vec4(texture2D(map, uv).rgb, opacity);
      #include <colorspace_fragment>
    }`,
};

function loadImage(src) {
  return new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = src; });
}
// Downscale anything larger than the GPU allows (phones are often limited to 4096 px).
function toTexture(img) {
  let src = img;
  const big = Math.max(img.naturalWidth, img.naturalHeight);
  if (big > maxTex) {
    const k = maxTex / big, c = document.createElement('canvas');
    c.width = Math.floor(img.naturalWidth * k); c.height = Math.floor(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); src = c;
  }
  const t = new THREE.Texture(src); t.needsUpdate = true; t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
let logoTex = null;
async function getLogo() {
  if (logoTex) return logoTex;
  const img = await loadImage('images/logo.svg');
  const c = document.createElement('canvas'); c.width = 4096; c.height = Math.round(4096 * img.naturalHeight / img.naturalWidth);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  logoTex = new THREE.CanvasTexture(c); logoTex.colorSpace = THREE.SRGBColorSpace; logoTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return logoTex;
}

const cache = new Map();
function loadRoom(room) {
  if (cache.has(room.id)) return cache.get(room.id);
  const p = (async () => {
    let img, pano = false;
    let wide = false;
    try { img = await loadImage(`images/panoramas/${room.file}.jpg`); pano = true; }
    catch {
      try { img = await loadImage(`images/rooms/${room.file}.jpg`); wide = true; }
      catch { img = await loadImage(`images/scenes/${wantHD ? 'hd' : 'sd'}/${room.file}.jpg`).catch(() => loadImage(`images/scenes/sd/${room.file}.jpg`)); }
    }
    const tex = toTexture(img);
    const scene = new THREE.Scene();
    let mesh, W = 0, H = 0;
    if (pano) {
      tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter;   // avoids a seam where the panorama wraps
      mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 128, 64), new THREE.ShaderMaterial({ ...panoShader, uniforms: { map: { value: tex }, opacity: { value: 1 } }, side: THREE.BackSide, transparent: true, depthTest: false }));
      scene.add(mesh);
      if (room.pano?.logo) {
        const lt = await getLogo(), L = room.pano.logo;
        const w = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(L.width) / 2), h = w * lt.image.height / lt.image.width;
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: lt, transparent: true, depthTest: false }));
        plane.position.copy(panoDir(L.u, L.v).multiplyScalar(10)); plane.lookAt(0, 0, 0); plane.renderOrder = 1;
        scene.add(plane); mesh.userData.logo = plane;
      }
    } else {
      W = 2 * Math.tan(THREE.MathUtils.degToRad(wide ? (room.wide?.hfov ?? 100) : room.hfov) / 2); H = W * img.naturalHeight / img.naturalWidth;
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false }));
      mesh.position.z = -1; scene.add(mesh);
    }
    renderer.initTexture(tex);
    return { scene, mesh, W, H, pano, wide, src: img.src };
  })();
  cache.set(room.id, p); return p;
}
function setOpacity(data, o) {
  if (data.pano) data.mesh.material.uniforms.opacity.value = o; else data.mesh.material.opacity = o;
  if (data.mesh.userData.logo) data.mesh.userData.logo.material.opacity = o;
}

/* ========================= geometry ========================= */
function panoDir(u, v) {
  const a = (u - 0.5) * 2 * Math.PI, lat = (0.5 - v) * Math.PI;
  return new THREE.Vector3(Math.cos(a) * Math.cos(lat), Math.sin(lat), Math.sin(a) * Math.cos(lat));
}
function panoUV(d) { return { u: Math.atan2(d.z, d.x) / (2 * Math.PI) + 0.5, v: 0.5 - Math.asin(THREE.MathUtils.clamp(d.y, -1, 1)) / Math.PI }; }
// Hotspot position for the loaded image. Panoramas without calibrated spots get an even spread around the room.
function spotUV(room, data, i) {
  const h = room.hotspots[i];
  if (h.at && data.pano) return worldUV(room.pos, h.at);
  if (data.wide) return room.wide?.spots?.[i] ?? [h.u, h.v];
  if (!data.pano) return [h.u, h.v];
  if (room.pano?.spots?.[i]) return room.pano.spots[i];
  const view = room.pano?.view?.u ?? 0.25;
  if (h.kind === 'nav') return [(view + 0.5) % 1, 0.58];
  const infos = room.hotspots.filter(x => x.kind === 'info'), k = infos.indexOf(h);
  return [(view + (k - (infos.length - 1) / 2) * 0.09 + 1) % 1, 0.5];
}
function dirFor(data, u, v) {
  return data.pano ? panoDir(u, v) : new THREE.Vector3((u - 0.5) * data.W, (0.5 - v) * data.H, -1).normalize();
}
const toYawPitch = d => ({ yaw: THREE.MathUtils.radToDeg(Math.atan2(d.x, -d.z)), pitch: THREE.MathUtils.radToDeg(Math.asin(d.y)) });

const q = new THREE.Quaternion(), eul = new THREE.Euler(0, 0, 0, 'YXZ'), cv = new THREE.Vector3();
function inside(data, yaw, pitch, fov, aspect) {
  if (data.pano) return true;
  const ty = Math.tan(THREE.MathUtils.degToRad(fov) / 2), tx = ty * aspect;
  eul.set(THREE.MathUtils.degToRad(pitch), THREE.MathUtils.degToRad(-yaw), 0); q.setFromEuler(eul);
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    cv.set(sx * tx, sy * ty, -1).applyQuaternion(q);
    if (cv.z >= -1e-4) return false;
    const t = -1 / cv.z;
    if (Math.abs(cv.x * t) > data.W / 2 || Math.abs(cv.y * t) > data.H / 2) return false;
  }
  return true;
}
function fitFov(data, aspect) {
  if (data.pano) return aspect < 1 ? 95 : 80;
  let lo = 5, hi = 120;
  for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; inside(data, 0, 0, m, aspect) ? (lo = m) : (hi = m); }
  return lo * 0.995;
}
function clampView(data, v, aspect) {
  if (data.pano) { v.pitch = THREE.MathUtils.clamp(v.pitch, -80, 80); v.fov = THREE.MathUtils.clamp(v.fov, 30, fitFov(data, aspect) + 15); return v; }
  const fit = fitFov(data, aspect);
  v.fov = THREE.MathUtils.clamp(v.fov, fit * 0.4, fit);
  if (inside(data, v.yaw, v.pitch, v.fov, aspect)) return v;
  let lo = 0, hi = 1;
  for (let i = 0; i < 16; i++) { const m = (lo + hi) / 2; inside(data, v.yaw * m, v.pitch, v.fov, aspect) || inside(data, v.yaw * m, 0, v.fov, aspect) ? (lo = m) : (hi = m); }
  v.yaw *= lo; lo = 0; hi = 1;
  for (let i = 0; i < 16; i++) { const m = (lo + hi) / 2; inside(data, v.yaw, v.pitch * m, v.fov, aspect) ? (lo = m) : (hi = m); }
  v.pitch *= lo;
  return v;
}
function maxOffsets(data, fov, aspect) {
  if (data.pano) return { yaw: 40, pitch: 8 };
  let lo = 0, hi = 90; for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; inside(data, m, 0, fov, aspect) ? (lo = m) : (hi = m); }
  const yaw = lo; lo = 0; hi = 60; for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; inside(data, 0, m, fov, aspect) ? (lo = m) : (hi = m); }
  return { yaw, pitch: lo };
}

/* ========================= state ========================= */
let current = null, curData = null, outgoing = null;
const view = { yaw: 0, pitch: 0, fov: 60 };
const target = { yaw: 0, pitch: 0, fov: 60 };
const parallax = { x: 0, y: 0, tx: 0, ty: 0, on: matchMedia('(hover: hover) and (pointer: fine)').matches };
const transition = { active: false, t: 0 };
const aspect = () => stage.clientWidth / stage.clientHeight;
const introOpen = () => !$('intro').classList.contains('hide');

function defaultView(room, data) {
  const fov = data.pano ? fitFov(data, aspect()) : fitFov(data, aspect()) * 0.9;
  const lk = room.look && worldUV(room.pos, room.look);
  const vw = data.pano ? (lk ? { u: lk[0], v: lk[1] } : (room.pano?.view ?? { u: 0.25, v: 0.5 })) : data.wide ? (room.wide?.view ?? { u: 0.5, v: 0.5 }) : room.view;
  const { yaw, pitch } = toYawPitch(dirFor(data, vw.u, vw.v));
  return clampView(data, { yaw, pitch, fov }, aspect());
}

/* ========================= input ========================= */
const keys = new Set(), pointers = new Map();
let pinch = 0, dragMoved = false, downAt = null;
function userActed() { if (tour.on) stopTour(); }
stage.addEventListener('pointerdown', e => {
  stage.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  stage.classList.add('dragging'); dragMoved = false; downAt = { x: e.clientX, y: e.clientY };
  if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
});
stage.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse' && parallax.on) { parallax.tx = (e.clientX / innerWidth) * 2 - 1; parallax.ty = (e.clientY / innerHeight) * 2 - 1; }
  const p = pointers.get(e.pointerId); if (!p) return;
  if (pointers.size === 1) {
    const k = view.fov / stage.clientHeight;
    target.yaw -= (e.clientX - p.x) * k; target.pitch += (e.clientY - p.y) * k;
    if (Math.abs(e.clientX - downAt.x) + Math.abs(e.clientY - downAt.y) > 4) { dragMoved = true; userActed(); }
  } else if (pointers.size === 2) {
    p.x = e.clientX; p.y = e.clientY;
    const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinch) target.fov *= pinch / d; pinch = d; userActed(); return;
  }
  p.x = e.clientX; p.y = e.clientY;
});
const endPtr = e => {
  pointers.delete(e.pointerId); pinch = 0;
  if (!pointers.size) stage.classList.remove('dragging');
  if (EDIT && !dragMoved && e.type === 'pointerup') reportUV(e.clientX, e.clientY);
};
stage.addEventListener('pointerup', endPtr); stage.addEventListener('pointercancel', endPtr);
stage.addEventListener('pointerleave', () => { parallax.tx = parallax.ty = 0; });
stage.addEventListener('wheel', e => { e.preventDefault(); target.fov *= Math.exp(e.deltaY * 0.0012); userActed(); }, { passive: false });

addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's', '+', '=', '-', '_'].includes(k)) { keys.add(k); userActed(); e.preventDefault(); return; }
  if (k === 'escape') { closeDrawer(); hideHelp(); closeRooms(); return; }
  if (introOpen()) { if (k === 'enter' || k === ' ') { e.preventDefault(); enter(true); } return; }
  if (k === ' ') { e.preventDefault(); tour.on ? stopTour() : startTour(); }
  else if (k === ']' || k === 'pagedown') step(1);
  else if (k === '[' || k === 'pageup') step(-1);
  else if (/^[0-9]$/.test(k) && ROOMS[(+k || 10) - 1]) { stopTour(); closeRooms(); go(ROOMS[(+k || 10) - 1].id); }
  else if (k === 'h') { stopTour(); go('entrance'); }
  else if (k === 'm') toggleRooms();
  else if (k === 'f') toggleFull();
  else if (k === 'v') toggleSound();
  else if (k === '?' || k === '/') showHelp();
});
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => keys.clear());

// ?edit: click anywhere to read the image coordinates under the cursor
function reportUV(x, y) {
  if (!curData) return;
  const d = new THREE.Vector3((x / stage.clientWidth) * 2 - 1, -(y / stage.clientHeight) * 2 + 1, 0.5).unproject(camA).sub(camA.position).normalize();
  let u, v;
  if (curData.pano) ({ u, v } = panoUV(d));
  else { const t = -1 / d.z; u = d.x * t / curData.W + 0.5; v = 0.5 - d.y * t / curData.H; }
  const txt = `[${u.toFixed(3)}, ${v.toFixed(3)}]`;
  console.log(`${current.id} (${curData.pano ? 'panorama' : 'photo'}): ${txt}`);
  navigator.clipboard?.writeText(txt).catch(() => {});
  toast(`${curData.pano ? 'Panorama' : 'Photo'} u, v ${txt} copied`);
}

/* ========================= hotspots ========================= */
const layer = $('hotspots');
let spots = [];
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18V6M6.5 11.5 12 6l5.5 5.5"/></svg>';
function buildHotspots(room, data) {
  layer.innerHTML = ''; spots = [];
  room.hotspots.forEach((h, i) => {
    const el = document.createElement('button');
    if (h.kind === 'nav') {
      const t = byId[h.to];
      el.className = 'hs nav'; el.setAttribute('aria-label', `Walk to ${t.zone}`);
      el.innerHTML = `<span class="ring">${ARROW}</span><span class="label"><small>Proceed to</small><span>${esc(t.zone)}</span></span>`;
      el.addEventListener('click', ev => { ev.stopPropagation(); stopTour(); go(h.to, i); });
    } else {
      el.className = 'hs info'; el.setAttribute('aria-label', `${h.title}: details`);
      el.innerHTML = `<span class="ring"></span><span class="label"><small>${esc(h.kicker)}</small><span>${esc(h.title)}</span></span>`;
      el.addEventListener('click', ev => { ev.stopPropagation(); openDrawer(h, room); });
    }
    layer.appendChild(el);
    const [u, v] = spotUV(room, data, i);
    spots.push({ el, dir: dirFor(data, u, v) });
  });
}
const pv = new THREE.Vector3();
function placeHotspots() {
  const w = stage.clientWidth, h = stage.clientHeight;
  for (const s of spots) {
    pv.copy(s.dir).multiplyScalar(0.9).project(camA);
    const vis = !transition.active && pv.z < 1 && Math.abs(pv.x) < 1.05 && Math.abs(pv.y) < 1.05;
    s.el.hidden = !vis;
    if (!vis) continue;
    const x = ((pv.x + 1) / 2) * w, y = ((1 - pv.y) / 2) * h, r = s.el.classList.contains('nav') ? 24 : 17;
    const flip = x > w - 280; s.el.classList.toggle('flip', flip);
    s.el.style.transform = flip ? `translate(${x + r}px, ${y}px) translate(-100%, -50%)` : `translate(${x - r}px, ${y}px) translate(0, -50%)`;
  }
}

/* ========================= navigation ========================= */
async function go(id, viaSpot) {
  const room = byId[id];
  if (!room || transition.active || (current && current.id === id)) return;
  closeDrawer();
  const data = await loadRoom(room);
  const first = !current;
  if (!first) {
    outgoing = { data: curData, view: { ...view } };
    if (viaSpot != null) {
      const [u, v] = spotUV(current, curData, viaSpot);
      const tp = toYawPitch(dirFor(curData, u, v));
      outgoing.to = clampView(curData, { yaw: nearest(view.yaw, tp.yaw), pitch: tp.pitch * 0.5, fov: view.fov * 0.6 }, aspect());
    } else outgoing.to = { ...view, fov: view.fov * 0.82 };
    transition.active = true; transition.t = 0; document.body.classList.add('moving'); sound.whoosh();
  }
  current = room; curData = data;
  const dv = defaultView(room, data);
  Object.assign(target, dv); Object.assign(view, dv);
  if (!first) view.fov = Math.min(fitFov(data, aspect()) + (data.pano ? 12 : 0), dv.fov * 1.14);
  parallax.x = parallax.y = 0;
  buildHotspots(room, data);
  updateUI(room);
  if (location.hash.slice(1) !== id) history.replaceState(null, '', location.search + '#' + id);
  loadRoom(ROOMS[(room.index + 1) % ROOMS.length]).catch(() => {});
}
const nearest = (from, to) => from + ((((to - from) % 360) + 540) % 360) - 180;
function step(d) { stopTour(); go(ROOMS[(current.index + d + ROOMS.length) % ROOMS.length].id); }

/* ========================= guided tour ========================= */
const ROOM_SECONDS = 11;
const tour = { on: false, t: 0 };
function startTour() {
  tour.on = true; tour.t = 0; syncButtons(); closeDrawer(); closeRooms();
  if (current.index === ROOMS.length - 1) go(ROOMS[0].id);
  toast('Guided tour · drag to pause');
}
function stopTour() { if (!tour.on) return; tour.on = false; syncButtons(); $('prog').style.width = '0'; }
function tickTour(dt) {
  if (!tour.on || transition.active) return;
  tour.t += dt;
  $('prog').style.width = Math.min(100, (tour.t / ROOM_SECONDS) * 100) + '%';
  if (tour.t >= ROOM_SECONDS) {
    tour.t = 0;
    if (current.index < ROOMS.length - 1) {
      const i = current.hotspots.findIndex(h => h.kind === 'nav' && byId[h.to].index === current.index + 1);
      go(ROOMS[current.index + 1].id, i >= 0 ? i : null);
    } else { stopTour(); openDrawer(byId.cafe.hotspots[0], byId.cafe); }
  }
}

/* ========================= UI ========================= */
const pad2 = n => String(n).padStart(2, '0');
function updateUI(room) {
  $('plNo').textContent = pad2(room.index + 1); $('plOf').textContent = pad2(ROOMS.length);
  $('plZone').textContent = room.zone; $('plTitle').textContent = room.title; $('plText').textContent = room.text;
  const pl = $('plate'); pl.classList.remove('swap'); void pl.offsetWidth; pl.classList.add('swap');
  document.querySelectorAll('.rooms-list button').forEach((b, i) => b.classList.toggle('current', i === room.index));
}
function openDrawer(h, room) {
  const hero = $('drHero');
  const i = room.hotspots.indexOf(h);
  loadRoom(room).then(data => {
    const [u, v] = spotUV(room, data, i);
    hero.style.backgroundImage = `url("${data.src}")`;
    hero.style.backgroundSize = data.pano ? '700%' : '260%';
    hero.style.backgroundPosition = `${u * 100}% ${v * 100}%`;
  });
  $('drKicker').textContent = h.kicker; $('drTitle').textContent = h.title; $('drBody').innerHTML = h.html;
  $('drawer').classList.add('open'); $('drawer').setAttribute('aria-hidden', 'false');
  document.querySelector('.drawer-scroll').scrollTop = 0; $('drClose').focus({ preventScroll: true });
}
function closeDrawer() { $('drawer').classList.remove('open'); $('drawer').setAttribute('aria-hidden', 'true'); }
function showHelp() { $('help').classList.remove('hide'); $('helpClose').focus(); }
function hideHelp() { $('help').classList.add('hide'); }
function openRooms() { stopTour(); $('rooms').classList.add('open'); $('rooms').setAttribute('aria-hidden', 'false'); preview(current); document.querySelector('.rooms-list button.current')?.focus(); }
function closeRooms() { $('rooms').classList.remove('open'); $('rooms').setAttribute('aria-hidden', 'true'); }
function toggleRooms() { $('rooms').classList.contains('open') ? closeRooms() : openRooms(); }
function preview(room) { if (room) $('roomsPreview').style.backgroundImage = `url(images/thumbs/${room.file}.jpg)`; }
function toggleFull() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => toast('Fullscreen unavailable'));
  else document.exitFullscreen?.();
}
function syncButtons() {
  $('btnFull').setAttribute('aria-pressed', String(!!document.fullscreenElement));
  $('lblTour').textContent = tour.on ? 'Pause tour' : 'Begin tour';
  $('btnTour').classList.toggle('on', tour.on);
}
let toastTimer;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); }

ROOMS.forEach((r, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button><span class="n">${pad2(i + 1)}</span><span class="t">${esc(r.title)}</span><span class="z">${esc(r.zone)}</span></button>`;
  const b = li.firstChild;
  b.addEventListener('click', () => { closeRooms(); go(r.id); });
  b.addEventListener('mouseenter', () => preview(r)); b.addEventListener('focus', () => preview(r));
  $('roomsList').appendChild(li);
});

function toggleSound() { const on = sound.toggle(); $('btnSound').setAttribute('aria-pressed', String(on)); toast(on ? 'Sound on' : 'Sound off'); }
$('btnSound').setAttribute('aria-pressed', String(sound.on));
$('btnSound').onclick = ev => { ev.stopPropagation(); toggleSound(); };
// a soft click for every press of a button, link, hotspot or the studio view itself
document.addEventListener('click', ev => {
  if (ev.target.closest('#btnSound')) return;
  if (ev.target.closest('button, a, [role="button"]')) sound.click();
}, true);
stage.addEventListener('pointerup', () => { if (!dragMoved) sound.click(); });

$('btnRooms').onclick = openRooms;
$('roomsClose').onclick = closeRooms;
$('btnHelp').onclick = showHelp;
$('helpClose').onclick = hideHelp;
$('help').addEventListener('click', ev => { if (ev.target === $('help')) hideHelp(); });
$('btnFull').onclick = toggleFull;
document.addEventListener('fullscreenchange', syncButtons);
$('btnPrev').onclick = () => step(-1);
$('btnNext').onclick = () => step(1);
$('btnTour').onclick = () => (tour.on ? stopTour() : startTour());
$('drClose').onclick = closeDrawer;

function enter(withTour) {
  if (!current) return;
  $('intro').classList.add('hide');
  const pl = $('plate'); pl.classList.remove('swap'); void pl.offsetWidth; pl.classList.add('swap');
  if (withTour) setTimeout(startTour, 900);
  if (EDIT) toast('Edit mode · click to copy u, v');
}
$('introTour').onclick = () => enter(true);
$('introFree').onclick = () => enter(false);

/* ========================= loop ========================= */
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camA.aspect = camB.aspect = w / h; camA.updateProjectionMatrix(); camB.updateProjectionMatrix();
  if (curData) clampView(curData, target, aspect());
}
addEventListener('resize', resize); resize();

function applyCam(cam, v) {
  cam.fov = v.fov; cam.updateProjectionMatrix();
  cam.rotation.set(THREE.MathUtils.degToRad(v.pitch), THREE.MathUtils.degToRad(-v.yaw), 0);
  cam.updateMatrixWorld();
}
const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 0.1);
  const asp = aspect();
  const ks = 55 * dt * (view.fov / 60);
  if (keys.has('arrowleft') || keys.has('a')) target.yaw -= ks;
  if (keys.has('arrowright') || keys.has('d')) target.yaw += ks;
  if (keys.has('arrowup') || keys.has('w')) target.pitch += ks;
  if (keys.has('arrowdown') || keys.has('s')) target.pitch -= ks;
  if (keys.has('+') || keys.has('=')) target.fov *= Math.exp(-1.1 * dt);
  if (keys.has('-') || keys.has('_')) target.fov *= Math.exp(1.1 * dt);
  tickTour(dt);
  clampView(curData, target, asp);

  // cinematic motion: the tour pans slowly, the intro drifts, and on desktop the view leans toward the mouse
  const range = maxOffsets(curData, target.fov, asp);
  let dYaw = 0, dPitch = 0;
  if (curData.pano && (tour.on || introOpen())) target.yaw += dt * (introOpen() ? 3 : 7);
  else if (tour.on) dYaw = Math.sin((tour.t / ROOM_SECONDS) * Math.PI * 2 - Math.PI / 2) * range.yaw * 0.6;
  else if (introOpen()) dYaw = Math.sin(performance.now() / 6000) * range.yaw * 0.5;
  if (!tour.on && !introOpen() && parallax.on && !pointers.size) {
    parallax.x += (parallax.tx - parallax.x) * (1 - Math.pow(0.03, dt));
    parallax.y += (parallax.ty - parallax.y) * (1 - Math.pow(0.03, dt));
    const k = curData.pano ? 0.12 : 0.35;
    dYaw = parallax.x * range.yaw * k; dPitch = -parallax.y * range.pitch * k;
  }
  const goal = clampView(curData, { yaw: target.yaw + dYaw, pitch: target.pitch + dPitch, fov: target.fov }, asp);
  const s = 1 - Math.pow(0.006, dt);
  view.yaw += (goal.yaw - view.yaw) * s; view.pitch += (goal.pitch - view.pitch) * s; view.fov += (goal.fov - view.fov) * s;
  clampView(curData, view, asp);
  applyCam(camA, view);

  renderer.clear();
  if (transition.active) {
    transition.t += dt;
    const t1 = Math.min(transition.t / 0.75, 1), k1 = t1 * t1 * (3 - 2 * t1);
    const t2 = THREE.MathUtils.clamp((transition.t - 0.45) / 1.0, 0, 1), k2 = t2 * t2 * (3 - 2 * t2);
    const o = outgoing;
    applyCam(camB, { yaw: THREE.MathUtils.lerp(o.view.yaw, o.to.yaw, k1), pitch: THREE.MathUtils.lerp(o.view.pitch, o.to.pitch, k1), fov: THREE.MathUtils.lerp(o.view.fov, o.to.fov, k1) });
    setOpacity(o.data, 1); renderer.render(o.data.scene, camB);
    setOpacity(curData, k2); renderer.render(curData.scene, camA);
    if (transition.t >= 1.5) { transition.active = false; setOpacity(curData, 1); outgoing = null; document.body.classList.remove('moving'); }
  } else { setOpacity(curData, 1); renderer.render(curData.scene, camA); }
  placeHotspots();
  requestAnimationFrame(frame);
}

const start = byId[location.hash.slice(1)] ? location.hash.slice(1) : 'reception';
go(start).then(() => {
  const bg = $('introBg'); bg.style.backgroundImage = 'url(images/hero.jpg)'; bg.classList.add('ready');
  $('loading').textContent = 'Press Enter to begin';
  frame();
  ROOMS.forEach(r => loadRoom(r).catch(() => {}));
}).catch(err => { console.error(err); $('loading').textContent = 'The studio images could not be loaded'; });
