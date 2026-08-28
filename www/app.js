// =========================================================
// SubSync AI — Client-Side Multi-AI Subtitle Localization Engine
// =========================================================

// ── Multi-AI Provider Registry ──
const AI_PROVIDERS = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    storageKey: 'gemini_api_key',
    docLink: 'https://aistudio.google.com/app/apikey',
    type: 'gemini',
    defaultModel: 'gemini-2.0-flash',
    models: [
      { id: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash', version: '2.0', inputTokens: 1048576, outputTokens: 8192, rpm: '15 RPM', rpd: '1,500 RPD', desc: 'Fastest & Recommended (Next-Gen)' },
      { id: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash', version: '1.5', inputTokens: 1048576, outputTokens: 8192, rpm: '15 RPM', rpd: '1,500 RPD', desc: 'Stable High-Volume Translation' },
      { id: 'gemini-2.0-flash-lite', displayName: 'Gemini 2.0 Flash Lite', version: '2.0', inputTokens: 1048576, outputTokens: 8192, rpm: '30 RPM', rpd: '1,500 RPD', desc: 'Ultra-Fast Lightweight' },
      { id: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro', version: '1.5', inputTokens: 2097152, outputTokens: 8192, rpm: '2 RPM', rpd: '50 RPD', desc: 'Complex Nuances & Context' }
    ]
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    storageKey: 'groq_api_key',
    docLink: 'https://console.groq.com/keys',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    type: 'openai_compatible',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', displayName: 'Llama 3.3 70B (Versatile)', version: '3.3', inputTokens: 128000, outputTokens: 32768, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'Ultra-Fast & Free (Groq)' },
      { id: 'deepseek-r1-distill-llama-70b', displayName: 'DeepSeek R1 Distill 70B', version: 'R1', inputTokens: 128000, outputTokens: 32768, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'Reasoning Subtitles' },
      { id: 'llama-3.1-8b-instant', displayName: 'Llama 3.1 8B Instant', version: '3.1', inputTokens: 128000, outputTokens: 8192, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'Sub-second Speed' },
      { id: 'mixtral-8x7b-32768', displayName: 'Mixtral 8x7B 32k', version: '8x7B', inputTokens: 32768, outputTokens: 32768, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'High Multilingual Throughput' }
    ]
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    storageKey: 'openrouter_api_key',
    docLink: 'https://openrouter.ai/keys',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    type: 'openai_compatible',
    defaultModel: 'deepseek/deepseek-chat',
    models: [
      { id: 'deepseek/deepseek-chat', displayName: 'DeepSeek V3 (Chat)', version: 'V3', inputTokens: 64000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Top Multilingual Subtitles' },
      { id: 'meta-llama/llama-3.3-70b-instruct', displayName: 'Meta Llama 3.3 70B', version: '3.3', inputTokens: 128000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Natural Dialogue Flow' },
      { id: 'google/gemini-2.0-flash-001', displayName: 'Gemini 2.0 Flash', version: '2.0', inputTokens: 1048576, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Ultra Fast via OpenRouter' },
      { id: 'anthropic/claude-3.5-haiku', displayName: 'Claude 3.5 Haiku', version: '3.5', inputTokens: 200000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Natural Spoken Dubbing' }
    ]
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek Official',
    storageKey: 'deepseek_api_key',
    docLink: 'https://platform.deepseek.com/api_keys',
    endpoint: 'https://api.deepseek.com/chat/completions',
    type: 'openai_compatible',
    defaultModel: 'deepseek-chat',
    models: [
      { id: 'deepseek-chat', displayName: 'DeepSeek V3 (deepseek-chat)', version: 'V3', inputTokens: 64000, outputTokens: 8192, rpm: '60 RPM', rpd: 'Unlimited', desc: 'Official API - Recommended' },
      { id: 'deepseek-reasoner', displayName: 'DeepSeek R1 (deepseek-reasoner)', version: 'R1', inputTokens: 64000, outputTokens: 8192, rpm: '60 RPM', rpd: 'Unlimited', desc: 'Full Reasoning Chain' }
    ]
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    storageKey: 'openai_api_key',
    docLink: 'https://platform.openai.com/api-keys',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    type: 'openai_compatible',
    defaultModel: 'gpt-4o-mini',
    models: [
      { id: 'gpt-4o-mini', displayName: 'GPT-4o Mini', version: '4o-mini', inputTokens: 128000, outputTokens: 16384, rpm: '500 RPM', rpd: 'Unlimited', desc: 'Fast & Precise Subtitles' },
      { id: 'gpt-4o', displayName: 'GPT-4o Full', version: '4o', inputTokens: 128000, outputTokens: 16384, rpm: '500 RPM', rpd: 'Unlimited', desc: 'Flagship Multilingual' }
    ]
  }
};

// ── Translation Quality & Auto-Switch Priority Hierarchy ──
// Ranked by: Dialogue translation naturalness, nuance/slang retention, speed, and rate-limit resilience
const TRANSLATION_MODEL_RANKING = [
  // ── Tier 1: Flagship Quality + Ultra High-Throughput (Top Priority) ──
  { providerId: 'gemini', modelId: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', tier: 'Tier 1 (Flagship)', desc: 'Next-Gen Ultra Fast & 1M Context' },
  { providerId: 'groq', modelId: 'llama-3.3-70b-versatile', name: 'Groq Llama 3.3 70B', tier: 'Tier 1 (Flagship)', desc: '14,400 RPD • 300 tok/s' },
  { providerId: 'deepseek', modelId: 'deepseek-chat', name: 'DeepSeek V3 (Chat)', tier: 'Tier 1 (Flagship)', desc: 'Exceptional Dialogue Slang & Idioms' },
  { providerId: 'openrouter', modelId: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (OpenRouter)', tier: 'Tier 1 (Flagship)', desc: 'Natural Cinematic Dub' },
  { providerId: 'openai', modelId: 'gpt-4o-mini', name: 'GPT-4o Mini', tier: 'Tier 1 (Flagship)', desc: 'Fast & Highly Precise' },
  { providerId: 'gemini', modelId: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tier: 'Tier 1 (Flagship)', desc: 'Stable Google High-Volume' },

  // ── Tier 2: High-Reasoning & Robust Multilingual Workhorses ──
  { providerId: 'gemini', modelId: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', tier: 'Tier 2 (High Speed)', desc: '30 RPM Ultra-Lightweight' },
  { providerId: 'groq', modelId: 'deepseek-r1-distill-llama-70b', name: 'Groq DeepSeek R1 70B', tier: 'Tier 2 (High Reasoning)', desc: 'Complex Metaphor Understanding' },
  { providerId: 'openrouter', modelId: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta Llama 3.3 70B', tier: 'Tier 2 (High Reasoning)', desc: 'Superb Conversational Flow' },
  { providerId: 'openai', modelId: 'gpt-4o', name: 'GPT-4o Flagship', tier: 'Tier 2 (High Reasoning)', desc: 'Maximum Linguistic Precision' },
  { providerId: 'openrouter', modelId: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', tier: 'Tier 2 (High Reasoning)', desc: 'Natural Spoken Dubbing' },

  // ── Tier 3: Emergency Fallback & Specialized Deep Models ──
  { providerId: 'groq', modelId: 'mixtral-8x7b-32768', name: 'Groq Mixtral 8x7B', tier: 'Tier 3 (Fallback)', desc: 'High Multilingual Throughput' },
  { providerId: 'groq', modelId: 'llama-3.1-8b-instant', name: 'Groq Llama 3.1 8B', tier: 'Tier 3 (Fallback)', desc: 'Emergency Speed Fallback' },
  { providerId: 'deepseek', modelId: 'deepseek-reasoner', name: 'DeepSeek R1 Reasoner', tier: 'Tier 3 (Fallback)', desc: 'Deep Reasoning Chain' },
  { providerId: 'gemini', modelId: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tier: 'Tier 3 (Fallback)', desc: 'Pro Reasoning (2 RPM / 50 RPD)' }
];

// Global State
const state = {
  apiKeys: {
    gemini: '',
    groq: '',
    openrouter: '',
    deepseek: '',
    openai: ''
  },
  activeTabProvider: 'gemini',
  autoFailoverEnabled: true,
  providerStatus: {
    gemini: { connected: false, models: [], lastLatency: 0 },
    groq: { connected: false, models: [], lastLatency: 0 },
    openrouter: { connected: false, models: [], lastLatency: 0 },
    deepseek: { connected: false, models: [], lastLatency: 0 },
    openai: { connected: false, models: [], lastLatency: 0 }
  },
  apiKey: '', // Backward compatibility
  availableModels: [],
  selectedModel: 'gemini-2.0-flash',
  activeProvider: 'gemini',
  parsedBlocks: [],       // Array of { num, timeCode, lines: [] }
  translatedBlocks: [],   // Array of { num, timeCode, lines: [], translatedLines: [] }
  uncompressedBlocks: [], // Backup of 1st-pass translation for 1-click restore
  isCondensed: false,
  fileName: '',
  fileSize: 0,
  durationStr: '00:00:00',
  optimalBatchSize: 30,
  isTranslating: false,
  isCondensing: false,
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

// ── Refresh / Leave Prevention (Translation & Condensing) ──
window.addEventListener('beforeunload', e => {
  const isBusy = (state.isTranslating || state.isCondensing) && !state.isCancelled;
  if (isBusy) {
    e.preventDefault();
    const warningMsg = 'Subtitles are currently being processed. If you reload or leave, your ongoing progress will be lost. Are you sure?';
    e.returnValue = warningMsg;
    return warningMsg;
  }
});

// ── Android Native App Integration (Capacitor) ──
function initNativeAppIntegrations() {
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
    console.log('📱 Running inside native Android app via Capacitor.');

    // 1. Android Status Bar Styling
    if (window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar) {
      window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#070a13' }).catch(() => {});
      window.Capacitor.Plugins.StatusBar.setStyle({ style: 'DARK' }).catch(() => {});
    }

    // 2. Hardware Back Button Handling
    if (window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
      window.Capacitor.Plugins.App.addListener('backButton', async () => {
        // If custom modal is open, close it
        if (customModalBackdrop && !customModalBackdrop.classList.contains('hidden')) {
          closeCustomModal(false);
          return;
        }

        // If a dropdown is open, close it
        const openDropdown = document.querySelector('.custom-select-container.is-open');
        if (openDropdown) {
          closeAllCustomSelects();
          return;
        }

        // If translation is currently running, ask before exiting
        if ((state.isTranslating || state.isCondensing) && !state.isCancelled) {
          const confirmed = await showCustomConfirm({
            title: 'Exit App?',
            message: 'Translation is currently in progress. Exiting the app will stop translation. Are you sure you want to exit?',
            confirmText: 'Exit App',
            cancelText: 'Keep Running',
            type: 'warning'
          });
          if (confirmed) {
            state.isCancelled = true;
            window.Capacitor.Plugins.App.exitApp();
          }
          return;
        }

        // Default: exit app
        window.Capacitor.Plugins.App.exitApp();
      });
    }
  }
}

// ── Screen WakeLock & Full-Power Background Execution Engine ──
let wakeLock = null;
let backgroundAudioCtx = null;
let backgroundAudioOsc = null;

async function acquireWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
      console.log('⚡ Screen WakeLock active: Device will stay awake during translation.');
    }
  } catch (err) {
    console.warn('Wake Lock request error:', err);
  }
}

function releaseWakeLock() {
  try {
    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
      console.log('💤 Screen WakeLock released.');
    }
  } catch (err) {}
}

function startBackgroundKeepAlive() {
  // 1. Request Screen WakeLock
  acquireWakeLock();

  // 2. Start silent audio loop to signal Android Media Framework and prevent background CPU throttling
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      if (!backgroundAudioCtx) {
        backgroundAudioCtx = new AudioContextClass();
        const gainNode = backgroundAudioCtx.createGain();
        gainNode.gain.value = 0.00001; // completely inaudible
        gainNode.connect(backgroundAudioCtx.destination);

        const osc = backgroundAudioCtx.createOscillator();
        osc.frequency.value = 35; // subsonic inaudible frequency
        osc.connect(gainNode);
        osc.start();
        backgroundAudioOsc = osc;
      } else if (backgroundAudioCtx.state === 'suspended') {
        backgroundAudioCtx.resume();
      }
    }
  } catch (e) {
    console.warn('Silent audio keep-alive setup:', e);
  }
}

function stopBackgroundKeepAlive() {
  releaseWakeLock();
  try {
    if (backgroundAudioOsc) {
      backgroundAudioOsc.stop();
      backgroundAudioOsc.disconnect();
      backgroundAudioOsc = null;
    }
    if (backgroundAudioCtx) {
      backgroundAudioCtx.close();
      backgroundAudioCtx = null;
    }
  } catch (e) {}
}

// Re-acquire WakeLock on app resume if active
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && (state.isTranslating || state.isCondensing)) {
    acquireWakeLock();
  }
});

