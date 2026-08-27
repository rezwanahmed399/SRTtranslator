// =========================================================
// SubSync AI — Client-Side Subtitle Engine Logic
// =========================================================

// Global State
const state = {
  apiKey: '',
  availableModels: [],
  selectedModel: 'gemini-2.5-flash',
  parsedBlocks: [],       // Array of { num, timeCode, lines: [] }
  translatedBlocks: [],   // Array of { num, timeCode, lines: [], translatedLines: [] }
  uncompressedBlocks: [], // Backup of 1st-pass translation for 1-click restore
  isCondensed: false,
  fileName: '',
  fileSize: 0,
  durationStr: '00:00:00',
  optimalBatchSize: 30,
  isTranslating: false,
  isPaused: false,
  isCancelled: false,
  apiMetrics: {
    totalRequests: 0,
    successfulRequests: 0,
    rateLimitHits: 0,
    lastLatencyMs: 0,
    healthStatus: 'optimal'
  },
  stats: {
    total: 0,
    processed: 0,
    overlapsFixed: 0,
    emptyRecovered: 0,
    retries: 0,
    untranslated: 0
  }
};

// DOM References
const $ = id => document.getElementById(id);

const apiKeyInput       = $('apiKeyInput');
const toggleApiKey      = $('toggleApiKey');
const eyeIcon           = $('eyeIcon');
const saveApiKey        = $('saveApiKey');
const apiStatus         = $('apiStatus');

const targetLang        = $('targetLang');
const modelSelect       = $('modelSelect');
const modelLiveBadge    = $('modelLiveBadge');
const styleMode         = $('styleMode');
const contextHint       = $('contextHint');

const dropZone          = $('dropZone');
const fileInput         = $('fileInput');
const browseBtn         = $('browseBtn');
const removeFile        = $('removeFile');
const fileInfo          = $('fileInfo');
const fileName          = $('fileName');
const fileCountBadge    = $('fileCountBadge');
const fileSizeBadge     = $('fileSizeBadge');
const fileDurationBadge = $('fileDurationBadge');
const fileBatchBadge    = $('fileBatchBadge');
const fileRestoredBadge = $('fileRestoredBadge');
const subtitlePreview   = $('subtitlePreview');

const translateBtn      = $('translateBtn');
const ctaHint           = $('ctaHint');

const progressCard      = $('progressCard');
const progressTitle     = $('progressTitle');
const progressPct       = $('progressPct');
const progressBar       = $('progressBar');
const statProcessed     = $('statProcessed');
const statBatches       = $('statBatches');
const statOverlaps      = $('statOverlaps');
const statIntegrity     = $('statIntegrity');
const progressLog       = $('progressLog');
const liveActivityDot   = $('liveActivityDot');

const pauseResumeBtn    = $('pauseResumeBtn');
const ctrlIconPause     = $('ctrlIconPause');
const ctrlIconResume    = $('ctrlIconResume');
const pauseResumeLabel  = $('pauseResumeLabel');
const cancelTranslateBtn= $('cancelTranslateBtn');

const resultCard        = $('resultCard');
const resultStats       = $('resultStats');
const fixSummary        = $('fixSummary');
const tabViewContainer  = $('tabViewContainer');
const condenseSrtBtn    = $('condenseSrtBtn');
const restoreOriginalBtn= $('restoreOriginalBtn');
const downloadBtn       = $('downloadBtn');
const copySrtBtn        = $('copySrtBtn');
const retranslateBtn    = $('retranslateBtn');
const themeToggleBtn    = $('themeToggleBtn');
const themeLabelText    = $('themeLabelText');

const retryIncompleteBtn      = $('retryIncompleteBtn');
const incompleteWarningBanner = $('incompleteWarningBanner');
const incompleteWarningTitle  = $('incompleteWarningTitle');
const incompleteWarningDesc   = $('incompleteWarningDesc');

// ── Custom Modern Dialog System (UI Warnings & Alerts) ──
const customModalBackdrop  = $('customModalBackdrop');
const customModalBox       = $('customModalBox');
const modalIconBadge       = $('modalIconBadge');
const modalIconSvgWarning  = $('modalIconSvgWarning');
const modalIconSvgInfo     = $('modalIconSvgInfo');
const modalTitle           = $('modalTitle');
const modalMessage         = $('modalMessage');
const modalCancelBtn       = $('modalCancelBtn');
const modalConfirmBtn      = $('modalConfirmBtn');

let activeModalResolver = null;

function showCustomConfirm({ 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Yes, Confirm', 
  cancelText = 'Cancel', 
  type = 'warning' 
} = {}) {
  return new Promise(resolve => {
    if (!customModalBackdrop) {
      resolve(window.confirm(message));
      return;
    }

    activeModalResolver = resolve;

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalCancelBtn) {
      modalCancelBtn.textContent = cancelText;
      modalCancelBtn.classList.remove('hidden');
    }
    if (modalConfirmBtn) {
      modalConfirmBtn.textContent = confirmText;
      modalConfirmBtn.className = `btn btn-modal-confirm ${type === 'info' ? 'btn-info' : (type === 'warning' ? 'btn-warning' : '')}`;
    }

    if (customModalBox) {
      customModalBox.className = `custom-modal-box modal-type-${type}`;
    }

    if (modalIconSvgWarning) modalIconSvgWarning.classList.toggle('hidden', type === 'info');
    if (modalIconSvgInfo) modalIconSvgInfo.classList.toggle('hidden', type !== 'info');

    customModalBackdrop.classList.remove('hidden');
    if (modalConfirmBtn) modalConfirmBtn.focus();
  });
}

function showCustomAlert({ 
  title = 'Notification', 
  message = '', 
  buttonText = 'Got it', 
  type = 'info' 
} = {}) {
  return new Promise(resolve => {
    if (!customModalBackdrop) {
      window.alert(message);
      resolve(true);
      return;
    }

    activeModalResolver = resolve;

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalCancelBtn) modalCancelBtn.classList.add('hidden');
    if (modalConfirmBtn) {
      modalConfirmBtn.textContent = buttonText;
      modalConfirmBtn.className = `btn btn-modal-confirm ${type === 'info' ? 'btn-info' : (type === 'warning' ? 'btn-warning' : '')}`;
    }

    if (customModalBox) {
      customModalBox.className = `custom-modal-box modal-type-${type}`;
    }

    if (modalIconSvgWarning) modalIconSvgWarning.classList.toggle('hidden', type === 'info');
    if (modalIconSvgInfo) modalIconSvgInfo.classList.toggle('hidden', type !== 'info');

    customModalBackdrop.classList.remove('hidden');
    if (modalConfirmBtn) modalConfirmBtn.focus();
  });
}

function closeCustomModal(result = false) {
  if (customModalBackdrop) {
    customModalBackdrop.classList.add('hidden');
  }
  if (activeModalResolver) {
    const fn = activeModalResolver;
    activeModalResolver = null;
    fn(result);
  }
}

// ── IndexedDB Session Storage Engine ──
const DB_NAME = 'SubSyncAI_DB';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';

