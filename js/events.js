/* ══════════════════════════════════════════════════════
   EVENTS — todos os ouvintes de eventos (teclado, toque, botões)
   ══════════════════════════════════════════════════════ */

/* ── Botões de ação ── */
btnTryAgain.addEventListener('click', () => {
    isWaiting = false;
    isPlaying = false;
    runGame(true);
});

btnShowAns.addEventListener('click', () => {
    feedback.textContent   = `Resposta: ${expectedSum}`;
    feedback.className     = 'f-err';
    feedback.style.opacity = '1';
    currentAttempts += `<span style="color:#fbbf24;font-size:.8em;display:block;">→ ${expectedSum}</span>`;
    updateHistoryCard();
    resetRound();
});

btnStart.addEventListener('click', () => runGame(false));

/* ── Clique no tabuleiro foca o input quando visível ── */
document.getElementById('game-board').addEventListener('click', e => {
    if (answerArea.style.display === 'flex' && !isWaiting && e.target !== centerInput) {
        centerInput.focus();
    }
});

/* ── Toque no tabuleiro = barra de espaço (mobile) ── */
document.getElementById('game-board').addEventListener('touchend', e => {
    const target = e.target;
    if (target.closest('button') || target.tagName === 'INPUT') return;

    if (answerArea.style.display === 'flex' && !isWaiting) {
        centerInput.focus();
        return;
    }

    if (isSequencing) {
        togglePause();
    } else if (isWaiting) {
        isWaiting = false;
        isPlaying = false;
        runGame(true);
    } else if (!isPlaying) {
        runGame(false);
    }
});

/* ── Enter no input submete resposta ── */
centerInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); checkAnswer(); }
});

/* ── Sanitiza colagem: só dígitos e sinal negativo inicial ── */
centerInput.addEventListener('input', () => {
    const v     = centerInput.value;
    const clean = v.replace(/[^0-9\-]/g, '').replace(/(?!^)-/g, '');
    if (v !== clean) centerInput.value = clean;
});

/* ── Teclado global (espaço, dígitos, Enter, Backspace) ── */
document.addEventListener('keydown', e => {
    /* Redireciona digitação para o input quando visível mas não focado */
    if (answerArea.style.display === 'flex' && !isWaiting && document.activeElement !== centerInput) {
        if (!e.metaKey && !e.ctrlKey && !e.altKey && e.code !== 'Space') {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkAnswer();
                return;
            }
            if (e.key === 'Backspace') {
                e.preventDefault();
                centerInput.focus();
                centerInput.value = centerInput.value.slice(0, -1);
                return;
            }
            if (/^[0-9]$/.test(e.key)) {
                e.preventDefault();
                centerInput.focus();
                centerInput.value += e.key;
                return;
            }
            if (e.key === '-' && centerInput.value === '') {
                e.preventDefault();
                centerInput.focus();
                centerInput.value = '-';
                return;
            }
        }
    }

    if (e.code !== 'Space') return;
    const active = document.activeElement;
    if (!isWaiting && (active === centerInput || active.tagName === 'INPUT' || active.tagName === 'SELECT')) return;
    e.preventDefault();

    if (isSequencing) {
        togglePause();
    } else if (isWaiting) {
        isWaiting = false;
        isPlaying = false;
        runGame(true);
    } else if (!isPlaying) {
        runGame(false);
    }
});
