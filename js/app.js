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
  const cW       = container.offsetWidth;
  const numCols  = cW >= 900 ? 4 : cW >= 640 ? 3 : 2;
  const colW     = Math.floor((cW - GAP * (numCols - 1)) / numCols);

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
  const cW      = container.offsetWidth;
  const numCols = cW >= 900 ? 4 : cW >= 640 ? 3 : 2;
  const colW    = Math.floor((cW - GAP * (numCols - 1)) / numCols);

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

// パスのセグメントごとにエンコード（フォルダ名含むパス対応）
function travelPath(p) {
  return 'images/travels/' + p.split('/').map(encodeURIComponent).join('/');
}

// ---- Travel Gallery ----
const TRAVELS = [
  {
    cover:  '東北2022.5/LINE_ALBUM_202251-5_260618_1.jpg',
    images: [
      '東北2022.5/LINE_ALBUM_202251-5_260618_1.jpg',
      '東北2022.5/LINE_ALBUM_202251-5_260618_2.jpg',
      '東北2022.5/LINE_ALBUM_202251-5_260618_3.jpg',
      '東北2022.5/LINE_ALBUM_202251-5_260618_4.jpg',
    ],
    label: '東北', date: '2022.05',
  },
  {
    cover:  '岐阜2022.9/LINE_ALBUM_2022923-25岐阜_260618_1.jpg',
    images: [
      '岐阜2022.9/LINE_ALBUM_2022923-25岐阜_260618_1.jpg',
      '岐阜2022.9/LINE_ALBUM_2022923-25岐阜_260618_2.jpg',
      '岐阜2022.9/LINE_ALBUM_2022923-25岐阜_260618_3.jpg',
      '岐阜2022.9/LINE_ALBUM_2022923-25岐阜_260618_4.jpg',
    ],
    label: '岐阜', date: '2022.09',
  },
  {
    cover:  '鳥取・島根・兵庫2023.5/LINE_ALBUM_20230503-07_260618_2.jpg',
    images: [
      '鳥取・島根・兵庫2023.5/LINE_ALBUM_20230503-07_260618_2.jpg',
      '鳥取・島根・兵庫2023.5/LINE_ALBUM_20230503-07_260618_3.jpg',
      '鳥取・島根・兵庫2023.5/LINE_ALBUM_20230503-07_260618_4.jpg',
      '鳥取・島根・兵庫2023.5/LINE_ALBUM_20230503-07_260618_5.jpg',
    ],
    label: '鳥取・島根・兵庫', date: '2023.05',
  },
  {
    cover:  '大阪2023.11/LINE_ALBUM_2023113.4大阪旅行_260619_1.jpg',
    images: [
      '大阪2023.11/LINE_ALBUM_2023113.4大阪旅行_260619_1.jpg',
      '大阪2023.11/LINE_ALBUM_2023113.4大阪旅行_260619_2.jpg',
      '大阪2023.11/LINE_ALBUM_2023113.4大阪旅行_260619_3.jpg',
      '大阪2023.11/LINE_ALBUM_2023113.4大阪旅行_260619_4.jpg',
    ],
    label: '大阪', date: '2023.11',
  },
  {
    cover:  '静岡2024.5/LINE_ALBUM_202453-6_260619_1.jpg',
    images: [
      '静岡2024.5/LINE_ALBUM_202453-6_260619_1.jpg',
      '静岡2024.5/LINE_ALBUM_202453-6_260619_2.jpg',
      '静岡2024.5/LINE_ALBUM_202453-6_260619_3.jpg',
      '静岡2024.5/LINE_ALBUM_202453-6_260619_4.jpg',
    ],
    label: '静岡', date: '2024.05',
  },
  {
    cover:  '北海道2025.5/LINE_ALBUM_20250504-06北海道_260619_1.jpg',
    images: [
      '北海道2025.5/LINE_ALBUM_20250504-06北海道_260619_1.jpg',
      '北海道2025.5/LINE_ALBUM_20250504-06北海道_260619_2.jpg',
      '北海道2025.5/LINE_ALBUM_20250504-06北海道_260619_3.jpg',
      '北海道2025.5/LINE_ALBUM_20250504-06北海道_260619_4.jpg',
    ],
    label: '北海道', date: '2025.05',
  },
];