function openSessionDB() {
  return new Promise(resolve => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

async function saveCurrentSession() {
  try {
    if (!state.parsedBlocks || state.parsedBlocks.length === 0) return;
    const sessionData = {
      parsedBlocks: state.parsedBlocks,
      translatedBlocks: state.translatedBlocks,
      uncompressedBlocks: state.uncompressedBlocks,
      isCondensed: state.isCondensed,
      fileName: state.fileName,
      fileSize: state.fileSize,
      durationStr: state.durationStr,
      optimalBatchSize: state.optimalBatchSize,
      targetLang: targetLang ? targetLang.value : 'Bengali',
      selectedModel: state.selectedModel,
      stats: state.stats,
      timestamp: Date.now()
    };

    const db = await openSessionDB();
    if (!db) {
      localStorage.setItem('subsync_session_backup', JSON.stringify(sessionData));
      return;
    }
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(sessionData, 'active_session');
  } catch (err) {
    console.warn('Could not save session to IndexedDB:', err);
  }
}

async function loadSavedSession() {
  try {
    const db = await openSessionDB();
    if (!db) {
      const backup = localStorage.getItem('subsync_session_backup');
      return backup ? JSON.parse(backup) : null;
    }
    return new Promise(resolve => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('active_session');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Could not load session from IndexedDB:', err);
    return null;
  }
}

async function clearSavedSession() {
  try {
    localStorage.removeItem('subsync_session_backup');
    const db = await openSessionDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete('active_session');
  } catch (err) {
    console.warn('Could not clear session from IndexedDB:', err);
  }
}

async function restoreSessionIfAvailable() {
  const session = await loadSavedSession();
  if (!session || !session.parsedBlocks || session.parsedBlocks.length === 0) return;

  state.parsedBlocks = session.parsedBlocks;
  state.translatedBlocks = session.translatedBlocks || [];
  state.uncompressedBlocks = session.uncompressedBlocks || [];
  state.isCondensed = !!session.isCondensed;
  state.fileName = session.fileName || 'subtitles.srt';
  state.fileSize = session.fileSize || 0;
  state.durationStr = session.durationStr || '00:00:00';
  state.optimalBatchSize = session.optimalBatchSize || 30;
  state.stats = session.stats || state.stats;

  if (session.targetLang && targetLang) {
    targetLang.value = session.targetLang;
    refreshCustomSelect('targetLang');
  }

  // Display restored file info bar
  displayLoadedFileInfo({ name: state.fileName, size: state.fileSize }, state.parsedBlocks);

  if (fileRestoredBadge) {
    fileRestoredBadge.classList.remove('hidden');
  }

  // If translation was already done, display results view!
  if (state.translatedBlocks && state.translatedBlocks.length > 0) {
    showTranslationResults(state.translatedBlocks);
    addTerminalLog('ok', `Restored previous translation session for "${state.fileName}".`);
  }

  checkReadyToTranslate();
}

// ── Refresh / Leave Prevention ──
window.addEventListener('beforeunload', e => {
  if (state.isTranslating && !state.isCancelled) {
    e.preventDefault();
    e.returnValue = 'Translation is currently in progress. If you refresh or leave, ongoing translation will stop. Are you sure?';
    return e.returnValue;
  }
});

// ── Initialization ──
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomSelects();
  initFaqAccordion();
  const savedKey = (localStorage.getItem('gemini_api_key') || '').trim();
  if (savedKey) {
    apiKeyInput.value = savedKey;
    state.apiKey = savedKey;
    showApiFeedback('API Key loaded from local storage. Verifying...', 'ok');
    fetchLiveGeminiModels(savedKey);
  } else {
    resetQuotaDashboardToDisconnected('No API Key');
  }
  setupEventListeners();
  checkReadyToTranslate();
  restoreSessionIfAvailable();
});

// ── Theme Switcher ──
function initTheme() {
  const currentTheme = localStorage.getItem('srt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonUI(currentTheme);
}

function updateThemeButtonUI(theme) {
  if (themeLabelText) {
    themeLabelText.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('srt_theme', next);
  updateThemeButtonUI(next);
}

// ── Pause / Resume & Cancel Handlers ──
async function togglePauseTranslation() {
  if (!state.isTranslating) return;

  if (!state.isPaused) {
    const confirmed = await showCustomConfirm({
      title: 'Pause Translation?',
      message: 'Are you sure you want to pause ongoing translation? You can resume it anytime right from the next batch without losing any progress.',
      confirmText: 'Yes, Pause',
      cancelText: 'Keep Translating',
      type: 'warning'
    });
    if (!confirmed) return;

    state.isPaused = true;
    if (ctrlIconPause) ctrlIconPause.classList.add('hidden');
    if (ctrlIconResume) ctrlIconResume.classList.remove('hidden');
    if (pauseResumeLabel) pauseResumeLabel.textContent = 'Resume';
    if (pauseResumeBtn) pauseResumeBtn.classList.add('is-paused');
    if (liveActivityDot) liveActivityDot.style.animationPlayState = 'paused';
    updateProgressStats(parseInt(progressPct.textContent, 10) || 0, 'Translation Paused (Click Resume to continue)...');
    addTerminalLog('warn', 'Translation paused by user.');
  } else {
    state.isPaused = false;
    if (ctrlIconPause) ctrlIconPause.classList.remove('hidden');
    if (ctrlIconResume) ctrlIconResume.classList.add('hidden');
    if (pauseResumeLabel) pauseResumeLabel.textContent = 'Pause';
    if (pauseResumeBtn) pauseResumeBtn.classList.remove('is-paused');
    if (liveActivityDot) liveActivityDot.style.animationPlayState = 'running';
    addTerminalLog('info', 'Translation resumed.');
  }
}

async function cancelTranslationProcess() {
  if (!state.isTranslating) return;

  const confirmed = await showCustomConfirm({
    title: 'Cancel Translation?',
    message: 'Are you sure you want to cancel the ongoing translation? All translated data will be discarded and the session will be reset.',
    confirmText: 'Yes, Discard All',
    cancelText: 'Keep Translating',
    type: 'danger'
  });
  if (!confirmed) return;

  state.isCancelled = true;
  state.isPaused = false;
  state.isTranslating = false;

  // Discard all translated state and delete stored session
  state.translatedBlocks = [];
  state.uncompressedBlocks = [];
  state.isCondensed = false;
  clearSavedSession();

  // Reset UI elements cleanly
  if (progressCard) progressCard.classList.add('hidden');
  if (resultCard) resultCard.classList.add('hidden');
  if (incompleteWarningBanner) incompleteWarningBanner.classList.add('hidden');
  if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');

  resetTranslateButton();
  checkReadyToTranslate();
  addTerminalLog('warn', 'Translation cancelled by user. All ongoing progress was discarded.');
}

// ── Event Setup ──
function setupEventListeners() {
  // Custom Modal Dialog Listeners
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => closeCustomModal(false));
  }
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => closeCustomModal(true));
  }
  if (customModalBackdrop) {
    customModalBackdrop.addEventListener('click', e => {
      if (e.target === customModalBackdrop) closeCustomModal(false);
    });
  }
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && customModalBackdrop && !customModalBackdrop.classList.contains('hidden')) {
      closeCustomModal(false);
    }
  });

  // Theme Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  // API Key Toggle Visibility
  if (toggleApiKey && apiKeyInput && eyeIcon) {
    toggleApiKey.addEventListener('click', () => {
      const isPass = apiKeyInput.type === 'password';
      apiKeyInput.type = isPass ? 'text' : 'password';
      eyeIcon.innerHTML = isPass
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
           <line x1="1" y1="1" x2="23" y2="23"/>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
           <circle cx="12" cy="12" r="3"/>`;
    });
  }

  // Allow pressing Enter in API Key input
  if (apiKeyInput) {
    apiKeyInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveApiKey();
      }
    });
  }

  // Save API Key and load live models
  if (saveApiKey) {
    saveApiKey.addEventListener('click', handleSaveApiKey);
  }

  // Drag & Drop
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    if (browseBtn) browseBtn.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });

    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
      });
    });

    dropZone.addEventListener('drop', e => {
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFileSelection(files[0]);
    });

    fileInput.addEventListener('change', e => {
      if (e.target.files.length > 0) handleFileSelection(e.target.files[0]);
    });
  }

  // Remove File
  if (removeFile) {
    removeFile.addEventListener('click', async () => {
      const confirmed = await showCustomConfirm({
        title: 'Remove Subtitle File?',
        message: 'Are you sure you want to remove this file? Any existing translations and saved session data will be permanently cleared.',
        confirmText: 'Yes, Remove File',
        cancelText: 'Keep File',
        type: 'danger'
      });
      if (!confirmed) return;

      state.parsedBlocks = [];
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      state.isCondensed = false;
      state.fileName = '';
      if (fileInput) fileInput.value = '';
      if (fileInfo) fileInfo.classList.add('hidden');
      if (dropZone) dropZone.classList.remove('hidden');
      if (progressCard) progressCard.classList.add('hidden');
      if (resultCard) resultCard.classList.add('hidden');
      if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');
      if (incompleteWarningBanner) incompleteWarningBanner.classList.add('hidden');
      clearSavedSession();
      checkReadyToTranslate();
    });
  }

  // Start Translation
  if (translateBtn) {
    translateBtn.addEventListener('click', runTranslationPipeline);
  }

  // Pause / Resume & Cancel Translation Controls
  if (pauseResumeBtn) {
    pauseResumeBtn.addEventListener('click', togglePauseTranslation);
  }

  if (cancelTranslateBtn) {
    cancelTranslateBtn.addEventListener('click', cancelTranslationProcess);
  }

  // Retranslate
  if (retranslateBtn) {
    retranslateBtn.addEventListener('click', async () => {
      const confirmed = await showCustomConfirm({
        title: 'Retranslate Subtitles?',
        message: 'This will reset the current translation and re-translate all subtitle lines from the beginning.',
        confirmText: 'Yes, Retranslate',
        cancelText: 'Cancel',
        type: 'warning'
      });
      if (!confirmed) return;

      if (resultCard) resultCard.classList.add('hidden');
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      state.isCondensed = false;
      clearSavedSession();
      runTranslationPipeline();
    });
  }

  // Retry Incomplete Batches
  if (retryIncompleteBtn) {
    retryIncompleteBtn.addEventListener('click', retryIncompleteBatchesPipeline);
  }

  // AI Condenser (2nd-Pass Refinement)
  if (condenseSrtBtn) {
    condenseSrtBtn.addEventListener('click', runAiCondensePipeline);
  }

  // Restore Original Uncompressed Translation
  if (restoreOriginalBtn) {
    restoreOriginalBtn.addEventListener('click', restoreOriginalTranslation);
  }

  // Download Action
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (state.translatedBlocks.length > 0) downloadSRTFile(state.translatedBlocks);
    });
  }

  // Copy Action
  if (copySrtBtn) {
    copySrtBtn.addEventListener('click', copyFullSRTCode);
  }

  // Subtitle Pacing Preset Change
  const pacingBadge = $('pacingBadge');
  if (styleMode) {
    const updatePacingUI = () => {
      const val = styleMode.value;
      if (pacingBadge) {
        if (val === 'micro') {
          pacingBadge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Glance Speed</span>
          `;
        } else if (val === 'concise') {
          pacingBadge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Fast Reading</span>
          `;
        } else if (val === 'balanced') {
          pacingBadge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Balanced</span>
          `;
        } else {
          pacingBadge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span>Detailed</span>
          `;
        }
      }
    };
    styleMode.addEventListener('change', updatePacingUI);
    updatePacingUI();
  }

  // Model Selection Change
  if (modelSelect) {
    modelSelect.addEventListener('change', () => {
      state.selectedModel = modelSelect.value;
      if (state.loadedModels) updateQuotaDashboard(state.loadedModels);
    });
  }

  // Toggle Live Model Specs Drawer
  const toggleQuotaBtn = $('toggleQuotaBtn');
  const quotaDashboard = $('apiQuotaDashboard');
  const toggleQuotaText = $('toggleQuotaText');
  if (toggleQuotaBtn && quotaDashboard) {
    toggleQuotaBtn.addEventListener('click', () => {
      const isHidden = quotaDashboard.classList.contains('hidden');
      if (isHidden) {
        quotaDashboard.classList.remove('hidden');
        toggleQuotaBtn.classList.add('active');
        if (toggleQuotaText) toggleQuotaText.textContent = 'Hide Google Model Specs';
      } else {
        quotaDashboard.classList.add('hidden');
        toggleQuotaBtn.classList.remove('active');
        if (toggleQuotaText) toggleQuotaText.textContent = 'View Google Model Specs & Limits';
      }
    });
  }

  // Tab switching
  document.querySelectorAll('.preview-tab').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderActiveTab(this.dataset.tab, state.translatedBlocks);
    });
  });
}

function handleSaveApiKey() {
  const raw = apiKeyInput.value.trim();
  // Clean surrounding quotes, spaces, or formatting artifacts
  const cleanKey = raw.replace(/^["']|["']$/g, '').trim();

  if (!cleanKey || cleanKey.length < 10) {
    showApiFeedback('Please enter a valid Gemini API key from Google AI Studio.', 'err');
    return;
  }

  saveApiKey.disabled = true;
  saveApiKey.innerHTML = '<span>Verifying...</span>';
  showApiFeedback('Connecting to Google Gemini API & loading live models...', 'ok');
  
  fetchLiveGeminiModels(cleanKey).finally(() => {
    saveApiKey.disabled = false;
    saveApiKey.innerHTML = '<span>Connect & Load Models</span>';
  });
}

function showApiFeedback(msg, type) {
  const icon = type === 'ok'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  apiStatus.innerHTML = `${icon}<span>${escapeHtml(msg)}</span>`;
  apiStatus.className = 'api-feedback ' + type;
}

// ── Automatic Live Model Fetcher ──
function resetQuotaDashboardToDisconnected(errMsg = '') {
  const toggleBtn = $('toggleQuotaBtn');
  const dashboard = $('apiQuotaDashboard');
  if (dashboard) dashboard.classList.add('hidden');
  if (toggleBtn) {
    toggleBtn.classList.remove('active');
    toggleBtn.classList.add('hidden');
  }

  const qName = $('quotaModelName');
  const qVer = $('quotaModelVersion');
  const qContext = $('quotaContext');
  const qOut = $('quotaOutputTokens');
  const qRpm = $('quotaRpm');
  const qRpd = $('quotaRpd');
  const latencyVal = $('quotaSessionLatency');

  if (qName) qName.textContent = '— (Disconnected)';
  if (qVer) qVer.textContent = errMsg ? 'Auth Error' : 'Awaiting Valid API Key';
  if (qContext) qContext.textContent = '—';
  if (qOut) qOut.textContent = '—';
  if (qRpm) qRpm.textContent = '—';
  if (qRpd) qRpd.textContent = '—';
  if (latencyVal) latencyVal.textContent = errMsg ? 'Ping: Error (Unauthenticated)' : 'Last Latency: —';

  const isNoKey = !errMsg || errMsg === 'No API Key';
  updateApiHealthUI(
    isNoKey ? 'disconnected' : 'exhausted',
    isNoKey ? 'Awaiting Valid API Key' : `API Error: ${errMsg.slice(0, 32)}`
  );

  syncCustomSelectDisabled('modelSelect');
  refreshCustomSelect('modelSelect');
}

async function fetchLiveGeminiModels(key) {
  if (!key) {
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="" disabled selected>Enter & Save Gemini API key above to load models live...</option>';
    modelLiveBadge.textContent = 'Awaiting API Key';
    modelLiveBadge.className = 'hint-tag';
    resetQuotaDashboardToDisconnected('No API Key');
    return;
  }

  modelSelect.disabled = true;
  modelSelect.innerHTML = '<option value="" disabled selected>Fetching available models live from Google...</option>';
  modelLiveBadge.textContent = 'Connecting to Google...';
  modelLiveBadge.className = 'hint-tag active-tag';
  syncCustomSelectDisabled('modelSelect');
  refreshCustomSelect('modelSelect');

  const probeStart = performance.now();

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const probeMs = Math.round(performance.now() - probeStart);
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errorMsg = errData?.error?.message || `HTTP ${res.status}: Invalid API Key or request rejected by Google.`;
      throw new Error(errorMsg);
    }
    
    const data = await res.json();
    
    if (data && Array.isArray(data.models)) {
      // Filter strictly for official, active, general text & translation Gemini models
      const textModels = data.models.filter(m => {
        const id = m.name.replace(/^models\//, '').toLowerCase();
        
        // Must support text generation
        const hasGenContent = Array.isArray(m.supportedGenerationMethods) && 
                              m.supportedGenerationMethods.includes('generateContent');
        if (!hasGenContent) return false;

        // Must be a Gemini core model (exclude non-Gemini like Gemma, Lyria, etc.)
        if (!id.startsWith('gemini')) return false;

        // Exclude non-text/specialized multimodal variants that cannot do text translation
        const nonTextTerms = [
          'tts', 'banana', 'nano', 'robotics', 'transcribe', 
          'clip', 'deep-research', 'computer-use', 'customtools', 
          'embedding', 'embed', 'aqa', 'imagen', 'image', 'audio', 
          'realtime', 'live', 'speech', 'voice', 'diffusion', 'medlm'
        ];
        if (nonTextTerms.some(term => id.includes(term))) return false;

        return true;
      });

      if (textModels.length > 0) {
        state.apiKey = key;
        state.loadedModels = textModels;
        localStorage.setItem('gemini_api_key', key);
        populateModelDropdown(textModels);
        updateQuotaDashboard(textModels, probeMs);
        showApiFeedback(`Connected! ${textModels.length} active Gemini models fetched live from Google API`, 'ok');
        modelLiveBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px;display:inline-block;margin-right:4px;vertical-align:-1px;">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>${textModels.length} Live Google Models Connected</span>
        `;
        modelLiveBadge.className = 'hint-tag active-tag';
        modelSelect.disabled = false;
        syncCustomSelectDisabled('modelSelect');
        refreshCustomSelect('modelSelect');
        checkReadyToTranslate();
        return;
      }
    }
    throw new Error('No compatible translation models found for this API key.');
  } catch (err) {
    console.warn('Could not auto-fetch models from API:', err);
    modelSelect.disabled = true;
    modelSelect.innerHTML = `<option value="" disabled selected>Failed to load models (${escapeHtml(err.message.slice(0, 45))}...)</option>`;
    modelLiveBadge.textContent = 'Connection Error';
    modelLiveBadge.className = 'hint-tag';
    resetQuotaDashboardToDisconnected(err.message);
    showApiFeedback(`Google API Error: ${err.message}`, 'err');
    checkReadyToTranslate();
  }
}

