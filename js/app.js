/* ============================================================
   app.js — メインスクリプト
   ============================================================ */

// ---- Groom Masonry 背景（上下交互スクロール） ----
const GROOM_BG_IMAGES = [
  'LINE_ALBUM_20220715-18金沢富山_260615_1.jpg',
  'LINE_ALBUM_202446-7ハリポタ_260615_1.jpg',
  'LINE_ALBUM_20221229-202312_260615_1.jpg',
  'LINE_ALBUM_202453-6_260615_8.jpg',
  'LINE_ALBUM_202251-5_260615_2.jpg',
  'LINE_ALBUM_2022923-25岐阜_260615_2.jpg',
  'LINE_ALBUM_202446-7ハリポタ_260615_2.jpg',
  'LINE_ALBUM_20220715-18金沢富山_260615_2.jpg',
  'LINE_ALBUM_20221229-202312_260615_2.jpg',
  'LINE_ALBUM_202446-7ハリポタ_260615_14.jpg',
  'LINE_ALBUM_202251-5_260615_3.jpg',
  'LINE_ALBUM_202453-6_260615_6.jpg',
];

(function buildGroomMasonry() {
  const container = document.getElementById('groomMasonryBg');
  if (!container) return;

  const GAP      = 3;
  const numCols  = window.innerWidth >= 900 ? 4 : window.innerWidth >= 640 ? 3 : 2;
  const colW     = Math.floor((container.offsetWidth - GAP * (numCols - 1)) / numCols);

  // aspect-ratio: 3/4 なので imgH = colW × (4/3)
  // 1セット = GROOM_BG_IMAGES.length 枚 + (length-1) × GAP
  const N     = GROOM_BG_IMAGES.length;          // 12
  const imgH  = colW * (4 / 3);
  const halfH = N * imgH + (N - 1) * GAP;        // 1セット分の高さ（= 上下ループ境界）

  // 列ごとの速度（px / rAF ≒ 60fps）と開始画像ずらし
  const speeds    = [0.1, 0.07, 0.1, 0.09];
  const rotations = [0, 3, 7, 10];

  const positions = [];
  const cols      = [];

  for (let c = 0; c < numCols; c++) {
    const col = document.createElement('div');
    col.className   = 'masonry-col';
    col.style.width = colW + 'px';
    col.style.left  = (c * (colW + GAP)) + 'px';

    // 列ごとに開始画像をずらして見た目に変化
    const rot  = rotations[c % rotations.length];
    const imgs = [...GROOM_BG_IMAGES.slice(rot), ...GROOM_BG_IMAGES.slice(0, rot)];

    // [セット A][セット B（= A の複製）] → シームレスループ
    [...imgs, ...imgs].forEach((name, i) => {
      const img    = document.createElement('img');
      img.src      = 'images/GROOMbackg/' + encodeURIComponent(name);
      img.alt      = '';
      img.loading  = i < numCols ? 'eager' : 'lazy';
      img.decoding = 'async';
      col.appendChild(img);
    });

    container.appendChild(col);
    cols.push(col);

    // 偶数列(0,2)=上スクロール → pos:0 スタート
    // 奇数列(1,3)=下スクロール → pos:-halfH スタート（セットBの先頭 = セットAと同じ見た目）
    positions.push(c % 2 === 1 ? -halfH : 0);
  }

  let rafId;

  const animate = () => {
    for (let c = 0; c < cols.length; c++) {
      const spd    = speeds[c % speeds.length];
      const isDown = c % 2 === 1;

      if (isDown) {
        // 下スクロール: 要素が下へ移動 → translateY が -halfH → 0 へ増加
        positions[c] += spd;
        if (positions[c] >= 0) positions[c] = -halfH;   // 0 に達したら B 先頭に戻す
      } else {
        // 上スクロール: 要素が上へ移動 → translateY が 0 → -halfH へ減少
        positions[c] -= spd;
        if (positions[c] <= -halfH) positions[c] = 0;   // B 先頭に達したら A 先頭に戻す
      }

      cols[c].style.transform = `translateY(${positions[c]}px)`;
    }
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  // 非表示タブでは停止してバッテリー節約
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(animate);
  });
})();

// ---- Bride Masonry 背景（上下交互スクロール・ランダム速度） ----
const BRIDE_BG_IMAGES = [
  'LINE_ALBUM_20220715-18金沢富山_260615_3.jpg',
  'LINE_ALBUM_2022120-23_260615_1.jpg',
  'LINE_ALBUM_202251-5_260615_1.jpg',
  'LINE_ALBUM_202251-5_260615_2.jpg',
  'LINE_ALBUM_2022923-25岐阜_260615_1.jpg',
  'LINE_ALBUM_2023113.4大阪旅行_260615_1.jpg',
  'LINE_ALBUM_2023915-18_260615_1.jpg',
  'LINE_ALBUM_202446-7ハリポタ_260615_2.jpg',
  'LINE_ALBUM_202453-6_260615_10.jpg',
  'LINE_ALBUM_202453-6_260615_7.jpg',
  'LINE_ALBUM_202453-6_260615_9.jpg',
];

