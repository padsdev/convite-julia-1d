"use client";

import { useEffect, useRef, useState } from "react";

const TARGET = new Date(2026, 10, 26, 19, 0, 0);

const TELEGRAMS = [
  "DECRETO: Live while we're young — pizza e refrão alto",
  "STATUS: Directioner confirmada na Where We Are Tour",
  "AVISO: All-stars e glitter no dress code",
  "ALERTA: Portões 19h · Pizza Hut · Deodoro da Fonseca, 531",
  "URGENTE: Story of my life começa quando a Julia soprar a vela",
];

const EXCUSES = [
  {
    title: "Ofício de Ausência 1D",
    text: "“A partir de 26/11 às 19h estarei em função oficial na Where We Are Tour. E-mails voltam quando acabar What a Feeling.”",
  },
  {
    title: "Atestado de Boyband Aguda",
    text: "“A colaboradora apresenta sintomas de refrão grudento. Prescrição: Pizza Hut, all-stars e 25 anos da Julia.”",
  },
  {
    title: "Notificação de Backstage",
    text: "“Em caso de emergência no trabalho: coloque Best Song Ever e tente de novo amanhã.”",
  },
];

const ROLES = [
  { title: "Grita o Refrão", text: "Se a mesa não cantar What a Feeling inteiro, a culpa é sua. Volume no máximo." },
  { title: "DJ da Mesa", text: "A fila do Spotify é sagrada. Ninguém pula Little Things." },
  { title: "Fotógrafa Oficial", text: "Polaroid da pizza, da vela e do glitter. Sem isso não aconteceu." },
  { title: "Come a Fatia da Julia", text: "Missão: garantir que a aniversariante coma antes de atender o Zap." },
  { title: "Harmonizer de Plantão", text: "Sabe o nome dos cinco álbuns em ordem. Recita se alguém duvidar." },
];

