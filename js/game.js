/* ══════════════════════════════════════════════════════
   GAME — lógica principal do jogo (sequência, resposta, histórico)
   ══════════════════════════════════════════════════════ */

/* ── Sleep pausável ── */
async function sleep(ms) {
    const end = Date.now() + ms;
    while (true) {
        if (isPaused) {
            await new Promise(r => { resumeCallback = r; });
        }
        const remaining = end - Date.now();
        if (remaining <= 0) break;
        await new Promise(r => setTimeout(r, Math.min(50, remaining)));
    }
}

/* ── Pausa / retomada ── */
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-indicator').classList.toggle('visible', isPaused);
    if (!isPaused && resumeCallback) {
        const cb = resumeCallback;
        resumeCallback = null;
        cb();
    }
}

/* ── Geração de número aleatório com N dígitos ── */
function getRandomInt(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ── Loop principal do jogo ── */
async function runGame(isReplay = false) {
    if (isPlaying || isWaiting) return;
    isPlaying    = true;
    isSequencing = true;

    isPaused       = false;
    resumeCallback = null;
    document.getElementById('pause-indicator').classList.remove('visible');

    btnStart.classList.add('d-none');
    answerArea.style.display = 'none';
    centerInput.value        = '';
    centerInput.classList.remove('err', 'ok');
    feedback.style.opacity   = '0';
    actionBtns.classList.remove('show');
    display.textContent      = '';
    document.activeElement.blur();

    const flashValue   = parseInt(document.getElementById('cfg-flash').value);
    const flashUnit    = document.getElementById('cfg-flash-unit').value;
    const flashTime    = flashUnit === 'min' ? flashValue * 60000
                       : flashUnit === 's'   ? flashValue * 1000
                       : flashValue;
    const intervalTime = parseInt(document.getElementById('cfg-interval').value);

    if (!isReplay) {
        const digits   = parseInt(document.getElementById('cfg-digits').value);
        const rows     = parseInt(document.getElementById('cfg-rows').value);
        const allowSub = document.getElementById('cfg-subtractions').checked;

        currentSequence = [];
        expectedSum     = 0;
        currentCard     = null;
        currentAttempts = '';

        for (let i = 0; i < rows; i++) {
            let num = getRandomInt(digits);
            if (allowSub && i > 0 && Math.random() > .5 && (expectedSum - num) > 0) {
                num = -Math.abs(num);
            }
            currentSequence.push(num);
            expectedSum += num;
        }
    }

    for (const n of currentSequence) {
        await sleep(intervalTime);
        display.textContent = n;
        display.classList.add('show');
        await sleep(flashTime);
        display.classList.remove('show');
    }

    isSequencing = false;
    document.getElementById('pause-indicator').classList.remove('visible');
    isPaused = false;

    await sleep(intervalTime);
    answerArea.style.display = 'flex';
    centerInput.focus();
}

/* ── Atualiza card no histórico ── */
function updateHistoryCard() {
    if (emptyHist) emptyHist.style.display = 'none';
    if (!currentCard) {
        currentCard = document.createElement('div');
        currentCard.className = 'h-entry';
        historyList.prepend(currentCard);
    }
    const eq = currentSequence
        .map((n, i) => i === 0 ? n : (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`))
        .join(' ');
    currentCard.innerHTML = `
        <div class="h-eq">${eq}</div>
        <div class="h-res">${currentAttempts}</div>`;
}

/* ── Reseta para nova rodada ── */
function resetRound() {
    isPlaying = false;
    isWaiting = false;
    answerArea.style.display = 'none';
    centerInput.value        = '';
    centerInput.classList.remove('err', 'ok');
    actionBtns.classList.remove('show');
    btnStart.classList.remove('d-none');
    startText.textContent = 'Nova rodada';
}

/* ── Verifica resposta do usuário ── */
function checkAnswer() {
    if (centerInput.value === '' || centerInput.value === '-') return;
    const userAns   = parseInt(centerInput.value, 10);
    if (isNaN(userAns)) return;
    const isCorrect = userAns === expectedSum;

    if (isCorrect) {
        feedback.textContent   = 'Correto';
        feedback.className     = 'f-ok';
        feedback.style.opacity = '1';
        currentAttempts += `<span style="color:var(--accent);font-weight:600;">= ${expectedSum} ✓</span>`;
        updateHistoryCard();
        centerInput.classList.add('ok');
        setTimeout(resetRound, 650);
    } else {
        feedback.textContent   = 'Incorreto';
        feedback.className     = 'f-err';
        feedback.style.opacity = '1';
        currentAttempts += `<span style="color:#f87171;font-size:.8em;display:block;">✗ ${userAns}</span>`;
        updateHistoryCard();
        centerInput.classList.add('err');
        centerInput.blur();
        actionBtns.classList.add('show');
        isWaiting = true;
    }
}
