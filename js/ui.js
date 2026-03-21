/* ══════════════════════════════════════════════════════
   UI — tema, escala, tamanho de fonte, tela cheia, prévia
   ══════════════════════════════════════════════════════ */

/* ── Tela cheia ── */
function isFullscreen() {
    return !!document.fullscreenElement || window.innerHeight >= screen.height - 2;
}

function updateFullscreenIcon() {
    fullIcon.className = isFullscreen() ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen';
}

btnFull.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (isFullscreen()) {
        document.exitFullscreen().catch(() => {});
    } else {
        document.documentElement.requestFullscreen().catch(() => {});
    }
});

document.addEventListener('fullscreenchange', updateFullscreenIcon);
window.addEventListener('resize', updateFullscreenIcon);

/* ── Tema (dark / light) ── */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const icon = document.getElementById('theme-icon');
    icon.className = theme === 'light' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
}

function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-bs-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
    saveSettings();
}

btnTheme.addEventListener('click', toggleTheme);

/* ── Escala da interface ── */
function applyUIScale(scale) {
    document.documentElement.style.setProperty('--ui-scale', scale);
}

/* ── Tamanho da fonte dos números ── */
function applyFontSize(size) {
    display.style.fontSize     = size + 'px';
    centerInput.style.fontSize = size + 'px';
    updatePreview(size);
}

function updatePreview(size) {
    const preview = document.getElementById('font-preview');
    if (!preview) return;
    const previewPx = Math.round((size / 224) * 220);
    preview.style.fontSize = previewPx + 'px';
}