const CHECKS = [
  { id: "c1", label: "All-stars (ou chuteira emocional)" },
  { id: "c2", label: "Glitter no rostinho" },
  { id: "c3", label: "Camiseta / vibe 1D" },
  { id: "c4", label: "Voz para o refrão" },
  { id: "c5", label: "Fome de Pizza Hut" },
  { id: "c6", label: "Presente (ou um abraço bem 2012)" },
];

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function remaining() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function Invite() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const sceneRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(remaining);
  const [telegram, setTelegram] = useState(0);
  const [modal, setModal] = useState(null);
  const [excuseI, setExcuseI] = useState(0);
  const [roleI, setRoleI] = useState(0);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    const t = setInterval(() => setTime(remaining()), 1000);
    const g = setInterval(() => setTelegram((i) => (i + 1) % TELEGRAMS.length), 4800);
    try {
      const saved = {};
      CHECKS.forEach((c) => {
        saved[c.id] = localStorage.getItem("jul25_" + c.id) === "1";
      });
      setChecks(saved);
    } catch {}
    return () => {
      clearInterval(t);
      clearInterval(g);
    };
  }, []);

  useEffect(() => {
    let dead = false;
    let raf = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    import("three").then((THREE) => {
      if (dead) return;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
      camera.position.set(0, 0.5, 8.4);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const sun = new THREE.DirectionalLight(0xffe7c2, 0.9);
      sun.position.set(3, 6, 4);
      scene.add(sun);

      const table = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 14),
        new THREE.MeshStandardMaterial({ color: 0x1c120a, roughness: 0.85 })
      );
      table.rotation.x = -Math.PI / 2;
      table.position.y = -2.1;
      scene.add(table);

      const group = new THREE.Group();
      scene.add(group);

      const cream = new THREE.MeshStandardMaterial({ color: 0xe8d4b8, roughness: 0.7 });
      const burgundy = new THREE.MeshStandardMaterial({ color: 0x8b1e3f, roughness: 0.45 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.7, 0.12), cream);
      group.add(body);

      const flapPivot = new THREE.Group();
      flapPivot.position.set(0, 1.35, 0.07);
      group.add(flapPivot);
      const flap = new THREE.Mesh(new THREE.ConeGeometry(2.15, 1.5, 3), burgundy);
      flap.rotation.x = Math.PI;
      flap.rotation.z = Math.PI;
      flap.position.y = -0.55;
      flapPivot.add(flap);

      const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.08, 32), burgundy);
      seal.rotation.x = Math.PI / 2;
      seal.position.set(0, -0.7, 0.12);
      group.add(seal);

      const state = {
        renderer,
        scene,
        camera,
        group,
        flapPivot,
        seal,
        opened: false,
        t: 0,
      };
      sceneRef.current = state;

      function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      window.addEventListener("resize", resize);

      function tick() {
        raf = requestAnimationFrame(tick);
        if (!state.opened) {
          group.rotation.y = Math.sin(performance.now() / 1800) * 0.18;
        } else {
          state.t = Math.min(1, state.t + 0.018);
          const e = 1 - Math.pow(1 - state.t, 3);
          group.rotation.x = -Math.PI / 2 * e;
          group.rotation.y = 0;
          group.position.y = 0.15 + (-1.9) * e;
          flapPivot.rotation.x = -Math.PI * 0.95 * e;
          seal.scale.setScalar(Math.max(0, 1 - e * 1.4));
        }
        renderer.render(scene, camera);
      }
      tick();

      state.cleanup = () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(raf);
        renderer.dispose();
      };
    });

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      sceneRef.current?.cleanup?.();
    };
  }, []);

  function playMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    audio.play().catch(() => {});
  }

  function openPass() {
    if (open) return;
    setOpen(true);
    if (sceneRef.current) sceneRef.current.opened = true;
    playMusic();
    import("canvas-confetti").then((m) => {
      m.default({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#c9a227", "#8b1e3f", "#39d0c5", "#ffffff"],
      });
    });
  }

  function closePass() {
    setOpen(false);
    const s = sceneRef.current;
    if (s) {
      s.opened = false;
      s.t = 0;
      s.group.rotation.set(0, 0, 0);
      s.group.position.set(0, 0, 0);
      s.flapPivot.rotation.x = 0;
      s.seal.scale.setScalar(1);
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  function panic() {
    import("canvas-confetti").then((m) => {
      m.default({ particleCount: 90, spread: 80, origin: { x: 0.2, y: 0.65 }, colors: ["#c9a227", "#8b1e3f", "#ff2d6a"] });
      m.default({ particleCount: 90, spread: 80, origin: { x: 0.8, y: 0.65 }, colors: ["#39d0c5", "#c9a227", "#ffffff"] });
    });
    playMusic();
  }

  function toggleCheck(id) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("jul25_" + id, next[id] ? "1" : "0");
      } catch {}
      return next;
    });
  }

  const modalMeta = {
    rh: { stamp: "RH • APROVADO", action: "Gerar outra desculpa" },
    roles: { stamp: "CLASSIFICAÇÃO", action: "Sortear meu papel" },
    checklist: { stamp: "BAGAGEM", action: null },
    playlist: { stamp: "SOM DA TOUR", action: null },
  };

  return (
    <div className="stage-root">
      <canvas ref={canvasRef} className="webgl-canvas" />

      <div className={open ? "ux-hint is-hidden" : "ux-hint"}>
        <button type="button" className="ux-pill" onClick={openPass}>
          Acessar Backstage Pass VIP
        </button>
      </div>

      <main className="viewport">
        <article className={open ? "pass is-open" : "pass"}>
          <header className="pass-head">
            <div>
              <span className="brand-title">BACKSTAGE PASS • VIP</span>
              <span className="brand-sub">WHERE WE ARE TOUR • JULIA 25</span>
            </div>
            <span className="class-badge">FIRST CLASS</span>
          </header>

          <div className="pass-body">
            <div className="route">
              <div>
                <div className="route-code">1D</div>
                <div className="route-city">Casa</div>
              </div>
              <div className="route-mid">
                <div className="flight-num">WWA-2511</div>
                <div className="route-line" />
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="route-code">JUL</div>
                <div className="route-city">Pizza Hut</div>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <div className="data-label">Passageiro / Convocado</div>
                <div className="data-value">Directioner VIP</div>
              </div>
              <div>
                <div className="data-label">Status</div>
                <div className="data-value ok">Confirmado</div>
              </div>
              <div>
                <div className="data-label">Embarque oficial</div>
                <div className="data-value">26/11/2026 • 19:00</div>
              </div>
              <div>
                <div className="data-label">Origem ➔ Destino</div>
                <div className="data-value">Casa ➔ Pizza Hut</div>
              </div>
            </div>

            <div className="dispatch">{TELEGRAMS[telegram]}</div>

            <section>
              <span className="cd-tag">Tempo restante para o show</span>
              <div className="cd-grid">
                {[
                  ["Dias", time.d],
                  ["Horas", time.h],
                  ["Minutos", time.m],
                  ["Segundos", time.s],
                ].map(([label, n]) => (
                  <div className="timer" key={label}>
                    <span className="timer-n">{pad(n)}</span>
                    <span className="timer-l">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="tear" />

          <div className="stub">
            <div className="actions">
              <button type="button" className="ed-btn" onClick={() => setModal("rh")}>
                <span className="btn-title">Desculpa RH</span>
                <span className="btn-sub">Atestado da tour</span>
              </button>
              <button type="button" className="ed-btn" onClick={() => setModal("roles")}>
                <span className="btn-title">Seu papel</span>
                <span className="btn-sub">Na mesa da Julia</span>
              </button>
              <button type="button" className="ed-btn" onClick={() => setModal("checklist")}>
                <span className="btn-title">Checklist</span>
                <span className="btn-sub">Kit Directioner</span>
              </button>
              <button type="button" className="ed-btn" onClick={() => setModal("playlist")}>
                <span className="btn-title">Setlist</span>
                <span className="btn-sub">What a Feeling • 1D</span>
              </button>
            </div>

            <button type="button" className="panic" onClick={panic}>
              Abre o show agora
            </button>

            <footer className="foot">
              <span className="stamp">1D ➔ JUL • 26.NOV.2026</span>
              <div>
                <button type="button" className={muted ? "pill is-on" : "pill"} onClick={toggleMute}>
                  {muted ? "Som" : "Mudo"}
                </button>{" "}
                <button type="button" className="pill" onClick={closePass}>
                  Guardar
                </button>
              </div>
            </footer>
          </div>
        </article>
      </main>

      {modal ? (
        <div className="modal" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-stamp">{modalMeta[modal].stamp}</div>
            <button type="button" className="modal-x" onClick={() => setModal(null)}>
              ×
            </button>
            {modal === "rh" ? (
              <>
                <h2 className="modal-title">{EXCUSES[excuseI].title}</h2>
                <div className="modal-body">
                  <p style={{ fontStyle: "italic" }}>{EXCUSES[excuseI].text}</p>
                </div>
                <button
                  type="button"
                  className="modal-go"
                  onClick={() => setExcuseI((i) => (i + 1) % EXCUSES.length)}
                >
                  {modalMeta.rh.action}
                </button>
              </>
            ) : null}
            {modal === "roles" ? (
              <>
                <h2 className="modal-title">{ROLES[roleI].title}</h2>
                <div className="modal-body">{ROLES[roleI].text}</div>
                <button
                  type="button"
                  className="modal-go"
                  onClick={() => setRoleI((i) => (i + 1) % ROLES.length)}
                >
                  {modalMeta.roles.action}
                </button>
              </>
            ) : null}
            {modal === "checklist" ? (
              <>
                <h2 className="modal-title">Kit Directioner</h2>
                <div className="modal-body">
                  <div className="check-list">
                    {CHECKS.map((c) => (
                      <label className="check-item" key={c.id}>
                        <input
                          type="checkbox"
                          checked={!!checks[c.id]}
                          onChange={() => toggleCheck(c.id)}
                        />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {modal === "playlist" ? (
              <>
                <h2 className="modal-title">Setlist da noite</h2>
                <div className="modal-body">
                  What a Feeling (One Direction)
                  <br />
                  Best Song Ever · Live While We&apos;re Young
                  <br />
                  Story of My Life · Little Things
                  <br />
                  <br />
                  A faixa toca ao abrir o envelope. Use Mudo no canhoto.
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <audio ref={audioRef} src="/what-a-feeling.mp3" preload="auto" loop />
    </div>
  );
}