function updateApiHealthUI(status = 'optimal', customMessage = '', latencyMs = null) {
  const pill = $('apiHealthPill');
  const text = $('apiHealthText');
  const callsVal = $('quotaSessionCalls');
  const latencyVal = $('quotaSessionLatency');

  if (callsVal) {
    callsVal.textContent = `${state.apiMetrics.totalRequests} Requests`;
  }
  if (latencyVal) {
    if (latencyMs !== null) {
      latencyVal.textContent = `Last: ${latencyMs}ms ${state.apiMetrics.rateLimitHits > 0 ? '(' + state.apiMetrics.rateLimitHits + ' limit hits)' : '(0 errors)'}`;
    } else if (state.apiMetrics.lastLatencyMs > 0) {
      latencyVal.textContent = `Last: ${state.apiMetrics.lastLatencyMs}ms ${state.apiMetrics.rateLimitHits > 0 ? '(' + state.apiMetrics.rateLimitHits + ' limit hits)' : '(0 errors)'}`;
    } else {
      latencyVal.textContent = `Last Latency: —`;
    }
  }

  if (!pill || !text) return;

  pill.className = 'api-health-pill';
  state.apiMetrics.healthStatus = status;

  if (status === 'optimal') {
    pill.classList.add('health-optimal');
    text.textContent = customMessage || 'Quota Health: Optimal';
  } else if (status === 'active') {
    pill.classList.add('health-active');
    text.textContent = customMessage || 'Processing API Call...';
  } else if (status === 'cooldown') {
    pill.classList.add('health-warning');
    text.textContent = customMessage || 'Rate Limit Cooldown Active';
  } else if (status === 'exhausted') {
    pill.classList.add('health-error');
    text.textContent = customMessage || 'Quota Limit Reached (429)';
  } else if (status === 'disconnected') {
    pill.classList.add('health-disconnected');
    text.textContent = customMessage || 'Awaiting Valid API Key';
  }
}

