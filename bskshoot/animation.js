/*
  GBA風バスケットボール ループアニメーション
  ------------------------------------------------
  Sprite / Ball / AnimationController の3クラスで構成。
  キャラクター画像だけを SPRITE_SOURCES / CONFIG で差し替えれば、
  他のキャラクターでも同じ仕組みをそのまま再利用できる。
*/

(() => {
  "use strict";

  /* ==============================
   * 画像パス(ここを書き換えるだけでキャラクター等を差し替え可能)
   * ============================== */
  const SPRITE_SOURCES = {
    idle: "sprites/idle_1.png",
    dribble: ["sprites/db_1.png", "sprites/db_2.png", "sprites/db_3.png", "sprites/db_4.png"],
    shoot: ["sprites/shoot_1.png", "sprites/shoot_2.png", "sprites/shoot_3.png"],
    landing: ["sprites/landing_1.png", "sprites/landing_2.png"],
    guts: "sprites/guts.png",
    ball: "sprites/ball.png",
    goal: ["sprites/goal_0.png", "sprites/goal_1.png", "sprites/goal_2.png", "sprites/goal_3.png"],
  };

  /* ==============================
   * 定数(挙動チューニング用)
   * ============================== */
  const CONFIG = {
    // キャラクター倍率
    CHARACTER_SCALE: 1.7, // 64px -> 108.8px (以前の0.85倍)

    // 移動速度・ジャンプ高さ
    START_X_RATIO: 0.1, // ステージ幅に対する開始位置
    SHOOT_X_RATIO: 0.5, // ステージ幅に対するシュート位置
    JUMP_HEIGHT: 34, // シュートジャンプの高さ(px)
    GROUND_BOTTOM: 18, // 地面ライン(ステージ下端からのpx)
    IDLE_BOB_AMPLITUDE: 2, // 待機中の微小な呼吸アニメ(px)
    DRIBBLE_BOB: [0, 1, 3, 1], // 各ドリブルフレームでの上下ゆれ(px)

    // ボール速度・軌道
    // ball.png は円の実体が画像内の約93%を占めるのに対し、キャラクター手持ち時のボールは
    // キャラ画像内で直径 約20/64 ほどしかないため、同じ見た目サイズに合わせて算出した値
    BALL_DISPLAY_SIZE: 37, // ボール表示サイズ(px) (手持ち時と同じ見た目の大きさになるよう計測して設定)
    BALL_ARC_HEIGHT: 95, // ボール放物線の頂点の高さ(px) (直線的に見えないよう大きめに)
    RELEASE_OFFSET_X_RATIO: 0.34, // キャラ幅に対するリリース位置(中心からのオフセット)
    RELEASE_OFFSET_Y_RATIO: 0.08, // キャラ高さに対するリリース位置(上端からの割合)

    // ゴール位置・サイズ
    GOAL_DISPLAY_SIZE: 151, // ゴール表示サイズ(px) (旧116pxの約1.3倍)
    GOAL_X_RATIO: 0.82, // ステージ幅に対するゴール中心位置
    GOAL_TOP: 20, // ゴール上端の位置(px)
    GOAL_RIM_X_RATIO: 0.53, // ゴール画像内でのリング中心(横 割合)
    GOAL_RIM_Y_RATIO: 0.58, // ゴール画像内でのリング中心(縦 割合)
    GOAL_SEQUENCE_THRESHOLDS: { approach: 0.85, rim: 0.92, through: 0.97 }, // 飛行進捗に対するgoal_1〜3切替点

    // 各フレーム表示時間・ループ時間(ms)
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

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
  const easeInQuad = (t) => t * t;

  /* ==============================
   * Sprite クラス
   * 1枚のDOM要素(div)を、位置・スケール・不透明度・表示フレーム(背景画像)
   * だけを扱う汎用の描画プリミティブとして扱う。
   * ============================== */
  class Sprite {
    constructor(parentEl, className) {
      this.el = document.createElement("div");
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

  /* ==============================
   * Ball クラス
   * ボール専用のSpriteを保持し、「キャラクターの手に追従する状態」から
   * 「独立して放物線を飛ぶ状態」への切り替えと、飛行中の座標計算を担当する。
   * ============================== */
  class Ball {
    constructor(parentEl, displaySize) {
      this.sprite = new Sprite(parentEl, "bball-sprite bball-ball");
      this.sprite.el.style.width = "64px";
      this.sprite.el.style.height = "64px";
      const scale = displaySize / 64;
      this.sprite.setScale(scale, scale);
      this.sprite.setFrame(SPRITE_SOURCES.ball);
      this.sprite.setOpacity(0);

      this.displaySize = displaySize;
      this.active = false;
      this.elapsed = 0;
      this.duration = 0;
      this.arcHeight = 0;
      this.start = { x: 0, y: 0 };
      this.end = { x: 0, y: 0 };
    }

    // center 座標(cx, cy)を指定して、そこへスプライトの中心が来るように配置する
    _placeAtCenter(cx, cy) {
      this.sprite.setPosition(cx - this.displaySize / 2, cy - this.displaySize / 2);
    }

    // キャラクターの手からリング中心へ向けて放物線を飛ばし始める
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

    // 1フレーム分更新する。飛行中でなければ null を返す。飛行中なら進捗(0〜1)を返す。
    update(dtMs) {
      if (!this.active) return null;
      this.elapsed += dtMs;
      const t = clamp(this.elapsed / this.duration, 0, 1);

      const cx = lerp(this.start.x, this.end.x, t);
      // 放物線: 直線補間から山なりに持ち上げる (t=0.5で最大 arcHeight 分だけ上に)
      const cy = lerp(this.start.y, this.end.y, t) - this.arcHeight * 4 * t * (1 - t);
      this._placeAtCenter(cx, cy);

      if (t >= 1) this.active = false;
      return t;
    }
  }

  /* ==============================
   * AnimationController クラス
   * フェーズ(状態)を進行させながら、Character/Ball/Goal の見た目を更新する。
   * ============================== */
  class AnimationController {
    constructor(stageEl, config = CONFIG, sources = SPRITE_SOURCES) {
      this.stageEl = stageEl;
      this.cfg = config;
      this.sources = sources;

      this.character = new Sprite(stageEl, "bball-sprite bball-character");
      this.goal = new Sprite(stageEl, "bball-sprite bball-goal");
      this.ball = new Ball(stageEl, this.cfg.BALL_DISPLAY_SIZE);

      const goalScale = this.cfg.GOAL_DISPLAY_SIZE / 64;
      this.goal.setScale(goalScale, goalScale);

      this.character.setScale(this.cfg.CHARACTER_SCALE, this.cfg.CHARACTER_SCALE);

      this._preload();
      this._buildPhases();
      this._layout();

      this._phaseIndex = 0;
      this._phaseElapsed = 0;
      this._lastTs = null;
      this._raf = null;

      window.addEventListener("resize", () => this._onResize());

      this.phases[0].enter.call(this);
      this._loop = this._loop.bind(this);
    }

    start() {
      this._raf = requestAnimationFrame(this._loop);
    }

    stop() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    _preload() {
      const all = [
        this.sources.idle,
        ...this.sources.dribble,
        ...this.sources.shoot,
        ...this.sources.landing,
        this.sources.guts,
        this.sources.ball,
        ...this.sources.goal,
      ];
      all.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }

    _onResize() {
      if (this._resizeQueued) return;
      this._resizeQueued = true;
      requestAnimationFrame(() => {
        this._resizeQueued = false;
        this._layout();
      });
    }

    // ステージ寸法に応じた各種基準位置を計算する
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

    // キャラクターの中心x・足元からのジャンプオフセットを指定して配置する
    _placeCharacter(centerX, jumpOffsetY, squashY) {
      const sy = squashY === undefined ? 1 : squashY;
      this.character.setScale(this.cfg.CHARACTER_SCALE, this.cfg.CHARACTER_SCALE * sy);
      this.character.setPosition(centerX - 32, this.groundY - 64 + jumpOffsetY);
    }

    _updateGoalForFlight(t) {
      const th = this.cfg.GOAL_SEQUENCE_THRESHOLDS;
      const g = this.sources.goal;
      if (t < th.approach) {
        // ここまではオープンスペースの飛行なので、独立ボールをそのまま表示する
        this.goal.setFrame(g[0]);
        this.ball.sprite.setOpacity(1);
        return;
      }
      // goal_1〜goal_3 はリング付近のボール自体が絵に描き込まれているため、
      // ここから先は独立ボールを隠す(二重に見えてしまうのを防ぐ)
      this.ball.sprite.setOpacity(0);
      if (t < th.rim) {
        this.goal.setFrame(g[1]);
      } else if (t < th.through) {
        this.goal.setFrame(g[2]);
      } else {
        this.goal.setFrame(g[3]);
      }
    }

    /* ==============================
     * フェーズ(状態)定義
     * ============================== */
    _buildPhases() {
      const cfg = this.cfg;
      const fd = cfg.FRAME_DURATION;
      const src = this.sources;

      const dribbleCycleMs = fd.DRIBBLE * src.dribble.length;
      const dribbleMoveDuration = dribbleCycleMs * fd.DRIBBLE_LOOPS;

      this.phases = [
        {
          name: "idle",
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
          name: "dribbleMove",
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
          name: "shootPrep",
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
          name: "shootJump",
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
          name: "shootRelease",
          duration: fd.SHOOT_RELEASE,
          enter: function () {
            this.character.setFrame(this.sources.shoot[2]);

            const releaseCenter = {
              x: this.shootCenterX + this.charW * cfg.RELEASE_OFFSET_X_RATIO,
              y: this.groundY - this.charH - cfg.JUMP_HEIGHT + this.charH * cfg.RELEASE_OFFSET_Y_RATIO,
            };
            // ボール自身のアニメーション時間は「独立ボールを表示している区間」だけに短縮する。
            // こうすることでボールは approach しきい値の瞬間にちょうどリング中心へ到達し、
            // goal_1(リングにボールが描かれた絵)へ切り替わってもズレて「瞬間移動」して見えない。
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
          name: "ballFlight",
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
          name: "landing1",
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
          name: "landing2",
          duration: fd.LANDING_2,
          enter: function () {
            this.character.setFrame(this.sources.landing[1]);
          },
          update: function () {
            this._placeCharacter(this.shootCenterX, 0, 1);
          },
        },
        {
          name: "guts",
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
      // 1フレームのdtがフェーズの残り時間を超えても取りこぼさないようにループで処理する
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
      if (dt > 100) dt = 100; // タブ切替復帰時などの大きなジャンプを抑制

      this._advancePhase(dt);
      // ボール自身の位置更新(表示中はここで座標を進める。ゴール演出の切替は
      // 各フェーズのupdateから経過時間ベースで呼んでいるため、ここでは位置だけ更新する)
      this.ball.update(dt);

      this._raf = requestAnimationFrame(this._loop);
    }
  }

  /* ==============================
   * 起動
   * ============================== */
  function init() {
    const stage = document.getElementById("bball-stage");
    if (!stage) return;
    const controller = new AnimationController(stage, CONFIG, SPRITE_SOURCES);
    controller.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
