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

// ---- 合言葉入力（ステップ1） ----
let currentGroup = null;

function submitPassphrase() {
  const input  = document.getElementById('codeInput');
  const phrase = input.value.trim().toUpperCase();

  if (!phrase) {
    showCodeError('合言葉を入力してください');
    return;
  }

  const entry = Object.values(GROUPS).find(g => g.passphrase.toUpperCase() === phrase);
  if (!entry) {
    showCodeError('合言葉が正しくありません。席札をご確認ください。');
    input.value = '';
    input.focus();
    return;
  }

  document.getElementById('codeError').textContent = '';
  input.value = '';
  currentGroup = entry;
  openGroupPage(entry);
}

function showCodeError(msg) {
  const el = document.getElementById('codeError');
  el.textContent = msg;
  el.style.animation = 'none';
  requestAnimationFrame(() => { el.style.animation = ''; });
}

// ---- 中学グループ専用: バスケアニメーション（GBA風ループ） ----
// キャラクター画像だけを BBALL_SPRITE_SOURCES で差し替えれば他のキャラクターでも再利用できる。
const BBALL_SPRITE_SOURCES = {
  idle: 'images/groupLP/TYNJH/sprites/idle_1.png',
  dribble: [
    'images/groupLP/TYNJH/sprites/db_1.png',
    'images/groupLP/TYNJH/sprites/db_2.png',
    'images/groupLP/TYNJH/sprites/db_3.png',
    'images/groupLP/TYNJH/sprites/db_4.png',
  ],
  shoot: [
    'images/groupLP/TYNJH/sprites/shoot_1.png',
    'images/groupLP/TYNJH/sprites/shoot_2.png',
    'images/groupLP/TYNJH/sprites/shoot_3.png',
  ],
  landing: [
    'images/groupLP/TYNJH/sprites/landing_1.png',
    'images/groupLP/TYNJH/sprites/landing_2.png',
  ],
  guts: 'images/groupLP/TYNJH/sprites/guts.png',
  ball: 'images/groupLP/TYNJH/sprites/ball.png',
  goal: [
    'images/groupLP/TYNJH/sprites/goal_0.png',
    'images/groupLP/TYNJH/sprites/goal_1.png',
    'images/groupLP/TYNJH/sprites/goal_2.png',
    'images/groupLP/TYNJH/sprites/goal_3.png',
  ],
};

const BBALL_CONFIG = {
  CHARACTER_SCALE: 1.36,
  START_X_RATIO: 0.1,
  SHOOT_X_RATIO: 0.5,
  JUMP_HEIGHT: 27,
  GROUND_BOTTOM: 14,
  IDLE_BOB_AMPLITUDE: 2,
  DRIBBLE_BOB: [0, 1, 3, 1],
  BALL_DISPLAY_SIZE: 30,
  BALL_ARC_HEIGHT: 76,
  RELEASE_OFFSET_X_RATIO: 0.34,
  RELEASE_OFFSET_Y_RATIO: 0.08,
  GOAL_DISPLAY_SIZE: 121,
  GOAL_X_RATIO: 0.82,
  GOAL_TOP: 16,
  GOAL_RIM_X_RATIO: 0.53,
  GOAL_RIM_Y_RATIO: 0.58,
  GOAL_SEQUENCE_THRESHOLDS: { approach: 0.85, rim: 0.92, through: 0.97 },
  FRAME_DURATION: {
    IDLE: 600,
    DRIBBLE: 150,
    DRIBBLE_LOOPS: 4,
    SHOOT_PREP: 260,
    SHOOT_JUMP: 240,
    SHOOT_RELEASE: 200,
    BALL_FLIGHT: 900,
    LANDING_1: 220,
    LANDING_2: 260,
    GUTS: 800,
  },
};

class BballSprite {
  constructor(parentEl, className) {
    this.el = document.createElement('div');
    this.el.className = className;
    parentEl.appendChild(this.el);
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this._currentSrc = null;
  }
  setFrame(src) {
    if (src === this._currentSrc) return;
    this._currentSrc = src;
    this.el.style.backgroundImage = `url("${src}")`;
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this._render();
  }
  setScale(sx, sy) {
    this.scaleX = sx;
    this.scaleY = sy === undefined ? sx : sy;
    this._render();
  }
  setOpacity(v) {
    this.el.style.opacity = String(v);
  }
  _render() {
    this.el.style.transform =
      `translate(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px) ` +
      `scale(${this.scaleX}, ${this.scaleY})`;
  }
}

class BballBall {
  constructor(parentEl, displaySize) {
    this.sprite = new BballSprite(parentEl, 'bball-sprite bball-ball');
    this.sprite.el.style.width = '64px';
    this.sprite.el.style.height = '64px';
    const scale = displaySize / 64;
    this.sprite.setScale(scale, scale);
    this.sprite.setFrame(BBALL_SPRITE_SOURCES.ball);
    this.sprite.setOpacity(0);
    this.displaySize = displaySize;
    this.active = false;
    this.elapsed = 0;
    this.duration = 0;
    this.arcHeight = 0;
    this.start = { x: 0, y: 0 };
    this.end = { x: 0, y: 0 };
  }
  _placeAtCenter(cx, cy) {
    this.sprite.setPosition(cx - this.displaySize / 2, cy - this.displaySize / 2);
  }
  startFlight(fromCenter, toCenter, durationMs, arcHeight) {
    this.start = fromCenter;
    this.end = toCenter;
    this.duration = durationMs;
    this.arcHeight = arcHeight;
    this.elapsed = 0;
    this.active = true;
    this.sprite.setOpacity(1);
    this._placeAtCenter(fromCenter.x, fromCenter.y);
  }
  hide() {
    this.active = false;
    this.sprite.setOpacity(0);
  }
  update(dtMs) {
    if (!this.active) return null;
    this.elapsed += dtMs;
    const t = Math.min(Math.max(this.elapsed / this.duration, 0), 1);
    const cx = this.start.x + (this.end.x - this.start.x) * t;
    const cy = this.start.y + (this.end.y - this.start.y) * t - this.arcHeight * 4 * t * (1 - t);
    this._placeAtCenter(cx, cy);
    if (t >= 1) this.active = false;
    return t;
  }
}