(function initCoverFlow() {
  const gallery = document.getElementById('travelGallery');
  if (!gallery) return;

  const total  = TRAVELS.length;
  let current  = 0;

  // Cover Flow の各位置パラメータ
  // offset: 0=center, ±1=隣, ±2=その外, それ以上は非表示
  function getTransform(offset) {
    if (offset === 0)
      return 'translateX(0px) translateZ(80px) rotateY(0deg) scale(1.25)';
    const sign  = offset > 0 ? 1 : -1;
    const abs   = Math.abs(offset);
    const tx    = sign * (130 + (abs - 1) * 70);
    const tz    = -abs * 20;
    const scale = abs === 1 ? 0.88 : 0.72;
    return `translateX(${tx}px) translateZ(${tz}px) rotateY(${-sign * 68}deg) scale(${scale})`;
  }

  // stage（perspective コンテナ）
  const stage = document.createElement('div');
  stage.className = 'carousel-stage';

  const cards = TRAVELS.map((t, i) => {
    const card = document.createElement('div');
    card.className = 'travel-card';
    card.innerHTML =
      `<img class="travel-card__img" src="${travelPath(t.cover)}" alt="${t.label}">` +
      `<div class="travel-card__overlay"></div>` +
      `<div class="travel-card__info">` +
        `<span class="travel-card__date">${t.date}</span>` +
        `<span class="travel-card__label">${t.label}</span>` +
      `</div>`;

    card.addEventListener('click', () => {
      if (i === current) {
        openTravelModal(t);       // 中央カード → モーダルを開く
      } else {
        current = i;              // 端のカード → 中央へ移動
        update();
      }
    });

    stage.appendChild(card);
    return card;
  });

  gallery.appendChild(stage);


  function update() {
    cards.forEach((card, i) => {
      // current を基準にした offset（ループ対応）
      let offset = i - current;
      if (offset >  total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const visible = Math.abs(offset) <= 2;
      card.style.visibility = visible ? 'visible' : 'hidden';
      card.style.transform  = getTransform(offset);
      card.style.zIndex     = 10 - Math.abs(offset);
      card.classList.toggle('is-active', offset === 0);
    });
  }

  // スワイプ対応
  let touchStartX = 0;
  gallery.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  gallery.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      current = diff > 0
        ? (current + 1) % total
        : (current - 1 + total) % total;
      update();
    }
  });

  update();
})();

// ---- Film Strip: 映画画像をランダムに2トラックへ配置 ----
const MOVIES = [
  {
    file: 'アイアンマン.jfif',
    title: 'Iron Man',
    message: 'マーベルにどっぷりハマるきっかけになった一本。\nトニー・スタークのかっこよさに二人そろってやられました。アベンジャーズ全作、一緒に観破りましたよ。',
  },
  {
    file: 'キャプテンアメリカ.jfif',
    title: 'Captain America',
    message: '正直さと誠実さを貫くスティーブ・ロジャースが大好き。\nどんな時代でもブレない生き方。こんなふうでありたいと、二人で話した映画です。',
  },
  {
    file: 'グリーンマイル.jfif',
    title: 'The Green Mile',
    message: '何度観ても、最後は必ず泣いてしまう名作。\n誰かを想うことの深さ、命の重さ。観るたびに大切なものを思い出させてくれます。',
  },
  {
    file: 'スターウォーズ.jfif',
    title: 'Star Wars',
    message: '壮大な世界観とともに育ってきた作品。\nいつか子どもたちと並んでソファで観るのが夢のひとつです。',
  },
  {
    file: 'ハリーポッター.jfif',
    title: 'Harry Potter',
    message: '社会人になってから二人でUSJのハリポタエリアへ。\n大人になっても魔法の世界に夢中になれる。そんなふたりでいたいと思っています。',
  },
  {
    file: 'バックトゥザフューチャー.jfif',
    title: 'Back to the Future',
    message: '「タイムマシンがあったらどこへ行く？」\nそんな話をするのが好きな会話のひとつ。でも結局、今が一番だと思えます。',
  },
  {
    file: 'フォレストガンプ.jfif',
    title: 'Forrest Gump',
    message: 'ふたりで最初に一緒に観た映画。\n"Life is like a box of chocolates." — この言葉みたいに、これからの日々も何が待っているか楽しみです。',
  },
  {
    file: 'ホームアローン.jfif',
    title: 'Home Alone',
    message: 'クリスマスシーズンになると必ず観たくなる一本。\nあの頃の純粋な笑いが大好き。二人で毎年観ようと決めています。',
  },
  {
    file: '幸せの隠れ場所.jfif',
    title: 'The Blind Side',
    message: '実話に基づいた、愛の物語。\n誰かのために真剣になれることの強さ、やさしさ。観終わった後、じんわりと温かくなれます。',
  },
];

