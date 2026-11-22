"use client";

import { useRef, useState } from "react";

export default function Invite() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  function openInvite() {
    if (open) return;
    setOpen(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    setMuted(false);
    audio.play().catch(() => {});
  }

  function toggleMute(e) {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  return (
    <section className="b" aria-label="Ingresso VIP">
      <div className={"grain"} aria-hidden="true" />
      <div className={open ? "b-stage is-open" : "b-stage"}>
        <button
          type="button"
          className="b-envelope"
          aria-expanded={open}
          aria-controls="invite-ticket"
          onClick={openInvite}
        >
          <span className="b-flap" aria-hidden="true" />
          <span className="b-front">
            <span className="b-env-kicker">Where We Are Tour</span>
            <span className="b-env-name">JULIA 25</span>
            <span className="b-env-place">Pizza Hut</span>
            <span className="b-env-cta">toque para abrir</span>
          </span>
          <span className="b-seal" aria-hidden="true">
            1D
          </span>
        </button>
        <article className="b-ticket" id="invite-ticket" aria-hidden={!open}>
          <div className="b-foil">1D</div>
          <header className="b-head">
            <span className="brand">WHERE WE ARE TOUR</span>
            <span className="admit">ADMIT ONE</span>
          </header>
          <div className="b-body">
            <div className="b-event">BIRTHDAY SHOW · PIZZA HUT</div>
            <h1 className="b-title">JULIA 25</h1>
            <div className="b-grid">
              <div>
                quando<b>26 Nov 2026</b>
              </div>
              <div>
                portões<b>19:00</b>
              </div>
              <div>
                local<b>Pizza Hut</b>
              </div>
              <div>
                setor<b>Amigos</b>
              </div>
              <div>
                fileira<b>Best</b>
              </div>
              <div>
                lugar<b>Ever</b>
              </div>
            </div>
            <div className="b-addr">Pizza Hut · R. Mal. Deodoro da Fonseca, 531</div>
          </div>
          <div className="b-perf" aria-hidden="true" />
          <footer className="b-stub">
            <div className="b-bar">*JULIA25*</div>
            <div className="b-serial">
              Nº 1D-2010-25
              <br />
              26/11 · 19h
              <br />
              Pizza Hut · Deodoro, 531
            </div>
          </footer>
        </article>
        {open ? (
          <button
            type="button"
            className="b-mute"
            aria-pressed={muted}
            onClick={toggleMute}
          >
            {muted ? "som" : "mudo"}
          </button>
        ) : null}
        <audio ref={audioRef} src="/what-a-feeling.mp3" preload="none" />
      </div>
    </section>
  );
}