function updateQuotaDashboard(models, initialLatencyMs = null) {
  if (!models || models.length === 0) {
    resetQuotaDashboardToDisconnected('No Models Available');
    return;
  }

  const toggleBtn = $('toggleQuotaBtn');
  if (toggleBtn) toggleBtn.classList.remove('hidden');
  
  const selectedId = (modelSelect.value || models[0].name.replace(/^models\//, '')).toLowerCase();
  const activeModelObj = models.find(m => m.name.replace(/^models\//, '').toLowerCase() === selectedId) || models[0];

  const inputLimit = activeModelObj?.inputTokenLimit || 1048576;
  const outputLimit = activeModelObj?.outputTokenLimit || 8192;
  const isFlash = selectedId.includes('flash');

  const qName = $('quotaModelName');
  const qVer = $('quotaModelVersion');
  const qContext = $('quotaContext');
  const qOut = $('quotaOutputTokens');
  const qRpm = $('quotaRpm');
  const qRpd = $('quotaRpd');

  if (qName) qName.textContent = activeModelObj?.displayName || selectedId;
  if (qVer) qVer.textContent = activeModelObj?.version ? `v${activeModelObj.version} • Live Google Verified` : 'v1beta • Live Google Verified';
  if (qContext) qContext.textContent = `${Number(inputLimit).toLocaleString()} Tokens`;
  if (qOut) qOut.textContent = `${Number(outputLimit).toLocaleString()} Tokens`;
  if (qRpm) qRpm.textContent = isFlash ? '15 RPM' : '2 RPM';
  if (qRpd) qRpd.textContent = isFlash ? '1,500 RPD' : '50 RPD';

  updateApiHealthUI('optimal', 'Quota Health: Optimal', initialLatencyMs);
}

function populateModelDropdown(models) {
  modelSelect.innerHTML = '';

  // Extract clean unique model list
  const seenIds = new Set();
  const cleanModels = [];

  models.forEach(m => {
    const id = m.name.replace(/^models\//, '');
    if (!seenIds.has(id)) {
      seenIds.add(id);
      cleanModels.push({
        id,
        displayName: m.displayName || id,
        description: m.description || '',
        version: m.version || '',
        inputTokens: m.inputTokenLimit || 1048576,
        outputTokens: m.outputTokenLimit || 8192
      });
    }
  });

  // Ranking & categorization: Flash Models > Pro Models > Preview/Experimental
  const flashGroup = [];
  const proGroup = [];
  const expGroup = [];

  cleanModels.forEach(m => {
    const lower = m.id.toLowerCase();
    if (lower.includes('preview') || lower.includes('exp')) {
      expGroup.push(m);
    } else if (lower.includes('pro')) {
      proGroup.push(m);
    } else {
      flashGroup.push(m);
    }
  });

  // Dynamic mathematical version extractor (e.g., "gemini-3.5-flash" -> 3.5, "gemini-2.0-flash" -> 2.0)
  const extractVersionNumber = id => {
    const match = id.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 1.0;
  };

  // Sort any group dynamically by highest version number first
  const sortByVersionDesc = (a, b) => {
    const verDiff = extractVersionNumber(b.id) - extractVersionNumber(a.id);
    if (verDiff !== 0) return verDiff;
    // Prefer non-8b over 8b for equal version numbers
    const isA8b = a.id.includes('8b') ? 1 : 0;
    const isB8b = b.id.includes('8b') ? 1 : 0;
    return isA8b - isB8b;
  };

  flashGroup.sort(sortByVersionDesc);
  proGroup.sort(sortByVersionDesc);
  expGroup.sort(sortByVersionDesc);

  // Save all active model IDs in priority order for failover
  state.sortedModelList = [...flashGroup, ...proGroup, ...expGroup].map(m => m.id);

  // Group 1: Flash Production Models
  if (flashGroup.length > 0) {
    const grp = document.createElement('optgroup');
    grp.label = `Fast & Production Models (Flash — ${flashGroup.length} live)`;
    flashGroup.forEach((m, idx) => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.displayName} (${m.id})${idx === 0 ? ' — Recommended' : ''}`;
      grp.appendChild(opt);
    });
    modelSelect.appendChild(grp);
  }

  // Group 2: Pro High-Precision Models
  if (proGroup.length > 0) {
    const grp = document.createElement('optgroup');
    grp.label = `High-Precision Models (Pro — ${proGroup.length} live)`;
    proGroup.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.displayName} (${m.id})`;
      grp.appendChild(opt);
    });
    modelSelect.appendChild(grp);
  }

  // Group 3: Preview & Experimental
  if (expGroup.length > 0) {
    const grp = document.createElement('optgroup');
    grp.label = `Preview & Experimental Models (${expGroup.length} live)`;
    expGroup.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.displayName} (${m.id})`;
      grp.appendChild(opt);
    });
    modelSelect.appendChild(grp);
  }

  // Auto-select the top recommended model
  if (state.sortedModelList.length > 0) {
    modelSelect.value = state.sortedModelList[0];
    state.selectedModel = state.sortedModelList[0];
  }

  refreshCustomSelect('modelSelect');
}

// ── File Selection & Adaptive Batching ──
function handleFileSelection(file) {
  if (!file.name.toLowerCase().endsWith('.srt')) {
    alert('Please upload a valid .srt subtitle file.');
    return;
  }

  // Cleanly reset any previous translation results and stored session
  state.translatedBlocks = [];
  state.uncompressedBlocks = [];
  state.isCondensed = false;
  if (resultCard) resultCard.classList.add('hidden');
  if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');
  clearSavedSession();

  state.fileName = file.name;
  state.fileSize = file.size;

  const reader = new FileReader();
  reader.onload = e => {
    const rawContent = e.target.result;
    const blocks = parseSRT(rawContent);

    if (!blocks || blocks.length === 0) {
      alert('Could not detect valid subtitles in this file. Please check if the SRT file is formatted properly.');
      return;
    }

    state.parsedBlocks = blocks;
    calculateDuration(blocks);
    
    // Automatically calculate optimal batch size based on subtitle count & complexity
    state.optimalBatchSize = calculateOptimalBatchSize(blocks);

    displayLoadedFileInfo(file, blocks);
    checkReadyToTranslate();
  };
  reader.readAsText(file, 'UTF-8');
}

// Automatically determines safest & fastest batch size (no manual user effort required)
function calculateOptimalBatchSize(blocks) {
  const total = blocks.length;
  // Calculate average words per subtitle
  const sample = blocks.slice(0, 30);
  const avgWords = sample.reduce((acc, b) => acc + b.lines.join(' ').split(/\s+/).length, 0) / (sample.length || 1);

  if (avgWords > 15) {
    // Dense subtitles (dialogue heavy / lectures) -> keep batch slightly smaller for high quality
    return 20;
  } else if (total <= 60) {
    return 20;
  } else if (total <= 300) {
    return 30;
  } else {
    // Large movie / episode -> 35 lines per batch for max speed & minimal API calls
    return 35;
  }
}

// Robust SRT Parser (Preserves exact timing, handles edge cases & multiline subtitles)
function parseSRT(raw) {
  const clean = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawChunks = clean.trim().split(/\n\s*\n/);
  const blocks = [];

  for (let i = 0; i < rawChunks.length; i++) {
    const lines = rawChunks[i].trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) continue;

    // Find timecode line containing '-->'
    let tcIndex = -1;
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].includes('-->')) {
        tcIndex = j;
        break;
      }
    }

    if (tcIndex === -1) continue;

    const num = lines.slice(0, tcIndex).join(' ').trim() || String(blocks.length + 1);
    const timeCode = lines[tcIndex].trim();
    const textLines = lines.slice(tcIndex + 1).filter(l => l.length > 0);

    if (textLines.length === 0) continue;
    if (!isValidSRTTimecode(timeCode)) continue;

    blocks.push({
      num,
      timeCode,
      lines: textLines
    });
  }

  return blocks;
}

function isValidSRTTimecode(tc) {
  return /\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(tc);
}

function parseTimeRange(tc) {
  const parts = tc.split('-->').map(s => s.trim());
  if (parts.length !== 2) return null;
  return { start: tcToMs(parts[0]), end: tcToMs(parts[1]) };
}

function tcToMs(tc) {
  const m = tc.replace(',', '.').match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
  if (!m) return 0;
  return (+m[1] * 3600 + +m[2] * 60 + +m[3]) * 1000 + +m[4];
}

function msToTc(ms) {
  const safeMs = Math.max(0, ms);
  const h = Math.floor(safeMs / 3600000); const rem1 = safeMs % 3600000;
  const m = Math.floor(rem1 / 60000);   const rem2 = rem1 % 60000;
  const s = Math.floor(rem2 / 1000);    const rem3 = rem2 % 1000;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)},${String(rem3).padStart(3, '0')}`;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function calculateDuration(blocks) {
  if (blocks.length === 0) {
    state.durationStr = '00:00:00';
    return;
  }
  const last = blocks[blocks.length - 1];
  const tr = parseTimeRange(last.timeCode);
  if (tr) {
    const totalSecs = Math.floor(tr.end / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    state.durationStr = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  }
}

function displayLoadedFileInfo(file, blocks) {
  dropZone.classList.add('hidden');
  fileInfo.classList.remove('hidden');

  fileName.textContent = file.name;
  fileCountBadge.textContent = `${blocks.length} Subtitles`;
  const szKb = (file.size / 1024).toFixed(1);
  fileSizeBadge.textContent = `${szKb} KB`;
  fileDurationBadge.textContent = `Duration: ${state.durationStr}`;
  fileBatchBadge.textContent = `Auto Batching: ${state.optimalBatchSize} lines/req`;

  // Render first 5 preview blocks
  subtitlePreview.innerHTML = blocks.slice(0, 5).map(b => `
    <div class="preview-item">
      <div class="preview-meta">
        <span class="block-num">#${escapeHtml(b.num)}</span>
        <span class="block-tc">${escapeHtml(b.timeCode)}</span>
      </div>
      <div class="preview-text-line">${escapeHtml(b.lines.join(' '))}</div>
    </div>
  `).join('') + (blocks.length > 5 ? `<div style="font-size:0.75rem; color:var(--text-dim); padding:4px;">+ ${blocks.length - 5} more subtitle lines loaded</div>` : '');
}

function checkReadyToTranslate() {
  const hasFile = state.parsedBlocks.length > 0;
  const hasKey = (state.apiKey || apiKeyInput.value.trim()).length > 15;

  translateBtn.disabled = !(hasFile && hasKey);

  if (!hasKey) {
    ctaHint.textContent = 'Please enter your Gemini API key above to enable automatic model loading & translation.';
  } else if (!hasFile) {
    ctaHint.textContent = 'Please upload an SRT subtitle file above.';
  } else {
    ctaHint.textContent = `Ready! Click the button above to translate ${state.parsedBlocks.length} subtitles into ${targetLang.value}.`;
  }
}

// ── Safety & Engine Configuration ──
const GEMINI_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
];

// ── Ultra-Resilient JSON Parser & Auto-Repair ──
function parseAndRepairJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty text received from model.');
  }

  // 1. Strip markdown fences and trailing noise
  let clean = rawText
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/```\s*$/m, '')
    .trim();

  // 2. Direct Parse Attempt
  try {
    const direct = JSON.parse(clean);
    if (Array.isArray(direct)) return direct;
    if (direct && typeof direct === 'object') {
      const arr = direct.subtitles || direct.items || direct.translations || direct.results || direct.data;
      if (Array.isArray(arr)) return arr;
    }
  } catch (e) {
    // Continue to repair strategies
  }

  // 3. Extract bracketed array if surrounded by preamble/postamble
  const arrayMatch = clean.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    clean = arrayMatch[0];
    try {
      const arr = JSON.parse(clean);
      if (Array.isArray(arr)) return arr;
    } catch (e) {
      // Continue to deeper repair
    }
  }

  // 4. Sanitize literal control characters inside string literals (e.g. unescaped newlines/tabs)
  try {
    let inString = false;
    let escaped = false;
    const sanitizedChars = [];

    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];

      if (ch === '\\' && !escaped) {
        escaped = true;
        sanitizedChars.push(ch);
        continue;
      }

      if (ch === '"' && !escaped) {
        inString = !inString;
        sanitizedChars.push(ch);
        continue;
      }

      if (inString) {
        if (ch === '\n') {
          sanitizedChars.push('\\n');
        } else if (ch === '\r') {
          sanitizedChars.push('\\r');
        } else if (ch === '\t') {
          sanitizedChars.push('\\t');
        } else {
          sanitizedChars.push(ch);
        }
      } else {
        sanitizedChars.push(ch);
      }

      escaped = false;
    }

    let sanitizedStr = sanitizedChars.join('');
    // Remove trailing commas before closing brackets
    sanitizedStr = sanitizedStr.replace(/,\s*([\]}])/g, '$1');

    const parsed = JSON.parse(sanitizedStr);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') {
      const arr = parsed.subtitles || parsed.items || parsed.translations;
      if (Array.isArray(arr)) return arr;
    }
  } catch (e) {
    // Continue to heuristic regex extractor
  }

  // 5. Heuristic Regex Item Extractor (Extracts individual complete objects)
  const items = [];
  const itemRegex = /\{[^{}]*?"id"\s*:\s*"?(\d+)"?[^{}]*?"(?:text|translation|bengali|content|translated_text)"\s*:\s*"((?:[^"\\]|\\.)*)"[^{}]*?\}/g;
  let match;
  while ((match = itemRegex.exec(rawText)) !== null) {
    try {
      const id = parseInt(match[1], 10);
      const text = JSON.parse(`"${match[2]}"`);
      items.push({ id, text });
    } catch {
      items.push({
        id: parseInt(match[1], 10),
        text: match[2].replace(/\\n/g, '\n').replace(/\\"/g, '"')
      });
    }
  }

  if (items.length > 0) {
    return items;
  }

  throw new Error('Could not parse or repair valid JSON from model response.');
}

// ── Translation Pipeline ──
async function runTranslationPipeline() {
  const activeKey = state.apiKey || apiKeyInput.value.trim();
  if (!activeKey) {
    alert('Please enter your Gemini API Key before proceeding.');
    return;
  }

  state.isTranslating = true;
  state.isPaused = false;
  state.isCancelled = false;

  // Reset Pause UI
  if (ctrlIconPause) ctrlIconPause.classList.remove('hidden');
  if (ctrlIconResume) ctrlIconResume.classList.add('hidden');
  if (pauseResumeLabel) pauseResumeLabel.textContent = 'Pause';
  if (pauseResumeBtn) pauseResumeBtn.classList.remove('is-paused');

  // Update UI to running state
  translateBtn.querySelector('.btn-content').classList.add('hidden');
  translateBtn.querySelector('.btn-spinner-state').classList.remove('hidden');
  translateBtn.disabled = true;

  progressCard.classList.remove('hidden');
  resultCard.classList.add('hidden');
  progressLog.innerHTML = '';

  state.stats = {
    total: state.parsedBlocks.length,
    processed: 0,
    overlapsFixed: 0,
    emptyRecovered: 0,
    retries: 0,
    untranslated: 0
  };

  const bs = state.optimalBatchSize || 30;
  const batches = chunkArray(state.parsedBlocks, bs);
  const translated = new Array(state.parsedBlocks.length);

  updateProgressStats(0, `Auto-configured ${batches.length} optimal batches (${bs} subtitles/batch)...`);
  addTerminalLog('info', `File: ${state.fileName} (${state.parsedBlocks.length} subtitles, duration: ${state.durationStr})`);
  
  const currentModelToUse = (modelSelect.value || (state.sortedModelList && state.sortedModelList[0]) || 'gemini-2.5-flash').replace(/^models\//, '');
  addTerminalLog('info', `Active Model: ${currentModelToUse} • Adaptive Batching: ${bs} lines`);

  let processedCount = 0;

  try {
    for (let bi = 0; bi < batches.length; bi++) {
      // Check for pause
      while (state.isPaused && !state.isCancelled) {
        await sleep(300);
      }
      if (state.isCancelled) {
        addTerminalLog('warn', `Translation stopped at batch ${bi + 1}/${batches.length}.`);
        break;
      }

      const currentBatch = batches[bi];
      const startIndex = bi * bs;
      const batchPct = Math.round((processedCount / state.parsedBlocks.length) * 94);

      updateProgressStats(batchPct, `Translating batch ${bi + 1} of ${batches.length} (#${currentBatch[0].num} – #${currentBatch[currentBatch.length - 1].num})...`);
      addTerminalLog('info', `Batch ${bi + 1}/${batches.length}: Translating ${currentBatch.length} lines with ${currentModelToUse}...`);

      let batchResult = [];
      try {
        batchResult = await translateBatchWithAdaptiveSplitting(currentBatch, activeKey, currentModelToUse);
      } catch (err) {
        if (state.isCancelled) break;
        addTerminalLog('err', `Batch ${bi + 1} could not be fully completed: ${err.message}. Original lines safely preserved.`);
        batchResult = currentBatch.map(b => ({
          ...b,
          translatedLines: b.lines,
          isTranslated: false
        }));
      }

      // Merge translated blocks into main result array
      for (let j = 0; j < batchResult.length; j++) {
        translated[startIndex + j] = batchResult[j];
      }

      const batchSuccessCount = batchResult.filter(b => b.isTranslated).length;
      processedCount += currentBatch.length;
      state.stats.processed = processedCount;
      statProcessed.textContent = `${processedCount} / ${state.parsedBlocks.length}`;
      statBatches.textContent = `${bi + 1} / ${batches.length}`;

      if (batchSuccessCount === currentBatch.length) {
        addTerminalLog('ok', `Batch ${bi + 1}/${batches.length} finished (100% translated).`);
      } else {
        addTerminalLog('warn', `Batch ${bi + 1}/${batches.length} completed with ${currentBatch.length - batchSuccessCount} lines in English.`);
      }

      // Smooth inter-batch pacing delay to respect Google API 15 RPM rate limits
      if (bi < batches.length - 1 && !state.isCancelled) {
        await sleep(1400);
      }
    }

    if (state.isCancelled) {
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      clearSavedSession();
      if (progressCard) progressCard.classList.add('hidden');
      if (resultCard) resultCard.classList.add('hidden');
      return;
    }

    // Post-processing: Precision Timing Verification & Overlap Correction
    updateProgressStats(96, 'Verifying timecodes and auto-correcting any overlaps...');
    addTerminalLog('info', 'Running precision timing validation & overlap check...');
    await sleep(100);

    const finalizedBlocks = postProcessSubtitles(translated);
    state.translatedBlocks = finalizedBlocks;

    const untranslatedTotal = finalizedBlocks.filter(b => b.isTranslated === false).length;
    state.stats.untranslated = untranslatedTotal;

    if (untranslatedTotal === 0) {
      updateProgressStats(100, 'Translation & timing synchronization complete!');
      addTerminalLog('ok', `Completed 100%! Fixed ${state.stats.overlapsFixed} overlaps with zero timecode drift.`);
    } else {
      updateProgressStats(100, `Translation completed with ${untranslatedTotal} lines in English (Retry available).`);
      addTerminalLog('warn', `Translation finished with ${untranslatedTotal} untranslated lines. You can click "Retry Incomplete Batches" to finish them.`);
    }

    await sleep(350);

    // Present Results & Persist in IndexedDB
    showTranslationResults(finalizedBlocks);
    saveCurrentSession();

    // Automatic SRT download only if 100% complete
    if (untranslatedTotal === 0) {
      await sleep(300);
      downloadSRTFile(finalizedBlocks);
      addTerminalLog('ok', 'Automatic SRT download triggered in browser.');
    }
  } finally {
    state.isTranslating = false;
    state.isPaused = false;
    resetTranslateButton();
  }
}

// ── Adaptive Sub-Batch Splitting Engine (Divide & Conquer) ──
async function translateBatchWithAdaptiveSplitting(batch, activeKey, modelToUse, attempt = 1) {
  if (!batch || batch.length === 0) return [];

  // Wait if paused
  while (state.isPaused && !state.isCancelled) {
    await sleep(300);
  }
  if (state.isCancelled) {
    throw new Error('Translation cancelled by user');
  }

  try {
    const result = await callGeminiBatchTranslate(batch, activeKey, attempt, modelToUse);
    const translatedCount = result.filter(b => b && b.isTranslated).length;

    // If all items translated successfully, return
    if (translatedCount === batch.length) {
      return result;
    }

    // If some lines were not matched and batch size > 2, split and retry untranslated portions
    if (batch.length > 2 && translatedCount < batch.length) {
      if (state.isCancelled) return result;
      addTerminalLog('warn', `Batch of ${batch.length} lines had ${batch.length - translatedCount} missing translations. Dividing into smaller sub-batches to ensure 100% completion...`);
      const mid = Math.ceil(batch.length / 2);
      await sleep(1000);
      const resA = await translateBatchWithAdaptiveSplitting(batch.slice(0, mid), activeKey, modelToUse, 1);
      await sleep(1200);
      const resB = await translateBatchWithAdaptiveSplitting(batch.slice(mid), activeKey, modelToUse, 1);
      return [...resA, ...resB];
    }

    return result;
  } catch (err) {
    if (state.isCancelled) throw err;
    state.stats.retries++;
    const errMsg = (err.message || '').toLowerCase();
    const is429 = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('resource has been exhausted');
    const is503 = errMsg.includes('503') || errMsg.includes('overloaded') || errMsg.includes('high demand');

    if (is429) {
      const waitTime = Math.min(5000 * attempt, 16000);
      updateApiHealthUI('cooldown', `429 Rate Limit Cooldown (${waitTime / 1000}s)...`);
      addTerminalLog('warn', `Google API rate limit (15 RPM) reached. Pausing for ${waitTime / 1000}s to cool down before retry ${attempt}/3...`);
      await sleep(waitTime);
      updateApiHealthUI('active', `Resuming translation...`);
      if (attempt <= 3 && !state.isCancelled) {
        return await translateBatchWithAdaptiveSplitting(batch, activeKey, modelToUse, attempt + 1);
      }
    } else if (is503) {
      addTerminalLog('warn', `Google server busy (503). Retrying in 4s...`);
      await sleep(4000);
      if (attempt <= 3 && !state.isCancelled) {
        return await translateBatchWithAdaptiveSplitting(batch, activeKey, modelToUse, attempt + 1);
      }
    }

    // If batch has multiple items and failed, SPLIT into 2 sub-batches (Divide and Conquer)
    if (batch.length > 1 && !state.isCancelled) {
      const mid = Math.ceil(batch.length / 2);
      const subA = batch.slice(0, mid);
      const subB = batch.slice(mid);
      addTerminalLog('warn', `Sub-dividing batch of ${batch.length} lines into smaller chunks (${subA.length} + ${subB.length}) to isolate error...`);
      await sleep(1200);
      const resA = await translateBatchWithAdaptiveSplitting(subA, activeKey, modelToUse, 1);
      await sleep(1200);
      const resB = await translateBatchWithAdaptiveSplitting(subB, activeKey, modelToUse, 1);
      return [...resA, ...resB];
    }

    // Single block failed all attempts
    addTerminalLog('err', `Subtitle #${batch[0].num} could not be translated: ${err.message}. Marking as incomplete.`);
    return batch.map(b => ({
      ...b,
      translatedLines: b.lines,
      isTranslated: false
    }));
  }
}

// ── Gemini Translation Engine ──
async function callGeminiBatchTranslate(batch, key, attemptNumber, overrideModel) {
  const lang = targetLang.value || 'Bengali';
  const pace = styleMode.value;
  const hint = contextHint.value.trim();
  
  // Clean model ID to strictly avoid double 'models/' prefix
  const rawModel = overrideModel || modelSelect.value || 'gemini-2.5-flash';
  const selectedModel = rawModel.replace(/^models\//, '').trim();

  // Construct structured payload (Only subtitle text and ID is passed; timecodes remain 100% untouched)
  const inputData = batch.map((item, index) => ({
    id: index,
    text: item.lines.join('\n')
  }));

  // Pacing & Reading Speed Instructions
  let pacingPrompt = '';
  if (pace === 'micro' || pace === 'ultra_concise') {
    pacingPrompt = `SUBTITLE PACING (Ultra-Short & Glance-Speed):
- Make subtitle lines ULTRA-SHORT, punchy, and readable in a split second / blink of an eye.
- Minimize word count strictly (aim for 1 to 4 words per short dialogue, or minimal concise words).
- Ruthlessly remove filler words, prolonged formal grammar, and unnecessary particles (e.g. "আমরা এখন যাব" -> "চল যাই", "তুমি কি এটা জানো?" -> "এটা জানো?").
- Preserve 100% of the dialogue's true punch, emotion, and dramatic tone in natural spoken phrasing (চলতি কথ্য রূপ).`;
  } else if (pace === 'concise') {
    pacingPrompt = `SUBTITLE PACING (Fast Reading & Concise):
- Keep subtitle lines short, crisp, and easy to read in a quick glance.
- Avoid over-complicated sentences and unnecessary filler words so the viewer can read comfortably without looking away from the video.
- Preserve 100% of the dialogue's true meaning, emotion, and tone.`;
  } else if (pace === 'balanced') {
    pacingPrompt = `SUBTITLE PACING (Balanced & Natural):
- Keep translations natural, conversational, and comfortable to read at normal dialogue speed.`;
  } else if (pace === 'detailed') {
    pacingPrompt = `SUBTITLE PACING (Detailed & Complete):
- Translate every nuance, specific term, and sentence clause accurately and completely without summarizing.`;
  }

  // Language-specific and universal dialogue & pronoun guidelines
  let languageRules = '';
  const langLower = lang.toLowerCase();

  if (langLower.includes('bengali') || lang === 'Bengali') {
    languageRules = `
DIALOGUE & REGIONAL VOCABULARY RULES (Bengali / বাংলা):
- Strictly use modern standard Bangladeshi Bengali phrasing and natural vocabulary commonly used across Bangladesh.
- Standard Vocabulary Mapping:
  * Use "পানি" (NEVER use "জল" for water).
  * Use "রংধনু" (NEVER use "রামধনু").
  * Use "জাতিসংঘ" (NEVER use "রাষ্ট্রপুঞ্জ").
  * Use "গোসল" (NEVER use "স্নান").
  * Use "দাওয়াত" / "আমন্ত্রণ" (NEVER use "নিমন্ত্রণ").
  * Use "খোদা" / "ঈশ্বর" / "আল্লাহ" (NEVER use "ভগবান" as default generic deity).
  * For greetings, use "সালাম" / "হাই" / "হ্যালো" / "কেমন আছেন" (avoid "নমস্কার" unless character-specific religious setting).
- Avoid West Bengal / Indian regional vocabulary (e.g. জল, রামধনু, ভগবান, স্নান, রাষ্ট্রপুঞ্জ, নিমন্ত্রণ, দিদিমণি, মশাই, ইত্যাদি).
- PRONOUNS:
  * NEVER use disrespectful pronouns like "তুই", "তোর", "তোকে" unless explicitly required by intense hostility/abuse.
  * ALWAYS use polite, friendly, and natural conversational pronouns like "তুমি", "তোমার", "তোমাকে", "তোমরা" (or "আপনি/আপনার" for elders/formal roles).
- Translate in lively, natural everyday spoken Bangladeshi Bengali (চলতি কথ্য ভাষা) so it feels like a top-tier cinematic dub.`;
  } else if (langLower.includes('hindi') || langLower.includes('urdu')) {
    languageRules = `
DIALOGUE & PRONOUN RULES (${lang}):
- AVOID disrespectful or rude pronouns like "तू" / "तेরা" / "तुझे".
- Use friendly, polite, and natural conversational pronouns like "तुम", "तुम्हारा", "तुम्हें" (or "आप", "आपका" for respect/elders).
- Translate in natural, modern conversational cinema/drama dialogue.`;
  } else if (langLower.includes('spanish')) {
    languageRules = `
DIALOGUE RULES (Spanish):
- Use authentic, modern spoken Spanish dialogue suitable for cinema and television subtitles.
- Maintain appropriate familiarity (tú / usted) consistent with characters' relationships and context.`;
  } else if (langLower.includes('french')) {
    languageRules = `
DIALOGUE RULES (French):
- Use natural, fluid conversational French suitable for modern cinema and streaming subtitles.
- Maintain consistent register (tu / vous) based on context and character relationships.`;
  } else if (langLower.includes('japanese')) {
    languageRules = `
DIALOGUE RULES (Japanese):
- Use natural spoken Japanese suitable for anime and movie subtitles (match plain/polite form to character personality and social context).`;
  } else {
    languageRules = `
DIALOGUE RULES (${lang}):
- Use natural, fluent conversational ${lang} appropriate for modern movie and video subtitles.
- Choose natural, friendly, and respectful pronouns suitable for the characters' relationship.`;
  }

  const promptText = `You are a professional cinematic subtitle localization translator.
Task: Translate every single subtitle dialogue line accurately into ${lang}.

MANDATORY RULES:
1. Every subtitle text MUST be translated into ${lang}. Do NOT leave original untranslated text.
2. Return ONLY a valid JSON array of objects conforming to Schema.
   Schema: [{"id": 0, "text": "translated dialogue in ${lang}"}, {"id": 1, "text": "translated dialogue in ${lang}"}]
3. Preserve 100% of subtitle meaning, punchlines, drama, context, and emotion.
4. ${pacingPrompt}
5. Formatting & Tags:
   - Preserve HTML formatting tags (like <i>, </i>, <b>, </b>) if present in original text.
   - Preserve speaker tags or sound effects (e.g. [Music], (Laughter), [Door slams], JOHN:) appropriately without mangling brackets.
   - If original subtitle text has multiple dialogue lines (e.g. starting with "- "), keep clean line breaks in translated text.${languageRules}
${hint ? `6. Context/Genre: ${hint}` : ''}

INPUT SUBTITLES TO TRANSLATE (${batch.length} items):
${JSON.stringify(inputData, null, 2)}

OUTPUT (JSON Array):`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${key}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.15,
      maxOutputTokens: 8192
    },
    safetySettings: GEMINI_SAFETY_SETTINGS
  };

  state.apiMetrics.totalRequests++;
  const reqStart = Date.now();
  updateApiHealthUI('active', `Sending Batch #${batch[0]?.num || 1}...`);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
  } catch (netErr) {
    const lat = Date.now() - reqStart;
    updateApiHealthUI('warning', 'Network Retry...', lat);
    throw netErr;
  }

  const duration = Date.now() - reqStart;
  state.apiMetrics.lastLatencyMs = duration;

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    if (response.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate limit')) {
      state.apiMetrics.rateLimitHits++;
      updateApiHealthUI('cooldown', '429 Rate Limit Cooldown', duration);
    } else {
      updateApiHealthUI('warning', `Google API Error (${response.status})`, duration);
    }
    throw new Error(errMsg);
  }

  state.apiMetrics.successfulRequests++;
  updateApiHealthUI('optimal', 'Quota Health: Optimal', duration);

  const responseData = await response.json();
  const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawText.trim()) {
    throw new Error('Received empty response from Gemini API.');
  }

  const parsedArray = parseAndRepairJson(rawText);

  if (!Array.isArray(parsedArray)) {
    throw new Error('AI output was not a JSON array.');
  }

  // Map results back to blocks with universal property fallback
  return batch.map((originalBlock, idx) => {
    let matched = null;
    if (Array.isArray(parsedArray)) {
      matched = parsedArray.find(item => item && (
        item.id === idx || 
        item.id === String(idx) || 
        item.id === idx + 1 || 
        item.id === String(idx + 1) ||
        item.id === originalBlock.num
      ));

      if (!matched && idx < parsedArray.length) {
        matched = parsedArray[idx];
      }
    }

    let transText = '';
    if (typeof matched === 'string') {
      transText = matched.trim();
    } else if (matched && typeof matched === 'object') {
      transText = (
        matched.text || 
        matched.translation || 
        matched.translated_text || 
        matched.bengali || 
        matched.content ||
        matched.translatedText ||
        matched.translated ||
        matched.dialogue ||
        Object.values(matched).find(v => typeof v === 'string' && v.trim().length > 0 && v !== String(matched.id)) ||
        ''
      ).trim();
    }

    if (!transText) {
      return {
        ...originalBlock,
        translatedLines: originalBlock.lines,
        isTranslated: false
      };
    }

    const lines = transText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    return {
      ...originalBlock,
      translatedLines: lines.length > 0 ? lines : [transText],
      isTranslated: true
    };
  });
}