class BballAnimationController {
  constructor(stageEl, config, sources) {
    this.stageEl = stageEl;
    this.cfg = config;
    this.sources = sources;
    this.character = new BballSprite(stageEl, 'bball-sprite bball-character');
    this.goal = new BballSprite(stageEl, 'bball-sprite bball-goal');
    this.ball = new BballBall(stageEl, this.cfg.BALL_DISPLAY_SIZE);
    const goalScale = this.cfg.GOAL_DISPLAY_SIZE / 64;
    this.goal.setScale(goalScale, goalScale);
    this.character.setScale(this.cfg.CHARACTER_SCALE, this.cfg.CHARACTER_SCALE);
    this._buildPhases();
    this._layout();
    this._phaseIndex = 0;
    this._phaseElapsed = 0;
    this._lastTs = null;
    this._raf = null;
    this._onResizeBound = () => this._onResize();
    window.addEventListener('resize', this._onResizeBound);
    this.phases[0].enter.call(this);
    this._loop = this._loop.bind(this);
  }
  start() {
    if (this._raf) return;
    this._lastTs = null;
    this._raf = requestAnimationFrame(this._loop);
  }
  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }
  destroy() {
    this.stop();
    window.removeEventListener('resize', this._onResizeBound);
  }
  _onResize() {
    if (this._resizeQueued) return;
    this._resizeQueued = true;
    requestAnimationFrame(() => {
      this._resizeQueued = false;
      this._layout();
    });
  }
  _layout() {
    const w = this.stageEl.clientWidth;
    const h = this.stageEl.clientHeight;
    const cfg = this.cfg;
    this.charW = 64 * cfg.CHARACTER_SCALE;
    this.charH = 64 * cfg.CHARACTER_SCALE;
    this.groundY = h - cfg.GROUND_BOTTOM;
    this.startCenterX = w * cfg.START_X_RATIO;
    this.shootCenterX = w * cfg.SHOOT_X_RATIO;
    this.goalX = w * cfg.GOAL_X_RATIO - this.cfg.GOAL_DISPLAY_SIZE / 2;
    this.goalY = cfg.GOAL_TOP;
    this.goal.setPosition(this.goalX, this.goalY);
    this.goalRimCenter = {
      x: this.goalX + this.cfg.GOAL_DISPLAY_SIZE * cfg.GOAL_RIM_X_RATIO,
      y: this.goalY + this.cfg.GOAL_DISPLAY_SIZE * cfg.GOAL_RIM_Y_RATIO,
    };
  }
  _placeCharacter(centerX, jumpOffsetY, squashY) {
    const sy = squashY === undefined ? 1 : squashY;
    this.character.setScale(this.cfg.CHARACTER_SCALE, this.cfg.CHARACTER_SCALE * sy);
    this.character.setPosition(centerX - 32, this.groundY - 64 + jumpOffsetY);
  }
  _updateGoalForFlight(t) {
    const th = this.cfg.GOAL_SEQUENCE_THRESHOLDS;
    const g = this.sources.goal;
    if (t < th.approach) {
      this.goal.setFrame(g[0]);
      this.ball.sprite.setOpacity(1);
      return;
    }
    this.ball.sprite.setOpacity(0);
    if (t < th.rim) {
      this.goal.setFrame(g[1]);
    } else if (t < th.through) {
      this.goal.setFrame(g[2]);
    } else {
      this.goal.setFrame(g[3]);
    }
  }
  _buildPhases() {
    const cfg = this.cfg;
    const fd = cfg.FRAME_DURATION;
    const src = this.sources;
    const dribbleCycleMs = fd.DRIBBLE * src.dribble.length;
    const dribbleMoveDuration = dribbleCycleMs * fd.DRIBBLE_LOOPS;
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
    const easeInQuad = (t) => t * t;
    const lerp = (a, b, t) => a + (b - a) * t;

    this.phases = [
      {
        name: 'idle',
        duration: fd.IDLE,
        enter: function () {
          this.goal.setFrame(this.sources.goal[0]);
          this.ball.hide();
          this.character.setFrame(this.sources.idle);
          this._placeCharacter(this.startCenterX, 0, 1);
        },
        update: function (p) {
          const bob = Math.sin(p * Math.PI) * cfg.IDLE_BOB_AMPLITUDE;
          this._placeCharacter(this.startCenterX, -bob, 1);
        },
      },
      {
        name: 'dribbleMove',
        duration: dribbleMoveDuration,
        enter: function () {
          this.character.setFrame(this.sources.dribble[0]);
        },
        update: function (p, elapsed) {
          const eased = easeInOutSine(p);
          const centerX = lerp(this.startCenterX, this.shootCenterX, eased);
          const frameIndex = Math.floor(elapsed / fd.DRIBBLE) % src.dribble.length;
          this.character.setFrame(src.dribble[frameIndex]);
          const bob = cfg.DRIBBLE_BOB[frameIndex] || 0;
          this._placeCharacter(centerX, bob, 1);
        },
      },
      {
        name: 'shootPrep',
        duration: fd.SHOOT_PREP,
        enter: function () {
          this.character.setFrame(this.sources.shoot[0]);
        },
        update: function (p) {
          const squash = 1 - 0.07 * Math.sin(Math.PI * p);
          this._placeCharacter(this.shootCenterX, 0, squash);
        },
      },
      {
        name: 'shootJump',
        duration: fd.SHOOT_JUMP,
        enter: function () {
          this.character.setFrame(this.sources.shoot[1]);
        },
        update: function (p) {
          const eased = easeOutQuad(p);
          const jump = -cfg.JUMP_HEIGHT * eased;
          const stretch = 1 + 0.03 * Math.sin(Math.PI * p);
          this._placeCharacter(this.shootCenterX, jump, stretch);
        },
      },
      {
        name: 'shootRelease',
        duration: fd.SHOOT_RELEASE,
        enter: function () {
          this.character.setFrame(this.sources.shoot[2]);
          const releaseCenter = {
            x: this.shootCenterX + this.charW * cfg.RELEASE_OFFSET_X_RATIO,
            y: this.groundY - this.charH - cfg.JUMP_HEIGHT + this.charH * cfg.RELEASE_OFFSET_Y_RATIO,
          };
          const totalFlight = fd.SHOOT_RELEASE + fd.BALL_FLIGHT;
          const visibleFlightDuration = totalFlight * cfg.GOAL_SEQUENCE_THRESHOLDS.approach;
          this.ball.startFlight(releaseCenter, this.goalRimCenter, visibleFlightDuration, cfg.BALL_ARC_HEIGHT);
        },
        update: function (p, elapsed) {
          const eased = easeInQuad(p);
          const jump = -cfg.JUMP_HEIGHT * (1 - eased);
          this._placeCharacter(this.shootCenterX, jump, 1);
          const totalFlight = fd.SHOOT_RELEASE + fd.BALL_FLIGHT;
          this._updateGoalForFlight(elapsed / totalFlight);
        },
      },
      {
        name: 'ballFlight',
        duration: fd.BALL_FLIGHT,
        enter: function () {
          this.character.setFrame(this.sources.shoot[2]);
        },
        update: function (p, elapsed) {
          this._placeCharacter(this.shootCenterX, 0, 1);
          const totalFlight = fd.SHOOT_RELEASE + fd.BALL_FLIGHT;
          this._updateGoalForFlight((fd.SHOOT_RELEASE + elapsed) / totalFlight);
        },
      },
      {
        name: 'landing1',
        duration: fd.LANDING_1,
        enter: function () {
          this.character.setFrame(this.sources.landing[0]);
        },
        update: function (p) {
          const squash = 1 - 0.1 * Math.sin(Math.PI * p);
          this._placeCharacter(this.shootCenterX, 0, squash);
        },
      },
      {
        name: 'landing2',
        duration: fd.LANDING_2,
        enter: function () {
          this.character.setFrame(this.sources.landing[1]);
        },
        update: function () {
          this._placeCharacter(this.shootCenterX, 0, 1);
        },
      },
      {
        name: 'guts',
        duration: fd.GUTS,
        enter: function () {
          this.character.setFrame(this.sources.guts);
        },
        update: function (p) {
          const hop = -8 * Math.sin(Math.PI * p);
          const stretch = 1 + 0.05 * Math.sin(Math.PI * p);
          this._placeCharacter(this.shootCenterX, hop, stretch);
        },
      },
    ];
  }
  _advancePhase(dt) {
    let remaining = dt;
    while (remaining > 0) {
      const phase = this.phases[this._phaseIndex];
      const remainingInPhase = phase.duration - this._phaseElapsed;
      if (remaining < remainingInPhase) {
        this._phaseElapsed += remaining;
        phase.update.call(this, this._phaseElapsed / phase.duration, this._phaseElapsed);
        remaining = 0;
      } else {
        this._phaseElapsed = phase.duration;
        phase.update.call(this, 1, this._phaseElapsed);
        remaining -= remainingInPhase;
        this._phaseIndex = (this._phaseIndex + 1) % this.phases.length;
        this._phaseElapsed = 0;
        this.phases[this._phaseIndex].enter.call(this);
      }
    }
  }
  _loop(ts) {
    if (this._lastTs === null) this._lastTs = ts;
    let dt = ts - this._lastTs;
    this._lastTs = ts;
    if (dt > 100) dt = 100;
    this._advancePhase(dt);
    this.ball.update(dt);
    this._raf = requestAnimationFrame(this._loop);
  }
}

let bballController = null;