// ── Initialization ──
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomSelects();
  initFaqAccordion();
  initSeoGuideToggle();
  initMultiProviderHub();
  setupEventListeners();
  checkReadyToTranslate();
  restoreSessionIfAvailable();
  initNativeAppIntegrations();
});

// ── Multi-AI Provider Engine & State Manager ──
function switchProviderTab(providerId) {
  state.activeTabProvider = providerId;
  
  // Update Tab buttons
  document.querySelectorAll('.provider-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.provider === providerId);
  });

  // Update Panels
  document.querySelectorAll('.provider-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel_${providerId}`);
  });
}

function initMultiProviderHub() {
  // Load Auto-Failover setting
  const savedFailover = localStorage.getItem('auto_failover_enabled');
  state.autoFailoverEnabled = savedFailover !== 'false';
  const autoFailoverToggle = $('autoFailoverToggle');
  if (autoFailoverToggle) {
    autoFailoverToggle.checked = state.autoFailoverEnabled;
  }

  // Load saved keys for each provider
  let atLeastOneConnected = false;
  ['gemini', 'groq', 'openrouter', 'deepseek', 'openai'].forEach(pid => {
    const pConf = AI_PROVIDERS[pid];
    const savedKey = (localStorage.getItem(pConf.storageKey) || '').trim();
    if (savedKey) {
      state.apiKeys[pid] = savedKey;
      if (pid === 'gemini') {
        state.apiKey = savedKey;
        if (apiKeyInput) apiKeyInput.value = savedKey;
      } else {
        const inp = $(`apiKeyInput_${pid}`);
        if (inp) inp.value = savedKey;
      }
      showProviderFeedback(pid, 'Stored key loaded. Verifying...', 'ok');
      verifyAndLoadProvider(pid, savedKey);
      atLeastOneConnected = true;
    } else {
      updateProviderStatusUI(pid, false);
    }
  });

  if (!atLeastOneConnected) {
    resetQuotaDashboardToDisconnected('No API Key');
    populateCombinedModelDropdown();
  }
}

