'use strict';

const state = {
  page: 'overview', mode: 'Auto', running: false, phase: 0, elapsed: 0,
  count: 0, lastCycle: 0, cycleElapsed: 0, recipe: 'Standard', dwell: 1,
  access: 'Operator', fault: null, conditionRestored: false,
  alarms: [], history: [], tab: 'active', part: 0,
  manual: { infeed: false, outfeed: false, press: false },
};
const steps = ['Ready to run.', 'Infeed transfer', 'Part located at S1', 'Press descending', 'Press dwell', 'Press returning', 'Outfeed transfer'];
const durations = [.4, 1.8, .5, .8, 1, .8, 1.8];
const names = { overview: 'Overview', manual: 'Manual control', alarms: 'Alarms', settings: 'Diagnostics' };
const $ = selector => document.querySelector(selector);
let toastTimer;

function timestamp() {
  return new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Berlin' });
}

function notify(message) {
  $('#toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.role = 'status';
  toast.textContent = message;
  $('#panel').append(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 2800);
}

function io() {
  return {
    s1: state.running && state.phase >= 2 && state.phase <= 5,
    upper: (state.phase < 3 || state.phase >= 6) && !state.manual.press,
    lower: state.phase === 4 || state.manual.press,
    s2: state.running && state.phase === 6 && state.part > .65,
    infeed: (state.running && state.phase === 1) || state.manual.infeed,
    outfeed: (state.running && state.phase === 6) || state.manual.outfeed,
    press: (state.running && (state.phase === 3 || state.phase === 4)) || state.manual.press,
  };
}

function indicators() {
  const value = io();
  return [['S1 · Part', value.s1], ['B1 · Upper', value.upper], ['B2 · Lower', value.lower], ['S2 · Exit', value.s2]]
    .map(([label, on]) => `<span class="io ${on ? 'is-on' : ''}"><i class="dot ${on ? 'on' : ''}"></i>${label}</span>`).join('');
}

function schematic() {
  const value = io();
  const travel = state.manual.press ? 36 : state.phase === 3 ? state.part * 36 : state.phase === 4 ? 36 : state.phase === 5 ? 36 * (1 - state.part) : 0;
  const partX = state.phase === 1 ? 24 + state.part * 222 : state.phase >= 2 && state.phase <= 5 ? 246 : state.phase === 6 ? 246 + state.part * 235 : -40;
  const sensor = (x, y, on, name) => `<rect x="${x - 4}" y="${y - 5}" width="8" height="10" rx="2" fill="${on ? '#0053be' : '#e4e9f1'}" stroke="${on ? '#0053be' : '#a6b2c3'}"/><text x="${x + 9}" y="${y + 4}" font-size="10" fill="#8994a5">${name}</text>`;
  return `<svg class="machine-svg" viewBox="0 0 540 235" role="img" aria-label="Live pneumatic press, infeed and outfeed conveyors, sensors S1, S2, B1 and B2">
    <defs>
      <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#e5eaf1"/><stop offset=".32" stop-color="#fafcfe"/><stop offset="1" stop-color="#d9e0eb"/></linearGradient>
      <linearGradient id="belt" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#edf1f6"/><stop offset="1" stop-color="#dce3ed"/></linearGradient>
      <linearGradient id="cylinder" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#2f4f9a"/><stop offset=".5" stop-color="#3768bb"/><stop offset="1" stop-color="#26358b"/></linearGradient>
    </defs>
    <ellipse cx="277" cy="215" rx="230" ry="6" fill="#e4e8ef" opacity=".65"/>
    <path d="M226 211V39a6 6 0 0 1 6-6h110a6 6 0 0 1 6 6v172" fill="url(#metal)" stroke="#aebacc" stroke-width="1.1"/>
    <path d="M245 177V54h84v123" fill="#fafbfc" stroke="#c2ccd9"/>
    <path d="M232 43h110M236 49v151M338 49v151" stroke="#fff" stroke-width="1.3"/>
    <path d="M250 61v114M323 61v114" stroke="#d6dde7" stroke-width="3"/>
    <rect x="269" y="51" width="35" height="43" rx="4" fill="url(#cylinder)"/>
    <rect x="267" y="48" width="39" height="7" rx="2" fill="#bac8dd" stroke="#98abc5" stroke-width=".7"/>
    <rect x="267" y="89" width="39" height="7" rx="2" fill="#c2cfe0" stroke="#98abc5" stroke-width=".7"/>
    <path d="M276 59v22" stroke="#84a6da" stroke-width="1"/>
    <path d="M286.5 96V${116 + travel}" stroke="#a7b6ca" stroke-width="7"/>
    <path d="M285 96V${116 + travel}" stroke="#eef3fa" stroke-width="2"/>
    <g transform="translate(0 ${travel})"><rect x="249" y="112" width="75" height="11" rx="2" fill="url(#metal)" stroke="#9cabc0"/><path d="M254 115h65" stroke="#fff"/></g>
    <rect x="236" y="177" width="103" height="13" rx="2" fill="#c4cfdc" stroke="#aab9cb"/>
    <path d="M243 183h88" stroke="#eef4fc"/>
    <rect x="31" y="177" width="194" height="18" rx="9" fill="url(#belt)" stroke="#99a9bf" stroke-width="1.1"/>
    <rect x="348" y="177" width="171" height="18" rx="9" fill="url(#belt)" stroke="#99a9bf" stroke-width="1.1"/>
    <path d="M40 180h176M356 180h155" stroke="#fff" stroke-width="1.2"/>
    ${[45, 72, 99, 126, 153, 180, 209, 362, 390, 418, 446, 474, 504].map(x => `<circle cx="${x}" cy="186" r="4.5" fill="#f5f8fc" stroke="#aab7ca" stroke-width=".8"/><circle cx="${x}" cy="186" r="1.2" fill="#b9c5d5"/>`).join('')}
    <path d="M51 196v15h9v-15M201 196v15h9v-15M364 196v15h9v-15M491 196v15h9v-15" fill="#d7dfe9" stroke="#adbbcd" stroke-width=".8"/>
    <rect x="36" y="193" width="183" height="2.5" rx="1.25" fill="${value.infeed ? '#0053be' : '#afbed1'}"/>
    <rect x="353" y="193" width="160" height="2.5" rx="1.25" fill="${value.outfeed ? '#0053be' : '#afbed1'}"/>
    <path d="M94 150h48m-5-4 5 4-5 4" stroke="${value.infeed ? '#0053be' : '#c4ccd8'}" stroke-width="1.3" fill="none"/>
    <path d="M414 150h40m-5-4 5 4-5 4" stroke="${value.outfeed ? '#0053be' : '#c4ccd8'}" stroke-width="1.3" fill="none"/>
    ${state.running ? `<rect x="${partX}" y="162" width="35" height="14" rx="2" fill="#a8c3ea" stroke="#477dbf" stroke-width="1"/><path d="M${partX + 3} 165h29" stroke="#dbe9fd"/>` : ''}
    ${sensor(225, 157, value.s1, 'S1')}${sensor(476, 157, value.s2, 'S2')}
    ${sensor(314, 81, value.upper, 'B1')}${sensor(314, 131, value.lower, 'B2')}
    <circle cx="237" cy="42" r="2" fill="#a8b6c9"/><circle cx="337" cy="42" r="2" fill="#a8b6c9"/>
    <text x="81" y="231" fill="#8a95a6" font-size="11">Infeed</text><text x="267" y="231" fill="#8a95a6" font-size="11">Press</text><text x="420" y="231" fill="#8a95a6" font-size="11">Outfeed</text>
  </svg>`;
}

function overview() {
  return `<div class="intro"><div><span class="eyebrow">Pneumatic press</span><h1 id="process-heading"></h1></div><button class="recipe-pill" data-page="settings"><small>Active recipe</small><span id="recipe-name"></span></button></div>
    <div class="visual-stage"><div id="process-art"></div><div class="metrics"><div class="metric"><strong id="good-count"></strong><small>GOOD PARTS</small></div><div class="metric"><strong><span id="cycle-time"></span><span class="unit">s</span></strong><small>LAST CYCLE</small></div></div></div>
    <div class="sensor-strip"><div id="overview-io"></div><span class="step-counter" id="phase-number"></span></div>`;
}

function manual() {
  return `<div class="title"><h1>Manual control</h1><button id="mode-toggle">${state.mode === 'Auto' ? 'Enter manual mode' : 'Return to auto'}</button></div>
    <div class="grid2"><section class="card manual-card"><h2>Conveyor jog</h2>${['infeed', 'outfeed'].map(key => `<div class="row"><label>${key === 'infeed' ? 'Infeed' : 'Outfeed'} conveyor<br><span class="feedback" id="feedback-${key}"></span></label><button data-hold="${key}">Hold to jog →</button></div>`).join('')}</section>
    <section class="card manual-card"><h2>Pneumatic press</h2><div class="row"><span class="feedback" id="feedback-press"></span><button data-hold="press">Hold to extend ↓</button></div><p>Hold to extend; release to retract in this guarded simulation. Conveyors must be stopped before extending the press.</p></section></div>
    <div class="banner"><div id="manual-io"></div>Interlocks: guard closed · safety circuit healthy · automatic cycle stopped.<br>No physical machine is connected.</div>`;
}

function alarms() {
  const list = state.tab === 'active' ? state.alarms : state.history;
  return `<div class="title"><h1>Alarms</h1><div class="tabs"><button data-tab="active" class="${state.tab === 'active' ? 'chosen' : ''}">Active (${state.alarms.length})</button><button data-tab="history" class="${state.tab === 'history' ? 'chosen' : ''}">History (${state.history.length})</button></div></div>
    <div class="alarm-list">${list.length ? list.map(alarm => `<article class="alarm ${state.tab === 'history' ? 'history' : ''}"><div><time>${alarm.time} · ${alarm.code} · ${alarm.severity}</time><strong>${alarm.message}</strong><p>${alarm.response}</p><span class="feedback">${alarm.component} · ${alarm.cleared ? 'Cleared' : alarm.ack ? 'Acknowledged · condition active' : 'Unacknowledged'}</span></div>${!alarm.cleared ? `<button data-ack="${alarm.id}" ${alarm.ack ? 'disabled' : ''}>${alarm.ack ? 'Acknowledged' : 'Acknowledge'}</button>` : ''}</article>`).join('') : '<div class="empty"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/><path d="m12 20 6 6 11-12"/></svg><strong>No active alarms</strong><p>All monitored conditions are normal.</p></div>'}</div>
    <p class="note">Acknowledgement records awareness. Restore the condition, acknowledge and reset.<br>Reset never restarts the machine.</p>`;
}

function settings() {
  return `<div class="title"><h1>Diagnostics</h1><select id="access" aria-label="Demo access level"><option ${state.access === 'Operator' ? 'selected' : ''}>Operator</option><option ${state.access === 'Engineer' ? 'selected' : ''}>Engineer</option></select></div>
    <div class="grid2"><section class="card settings-card"><h2>Production recipe</h2><div class="row"><label for="recipe">Recipe</label><select id="recipe"><option ${state.recipe === 'Standard' ? 'selected' : ''}>Standard</option><option ${state.recipe === 'Delicate' ? 'selected' : ''}>Delicate</option></select></div><div class="row"><label for="dwell">Dwell / seconds</label><input id="dwell" type="number" min="0.5" max="3" step="0.1" value="${state.dwell}"></div><p>Engineer role and stopped machine required.<br>Demo roles have no authentication.</p></section>
    <section class="card settings-card"><h2>Live I/O</h2><div id="diagnostic-io"></div><div class="diagnostic-row"><span>Y1 · Press valve</span><strong id="valve-feedback"></strong></div><div class="diagnostic-row"><span>M1 / M2 · Drives</span><strong id="drive-feedback"></strong></div><div class="diagnostic-row"><span>Connection</span><strong>Local simulator</strong></div></section></div>
    <div class="fault-controls"><button id="fault-sensor">Dev: S1 timeout</button><button id="fault-guard">Dev: open guard</button><button id="clear-fault">Restore condition</button><button id="reset">Reset alarms</button></div>
    <p class="note">Simulation only. Safety functions belong in the physical safety circuit.</p>`;
}

function render(refresh = false) {
  const main = $('#content');
  if (refresh || main.dataset.page !== state.page) {
    main.dataset.page = state.page;
    main.innerHTML = { overview, manual, alarms, settings }[state.page]();
  }
  const value = io();
  if (state.page === 'overview') {
    $('#process-heading').textContent = state.fault ? 'Cycle interrupted.' : steps[state.phase];
    $('#recipe-name').textContent = state.recipe;
    $('#process-art').innerHTML = schematic();
    $('#good-count').textContent = state.count;
    $('#cycle-time').textContent = state.lastCycle.toFixed(1);
    $('#overview-io').innerHTML = indicators();
    $('#phase-number').textContent = `Step ${String(state.phase).padStart(2, '0')} / 06`;
  } else if (state.page === 'manual') {
    for (const key of ['infeed', 'outfeed']) {
      $(`#feedback-${key}`).textContent = `Command ${state.manual[key] ? 'ON' : 'OFF'} / Feedback ${state.manual[key] ? 'RUN' : 'STOP'}`;
    }
    $('#feedback-press').innerHTML = `Command ${state.manual.press ? 'EXTEND' : 'RETRACT'}<br>Actual ${state.manual.press ? 'LOWER' : 'UPPER'}`;
    document.querySelectorAll('[data-hold]').forEach(button => {
      button.disabled = state.mode !== 'Manual' || !!state.fault;
      button.classList.toggle('holding', state.manual[button.dataset.hold]);
      button.setAttribute('aria-pressed', String(state.manual[button.dataset.hold]));
    });
    $('#manual-io').innerHTML = indicators();
  } else if (state.page === 'settings') {
    $('#diagnostic-io').innerHTML = indicators();
    $('#valve-feedback').textContent = value.press ? 'EXTEND' : 'RETRACT';
    $('#drive-feedback').textContent = `${value.infeed ? 'RUN' : 'STOP'} / ${value.outfeed ? 'RUN' : 'STOP'}`;
    $('#recipe').disabled = $('#dwell').disabled = state.running || state.access !== 'Engineer';
  }
  $('#start').disabled = state.running || !!state.fault || state.mode !== 'Auto';
  const status = state.fault ? 'FAULT · Motion inhibited' : state.running ? 'RUNNING' : state.mode === 'Manual' ? 'MANUAL' : 'READY';
  // Announce state changes once; do not repeat the live region every timer tick.
  if ($('#status').textContent !== status) $('#status').textContent = status;
  $('#status').classList.toggle('fault', !!state.fault);
  $('#mode').textContent = `${state.mode === 'Auto' ? 'Automatic' : 'Manual'} mode`;
  const alarmCount = state.alarms.length;
  if ($('#alarm-link').dataset.count !== String(alarmCount)) {
    $('#alarm-link').dataset.count = alarmCount;
    $('#alarm-link').innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true">${alarmCount ? '<path d="m10 2 9 16H1Z M10 7v5m0 2v1"/>' : '<circle cx="10" cy="10" r="7"/><path d="m6 10 3 3 5-6"/>'}</svg><span>${alarmCount ? `${alarmCount} alarm${alarmCount > 1 ? 's' : ''}` : 'All clear'}</span>`;
  }
  $('#alarm-link').classList.toggle('active', !!alarmCount);
  $('#nav-alarm-dot').hidden = !alarmCount;
  $('#screen-name').textContent = names[state.page];
  document.querySelectorAll('nav button').forEach(button => {
    const selected = button.dataset.page === state.page;
    button.classList.toggle('selected', selected);
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  $('#clock').textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
}

function release() {
  Object.keys(state.manual).forEach(key => { state.manual[key] = false; });
  render();
}

function stop() {
  state.running = false;
  state.phase = 0;
  state.elapsed = 0;
  state.part = 0;
  Object.keys(state.manual).forEach(key => { state.manual[key] = false; });
}

function fault(kind) {
  stop();
  if (state.fault) return;
  state.conditionRestored = false;
  state.fault = kind;
  const alarm = {
    id: Date.now(), time: timestamp(), code: kind === 'guard' ? 'A101' : 'A201',
    severity: kind === 'guard' ? 'HIGH' : 'MEDIUM', component: kind === 'guard' ? 'Guard circuit' : 'Infeed / S1',
    message: kind === 'guard' ? 'Guard permission lost' : 'Part arrival timeout',
    response: kind === 'guard' ? 'Close the guard, verify the cell is clear, acknowledge and reset.' : 'Inspect the infeed and S1 detection, restore condition, acknowledge and reset.',
    ack: false, cleared: false,
  };
  state.alarms.push(alarm);
  state.history.unshift(alarm);
}

function hold(key) {
  if (state.mode !== 'Manual' || state.fault) return false;
  if ((key === 'press' && (state.manual.infeed || state.manual.outfeed)) || (key !== 'press' && state.manual.press)) {
    notify('Interlock: stop the other actuator first.');
    return false;
  }
  state.manual[key] = true;
  render();
  return true;
}

// Commands are simulation requests; no physical I/O or safety outputs are connected.
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled || button.dataset.hold) return;
  if (button.dataset.page) {
    release();
    state.page = button.dataset.page;
  } else if (button.dataset.tab) {
    state.tab = button.dataset.tab;
  } else if (button.dataset.ack) {
    state.alarms.find(alarm => alarm.id === Number(button.dataset.ack)).ack = true;
  } else {
    switch (button.id) {
      case 'start':
        if (!state.fault && state.mode === 'Auto') {
          state.running = true;
          state.phase = 1;
          state.elapsed = state.part = state.cycleElapsed = 0;
        }
        break;
      case 'stop': stop(); break;
      case 'mode-toggle':
        stop();
        state.mode = state.mode === 'Auto' ? 'Manual' : 'Auto';
        break;
      case 'fault-sensor': fault('sensor'); break;
      case 'fault-guard': fault('guard'); break;
      case 'clear-fault':
        state.conditionRestored = true;
        notify('Simulated condition restored. Acknowledge and reset required.');
        break;
      case 'reset':
        if (!state.fault) notify('No fault to reset.');
        else if (!state.conditionRestored || state.alarms.some(alarm => !alarm.ack)) notify('Restore the condition and acknowledge all alarms first.');
        else {
          state.alarms.forEach(alarm => { alarm.cleared = true; });
          state.alarms = [];
          state.fault = null;
          state.conditionRestored = false;
          notify('Reset complete. Machine stopped; select Start to resume.');
        }
        break;
    }
  }
  render(true);
});