// 中学グループのページを開いたときにだけ生成・開始する（初期ロードに影響しないよう遅延初期化）
function initBballAnimation() {
  const stage = document.getElementById('bballStage');
  if (!stage) return;
  if (!bballController) {
    bballController = new BballAnimationController(stage, BBALL_CONFIG, BBALL_SPRITE_SOURCES);
  }
  bballController.start();
}

function stopBballAnimation() {
  if (bballController) bballController.stop();
}

// ---- 高校グループ専用: 思い出フォトストーリー（散乱 → ギャラリー → 収束） ----
function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

class PhotoStoryController {
  constructor(rootEl) {
    this.root = rootEl;
    this.group = null;
    this.tiles = [];
    this.hasPlayed = false;
    this.lightboxIndex = 0;
    this.scatterTl = null;
    this.endingTl = null;

    this._bindStage1Click();
    this._bindLightbox();
  }

  // group.photos を元にDOMを毎回作り直し、stage1から再生できる状態に戻す
  render(group) {
    this.reset();
    this.group = group;

    const heroImg = document.getElementById('psHeroImage');
    heroImg.src = group.heroImage;
    heroImg.alt = group.name || '';

    const anchor = document.getElementById('psEndingAnchor');
    anchor.src = group.endingImage || group.heroImage;
    anchor.alt = group.name || '';

    document.getElementById('psEndingMessage').textContent = group.message || '';

    const scatterLayer = document.getElementById('psScatterLayer');
    const photos = group.photos || [];
    this.tiles = photos.map((src, i) => {
      const tile = document.createElement('div');
      tile.className = 'photo-story__tile';
      if (i % 4 === 0) tile.classList.add('photo-story__tile--featured');
      const img = document.createElement('img');
      img.className = 'photo-story__tile-img';
      img.src = src;
      img.alt = group.name || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      tile.appendChild(img);
      tile.addEventListener('click', () => this.openLightbox(i));
      scatterLayer.appendChild(tile);
      return tile;
    });
  }

  reset() {
    if (this.scatterTl) { this.scatterTl.kill(); this.scatterTl = null; }
    if (this.endingTl) {
      if (this.endingTl.scrollTrigger) this.endingTl.scrollTrigger.kill();
      this.endingTl.kill();
      this.endingTl = null;
    }
    if (window.gsap && this.tiles.length) gsap.killTweensOf(this.tiles);

    document.getElementById('psScatterLayer').innerHTML = '';
    const gallery = document.getElementById('psGallery');
    gallery.classList.remove('is-active');
    gallery.innerHTML = '';

    const anchor = document.getElementById('psEndingAnchor');
    anchor.style.opacity = '';
    anchor.style.transform = '';
    const message = document.getElementById('psEndingMessage');
    message.classList.add('hidden');
    message.style.opacity = '';
    message.style.transform = '';

    const promptWrap = document.querySelector('.photo-story__prompt-wrap');
    promptWrap.style.opacity = '';
    promptWrap.style.animation = '';
    promptWrap.querySelectorAll('*').forEach((el) => { el.style.animation = ''; });

    this.tiles = [];
    this.hasPlayed = false;
    this.closeLightbox();
  }

  // グループページを開いた直後、レイアウト確定後にScrollTriggerの計測を合わせる
  start() {
    if (window.gsap && window.ScrollTrigger) {
      requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
    }
  }

  // オーバーレイを閉じるときは実行中のアニメーションだけ止める（DOMの再構築はrender()側で行う）
  stop() {
    if (this.scatterTl) this.scatterTl.pause();
    if (this.endingTl && this.endingTl.scrollTrigger) this.endingTl.scrollTrigger.disable();
    this.closeLightbox();
  }

  _bindStage1Click() {
    document.getElementById('psStage1').addEventListener('click', () => {
      if (this.hasPlayed) return;
      this.hasPlayed = true;
      this._playScatter();
    });
  }

  _playScatter() {
    const promptWrap = document.querySelector('.photo-story__prompt-wrap');
    // ps-breathe/ps-pulseのCSSキーフレームが動いたままだと、GSAPのopacityフェードを毎フレーム上書きしてしまうため、
    // フェード開始前にCSSアニメーションそのものを止める。
    promptWrap.style.animation = 'none';
    promptWrap.querySelectorAll('*').forEach((el) => { el.style.animation = 'none'; });

    if (!window.gsap || !this.tiles.length || prefersReducedMotion()) {
      promptWrap.style.opacity = '0';
      this._morphToGrid();
      return;
    }

    const stage = document.getElementById('psStage1');
    const w = stage.clientWidth, h = stage.clientHeight;
    const tiles = this.tiles;
    const GOLDEN_ANGLE = 137.5 * Math.PI / 180;

    const targets = tiles.map((_, i) => {
      const angle = i * GOLDEN_ANGLE;
      const maxRadius = Math.min(w, h) * 0.42;
      const radius = maxRadius * Math.sqrt((i + 0.5) / tiles.length);
      return {
        x: Math.cos(angle) * radius + gsap.utils.random(-24, 24),
        y: Math.sin(angle) * radius * 0.72 + gsap.utils.random(-24, 24),
        rotation: gsap.utils.random(-16, 16),
        scale: gsap.utils.random(0.72, 1.02),
      };
    });

    gsap.set(tiles, { x: 0, y: 0, scale: 0.55, rotation: 0, opacity: 0 });

    this.scatterTl = gsap.timeline();
    this.scatterTl
      .to(promptWrap, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 0)
      .to(tiles, {
        x: (i) => targets[i].x,
        y: (i) => targets[i].y,
        rotation: (i) => targets[i].rotation,
        scale: (i) => targets[i].scale,
        opacity: 1,
        duration: () => gsap.utils.random(1.1, 1.9),
        ease: 'power3.out',
        stagger: { each: 0.045, from: 'random' },
      }, 0.1)
      .call(() => this._startIdleFloat(), null, '+=0.2')
      .call(() => this._morphToGrid(), null, '+=1.0');
  }

  // 着地後の微小な浮遊ループ（モバイルは省電力優先で無効化）
  _startIdleFloat() {
    if (window.matchMedia('(max-width: 640px)').matches) return;
    this.tiles.forEach((el) => {
      gsap.to(el, {
        y: '+=8', x: '+=4', rotation: '+=1.5',
        duration: gsap.utils.random(3, 5), ease: 'sine.inOut',
        yoyo: true, repeat: -1, delay: gsap.utils.random(0, 2),
      });
    });
  }

  // 散乱 → グリッド化。Flipプラグインが枚数非依存でレイアウト差分を吸収する
  _morphToGrid() {
    const gallery = document.getElementById('psGallery');
    const tiles = this.tiles;
    let state = null;

    if (window.gsap) {
      gsap.killTweensOf(tiles);
      if (window.Flip) state = Flip.getState(tiles, { props: 'rotation,opacity' });
    }

    tiles.forEach((tile) => gallery.appendChild(tile));
    gallery.classList.add('is-active');
    this._balanceGalleryColumns(gallery, tiles);

    if (window.gsap && window.Flip && state) {
      gsap.set(tiles, { clearProps: 'transform,opacity' });
      Flip.from(state, {
        duration: 1.3,
        ease: 'power3.inOut',
        stagger: 0.02,
        absolute: true,
        onComplete: () => {
          if (window.ScrollTrigger) ScrollTrigger.refresh();
          this._setupEndingScrollTrigger();
          this._autoRevealGallery();
        },
      });
    } else {
      this._setupEndingScrollTrigger();
    }
  }

