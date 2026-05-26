/* ============================================================
   script.js — Jadwal STI ITEBIS PGRI Dewantara
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Filter buttons ── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const dayBlocks   = document.querySelectorAll('.day-block');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.day;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide day blocks
      dayBlocks.forEach(block => {
        if (target === 'all' || block.dataset.day === target) {
          block.classList.remove('hidden');
        } else {
          block.classList.add('hidden');
        }
      });
    });
  });

  /* ── Intersection Observer: fade-in on scroll ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.session-card, .info-card').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  /* ── Highlight current day ── */
  const dayMap = { 4: 'kamis', 5: 'jumat', 6: 'sabtu' };
  const today  = new Date().getDay();         // 0=Sun … 6=Sat
  const todayKey = dayMap[today];

  if (todayKey) {
    // Auto-click the matching filter button
    const todayBtn = document.querySelector(`.filter-btn[data-day="${todayKey}"]`);
    if (todayBtn) todayBtn.click();

    // Add a "Hari ini" badge to the day header
    const dayBlock = document.querySelector(`.day-block[data-day="${todayKey}"]`);
    if (dayBlock) {
      const h2 = dayBlock.querySelector('h2');
      const badge = document.createElement('span');
      badge.textContent = '📅 Hari Ini';
      badge.style.cssText = `
        display:inline-flex; align-items:center; gap:5px;
        font-family:'Exo 2',sans-serif; font-size:0.7rem; font-weight:600;
        padding:3px 10px; border-radius:999px;
        background:rgba(0,212,255,0.15); border:1px solid rgba(0,212,255,0.4);
        color:#00d4ff; margin-left:12px; vertical-align:middle;
      `;
      h2.appendChild(badge);
    }
  }

  /* ── Circuit SVG pulse animation ── */
  const circles = document.querySelectorAll('.circuit-svg circle[fill="url(#grad1)"]');
  let pulseDir  = 1;
  let pulseVal  = 0.5;

  setInterval(() => {
    pulseVal += pulseDir * 0.05;
    if (pulseVal >= 1)   pulseDir = -1;
    if (pulseVal <= 0.3) pulseDir = 1;
    circles.forEach(c => c.setAttribute('opacity', pulseVal.toFixed(2)));
  }, 80);

  /* ── Particle effect on card hover ── */
  document.querySelectorAll('.session-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const rect = card.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        createParticle(
          rect.left + Math.random() * rect.width,
          rect.top  + Math.random() * rect.height
        );
      }
    });
  });

  function createParticle(x, y) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:fixed; z-index:9999; pointer-events:none;
      width:4px; height:4px; border-radius:50%;
      background:rgba(0,212,255,0.6);
      left:${x}px; top:${y}px;
      transform:translate(-50%,-50%) scale(1);
      transition: all 0.6s ease;
    `;
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      const angle  = Math.random() * Math.PI * 2;
      const dist   = 30 + Math.random() * 40;
      p.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 700);
  }

});
