// ════════════════════════════════════════════
//  EXAMPLES LIBRARY MODAL
// ════════════════════════════════════════════

const CAT_ACCENT = {
  transform:   '#3fb950',
  aggregation: '#f5a524',
  format:      '#c084fc',
  cpi:         '#0070f2',
  xpath:       '#f5a524',
};

let exActiveCat = 'all';

function openExModal() {
  document.getElementById('exModalBackdrop').classList.add('open');
  document.getElementById('exModalSearch').value = '';
  // Pre-select category based on current mode, but show all categories always
  exActiveCat = xpathEnabled ? 'xpath' : 'all';
  document.querySelectorAll('.ex-cat-btn').forEach(b => {
    b.style.display = ''; // always show all category buttons
    b.classList.toggle('active', b.dataset.cat === exActiveCat);
  });
  renderExGrid();
  setTimeout(() => document.getElementById('exModalSearch').focus(), 60);
}

function closeExModal() {
  document.getElementById('exModalBackdrop').classList.remove('open');
}

function handleModalBackdropClick(e) {
  if (e.target === document.getElementById('exModalBackdrop')) closeExModal();
}

// Close modal on Escape; run transform on Ctrl/Cmd+Enter from anywhere
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeExModal();
    return;
  }
  // Ctrl+Enter / Cmd+Enter → mode-aware run (works even when KV inputs have focus)
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (typeof xpathEnabled !== 'undefined' && xpathEnabled) runXPath();
    else runTransform();
  }
});

function setExCat(cat) {
  exActiveCat = cat;
  document.querySelectorAll('.ex-cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  renderExGrid();
}

function filterExamples() { renderExGrid(); }

function renderExGrid() {
  const query  = (document.getElementById('exModalSearch').value || '').toLowerCase().trim();
  const wrap   = document.getElementById('exGridWrap');

  // Filter keys — iterate EXAMPLES directly, meta fields now live there
  const keys = Object.keys(EXAMPLES).filter(k => {
    const ex = EXAMPLES[k];
    if (exActiveCat !== 'all' && ex.cat !== exActiveCat) return false;
    if (query && !ex.label.toLowerCase().includes(query) && !ex.desc.toLowerCase().includes(query)) return false;
    return true;
  });

  document.getElementById('exModalCount').textContent = keys.length + ' example' + (keys.length !== 1 ? 's' : '');

  if (!keys.length) {
    wrap.innerHTML = '<div class="ex-no-results">No examples match your search.</div>';
    return;
  }

  // Group by category for section labels (only when showing all)
  const groups = {};
  keys.forEach(k => {
    const cat = EXAMPLES[k].cat;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(k);
  });

  const CAT_LABELS = { transform:'Data Transformation', aggregation:'Aggregation & Splitting', format:'Format Conversion', cpi:'SAP CPI Patterns', xpath:'XPath Explorer' };

  let html = '';
  Object.keys(groups).forEach(cat => {
    if (exActiveCat === 'all') {
      html += `<div class="ex-grid-section-label">${CAT_LABELS[cat] || cat}</div>`;
    }
    html += '<div class="ex-grid">';
    groups[cat].forEach(k => {
      const ex = EXAMPLES[k];
      const accent = CAT_ACCENT[ex.cat] || 'var(--sap-blue)';
      html += `
        <div class="ex-card" style="--card-accent:${accent}" onclick="loadExample('${k}')">
          <div class="ex-card-top">
            <span class="ex-card-icon">${ex.icon}</span>
            <span class="ex-card-name">${ex.label}</span>
          </div>
          <div class="ex-card-desc">${ex.desc}</div>
          <div class="ex-card-footer">
            <span class="ex-card-tag">${CAT_LABELS[ex.cat] || ex.cat}</span>
            <span class="ex-card-load">Load →</span>
          </div>
        </div>`;
    });
    html += '</div>';
  });

  wrap.innerHTML = html;
}

// ── Load an example ──
function loadExample(key) {
  const ex = EXAMPLES[key];
  if (!ex) return;

  // ── Step 1: Switch mode based on example type BEFORE loading content ──
  if (ex.xpathExpr && !xpathEnabled) {
    // XPath example — switch to XPath mode
    const colCenter = document.getElementById('colCenter');
    _xpathPreColCenterCollapsed = colCenter?.classList.contains('collapsed') ?? false;
    xpathEnabled = true;
    if (typeof _applyXPathToggleState === 'function') _applyXPathToggleState();
  } else if (!ex.xpathExpr && xpathEnabled) {
    // XSLT example — switch to XSLT mode
    xpathEnabled = false;
    if (typeof _applyXPathToggleState === 'function') _applyXPathToggleState();
  }

  // ── Step 2: Load content ──
  clearTimeout(xsltDebounce);
  clearTimeout(xmlDebounce);
  clearAllMarkers();

  try {
    _suppressNextValidation = true;
    eds.xml?.setValue(ex.xml);
    // Only set XSLT if in XSLT mode (and example has XSLT content)
    if (!xpathEnabled && ex.xslt) {
      _suppressNextValidation = true;
      eds.xslt?.setValue(ex.xslt);
    }
  } finally {
    _suppressNextValidation = false;
  }
  eds.out?.updateOptions({ readOnly: false });
  eds.out?.setValue('');
  eds.out?.updateOptions({ readOnly: true });
  renderOutputKV({}, {});

  // Only set KV panels in XSLT mode — they're hidden in XPath mode
  if (!xpathEnabled) {
    kvData = { headers: [], properties: [] };
    kvIdSeq = 0;
    if (ex.headers) {
      ex.headers.forEach(([n,v]) => { kvIdSeq++; kvData.headers.push({ id: kvIdSeq, name: n, value: v }); });
    }
    if (ex.properties) {
      ex.properties.forEach(([n,v]) => { kvIdSeq++; kvData.properties.push({ id: kvIdSeq, name: n, value: v }); });
    }
    renderKV('headers');
    renderKV('properties');
  }

  closeExModal();

  // ── Step 3: Post-load layout and actions ──
  if (ex.xpathExpr) {
    const colRight = document.getElementById('colRight');
    if (colRight.classList.contains('collapsed')) colRight.classList.remove('collapsed');
    setTimeout(() => { eds.xml?.layout(); eds.xslt?.layout(); eds.out?.layout(); }, 250);
    clog(`Example loaded: "${ex.label}" — XPath pre-filled, running…`, 'success');
    const xpathInput = document.getElementById('xpathInput');
    if (xpathInput) {
      xpathInput.value = ex.xpathExpr;
      setTimeout(() => { if (typeof runXPath === 'function') runXPath(); }, 350);
    }
  } else {
    const colRight = document.getElementById('colRight');
    if (!colRight.classList.contains('collapsed')) {
      colRight.classList.add('collapsed');
      setTimeout(() => { eds.xml?.layout(); eds.xslt?.layout(); eds.out?.layout(); }, 250);
    }
    clog(`Example loaded: "${ex.label}" — press Run Transform to execute`, 'success');
  }

  scheduleSave();
}