  // grid-auto-flow:denseだけだと列ごとの合計高さがバラつき下端が揃わないため、
  // 「一番低い列に次のタイルを詰める」擬似Masonryで明示的にgrid-column/rowを割り当てる。
  // 最後に、他のタイルと重ならず安全な列だけ最終タイルを下端まで伸ばして高さを完全に揃える。
  _balanceGalleryColumns(gallery, tiles) {
    const colCount = getComputedStyle(gallery).gridTemplateColumns.split(' ').filter(Boolean).length;
    if (!colCount || !tiles.length) return;

    const colHeights = new Array(colCount).fill(0);
    const lastTileInCol = new Array(colCount).fill(null);
    const meta = new Map();

    tiles.forEach((tile) => {
      const span = tile.classList.contains('photo-story__tile--featured') && colCount >= 2 ? 2 : 1;
      let bestCol = 0;
      let bestHeight = Infinity;
      for (let c = 0; c <= colCount - span; c++) {
        let h = colHeights[c];
        for (let k = 1; k < span; k++) h = Math.max(h, colHeights[c + k]);
        if (h < bestHeight) { bestHeight = h; bestCol = c; }
      }
      const rowStart = bestHeight;
      tile.style.gridColumn = (bestCol + 1) + ' / span ' + span;
      tile.style.gridRow = (rowStart + 1) + ' / span ' + span;
      meta.set(tile, { col: bestCol, span, rowStart });
      for (let k = 0; k < span; k++) {
        colHeights[bestCol + k] = rowStart + span;
        lastTileInCol[bestCol + k] = tile;
      }
    });

    const maxHeight = Math.max(...colHeights);
    tiles.forEach((tile) => {
      const m = meta.get(tile);
      let isSoleOwner = true;
      for (let k = 0; k < m.span; k++) {
        if (lastTileInCol[m.col + k] !== tile) { isSoleOwner = false; break; }
      }
      if (!isSoleOwner) return;
      const newSpan = maxHeight - m.rowStart;
      if (newSpan > m.span) {
        tile.style.gridRow = (m.rowStart + 1) + ' / span ' + newSpan;
        for (let k = 0; k < m.span; k++) colHeights[m.col + k] = maxHeight;
      }
    });

    // featuredタイルが隣の列と競合して伸ばせない列は、透明なフィラーで下端まで埋めて完全に揃える
    for (let c = 0; c < colCount; c++) {
      if (colHeights[c] >= maxHeight) continue;
      const filler = document.createElement('div');
      filler.className = 'photo-story__tile-filler';
      filler.setAttribute('aria-hidden', 'true');
      filler.style.gridColumn = (c + 1) + ' / span 1';
      filler.style.gridRow = (colHeights[c] + 1) + ' / span ' + (maxHeight - colHeights[c]);
      gallery.appendChild(filler);
    }
  }

  _autoRevealGallery() {
    const page = document.getElementById('groupPage');
    const gallery = document.getElementById('psGallery');
    const target = Math.max(0, gallery.offsetTop - 60);
    if (!window.gsap) { page.scrollTop = target; return; }
    gsap.to(page, { duration: 1.1, scrollTop: target, ease: 'power2.inOut', delay: 0.3 });
  }

  // ページ最下部までスクロールすると、ギャラリーの写真が中央の集合写真へ収束していく
  _setupEndingScrollTrigger() {
    if (!window.gsap || !window.ScrollTrigger || !this.tiles.length) return;

    const zone = document.getElementById('psEndingZone');
    const anchor = document.getElementById('psEndingAnchor');
    const message = document.getElementById('psEndingMessage');

    message.classList.remove('hidden');
    gsap.set(message, { opacity: 0, y: 24 });
    gsap.set(anchor, { opacity: 0, scale: 0.9 });

    const anchorRect = anchor.getBoundingClientRect();
    const anchorCx = anchorRect.left + anchorRect.width / 2;
    const anchorCy = anchorRect.top + anchorRect.height / 2;

    this.endingTl = gsap.timeline({
      scrollTrigger: {
        trigger: zone,
        scroller: '#groupPage',
        start: 'top top',
        end: 'bottom bottom',
        // scrubを大きめにして、スクロールの動きにピタッと追従させず
        // 少し遅れて滑らかに追いつくような、余韻のある戻り方にする
        scrub: 1.6,
        pin: true,
        pinSpacing: true,
      },
    });

    // 収束先(=endingImage、未指定ならheroImageと同じ写真)との相対距離を一度だけ計算する。
    // 最初のクリック(_playScatter)は順番に散っていくが、戻りは「ランダムな順で吸い寄せられる」
    // 逆再生っぽい雰囲気にするため、収束の着地順だけシャッフルする。
    const order = [...this.tiles];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    order.forEach((tile, i) => {
      const r = tile.getBoundingClientRect();
      const dx = anchorCx - (r.left + r.width / 2);
      const dy = anchorCy - (r.top + r.height / 2);
      this.endingTl.to(tile, { x: dx, y: dy, scale: 0.12, opacity: 0, ease: 'sine.inOut' }, i * 0.025);
    });

    // 集合写真は早い段階からうっすら現れ始め、タイルが集まってくるのに合わせて
    // ゆっくり・直線的に(ease:none)濃くなっていく。スケールの落ち着きだけ後半で軽く効かせる。
    this.endingTl
      .to(anchor, { opacity: 1, duration: 1.1, ease: 'none' }, 0.15)
      .to(anchor, { scale: 1, duration: 0.6, ease: 'power2.out' }, 0.65)
      .to(message, { opacity: 1, y: 0, ease: 'sine.out' }, 1.3);
  }

  // ---- ライトボックス ----
  openLightbox(index) {
    this.lightboxIndex = index;
    this._renderLightbox();
    document.getElementById('psLightbox').classList.remove('hidden');
  }

  closeLightbox() {
    const lb = document.getElementById('psLightbox');
    if (lb) lb.classList.add('hidden');
  }

  isLightboxOpen() {
    const lb = document.getElementById('psLightbox');
    return !!lb && !lb.classList.contains('hidden');
  }

  _renderLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    document.getElementById('psLightboxImg').src = photos[this.lightboxIndex];
    document.getElementById('psLightboxImg').alt = (this.group && this.group.name) || '';
    document.getElementById('psLightboxCounter').textContent = (this.lightboxIndex + 1) + ' / ' + photos.length;
  }

  prevLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + photos.length) % photos.length;
    this._renderLightbox();
  }

  nextLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % photos.length;
    this._renderLightbox();
  }

  _bindLightbox() {
    document.getElementById('psLightboxClose').addEventListener('click', () => this.closeLightbox());
    document.getElementById('psLightboxBackdrop').addEventListener('click', () => this.closeLightbox());
    document.getElementById('psLightboxPrev').addEventListener('click', () => this.prevLightbox());
    document.getElementById('psLightboxNext').addEventListener('click', () => this.nextLightbox());

    const lb = document.getElementById('psLightbox');
    let touchStartX = 0;
    lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? this.nextLightbox() : this.prevLightbox(); }
    }, { passive: true });
  }
}

let photoStoryController = null;

// 高校グループのページを開いたときにだけDOMを構築する（初期ロードに影響しないよう遅延初期化）
function renderPhotoStory(group) {
  const root = document.getElementById('photoStoryHero');
  if (!photoStoryController) photoStoryController = new PhotoStoryController(root);
  photoStoryController.render(group);
}

function initPhotoStoryAnimation() {
  if (photoStoryController) photoStoryController.start();
}

function stopPhotoStoryAnimation() {
  if (photoStoryController) photoStoryController.stop();
}

// ---- 大学グループ専用: パズルメモリーズ ----
// 思い出写真を、列ごとに高さの異なるPinterest風マソンリーレイアウトのタイルとして
// 風に流されるように飛来させ、クリック一回で列の一番下へ収束させる演出。

// コンテナ幅に応じた列数(狭い画面ほど列を減らす。理想の1列あたり幅を目安に決める)。
function computeMasonryColumns(containerW) {
  const width = Math.min(containerW, 960);
  const idealColWidth = containerW < 640 ? 110 : 160;
  return Math.max(2, Math.min(6, Math.round(width / idealColWidth)));
}

function puzzleRgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