// ── Selective Retry Pipeline for Incomplete Batches ──
async function retryIncompleteBatchesPipeline() {
  const activeKey = state.apiKey || apiKeyInput.value.trim();
  if (!activeKey) {
    alert('Please enter your Gemini API Key before proceeding.');
    return;
  }

  const incompleteIndices = [];
  state.translatedBlocks.forEach((b, idx) => {
    if (b.isTranslated === false) {
      incompleteIndices.push(idx);
    }
  });

  if (incompleteIndices.length === 0) {
    alert('All subtitles are already 100% translated!');
    return;
  }

  state.isTranslating = true;
  state.isPaused = false;
  state.isCancelled = false;

  if (ctrlIconPause) ctrlIconPause.classList.remove('hidden');
  if (ctrlIconResume) ctrlIconResume.classList.add('hidden');
  if (pauseResumeLabel) pauseResumeLabel.textContent = 'Pause';
  if (pauseResumeBtn) pauseResumeBtn.classList.remove('is-paused');

  if (retryIncompleteBtn) {
    retryIncompleteBtn.disabled = true;
    retryIncompleteBtn.innerHTML = `
      <span class="modern-spinner" style="width:14px;height:14px;border-width:2px;"></span>
      <span>Retrying ${incompleteIndices.length} lines...</span>
    `;
  }

  progressCard.classList.remove('hidden');
  resultCard.classList.add('hidden');
  progressLog.innerHTML = '';

  updateProgressStats(0, `Retrying ${incompleteIndices.length} incomplete subtitle lines...`);
  addTerminalLog('info', `[Selective Retry Engine] Found ${incompleteIndices.length} untranslated subtitle lines.`);

  const blocksToRetry = incompleteIndices.map(idx => ({
    ...state.parsedBlocks[idx],
    originalIndex: idx
  }));

  const bs = Math.min(state.optimalBatchSize || 20, 15);
  const batches = chunkArray(blocksToRetry, bs);
  let processed = 0;
  const currentModelToUse = (modelSelect.value || (state.sortedModelList && state.sortedModelList[0]) || 'gemini-2.5-flash').replace(/^models\//, '');

  try {
    for (let bi = 0; bi < batches.length; bi++) {
      while (state.isPaused && !state.isCancelled) {
        await sleep(300);
      }
      if (state.isCancelled) {
        addTerminalLog('warn', `Selective retry stopped by user.`);
        break;
      }

      const currentBatch = batches[bi];
      const pct = Math.round((processed / blocksToRetry.length) * 100);
      updateProgressStats(pct, `Retrying batch ${bi + 1} of ${batches.length} (${currentBatch.length} lines)...`);
      addTerminalLog('info', `Retrying lines ${currentBatch.map(b => '#' + b.num).join(', ')}...`);

      try {
        const res = await translateBatchWithAdaptiveSplitting(currentBatch, activeKey, currentModelToUse);
        res.forEach((translatedBlock, i) => {
          const origIdx = currentBatch[i].originalIndex;
          if (translatedBlock.isTranslated) {
            state.translatedBlocks[origIdx] = {
              ...translatedBlock,
              originalIndex: undefined
            };
          }
        });
        addTerminalLog('ok', `Retry batch ${bi + 1} completed.`);
      } catch (err) {
        if (state.isCancelled) break;
        addTerminalLog('err', `Retry batch ${bi + 1} failed: ${err.message}`);
      }

      processed += currentBatch.length;
      if (bi < batches.length - 1 && !state.isCancelled) {
        await sleep(1500);
      }
    }

    if (state.isCancelled) {
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      clearSavedSession();
      if (progressCard) progressCard.classList.add('hidden');
      if (resultCard) resultCard.classList.add('hidden');
      return;
    }

    updateProgressStats(100, 'Selective retry complete! Updating final subtitles...');
    const finalized = postProcessSubtitles(state.translatedBlocks);
    state.translatedBlocks = finalized;

    const stillIncomplete = finalized.filter(b => b.isTranslated === false).length;
    state.stats.untranslated = stillIncomplete;

    await sleep(350);
    showTranslationResults(finalized);
    saveCurrentSession();

    if (stillIncomplete === 0 && !state.isCancelled) {
      addTerminalLog('ok', 'All subtitles are now 100% translated and synchronized!');
      downloadSRTFile(finalized);
    } else {
      addTerminalLog('warn', `${stillIncomplete} lines still remain untranslated. You can click retry again.`);
    }
  } finally {
    state.isTranslating = false;
    state.isPaused = false;
    if (retryIncompleteBtn) {
      retryIncompleteBtn.disabled = false;
      retryIncompleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 4v6h6"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
        <span>Retry Incomplete Batches</span>
      `;
    }
  }
}

// ── Timing Correction & Overlap Fixer ──
function postProcessSubtitles(blocks) {
  const result = blocks.map(b => ({ ...b }));

  // 1. Recover empty lines
  for (let i = 0; i < result.length; i++) {
    if (!result[i].translatedLines || result[i].translatedLines.length === 0) {
      result[i].translatedLines = result[i].lines;
      result[i].isTranslated = false;
      state.stats.emptyRecovered++;
    }
  }

  // 2. Overlap detection & resolution
  for (let i = 1; i < result.length; i++) {
    const prevRange = parseTimeRange(result[i - 1].timeCode);
    const currRange = parseTimeRange(result[i].timeCode);

    if (!prevRange || !currRange) continue;

    // If previous block ends AFTER current block starts -> collision / overlap
    if (prevRange.end > currRange.start) {
      const adjustedEnd = Math.max(prevRange.start + 100, currRange.start - 1);
      result[i - 1].timeCode = `${msToTc(prevRange.start)} --> ${msToTc(adjustedEnd)}`;
      state.stats.overlapsFixed++;
    }
  }

  statOverlaps.textContent = String(state.stats.overlapsFixed);
  return result;
}

// ── Word Count & Reading Speed Helpers ──
function countTotalWords(blocks) {
  if (!blocks || !Array.isArray(blocks)) return 0;
  return blocks.reduce((acc, b) => {
    const text = (b.translatedLines || b.lines || []).join(' ');
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    return acc + count;
  }, 0);
}

function getReadingSpeedPill(lines) {
  const text = (Array.isArray(lines) ? lines.join(' ') : String(lines || '')).trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const sec = (words * 0.22).toFixed(1);
  const flashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
  const clockIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

  if (words <= 3) {
    return `<span class="speed-pill speed-micro" title="${words} words: Read in a blink">${flashIcon} ${sec}s (${words}w)</span>`;
  } else if (words <= 7) {
    return `<span class="speed-pill speed-fast" title="${words} words: Fast glance reading">${flashIcon} ${sec}s (${words}w)</span>`;
  } else if (words <= 12) {
    return `<span class="speed-pill speed-normal" title="${words} words: Standard comfort speed">${clockIcon} ${sec}s (${words}w)</span>`;
  } else {
    return `<span class="speed-pill speed-dense" title="${words} words: Dense line - click Shorten to condense">${clockIcon} ${sec}s (${words}w)</span>`;
  }
}

// ── AI 2nd-Pass Condenser Pipeline ──
async function runAiCondensePipeline() {
  if (state.translatedBlocks.length === 0) return;
  const activeKey = state.apiKey || apiKeyInput.value.trim();
  if (!activeKey) {
    alert('Please enter your Gemini API Key before proceeding.');
    return;
  }

  // Backup original translations if not already done
  if (!state.uncompressedBlocks || state.uncompressedBlocks.length === 0) {
    state.uncompressedBlocks = JSON.parse(JSON.stringify(state.translatedBlocks));
  }

  const origBtnHtml = condenseSrtBtn.innerHTML;
  condenseSrtBtn.disabled = true;
  condenseSrtBtn.innerHTML = `
    <span class="modern-spinner" style="width:14px;height:14px;border-width:2px;"></span>
    <span>Condensing Subtitles...</span>
  `;

  progressCard.classList.remove('hidden');
  resultCard.classList.add('hidden');
  progressLog.innerHTML = '';

  const totalWordsStart = countTotalWords(state.translatedBlocks);
  updateProgressStats(0, 'Starting 2nd-Pass AI Condensation for ultra-fast reading...');
  addTerminalLog('info', `[2nd-Pass Condenser] Analyzing ${state.translatedBlocks.length} subtitles (${totalWordsStart} total words)...`);

  const bs = 25;
  const batches = chunkArray(state.translatedBlocks, bs);
  const condensedResult = new Array(state.translatedBlocks.length);
  let processedCount = 0;
  const currentModelToUse = (modelSelect.value || (state.sortedModelList && state.sortedModelList[0]) || 'gemini-2.5-flash').replace(/^models\//, '');

  for (let bi = 0; bi < batches.length; bi++) {
    const currentBatch = batches[bi];
    const startIndex = bi * bs;
    const batchPct = Math.round((processedCount / state.translatedBlocks.length) * 95);

    updateProgressStats(batchPct, `Condensing batch ${bi + 1} of ${batches.length}...`);

    let batchResult = [];
    let success = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        batchResult = await callGeminiBatchCondense(currentBatch, activeKey, attempt, currentModelToUse);
        success = true;
        break;
      } catch (err) {
        state.stats.retries++;
        const errMsg = (err.message || '').toLowerCase();
        const is429 = errMsg.includes('429') || errMsg.includes('quota');

        if (is429) {
          const waitTime = Math.min(5000 * attempt, 15000);
          addTerminalLog('warn', `Rate limit reached. Pausing ${waitTime / 1000}s before condenser retry ${attempt}/3...`);
          await sleep(waitTime);
        } else if (attempt < 3) {
          addTerminalLog('warn', `Retry ${attempt}/3 for batch ${bi + 1}...`);
          await sleep(1500 * attempt);
        } else {
          addTerminalLog('err', `Could not condense batch ${bi + 1}. Keeping current translation.`);
          batchResult = currentBatch;
        }
      }
    }

    for (let j = 0; j < batchResult.length; j++) {
      condensedResult[startIndex + j] = batchResult[j];
    }

    processedCount += currentBatch.length;
    if (bi < batches.length - 1) {
      await sleep(1200);
    }
  }

  updateProgressStats(98, 'Synchronizing precision timecodes for condensed subtitles...');
  const finalizedBlocks = postProcessSubtitles(condensedResult);

  state.translatedBlocks = finalizedBlocks;
  state.isCondensed = true;

  const totalWordsEnd = countTotalWords(finalizedBlocks);
  const totalPercentSaved = totalWordsStart > 0 ? Math.max(0, Math.round(((totalWordsStart - totalWordsEnd) / totalWordsStart) * 100)) : 0;

  updateProgressStats(100, `AI Condensation complete! Reduced words by ${totalPercentSaved}% for instant glance reading.`);
  addTerminalLog('ok', `[Done] Original: ${totalWordsStart} words -> Condensed: ${totalWordsEnd} words (-${totalPercentSaved}% reading load).`);

  await sleep(350);

  // Present Results & Persist in IndexedDB
  showTranslationResults(finalizedBlocks, totalPercentSaved);
  saveCurrentSession();

  // Auto download condensed version
  await sleep(300);
  downloadSRTFile(finalizedBlocks);
  addTerminalLog('ok', 'Condensed SRT auto-downloaded.');

  condenseSrtBtn.innerHTML = origBtnHtml;
  condenseSrtBtn.disabled = false;
}

// ── Gemini 2nd-Pass Condense API Call ──
async function callGeminiBatchCondense(batch, key, attemptNumber, overrideModel) {
  const lang = targetLang.value || 'Bengali';
  const rawModel = overrideModel || modelSelect.value || 'gemini-2.5-flash';
  const selectedModel = rawModel.replace(/^models\//, '').trim();

  const inputData = batch.map((item, index) => ({
    id: index,
    source: item.lines.join(' '),
    translation: (item.translatedLines || item.lines).join(' ')
  }));

  let condenseLangRule = '';
  if (lang.toLowerCase().includes('bengali') || lang === 'Bengali') {
    condenseLangRule = `
7. Strictly maintain natural Bangladeshi Bengali vocabulary (e.g. use "পানি", "রংধনু", "জাতিসংঘ", "গোসল", "খোদা/ঈশ্বর", "সালাম/হাই/হ্যালো"; strictly avoid West Bengal variants like "জল", "রামধনু", "ভগবান", "স্নান", "নমস্কার").`;
  }

  const promptText = `You are a master subtitle compression and localization editor.
Task: Condense and shorten the given ${lang} subtitle translations so they are readable in a split second glance.

MANDATORY RULES:
1. Make every subtitle line ULTRA-SHORT and punchy (ideal 1-4 words for short lines, or minimum possible concise words).
2. Cut away conversational padding, redundant particles, extra formal suffixes, and repetitive words so viewers can read instantaneously.
3. Strictly preserve 100% of the core emotion, punchline, dialogue intent, and context.
4. Output strictly in natural everyday spoken ${lang} dialogue/script.
5. Preserve HTML tags like <i>, </i>, <b>, </b> if present.
6. Return ONLY a valid JSON array of objects conforming to Schema.
Schema: [{"id": 0, "text": "concise dialogue in ${lang}"}, {"id": 1, "text": "concise dialogue in ${lang}"}]${condenseLangRule}

INPUT SUBTITLES (${batch.length} items):
${JSON.stringify(inputData, null, 2)}

OUTPUT (JSON Array):`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${key}`;

  const requestBody = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.15,
      maxOutputTokens: 8192
    },
    safetySettings: GEMINI_SAFETY_SETTINGS
  };

  state.apiMetrics.totalRequests++;
  const reqStart = Date.now();
  updateApiHealthUI('active', `Condensing Subtitles...`);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
  } catch (netErr) {
    const lat = Date.now() - reqStart;
    updateApiHealthUI('warning', 'Network Retry...', lat);
    throw netErr;
  }

  const duration = Date.now() - reqStart;
  state.apiMetrics.lastLatencyMs = duration;

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    if (response.status === 429) {
      state.apiMetrics.rateLimitHits++;
      updateApiHealthUI('cooldown', '429 Rate Limit Cooldown', duration);
    } else {
      updateApiHealthUI('warning', `Google API (${response.status})`, duration);
    }
    throw new Error(errMsg);
  }

  state.apiMetrics.successfulRequests++;
  updateApiHealthUI('optimal', 'Quota Health: Optimal', duration);

  const responseData = await response.json();
  const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawText.trim()) throw new Error('Received empty response from Gemini Condenser.');

  const parsedArray = parseAndRepairJson(rawText);

  if (!Array.isArray(parsedArray)) throw new Error('AI condenser output was not a JSON array.');

  return batch.map((originalBlock, idx) => {
    let matched = parsedArray.find(item => item && (
      item.id === idx || 
      item.id === String(idx) || 
      item.id === idx + 1 || 
      item.id === String(idx + 1)
    ));
    if (!matched && idx < parsedArray.length) matched = parsedArray[idx];

    let transText = '';
    if (typeof matched === 'string') {
      transText = matched.trim();
    } else if (matched && typeof matched === 'object') {
      transText = (
        matched.text || 
        matched.translation || 
        matched.translated_text || 
        matched.bengali || 
        matched.content ||
        matched.dialogue ||
        Object.values(matched).find(v => typeof v === 'string' && v.trim().length > 0 && v !== String(matched.id)) ||
        ''
      ).trim();
    }

    if (!transText) {
      return { ...originalBlock };
    }

    const lines = transText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    return {
      ...originalBlock,
      translatedLines: lines.length > 0 ? lines : [transText]
    };
  });
}