(function buildBrideMasonry() {
  const container = document.getElementById('brideMasonryBg');
  if (!container) return;

  const GAP     = 3;
  const numCols = window.innerWidth >= 900 ? 4 : window.innerWidth >= 640 ? 3 : 2;
  const colW    = Math.floor((container.offsetWidth - GAP * (numCols - 1)) / numCols);

  const N     = BRIDE_BG_IMAGES.length;          // 11
  const imgH  = colW * (4 / 3);
  const halfH = N * imgH + (N - 1) * GAP;

  // 列ごとに 0.05〜0.1 のランダム速度
  const speeds = Array.from({ length: numCols }, () =>
    Math.random() * 0.05 + 0.05
  );

  const rotations = [0, 4, 8, 2];

  const positions = [];
  const cols      = [];

  for (let c = 0; c < numCols; c++) {
    const col = document.createElement('div');
    col.className   = 'masonry-col';
    col.style.width = colW + 'px';
    col.style.left  = (c * (colW + GAP)) + 'px';

    const rot  = rotations[c % rotations.length];
    const imgs = [...BRIDE_BG_IMAGES.slice(rot), ...BRIDE_BG_IMAGES.slice(0, rot)];

    [...imgs, ...imgs].forEach((name, i) => {
      const img    = document.createElement('img');
      img.src      = 'images/BRIDEbackg/' + encodeURIComponent(name);
      img.alt      = '';
      img.loading  = i < numCols ? 'eager' : 'lazy';
      img.decoding = 'async';
      col.appendChild(img);
    });

    container.appendChild(col);
    cols.push(col);
    positions.push(c % 2 === 1 ? -halfH : 0);
  }

  let rafId;

  const animate = () => {
    for (let c = 0; c < cols.length; c++) {
      const isDown = c % 2 === 1;

      if (isDown) {
        positions[c] += speeds[c];
        if (positions[c] >= 0) positions[c] = -halfH;
      } else {
        positions[c] -= speeds[c];
        if (positions[c] <= -halfH) positions[c] = 0;
      }

      cols[c].style.transform = `translateY(${positions[c]}px)`;
    }
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(animate);
  });
})();

// ---- Scroll fade-in (IntersectionObserver) ----
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    // profile items: 少しずつ時間差で表示
    const delay = entry.target.closest('.profile__list')
      ? Array.from(entry.target.parentElement.querySelectorAll('.fade-in')).indexOf(entry.target) * 90
      : 0;
    setTimeout(() => entry.target.classList.add('is-visible'), delay);
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ---- Hero Ken Burns 起動 ----
window.addEventListener('load', () => {
  document.getElementById('opening').classList.add('is-active');
});

// ---- Welcome ボタン: 次セクションへスクロール ----
function scrollToNext() {
  const next = document.getElementById('opening').nextElementSibling;
  if (next) next.scrollIntoView({ behavior: 'smooth' });
}

// ---- コード入力 ----
function submitCode() {
  const input   = document.getElementById('codeInput');
  const errorEl = document.getElementById('codeError');
  const code    = input.value.trim().toUpperCase();

  if (!code) {
    showError('コードを入力してください');
    return;
  }

  const guest = GUESTS[code];
  if (!guest) {
    showError('コードが正しくありません。席札をご確認ください。');
    input.value = '';
    input.focus();
    return;
  }

  errorEl.textContent = '';
  openGuestPage(guest);
}

function showError(msg) {
  const el = document.getElementById('codeError');
  el.textContent = msg;
  // 少し揺らしてフィードバック
  el.style.animation = 'none';
  requestAnimationFrame(() => { el.style.animation = ''; });
}

// ---- ゲストページ開閉 ----
function openGuestPage(guest) {
  document.getElementById('guestName').textContent    = guest.name;
  document.getElementById('guestMessage').textContent = guest.message;

  const imgEl   = document.getElementById('guestImage');
  const wrapEl  = document.getElementById('guestImageWrap');

  if (guest.image) {
    imgEl.src = guest.image;
    wrapEl.classList.remove('is-hidden');
  } else {
    imgEl.src = '';
    wrapEl.classList.add('is-hidden');
  }

  const page = document.getElementById('guestPage');
  page.classList.remove('hidden');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeGuestPage() {
  document.getElementById('guestPage').classList.add('hidden');
  document.body.style.overflow = '';
  document.getElementById('codeInput').value = '';
  document.getElementById('codeError').textContent = '';
}

// ---- Film Strip: 画面幅に応じてフレームを自動複製 ----
(function initFilmStrips() {
  const FRAME_W = 64;
  const GAP     = 6;

  document.querySelectorAll('.film-strip__track').forEach(track => {
    const origFrames = Array.from(track.children);
    if (!origFrames.length) return;

    const setW = origFrames.length * (FRAME_W + GAP);

    // 画面幅の3倍以上になるまで複製
    const needed = Math.ceil(window.innerWidth * 3 / setW);
    for (let i = 1; i < needed; i++) {
      origFrames.forEach(f => track.appendChild(f.cloneNode(true)));
    }

    // アニメーション距離 = 元の1セット幅（px）
    track.style.setProperty('--film-offset', `-${setW}px`);
  });
})();

// ---- Enter キー対応 ----
document.getElementById('codeInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitCode();
});

// ---- ESC キーでゲストページを閉じる ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('guestPage').classList.contains('hidden')) {
    closeGuestPage();
  }
});