async function handleSaveProviderKey(providerId) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) return;

  const inp = providerId === 'gemini' ? apiKeyInput : $(`apiKeyInput_${providerId}`);
  const saveBtn = providerId === 'gemini' ? saveApiKey : $(`saveApiKey_${providerId}`);
  if (!inp) return;

  const rawKey = inp.value.trim().replace(/^["']|["']$/g, '');

  if (!rawKey || rawKey.length < 5) {
    showProviderFeedback(providerId, `Please enter a valid ${pConf.name} API Key.`, 'err');
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>Verifying...</span>';
  }
  showProviderFeedback(providerId, `Connecting & verifying with ${pConf.name}...`, 'ok');

  try {
    await verifyAndLoadProvider(providerId, rawKey);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>Connect ${pConf.name}</span>`;
    }
  }
}

async function verifyAndLoadProvider(providerId, key) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf || !key) return;

  const startTime = performance.now();

  try {
    let loadedModels = [];
    let probeMs = 0;

    if (providerId === 'gemini') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      probeMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}: Invalid Gemini API Key or access denied.`);
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.models) || data.models.length === 0) {
        throw new Error('No active models returned by Google Gemini API.');
      }

      const textModels = data.models.filter(m => {
        const id = m.name.replace(/^models\//, '').toLowerCase();
        const hasGenContent = Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent');
        if (!hasGenContent || !id.startsWith('gemini')) return false;
        const nonText = ['tts', 'banana', 'nano', 'robotics', 'transcribe', 'clip', 'deep-research', 'embedding', 'embed', 'imagen', 'image', 'audio', 'realtime', 'gemini-2.5', 'gemini-3.6'];
        return !nonText.some(t => id.includes(t));
      });

      if (textModels.length === 0) {
        throw new Error('No compatible translation models available for this Gemini API Key.');
      }

      // Sort with gemini-2.0-flash and gemini-1.5-flash at top
      textModels.sort((a, b) => {
        const idA = a.name.replace(/^models\//, '').toLowerCase();
        const idB = b.name.replace(/^models\//, '').toLowerCase();
        if (idA === 'gemini-2.0-flash') return -1;
        if (idB === 'gemini-2.0-flash') return 1;
        if (idA === 'gemini-1.5-flash') return -1;
        if (idB === 'gemini-1.5-flash') return 1;
        if (idA === 'gemini-2.0-flash-lite') return -1;
        if (idB === 'gemini-2.0-flash-lite') return 1;
        return idA.localeCompare(idB);
      });

      loadedModels = textModels.map(m => {
        const id = m.name.replace(/^models\//, '');
        const isPro = id.includes('pro');
        return {
          id,
          displayName: m.displayName || id,
          version: m.version || (id.includes('2.0') ? '2.0' : '1.5'),
          inputTokens: m.inputTokenLimit || 1048576,
          outputTokens: m.outputTokenLimit || 8192,
          rpm: isPro ? '2 RPM' : '15 RPM',
          rpd: isPro ? '50 RPD' : '1,500 RPD',
          desc: m.description || (isPro ? 'Pro Deep Reasoning' : 'Fast Production Model'),
          providerId: 'gemini',
          livePingMs: probeMs
        };
      });

      state.apiKeys.gemini = key;
      state.apiKey = key;
      localStorage.setItem('gemini_api_key', key);

      // Auto-select the top live model if current selection is not in loaded models
      if (!loadedModels.some(m => m.id === state.selectedModel)) {
        state.selectedModel = loadedModels[0].id;
      }
    } else if (providerId === 'groq') {
      // Real-time live Groq models endpoint
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      probeMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}: Invalid Groq API Key.`);
      }

      const data = await res.json();
      const rawList = Array.isArray(data?.data) ? data.data : [];
      
      // Filter active text/chat models and exclude whisper/audio/vision
      const validGroq = rawList.filter(m => {
        const id = (m.id || '').toLowerCase();
        if (m.active === false) return false;
        if (id.includes('whisper') || id.includes('audio') || id.includes('vision') || id.includes('guard') || id.includes('tts')) return false;
        return true;
      });

      if (validGroq.length === 0) {
        throw new Error('No active chat models returned by Groq API.');
      }

      loadedModels = validGroq.map(m => {
        const id = m.id;
        const lower = id.toLowerCase();
        let display = id;
        let rpm = '30 RPM';
        let rpd = '14,400 RPD';
        let desc = 'Groq Cloud LPU Acceleration';

        if (lower.includes('llama-3.3-70b')) {
          display = 'Llama 3.3 70B (Versatile)';
          desc = 'Top Flagship Translation • 300 tok/s';
        } else if (lower.includes('deepseek-r1')) {
          display = 'DeepSeek R1 Distill 70B';
          desc = 'High Reasoning Subtitle Translation';
        } else if (lower.includes('llama-3.1-8b')) {
          display = 'Llama 3.1 8B Instant';
          desc = 'Sub-second Ultra Speed';
        } else if (lower.includes('mixtral')) {
          display = 'Mixtral 8x7B (32k)';
          desc = 'Multilingual MoE Throughput';
        } else if (lower.includes('gemma')) {
          display = `Gemma 2 (${id})`;
          desc = 'Google Gemma on Groq';
        }

        return {
          id,
          displayName: display,
          version: m.owned_by || 'Groq',
          inputTokens: m.context_window || 128000,
          outputTokens: 32768,
          rpm,
          rpd,
          desc,
          providerId: 'groq',
          livePingMs: probeMs
        };
      });

      state.apiKeys.groq = key;
      localStorage.setItem('groq_api_key', key);
    } else if (providerId === 'openrouter') {
      // Real-time live OpenRouter models endpoint
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      probeMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}: Invalid OpenRouter API Key.`);
      }

      const data = await res.json();
      const rawList = Array.isArray(data?.data) ? data.data : [];

      // Filter for top translation-capable models on OpenRouter
      const desiredPrefixes = ['deepseek/', 'meta-llama/', 'google/', 'anthropic/', 'qwen/', 'mistralai/'];
      const candidateModels = rawList.filter(m => {
        const id = (m.id || '').toLowerCase();
        if (id.includes('free') && !id.includes(':free')) return true;
        return desiredPrefixes.some(p => id.startsWith(p)) && !id.includes('embed') && !id.includes('vision') && !id.includes('image');
      });

      const selectedOpenRouter = candidateModels.slice(0, 12);
      if (selectedOpenRouter.length === 0) {
        throw new Error('Could not fetch models from OpenRouter.');
      }

      loadedModels = selectedOpenRouter.map(m => ({
        id: m.id,
        displayName: m.name || m.id,
        version: 'OpenRouter',
        inputTokens: m.context_length || 64000,
        outputTokens: m.top_provider?.max_completion_tokens || 8192,
        rpm: 'Dynamic',
        rpd: 'Unlimited (Pay-As-You-Go/Free)',
        desc: m.description ? m.description.slice(0, 60) + '...' : 'OpenRouter Multilingual Engine',
        providerId: 'openrouter',
        livePingMs: probeMs
      }));

      state.apiKeys.openrouter = key;
      localStorage.setItem('openrouter_api_key', key);
    } else if (providerId === 'deepseek') {
      // Real-time live DeepSeek models endpoint
      const res = await fetch('https://api.deepseek.com/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      probeMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}: Invalid DeepSeek API Key.`);
      }

      const data = await res.json();
      const rawList = Array.isArray(data?.data) ? data.data : [];

      if (rawList.length === 0) {
        throw new Error('No models found in DeepSeek API account.');
      }

      loadedModels = rawList.map(m => {
        const id = m.id;
        const isReasoner = id.includes('reasoner');
        return {
          id,
          displayName: isReasoner ? 'DeepSeek Reasoner (R1)' : 'DeepSeek V3 (deepseek-chat)',
          version: isReasoner ? 'R1' : 'V3',
          inputTokens: 64000,
          outputTokens: 8192,
          rpm: '60 RPM',
          rpd: 'Unlimited',
          desc: isReasoner ? 'Deep Chain-of-Thought Reasoning' : 'Top Slang & Dialogue Translation',
          providerId: 'deepseek',
          livePingMs: probeMs
        };
      });

      state.apiKeys.deepseek = key;
      localStorage.setItem('deepseek_api_key', key);
    } else if (providerId === 'openai') {
      // Real-time live OpenAI models endpoint
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      probeMs = Math.round(performance.now() - startTime);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}: Invalid OpenAI API Key.`);
      }

      const data = await res.json();
      const rawList = Array.isArray(data?.data) ? data.data : [];

      // Filter for GPT-4o, GPT-4o-mini, GPT-4 chat models
      const chatGptModels = rawList.filter(m => {
        const id = (m.id || '').toLowerCase();
        return id.startsWith('gpt-4o') || id.startsWith('gpt-4') || id.startsWith('gpt-3.5-turbo');
      });

      if (chatGptModels.length === 0) {
        throw new Error('No chat completion models accessible for this OpenAI key.');
      }

      // Sort with gpt-4o-mini and gpt-4o first
      chatGptModels.sort((a, b) => {
        const idA = a.id.toLowerCase();
        const idB = b.id.toLowerCase();
        if (idA === 'gpt-4o-mini') return -1;
        if (idB === 'gpt-4o-mini') return 1;
        if (idA === 'gpt-4o') return -1;
        if (idB === 'gpt-4o') return 1;
        return idA.localeCompare(idB);
      });

      loadedModels = chatGptModels.slice(0, 6).map(m => ({
        id: m.id,
        displayName: m.id === 'gpt-4o-mini' ? 'GPT-4o Mini' : m.id === 'gpt-4o' ? 'GPT-4o Flagship' : m.id,
        version: 'OpenAI',
        inputTokens: 128000,
        outputTokens: 16384,
        rpm: '500 RPM',
        rpd: 'Unlimited',
        desc: m.id.includes('mini') ? 'Fast, Low-Cost & Highly Accurate' : 'Flagship Multilingual Standard',
        providerId: 'openai',
        livePingMs: probeMs
      }));

      state.apiKeys.openai = key;
      localStorage.setItem('openai_api_key', key);
    }

    state.providerStatus[providerId] = {
      connected: true,
      models: loadedModels,
      lastLatency: probeMs
    };

    showProviderFeedback(providerId, `Connected! ${loadedModels.length} live models verified (Ping: ${probeMs}ms).`, 'ok');
    updateProviderStatusUI(providerId, true, `${loadedModels.length} models, ${probeMs}ms`);

    populateCombinedModelDropdown();
    updateQuotaDashboardForActiveModel();
    checkReadyToTranslate();
  } catch (err) {
    console.warn(`Error verifying ${pConf.name}:`, err);
    state.providerStatus[providerId] = { connected: false, models: [], lastLatency: 0 };
    showProviderFeedback(providerId, `${pConf.name} Error: ${err.message}`, 'err');
    updateProviderStatusUI(providerId, false);
    populateCombinedModelDropdown();
    checkReadyToTranslate();
  }
}

function updateProviderStatusUI(providerId, isConnected, extraText = '') {
  const dot = $(`statusDot_${providerId}`);
  const chip = $(`chip_${providerId}`);
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) return;

  if (dot) {
    dot.className = `provider-status-dot ${isConnected ? 'dot-connected' : 'dot-off'}`;
    dot.title = isConnected ? `Connected (${extraText})` : 'Not Configured';
  }

  if (chip) {
    if (isConnected) {
      chip.className = 'provider-chip is-active-chip';
      chip.textContent = `${pConf.name}: Active`;
    } else {
      chip.className = 'provider-chip';
      chip.textContent = `${pConf.name}: Off`;
    }
  }
}

function showProviderFeedback(providerId, msg, type) {
  const feedbackDiv = providerId === 'gemini' ? apiStatus : $(`apiStatus_${providerId}`);
  if (!feedbackDiv) return;

  const icon = type === 'ok'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:6px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  feedbackDiv.innerHTML = `${icon}<span>${escapeHtml(msg)}</span>`;
  feedbackDiv.className = 'api-feedback ' + type;
}

function populateCombinedModelDropdown() {
  if (!modelSelect) return;
  modelSelect.innerHTML = '';

  const connectedProviders = Object.keys(AI_PROVIDERS).filter(pid => state.providerStatus[pid]?.connected);

  if (connectedProviders.length === 0) {
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="" disabled selected>Connect at least one AI Provider (Gemini, Groq, DeepSeek, etc.) above...</option>';
    if (modelLiveBadge) {
      modelLiveBadge.textContent = 'Awaiting API Key';
      modelLiveBadge.className = 'hint-tag';
    }
    syncCustomSelectDisabled('modelSelect');
    refreshCustomSelect('modelSelect');
    return;
  }

  let totalModelsCount = 0;
  let firstModelValue = null;

  // Sort connected providers by tier recommendation (Gemini, Groq, DeepSeek, OpenRouter, OpenAI)
  const providerOrder = ['gemini', 'groq', 'deepseek', 'openrouter', 'openai'];
  const sortedConnectedProviders = connectedProviders.sort((a, b) => providerOrder.indexOf(a) - providerOrder.indexOf(b));

  sortedConnectedProviders.forEach(pid => {
    const pConf = AI_PROVIDERS[pid];
    const pModels = [...(state.providerStatus[pid]?.models || [])];
    totalModelsCount += pModels.length;

    // Dynamically sort models within each provider based on TRANSLATION_MODEL_RANKING
    pModels.sort((a, b) => {
      const idxA = TRANSLATION_MODEL_RANKING.findIndex(r => r.providerId === pid && (r.modelId === a.id || a.id.includes(r.modelId)));
      const idxB = TRANSLATION_MODEL_RANKING.findIndex(r => r.providerId === pid && (r.modelId === b.id || b.id.includes(r.modelId)));
      const rankA = idxA === -1 ? 999 : idxA;
      const rankB = idxB === -1 ? 999 : idxB;
      return rankA - rankB;
    });

    const ping = state.providerStatus[pid]?.lastLatency ? ` • ${state.providerStatus[pid].lastLatency}ms ping` : '';
    const optgroup = document.createElement('optgroup');
    optgroup.label = `${pConf.name} (${pModels.length} live models${ping})`;

    pModels.forEach((m, idx) => {
      const opt = document.createElement('option');
      opt.value = m.id;
      const isTopPick = idx === 0;
      opt.textContent = `[${pConf.name}] ${m.displayName || m.id}${isTopPick ? ' — Top Recommendation' : ''}`;
      if (!firstModelValue) firstModelValue = m.id;
      optgroup.appendChild(opt);
    });

    modelSelect.appendChild(optgroup);
  });

  modelSelect.disabled = false;
  
  // Restore previously selected model or pick the first connected model
  const existingSelection = state.selectedModel;
  const isExistingValid = Array.from(modelSelect.options).some(o => o.value === existingSelection);
  if (isExistingValid) {
    modelSelect.value = existingSelection;
  } else if (firstModelValue) {
    modelSelect.value = firstModelValue;
    state.selectedModel = firstModelValue;
  }

  if (modelLiveBadge) {
    modelLiveBadge.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:11px;height:11px;display:inline-block;margin-right:4px;vertical-align:-1px;">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>${totalModelsCount} Live Models Verified (${connectedProviders.length} Providers)</span>
    `;
    modelLiveBadge.className = 'hint-tag active-tag';
  }

  syncCustomSelectDisabled('modelSelect');
  refreshCustomSelect('modelSelect');
  updateQuotaDashboardForActiveModel();
}