document.addEventListener('change', event => {
  const field = event.target;
  if (field.id === 'access') state.access = field.value;
  if (field.id === 'recipe' && !state.running && state.access === 'Engineer') {
    state.recipe = field.value;
    state.dwell = field.value === 'Delicate' ? 1.8 : 1;
  }
  if (field.id === 'dwell' && !state.running && state.access === 'Engineer') {
    const dwell = Number(field.value);
    if (Number.isFinite(dwell) && dwell >= .5 && dwell <= 3) state.dwell = dwell;
    else notify('Dwell must be between 0.5 and 3 seconds.');
  }
  render(true);
});

document.addEventListener('pointerdown', event => {
  const button = event.target.closest('[data-hold]');
  if (!button || button.disabled) return;
  if (hold(button.dataset.hold)) button.setPointerCapture(event.pointerId);
});
document.addEventListener('pointerup', () => {
  if (Object.values(state.manual).some(Boolean)) release();
});
document.addEventListener('pointercancel', release);
document.addEventListener('keydown', event => {
  const button = event.target.closest('[data-hold]');
  if (button && !button.disabled && [' ', 'Enter'].includes(event.key)) {
    event.preventDefault();
    if (!event.repeat) hold(button.dataset.hold);
  }
});
document.addEventListener('keyup', event => {
  if ([' ', 'Enter'].includes(event.key) && Object.values(state.manual).some(Boolean)) release();
});
document.addEventListener('focusout', event => {
  if (event.target.matches('[data-hold]') && state.manual[event.target.dataset.hold]) release();
});
window.addEventListener('blur', release);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stop(); render(); }
});

let previousTime = performance.now();
setInterval(() => {
  const now = performance.now();
  const delta = Math.min((now - previousTime) / 1000, .2);
  previousTime = now;
  if (state.running && !state.fault) {
    state.elapsed += delta;
    state.cycleElapsed += delta;
    const duration = state.phase === 4 ? state.dwell : durations[state.phase];
    state.part = Math.min(state.elapsed / duration, 1);
    if (state.elapsed >= duration) {
      state.phase++;
      state.elapsed = state.part = 0;
      if (state.phase > 6) {
        state.count++;
        state.lastCycle = state.cycleElapsed;
        state.cycleElapsed = 0;
        state.phase = 1;
      }
    }
  }
  render();
}, 100);
render(true);