// 写真の平均色(HSL)と縦横比をまとめて計測する。マソンリーのタイル高さは縦横比から、
// 配置の色味判定は平均色から決める。file://で開いた場合はキャンバスがtainted扱いになり
// getImageDataが例外を投げることがあるため、その際はcolor:nullを返し
// 呼び出し側で「色味による並べ替えなし」にフォールバックする。
const puzzlePhotoMetaCache = new Map();
function getPuzzlePhotoMeta(src) {
  if (puzzlePhotoMetaCache.has(src)) return puzzlePhotoMetaCache.get(src);
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
      let color = null;
      try {
        const size = 16;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i + 1]; b += data[i + 2];
          count++;
        }
        color = puzzleRgbToHsl(r / count, g / count, b / count);
      } catch (e) {
        color = null;
      }
      resolve({ color, aspect });
    };
    img.onerror = () => resolve({ color: null, aspect: 1 });
    img.src = src;
  });
  puzzlePhotoMetaCache.set(src, promise);
  return promise;
}

// 色相を主とした距離(色味の近さ)。色が取得できなかった写真は常に「最も遠い」扱いにし、
// 判定不能な写真同士を無理に隣接させないようにする。
function puzzleColorDistance(a, b) {
  if (!a || !b) return 1;
  const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180;
  const ds = Math.abs(a.s - b.s);
  const dl = Math.abs(a.l - b.l);
  return dh * 0.7 + ds * 0.15 + dl * 0.15;
}

// バギー(ATV)に乗っている写真と、黄色が目立つ写真(全身タイツ・バナナ仮装)は、
// 色味の距離だけでは離れる保証がないため、ファイル名で明示的にタグ付けして
// 隣接(斜めも含む)させないよう強いペナルティを課す。
const PUZZLE_BUGGY_FILES = ['/B1.jpg', '/A3.jpg', '/C3.jpg'];
const PUZZLE_YELLOW_FILES = ['/D6.jpg', '/B5.jpg', '/D4.jpg'];
function puzzleMatchesAny(src, needles) {
  return needles.some((needle) => src.includes(needle));
}

// 常に「今一番低い列」へ次のタイルを積む(定番のマソンリー配置)。その際、同じ列の
// 直上・左右の列の直近タイルと最も色味が離れている写真を貪欲に選ぶことで、
// 色が近い写真同士が隣接しにくくなる。バギー/黄色の組み合わせは色味スコアより
// 優先して隣接を避ける。縦横比は0.55〜1.6にクランプしタイルの高さの土台にする。
//
// 列ごとの割り振りが終わったら、モザイク全体の上端・下端が綺麗な直線に揃うよう、
// 各列の合計高さ(自然な縦横比のまま)を列内の全タイルの平均値に一律スケーリングする
// (ギャップ自体は伸縮させず、写真部分の高さだけを調整する)。
async function planPuzzleMasonryLayout(photos, columnCount, columnWidth, gap) {
  const metas = await Promise.all(photos.map((src) => getPuzzlePhotoMeta(src)));
  const isBuggy = photos.map((src) => puzzleMatchesAny(src, PUZZLE_BUGGY_FILES));
  const isYellow = photos.map((src) => puzzleMatchesAny(src, PUZZLE_YELLOW_FILES));
  const clashes = (a, b) => (isBuggy[a] && isYellow[b]) || (isYellow[a] && isBuggy[b]);

  const naturalHeights = metas.map((m) => {
    const aspect = Math.min(1.6, Math.max(0.55, m.aspect || 1));
    return Math.round(columnWidth / aspect);
  });

  const colHeights = new Array(columnCount).fill(0);
  const colTopIdx = new Array(columnCount).fill(undefined);
  const columns = Array.from({ length: columnCount }, () => []);
  const remaining = new Set(metas.map((_, i) => i));

  while (remaining.size) {
    let col = 0;
    for (let c = 1; c < columnCount; c++) {
      if (colHeights[c] < colHeights[col]) col = c;
    }

    const neighborIdxs = [colTopIdx[col], colTopIdx[col - 1], colTopIdx[col + 1]]
      .filter((v) => v !== undefined);
    const neighborColors = neighborIdxs.map((i) => metas[i].color).filter(Boolean);

    let pick = remaining.values().next().value;
    if (neighborIdxs.length) {
      let bestScore = -Infinity;
      remaining.forEach((photoIdx) => {
        let score = neighborColors.length
          ? Math.min(...neighborColors.map((nc) => puzzleColorDistance(metas[photoIdx].color, nc)))
          : 0;
        if (neighborIdxs.some((nIdx) => clashes(photoIdx, nIdx))) score -= 10;
        if (score > bestScore) { bestScore = score; pick = photoIdx; }
      });
    }
    remaining.delete(pick);

    columns[col].push(pick);
    colHeights[col] += naturalHeights[pick] + gap;
    colTopIdx[col] = pick;
  }

  const columnTotals = columns.map((idxs) => ({
    contentHeight: idxs.reduce((sum, i) => sum + naturalHeights[i], 0),
    gapsTotal: Math.max(0, idxs.length - 1) * gap,
  }));
  const nonEmpty = columnTotals.filter((t) => t.contentHeight > 0);
  const targetTotal = nonEmpty.length
    ? nonEmpty.reduce((sum, t) => sum + t.contentHeight + t.gapsTotal, 0) / nonEmpty.length
    : 0;

  const placements = [];
  columns.forEach((idxs, col) => {
    const { contentHeight, gapsTotal } = columnTotals[col];
    const scale = contentHeight > 0 ? Math.max(0.01, (targetTotal - gapsTotal) / contentHeight) : 1;
    let y = 0;
    idxs.forEach((photoIdx) => {
      const height = Math.max(1, Math.round(naturalHeights[photoIdx] * scale));
      placements.push({ photoIdx, x: col * (columnWidth + gap), y, height });
      y += height + gap;
    });
  });

  return placements;
}

class PuzzleAssemblyController {
  constructor(rootEl) {
    this.root = rootEl;
    this.group = null;
    this.pieces = [];
    this.layout = null;
    this.hasPlayed = false;
    this.assembled = false;
    this.assembleTl = null;
    this.lightboxIndex = 0;
    this._buildToken = 0;
    this._resizeRaf = null;
    this._onResizeBound = () => this._onResize();
    this._bindLightbox();
    this._bindStageClick();
  }

  // group.photosを元にDOM/SVG defsを毎回作り直し、stage1から再生できる状態に戻す
  render(group) {
    this.reset();
    this.group = group;
  }

  reset() {
    this._buildToken++;
    if (this.assembleTl) {
      this.assembleTl.kill();
      this.assembleTl = null;
    }
    if (window.gsap && this.pieces.length) gsap.killTweensOf(this.pieces.map((p) => p.el));

    document.getElementById('puzzleMosaic').innerHTML = '';
    document.getElementById('puzzleMosaic').style.transform = '';

    const prompt = document.getElementById('puzzleGatherPrompt');
    if (prompt) prompt.classList.add('hidden');

    const msg = document.getElementById('puzzleEndingMessage');
    msg.classList.add('hidden');
    msg.style.opacity = '';
    msg.style.transform = '';

    this.pieces = [];
    this.layout = null;
    this.hasPlayed = false;
    this.assembled = false;
    this.closeLightbox();
  }

  // グループページを開いた直後、レイアウト確定後にピースを構築し「集める」ボタン待機状態にする
  start() {
    requestAnimationFrame(() => requestAnimationFrame(async () => {
      await this._buildPieces();
      window.removeEventListener('resize', this._onResizeBound);
      window.addEventListener('resize', this._onResizeBound);

      if (!window.gsap || prefersReducedMotion()) {
        this._setFinalStateInstant();
        return;
      }
      if (this.hasPlayed) return;
      this.hasPlayed = true;
      this._showGatherPrompt();
    }));
  }

  // オーバーレイを閉じるときは実行中のアニメーションだけ止める（DOMの再構築はrender()側で行う）
  stop() {
    if (this.assembleTl) this.assembleTl.pause();
    window.removeEventListener('resize', this._onResizeBound);
    this.closeLightbox();
  }