// Dynamic Model Failure & Cooldown Tracker
const modelHealthTracker = {
  failures: new Map(),

  recordFailure(providerId, modelId, isPermanent, error) {
    const key = `${providerId}:${(modelId || '').replace(/^models\//, '')}`.toLowerCase();
    this.failures.set(key, {
      failedAt: Date.now(),
      isPermanent: !!isPermanent,
      error: error || 'Unknown failure'
    });
  },

  isAvailable(providerId, modelId) {
    const key = `${providerId}:${(modelId || '').replace(/^models\//, '')}`.toLowerCase();
    const entry = this.failures.get(key);
    if (!entry) return true;
    if (entry.isPermanent) return false;
    // 5-minute cooldown for temporary 429 rate limit or 503 overload
    if (Date.now() - entry.failedAt < 300000) {
      return false;
    }
    this.failures.delete(key);
    return true;
  },

  reset() {
    this.failures.clear();
  }
};

function getActiveProviderAndKey(modelId) {
  const targetModel = modelId || (modelSelect && modelSelect.value ? modelSelect.value : '') || state.selectedModel || 'gemini-2.0-flash';
  const cleanModel = targetModel.replace(/^models\//, '').trim();

  // 1. Check live model lists from connected providers first
  for (const pid of ['gemini', 'groq', 'deepseek', 'openrouter', 'openai']) {
    const list = state.providerStatus[pid]?.models;
    if (Array.isArray(list) && list.some(m => m.id === cleanModel || m.id === targetModel || m.id?.replace(/^models\//, '') === cleanModel)) {
      return { providerId: pid, model: cleanModel, key: state.apiKeys[pid] };
    }
  }

  // 2. Explicit provider identification by model prefix/pattern
  if (cleanModel.startsWith('gemini')) {
    return { providerId: 'gemini', model: cleanModel, key: state.apiKeys.gemini };
  }
  if (cleanModel.startsWith('llama-') || cleanModel.startsWith('deepseek-r1-distill') || cleanModel.startsWith('mixtral-') || cleanModel.startsWith('gemma') || cleanModel.startsWith('qwen')) {
    return { providerId: 'groq', model: cleanModel, key: state.apiKeys.groq };
  }
  if (cleanModel.includes('/') || cleanModel.startsWith('anthropic/') || cleanModel.startsWith('meta-llama/')) {
    return { providerId: 'openrouter', model: cleanModel, key: state.apiKeys.openrouter };
  }
  if (cleanModel === 'deepseek-chat' || cleanModel === 'deepseek-reasoner') {
    if (state.apiKeys.deepseek) {
      return { providerId: 'deepseek', model: cleanModel, key: state.apiKeys.deepseek };
    }
    return { providerId: 'openrouter', model: `deepseek/${cleanModel}`, key: state.apiKeys.openrouter };
  }
  if (cleanModel.startsWith('gpt-') || cleanModel.startsWith('o1') || cleanModel.startsWith('o3')) {
    return { providerId: 'openai', model: cleanModel, key: state.apiKeys.openai };
  }

  // 3. Fallback to first available connected provider
  for (const pid of ['gemini', 'groq', 'deepseek', 'openrouter', 'openai']) {
    if (state.apiKeys[pid] && state.providerStatus[pid]?.connected) {
      return { providerId: pid, model: AI_PROVIDERS[pid].defaultModel, key: state.apiKeys[pid] };
    }
  }

  return { providerId: 'gemini', model: 'gemini-2.0-flash', key: state.apiKeys.gemini || '' };
}

function findFailoverBackup(currentProviderId, currentModelId) {
  if (!state.autoFailoverEnabled) return null;

  function isValid(pid, mid) {
    if (!state.apiKeys[pid] || !state.providerStatus[pid]?.connected) return false;
    if (!modelHealthTracker.isAvailable(pid, mid)) return false;
    return true;
  }

  // 1. Primary Search: Top-ranked model from a DIFFERENT connected provider
  for (const entry of TRANSLATION_MODEL_RANKING) {
    const pid = entry.providerId;
    const mid = entry.modelId;

    if (pid === currentProviderId) continue;

    if (isValid(pid, mid)) {
      return {
        providerId: pid,
        providerName: AI_PROVIDERS[pid]?.name || pid,
        model: mid,
        modelName: entry.name,
        tier: entry.tier,
        desc: entry.desc,
        key: state.apiKeys[pid]
      };
    }
  }

  // 2. Secondary Search: Any live connected model from other providers
  for (const pid of ['gemini', 'groq', 'deepseek', 'openrouter', 'openai']) {
    if (pid === currentProviderId) continue;
    if (!state.apiKeys[pid] || !state.providerStatus[pid]?.connected) continue;

    const liveModels = state.providerStatus[pid]?.models || AI_PROVIDERS[pid]?.models || [];
    for (const m of liveModels) {
      const mid = m.id;
      if (isValid(pid, mid)) {
        return {
          providerId: pid,
          providerName: AI_PROVIDERS[pid]?.name || pid,
          model: mid,
          modelName: m.displayName || m.name || mid,
          tier: 'Live Model Backup',
          desc: m.desc || 'Available Connected Model',
          key: state.apiKeys[pid]
        };
      }
    }
  }

  // 3. Tertiary Fallback: Different working model within the SAME connected provider
  const sameModels = state.providerStatus[currentProviderId]?.models || AI_PROVIDERS[currentProviderId]?.models || [];
  for (const m of sameModels) {
    const mid = m.id;
    if (mid !== currentModelId && isValid(currentProviderId, mid)) {
      return {
        providerId: currentProviderId,
        providerName: AI_PROVIDERS[currentProviderId]?.name || currentProviderId,
        model: mid,
        modelName: m.displayName || m.name || mid,
        tier: 'Alternative Same-Provider Model',
        desc: m.desc || 'Alternative Model',
        key: state.apiKeys[currentProviderId]
      };
    }
  }

  return null;
}

function updateQuotaDashboardForActiveModel() {
  const modelToInspect = (modelSelect && modelSelect.value ? modelSelect.value : state.selectedModel) || 'gemini-2.0-flash';
  const { providerId, model } = getActiveProviderAndKey(modelToInspect);
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) return;

  const toggleBtn = $('toggleQuotaBtn');
  if (toggleBtn) toggleBtn.classList.remove('hidden');

  const modelsList = state.providerStatus[providerId]?.models || pConf.models;
  const mObj = modelsList.find(m => m.id === model) || modelsList[0];

  const qName = $('quotaModelName');
  const qVer = $('quotaModelVersion');
  const qContext = $('quotaContext');
  const qOut = $('quotaOutputTokens');
  const qRpm = $('quotaRpm');
  const qRpd = $('quotaRpd');

  if (qName) qName.textContent = `[${pConf.name}] ${mObj?.displayName || model}`;
  if (qVer) qVer.textContent = `${pConf.name} • Live Verified`;
  if (qContext) qContext.textContent = mObj?.inputTokens ? `${Number(mObj.inputTokens).toLocaleString()} Tokens` : '128,000 Tokens';
  if (qOut) qOut.textContent = mObj?.outputTokens ? `${Number(mObj.outputTokens).toLocaleString()} Tokens` : '8,192 Tokens';
  if (qRpm) qRpm.textContent = mObj?.rpm || 'Dynamic';
  if (qRpd) qRpd.textContent = mObj?.rpd || 'Unlimited';

  updateApiHealthUI('optimal', `Active AI: ${pConf.name}`);
}

// ── Automatic Live Model Fetcher ──
function resetQuotaDashboardToDisconnected(errMsg = '') {
  const toggleBtn = $('toggleQuotaBtn');
  const dashboard = $('apiQuotaDashboard');
  if (dashboard) dashboard.classList.add('hidden');
  if (toggleBtn) {
    toggleBtn.classList.remove('active');
  }

  const qName = $('quotaModelName');
  const qVer = $('quotaModelVersion');
  const qContext = $('quotaContext');
  const qOut = $('quotaOutputTokens');
  const qRpm = $('quotaRpm');
  const qRpd = $('quotaRpd');
  const latencyVal = $('quotaSessionLatency');

  if (qName) qName.textContent = '— (Disconnected)';
  if (qVer) qVer.textContent = errMsg ? 'Auth Error' : 'Awaiting API Key';
  if (qContext) qContext.textContent = '—';
  if (qOut) qOut.textContent = '—';
  if (qRpm) qRpm.textContent = '—';
  if (qRpd) qRpd.textContent = '—';
  if (latencyVal) latencyVal.textContent = errMsg ? 'Ping: Error' : 'Last Latency: —';

  const isNoKey = !errMsg || errMsg === 'No API Key';
  updateApiHealthUI(
    isNoKey ? 'disconnected' : 'exhausted',
    isNoKey ? 'Awaiting API Key' : `API Error: ${errMsg.slice(0, 32)}`
  );
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
    text.textContent = customMessage || 'Awaiting API Key';
  }
}

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

  state.translatedBlocks = [];
  state.uncompressedBlocks = [];
  state.isCondensed = false;
  clearSavedSession();

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
  // Modal dialog listeners
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', () => closeCustomModal(false));
  if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', () => closeCustomModal(true));
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
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

  // Multi-Provider Tab Buttons
  document.querySelectorAll('.provider-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchProviderTab(btn.dataset.provider));
  });

  // Auto-Failover Switch
  const autoFailoverToggle = $('autoFailoverToggle');
  if (autoFailoverToggle) {
    autoFailoverToggle.addEventListener('change', e => {
      state.autoFailoverEnabled = e.target.checked;
      localStorage.setItem('auto_failover_enabled', e.target.checked ? 'true' : 'false');
    });
  }

  // Provider Inputs & Save Buttons
  ['gemini', 'groq', 'openrouter', 'deepseek', 'openai'].forEach(pid => {
    const input = pid === 'gemini' ? apiKeyInput : $(`apiKeyInput_${pid}`);
    const saveBtn = pid === 'gemini' ? saveApiKey : $(`saveApiKey_${pid}`);
    const eyeBtn = pid === 'gemini' ? toggleApiKey : $(`toggleApiKey_${pid}`);

    if (saveBtn) saveBtn.addEventListener('click', () => handleSaveProviderKey(pid));
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveProviderKey(pid);
        }
      });
    }
    if (eyeBtn && input) {
      eyeBtn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
      });
    }
  });

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
      const isProcessing = state.isTranslating || state.isCondensing;
      const modalMessage = isProcessing
        ? 'Translation is currently in progress. Removing this file will immediately stop and abort the translation process. Are you sure?'
        : 'Are you sure you want to remove this file? Any existing translations and saved session data will be permanently cleared.';

      const confirmed = await showCustomConfirm({
        title: isProcessing ? 'Stop & Remove File?' : 'Remove Subtitle File?',
        message: modalMessage,
        confirmText: isProcessing ? 'Stop & Remove' : 'Yes, Remove File',
        cancelText: isProcessing ? 'Keep Translating' : 'Keep File',
        type: 'danger'
      });
      if (!confirmed) return;

      // 1. Immediately abort active background translation / condense loops
      state.isCancelled = true;
      state.isPaused = false;
      state.isTranslating = false;
      state.isCondensing = false;

      // 2. Clear all subtitle data
      state.parsedBlocks = [];
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      state.isCondensed = false;
      state.fileName = '';
      state.fileSize = 0;

      // 3. Reset UI cards
      if (fileInput) fileInput.value = '';
      if (fileInfo) fileInfo.classList.add('hidden');
      if (dropZone) dropZone.classList.remove('hidden');
      if (progressCard) progressCard.classList.add('hidden');
      if (resultCard) resultCard.classList.add('hidden');
      if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');
      if (incompleteWarningBanner) incompleteWarningBanner.classList.add('hidden');

      // 4. Reset controls and session storage
      clearSavedSession();
      resetTranslateButton();
      checkReadyToTranslate();
      addTerminalLog('warn', 'Subtitle file removed. Ongoing translation was aborted.');
    });
  }

  // Start Translation
  if (translateBtn) translateBtn.addEventListener('click', runTranslationPipeline);
  if (pauseResumeBtn) pauseResumeBtn.addEventListener('click', togglePauseTranslation);
  if (cancelTranslateBtn) cancelTranslateBtn.addEventListener('click', cancelTranslationProcess);

  // Retranslate
  if (retranslateBtn) {
    retranslateBtn.addEventListener('click', async () => {
      const confirmed = await showCustomConfirm({
        title: 'Retranslate Subtitles?',
        message: 'This will reset current translations and re-translate from the beginning.',
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
  if (retryIncompleteBtn) retryIncompleteBtn.addEventListener('click', retryIncompleteBatchesPipeline);

  // AI Condenser (2nd-Pass Refinement)
  if (condenseSrtBtn) condenseSrtBtn.addEventListener('click', runAiCondensePipeline);

  // Restore Original Uncompressed Translation
  if (restoreOriginalBtn) restoreOriginalBtn.addEventListener('click', restoreOriginalTranslation);

  // Download Action
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (state.translatedBlocks.length > 0) downloadSRTFile(state.translatedBlocks);
    });
  }

  // Copy Action
  if (copySrtBtn) copySrtBtn.addEventListener('click', copyFullSRTCode);

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
      updateQuotaDashboardForActiveModel();
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
        if (toggleQuotaText) toggleQuotaText.textContent = 'Hide Model Specs & Health';
      } else {
        quotaDashboard.classList.add('hidden');
        toggleQuotaBtn.classList.remove('active');
        if (toggleQuotaText) toggleQuotaText.textContent = 'Live Model Specs & Health';
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
  const rawChunks = clean.trim().split(/\n\s*\n+/);
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
  const connectedKeys = Object.values(state.apiKeys).filter(k => k && k.length > 4);
  const hasKey = connectedKeys.length > 0;

  translateBtn.disabled = !(hasFile && hasKey);

  if (!hasKey) {
    ctaHint.textContent = 'Please enter & connect at least one AI Provider (Gemini, Groq, DeepSeek, OpenRouter, OpenAI) above.';
  } else if (!hasFile) {
    ctaHint.textContent = 'Please upload an SRT subtitle file above.';
  } else {
    const { providerId } = getActiveProviderAndKey();
    const pName = AI_PROVIDERS[providerId]?.name || 'AI';
    ctaHint.textContent = `Ready! Click the button above to translate ${state.parsedBlocks.length} subtitles into ${targetLang.value} using [${pName}].`;
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

  // 1. Strip reasoning thoughts (<think>...</think>), markdown fences, and trailing noise
  let clean = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^```json\s*/im, '')
    .replace(/^```\s*/im, '')
    .replace(/```\s*$/m, '')
    .trim();

  // 2. Direct Parse Attempt
  try {
    const direct = JSON.parse(clean);
    if (Array.isArray(direct)) return direct;
    if (direct && typeof direct === 'object') {
      const arr = direct.subtitles || direct.items || direct.translations || direct.results || direct.data || direct.response || direct.dialogues || Object.values(direct).find(Array.isArray);
      if (Array.isArray(arr)) return arr;

      const entries = Object.entries(direct);
      if (entries.length > 0 && entries.every(([k]) => !isNaN(parseInt(k, 10)))) {
        return entries.map(([k, v]) => {
          if (typeof v === 'string') return { id: parseInt(k, 10), text: v };
          if (v && typeof v === 'object') return { id: v.id !== undefined ? v.id : parseInt(k, 10), text: v.text || v.translation || Object.values(v)[0] };
          return { id: parseInt(k, 10), text: String(v) };
        });
      }
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
      const arr = parsed.subtitles || parsed.items || parsed.translations || parsed.results || parsed.data || Object.values(parsed).find(Array.isArray);
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

// ── Universal Translation-to-Batch Matcher (Prevents Subtitle Shifting or Misalignment) ──
function matchTranslationsToBatch(batch, parsedArray) {
  if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
    return batch.map(b => ({
      ...b,
      translatedLines: b.lines,
      isTranslated: false
    }));
  }

  // 1. Detect ID scheme used by the AI model
  const hasZero = parsedArray.some(item => item && (item.id === 0 || item.id === '0'));
  const hasOriginalNums = batch.length > 0 && parsedArray.some(item => item && (item.id === batch[0].num || item.id === String(batch[0].num)));
  const isOneIndexed = !hasZero && !hasOriginalNums && parsedArray.some(item => item && (item.id === 1 || item.id === '1'));

  return batch.map((originalBlock, idx) => {
    let matched = null;

    if (hasOriginalNums) {
      matched = parsedArray.find(item => item && (item.id === originalBlock.num || item.id === String(originalBlock.num)));
    } else if (isOneIndexed) {
      matched = parsedArray.find(item => item && (item.id === idx + 1 || item.id === String(idx + 1)));
    } else {
      matched = parsedArray.find(item => item && (item.id === idx || item.id === String(idx)));
    }

    // Fallback if model output an array without id properties
    if (!matched && parsedArray.length === batch.length && !parsedArray.some(it => it && it.id !== undefined)) {
      matched = parsedArray[idx];
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

// ── Translation Pipeline ──
async function runTranslationPipeline() {
  const { providerId, model: initialModel, key: activeKey } = getActiveProviderAndKey();
  if (!activeKey) {
    alert('Please enter and connect at least one AI API Key before proceeding.');
    return;
  }

  state.isTranslating = true;
  state.isPaused = false;
  state.isCancelled = false;

  // Activate high-performance keep-awake engine
  startBackgroundKeepAlive();

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
  
  const currentModelToUse = initialModel;
  const pName = AI_PROVIDERS[providerId]?.name || 'AI';
  addTerminalLog('info', `Initial AI: [${pName}] ${currentModelToUse} • Auto-Failover: ${state.autoFailoverEnabled ? 'Enabled' : 'Disabled'}`);

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

      // Always resolve active provider, model, and key dynamically
      const activeModelId = state.selectedModel || currentModelToUse;
      const { providerId: bPid, model: currentModel, key: batchKey } = getActiveProviderAndKey(activeModelId);

      updateProgressStats(batchPct, `Translating batch ${bi + 1} of ${batches.length} (#${currentBatch[0].num} – #${currentBatch[currentBatch.length - 1].num})...`);
      addTerminalLog('info', `Batch ${bi + 1}/${batches.length}: Translating ${currentBatch.length} lines with [${AI_PROVIDERS[bPid]?.name || bPid}] ${currentModel}...`);

      let batchResult = [];
      try {
        batchResult = await translateBatchWithAdaptiveSplitting(currentBatch, batchKey, currentModel);
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

      // Smooth inter-batch pacing delay
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
    stopBackgroundKeepAlive();
    state.isTranslating = false;
    state.isPaused = false;
    resetTranslateButton();
  }
}

// ── Adaptive Sub-Batch Splitting Engine (Divide & Conquer + Cross-Provider Auto-Failover) ──
async function translateBatchWithAdaptiveSplitting(batch, activeKey, modelToUse, attempt = 1) {
  if (!batch || batch.length === 0) return [];

  // Wait if paused
  while (state.isPaused && !state.isCancelled) {
    await sleep(300);
  }
  if (state.isCancelled) {
    throw new Error('Translation cancelled by user');
  }

  const { providerId: currentPid, model: activeModel, key: effectiveKey } = getActiveProviderAndKey(modelToUse);

  try {
    const result = await callAiBatchTranslate(batch, effectiveKey, attempt, activeModel);
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
      const resA = await translateBatchWithAdaptiveSplitting(batch.slice(0, mid), effectiveKey, activeModel, 1);
      await sleep(1200);
      const resB = await translateBatchWithAdaptiveSplitting(batch.slice(mid), effectiveKey, activeModel, 1);
      return [...resA, ...resB];
    }

    return result;
  } catch (err) {
    if (state.isCancelled) throw err;
    state.stats.retries++;
    const errMsg = (err.message || '').toLowerCase();

    const isModelUnavailable = errMsg.includes('no longer available') ||
      errMsg.includes('does not exist') ||
      errMsg.includes('do not have access') ||
      errMsg.includes('not found') ||
      errMsg.includes('is not supported') ||
      errMsg.includes('deprecated') ||
      errMsg.includes('model_not_found') ||
      errMsg.includes('invalid_model') ||
      errMsg.includes('unrecognized model') ||
      errMsg.includes('invalid model') ||
      errMsg.includes('404');

    const is429 = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('resource has been exhausted') || errMsg.includes('rate limit');
    const is503 = errMsg.includes('503') || errMsg.includes('overloaded') || errMsg.includes('high demand') || errMsg.includes('service unavailable');
    const isAuthError = errMsg.includes('401') || errMsg.includes('unauthorized') || errMsg.includes('invalid api key') || errMsg.includes('incorrect api key');

    // 1. Permanent Model / Auth Error: Mark permanently broken and switch immediately
    if (isModelUnavailable || isAuthError) {
      modelHealthTracker.recordFailure(currentPid, activeModel, true, err.message);
      if (state.autoFailoverEnabled) {
        const backup = findFailoverBackup(currentPid, activeModel);
        if (backup) {
          addTerminalLog('warn', `⚡ [Auto-Failover] Model "${activeModel}" is unavailable on ${AI_PROVIDERS[currentPid]?.name || currentPid}. Automatically switching to [${backup.providerName}] ${backup.modelName} to continue translation!`);
          state.selectedModel = backup.model;
          if (modelSelect) {
            modelSelect.value = backup.model;
            refreshCustomSelect('modelSelect');
          }
          updateQuotaDashboardForActiveModel();
          await sleep(600);
          return await translateBatchWithAdaptiveSplitting(batch, backup.key, backup.model, 1);
        }
      }
      throw new Error(`Model "${activeModel}" is not accessible on ${AI_PROVIDERS[currentPid]?.name || currentPid} (${err.message}) and no other working backup model is connected.`);
    }

    // 2. Rate Limit / Overload: Record temporary cooldown and Auto-Failover
    if ((is429 || is503) && state.autoFailoverEnabled) {
      modelHealthTracker.recordFailure(currentPid, activeModel, false, err.message);
      const backup = findFailoverBackup(currentPid, activeModel);
      if (backup) {
        addTerminalLog('warn', `⚡ [Auto-Failover • ${backup.tier}] Model ${activeModel} is ${is503 ? 'overloaded (503)' : 'rate limited (429)'}. Instantly switching to [${backup.providerName}] ${backup.modelName} to keep translating without delay!`);
        state.selectedModel = backup.model;
        if (modelSelect) {
          modelSelect.value = backup.model;
          refreshCustomSelect('modelSelect');
        }
        updateQuotaDashboardForActiveModel();
        await sleep(600);
        return await translateBatchWithAdaptiveSplitting(batch, backup.key, backup.model, 1);
      }
    }

    // 3. Rate Limit / Overload without available backup: Cooldown and retry
    if (is429) {
      const waitTime = Math.min(5000 * attempt, 16000);
      updateApiHealthUI('cooldown', `429 Rate Limit Cooldown (${waitTime / 1000}s)...`);
      addTerminalLog('warn', `API rate limit reached on ${AI_PROVIDERS[currentPid]?.name || 'provider'}. Pausing for ${waitTime / 1000}s before retry ${attempt}/3...`);
      await sleep(waitTime);
      updateApiHealthUI('active', `Resuming translation...`);
      if (attempt <= 3 && !state.isCancelled) {
        return await translateBatchWithAdaptiveSplitting(batch, effectiveKey, activeModel, attempt + 1);
      }
    } else if (is503) {
      addTerminalLog('warn', `${AI_PROVIDERS[currentPid]?.name || 'AI Server'} busy (503). Retrying in 4s...`);
      await sleep(4000);
      if (attempt <= 3 && !state.isCancelled) {
        return await translateBatchWithAdaptiveSplitting(batch, effectiveKey, activeModel, attempt + 1);
      }
    }

    // 4. Divide and Conquer: Split batch if larger than 1 item and retry on same working model
    if (batch.length > 1 && !state.isCancelled) {
      const mid = Math.ceil(batch.length / 2);
      const subA = batch.slice(0, mid);
      const subB = batch.slice(mid);
      addTerminalLog('warn', `Sub-dividing batch of ${batch.length} lines into smaller chunks (${subA.length} + ${subB.length}) to isolate error...`);
      await sleep(1000);
      const resA = await translateBatchWithAdaptiveSplitting(subA, effectiveKey, activeModel, 1);
      await sleep(1000);
      const resB = await translateBatchWithAdaptiveSplitting(subB, effectiveKey, activeModel, 1);
      return [...resA, ...resB];
    }

    // 5. Final fallback for single block
    addTerminalLog('err', `Subtitle #${batch[0].num} could not be translated: ${err.message}. Original lines preserved.`);
    return batch.map(b => ({
      ...b,
      translatedLines: b.lines,
      isTranslated: false
    }));
  }
}

// ── Universal AI Translation Dispatcher ──
async function callAiBatchTranslate(batch, key, attemptNumber, overrideModel) {
  const modelToUse = overrideModel || modelSelect?.value || state.selectedModel;
  const { providerId, model, key: providerKey } = getActiveProviderAndKey(modelToUse);
  const effectiveKey = providerKey || state.apiKeys[providerId] || key;

  if (!effectiveKey) {
    throw new Error(`No API key configured for ${AI_PROVIDERS[providerId]?.name || providerId}. Please enter your key in the provider tabs.`);
  }

  if (providerId === 'gemini') {
    return await callGeminiBatchTranslate(batch, effectiveKey, attemptNumber, model);
  } else {
    return await callOpenAiCompatibleBatchTranslate(batch, providerId, model, effectiveKey, attemptNumber);
  }
}

// ── Google Gemini Translation Engine ──
async function callGeminiBatchTranslate(batch, key, attemptNumber, overrideModel) {
  const lang = targetLang.value || 'Bengali';
  const pace = styleMode.value;
  const hint = contextHint.value.trim();
  
  const rawModel = overrideModel || (modelSelect && modelSelect.value ? modelSelect.value : '') || state.selectedModel || 'gemini-2.0-flash';
  const selectedModel = rawModel.replace(/^models\//, '').trim();

  const inputData = batch.map((item, index) => ({
    id: index,
    text: item.lines.join('\n')
  }));

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
- AVOID disrespectful or rude pronouns like "तू" / "तेरा" / "तुझे".
- Use friendly, polite, and natural conversational pronouns like "तुम", "तुम्हारा", "तुम्हें" (or "आप", "आपका" for respect/elders).
- Translate in natural, modern conversational cinema/drama dialogue.`;
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
  updateApiHealthUI('active', `[Gemini] Sending Batch #${batch[0]?.num || 1}...`);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
  } catch (netErr) {
    const lat = Date.now() - reqStart;
    updateApiHealthUI('warning', '[Gemini] Network Retry...', lat);
    throw netErr;
  }

  const duration = Date.now() - reqStart;
  state.apiMetrics.lastLatencyMs = duration;

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    if (response.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate limit')) {
      state.apiMetrics.rateLimitHits++;
      updateApiHealthUI('cooldown', '[Gemini] 429 Rate Limit Hit', duration);
    } else {
      updateApiHealthUI('warning', `Google API Error (${response.status})`, duration);
    }
    throw new Error(errMsg);
  }

  state.apiMetrics.successfulRequests++;
  updateApiHealthUI('optimal', 'Quota Health: Optimal (Gemini)', duration);

  const responseData = await response.json();
  const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawText.trim()) {
    throw new Error('Received empty response from Gemini API.');
  }

  const parsedArray = parseAndRepairJson(rawText);
  return matchTranslationsToBatch(batch, parsedArray);
}

