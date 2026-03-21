/* ══════════════════════════════════════════════════════
   STATE — referências ao DOM e variáveis de estado global
   Carregado primeiro; todos os outros módulos dependem deste.
   ══════════════════════════════════════════════════════ */

/* ── Referências ao DOM ── */
const display     = document.getElementById('number-display');
const feedback    = document.getElementById('feedback-msg');
const btnStart    = document.getElementById('btn-start-center');
const startText   = document.getElementById('start-text');
const centerInput = document.getElementById('center-input');
const answerArea  = document.getElementById('answer-area');
const actionBtns  = document.getElementById('action-buttons');
const btnTryAgain = document.getElementById('btn-try-again');
const btnShowAns  = document.getElementById('btn-show-answer');
const historyList = document.getElementById('history-list');
const emptyHist   = document.getElementById('empty-history');
const btnTheme    = document.getElementById('btn-theme-toggle');
const btnFull     = document.getElementById('btn-fullscreen');
const fullIcon    = document.getElementById('fullscreen-icon');

/* ── Estado do jogo ── */
let currentSequence = [];
let expectedSum     = 0;
let isPlaying       = false;
let isSequencing    = false;
let isWaiting       = false;
let currentCard     = null;
let currentAttempts = '';

/* ── Estado de pausa ── */
let isPaused       = false;
let resumeCallback = null;
