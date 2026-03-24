(function () {
  const link   = document.getElementById('blackholeLink');
  const canvas = document.getElementById('blackholeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SIZE = 110;
  canvas.width  = SIZE;
  canvas.height = SIZE;

  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const R_SING     = 16;   // black void radius
  const R_DISK_IN  = 17;   // disk starts just outside void
  const R_DISK_OUT = 52;   // disk outer edge

  let t       = 0;
  let hovered = false;

  if (link) {
    link.addEventListener('mouseenter', () => { hovered = true;  });
    link.addEventListener('mouseleave', () => { hovered = false; });
  }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    t += hovered ? 0.007 : 0.003;

    ctx.save();
    ctx.translate(cx, cy);

    const NUM = 55;
    for (let i = 0; i < NUM; i++) {
      const frac  = i / NUM;
      const r     = R_DISK_IN + frac * (R_DISK_OUT - R_DISK_IN);
      const angle = t * (1 - frac * 0.7) + frac * Math.PI * 2.8;
      const heat  = Math.pow(1 - frac, 1.4);
      const alpha = heat * (hovered ? 0.9 : 0.75);

      let rc, gc, bc;
      if (frac < 0.12) {
        const v = Math.round(220 + 35 * (1 - frac / 0.12));
        rc = v; gc = Math.round(v * 0.92); bc = Math.round(v * 0.82);
      } else if (frac < 0.45) {
        const f2 = (frac - 0.12) / 0.33;
        rc = 255; gc = Math.round(200 - f2 * 110); bc = Math.round(80 - f2 * 65);
      } else {
        const f2 = (frac - 0.45) / 0.55;
        rc = Math.round(230 - f2 * 100); gc = Math.round(65 - f2 * 50); bc = Math.round(15 - f2 * 12);
      }

      const col = `rgba(${rc},${gc},${bc},${alpha.toFixed(3)})`;

      for (let s = 0; s < 4; s++) {
        const sa  = angle + (s / 4) * Math.PI * 2;
        const sw  = (0.35 + frac * 0.5) * (Math.PI / 4);

        const ysc = 0.18 + frac * 0.10;

        ctx.save();
        ctx.scale(1, ysc);
        ctx.beginPath();
        ctx.arc(0, 0, r, sa, sa + sw);
        ctx.strokeStyle = col;
        ctx.lineWidth   = 1.0 + heat * 3.2;
        ctx.shadowColor = col;
        ctx.shadowBlur  = heat * (hovered ? 18 : 12);
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = 0; i < 32; i++) {
      const frac  = i / 32;
      const r     = R_DISK_IN * 0.95 + frac * (R_DISK_OUT * 0.48 - R_DISK_IN * 0.95);
      const heat  = Math.pow(1 - frac, 2.0);
      const alpha = heat * (hovered ? 0.75 : 0.55);
      const rc    = Math.round(255 - frac * 70);
      const gc    = Math.round(200 - frac * 140);
      const bc    = Math.round(90  - frac * 75);
      const col   = `rgba(${rc},${gc},${bc},${alpha.toFixed(3)})`;

      ctx.save();
      ctx.scale(1, 0.16);  
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI + 0.15, Math.PI * 2 - 0.15);
      ctx.strokeStyle = col;
      ctx.lineWidth   = 0.8 + heat * 3.5;
      ctx.shadowColor = col;
      ctx.shadowBlur  = heat * (hovered ? 16 : 10);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore(); // un-translate

    const lg = ctx.createRadialGradient(cx, cy, R_DISK_IN, cx, cy, R_DISK_OUT * 1.2);
    lg.addColorStop(0,   'rgba(0,0,0,0)');
    lg.addColorStop(0.4, `rgba(80,20,0,${hovered ? 0.08 : 0.05})`);
    lg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R_DISK_OUT * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = lg;
    ctx.fill();

    const pulse  = 0.6 + Math.sin(t * 2.4) * 0.4;
    const palpha = (hovered ? 0.95 : 0.8) * pulse;
    const R_PHOT = R_SING + 3;
    const pg = ctx.createRadialGradient(cx, cy, R_PHOT - 2, cx, cy, R_PHOT + 3);
    pg.addColorStop(0,    'rgba(255,220,150,0)');
    pg.addColorStop(0.4,  `rgba(255,230,170,${palpha})`);
    pg.addColorStop(0.75, `rgba(255,190,80,${palpha * 0.8})`);
    pg.addColorStop(1,    'rgba(255,140,30,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R_PHOT, 0, Math.PI * 2);
    ctx.strokeStyle = pg;
    ctx.lineWidth   = 4;
    ctx.shadowColor = `rgba(255,180,60,${palpha * 0.8})`;
    ctx.shadowBlur  = hovered ? 16 : 9;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, R_SING, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
})();