// ── OpenAI-Compatible Translation Engine (Groq, OpenRouter, DeepSeek, OpenAI) ──
async function callOpenAiCompatibleBatchTranslate(batch, providerId, modelId, key, attemptNumber) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf || !key) {
    throw new Error(`No configuration or API key for provider "${providerId}".`);
  }

  const lang = targetLang.value || 'Bengali';
  const pace = styleMode.value;
  const hint = contextHint.value.trim();

  const inputData = batch.map((item, index) => ({
    id: index,
    text: item.lines.join('\n')
  }));

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
- AVOID disrespectful or rude pronouns like "तू" / "तेरा" / "तुझे".
- Use friendly, polite, and natural conversational pronouns like "तुम", "तुम्हारा", "तुम्हें" (or "आप", "आपका" for respect/elders).
- Translate in natural, modern conversational cinema/drama dialogue.`;
  } else {
    languageRules = `
DIALOGUE RULES (${lang}):
- Use natural, fluent conversational ${lang} appropriate for modern movie and video subtitles.
- Choose natural, friendly, and respectful pronouns suitable for the characters' relationship.`;
  }

  const systemPrompt = `You are a professional cinematic subtitle localization translator.
Task: Translate every single subtitle dialogue line accurately into ${lang}.

MANDATORY RULES:
1. Every subtitle text MUST be translated into ${lang}. Do NOT leave original untranslated text.
2. Return a valid JSON array or object with "subtitles" array.
   Schema: [{"id": 0, "text": "translated dialogue in ${lang}"}, {"id": 1, "text": "translated dialogue in ${lang}"}] OR {"subtitles": [{"id": 0, "text": "translated dialogue in ${lang}"}]}
3. Preserve 100% of subtitle meaning, punchlines, drama, context, and emotion.
4. ${pacingPrompt}
5. Formatting & Tags:
   - Preserve HTML formatting tags (like <i>, </i>, <b>, </b>) if present in original text.
   - Preserve speaker tags or sound effects (e.g. [Music], (Laughter), [Door slams], JOHN:) appropriately without mangling brackets.
   - If original subtitle text has multiple dialogue lines (e.g. starting with "- "), keep clean line breaks in translated text.${languageRules}
${hint ? `6. Context/Genre: ${hint}` : ''}`;

  const userPrompt = `INPUT SUBTITLES TO TRANSLATE (${batch.length} items):
${JSON.stringify(inputData, null, 2)}

OUTPUT (JSON Array):`;

  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`
  };
  if (providerId === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin || 'https://srttranslator.vercel.app';
    headers['X-Title'] = 'SRTtranslator';
  }

  const requestBody = {
    model: modelId,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.15
  };

  if (providerId === 'groq' || providerId === 'openai' || (providerId === 'deepseek' && modelId !== 'deepseek-reasoner')) {
    requestBody.response_format = { type: 'json_object' };
  }

  state.apiMetrics.totalRequests++;
  const reqStart = Date.now();
  updateApiHealthUI('active', `[${pConf.name}] Translating Batch #${batch[0]?.num || 1}...`);

  let response;
  try {
    response = await fetch(pConf.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
  } catch (netErr) {
    const lat = Date.now() - reqStart;
    updateApiHealthUI('warning', `[${pConf.name}] Network Retry...`, lat);
    throw netErr;
  }

  const duration = Date.now() - reqStart;
  state.apiMetrics.lastLatencyMs = duration;

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    if (response.status === 429) {
      state.apiMetrics.rateLimitHits++;
      updateApiHealthUI('cooldown', `[${pConf.name}] 429 Rate Limit`, duration);
    } else {
      updateApiHealthUI('warning', `[${pConf.name}] Error (${response.status})`, duration);
    }
    throw new Error(errMsg);
  }

  state.apiMetrics.successfulRequests++;
  updateApiHealthUI('optimal', `Quota Health: Optimal (${pConf.name})`, duration);

  const responseData = await response.json();
  const rawText = responseData?.choices?.[0]?.message?.content || '';

  if (!rawText.trim()) {
    throw new Error(`Received empty response from ${pConf.name} API.`);
  }

  const parsedArray = parseAndRepairJson(rawText);
  return matchTranslationsToBatch(batch, parsedArray);
}

