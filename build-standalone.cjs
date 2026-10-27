const fs = require('fs');
const path = require('path');

const assets = require('./assets_base64.json');

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Snakes and Ladder</title>
  <style>
    /* CSS Reset & Base */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --bg-deep: #030a1c;
      --bg-mid: #081738;
      --bg-highlight: #102a5c;
      --cyan-bright: #38bdf8;
      --cyan-glow: #00f0ff;
      --gold-rim: #ffd85b;
      --gold-glow: #facc15;
      --royal-blue: #1878ee;
      --panel-cream: #fffdf8;
      --panel-cream-alt: #f5ebd7;
      --color-p1: #ff5d66;
      --color-p2: #1878ee;
      --color-p3: #18a75b;
      --color-p4: #8a4de1;
      --color-p5: #ef8b20;
    }

    body {
      background: radial-gradient(ellipse at 50% 20%, var(--bg-highlight) 0%, var(--bg-mid) 55%, var(--bg-deep) 100%);
      color: #f1f5f9;
      font-family: 'Trebuchet MS', 'Arial Rounded MT Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    /* Screen Reader Only Utility */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Top App Header */
    .app-header {
      width: 100%;
      max-width: 1320px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      z-index: 10;
    }

    .title-banner {
      width: min(72vw, 720px);
      height: 120px;
      object-fit: cover;
      object-position: left 40%;
      filter: drop-shadow(0 6px 14px rgba(2, 6, 24, 0.9));
      user-select: none;
      pointer-events: none;
      display: block;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sound-toggle-btn {
      background: linear-gradient(135deg, #1e3a8a, #0f172a);
      color: #e0f2fe;
      border: 2px solid var(--cyan-bright);
      border-radius: 9999px;
      padding: 10px 20px;
      font-size: 15px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
      transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .sound-toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(56, 189, 248, 0.4);
      background: linear-gradient(135deg, #2563eb, #1e293b);
    }

    .sound-toggle-btn:focus-visible {
      outline: 3px solid var(--gold-rim);
      outline-offset: 3px;
    }

    /* Main Container */
    .main-wrapper {
      width: 100%;
      max-width: 1320px;
      padding: 0 16px 32px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    /* VIEW SCREENS */
    .view-screen {
      width: 100%;
      display: none;
    }

    .view-screen.active {
      display: block;
    }

    /* ========================================= */
    /* SETTINGS VIEW                             */
    /* ========================================= */
    .settings-container {
      max-width: 820px;
      margin: 10px auto 30px auto;
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(30, 58, 138, 0.88));
      border: 2px solid #38bdf8;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.25);
      border-radius: 24px;
      padding: 32px;
      backdrop-filter: blur(12px);
    }

    .settings-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .settings-header h1 {
      font-size: clamp(26px, 4vw, 36px);
      color: #ffd85b;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 216, 91, 0.4);
      margin-bottom: 8px;
    }

    .settings-header p {
      color: #93c5fd;
      font-size: clamp(14px, 2vw, 17px);
    }

    .settings-section {
      background: rgba(3, 10, 30, 0.65);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .settings-section h2 {
      font-size: 18px;
      color: #38bdf8;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Mode Selection Cards */
    .mode-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .mode-card {
      background: rgba(15, 23, 42, 0.8);
      border: 2px solid rgba(56, 189, 248, 0.35);
      border-radius: 14px;
      padding: 16px;
      color: #f8fafc;
      font-family: inherit;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-align: center;
      transition: all 0.2s ease;
      min-height: 80px;
    }

    .mode-card:hover {
      background: rgba(30, 58, 138, 0.6);
      border-color: #38bdf8;
      transform: translateY(-2px);
    }

    .mode-card[aria-pressed="true"] {
      border-color: #38bdf8;
      outline: 3px solid #38bdf8;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.5), inset 0 0 12px rgba(56, 189, 248, 0.2);
      background: linear-gradient(145deg, #1e3a8a, #0369a1);
    }

    .player-count-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px dashed rgba(56, 189, 248, 0.3);
    }

    .count-btn {
      flex: 1;
      min-width: 48px;
      height: 42px;
      background: rgba(15, 23, 42, 0.8);
      color: #e2e8f0;
      border: 2px solid rgba(56, 189, 248, 0.35);
      border-radius: 10px;
      font-family: inherit;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .count-btn:hover {
      border-color: #38bdf8;
    }

    .count-btn.active {
      background: #0284c7;
      border-color: #38bdf8;
      outline: 2px solid #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
      color: #fff;
    }

    /* Player Names Form */
    .player-names-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .player-name-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .player-color-dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      flex-shrink: 0;
    }

    .player-name-item label {
      font-size: 14px;
      font-weight: 700;
      width: 80px;
      flex-shrink: 0;
    }

    .player-name-input {
      flex: 1;
      background: rgba(15, 23, 42, 0.9);
      border: 2px solid rgba(56, 189, 248, 0.4);
      border-radius: 10px;
      padding: 10px 14px;
      color: #fff;
      font-family: inherit;
      font-size: 15px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .player-name-input:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
    }

    .player-name-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: rgba(15, 23, 42, 0.5);
    }

    .save-names-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-green {
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: #ffffff;
      border: 2px solid #4ade80;
      border-radius: 10px;
      padding: 10px 22px;
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
      transition: all 0.15s ease;
    }

    .btn-green:hover {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(34, 197, 94, 0.5);
    }

    .save-status-indicator {
      font-size: 14px;
      font-weight: 700;
    }

    .save-status-indicator.saved {
      color: #4ade80;
    }

    .save-status-indicator.unsaved {
      color: #fbbf24;
    }

    /* Question Editor Details */
    .question-details {
      background: rgba(3, 10, 30, 0.65);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 26px;
    }

    .question-details summary {
      font-size: 17px;
      font-weight: 700;
      color: #ffd85b;
      cursor: pointer;
      user-select: none;
      padding: 6px 0;
      outline: none;
    }

    .question-details summary:focus-visible {
      outline: 2px solid #ffd85b;
      outline-offset: 4px;
    }

    .question-editor-content {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .editor-subheading {
      font-size: 15px;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 8px;
    }

    .bulk-editor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 12px;
    }

    .bulk-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .bulk-field label {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 600;
    }

    .bulk-field textarea {
      width: 100%;
      height: 140px;
      background: rgba(15, 23, 42, 0.9);
      border: 2px solid rgba(56, 189, 248, 0.35);
      border-radius: 10px;
      color: #fff;
      font-family: inherit;
      font-size: 13px;
      padding: 10px;
      resize: vertical;
    }

    .bulk-field textarea:focus {
      outline: none;
      border-color: #38bdf8;
    }

    .single-square-box {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .single-square-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .square-select {
      background: #0f172a;
      color: #fff;
      border: 2px solid #38bdf8;
      border-radius: 8px;
      padding: 8px 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .single-input {
      flex: 1;
      min-width: 200px;
      background: rgba(15, 23, 42, 0.9);
      border: 2px solid rgba(56, 189, 248, 0.4);
      border-radius: 8px;
      padding: 8px 12px;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
    }

    .btn-secondary {
      background: #334155;
      color: #fff;
      border: 2px solid #64748b;
      border-radius: 8px;
      padding: 8px 16px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-secondary:hover {
      background: #475569;
    }

    .btn-danger {
      background: #991b1b;
      color: #fff;
      border: 2px solid #ef4444;
      border-radius: 8px;
      padding: 8px 16px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-danger:hover {
      background: #b91c1c;
    }

    .status-msg {
      font-size: 13px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-block;
    }

    .status-msg.success {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
      border: 1px solid #22c55e;
    }

    .status-msg.error {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid #ef4444;
    }

    /* Start Game Big Button */
    .start-game-btn {
      width: 100%;
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      color: #ffffff;
      border: 3px solid #4ade80;
      border-radius: 16px;
      padding: 16px;
      font-family: inherit;
      font-size: clamp(18px, 3vw, 22px);
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(22, 163, 74, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .start-game-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(34, 197, 94, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.5);
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .start-game-btn:focus-visible {
      outline: 4px solid var(--gold-rim);
      outline-offset: 4px;
    }

    /* ========================================= */
    /* PLAY GAME VIEW (BOARD + CONTROLS)         */
    /* ========================================= */
    .game-nav-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      gap: 12px;
    }

    .nav-btn {
      background: rgba(15, 23, 42, 0.85);
      color: #e0f2fe;
      border: 2px solid #38bdf8;
      border-radius: 9999px;
      padding: 8px 18px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }

    .nav-btn:hover {
      background: #1e3a8a;
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(56, 189, 248, 0.35);
    }

    .game-layout-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) clamp(260px, 28vw, 330px);
      gap: clamp(16px, 2.5vw, 28px);
      width: 100%;
      align-items: start;
    }

    /* Board Frame & Container */
    .board-column {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .board-frame {
      position: relative;
      width: 100%;
      aspect-ratio: 5 / 4;
      border-radius: 20px;
      overflow: hidden;
      /* Layered cyan & metallic royal-blue border */
      border: 6px solid #40e8ff;
      outline: 4px solid #0876ed;
      /* Golden outer halo + cyan inner/outer shadows */
      box-shadow:
        0 0 35px rgba(255, 215, 0, 0.45),
        0 0 65px rgba(2, 165, 235, 0.35),
        inset 0 0 20px rgba(64, 232, 255, 0.5),
        0 15px 35px rgba(0, 0, 0, 0.7);
      background: #061c52;
    }

    /* Mandatory Board Picture */
    .board-bg-img {
      position: absolute;
      left: 49.5%;
      top: 52.8%;
      width: 120%;
      height: 123%;
      transform: translate(-50%, -50%);
      object-fit: fill;
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }

    /* 5x4 Grid Overlay for Hit Areas & Question Icons */
    .board-grid {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      z-index: 2;
    }

    .square-hit-area {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent;
      user-select: none;
    }

    /* Question Mark Button in Each Square */
    .question-btn {
      position: absolute;
      top: 11%;
      right: 7%;
      width: clamp(22px, 3.4vw, 32px);
      height: clamp(22px, 3.4vw, 32px);
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.5);
      color: #ffffff;
      font-size: clamp(12px, 1.8vw, 17px);
      font-weight: 900;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      z-index: 4;
      padding: 0;
    }

    /* Special rule for square 10 so it does not cover the number 10 */
    .square-hit-area[data-square="10"] .question-btn {
      right: 24%;
    }

    /* Column colors for Question Buttons: Green, Blue, Purple, Coral, Orange */
    .col-color-1 { background: radial-gradient(circle at 35% 35%, #4ade80, #18a75b); }
    .col-color-2 { background: radial-gradient(circle at 35% 35%, #60a5fa, #1878ee); }
    .col-color-3 { background: radial-gradient(circle at 35% 35%, #c084fc, #8a4de1); }
    .col-color-4 { background: radial-gradient(circle at 35% 35%, #f87171, #ff5d66); }
    .col-color-5 { background: radial-gradient(circle at 35% 35%, #fb923c, #ef8b20); }

    /* When a question is saved for the square */
    .question-btn.has-question {
      background: radial-gradient(circle at 35% 35%, #4ade80, #16a34a) !important;
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.9), 0 2px 6px rgba(0, 0, 0, 0.5) !important;
      border-color: #dcfce7 !important;
    }

    .question-btn:hover {
      transform: scale(1.15);
      box-shadow: 0 0 14px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6);
    }

    .question-btn:focus-visible {
      outline: 3px solid var(--gold-rim);
      outline-offset: 2px;
    }

    /* Crying Snake Emoji Flash */
    .snake-flash-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 20;
      opacity: 0;
      transform: scale(0.4);
      transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    .snake-flash-overlay.active {
      opacity: 1;
      transform: scale(1);
    }

    .crying-emoji-badge {
      font-size: clamp(64px, 14vw, 130px);
      filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.8));
      animation: snakeCryShake 0.6s ease-in-out infinite alternate;
    }

    @keyframes snakeCryShake {
      0% { transform: rotate(-8deg) scale(0.95); }
      100% { transform: rotate(8deg) scale(1.05); }
    }

    /* Starting Dock */
    .starting-dock {
      width: 100%;
      background: linear-gradient(135deg, #091a3e, #040e24);
      border: 3px solid #1e40af;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5), 0 6px 16px rgba(0, 0, 0, 0.4);
      border-radius: 14px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .dock-label-group {
      display: flex;
      flex-direction: column;
    }

    .dock-title {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #38bdf8;
      text-transform: uppercase;
    }

    .dock-subtitle {
      font-size: 11px;
      color: #94a3b8;
    }

    .dock-slots-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      min-height: 46px;
      flex: 1;
      background: rgba(2, 6, 23, 0.6);
      border-radius: 10px;
      padding: 4px 12px;
      border: 1px dashed rgba(56, 189, 248, 0.4);
      position: relative;
    }

    /* Player Tokens Layer */
    .tokens-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 10;
    }

    .player-token {
      position: absolute;
      width: clamp(24px, 3.8vw, 42px);
      height: clamp(24px, 3.8vw, 42px);
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.6),
        inset 0 2px 4px rgba(255, 255, 255, 0.6),
        0 0 8px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 900;
      font-size: clamp(12px, 1.8vw, 17px);
      user-select: none;
      transform: translate(-50%, -50%);
      transition: left 0.24s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.24s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.2s ease;
      z-index: 12;
    }

    .player-token.hopping {
      animation: tokenHop 0.24s ease-out;
    }

    @keyframes tokenHop {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, calc(-50% - 18px)) scale(1.18); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }

    /* Token Gloss Effect */
    .player-token::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 5px;
      width: 50%;
      height: 35%;
      border-radius: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
      pointer-events: none;
    }

    /* Right Control Column */
    .controls-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }

    /* Cream Control Panel */
    .cream-control-panel {
      background: linear-gradient(145deg, var(--panel-cream), var(--panel-cream-alt));
      color: #0f172a;
      border: 4px solid var(--cyan-glow);
      outline: 3px solid #1878ee;
      border-radius: 22px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 240, 255, 0.25);
      padding: 20px 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }

    .turn-status-card {
      text-align: center;
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 12px;
    }

    .turn-badge {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: #0369a1;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .active-player-name {
      font-size: clamp(20px, 2.6vw, 24px);
      font-weight: 900;
      color: #1e3a8a;
      margin-bottom: 4px;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
      word-break: break-word;
    }

    .game-status-line {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.3;
    }

    /* Side Avatar & 3D Dice Stage */
    .stage-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 12px;
      padding: 6px 0;
    }

    /* Avatar Box with 3 animated bouncing ? */
    .avatar-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .avatar-floating-marks {
      display: flex;
      gap: 6px;
      font-size: 16px;
      font-weight: 900;
      color: #0284c7;
      text-shadow: 0 0 6px rgba(56, 189, 248, 0.8);
      height: 20px;
      margin-bottom: 4px;
    }

    .avatar-floating-marks span {
      animation: floatQMark 1.2s ease-in-out infinite alternate;
    }

    .avatar-floating-marks span:nth-child(2) {
      animation-delay: 0.25s;
      color: #2563eb;
    }

    .avatar-floating-marks span:nth-child(3) {
      animation-delay: 0.5s;
      color: #7c3aed;
    }

    @keyframes floatQMark {
      0% { transform: translateY(0); }
      100% { transform: translateY(-7px); }
    }

    .side-avatar-img {
      width: 86px;
      height: 98px;
      object-fit: cover;
      border-radius: 16px;
      border: 3px solid #38bdf8;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
      background: #0f172a;
      user-select: none;
      pointer-events: none;
      display: block;
    }

    /* 3D Dice Stage */
    .dice-stage-button {
      width: 96px;
      height: 96px;
      perspective: 600px;
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      user-select: none;
      touch-action: manipulation;
    }

    .dice-stage-button:focus-visible {
      outline: 3px solid #0284c7;
      outline-offset: 4px;
      border-radius: 18px;
    }

    .dice-cube {
      width: 76px;
      height: 76px;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(-12deg) rotateY(16deg);
      transition: transform 1s cubic-bezier(0.2, 0.9, 0.3, 1.1);
    }

    .dice-face {
      position: absolute;
      width: 76px;
      height: 76px;
      border-radius: 15px;
      background: linear-gradient(135deg, #32dfff 0%, #087cf4 35%, #0a439f 70%, #061c52 100%);
      border: 2.5px solid var(--gold-rim);
      box-shadow:
        inset 0 0 10px rgba(0, 240, 255, 0.4),
        0 4px 10px rgba(0, 0, 0, 0.5),
        0 0 8px rgba(255, 216, 91, 0.3);
      display: grid;
      padding: 9px;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      box-sizing: border-box;
      backface-visibility: hidden;
    }

    /* Recessed Glowing Golden Pip */
    .pip {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #fff9d6, #facc15 60%, #b45309 100%);
      box-shadow:
        inset 0 1px 2px rgba(0, 0, 0, 0.7),
        0 0 6px rgba(250, 204, 21, 0.8);
      margin: auto;
    }

    /* 6 Physical Cube Faces Translated by 38px */
    .dice-face.face-1 { transform: rotateY(0deg) translateZ(38px); }
    .dice-face.face-2 { transform: rotateY(90deg) translateZ(38px); }
    .dice-face.face-3 { transform: rotateY(180deg) translateZ(38px); }
    .dice-face.face-4 { transform: rotateY(-90deg) translateZ(38px); }
    .dice-face.face-5 { transform: rotateX(90deg) translateZ(38px); }
    .dice-face.face-6 { transform: rotateX(-90deg) translateZ(38px); }

    /* Pip arrangements */
    .pip-c { grid-column: 2; grid-row: 2; }
    .pip-tl { grid-column: 1; grid-row: 1; }
    .pip-tr { grid-column: 3; grid-row: 1; }
    .pip-ml { grid-column: 1; grid-row: 2; }
    .pip-mr { grid-column: 3; grid-row: 2; }
    .pip-bl { grid-column: 1; grid-row: 3; }
    .pip-br { grid-column: 3; grid-row: 3; }

    /* Move Button */
    .move-prompt-btn {
      width: 100%;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: 3px solid #38bdf8;
      border-radius: 12px;
      padding: 12px;
      font-family: inherit;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.6), 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.15s ease;
      display: none;
      animation: pulseGlow 1.2s infinite alternate;
    }

    .move-prompt-btn.active {
      display: block;
    }

    .move-prompt-btn:hover {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      transform: translateY(-1px);
    }

    @keyframes pulseGlow {
      0% { box-shadow: 0 0 10px rgba(56, 189, 248, 0.4); }
      100% { box-shadow: 0 0 22px rgba(56, 189, 248, 0.85); }
    }

    /* Player Roster */
    .roster-card {
      border-top: 2px dashed #cbd5e1;
      padding-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .roster-header {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .roster-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 10px;
      background: rgba(241, 245, 249, 0.8);
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .roster-item.active {
      background: #ffffff;
      border-color: #0284c7;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.35);
      outline: 2px solid #0284c7;
    }

    .roster-player-info {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .roster-color-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1.5px solid #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      flex-shrink: 0;
    }

    .roster-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    .roster-trophies {
      font-size: 14px;
      font-weight: 800;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 9999px;
      padding: 3px 8px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Footer Signature */
    .game-footer {
      text-align: center;
      margin-top: 14px;
      user-select: none;
    }

    .author-name {
      font-size: 15px;
      font-weight: 800;
      color: #facc15;
      text-shadow: 0 0 10px rgba(250, 204, 21, 0.7);
      margin-bottom: 2px;
      letter-spacing: 0.3px;
    }

    .author-title {
      font-size: 12px;
      color: #fef3c7;
      font-weight: 500;
      letter-spacing: 0.2px;
    }

    /* ========================================= */
    /* MODALS & DIALOGS                          */
    /* ========================================= */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.82);
      backdrop-filter: blur(6px);
      z-index: 50;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .modal-backdrop.open {
      display: flex;
    }

    .modal-card {
      width: 100%;
      max-width: 480px;
      background: linear-gradient(145deg, #0f172a, #1e3a8a);
      border: 3px solid #38bdf8;
      border-radius: 20px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.35);
      padding: 24px;
      position: relative;
      animation: modalPop 0.2s ease-out;
    }

    @keyframes modalPop {
      0% { opacity: 0; transform: scale(0.92); }
      100% { opacity: 1; transform: scale(1); }
    }

    .modal-card h2 {
      font-size: 20px;
      color: #ffd85b;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .question-prompt-text {
      font-size: 16px;
      line-height: 1.4;
      color: #f8fafc;
      margin-bottom: 16px;
      padding: 12px;
      background: rgba(3, 10, 30, 0.7);
      border-radius: 10px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .modal-answer-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.95);
      border: 2px solid #38bdf8;
      border-radius: 10px;
      padding: 12px 14px;
      color: #fff;
      font-family: inherit;
      font-size: 16px;
      margin-bottom: 12px;
    }

    .modal-answer-input:focus {
      outline: none;
      border-color: #ffd85b;
      box-shadow: 0 0 12px rgba(255, 216, 91, 0.5);
    }

    .modal-feedback {
      min-height: 24px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    /* Victory Screen Full Overlay */
    .victory-overlay {
      position: fixed;
      inset: 0;
      background: rgba(3, 10, 30, 0.95);
      backdrop-filter: blur(8px);
      z-index: 60;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 24px;
      text-align: center;
    }

    .victory-overlay.open {
      display: flex;
    }

    .victory-trophy-large {
      font-size: clamp(80px, 16vw, 140px);
      animation: trophyFloat 2s ease-in-out infinite alternate;
      filter: drop-shadow(0 10px 20px rgba(250, 204, 21, 0.6));
    }

    @keyframes trophyFloat {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-16px) scale(1.08); }
    }

    .victory-title {
      font-size: clamp(36px, 6vw, 54px);
      color: #ffd85b;
      font-weight: 900;
      text-shadow: 0 0 25px rgba(255, 216, 91, 0.8), 0 4px 10px rgba(0, 0, 0, 0.8);
      margin-bottom: 12px;
    }

    .victory-reason {
      font-size: clamp(18px, 3.2vw, 24px);
      color: #e0f2fe;
      margin-bottom: 24px;
      max-width: 600px;
      line-height: 1.4;
    }

    .victory-replay-btn {
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: #fff;
      border: 3px solid #4ade80;
      border-radius: 9999px;
      padding: 14px 38px;
      font-size: 20px;
      font-weight: 800;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 6px 16px rgba(0, 0, 0, 0.5);
      transition: all 0.15s ease;
    }

    .victory-replay-btn:hover {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      transform: translateY(-2px);
    }

    /* Confetti Canvas / Pieces */
    .confetti-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 61;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 14px;
      opacity: 0.9;
      animation: confettiFall linear infinite;
    }

    @keyframes confettiFall {
      0% {
        transform: translateY(-50px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(105vh) rotate(720deg);
        opacity: 0.2;
      }
    }

    /* ========================================= */
    /* RESPONSIVE DESIGN                         */
    /* ========================================= */
    @media (max-width: 850px) {
      .game-layout-grid {
        grid-template-columns: 1fr;
        max-width: 650px;
        margin: 0 auto;
      }

      .controls-column {
        order: 2;
        width: 100%;
      }

      .board-column {
        order: 1;
      }
    }

    @media (max-width: 480px) {
      .app-header {
        padding: 8px 12px;
      }

      .title-banner {
        width: min(64vw, 250px);
        height: 46px;
      }

      .sound-toggle-btn {
        padding: 8px 14px;
        font-size: 13px;
      }

      .main-wrapper {
        padding: 0 8px 24px 8px;
      }

      .settings-container {
        padding: 20px 14px;
      }

      .mode-cards-grid {
        grid-template-columns: 1fr;
      }

      .bulk-editor-grid {
        grid-template-columns: 1fr;
      }

      .stage-row {
        gap: 8px;
      }

      .side-avatar-img {
        width: 72px;
        height: 84px;
      }

      .board-frame {
        border-width: 4px;
      }
    }

    /* Reduced Motion Accessibility */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="app-header">
    <img
      src="${assets.title}"
      alt="SNAKES AND LADDER"
      class="title-banner"
    />
    <div class="header-actions">
      <button
        id="soundToggleBtn"
        class="sound-toggle-btn"
        aria-pressed="true"
        aria-label="Toggle sound effects"
      >
        🔊 Sound on
      </button>
    </div>
  </header>

  <!-- Live Announcer for screen readers -->
  <div id="liveAnnouncer" class="sr-only" aria-live="assertive"></div>

  <!-- Main Content Wrapper -->
  <main class="main-wrapper">
    <!-- VIEW 1: SETTINGS SCREEN -->
    <section id="settingsScreen" class="view-screen active" aria-label="Game Setup">
      <div class="settings-container">
        <header class="settings-header">
          <h1>Set up your game</h1>
          <p>Choose how to play, save the player names, and add your learning questions.</p>
        </header>

        <!-- Play Modes -->
        <div class="settings-section">
          <h2><span>🎮</span> Play Mode</h2>
          <div class="mode-cards-grid">
            <button
              id="modeCpuBtn"
              class="mode-card"
              type="button"
              aria-pressed="true"
            >
              <span style="font-size: 22px;">🤖</span>
              <span>Versus computer</span>
            </button>
            <button
              id="modeLocalBtn"
              class="mode-card"
              type="button"
              aria-pressed="false"
            >
              <span style="font-size: 22px;">👥</span>
              <span>Various players</span>
            </button>
          </div>

          <!-- Local Player Count Selector -->
          <div id="localPlayerCountGroup" class="player-count-row" style="display: none;">
            <span style="font-size: 14px; color: #94a3b8; font-weight: 700;">Number of players:</span>
            <button type="button" class="count-btn active" data-count="2">2</button>
            <button type="button" class="count-btn" data-count="3">3</button>
            <button type="button" class="count-btn" data-count="4">4</button>
            <button type="button" class="count-btn" data-count="5">5</button>
          </div>
        </div>

        <!-- Player Names -->
        <div class="settings-section">
          <h2><span>🏷️</span> Player Names</h2>
          <div id="playerNamesList" class="player-names-list">
            <!-- Dynamic Player Name Fields -->
          </div>

          <div class="save-names-bar">
            <button id="saveNamesBtn" type="button" class="btn-green">
              Save player names
            </button>
            <span id="saveStatusIndicator" class="save-status-indicator saved">
              ✓ 2 names saved
            </span>
          </div>
        </div>

        <!-- Question Editor -->
        <details class="question-details">
          <summary>Add or edit my questions</summary>
          <div class="question-editor-content">
            <!-- Bulk Editor -->
            <div>
              <div class="editor-subheading">Bulk Import (Lines 1 to 20 for Squares 1 to 20)</div>
              <div class="bulk-editor-grid">
                <div class="bulk-field">
                  <label for="bulkQuestions">Questions, one per line</label>
                  <textarea id="bulkQuestions" placeholder="Square 1 Question&#10;Square 2 Question&#10;..."></textarea>
                </div>
                <div class="bulk-field">
                  <label for="bulkAnswers">Answers, one per line</label>
                  <textarea id="bulkAnswers" placeholder="Square 1 Answer&#10;Square 2 Answer&#10;..."></textarea>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <button id="importBulkBtn" type="button" class="btn-secondary">
                  📥 Import bulk questions
                </button>
                <span id="bulkStatusMsg"></span>
              </div>
            </div>

            <!-- Single Square Editor -->
            <div class="single-square-box">
              <div class="editor-subheading">Single Square Editor</div>
              <div class="single-square-row">
                <label for="squareSelector" style="font-size: 14px; font-weight: 700; color: #94a3b8;">Square:</label>
                <select id="squareSelector" class="square-select">
                  <!-- 1 to 20 -->
                </select>
                <input
                  id="singleQuestionInput"
                  type="text"
                  class="single-input"
                  placeholder="Enter question for this square"
                />
                <input
                  id="singleAnswerInput"
                  type="text"
                  class="single-input"
                  placeholder="Exact answer"
                />
              </div>
              <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <button id="saveSingleSquareBtn" type="button" class="btn-green">Save this square</button>
                <button id="clearSingleSquareBtn" type="button" class="btn-danger">Clear this square</button>
                <span id="singleStatusMsg"></span>
              </div>
            </div>
          </div>
        </details>

        <!-- Start Game Button -->
        <button id="startGameBtn" type="button" class="start-game-btn">
          Start the game ▶
        </button>
      </div>
    </section>

    <!-- VIEW 2: GAME SCREEN -->
    <section id="gameScreen" class="view-screen" aria-label="Game Board and Play Area">
      <!-- Game Action Bar -->
      <nav class="game-nav-bar" aria-label="Game Navigation">
        <button id="backToSettingsBtn" type="button" class="nav-btn">
          ← Back to settings
        </button>
        <button id="restartGameBtn" type="button" class="nav-btn">
          ↻ Restart game
        </button>
      </nav>

      <div class="game-layout-grid">
        <!-- Left: Board Column -->
        <div class="board-column">
          <div class="board-frame" id="boardFrame" aria-label="Snakes and Ladder Board">
            <!-- Mandatory Board Picture -->
            <img
              src="${assets.board}"
              alt="Snakes and Ladder Game Board"
              class="board-bg-img"
            />

            <!-- 5x4 Grid Overlay for Hit Areas & Question Buttons -->
            <div class="board-grid" id="boardGrid">
              <!-- Dynamically populated with 20 squares in exact serpentine order -->
            </div>

            <!-- Tokens Layer -->
            <div class="tokens-layer" id="boardTokensLayer">
              <!-- Dynamically positioned player tokens -->
            </div>

            <!-- Crying Snake Flash Overlay -->
            <div class="snake-flash-overlay" id="snakeFlashOverlay">
              <div class="crying-emoji-badge">😭</div>
            </div>
          </div>

          <!-- Starting Dock -->
          <div class="starting-dock" aria-label="Starting Dock">
            <div class="dock-label-group">
              <span class="dock-title">Starting Dock</span>
              <span class="dock-subtitle">Position 0</span>
            </div>
            <div class="dock-slots-container" id="dockContainer">
              <!-- Tokens at 0 go here -->
            </div>
          </div>
        </div>

        <!-- Right: Control Column -->
        <aside class="controls-column" aria-label="Game Controls and Status">
          <div class="cream-control-panel">
            <!-- Active Turn Display -->
            <div class="turn-status-card">
              <div class="turn-badge">Current Turn</div>
              <div id="activePlayerName" class="active-player-name">Player 1</div>
              <div id="gameStatusLine" class="game-status-line">Click the dice to roll.</div>
            </div>

            <!-- Avatar & 3D Dice Stage -->
            <div class="stage-row">
              <div class="avatar-wrapper">
                <div class="avatar-floating-marks">
                  <span>?</span><span>?</span><span>?</span>
                </div>
                <img
                  src="${assets.avatar}"
                  alt="Side Panel Snake Avatar"
                  class="side-avatar-img"
                />
              </div>

              <!-- Stationary 96x96 Dice Button -->
              <button
                id="diceBtn"
                class="dice-stage-button"
                type="button"
                aria-label="Roll the dice"
              >
                <div class="dice-cube" id="diceCube">
                  <!-- Face 1 (front) -->
                  <div class="dice-face face-1">
                    <div class="pip pip-c"></div>
                  </div>
                  <!-- Face 2 (right) -->
                  <div class="dice-face face-2">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-br"></div>
                  </div>
                  <!-- Face 3 (back) -->
                  <div class="dice-face face-3">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-c"></div>
                    <div class="pip pip-br"></div>
                  </div>
                  <!-- Face 4 (left) -->
                  <div class="dice-face face-4">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-bl"></div>
                    <div class="pip pip-br"></div>
                  </div>
                  <!-- Face 5 (top) -->
                  <div class="dice-face face-5">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-c"></div>
                    <div class="pip pip-bl"></div>
                    <div class="pip pip-br"></div>
                  </div>
                  <!-- Face 6 (bottom) -->
                  <div class="dice-face face-6">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-ml"></div>
                    <div class="pip pip-mr"></div>
                    <div class="pip pip-bl"></div>
                    <div class="pip pip-br"></div>
                  </div>
                </div>
              </button>
            </div>

            <!-- Glowing Move Button for Human Turn -->
            <button id="moveSpaceBtn" type="button" class="move-prompt-btn">
              Move 0 spaces
            </button>

            <!-- Player Roster & Trophy Counters -->
            <div class="roster-card">
              <div class="roster-header">Players &amp; Trophies</div>
              <div id="rosterList">
                <!-- Dynamically generated rows -->
              </div>
            </div>
          </div>

          <!-- Mandatory Footer Signature -->
          <footer class="game-footer">
            <div class="author-name">Dr.Abir Wafa</div>
            <div class="author-title">Head of EdTech at Edulixa</div>
          </footer>
        </aside>
      </div>
    </section>
  </main>

  <!-- QUESTION MODAL -->
  <div id="questionModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="questionModalTitle">
    <div class="modal-card">
      <h2 id="questionModalTitle">Square 1 question</h2>
      <div id="questionPromptText" class="question-prompt-text">What is 2 + 2?</div>
      <div id="questionInputContainer">
        <input
          id="modalAnswerInput"
          type="text"
          class="modal-answer-input"
          placeholder="Type your answer here..."
          autocomplete="off"
        />
        <div id="modalFeedbackMsg" class="modal-feedback"></div>
      </div>
      <div class="modal-actions">
        <button id="modalCloseBtn" type="button" class="btn-secondary">Close</button>
        <button id="modalSubmitBtn" type="button" class="btn-green">Check my answer</button>
      </div>
    </div>
  </div>

  <!-- VICTORY OVERLAY -->
  <div id="victoryOverlay" class="victory-overlay" role="dialog" aria-modal="true" aria-labelledby="victoryTitle">
    <div class="confetti-container" id="confettiContainer"></div>
    <div class="victory-trophy-large">🏆</div>
    <h1 id="victoryTitle" class="victory-title">Victory!</h1>
    <div id="victoryReason" class="victory-reason">Player 1 reached square 20!</div>
    <button id="victoryPlayAgainBtn" type="button" class="victory-replay-btn">
      Play again ↻
    </button>
  </div>

  <!-- COMPLETE GAME JAVASCRIPT LOGIC -->
  <script>
  (function() {
    'use strict';

    /* ========================================================== */
    /* 1. CONSTANTS & INITIAL DATA                                */
    /* ========================================================== */
    const PLAYER_COLORS = [
      '#ff5d66', // 1: coral
      '#1878ee', // 2: blue
      '#18a75b', // 3: green
      '#8a4de1', // 4: purple
      '#ef8b20'  // 5: orange
    ];

    const COLUMN_COLOR_CLASSES = [
      'col-color-1',
      'col-color-2',
      'col-color-3',
      'col-color-4',
      'col-color-5'
    ];

    // Serpentine square placement: 5 columns x 4 rows
    // Row 1 (top): 20, 19, 18, 17, 16
    // Row 2: 11, 12, 13, 14, 15
    // Row 3: 10, 9, 8, 7, 6
    // Row 4 (bottom): 1, 2, 3, 4, 5
    const BOARD_SQUARE_ORDER = [
      20, 19, 18, 17, 16,
      11, 12, 13, 14, 15,
      10,  9,  8,  7,  6,
       1,  2,  3,  4,  5
    ];

    // Ladders: 2->9, 7->14, 12->19
    const LADDERS = {
      2: 9,
      7: 14,
      12: 19
    };

    // Snakes: 11->10, 13->8, 15->6 (none return to dock)
    const SNAKES = {
      11: 10,
      13: 8,
      15: 6
    };

    // 20 rich default educational questions
    const DEFAULT_QUESTIONS = [
      { q: "What is 5 + 7?", a: "12" },
      { q: "What planet is known as the Red Planet?", a: "Mars" },
      { q: "How many days are in a leap year?", a: "366" },
      { q: "What is the capital of France?", a: "Paris" },
      { q: "What gas do plants absorb from the air for photosynthesis?", a: "Carbon dioxide" },
      { q: "What is 9 x 8?", a: "72" },
      { q: "How many continents are there on Earth?", a: "7" },
      { q: "What is the largest ocean on Earth?", a: "Pacific" },
      { q: "Which animal is known as the King of the Jungle?", a: "Lion" },
      { q: "What is the freezing point of water in Celsius?", a: "0" },
      { q: "How many sides does an octagon have?", a: "8" },
      { q: "What force keeps our feet on the ground?", a: "Gravity" },
      { q: "What is 15 - 9?", a: "6" },
      { q: "Which primary color mixed with blue makes green?", a: "Yellow" },
      { q: "What is the boiling point of water in Celsius?", a: "100" },
      { q: "How many hours are in three full days?", a: "72" },
      { q: "What is the hardest natural substance on Earth?", a: "Diamond" },
      { q: "What color are emeralds?", a: "Green" },
      { q: "What is 100 divided by 4?", a: "25" },
      { q: "What is the closest star to planet Earth?", a: "Sun" }
    ];

    /* ========================================================== */
    /* 2. AUDIO SYNTHESIS ENGINE (WEB AUDIO API)                 */
    /* ========================================================== */
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.enabled = true;
      }

      initContext() {
        if (!this.ctx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            this.ctx = new AudioContextClass();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      }

      playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15, startTimeOffset = 0) {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime + startTimeOffset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(gainVal, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      }

      save() {
        this.playTone(523.25, 'triangle', 0.12, 0.15, 0);
        this.playTone(659.25, 'triangle', 0.18, 0.18, 0.1);
      }

      roll() {
        if (!this.enabled) return;
        this.initContext();
        // Rapid clicks mimicking dice tumbling
        for (let i = 0; i < 7; i++) {
          this.playTone(180 + Math.random() * 220, 'triangle', 0.04, 0.08, i * 0.08);
        }
      }

      step() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      }

      blocked() {
        this.playTone(160, 'sawtooth', 0.15, 0.15, 0);
        this.playTone(130, 'sawtooth', 0.2, 0.15, 0.1);
      }

      ladder() {
        // Ascending chime
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          this.playTone(freq, 'triangle', 0.18, 0.18, idx * 0.09);
        });
      }

      snake() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;
        // Descending slide / sad wobble
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
      }

      wrong() {
        this.playTone(180, 'square', 0.12, 0.12, 0);
        this.playTone(140, 'square', 0.2, 0.15, 0.14);
      }

      correct() {
        this.playTone(880, 'sine', 0.15, 0.2, 0);
        this.playTone(1174.66, 'triangle', 0.25, 0.25, 0.12);
      }

      trophy() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          this.playTone(freq, 'triangle', 0.2, 0.22, idx * 0.08);
        });
      }

      victory() {
        const fanfare = [
          { f: 523.25, d: 0.18, t: 0 },
          { f: 659.25, d: 0.18, t: 0.18 },
          { f: 783.99, d: 0.24, t: 0.36 },
          { f: 1046.50, d: 0.55, t: 0.60 }
        ];
        fanfare.forEach(n => {
          this.playTone(n.f, 'triangle', n.d, 0.25, n.t);
        });
      }
    }

    const sound = new SoundEngine();

    /* ========================================================== */
    /* 3. CENTRAL APPLICATION STATE                               */
    /* ========================================================== */
    const state = {
      mode: 'cpu', // 'cpu' or 'local'
      localPlayerCount: 2,
      savedNames: ['P1', 'CPU'],
      players: [],
      activePlayerIndex: 0,
      rolledValue: 1,
      isRolling: false,
      isMoving: false,
      isGameOver: false,
      openSquareForModal: null,
      questions: Array.from({ length: 20 }, (_, i) => ({
        q: DEFAULT_QUESTIONS[i] ? DEFAULT_QUESTIONS[i].q : '',
        a: DEFAULT_QUESTIONS[i] ? DEFAULT_QUESTIONS[i].a : ''
      })),
      activeFaceTilt: { x: -12, y: 16 }
    };

    /* ========================================================== */
    /* 4. LOCAL STORAGE HELPERS                                   */
    /* ========================================================== */
    function loadSavedSettings() {
      try {
        const rawNames = localStorage.getItem('snakeTrailNames');
        if (rawNames) {
          const parsed = JSON.parse(rawNames);
          if (Array.isArray(parsed) && parsed.length >= 2) {
            state.savedNames = parsed.map(n => String(n).trim().slice(0, 22));
          }
        }
      } catch (err) {
        console.warn('Failed to parse snakeTrailNames:', err);
      }

      try {
        const rawQuestions = localStorage.getItem('snakeTrailQuestions');
        if (rawQuestions) {
          const parsedQ = JSON.parse(rawQuestions);
          if (Array.isArray(parsedQ) && parsedQ.length === 20) {
            state.questions = parsedQ.map(item => ({
              q: item && item.q ? String(item.q) : '',
              a: item && item.a ? String(item.a) : ''
            }));
          }
        }
      } catch (err) {
        console.warn('Failed to parse snakeTrailQuestions:', err);
      }
    }

    function saveQuestionsToStorage() {
      try {
        localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
      } catch (err) {
        console.warn('Could not save questions to localStorage:', err);
      }
    }

    function saveNamesToStorage() {
      try {
        localStorage.setItem('snakeTrailNames', JSON.stringify(state.savedNames));
      } catch (err) {
        console.warn('Could not save names to localStorage:', err);
      }
    }

    /* ========================================================== */
    /* 5. DOM ELEMENTS CACHE                                      */
    /* ========================================================== */
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const liveAnnouncer = document.getElementById('liveAnnouncer');

    // Screens
    const settingsScreen = document.getElementById('settingsScreen');
    const gameScreen = document.getElementById('gameScreen');

    // Settings elements
    const modeCpuBtn = document.getElementById('modeCpuBtn');
    const modeLocalBtn = document.getElementById('modeLocalBtn');
    const localPlayerCountGroup = document.getElementById('localPlayerCountGroup');
    const countButtons = localPlayerCountGroup.querySelectorAll('.count-btn');
    const playerNamesList = document.getElementById('playerNamesList');
    const saveNamesBtn = document.getElementById('saveNamesBtn');
    const saveStatusIndicator = document.getElementById('saveStatusIndicator');
    const bulkQuestions = document.getElementById('bulkQuestions');
    const bulkAnswers = document.getElementById('bulkAnswers');
    const importBulkBtn = document.getElementById('importBulkBtn');
    const bulkStatusMsg = document.getElementById('bulkStatusMsg');
    const squareSelector = document.getElementById('squareSelector');
    const singleQuestionInput = document.getElementById('singleQuestionInput');
    const singleAnswerInput = document.getElementById('singleAnswerInput');
    const saveSingleSquareBtn = document.getElementById('saveSingleSquareBtn');
    const clearSingleSquareBtn = document.getElementById('clearSingleSquareBtn');
    const singleStatusMsg = document.getElementById('singleStatusMsg');
    const startGameBtn = document.getElementById('startGameBtn');

    // Game elements
    const backToSettingsBtn = document.getElementById('backToSettingsBtn');
    const restartGameBtn = document.getElementById('restartGameBtn');
    const boardFrame = document.getElementById('boardFrame');
    const boardGrid = document.getElementById('boardGrid');
    const boardTokensLayer = document.getElementById('boardTokensLayer');
    const dockContainer = document.getElementById('dockContainer');
    const snakeFlashOverlay = document.getElementById('snakeFlashOverlay');
    const activePlayerName = document.getElementById('activePlayerName');
    const gameStatusLine = document.getElementById('gameStatusLine');
    const diceBtn = document.getElementById('diceBtn');
    const diceCube = document.getElementById('diceCube');
    const moveSpaceBtn = document.getElementById('moveSpaceBtn');
    const rosterList = document.getElementById('rosterList');

    // Question Modal
    const questionModal = document.getElementById('questionModal');
    const questionModalTitle = document.getElementById('questionModalTitle');
    const questionPromptText = document.getElementById('questionPromptText');
    const modalAnswerInput = document.getElementById('modalAnswerInput');
    const modalFeedbackMsg = document.getElementById('modalFeedbackMsg');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');

    // Victory Overlay
    const victoryOverlay = document.getElementById('victoryOverlay');
    const victoryReason = document.getElementById('victoryReason');
    const victoryPlayAgainBtn = document.getElementById('victoryPlayAgainBtn');
    const confettiContainer = document.getElementById('confettiContainer');

    function announce(msg) {
      if (liveAnnouncer) {
        liveAnnouncer.textContent = msg;
      }
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    /* ========================================================== */
    /* 6. SETTINGS VIEW LOGIC & RENDERING                         */
    /* ========================================================== */
    function renderSettingsPlayerInputs() {
      const targetCount = state.mode === 'cpu' ? 2 : state.localPlayerCount;
      playerNamesList.innerHTML = '';

      for (let i = 0; i < targetCount; i++) {
        const item = document.createElement('div');
        item.className = 'player-name-item';

        const colorDot = document.createElement('div');
        colorDot.className = 'player-color-dot';
        colorDot.style.backgroundColor = PLAYER_COLORS[i];

        const label = document.createElement('label');
        label.setAttribute('for', 'playerNameInput_' + i);
        label.textContent = state.mode === 'cpu' && i === 1 ? 'Computer:' : 'Player ' + (i + 1) + ':';

        const input = document.createElement('input');
        input.id = 'playerNameInput_' + i;
        input.type = 'text';
        input.className = 'player-name-input';
        input.maxLength = 22;

        if (state.mode === 'cpu' && i === 1) {
          input.value = 'CPU';
          input.disabled = true;
        } else {
          const val = state.savedNames[i] !== undefined && state.savedNames[i] !== '' ? state.savedNames[i] : 'P' + (i + 1);
          input.value = val;
        }

        input.addEventListener('input', () => {
          saveStatusIndicator.textContent = 'Unsaved changes';
          saveStatusIndicator.className = 'save-status-indicator unsaved';
        });

        item.appendChild(colorDot);
        item.appendChild(label);
        item.appendChild(input);
        playerNamesList.appendChild(item);
      }

      saveStatusIndicator.textContent = '✓ ' + targetCount + ' names saved';
      saveStatusIndicator.className = 'save-status-indicator saved';
    }

    function populateSquareSelector() {
      squareSelector.innerHTML = '';
      for (let i = 1; i <= 20; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = 'Square ' + i;
        squareSelector.appendChild(opt);
      }
      onSquareSelectorChange();
    }

    function onSquareSelectorChange() {
      const sq = parseInt(squareSelector.value, 10);
      const record = state.questions[sq - 1] || { q: '', a: '' };
      singleQuestionInput.value = record.q || '';
      singleAnswerInput.value = record.a || '';
      singleStatusMsg.textContent = '';
      singleStatusMsg.className = 'status-msg';
    }

    function saveSingleSquare() {
      const sq = parseInt(squareSelector.value, 10);
      const qVal = singleQuestionInput.value.trim();
      const aVal = singleAnswerInput.value.trim();

      state.questions[sq - 1] = { q: qVal, a: aVal };
      saveQuestionsToStorage();
      sound.save();

      singleStatusMsg.textContent = 'Square ' + sq + ' saved!';
      singleStatusMsg.className = 'status-msg success';
      updateBoardQuestionIconsHighlight();
    }

    function clearSingleSquare() {
      const sq = parseInt(squareSelector.value, 10);
      state.questions[sq - 1] = { q: '', a: '' };
      singleQuestionInput.value = '';
      singleAnswerInput.value = '';
      saveQuestionsToStorage();
      sound.save();

      singleStatusMsg.textContent = 'Square ' + sq + ' cleared!';
      singleStatusMsg.className = 'status-msg success';
      updateBoardQuestionIconsHighlight();
    }

    function importBulkQuestions() {
      const qLines = bulkQuestions.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
      const aLines = bulkAnswers.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);

      if (qLines.length === 0 || aLines.length === 0) {
        bulkStatusMsg.textContent = 'Error: Both lists must contain at least 1 non-empty line.';
        bulkStatusMsg.className = 'status-msg error';
        return;
      }

      if (qLines.length !== aLines.length) {
        bulkStatusMsg.textContent = 'Error: Line count mismatch (' + qLines.length + ' questions vs ' + aLines.length + ' answers).';
        bulkStatusMsg.className = 'status-msg error';
        return;
      }

      if (qLines.length > 20) {
        bulkStatusMsg.textContent = 'Error: Maximum 20 questions accepted.';
        bulkStatusMsg.className = 'status-msg error';
        return;
      }

      for (let i = 0; i < qLines.length; i++) {
        state.questions[i] = { q: qLines[i], a: aLines[i] };
      }

      saveQuestionsToStorage();
      sound.save();
      bulkStatusMsg.textContent = '✓ Successfully imported ' + qLines.length + ' questions!';
      bulkStatusMsg.className = 'status-msg success';
      onSquareSelectorChange();
      updateBoardQuestionIconsHighlight();
    }

    function savePlayerNamesFromUI() {
      const targetCount = state.mode === 'cpu' ? 2 : state.localPlayerCount;
      const names = [];

      for (let i = 0; i < targetCount; i++) {
        const input = document.getElementById('playerNameInput_' + i);
        let val = input ? input.value.trim() : '';
        if (state.mode === 'cpu' && i === 1) {
          val = 'CPU';
        } else if (!val) {
          val = 'P' + (i + 1);
        }
        names.push(val.slice(0, 22));
      }

      state.savedNames = names;
      saveNamesToStorage();
      sound.save();

      saveStatusIndicator.textContent = '✓ ' + targetCount + ' names saved';
      saveStatusIndicator.className = 'save-status-indicator saved';
    }

    /* ========================================================== */
    /* 7. INITIALIZE GAME RUNTIME                                 */
    /* ========================================================== */
    function initializeGamePlayers() {
      savePlayerNamesFromUI();
      const count = state.mode === 'cpu' ? 2 : state.localPlayerCount;
      state.players = [];

      for (let i = 0; i < count; i++) {
        const name = (state.savedNames[i] && state.savedNames[i].trim()) || ('P' + (i + 1));
        state.players.push({
          id: i,
          name: state.mode === 'cpu' && i === 1 ? 'CPU' : name,
          isCpu: state.mode === 'cpu' && i === 1,
          color: PLAYER_COLORS[i],
          position: 0,
          trophies: 0,
          earnedSquares: new Set()
        });
      }

      state.activePlayerIndex = 0;
      state.rolledValue = 1;
      state.isRolling = false;
      state.isMoving = false;
      state.isGameOver = false;

      renderBoardGrid();
      renderRosterList();
      updateTurnUI();
      updateTokensPlacement();
      updateBoardQuestionIconsHighlight();

      settingsScreen.classList.remove('active');
      gameScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderBoardGrid() {
      boardGrid.innerHTML = '';
      // Serpentine square placement: 5 columns x 4 rows
      for (let idx = 0; idx < BOARD_SQUARE_ORDER.length; idx++) {
        const sqNumber = BOARD_SQUARE_ORDER[idx];
        const colIndex = idx % 5; // 0 to 4

        const squareEl = document.createElement('div');
        squareEl.className = 'square-hit-area';
        squareEl.setAttribute('data-square', sqNumber);

        // Accessible question button
        const qBtn = document.createElement('button');
        qBtn.type = 'button';
        qBtn.className = 'question-btn ' + COLUMN_COLOR_CLASSES[colIndex];
        qBtn.setAttribute('data-square', sqNumber);
        qBtn.setAttribute('aria-label', 'Open question for square ' + sqNumber);
        qBtn.textContent = '?';

        qBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onQuestionIconClick(sqNumber);
        });

        squareEl.appendChild(qBtn);
        boardGrid.appendChild(squareEl);
      }
    }

    function updateBoardQuestionIconsHighlight() {
      const buttons = boardGrid.querySelectorAll('.question-btn');
      buttons.forEach(btn => {
        const sq = parseInt(btn.getAttribute('data-square'), 10);
        const qRec = state.questions[sq - 1];
        if (qRec && qRec.q && qRec.q.trim().length > 0) {
          btn.classList.add('has-question');
        } else {
          btn.classList.remove('has-question');
        }
      });
    }

    function renderRosterList() {
      rosterList.innerHTML = '';
      state.players.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = 'roster-item' + (idx === state.activePlayerIndex ? ' active' : '');
        item.id = 'rosterItem_' + idx;

        const info = document.createElement('div');
        info.className = 'roster-player-info';

        const dot = document.createElement('div');
        dot.className = 'roster-color-dot';
        dot.style.backgroundColor = p.color;

        const name = document.createElement('span');
        name.className = 'roster-name';
        name.textContent = p.name;

        info.appendChild(dot);
        info.appendChild(name);

        const trophies = document.createElement('span');
        trophies.className = 'roster-trophies';
        trophies.id = 'trophyBadge_' + idx;
        trophies.textContent = '🏆 ' + p.trophies + '/5';

        item.appendChild(info);
        item.appendChild(trophies);
        rosterList.appendChild(item);
      });
    }

    function updateTurnUI() {
      const activePlayer = state.players[state.activePlayerIndex];
      if (!activePlayer) return;

      activePlayerName.textContent = activePlayer.name;
      activePlayerName.style.color = activePlayer.color;

      // Update roster highlights
      state.players.forEach((_, idx) => {
        const row = document.getElementById('rosterItem_' + idx);
        if (row) {
          if (idx === state.activePlayerIndex) {
            row.classList.add('active');
            row.style.borderColor = activePlayer.color;
            row.style.outlineColor = activePlayer.color;
          } else {
            row.classList.remove('active');
            row.style.borderColor = 'transparent';
            row.style.outlineColor = 'transparent';
          }
        }
      });

      moveSpaceBtn.classList.remove('active');
      moveSpaceBtn.style.display = 'none';

      if (activePlayer.isCpu) {
        gameStatusLine.textContent = 'Computer is thinking...';
        diceBtn.disabled = true;
        announce('Computer turn');
        setTimeout(() => {
          if (!state.isGameOver && state.players[state.activePlayerIndex]?.isCpu) {
            rollDice();
          }
        }, 800);
      } else {
        gameStatusLine.textContent = 'Click the dice to roll.';
        diceBtn.disabled = false;
        announce(activePlayer.name + "'s turn. Click the dice to roll.");
      }
    }

    /* ========================================================== */
    /* 8. 3D DICE LOGIC & MOVEMENT                               */
    /* ========================================================== */
    const DICE_ROTATIONS = {
      1: { x: -12,  y: 16 },
      2: { x: -12,  y: -74 },
      3: { x: -12,  y: 196 },
      4: { x: -12,  y: 106 },
      5: { x: -102, y: 16 },
      6: { x: 78,   y: 16 }
    };

    function rollDice() {
      if (state.isRolling || state.isMoving || state.isGameOver) return;

      state.isRolling = true;
      diceBtn.disabled = true;
      moveSpaceBtn.classList.remove('active');
      moveSpaceBtn.style.display = 'none';

      sound.roll();
      const rolled = Math.floor(Math.random() * 6) + 1;
      state.rolledValue = rolled;

      const targetRot = DICE_ROTATIONS[rolled];
      // Multiple 360 revolutions for 1s tumble
      const extraSpins = 2; // 720 degrees
      const targetX = targetRot.x + (extraSpins * 360);
      const targetY = targetRot.y + (extraSpins * 360);

      diceCube.style.transition = 'transform 1s cubic-bezier(0.2, 0.9, 0.3, 1.1)';
      diceCube.style.transform = 'rotateX(' + targetX + 'deg) rotateY(' + targetY + 'deg)';

      const activePlayer = state.players[state.activePlayerIndex];
      gameStatusLine.textContent = activePlayer.name + ' rolled a ' + rolled + '!';

      setTimeout(() => {
        state.isRolling = false;
        state.activeFaceTilt = targetRot;

        if (activePlayer.isCpu) {
          gameStatusLine.textContent = 'Computer moving ' + rolled + (rolled === 1 ? ' space...' : ' spaces...');
          setTimeout(() => {
            executeMove(rolled);
          }, 600);
        } else {
          // Show glowing human move prompt button
          moveSpaceBtn.textContent = 'Move ' + rolled + (rolled === 1 ? ' space' : ' spaces');
          moveSpaceBtn.style.display = 'block';
          moveSpaceBtn.classList.add('active');
          moveSpaceBtn.focus();
        }
      }, 1050);
    }

    async function executeMove(spaces) {
      if (state.isMoving || state.isGameOver) return;
      state.isMoving = true;
      diceBtn.disabled = true;
      moveSpaceBtn.classList.remove('active');
      moveSpaceBtn.style.display = 'none';

      const player = state.players[state.activePlayerIndex];
      const startPos = player.position;
      const targetPos = startPos + spaces;

      // Overshoot check: must land exactly on 20
      if (targetPos > 20) {
        sound.blocked();
        gameStatusLine.textContent = player.name + ' needs an exact roll. The token stays put.';
        announce(player.name + ' needs an exact roll. The token stays put.');
        await sleep(1500);
        state.isMoving = false;
        passTurn();
        return;
      }

      // Step-by-step hopping movement
      for (let pos = startPos + 1; pos <= targetPos; pos++) {
        player.position = pos;
        updateTokensPlacement();
        sound.step();
        animateTokenHop(player.id);
        await sleep(280);
      }

      // Check ladder or snake or win
      if (player.position === 20) {
        triggerVictory(player, player.name + ' reached square 20!');
        state.isMoving = false;
        return;
      }

      // Check ladder
      if (LADDERS[player.position]) {
        const dest = LADDERS[player.position];
        gameStatusLine.textContent = 'Ladder! ' + player.name + ' climbs to square ' + dest + '.';
        announce('Ladder! ' + player.name + ' climbs to square ' + dest + '.');
        sound.ladder();
        await sleep(500);
        player.position = dest;
        updateTokensPlacement();
        animateTokenHop(player.id);
        await sleep(600);
      }
      // Check snake
      else if (SNAKES[player.position]) {
        const dest = SNAKES[player.position];
        gameStatusLine.textContent = 'Oh no! A snake bites ' + player.name + ' and slides the token down to square ' + dest + '.';
        announce('Oh no! A snake bites ' + player.name + ' and slides the token down to square ' + dest + '.');
        sound.snake();
        triggerSnakeCryFlash();
        await sleep(600);
        player.position = dest;
        updateTokensPlacement();
        await sleep(600);
      }

      state.isMoving = false;
      passTurn();
    }

    function passTurn() {
      if (state.isGameOver) return;
      state.activePlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
      updateTurnUI();
    }

    function triggerSnakeCryFlash() {
      snakeFlashOverlay.classList.add('active');
      setTimeout(() => {
        snakeFlashOverlay.classList.remove('active');
      }, 900);
    }

    function animateTokenHop(playerId) {
      const tokenEl = document.getElementById('token_' + playerId);
      if (tokenEl) {
        tokenEl.classList.remove('hopping');
        // trigger reflow
        void tokenEl.offsetWidth;
        tokenEl.classList.add('hopping');
      }
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* ========================================================== */
    /* 9. TOKEN POSITIONING & RESIZE ENGINE                       */
    /* ========================================================== */
    // Cluster offsets for multiple tokens on same square:
    // 1 token: [0, 0]
    // 2 tokens: left and right of center
    // 3 tokens: two above and one below
    // 4 tokens: 2x2 centered
    // 5 tokens: 4 corners + center
    function getClusterOffsets(count, index, d = 14) {
      if (count === 1) return { x: 0, y: 0 };
      if (count === 2) {
        return index === 0 ? { x: -d, y: 0 } : { x: d, y: 0 };
      }
      if (count === 3) {
        if (index === 0) return { x: -d, y: -d * 0.75 };
        if (index === 1) return { x: d, y: -d * 0.75 };
        return { x: 0, y: d * 0.75 };
      }
      if (count === 4) {
        const xs = [-d, d, -d, d];
        const ys = [-d, -d, d, d];
        return { x: xs[index] || 0, y: ys[index] || 0 };
      }
      // 5 tokens
      const xs = [-d * 1.1, d * 1.1, -d * 1.1, d * 1.1, 0];
      const ys = [-d * 1.1, -d * 1.1, d * 1.1, d * 1.1, 0];
      return { x: xs[index] || 0, y: ys[index] || 0 };
    }

    function updateTokensPlacement() {
      // Group players by position
      const posMap = {};
      state.players.forEach(p => {
        if (!posMap[p.position]) posMap[p.position] = [];
        posMap[p.position].push(p);
      });

      // Position 0 tokens in the starting dock
      dockContainer.innerHTML = '';
      const dockPlayers = posMap[0] || [];
      dockPlayers.forEach(p => {
        const token = createTokenElement(p);
        token.style.position = 'relative';
        token.style.left = 'auto';
        token.style.top = 'auto';
        token.style.transform = 'none';
        dockContainer.appendChild(token);
      });

      // Clear on-board tokens layer
      boardTokensLayer.innerHTML = '';
      const boardRect = boardFrame.getBoundingClientRect();

      for (let sq = 1; sq <= 20; sq++) {
        const playersOnSq = posMap[sq];
        if (!playersOnSq || playersOnSq.length === 0) continue;

        const sqElement = boardGrid.querySelector('.square-hit-area[data-square="' + sq + '"]');
        if (!sqElement) continue;

        const sqRect = sqElement.getBoundingClientRect();
        // Exact center of the square relative to the board frame
        const centerX = (sqRect.left + sqRect.width / 2) - boardRect.left;
        const centerY = (sqRect.top + sqRect.height / 2) - boardRect.top;

        playersOnSq.forEach((p, idx) => {
          const offset = getClusterOffsets(playersOnSq.length, idx, Math.min(sqRect.width, sqRect.height) * 0.22);
          const token = createTokenElement(p);
          token.style.position = 'absolute';
          token.style.left = (centerX + offset.x) + 'px';
          token.style.top = (centerY + offset.y) + 'px';
          boardTokensLayer.appendChild(token);
        });
      }
    }

    function createTokenElement(player) {
      const el = document.createElement('div');
      el.className = 'player-token';
      el.id = 'token_' + player.id;
      el.style.backgroundColor = player.color;
      el.textContent = player.isCpu ? 'C' : (player.id + 1);
      el.setAttribute('aria-label', player.name + ' token');
      return el;
    }

    window.addEventListener('resize', () => {
      if (gameScreen.classList.contains('active')) {
        updateTokensPlacement();
      }
    });

    /* ========================================================== */
    /* 10. QUESTIONS & TROPHY SYSTEM                              */
    /* ========================================================== */
    function onQuestionIconClick(squareNumber) {
      if (state.isRolling || state.isMoving || state.isGameOver) return;
      const activePlayer = state.players[state.activePlayerIndex];
      if (activePlayer.isCpu) return; // Human turn only

      state.openSquareForModal = squareNumber;
      const record = state.questions[squareNumber - 1];

      questionModalTitle.textContent = 'Square ' + squareNumber + ' question';
      modalFeedbackMsg.textContent = '';
      modalFeedbackMsg.className = 'modal-feedback';

      if (!record || !record.q || record.q.trim().length === 0) {
        questionPromptText.textContent = 'No question is saved for square ' + squareNumber + ' yet. Add it in settings.';
        document.getElementById('questionInputContainer').style.display = 'none';
        modalSubmitBtn.style.display = 'none';
      } else {
        questionPromptText.textContent = record.q;
        document.getElementById('questionInputContainer').style.display = 'block';
        modalSubmitBtn.style.display = 'inline-block';
        modalAnswerInput.value = '';
        setTimeout(() => modalAnswerInput.focus(), 80);
      }

      questionModal.classList.add('open');
    }

    function checkAnswer() {
      const sq = state.openSquareForModal;
      if (!sq) return;

      const record = state.questions[sq - 1];
      if (!record) return;

      const activePlayer = state.players[state.activePlayerIndex];
      const userAns = modalAnswerInput.value.trim().toLowerCase().replace(/\\s+/g, ' ');
      const expAns = record.a.trim().toLowerCase().replace(/\\s+/g, ' ');

      if (userAns === expAns && expAns.length > 0) {
        // Correct answer
        if (activePlayer.earnedSquares.has(sq)) {
          sound.correct();
          modalFeedbackMsg.textContent = 'Correct! You already earned the trophy for this square.';
          modalFeedbackMsg.className = 'modal-feedback status-msg success';
        } else {
          activePlayer.earnedSquares.add(sq);
          activePlayer.trophies += 1;
          sound.trophy();

          // Update trophy display
          const badge = document.getElementById('trophyBadge_' + activePlayer.id);
          if (badge) badge.textContent = '🏆 ' + activePlayer.trophies + '/5';

          modalFeedbackMsg.textContent = 'Correct! Trophy earned! ✨🏆';
          modalFeedbackMsg.className = 'modal-feedback status-msg success';

          // Check 5-trophy victory condition
          if (activePlayer.trophies >= 5) {
            setTimeout(() => {
              closeQuestionModal();
              activePlayer.position = 20;
              updateTokensPlacement();
              triggerVictory(activePlayer, activePlayer.name + ' collected five trophies!');
            }, 800);
            return;
          }
        }
      } else {
        sound.wrong();
        modalFeedbackMsg.textContent = 'Not quite—try again. Check spelling and spacing.';
        modalFeedbackMsg.className = 'modal-feedback status-msg error';
      }
    }

    function closeQuestionModal() {
      questionModal.classList.remove('open');
      state.openSquareForModal = null;
    }

    /* ========================================================== */
    /* 11. VICTORY & CONFETTI ENGINE                              */
    /* ========================================================== */
    function triggerVictory(player, reasonText) {
      state.isGameOver = true;
      victoryReason.textContent = reasonText;
      sound.victory();
      generateConfetti();
      victoryOverlay.classList.add('open');
      announce('Victory! ' + reasonText);
    }

    function generateConfetti() {
      confettiContainer.innerHTML = '';
      const colors = ['#facc15', '#38bdf8', '#ff5d66', '#4ade80', '#c084fc', '#fb923c', '#ffffff'];

      for (let i = 0; i < 90; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (2.2 + Math.random() * 2.8) + 's';
        piece.style.animationDelay = (Math.random() * 2) + 's';
        piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        confettiContainer.appendChild(piece);
      }
    }

    /* ========================================================== */
    /* 12. EVENT LISTENERS & WIRING                               */
    /* ========================================================== */
    // Sound Toggle
    soundToggleBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      soundToggleBtn.setAttribute('aria-pressed', sound.enabled ? 'true' : 'false');
      soundToggleBtn.textContent = sound.enabled ? '🔊 Sound on' : '🔇 Sound off';
      if (sound.enabled) {
        sound.save();
      }
    });

    // Play Mode Selector
    modeCpuBtn.addEventListener('click', () => {
      state.mode = 'cpu';
      modeCpuBtn.setAttribute('aria-pressed', 'true');
      modeLocalBtn.setAttribute('aria-pressed', 'false');
      localPlayerCountGroup.style.display = 'none';
      renderSettingsPlayerInputs();
    });

    modeLocalBtn.addEventListener('click', () => {
      state.mode = 'local';
      modeLocalBtn.setAttribute('aria-pressed', 'true');
      modeCpuBtn.setAttribute('aria-pressed', 'false');
      localPlayerCountGroup.style.display = 'flex';
      renderSettingsPlayerInputs();
    });

    // Local Player Count Buttons
    countButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        countButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.localPlayerCount = parseInt(btn.getAttribute('data-count'), 10);
        renderSettingsPlayerInputs();
      });
    });

    // Save Names
    saveNamesBtn.addEventListener('click', savePlayerNamesFromUI);

    // Question single square editor
    squareSelector.addEventListener('change', onSquareSelectorChange);
    saveSingleSquareBtn.addEventListener('click', saveSingleSquare);
    clearSingleSquareBtn.addEventListener('click', clearSingleSquare);
    importBulkBtn.addEventListener('click', importBulkQuestions);

    // Start Game
    startGameBtn.addEventListener('click', initializeGamePlayers);

    // Navigation Buttons
    backToSettingsBtn.addEventListener('click', () => {
      gameScreen.classList.remove('active');
      settingsScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    restartGameBtn.addEventListener('click', () => {
      // Preserves names & questions, resets tokens and stats
      state.players.forEach(p => {
        p.position = 0;
        p.trophies = 0;
        p.earnedSquares.clear();
      });
      state.activePlayerIndex = 0;
      state.rolledValue = 1;
      state.isRolling = false;
      state.isMoving = false;
      state.isGameOver = false;

      renderRosterList();
      updateTurnUI();
      updateTokensPlacement();
    });

    // Dice button click
    diceBtn.addEventListener('click', () => {
      const activePlayer = state.players[state.activePlayerIndex];
      if (!activePlayer || activePlayer.isCpu) return;
      rollDice();
    });

    // Human move spaces button
    moveSpaceBtn.addEventListener('click', () => {
      executeMove(state.rolledValue);
    });

    // Modal Events
    modalCloseBtn.addEventListener('click', closeQuestionModal);
    modalSubmitBtn.addEventListener('click', checkAnswer);
    modalAnswerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && questionModal.classList.contains('open')) {
        closeQuestionModal();
      }
    });

    // Victory play again
    victoryPlayAgainBtn.addEventListener('click', () => {
      victoryOverlay.classList.remove('open');
      restartGameBtn.click();
    });

    /* ========================================================== */
    /* 13. BOOTSTRAP ON LOAD                                      */
    /* ========================================================== */
    loadSavedSettings();
    renderSettingsPlayerInputs();
    populateSquareSelector();

  })();
  </script>
</body>
</html>
`;

fs.writeFileSync('snake-learning-game-latest-edition.html', htmlContent);
fs.writeFileSync('index.html', htmlContent);
console.log('Successfully generated snake-learning-game-latest-edition.html and index.html');
console.log('HTML file size:', htmlContent.length);