  _onResize() {
    if (this._resizeRaf) cancelAnimationFrame(this._resizeRaf);
    this._resizeRaf = requestAnimationFrame(async () => {
      if (!this.group) return;
      const group = this.group;
      this.reset();
      this.group = group;
      await this._buildPieces();
      this.hasPlayed = true;
      this._setFinalStateInstant();
    });
  }

  async _buildPieces() {
    const stage = document.getElementById('puzzleStage');
    const mosaic = document.getElementById('puzzleMosaic');
    const photos = (this.group && this.group.photos) || [];
    const n = photos.length;
    if (!n) return;

    const token = ++this._buildToken;
    const containerW = stage.clientWidth || window.innerWidth;
    const gap = 4;
    const columnCount = computeMasonryColumns(containerW);
    const available = Math.min(containerW, 960) - (columnCount - 1) * gap;
    const columnWidth = Math.max(64, Math.floor(available / columnCount));
    const placements = await planPuzzleMasonryLayout(photos, columnCount, columnWidth, gap);
    if (token !== this._buildToken) return;

    const mosaicW = columnCount * columnWidth + (columnCount - 1) * gap;
    const mosaicH = Math.max(...placements.map((p) => p.y + p.height));

    mosaic.style.width = mosaicW + 'px';
    mosaic.style.height = mosaicH + 'px';
    stage.style.minHeight = Math.max(480, mosaicH + 200) + 'px';

    this.pieces = [];
    placements.forEach(({ photoIdx, x, y, height }) => {
      const el = document.createElement('div');
      el.className = 'puzzle-piece';
      el.style.width = columnWidth + 'px';
      el.style.height = height + 'px';

      const clip = document.createElement('div');
      clip.className = 'puzzle-piece__clip';

      const img = document.createElement('img');
      img.className = 'puzzle-piece__img';
      img.src = photos[photoIdx];
      img.alt = this.group.name || '';
      img.loading = 'lazy';
      img.decoding = 'async';

      clip.appendChild(img);
      el.appendChild(clip);
      mosaic.appendChild(el);

      el.addEventListener('click', () => this.openLightbox(photoIdx));

      this.pieces.push({
        el,
        targetX: x,
        targetY: y,
        entryPoint: null,
      });
    });

    this.layout = { columnCount, columnWidth, mosaicW, mosaicH };
  }

  // ステージ矩形とモザイク矩形の実測差から、画面外の飛来開始点をモザイク基準の座標で求める
  _randomEntryPoint() {
    const stage = document.getElementById('puzzleStage');
    const mosaic = document.getElementById('puzzleMosaic');
    const stageRect = stage.getBoundingClientRect();
    const mosaicRect = mosaic.getBoundingClientRect();
    const offsetX = mosaicRect.left - stageRect.left;
    const offsetY = mosaicRect.top - stageRect.top;
    const w = stageRect.width || window.innerWidth;
    const h = stageRect.height || 480;
    const pad = 160;
    const side = Math.floor(Math.random() * 4);
    switch (side) {
      case 0: return { x: Math.random() * w - offsetX, y: -offsetY - pad };
      case 1: return { x: w - offsetX + pad, y: Math.random() * h - offsetY };
      case 2: return { x: Math.random() * w - offsetX, y: h - offsetY + pad };
      default: return { x: -offsetX - pad, y: Math.random() * h - offsetY };
    }
  }

  // MotionPathPluginを積んでいないため、進捗値をtweenしonUpdateで二次ベジェを計算する
  // (BballBall.updateと同じ「進捗→座標計算→gsap.set」パターン)。風で流されるような
  // 制御点のランダムなずれ・回転・スケール・不透明度を同時に変化させ、直線移動を避ける。
  _flyPieceIn(piece, { duration, ease }) {
    const p0 = piece.entryPoint || this._randomEntryPoint();
    const p2 = { x: piece.targetX, y: piece.targetY };
    const bendX = gsap.utils.random(80, 220) * (Math.random() < 0.5 ? -1 : 1);
    const bendY = gsap.utils.random(-120, -40);
    const p1 = {
      x: (p0.x + p2.x) / 2 + bendX,
      y: (p0.y + p2.y) / 2 + bendY,
    };

    gsap.set(piece.el, {
      x: p0.x,
      y: p0.y,
      rotation: gsap.utils.random(-45, 45),
      scale: gsap.utils.random(0.72, 1.12),
      opacity: 0,
    });

    const proxy = { t: 0 };
    const tl = gsap.timeline();
    tl.to(proxy, {
      t: 1,
      duration,
      ease,
      onUpdate: () => {
        const u = 1 - proxy.t;
        const x = u * u * p0.x + 2 * u * proxy.t * p1.x + proxy.t * proxy.t * p2.x;
        const y = u * u * p0.y + 2 * u * proxy.t * p1.y + proxy.t * proxy.t * p2.y;
        gsap.set(piece.el, { x, y });
      },
    }, 0)
      .to(piece.el, { rotation: gsap.utils.random(-2.5, 2.5), scale: 1, opacity: 1, duration, ease }, 0);
    return tl;
  }

  // クリック待ち: 全ピースを非表示にし「Click to gather our memories」を表示する
  _showGatherPrompt() {
    this.pieces.forEach((piece) => { piece.el.style.opacity = '0'; });
    const prompt = document.getElementById('puzzleGatherPrompt');
    if (prompt) prompt.classList.remove('hidden');
  }

  // 高校グループ(photoStory)のstage1クリックと同じパターン:
  // ステージ自体をクリック領域にし、初回クリックでのみ組み上げを開始する
  _bindStageClick() {
    const stage = document.getElementById('puzzleStage');
    if (!stage) return;
    stage.addEventListener('click', () => {
      if (this.assembled) return;
      this._playAssemble();
    });
  }

  // クリックで全ピースをランダムな順・方向から、ゆったりとしたテンポで飛来させ、正しい升目へ収束させる。最後の1枚だけ強調する。
  _playAssemble() {
    this.assembled = true;
    const prompt = document.getElementById('puzzleGatherPrompt');
    if (prompt) prompt.classList.add('hidden');

    const shuffled = [...this.pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const stagger = 0.09;
    this.assembleTl = gsap.timeline({ onComplete: () => this._playCompletion() });
    shuffled.forEach((piece, i) => {
      const isLast = i === shuffled.length - 1;
      piece.entryPoint = this._randomEntryPoint();
      const duration = gsap.utils.random(1.4, 1.9);
      const tl = this._flyPieceIn(piece, { duration, ease: isLast ? 'back.out(1.7)' : 'power2.out' });
      if (isLast) tl.call(() => this._playFinalSnap(piece));
      this.assembleTl.add(tl, i * stagger);
    });
  }

  // 最後の1ピースだけ「カチッ」とはまる感触を出す控えめな強調
  _playFinalSnap(piece) {
    piece.el.classList.add('puzzle-piece--final');
    gsap.to(piece.el, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' });
  }

  // 完成の瞬間: 派手な演出は使わず、軽いズームアウトとメッセージのフェードインのみ
  _playCompletion() {
    const mosaic = document.getElementById('puzzleMosaic');
    gsap.fromTo(mosaic, { scale: 1.045 }, { scale: 1, duration: 1.2, ease: 'power2.out' });

    const msg = document.getElementById('puzzleEndingMessage');
    msg.textContent = (this.group && this.group.message) || '';
    msg.classList.remove('hidden');
    gsap.set(msg, { opacity: 0, y: 16 });
    gsap.to(msg, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
  }

  // reduced-motion時、またはGSAP未読込時は即座に完成形を表示する
  _setFinalStateInstant() {
    this.assembled = true;
    const prompt = document.getElementById('puzzleGatherPrompt');
    if (prompt) prompt.classList.add('hidden');
    this.pieces.forEach((piece) => {
      if (window.gsap) {
        gsap.set(piece.el, { x: piece.targetX, y: piece.targetY, rotation: 0, scale: 1, opacity: 1 });
      } else {
        piece.el.style.transform = `translate(${piece.targetX}px, ${piece.targetY}px)`;
        piece.el.style.opacity = '1';
      }
    });
    document.getElementById('puzzleMosaic').style.transform = '';
    const msg = document.getElementById('puzzleEndingMessage');
    msg.textContent = (this.group && this.group.message) || '';
    msg.classList.remove('hidden');
    msg.style.opacity = '1';
  }

  // ---- ライトボックス(個別ピースクリックで高解像度表示) ----
  openLightbox(index) {
    this.lightboxIndex = index;
    this._renderLightbox();
    document.getElementById('pzLightbox').classList.remove('hidden');
  }

  closeLightbox() {
    const lb = document.getElementById('pzLightbox');
    if (lb) lb.classList.add('hidden');
  }

  isLightboxOpen() {
    const lb = document.getElementById('pzLightbox');
    return !!lb && !lb.classList.contains('hidden');
  }

  _renderLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    document.getElementById('pzLightboxImg').src = photos[this.lightboxIndex];
    document.getElementById('pzLightboxImg').alt = (this.group && this.group.name) || '';
    document.getElementById('pzLightboxCounter').textContent = (this.lightboxIndex + 1) + ' / ' + photos.length;
  }

  prevLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + photos.length) % photos.length;
    this._renderLightbox();
  }

  nextLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % photos.length;
    this._renderLightbox();
  }

  _bindLightbox() {
    document.getElementById('pzLightboxClose').addEventListener('click', () => this.closeLightbox());
    document.getElementById('pzLightboxBackdrop').addEventListener('click', () => this.closeLightbox());
    document.getElementById('pzLightboxPrev').addEventListener('click', () => this.prevLightbox());
    document.getElementById('pzLightboxNext').addEventListener('click', () => this.nextLightbox());

    const lb = document.getElementById('pzLightbox');
    let touchStartX = 0;
    lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? this.nextLightbox() : this.prevLightbox(); }
    }, { passive: true });
  }
}

let puzzleAssemblyController = null;

// 大学グループのページを開いたときにだけDOMを構築する（初期ロードに影響しないよう遅延初期化）
function renderPuzzleAssembly(group) {
  const root = document.getElementById('puzzleHero');
  if (!puzzleAssemblyController) puzzleAssemblyController = new PuzzleAssemblyController(root);
  puzzleAssemblyController.render(group);
}

function initPuzzleAnimation() {
  if (puzzleAssemblyController) puzzleAssemblyController.start();
}

function stopPuzzleAnimation() {
  if (puzzleAssemblyController) puzzleAssemblyController.stop();
}

// ---- 新郎親族グループ専用: 家族写真クリックで愛犬たちがCSS Gridのマス目を埋める ----
// 家族写真と犬の写真を同じGridコンテナの子要素にし、家族写真を中央のセル群に
// 明示配置した上で、犬の写真をDOM順の自動配置(grid-auto-flow: row dense)に任せる。
// Grid自体が「1マスに1枚」しか置かない構造なので、座標計算による重なりが原理的に起こらない。
class FamilyDogScatterController {
  constructor() {
    this.group = null;
    this.dogEls = [];
    this.revealed = false;
    this.lightboxIndex = 0;
    this._bindFrameClick();
    this._bindLightbox();
  }

  // グループページを開くたびにGridを組み直し、集約待機状態(不可視)に戻す
  render(group) {
    this.reset();
    this.group = group;

    const stage = document.getElementById('familyStage');
    const frame = document.getElementById('familyMainFrame');
    const photos = (group && group.photos) || [];

    const gap = 4;
    const cellTarget = 64;
    const stageWidth = stage.clientWidth || 320;
    const cols = Math.max(4, Math.round((stageWidth + gap) / (cellTarget + gap)));
    const cellSize = (stageWidth - gap * (cols - 1)) / cols;
    const photoSpan = Math.max(3, Math.round(cols * 0.36));
    const rows = Math.max(photoSpan, Math.ceil((photos.length + photoSpan * photoSpan) / cols));
    const colStart = Math.floor((cols - photoSpan) / 2) + 1;
    const rowStart = Math.floor((rows - photoSpan) / 2) + 1;

    stage.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    stage.style.gridAutoRows = cellSize + 'px';
    stage.style.gap = gap + 'px';
    frame.style.gridColumn = `${colStart} / span ${photoSpan}`;
    frame.style.gridRow = `${rowStart} / span ${photoSpan}`;

    this.dogEls = photos.map((src, i) => {
      const img = document.createElement('img');
      img.className = 'family-hero__dog';
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openLightbox(i);
      });
      stage.appendChild(img);
      return img;
    });

    if (window.gsap) {
      gsap.set(this.dogEls, { scale: 0.4, opacity: 0 });
    }
  }

  reset() {
    if (window.gsap && this.dogEls.length) gsap.killTweensOf(this.dogEls);
    this.dogEls.forEach((img) => img.remove());
    this.dogEls = [];
    this.revealed = false;
    const prompt = document.getElementById('familyPrompt');
    if (prompt) prompt.classList.remove('hidden');
  }

  stop() {
    if (window.gsap && this.dogEls.length) gsap.killTweensOf(this.dogEls);
    this.closeLightbox();
  }

  _bindFrameClick() {
    const frame = document.getElementById('familyMainFrame');
    if (!frame) return;
    frame.addEventListener('click', () => {
      if (this.revealed) this._hide();
      else this._reveal();
    });
  }

  // クリックで全犬をその場(Gridで確定済みのセル)にふわっと表示する
  _reveal() {
    if (!this.dogEls.length) return;
    this.revealed = true;
    const prompt = document.getElementById('familyPrompt');
    if (prompt) prompt.classList.add('hidden');

    if (!window.gsap || prefersReducedMotion()) {
      this.dogEls.forEach((img) => { img.style.opacity = '1'; });
      return;
    }

    this.dogEls.forEach((img, i) => {
      gsap.killTweensOf(img);
      gsap.to(img, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: i * 0.012,
        ease: 'back.out(1.5)',
      });
    });
  }

  // 再クリックでその場にフェードアウトさせ、プロンプトを再表示する
  _hide() {
    if (!this.dogEls.length) return;
    this.revealed = false;

    if (!window.gsap || prefersReducedMotion()) {
      this.dogEls.forEach((img) => { img.style.opacity = '0'; });
    } else {
      this.dogEls.forEach((img, i) => {
        gsap.killTweensOf(img);
        gsap.to(img, {
          scale: 0.4,
          opacity: 0,
          duration: 0.35,
          delay: i * 0.006,
          ease: 'power2.in',
        });
      });
    }

    const prompt = document.getElementById('familyPrompt');
    if (prompt) prompt.classList.remove('hidden');
  }

  // ---- ライトボックス(犬写真クリックで拡大表示) ----
  openLightbox(index) {
    this.lightboxIndex = index;
    this._renderLightbox();
    document.getElementById('familyLightbox').classList.remove('hidden');
  }

  closeLightbox() {
    const lb = document.getElementById('familyLightbox');
    if (lb) lb.classList.add('hidden');
  }

  isLightboxOpen() {
    const lb = document.getElementById('familyLightbox');
    return !!lb && !lb.classList.contains('hidden');
  }

  _renderLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    document.getElementById('familyLightboxImg').src = photos[this.lightboxIndex];
    document.getElementById('familyLightboxImg').alt = (this.group && this.group.name) || '';
    document.getElementById('familyLightboxCounter').textContent = (this.lightboxIndex + 1) + ' / ' + photos.length;
  }

  prevLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + photos.length) % photos.length;
    this._renderLightbox();
  }

  nextLightbox() {
    const photos = (this.group && this.group.photos) || [];
    if (!photos.length) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % photos.length;
    this._renderLightbox();
  }

  _bindLightbox() {
    document.getElementById('familyLightboxClose').addEventListener('click', () => this.closeLightbox());
    document.getElementById('familyLightboxBackdrop').addEventListener('click', () => this.closeLightbox());
    document.getElementById('familyLightboxPrev').addEventListener('click', () => this.prevLightbox());
    document.getElementById('familyLightboxNext').addEventListener('click', () => this.nextLightbox());

    const lb = document.getElementById('familyLightbox');
    let touchStartX = 0;
    lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? this.nextLightbox() : this.prevLightbox(); }
    }, { passive: true });
  }
}