// ── Selective Retry Pipeline for Incomplete Batches ──
async function retryIncompleteBatchesPipeline() {
  const { providerId, model: initialModel, key: activeKey } = getActiveProviderAndKey();
  if (!activeKey) {
    alert('Please enter and connect at least one AI API Key before proceeding.');
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

  startBackgroundKeepAlive();

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
  const currentModelToUse = initialModel;

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
        const activeModelId = state.selectedModel || currentModelToUse;
        const { model: retryModel, key: retryKey } = getActiveProviderAndKey(activeModelId);
        const res = await translateBatchWithAdaptiveSplitting(currentBatch, retryKey, retryModel);
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
    stopBackgroundKeepAlive();
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

// ── Universal AI Condenser Dispatcher ──
async function callAiBatchCondense(batch, key, attemptNumber, overrideModel) {
  const modelToUse = overrideModel || modelSelect?.value || state.selectedModel;
  const { providerId, model, key: providerKey } = getActiveProviderAndKey(modelToUse);
  const effectiveKey = providerKey || state.apiKeys[providerId] || key;

  if (providerId === 'gemini') {
    return await callGeminiBatchCondense(batch, effectiveKey, attemptNumber, model);
  } else {
    return await callOpenAiCompatibleBatchCondense(batch, providerId, model, effectiveKey, attemptNumber);
  }
}

// ── AI 2nd-Pass Condenser Pipeline ──
async function runAiCondensePipeline() {
  if (state.translatedBlocks.length === 0) return;
  const { providerId, model: activeModel, key: activeKey } = getActiveProviderAndKey();
  if (!activeKey) {
    alert('Please enter and connect at least one AI API Key before proceeding.');
    return;
  }

  // Backup original translations if not already done
  if (!state.uncompressedBlocks || state.uncompressedBlocks.length === 0) {
    state.uncompressedBlocks = JSON.parse(JSON.stringify(state.translatedBlocks));
  }

  state.isTranslating = true;
  state.isCondensing = true;
  state.isPaused = false;
  state.isCancelled = false;

  if (ctrlIconPause) ctrlIconPause.classList.remove('hidden');
  if (ctrlIconResume) ctrlIconResume.classList.add('hidden');
  if (pauseResumeLabel) pauseResumeLabel.textContent = 'Pause';
  if (pauseResumeBtn) pauseResumeBtn.classList.remove('is-paused');

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
  const bs = 20;
  const batches = chunkArray(state.translatedBlocks, bs);
  const condensedResult = new Array(state.translatedBlocks.length);
  let processedCount = 0;

  state.stats = {
    total: state.translatedBlocks.length,
    processed: 0,
    overlapsFixed: 0,
    emptyRecovered: 0,
    retries: 0,
    untranslated: 0
  };

  statProcessed.textContent = `0 / ${state.translatedBlocks.length}`;
  statBatches.textContent = `0 / ${batches.length}`;

  updateProgressStats(0, `Starting 2nd-Pass AI Condensation (${totalWordsStart} total words)...`);
  addTerminalLog('info', `[2nd-Pass Condenser] Analyzing ${state.translatedBlocks.length} subtitles (${totalWordsStart} total words across ${batches.length} batches)...`);

  try {
    for (let bi = 0; bi < batches.length; bi++) {
      while (state.isPaused && !state.isCancelled) {
        await sleep(300);
      }
      if (state.isCancelled) {
        addTerminalLog('warn', 'AI Condensation cancelled by user.');
        break;
      }

      const currentBatch = batches[bi];
      const startIndex = bi * bs;
      const batchPct = Math.round((processedCount / state.translatedBlocks.length) * 95);

      const { model: currentCondenseModel, key: currentCondenseKey } = getActiveProviderAndKey(state.selectedModel);
      updateProgressStats(batchPct, `Condensing batch ${bi + 1} of ${batches.length} (#${currentBatch[0].num} – #${currentBatch[currentBatch.length - 1].num})...`);

      const batchResult = await condenseBatchWithAdaptiveSplitting(currentBatch, currentCondenseKey, currentCondenseModel);

      for (let j = 0; j < batchResult.length; j++) {
        condensedResult[startIndex + j] = batchResult[j];
      }

      const batchOrigWords = countTotalWords(currentBatch);
      const batchCondWords = countTotalWords(batchResult);
      const batchPctSaved = batchOrigWords > 0 ? Math.max(0, Math.round(((batchOrigWords - batchCondWords) / batchOrigWords) * 100)) : 0;

      processedCount += currentBatch.length;
      state.stats.processed = processedCount;
      statProcessed.textContent = `${processedCount} / ${state.translatedBlocks.length}`;
      statBatches.textContent = `${bi + 1} / ${batches.length}`;

      addTerminalLog('ok', `Batch ${bi + 1}/${batches.length}: ${batchOrigWords}w -> ${batchCondWords}w (-${batchPctSaved}% concise).`);

      if (bi < batches.length - 1 && !state.isCancelled) {
        await sleep(1200);
      }
    }

    if (state.isCancelled) {
      restoreOriginalTranslation();
      return;
    }

    updateProgressStats(98, 'Synchronizing precision timecodes for condensed subtitles...');
    const finalizedBlocks = postProcessSubtitles(condensedResult);

    state.translatedBlocks = finalizedBlocks;
    state.isCondensed = true;

    const totalWordsEnd = countTotalWords(finalizedBlocks);
    const totalPercentSaved = totalWordsStart > 0 ? Math.max(0, Math.round(((totalWordsStart - totalWordsEnd) / totalWordsStart) * 100)) : 0;
    const wordsSaved = Math.max(0, totalWordsStart - totalWordsEnd);

    updateProgressStats(100, `AI Condensation complete! Reduced from ${totalWordsStart} to ${totalWordsEnd} words (-${totalPercentSaved}% reading load).`);
    addTerminalLog('ok', `✨ [Condensation 100% Done] Total: ${totalWordsStart} words -> ${totalWordsEnd} words (${wordsSaved} words saved, -${totalPercentSaved}% reading load)!`);

    await sleep(350);

    showTranslationResults(finalizedBlocks, totalPercentSaved, totalWordsStart, totalWordsEnd);
    saveCurrentSession();

    await sleep(300);
    downloadSRTFile(finalizedBlocks);
    addTerminalLog('ok', 'Condensed SRT auto-downloaded.');
  } finally {
    stopBackgroundKeepAlive();
    state.isTranslating = false;
    state.isCondensing = false;
    state.isPaused = false;
    if (condenseSrtBtn) {
      condenseSrtBtn.innerHTML = origBtnHtml;
      condenseSrtBtn.disabled = false;
    }
  }
}

// ── Adaptive Sub-Batch Splitting Engine for Condenser (Divide & Conquer + Cross-Provider Auto-Failover) ──
async function condenseBatchWithAdaptiveSplitting(batch, activeKey, modelToUse, attempt = 1) {
  if (!batch || batch.length === 0) return [];

  while (state.isPaused && !state.isCancelled) {
    await sleep(300);
  }
  if (state.isCancelled) {
    throw new Error('Condensation cancelled by user');
  }

  const { providerId: currentPid, model: activeModel, key: effectiveKey } = getActiveProviderAndKey(modelToUse);

  try {
    const result = await callAiBatchCondense(batch, effectiveKey, attempt, activeModel);
    return result;
  } catch (err) {
    if (state.isCancelled) throw err;
    state.stats.retries++;
    const errMsg = (err.message || '').toLowerCase();

    const isModelUnavailable = errMsg.includes('no longer available') ||
      errMsg.includes('does not exist') ||
      errMsg.includes('do not have access') ||
      errMsg.includes('not found') ||
      errMsg.includes('is not supported') ||
      errMsg.includes('deprecated') ||
      errMsg.includes('model_not_found') ||
      errMsg.includes('invalid_model') ||
      errMsg.includes('unrecognized model') ||
      errMsg.includes('invalid model') ||
      errMsg.includes('404');

    const is429 = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('resource has been exhausted') || errMsg.includes('rate limit');
    const is503 = errMsg.includes('503') || errMsg.includes('overloaded') || errMsg.includes('high demand') || errMsg.includes('service unavailable');
    const isAuthError = errMsg.includes('401') || errMsg.includes('unauthorized') || errMsg.includes('invalid api key') || errMsg.includes('incorrect api key');

    // 1. Permanent Model / Auth Error: Mark permanently broken and switch immediately
    if (isModelUnavailable || isAuthError) {
      modelHealthTracker.recordFailure(currentPid, activeModel, true, err.message);
      if (state.autoFailoverEnabled) {
        const backup = findFailoverBackup(currentPid, activeModel);
        if (backup) {
          addTerminalLog('warn', `⚡ [Auto-Failover] Condenser model "${activeModel}" is unavailable. Switching to [${backup.providerName}] ${backup.modelName} to continue condensation!`);
          state.selectedModel = backup.model;
          if (modelSelect) {
            modelSelect.value = backup.model;
            refreshCustomSelect('modelSelect');
          }
          updateQuotaDashboardForActiveModel();
          await sleep(600);
          return await condenseBatchWithAdaptiveSplitting(batch, backup.key, backup.model, 1);
        }
      }
      addTerminalLog('err', `Could not condense batch with "${activeModel}": ${err.message}. Preserving uncompressed translation.`);
      return batch;
    }

    // 2. Rate Limit / Overload: Record temporary cooldown and Auto-Failover
    if ((is429 || is503) && state.autoFailoverEnabled) {
      modelHealthTracker.recordFailure(currentPid, activeModel, false, err.message);
      const backup = findFailoverBackup(currentPid, activeModel);
      if (backup) {
        addTerminalLog('warn', `⚡ [Auto-Failover • ${backup.tier}] Condenser model ${activeModel} is ${is503 ? 'overloaded (503)' : 'rate limited (429)'}. Instantly switching to [${backup.providerName}] ${backup.modelName}!`);
        state.selectedModel = backup.model;
        if (modelSelect) {
          modelSelect.value = backup.model;
          refreshCustomSelect('modelSelect');
        }
        updateQuotaDashboardForActiveModel();
        await sleep(600);
        return await condenseBatchWithAdaptiveSplitting(batch, backup.key, backup.model, 1);
      }
    }

    // 3. Rate Limit / Overload without available backup: Cooldown and retry
    if (is429) {
      const waitTime = Math.min(5000 * attempt, 16000);
      updateApiHealthUI('cooldown', `429 Rate Limit Cooldown (${waitTime / 1000}s)...`);
      addTerminalLog('warn', `API rate limit reached on condenser. Pausing for ${waitTime / 1000}s before retry ${attempt}/3...`);
      await sleep(waitTime);
      updateApiHealthUI('active', `Resuming condensation...`);
      if (attempt <= 3 && !state.isCancelled) {
        return await condenseBatchWithAdaptiveSplitting(batch, effectiveKey, activeModel, attempt + 1);
      }
    } else if (is503) {
      addTerminalLog('warn', `Condenser server busy (503). Retrying in 4s...`);
      await sleep(4000);
      if (attempt <= 3 && !state.isCancelled) {
        return await condenseBatchWithAdaptiveSplitting(batch, effectiveKey, activeModel, attempt + 1);
      }
    }

    // 4. Divide and Conquer: Split batch if larger than 1 item
    if (batch.length > 1 && !state.isCancelled) {
      const mid = Math.ceil(batch.length / 2);
      const subA = batch.slice(0, mid);
      const subB = batch.slice(mid);
      addTerminalLog('warn', `Sub-dividing condense batch of ${batch.length} lines into smaller chunks (${subA.length} + ${subB.length})...`);
      await sleep(1000);
      const resA = await condenseBatchWithAdaptiveSplitting(subA, effectiveKey, activeModel, 1);
      await sleep(1000);
      const resB = await condenseBatchWithAdaptiveSplitting(subB, effectiveKey, activeModel, 1);
      return [...resA, ...resB];
    }

    // 5. Final fallback for single block
    addTerminalLog('warn', `Subtitle #${batch[0]?.num || 1} could not be condensed. Original translation preserved.`);
    return batch;
  }
}

// ── Gemini 2nd-Pass Condense API Call ──
async function callGeminiBatchCondense(batch, key, attemptNumber, overrideModel) {
  const lang = targetLang.value || 'Bengali';
  const rawModel = overrideModel || (modelSelect && modelSelect.value ? modelSelect.value : '') || state.selectedModel || 'gemini-2.0-flash';
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
  updateApiHealthUI('active', `[Gemini] Condensing Subtitles...`);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
  } catch (netErr) {
    const lat = Date.now() - reqStart;
    updateApiHealthUI('warning', '[Gemini] Network Retry...', lat);
    throw netErr;
  }

  const duration = Date.now() - reqStart;
  state.apiMetrics.lastLatencyMs = duration;

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    if (response.status === 429) {
      state.apiMetrics.rateLimitHits++;
      updateApiHealthUI('cooldown', '[Gemini] 429 Rate Limit Cooldown', duration);
    } else {
      updateApiHealthUI('warning', `Google API (${response.status})`, duration);
    }
    throw new Error(errMsg);
  }

  state.apiMetrics.successfulRequests++;
  updateApiHealthUI('optimal', 'Quota Health: Optimal (Gemini)', duration);

  const responseData = await response.json();
  const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawText.trim()) throw new Error('Received empty response from Gemini Condenser.');

  const parsedArray = parseAndRepairJson(rawText);
  return matchTranslationsToBatch(batch, parsedArray);
}

