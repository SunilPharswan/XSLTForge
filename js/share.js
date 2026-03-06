// ════════════════════════════════════════════
//  SHARE
// ════════════════════════════════════════════

// ── Encode ──────────────────────────────────

function buildSharePayload() {
  return {
    xml:        eds.xml?.getValue()  ?? '',
    xslt:       eds.xslt?.getValue() ?? '',
    headers:    kvData.headers.map(r    => ({ name: r.name, value: r.value })),
    properties: kvData.properties.map(r => ({ name: r.name, value: r.value })),
  };
}

function encodeShareData(data) {
  const bytes      = new TextEncoder().encode(JSON.stringify(data));
  const compressed = pako.deflateRaw(bytes, { level: 9 });
  // Chunked to avoid O(n²) string concat and call-stack limits on large payloads
  const CHUNK = 8192;
  let binary = '';
  for (let i = 0; i < compressed.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, compressed.subarray(i, i + CHUNK));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateShareUrl() {
  return location.href.split('#')[0] + '#share/' + encodeShareData(buildSharePayload());
}

// ── Decode (called on page load) ─────────────

function loadFromShareHash() {
  if (!location.hash.startsWith('#share/')) return false;
  try {
    const raw    = location.hash.slice(7).replace(/-/g, '+').replace(/_/g, '/');
    const b64    = raw.padEnd(Math.ceil(raw.length / 4) * 4, '=');
    const binary = atob(b64);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json   = new TextDecoder().decode(pako.inflateRaw(bytes));
    window._pendingShareData = JSON.parse(json);
    history.replaceState(null, '', location.pathname + location.search);
    return true;
  } catch (e) {
    clog('Failed to decode share URL — link may be corrupted', 'error');
    return false;
  }
}

// ── Apply (called from editor.js after Monaco + Saxon are ready) ─────────────

function applyShareData(data) {
  if (!data) return;

  clearTimeout(xsltDebounce);
  clearTimeout(xmlDebounce);
  clearAllMarkers();

  if (data.xml  !== undefined) { _suppressNextSave = true; _suppressNextValidation = true; eds.xml?.setValue(data.xml); }
  if (data.xslt !== undefined) { _suppressNextSave = true; _suppressNextValidation = true; eds.xslt?.setValue(data.xslt); }

  kvData  = { headers: [], properties: [] };
  kvIdSeq = 0;
  (data.headers    || []).forEach(r => { kvIdSeq++; kvData.headers.push(   { id: kvIdSeq, name: r.name, value: r.value }); });
  (data.properties || []).forEach(r => { kvIdSeq++; kvData.properties.push({ id: kvIdSeq, name: r.name, value: r.value }); });

  eds.out?.updateOptions({ readOnly: false });
  eds.out?.setValue('');
  eds.out?.updateOptions({ readOnly: true });

  clog('Shared session loaded', 'success');
}

// ── Modal ────────────────────────────────────

function openShareModal() {
  document.getElementById('shareModalBackdrop').classList.add('open');
  try {
    const url   = generateShareUrl();
    const input = document.getElementById('shareUrlInput');
    if (input) input.value = url;
    _copyShareUrl(true);
  } catch (e) {
    clog('Failed to generate share URL: ' + e.message, 'error');
  }
}

function closeShareModal() {
  document.getElementById('shareModalBackdrop').classList.remove('open');
}

function handleShareBackdropClick(e) {
  if (e.target === document.getElementById('shareModalBackdrop')) closeShareModal();
}

function _copyShareUrl(silent) {
  const input = document.getElementById('shareUrlInput');
  const url   = input ? input.value : '';
  if (!url) return;

  var onSuccess = function() {
    if (!silent) {
      var btn  = document.getElementById('shareCopyBtn');
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = orig; }, 1400);
    }
    clog('Share URL copied to clipboard', 'success');
  };

  var onFail = function() {
    input.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch(_) {}
    if (ok) {
      onSuccess();
    } else {
      clog('Auto-copy unavailable — URL selected, press Ctrl+C to copy', 'warn');
    }
  };

  if (window.navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(url).then(onSuccess, onFail);
  } else {
    onFail();
  }
}