(function initFilmFrames() {
  const tracks = document.querySelectorAll('.film-strip__track');
  if (!tracks.length) return;

  // Fisher-Yates シャッフル
  const shuffled = [...MOVIES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 2トラックに分配（上: 前半, 下: 後半）
  const mid = Math.ceil(shuffled.length / 2);
  const lists = [shuffled.slice(0, mid), shuffled.slice(mid)];

  tracks.forEach((track, i) => {
    lists[i % lists.length].forEach((m, idx) => {
      const frame = document.createElement('div');
      frame.className = 'film-frame';
      frame.dataset.movieIdx = MOVIES.indexOf(m);
      frame.innerHTML =
        `<img class="film-frame__img" src="images/movies/${encodeURIComponent(m.file)}" alt="${m.title}">` +
        `<span class="film-frame__title">${m.title}</span>`;
      track.appendChild(frame);
    });
  });

  // cloneNode はリスナーをコピーしないので、親要素で委譲
  document.querySelectorAll('.film-strip-wrap').forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      const frame = e.target.closest('.film-frame');
      if (!frame) return;
      const idx = parseInt(frame.dataset.movieIdx, 10);
      if (!isNaN(idx) && MOVIES[idx]) openMovieModal(MOVIES[idx]);
    });
  });
})();

// ---- Movie Modal 開閉 ----
function openMovieModal(movie) {
  const modal = document.getElementById('movieModal');
  document.getElementById('movieModalImg').src    = 'images/movies/' + encodeURIComponent(movie.file);
  document.getElementById('movieModalImg').alt    = movie.title;
  document.getElementById('movieModalTitle').textContent   = movie.title;
  document.getElementById('movieModalMessage').textContent = movie.message;

  modal.classList.remove('hidden');
  modal.scrollTop = 0;
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}

function closeMovieModal() {
  const modal = document.getElementById('movieModal');
  modal.classList.remove('is-open');
  modal.addEventListener('transitionend', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, { once: true });
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

// ---- Travel Modal 開閉 ----
function openTravelModal(travel) {
  document.getElementById('travelModalLabel').textContent = travel.label;
  document.getElementById('travelModalDate').textContent  = travel.date;

  const grid = document.getElementById('travelModalGrid');
  grid.innerHTML = travel.images.slice(0, 4).map(f =>
    `<img src="${travelPath(f)}" alt="${travel.label}">`
  ).join('');

  const modal = document.getElementById('travelModal');
  modal.classList.remove('hidden');
  modal.scrollTop = 0;
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}

function closeTravelModal() {
  const modal = document.getElementById('travelModal');
  modal.classList.remove('is-open');
  modal.addEventListener('transitionend', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, { once: true });
}

// ---- ESC キーでオーバーレイを閉じる ----
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!document.getElementById('guestPage').classList.contains('hidden'))   closeGuestPage();
  if (!document.getElementById('movieModal').classList.contains('hidden'))   closeMovieModal();
  if (!document.getElementById('travelModal').classList.contains('hidden'))  closeTravelModal();
});