// ── OpenAI-Compatible 2nd-Pass Condense API Call ──
async function callOpenAiCompatibleBatchCondense(batch, providerId, modelId, key, attemptNumber) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf || !key) throw new Error(`No configuration for provider "${providerId}".`);

  const lang = targetLang.value || 'Bengali';
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

  const systemPrompt = `You are a master subtitle compression and localization editor.
Task: Condense and shorten the given ${lang} subtitle translations so they are readable in a split second glance.

MANDATORY RULES:
1. Make every subtitle line ULTRA-SHORT and punchy (ideal 1-4 words for short lines, or minimum possible concise words).
2. Cut away conversational padding, redundant particles, extra formal suffixes, and repetitive words so viewers can read instantaneously.
3. Strictly preserve 100% of the core emotion, punchline, dialogue intent, and context.
4. Output strictly in natural everyday spoken ${lang} dialogue/script.
5. Preserve HTML tags like <i>, </i>, <b>, </b> if present.
6. Return a valid JSON array or object with "subtitles" array.
Schema: [{"id": 0, "text": "concise dialogue in ${lang}"}, {"id": 1, "text": "concise dialogue in ${lang}"}] OR {"subtitles": [{"id": 0, "text": "concise dialogue in ${lang}"}]}${condenseLangRule}`;

  const userPrompt = `INPUT SUBTITLES (${batch.length} items):
${JSON.stringify(inputData, null, 2)}

OUTPUT (JSON Array):`;

  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`
  };
  if (providerId === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin || 'https://srttranslator.vercel.app';
    headers['X-Title'] = 'SRTtranslator';
  }

  const requestBody = {
    model: modelId,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.15
  };

  if (providerId === 'groq' || providerId === 'openai' || (providerId === 'deepseek' && modelId !== 'deepseek-reasoner')) {
    requestBody.response_format = { type: 'json_object' };
  }

  state.apiMetrics.totalRequests++;
  const reqStart = Date.now();
  updateApiHealthUI('active', `[${pConf.name}] Condensing Subtitles...`);

  let response;
  try {
    response = await fetch(pConf.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
  } catch (netErr) {
    const lat = Date.now() - reqStart;
    updateApiHealthUI('warning', `[${pConf.name}] Network Retry...`, lat);
    throw netErr;
  }

  const duration = Date.now() - reqStart;
  state.apiMetrics.lastLatencyMs = duration;

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    if (response.status === 429) {
      state.apiMetrics.rateLimitHits++;
      updateApiHealthUI('cooldown', `[${pConf.name}] 429 Rate Limit`, duration);
    } else {
      updateApiHealthUI('warning', `[${pConf.name}] Error (${response.status})`, duration);
    }
    throw new Error(errMsg);
  }

  state.apiMetrics.successfulRequests++;
  updateApiHealthUI('optimal', `Quota Health: Optimal (${pConf.name})`, duration);

  const responseData = await response.json();
  const rawText = responseData?.choices?.[0]?.message?.content || '';

  if (!rawText.trim()) throw new Error(`Received empty response from ${pConf.name} Condenser.`);

  const parsedArray = parseAndRepairJson(rawText);
  return matchTranslationsToBatch(batch, parsedArray);
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
  const { providerId, model: currentModel, key: activeKey } = getActiveProviderAndKey();
  if (!activeKey) {
    alert('Please enter and connect an AI API Key first.');
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
    const result = await callAiBatchCondense([block], activeKey, 1, currentModel);
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
function showTranslationResults(blocks, percentSaved, origWords, condWords) {
  progressCard.classList.add('hidden');
  resultCard.classList.remove('hidden');

  const untranslatedCount = blocks.filter(b => b.isTranslated === false).length;

  if (state.isCondensed) {
    const wStart = origWords || countTotalWords(state.uncompressedBlocks || []);
    const wEnd = condWords || countTotalWords(blocks);
    const wordInfo = (wStart > 0 && wEnd > 0) ? ` (${wStart} words -> ${wEnd} words • -${percentSaved || Math.round(((wStart - wEnd) / wStart) * 100)}% reading load)` : '';
    resultStats.textContent = `${blocks.length} subtitles localized & condensed for instant glance reading${wordInfo} • 0 drift • 100% timecode integrity`;
    if (incompleteWarningBanner) {
      incompleteWarningBanner.classList.add('hidden');
    }
  } else if (untranslatedCount > 0) {
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
    const wStart = origWords || countTotalWords(state.uncompressedBlocks || []);
    const wEnd = condWords || countTotalWords(blocks);
    const badgeText = (wStart > 0 && wEnd > 0)
      ? `AI Condensed (${wStart}w -> ${wEnd}w • -${percentSaved || Math.round(((wStart - wEnd) / wStart) * 100)}%)`
      : `AI Condensed (${percentSaved ? '-' + percentSaved + '% Words' : 'Glance-Speed'})`;
    badges.push({ 
      text: badgeText, 
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

// ── Collapsible SEO Guide & Documentation Master Engine ──
function initSeoGuideToggle() {
  const wrapper = $('seoGuideWrapper');
  const toggleBtn = $('toggleSeoGuideBtn');
  const actionLabel = $('seoGuideActionLabel');
  if (!wrapper || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = wrapper.classList.contains('is-open');
    if (isOpen) {
      wrapper.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      if (actionLabel) actionLabel.textContent = 'Show Full Guide';
    } else {
      wrapper.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (actionLabel) actionLabel.textContent = 'Hide Guide';
    }
  });
}