let familyDogController = null;

// グループページを開いたときにだけDOMを構築する（初期ロードに影響しないよう遅延初期化）
function renderFamilyFrame(group) {
  if (!familyDogController) familyDogController = new FamilyDogScatterController();
  familyDogController.render(group);
}

function stopFamilyFrameAnimation() {
  if (familyDogController) familyDogController.stop();
}

// ---- グループページ開閉（ステップ2） ----
function openGroupPage(group) {
  document.getElementById('groupName').textContent = group.name;

  const heroEl = document.getElementById('jhsHero');
  const photoStoryEl = document.getElementById('photoStoryHero');
  const puzzleEl = document.getElementById('puzzleHero');
  const familyEl = document.getElementById('familyHero');
  const workEl = document.getElementById('workHero');
  const photosEl = document.getElementById('groupPhotos');
  const msgEl = document.getElementById('groupMessage');
  const contentEl = document.querySelector('.group-page__content');
  const numberSectionEl = document.getElementById('groupNumberSection');
  const noteEl = document.getElementById('groupNote');

  stopBballAnimation();
  stopPhotoStoryAnimation();
  stopPuzzleAnimation();
  stopFamilyFrameAnimation();
  heroEl.classList.add('hidden');
  photoStoryEl.classList.add('hidden');
  puzzleEl.classList.add('hidden');
  familyEl.classList.add('hidden');
  workEl.classList.add('hidden');
  contentEl.classList.remove('group-page__content--photostory');
  contentEl.classList.remove('group-page__content--puzzle');
  numberSectionEl.classList.remove('hidden');
  noteEl.classList.remove('hidden');

  if (group.customHero === 'jersey') {
    document.getElementById('jhsHeroImage').src = group.heroImage;
    document.getElementById('jhsHeroImage').alt = group.name;
    document.getElementById('jhsHeroMessage').innerHTML = group.message.replace(/\n/g, '<br>');
    heroEl.classList.remove('hidden');
    photosEl.classList.add('hidden');
    msgEl.classList.add('hidden');
  } else if (group.customHero === 'photoStory') {
    photosEl.classList.add('hidden');
    msgEl.classList.add('hidden');
    contentEl.classList.add('group-page__content--photostory');
    photoStoryEl.classList.remove('hidden');
    renderPhotoStory(group);
  } else if (group.customHero === 'puzzle') {
    photosEl.classList.add('hidden');
    msgEl.classList.add('hidden');
    contentEl.classList.add('group-page__content--puzzle');
    puzzleEl.classList.remove('hidden');
    renderPuzzleAssembly(group);
  } else if (group.customHero === 'familyFrame') {
    photosEl.classList.add('hidden');
    document.getElementById('familyHeroImage').src = group.heroImage;
    document.getElementById('familyHeroImage').alt = group.name || '';
    renderFamilyFrame(group);
    familyEl.classList.remove('hidden');
    msgEl.classList.add('hidden');
    numberSectionEl.classList.add('hidden');
    noteEl.classList.add('hidden');
  } else if (group.customHero === 'gifReveal') {
    document.getElementById('workHeroBuilding').src = group.heroBuilding;
    document.getElementById('workHeroBuilding').alt = group.name;
    document.getElementById('workHeroGif').src = group.heroGif;
    document.getElementById('workHeroMessage').innerHTML = group.message.replace(/\n/g, '<br>');
    workEl.classList.remove('hidden');
    photosEl.classList.add('hidden');
    msgEl.classList.add('hidden');
  } else {
    photosEl.classList.remove('hidden');
    msgEl.classList.remove('hidden');

    photosEl.innerHTML = '';
    group.photos.forEach(src => {
      const frame = document.createElement('div');
      frame.className = 'group-page__photo-frame';
      const img = document.createElement('img');
      img.src = src;
      img.alt = group.name;
      img.className = 'group-page__photo';
      frame.appendChild(img);
      photosEl.appendChild(frame);
    });

    msgEl.textContent = group.message;
  }

  document.getElementById('guestNumberInput').value = '';
  document.getElementById('groupError').textContent = '';

  const page = document.getElementById('groupPage');
  page.classList.remove('hidden');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  if (group.customHero === 'jersey') initBballAnimation();
  if (group.customHero === 'photoStory') initPhotoStoryAnimation();
  if (group.customHero === 'puzzle') initPuzzleAnimation();

  if (group.customHero !== 'familyFrame') {
    setTimeout(() => document.getElementById('guestNumberInput').focus({ preventScroll: true }), 300);
  }
}

function closeGroupPage() {
  stopBballAnimation();
  stopPhotoStoryAnimation();
  stopPuzzleAnimation();
  stopFamilyFrameAnimation();
  document.getElementById('workHero').classList.add('hidden');
  document.getElementById('groupPage').classList.add('hidden');
  document.body.style.overflow = '';
  document.getElementById('codeInput').value = '';
  document.getElementById('codeError').textContent = '';
  currentGroup = null;
}

// ---- 番号入力（ステップ2 → ステップ3） ----
function submitGuestNumber() {
  const input = document.getElementById('guestNumberInput');
  const num   = input.value.trim();

  if (!num) {
    showGroupError('番号を入力してください');
    return;
  }

  if (!currentGroup) return;

  const guest = currentGroup.guests[num];
  if (!guest) {
    showGroupError('番号が正しくありません。席札をご確認ください。');
    input.value = '';
    input.focus();
    return;
  }

  document.getElementById('groupError').textContent = '';
  closeGroupPage();
  openGuestPage(guest);
}

function showGroupError(msg) {
  const el = document.getElementById('groupError');
  el.textContent = msg;
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
  if (e.key === 'Enter') submitPassphrase();
});
document.getElementById('guestNumberInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitGuestNumber();
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
  if (photoStoryController && photoStoryController.isLightboxOpen()) {
    if (e.key === 'Escape')    { photoStoryController.closeLightbox(); return; }
    if (e.key === 'ArrowLeft')  { photoStoryController.prevLightbox(); return; }
    if (e.key === 'ArrowRight') { photoStoryController.nextLightbox(); return; }
  }
  if (puzzleAssemblyController && puzzleAssemblyController.isLightboxOpen()) {
    if (e.key === 'Escape')    { puzzleAssemblyController.closeLightbox(); return; }
    if (e.key === 'ArrowLeft')  { puzzleAssemblyController.prevLightbox(); return; }
    if (e.key === 'ArrowRight') { puzzleAssemblyController.nextLightbox(); return; }
  }
  if (familyDogController && familyDogController.isLightboxOpen()) {
    if (e.key === 'Escape')    { familyDogController.closeLightbox(); return; }
    if (e.key === 'ArrowLeft')  { familyDogController.prevLightbox(); return; }
    if (e.key === 'ArrowRight') { familyDogController.nextLightbox(); return; }
  }
  if (e.key !== 'Escape') return;
  if (!document.getElementById('guestPage').classList.contains('hidden'))   closeGuestPage();
  if (!document.getElementById('groupPage').classList.contains('hidden'))   closeGroupPage();
  if (!document.getElementById('movieModal').classList.contains('hidden'))   closeMovieModal();
  if (!document.getElementById('travelModal').classList.contains('hidden'))  closeTravelModal();
});
