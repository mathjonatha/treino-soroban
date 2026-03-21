/* ══════════════════════════════════════════════════════
   STORAGE — leitura / escrita de configurações (localStorage)
   ══════════════════════════════════════════════════════ */

const STORAGE_KEY = 'anzanSettings';

/* ── Regras de validação dos campos numéricos ── */
const cfgNumericRules = {
    'cfg-digits':   { min: 1, fallback: 1   },
    'cfg-rows':     { min: 1, fallback: 5   },
    'cfg-flash':    { min: 1, fallback: 700 },
    'cfg-interval': { min: 0, fallback: 300 },
};

function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let theme = 'dark';

    if (saved) {
        const c = JSON.parse(saved);
        document.getElementById('cfg-digits').value         = c.digits       || 1;
        document.getElementById('cfg-rows').value           = c.rows         || 5;
        document.getElementById('cfg-flash').value          = c.flash        || 700;
        document.getElementById('cfg-flash-unit').value     = c.flashUnit    || 'ms';
        document.getElementById('cfg-interval').value       = c.interval     || 300;
        document.getElementById('cfg-subtractions').checked = c.subtractions || false;

        const fs = c.fontSize || 128;
        document.getElementById('cfg-font-size').value = fs;
        applyFontSize(fs);

        const uiScale = c.uiScale || 1;
        document.getElementById('cfg-ui-scale').value = uiScale;
        applyUIScale(uiScale);

        theme = c.theme || 'dark';
    } else {
        applyFontSize(128);
        applyUIScale(1);
    }

    applyTheme(theme);
}

function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        digits:       document.getElementById('cfg-digits').value,
        rows:         document.getElementById('cfg-rows').value,
        flash:        document.getElementById('cfg-flash').value,
        flashUnit:    document.getElementById('cfg-flash-unit').value,
        interval:     document.getElementById('cfg-interval').value,
        subtractions: document.getElementById('cfg-subtractions').checked,
        fontSize:     document.getElementById('cfg-font-size').value,
        uiScale:      document.getElementById('cfg-ui-scale').value,
        theme:        document.documentElement.getAttribute('data-bs-theme'),
    }));
}

/* ── Inicializa ouvintes de persistência e validação ── */
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    document.querySelectorAll('.cfg-input').forEach(el =>
        el.addEventListener('change', saveSettings)
    );

    document.getElementById('cfg-ui-scale').addEventListener('change', e => {
        applyUIScale(e.target.value);
        saveSettings();
    });

    document.getElementById('cfg-font-size').addEventListener('change', e => {
        applyFontSize(e.target.value);
        saveSettings();
    });

    /* Validação com fallback para campos numéricos */
    Object.entries(cfgNumericRules).forEach(([id, { min, fallback }]) => {
        document.getElementById(id).addEventListener('blur', function () {
            const v = parseInt(this.value, 10);
            if (isNaN(v) || v < min) {
                this.value = fallback;
                this.classList.add('field-err');
                setTimeout(() => this.classList.remove('field-err'), 900);
                saveSettings();
            }
        });
    });
});