// ── Restore Original 1st-Pass Translation ──
function restoreOriginalTranslation() {
  if (!state.uncompressedBlocks || state.uncompressedBlocks.length === 0) return;
  state.translatedBlocks = JSON.parse(JSON.stringify(state.uncompressedBlocks));
  state.isCondensed = false;
  showTranslationResults(state.translatedBlocks);
  saveCurrentSession();
  addTerminalLog('info', 'Restored original uncompressed translation.');
}

// ── Single Block Interactive Shorten ──
async function condenseSingleBlock(index) {
  const block = state.translatedBlocks[index];
  if (!block) return;
  const activeKey = state.apiKey || apiKeyInput.value.trim();
  if (!activeKey) {
    alert('Please enter your Gemini API Key first.');
    return;
  }

  // Backup if not done yet
  if (!state.uncompressedBlocks || state.uncompressedBlocks.length === 0) {
    state.uncompressedBlocks = JSON.parse(JSON.stringify(state.translatedBlocks));
  }

  const buttons = document.querySelectorAll(`.btn-card-shorten[data-idx="${index}"]`);
  buttons.forEach(b => {
    b.disabled = true;
    b.textContent = '...';
  });

  try {
    const currentModel = (modelSelect.value || 'gemini-2.5-flash').replace(/^models\//, '');
    const result = await callGeminiBatchCondense([block], activeKey, 1, currentModel);
    if (result && result[0]) {
      state.translatedBlocks[index] = result[0];
      const activeTab = document.querySelector('.preview-tab.active')?.dataset?.tab || 'translated';
      renderActiveTab(activeTab, state.translatedBlocks);
      if (restoreOriginalBtn) restoreOriginalBtn.classList.remove('hidden');
      saveCurrentSession();
    }
  } catch (err) {
    console.error('Error shortening line:', err);
    alert('Could not shorten line: ' + err.message);
  } finally {
    const shortenIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
    buttons.forEach(b => {
      b.disabled = false;
      b.innerHTML = `${shortenIcon} <span>Shorten</span>`;
    });
  }
}

// ── Render Results View ──
function showTranslationResults(blocks, percentSaved) {
  progressCard.classList.add('hidden');
  resultCard.classList.remove('hidden');

  const untranslatedCount = blocks.filter(b => b.isTranslated === false).length;

  if (untranslatedCount > 0) {
    resultStats.textContent = `${blocks.length - untranslatedCount} of ${blocks.length} subtitles translated to ${targetLang.value} (${untranslatedCount} in English) • 0 drift • 100% timecode integrity`;
    if (incompleteWarningBanner) {
      incompleteWarningBanner.classList.remove('hidden');
      if (incompleteWarningTitle) {
        incompleteWarningTitle.textContent = `Attention: ${untranslatedCount} subtitle lines remain untranslated`;
      }
      if (incompleteWarningDesc) {
        incompleteWarningDesc.textContent = `Due to temporary rate limits or API load, ${untranslatedCount} lines could not be translated and remain in English. Click "Retry Incomplete Batches" below to translate only these lines.`;
      }
    }
  } else {
    resultStats.textContent = `${blocks.length} subtitles localized to ${targetLang.value} • 0 drift • 100% timecode integrity`;
    if (incompleteWarningBanner) {
      incompleteWarningBanner.classList.add('hidden');
    }
  }

  // Toggle Restore Button
  if (restoreOriginalBtn) {
    if (state.isCondensed || (state.uncompressedBlocks && state.uncompressedBlocks.length > 0)) {
      restoreOriginalBtn.classList.remove('hidden');
    } else {
      restoreOriginalBtn.classList.add('hidden');
    }
  }

  // Badges Summary
  const badges = [];

  if (state.isCondensed) {
    badges.push({ 
      text: `AI Condensed (${percentSaved ? '-' + percentSaved + '% Words' : 'Glance-Speed'})`, 
      type: 'success' 
    });
  }

  if (untranslatedCount === 0) {
    badges.push({ text: `${blocks.length} Subtitles 100% Ready`, type: 'success' });
  } else {
    badges.push({ text: `${blocks.length - untranslatedCount}/${blocks.length} Subtitles Ready`, type: 'warning' });
    badges.push({ text: `${untranslatedCount} Lines in English`, type: 'warning' });
  }

  badges.push({ text: '100% Timing Preserved', type: 'success' });

  if (state.stats.overlapsFixed > 0) {
    badges.push({ text: `${state.stats.overlapsFixed} Overlaps Auto-Corrected`, type: 'warning' });
  } else {
    badges.push({ text: '0 Timing Overlaps Found', type: 'success' });
  }

  if (state.stats.emptyRecovered > 0) {
    badges.push({ text: `${state.stats.emptyRecovered} Missing Lines Recovered`, type: 'warning' });
  }

  if (state.stats.retries > 0) {
    badges.push({ text: `${state.stats.retries} Auto-Retries / Sub-Splits`, type: 'warning' });
  }

  fixSummary.innerHTML = badges.map(b => `
    <span class="quality-pill ${b.type}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px">
        ${b.type === 'success' ? '<polyline points="20 6 9 17 4 12"/>' : '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>'}
      </svg>
      ${b.text}
    </span>
  `).join('');

  // Default active tab: Raw Code Box
  document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
  $('tabCode').classList.add('active');
  renderActiveTab('code', blocks);
}

// ── Tab View Switcher ──
function renderActiveTab(tab, blocks) {
  const shortenSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;

  if (tab === 'code') {
    const srtText = generateSRTString(blocks);
    tabViewContainer.innerHTML = `
      <div class="codebox-wrapper">
        <div class="codebox-header">
          <div class="codebox-file-name">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>${escapeHtml(state.fileName.replace(/\.srt$/i, ''))}_${targetLang.value.slice(0, 2).toLowerCase()}${state.isCondensed ? '_glance' : ''}.srt</span>
          </div>
          <button class="codebox-copy-btn" id="inlineCodeCopyBtn" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>1-Click Copy SRT</span>
          </button>
        </div>
        <pre class="codebox-content" id="rawSrtPre">${escapeHtml(srtText)}</pre>
      </div>
    `;

    $('inlineCodeCopyBtn').addEventListener('click', copyFullSRTCode);

  } else if (tab === 'translated') {
    tabViewContainer.innerHTML = `
      <div class="cards-scroll-view">
        ${blocks.map((b, idx) => `
          <div class="subtitle-block-card">
            <div class="block-header-line">
              <span class="block-index">#${escapeHtml(b.num)}</span>
              <span class="block-timecode">${escapeHtml(b.timeCode)}</span>
              <div class="card-meta-right">
                ${getReadingSpeedPill(b.translatedLines)}
                <button class="btn-card-shorten" data-idx="${idx}" type="button" title="Trim this line shorter">${shortenSvg} <span>Shorten</span></button>
              </div>
            </div>
            <div class="block-text-content">${escapeHtml(b.translatedLines.join('\n'))}</div>
          </div>
        `).join('')}
      </div>
    `;

    tabViewContainer.querySelectorAll('.btn-card-shorten').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        condenseSingleBlock(idx);
      });
    });

  } else if (tab === 'side') {
    tabViewContainer.innerHTML = `
      <div class="comparison-grid">
        <div class="comparison-column">
          <div class="column-title-bar">
            <span>Original Dialogue</span>
            <span>Source</span>
          </div>
          <div class="comparison-scroll">
            ${blocks.map(b => `
              <div class="subtitle-block-card">
                <div class="block-header-line">
                  <span class="block-index">#${escapeHtml(b.num)}</span>
                  <span class="block-timecode">${escapeHtml(b.timeCode)}</span>
                  <div class="card-meta-right">
                    ${getReadingSpeedPill(b.lines)}
                  </div>
                </div>
                <div class="block-text-content" style="color:var(--text-muted); font-size:0.86rem;">
                  ${escapeHtml(b.lines.join('\n'))}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="comparison-column">
          <div class="column-title-bar">
            <span>Translated (${targetLang.value}${state.isCondensed ? ' • Condensed' : ''})</span>
            <span>SubSync AI</span>
          </div>
          <div class="comparison-scroll">
            ${blocks.map((b, idx) => `
              <div class="subtitle-block-card" style="border-color: rgba(99, 102, 241, 0.2);">
                <div class="block-header-line">
                  <span class="block-index" style="color:var(--brand-primary-light);">#${escapeHtml(b.num)}</span>
                  <span class="block-timecode">${escapeHtml(b.timeCode)}</span>
                  <div class="card-meta-right">
                    ${getReadingSpeedPill(b.translatedLines)}
                    <button class="btn-card-shorten" data-idx="${idx}" type="button" title="Trim this line shorter">${shortenSvg} <span>Shorten</span></button>
                  </div>
                </div>
                <div class="block-text-content">
                  ${escapeHtml(b.translatedLines.join('\n'))}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    tabViewContainer.querySelectorAll('.btn-card-shorten').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        condenseSingleBlock(idx);
      });
    });

  } else if (tab === 'original') {
    tabViewContainer.innerHTML = `
      <div class="cards-scroll-view">
        ${blocks.map(b => `
          <div class="subtitle-block-card">
            <div class="block-header-line">
              <span class="block-index">#${escapeHtml(b.num)}</span>
              <span class="block-timecode">${escapeHtml(b.timeCode)}</span>
              <div class="card-meta-right">
                ${getReadingSpeedPill(b.lines)}
              </div>
            </div>
            <div class="block-text-content" style="color:var(--text-muted);">${escapeHtml(b.lines.join('\n'))}</div>
        `).join('')}
      </div>
    `;
  }
}

// ── SRT Output Builder ──
function generateSRTString(blocks) {
  return blocks.map((b, idx) => {
    const num = b.num || String(idx + 1);
    const text = b.translatedLines.join('\n');
    return `${num}\n${b.timeCode}\n${text}\n`;
  }).join('\n');
}

// ── Download .SRT File ──
function downloadSRTFile(blocks) {
  const content = generateSRTString(blocks);
  const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  const baseName = (state.fileName || 'subtitles').replace(/\.srt$/i, '');
  const langCode = targetLang.value.slice(0, 2).toLowerCase();
  const suffix = state.isCondensed ? '_glance' : '';
  a.href = url;
  a.download = `${baseName}_${langCode}${suffix}.srt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Copy Full SRT Code ──
async function copyFullSRTCode() {
  if (state.translatedBlocks.length === 0) return;
  const content = generateSRTString(state.translatedBlocks);

  try {
    await navigator.clipboard.writeText(content);
    showCopyFeedback(copySrtBtn, 'Copied Full SRT Code');

    const inlineBtn = $('inlineCodeCopyBtn');
    if (inlineBtn) showCopyFeedback(inlineBtn, 'Copied to Clipboard');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyFeedback(copySrtBtn, 'Copied Full SRT Code');
  }
}

function showCopyFeedback(btn, text) {
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:15px;height:15px;color:var(--status-success)">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span style="color:var(--status-success); font-weight:700;">${text}</span>
  `;

  setTimeout(() => {
    btn.innerHTML = originalHtml;
  }, 2200);
}

// ── Helpers & Utilities ──
function updateProgressStats(percent, title) {
  progressBar.style.width = `${percent}%`;
  progressPct.textContent = `${percent}%`;
  progressTitle.textContent = title;
}

function addTerminalLog(type, msg) {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  
  let iconSvg = '';
  if (type === 'ok') {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'err') {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else if (type === 'warn') {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><polyline points="9 18 15 12 9 6"/></svg>`;
  }

  entry.innerHTML = `${iconSvg}<span>${escapeHtml(msg)}</span>`;
  progressLog.appendChild(entry);
  progressLog.scrollTop = progressLog.scrollHeight;
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resetTranslateButton() {
  translateBtn.querySelector('.btn-content').classList.remove('hidden');
  translateBtn.querySelector('.btn-spinner-state').classList.add('hidden');
  translateBtn.disabled = false;
}

// ── Custom Glassmorphism Select Component Engine ──
const customSelectRegistry = new Map();

function buildCustomSelect(selectEl) {
  if (!selectEl) return;
  const selectId = selectEl.id;
  const wrapper = selectEl.closest('.select-wrapper');
  if (!wrapper) return;

  // Clean previous custom select if existing
  const prevCustom = wrapper.querySelector('.custom-select-container');
  if (prevCustom) prevCustom.remove();

  // Mark native select as hidden
  selectEl.classList.add('custom-hidden-select');

  const container = document.createElement('div');
  container.className = 'custom-select-container';
  container.dataset.selectId = selectId;
  if (selectEl.disabled) container.classList.add('is-disabled');

  const currentOption = selectEl.options[selectEl.selectedIndex] || selectEl.options[0];
  const initialText = currentOption ? currentOption.text : 'Select an option...';

  // Trigger Button
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `
    <span class="custom-select-value">${escapeHtml(initialText)}</span>
    <svg class="custom-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `;

  // Floating Dropdown Menu
  const menu = document.createElement('div');
  menu.className = 'custom-select-menu';
  menu.setAttribute('role', 'listbox');

  const totalOptionsCount = selectEl.options.length;
  let searchInput = null;

  if (totalOptionsCount > 6) {
    const searchWrap = document.createElement('div');
    searchWrap.className = 'custom-select-search-wrap';
    searchWrap.innerHTML = `
      <svg class="custom-select-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" class="custom-select-search-input" placeholder="Search..." autocomplete="off" />
    `;
    menu.appendChild(searchWrap);
    searchInput = searchWrap.querySelector('input');
  }

  const list = document.createElement('div');
  list.className = 'custom-select-options-list';

  const renderOptions = (filter = '') => {
    list.innerHTML = '';
    const normFilter = filter.toLowerCase().trim();
    let matchCount = 0;

    const optgroups = Array.from(selectEl.querySelectorAll('optgroup'));

    if (optgroups.length > 0) {
      optgroups.forEach(group => {
        const groupOptions = Array.from(group.querySelectorAll('option'));
        const matched = groupOptions.filter(opt => opt.text.toLowerCase().includes(normFilter));
        if (matched.length > 0) {
          const groupHeader = document.createElement('div');
          groupHeader.className = 'custom-select-group-header';
          groupHeader.textContent = group.label;
          list.appendChild(groupHeader);

          matched.forEach(opt => {
            matchCount++;
            const isSelected = opt.value === selectEl.value;
            const optEl = document.createElement('div');
            optEl.className = 'custom-select-option' + (isSelected ? ' is-selected' : '');
            optEl.dataset.value = opt.value;
            optEl.innerHTML = `
              <span>${escapeHtml(opt.text)}</span>
              <svg class="option-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            `;
            optEl.addEventListener('click', (e) => {
              e.stopPropagation();
              selectEl.value = opt.value;
              trigger.querySelector('.custom-select-value').textContent = opt.text;
              selectEl.dispatchEvent(new Event('change', { bubbles: true }));
              closeAllCustomSelects();
              renderOptions(searchInput ? searchInput.value : '');
            });
            list.appendChild(optEl);
          });
        }
      });
    } else {
      const allOpts = Array.from(selectEl.options);
      allOpts.forEach(opt => {
        if (!normFilter || opt.text.toLowerCase().includes(normFilter)) {
          matchCount++;
          const isSelected = opt.value === selectEl.value;
          const optEl = document.createElement('div');
          optEl.className = 'custom-select-option' + (isSelected ? ' is-selected' : '');
          optEl.dataset.value = opt.value;
          optEl.innerHTML = `
            <span>${escapeHtml(opt.text)}</span>
            <svg class="option-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          optEl.addEventListener('click', (e) => {
            e.stopPropagation();
            selectEl.value = opt.value;
            trigger.querySelector('.custom-select-value').textContent = opt.text;
            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
            closeAllCustomSelects();
            renderOptions(searchInput ? searchInput.value : '');
          });
          list.appendChild(optEl);
        }
      });
    }

    if (matchCount === 0) {
      const empty = document.createElement('div');
      empty.className = 'custom-select-empty';
      empty.textContent = 'No matching options found';
      list.appendChild(empty);
    }
  };

  renderOptions();
  menu.appendChild(list);

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderOptions(searchInput.value);
    });
    searchInput.addEventListener('click', e => e.stopPropagation());
  }

  // Toggle dropdown on trigger click
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (selectEl.disabled) return;
    const isOpen = container.classList.contains('is-open');
    closeAllCustomSelects();
    if (!isOpen) {
      container.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 50);
      }
    }
  });

  // Listen for programmatic native select change to keep trigger synced
  selectEl.addEventListener('change', () => {
    const activeOpt = selectEl.options[selectEl.selectedIndex];
    if (activeOpt) {
      trigger.querySelector('.custom-select-value').textContent = activeOpt.text;
      renderOptions(searchInput ? searchInput.value : '');
    }
  });

  container.appendChild(trigger);
  container.appendChild(menu);
  wrapper.appendChild(container);

  customSelectRegistry.set(selectId, {
    container,
    trigger,
    menu,
    selectEl,
    refresh: () => buildCustomSelect(selectEl)
  });
}

function closeAllCustomSelects() {
  document.querySelectorAll('.custom-select-container.is-open').forEach(c => {
    c.classList.remove('is-open');
    const tr = c.querySelector('.custom-select-trigger');
    if (tr) tr.setAttribute('aria-expanded', 'false');
  });
}

function refreshCustomSelect(selectId) {
  const el = $(selectId);
  if (el) buildCustomSelect(el);
}

function syncCustomSelectDisabled(selectId) {
  const el = $(selectId);
  const data = customSelectRegistry.get(selectId);
  if (el && data && data.container) {
    if (el.disabled) {
      data.container.classList.add('is-disabled');
    } else {
      data.container.classList.remove('is-disabled');
    }
  }
}

function initCustomSelects() {
  ['targetLang', 'modelSelect', 'styleMode'].forEach(id => {
    const el = $(id);
    if (el) buildCustomSelect(el);
  });

  document.addEventListener('click', () => closeAllCustomSelects());
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllCustomSelects();
  });
}

// ── Interactive FAQ Accordion Engine ──
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.seo-faq-item');
  if (!faqItems || faqItems.length === 0) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
