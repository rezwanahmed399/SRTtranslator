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
    defaultModel: 'gemini-3.5-pro',
    badge: 'Required',
    models: [
      { id: 'gemini-3.5-pro', displayName: 'Gemini 3.5 Pro', version: '3.5', inputTokens: 2097152, outputTokens: 8192, rpm: '5 RPM', rpd: '1,000 RPD', desc: 'Next-Gen Flagship Pro Reasoning (Google AI)' },
      { id: 'gemini-3.5-flash', displayName: 'Gemini 3.5 Flash', version: '3.5', inputTokens: 1048576, outputTokens: 8192, rpm: '15 RPM', rpd: '1,500 RPD', desc: 'Latest Ultra-Fast High Quality (Google AI)' },
      { id: 'gemini-3.1-pro', displayName: 'Gemini 3.1 Pro', version: '3.1', inputTokens: 2097152, outputTokens: 8192, rpm: '5 RPM', rpd: '1,000 RPD', desc: 'Top Nuance Dialogue Reasoning' },
      { id: 'gemini-3.1-flash', displayName: 'Gemini 3.1 Flash', version: '3.1', inputTokens: 1048576, outputTokens: 8192, rpm: '15 RPM', rpd: '1,500 RPD', desc: 'High-Throughput Fast Translation' },
      { id: 'gemini-3.0-pro', displayName: 'Gemini 3.0 Pro', version: '3.0', inputTokens: 2097152, outputTokens: 8192, rpm: '5 RPM', rpd: '1,000 RPD', desc: 'Deep Context & Cinematic Flow' },
      { id: 'gemini-3.0-flash', displayName: 'Gemini 3.0 Flash', version: '3.0', inputTokens: 1048576, outputTokens: 8192, rpm: '15 RPM', rpd: '1,500 RPD', desc: 'Stable Gemini 3.0 Production' },
      { id: 'gemini-3.5-flash-lite', displayName: 'Gemini 3.5 Flash Lite', version: '3.5', inputTokens: 1048576, outputTokens: 8192, rpm: '30 RPM', rpd: '1,500 RPD', desc: 'Gemini 3.5 Ultra-Fast Lite' },
      { id: 'gemini-3.1-flash-lite', displayName: 'Gemini 3.1 Flash Lite', version: '3.1', inputTokens: 1048576, outputTokens: 8192, rpm: '30 RPM', rpd: '1,500 RPD', desc: 'Gemini 3.1 Ultra-Fast Lite' },
      { id: 'gemini-3.0-flash-lite', displayName: 'Gemini 3.0 Flash Lite', version: '3.0', inputTokens: 1048576, outputTokens: 8192, rpm: '30 RPM', rpd: '1,500 RPD', desc: 'Gemini 3.0 Ultra-Fast Lite' }
    ]
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    storageKey: 'openrouter_api_key',
    docLink: 'https://openrouter.ai/keys',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    type: 'openai_compatible',
    defaultModel: 'anthropic/claude-3.7-sonnet',
    badge: 'Required',
    models: [
      { id: 'google/gemini-3.5-pro', displayName: 'Gemini 3.5 Pro (OpenRouter)', version: '3.5', inputTokens: 2097152, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Top Nuance Reasoning via OpenRouter' },
      { id: 'google/gemini-3.5-flash', displayName: 'Gemini 3.5 Flash (OpenRouter)', version: '3.5', inputTokens: 1048576, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Ultra-Fast High Quality via OpenRouter' },
      { id: 'google/gemini-3.0-flash', displayName: 'Gemini 3.0 Flash (OpenRouter)', version: '3.0', inputTokens: 1048576, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Ultra-Fast via OpenRouter' },
      { id: 'google/gemini-3.0-flash-lite', displayName: 'Gemini 3.0 Flash Lite (OpenRouter)', version: '3.0', inputTokens: 1048576, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Ultra-Light via OpenRouter' },
      { id: 'anthropic/claude-3.7-sonnet', displayName: 'Claude 3.7 Sonnet', version: '3.7', inputTokens: 200000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Flagship Cinematic Subtitles' },
      { id: 'anthropic/claude-3.5-sonnet', displayName: 'Claude 3.5 Sonnet', version: '3.5', inputTokens: 200000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Top Dialogue Flow' },
      { id: 'deepseek/deepseek-chat', displayName: 'DeepSeek V3 (Chat)', version: 'V3', inputTokens: 64000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Top Multilingual Subtitles' },
      { id: 'meta-llama/llama-3.3-70b-instruct', displayName: 'Meta Llama 3.3 70B', version: '3.3', inputTokens: 128000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Natural Dialogue Flow' },
      { id: 'anthropic/claude-3.5-haiku', displayName: 'Claude 3.5 Haiku', version: '3.5', inputTokens: 200000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Natural Spoken Dubbing' },
      { id: 'deepseek/deepseek-r1', displayName: 'DeepSeek R1 (OpenRouter)', version: 'R1', inputTokens: 64000, outputTokens: 8192, rpm: 'Dynamic', rpd: 'Unlimited', desc: 'Deep Reasoning Chain' }
    ]
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    storageKey: 'groq_api_key',
    docLink: 'https://console.groq.com/keys',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    type: 'openai_compatible',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', displayName: 'Llama 3.3 70B (Versatile)', version: '3.3', inputTokens: 128000, outputTokens: 32768, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'Ultra-Fast & Free (Groq LPU)' },
      { id: 'deepseek-r1-distill-llama-70b', displayName: 'DeepSeek R1 Distill 70B', version: 'R1', inputTokens: 128000, outputTokens: 32768, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'Reasoning Subtitles' },
      { id: 'llama-3.1-8b-instant', displayName: 'Llama 3.1 8B Instant', version: '3.1', inputTokens: 128000, outputTokens: 8192, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'Sub-second Speed' },
      { id: 'mixtral-8x7b-32768', displayName: 'Mixtral 8x7B 32k', version: '8x7B', inputTokens: 32768, outputTokens: 32768, rpm: '30 RPM', rpd: '14,400 RPD', desc: 'High Multilingual Throughput' }
    ]
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    storageKey: 'deepseek_api_key',
    docLink: 'https://platform.deepseek.com/api_keys',
    endpoint: 'https://api.deepseek.com/chat/completions',
    type: 'openai_compatible',
    defaultModel: 'deepseek-chat',
    models: [
      { id: 'deepseek-chat', displayName: 'DeepSeek V3 (deepseek-chat)', version: 'V3', inputTokens: 64000, outputTokens: 8192, rpm: '60 RPM', rpd: 'Unlimited', desc: 'Official API - High Quality' },
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
  },
  custom: {
    id: 'custom',
    name: 'Custom API',
    storageKey: 'custom_api_key',
    docLink: '',
    endpoint: '',
    type: 'openai_compatible',
    defaultModel: 'custom-model',
    badge: 'Custom Endpoint',
    models: [
      { id: 'custom-model', displayName: 'Custom Model', version: 'Custom', inputTokens: 128000, outputTokens: 8192, rpm: 'Custom', rpd: 'Custom', desc: 'Custom OpenAI-Compatible Endpoint' }
    ]
  }
};

// ── Translation Quality & Auto-Switch Priority Hierarchy ──
// Ranked by: Dialogue translation naturalness, nuance/slang retention, speed, and rate-limit resilience
const TRANSLATION_MODEL_RANKING = [
  // ── Tier 1A: Google Gemini (Direct) Pro & Flash Models (Version >= 3.0 Only) ──
  { providerId: 'gemini', modelId: 'gemini-3.5-pro', name: 'Gemini 3.5 Pro', tier: 'Tier 1A (Gemini 3+ Pro)', desc: 'Next-Gen Flagship Pro Reasoning' },
  { providerId: 'gemini', modelId: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', tier: 'Tier 1A (Gemini 3+ Flash)', desc: 'Latest Ultra-Fast High Quality' },
  { providerId: 'gemini', modelId: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', tier: 'Tier 1A (Gemini 3+ Pro)', desc: 'Top Nuance Dialogue Reasoning' },
  { providerId: 'gemini', modelId: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', tier: 'Tier 1A (Gemini 3+ Flash)', desc: 'High-Throughput Fast Translation' },
  { providerId: 'gemini', modelId: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro', tier: 'Tier 1A (Gemini 3+ Pro)', desc: 'Deep Context & Cinematic Flow' },
  { providerId: 'gemini', modelId: 'gemini-3.0-flash', name: 'Gemini 3.0 Flash', tier: 'Tier 1A (Gemini 3+ Flash)', desc: 'Stable Gemini 3.0 Production' },

  // ── Tier 1B: Google Gemini (Direct) Lite Models (Version >= 3.0 Only, Newest to Oldest) ──
  { providerId: 'gemini', modelId: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', tier: 'Tier 1B (Gemini 3+ Lite)', desc: 'Gemini 3.5 Ultra-Fast Lite' },
  { providerId: 'gemini', modelId: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', tier: 'Tier 1B (Gemini 3+ Lite)', desc: 'Gemini 3.1 Ultra-Fast Lite' },
  { providerId: 'gemini', modelId: 'gemini-3.0-flash-lite', name: 'Gemini 3.0 Flash Lite', tier: 'Tier 1B (Gemini 3+ Lite)', desc: 'Gemini 3.0 Ultra-Fast Lite' },

  // ── Tier 2A: OpenRouter Gemini Models (Version >= 3.0) ──
  { providerId: 'openrouter', modelId: 'google/gemini-3.5-pro', name: 'Gemini 3.5 Pro (OpenRouter)', tier: 'Tier 2A (OpenRouter Gemini 3+)', desc: 'Top Nuance via OpenRouter' },
  { providerId: 'openrouter', modelId: 'google/gemini-3.5-flash', name: 'Gemini 3.5 Flash (OpenRouter)', tier: 'Tier 2A (OpenRouter Gemini 3+)', desc: 'Next-Gen Speed via OpenRouter' },
  { providerId: 'openrouter', modelId: 'google/gemini-3.0-flash', name: 'Gemini 3.0 Flash (OpenRouter)', tier: 'Tier 2A (OpenRouter Gemini 3+)', desc: 'Ultra-Fast via OpenRouter' },
  { providerId: 'openrouter', modelId: 'google/gemini-3.0-flash-lite', name: 'Gemini 3.0 Flash Lite (OpenRouter)', tier: 'Tier 2A (OpenRouter Gemini 3+ Lite)', desc: 'Ultra-Light via OpenRouter' },

  // ── Tier 2B: OpenRouter Other Top Cinematic / Dialogue AI Models ──
  { providerId: 'openrouter', modelId: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (OpenRouter)', tier: 'Tier 2B (OpenRouter DeepSeek)', desc: 'Top Cinematic Dialogue & Idioms' },
  { providerId: 'openrouter', modelId: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta Llama 3.3 70B (OpenRouter)', tier: 'Tier 2B (OpenRouter Llama)', desc: 'Natural Conversational Flow' },
  { providerId: 'openrouter', modelId: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku (OpenRouter)', tier: 'Tier 2B (OpenRouter Claude)', desc: 'Natural Spoken Dubbing' },
  { providerId: 'openrouter', modelId: 'deepseek/deepseek-r1', name: 'DeepSeek R1 (OpenRouter)', tier: 'Tier 2B (OpenRouter Reasoning)', desc: 'Deep Reasoning for Ambiguous Lines' },

  // ── Tier 3: Groq High-Speed Models ──
  { providerId: 'groq', modelId: 'llama-3.3-70b-versatile', name: 'Groq Llama 3.3 70B', tier: 'Tier 3 (Groq)', desc: '14,400 RPD • 300 tok/s' },
  { providerId: 'groq', modelId: 'llama-3.1-8b-instant', name: 'Groq Llama 3.1 8B', tier: 'Tier 3 (Groq)', desc: 'Ultra-Fast Sub-Second' },
  { providerId: 'groq', modelId: 'deepseek-r1-distill-llama-70b', name: 'Groq DeepSeek R1 70B', tier: 'Tier 3 (Groq Reasoning)', desc: 'Complex Metaphor Understanding' },
  { providerId: 'groq', modelId: 'mixtral-8x7b-32768', name: 'Groq Mixtral 8x7B', tier: 'Tier 3 (Groq Fallback)', desc: 'High Multilingual Throughput' },

  // ── Tier 4: DeepSeek Official API ──
  { providerId: 'deepseek', modelId: 'deepseek-chat', name: 'DeepSeek V3 (Official)', tier: 'Tier 4 (DeepSeek)', desc: 'Exceptional Dialogue Slang & Idioms' },
  { providerId: 'deepseek', modelId: 'deepseek-reasoner', name: 'DeepSeek R1 Reasoner', tier: 'Tier 4 (DeepSeek)', desc: 'Deep Reasoning Chain' },

  // ── Tier 5: OpenAI API ──
  { providerId: 'openai', modelId: 'gpt-4o-mini', name: 'GPT-4o Mini', tier: 'Tier 5 (OpenAI)', desc: 'Fast & Highly Precise' },
  { providerId: 'openai', modelId: 'gpt-4o', name: 'GPT-4o Flagship', tier: 'Tier 5 (OpenAI)', desc: 'Maximum Linguistic Precision' },

  // ── Tier 6: Custom OpenAI Endpoint ──
  { providerId: 'custom', modelId: 'custom-model', name: 'Custom Model', tier: 'Tier 6 (Custom Endpoint)', desc: 'Custom OpenAI-Compatible Model' }
];

// Global State
const state = {
  apiKeys: {
    gemini: '',
    openrouter: '',
    groq: '',
    deepseek: '',
    openai: '',
    custom: ''
  },
  activeTabProvider: 'gemini',
  autoFailoverEnabled: true,
  providerStatus: {
    gemini: { connected: null, models: [], lastLatency: 0 },
    openrouter: { connected: null, models: [], lastLatency: 0 },
    groq: { connected: null, models: [], lastLatency: 0 },
    deepseek: { connected: null, models: [], lastLatency: 0 },
    openai: { connected: null, models: [], lastLatency: 0 },
    custom: { connected: null, models: [], lastLatency: 0 }
  },
  apiKey: '', // Backward compatibility
  availableModels: [],
  selectedModel: 'auto',
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
  isCloudJob: false,
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

let activeCloudJobListenerUnsub = null;

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Universal Modal Dialog System (Confirmations, Alerts & Prompts) ──
function showCustomConfirm({ 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Yes, Confirm', 
  cancelText = 'Cancel', 
  type = 'warning' 
} = {}) {
  return new Promise((resolve) => {
    const existing = document.querySelector('.custom-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'custom-modal-backdrop';

    const isDanger = type === 'danger' || type === 'stop';
    const isWarn = type === 'warning';
    const isPause = type === 'pause';
    
    let accentGrad = 'linear-gradient(90deg, #6366f1, #38bdf8)';
    let iconClass = 'modal-icon-info';
    let btnConfirmStyle = 'background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);';

    let iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    `;

    if (isDanger) {
      accentGrad = 'linear-gradient(90deg, #ef4444, #dc2626)';
      iconClass = 'modal-icon-danger';
      btnConfirmStyle = 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);';
      iconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      `;
    } else if (isPause) {
      accentGrad = 'linear-gradient(90deg, #f59e0b, #eab308)';
      iconClass = 'modal-icon-warning';
      btnConfirmStyle = 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);';
      iconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <rect x="6" y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
      `;
    } else if (isWarn) {
      accentGrad = 'linear-gradient(90deg, #f59e0b, #eab308)';
      iconClass = 'modal-icon-warning';
      btnConfirmStyle = 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);';
      iconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      `;
    }

    backdrop.innerHTML = `
      <div class="custom-modal-box" role="dialog" aria-modal="true">
        <div class="modal-top-accent" style="background:${accentGrad};"></div>
        <div class="modal-icon-badge ${iconClass}">
          ${iconSvg}
        </div>
        <h3 class="modal-title">${escapeHtml(title)}</h3>
        <p class="modal-message">${escapeHtml(message)}</p>
        <div class="modal-actions-row">
          <button class="btn-modal-cancel" type="button" id="modalCancelBtn">${escapeHtml(cancelText)}</button>
          <button class="btn-modal-confirm" type="button" id="modalConfirmBtn" style="${btnConfirmStyle}">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = (result) => {
      backdrop.style.opacity = '0';
      setTimeout(() => backdrop.remove(), 150);
      resolve(result);
    };

    const cancelBtnEl = backdrop.querySelector('#modalCancelBtn');
    const confirmBtnEl = backdrop.querySelector('#modalConfirmBtn');
    if (cancelBtnEl) cancelBtnEl.addEventListener('click', () => close(false));
    if (confirmBtnEl) {
      confirmBtnEl.addEventListener('click', () => close(true));
      confirmBtnEl.focus();
    }
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(false); });
  });
}

function showCustomAlert({ 
  title = 'Notification', 
  message = '', 
  buttonText = 'Got it', 
  type = 'info' 
} = {}) {
  return new Promise((resolve) => {
    const existing = document.querySelector('.custom-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'custom-modal-backdrop';

    const isWarn = type === 'warning';
    const isDanger = type === 'danger';
    const accentGrad = isDanger ? 'linear-gradient(90deg, #ef4444, #dc2626)' : (isWarn ? 'linear-gradient(90deg, #f59e0b, #eab308)' : 'linear-gradient(90deg, #6366f1, #38bdf8)');
    const iconClass = isDanger ? 'modal-icon-danger' : (isWarn ? 'modal-icon-warning' : 'modal-icon-info');
    const btnConfirmStyle = isDanger
      ? 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);'
      : (isWarn ? 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);' : 'background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);');

    backdrop.innerHTML = `
      <div class="custom-modal-box" role="dialog" aria-modal="true">
        <div class="modal-top-accent" style="background:${accentGrad};"></div>
        <div class="modal-icon-badge ${iconClass}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <h3 class="modal-title">${escapeHtml(title)}</h3>
        <p class="modal-message">${escapeHtml(message)}</p>
        <div class="modal-actions-row">
          <button class="btn-modal-confirm" type="button" id="modalConfirmBtn" style="${btnConfirmStyle}; width:100%;">${escapeHtml(buttonText)}</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => {
      backdrop.style.opacity = '0';
      setTimeout(() => backdrop.remove(), 150);
      resolve(true);
    };

    const confirmBtnEl = backdrop.querySelector('#modalConfirmBtn');
    if (confirmBtnEl) {
      confirmBtnEl.addEventListener('click', close);
      confirmBtnEl.focus();
    }
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  });
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
    localStorage.removeItem('srt_saved_session');
    localStorage.setItem('srt_session_last_cleared', String(Date.now()));
    const db = await openSessionDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete('active_session');
  } catch (err) {
    console.warn('Could not clear session from IndexedDB:', err);
  }
}

async function restoreSessionIfAvailable() {
  const lastCleared = localStorage.getItem('srt_session_last_cleared');
  const session = await loadSavedSession();
  if (!session || !session.parsedBlocks || session.parsedBlocks.length === 0) return;

  if (lastCleared && session.timestamp && Number(lastCleared) >= session.timestamp) {
    await clearSavedSession();
    return;
  }

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
    console.log('[Native App] Running inside Android via Capacitor.');
    document.body.classList.add('is-native-app');

    // 1. Android Status Bar Styling
    if (window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar) {
      window.Capacitor.Plugins.StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
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

        // If a dropdown / bottom sheet is open, close it
        const openDropdown = document.querySelector('.custom-select-container.is-open');
        if (openDropdown) {
          closeAllCustomSelects();
          return;
        }

        // If in a Settings sub-screen, return to Settings Hub
        if (document.body.classList.contains('in-settings-subscreen')) {
          closeSettingsSubScreen();
          return;
        }

        // If on Settings view, switch back to Translator main view
        const viewSettings = $('viewSettings');
        if (viewSettings && viewSettings.classList.contains('active')) {
          switchAppTab('translator');
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

// ── Tactile Mobile Haptic Feedback Engine ──
function triggerHaptic(type = 'light') {
  // 1. Capacitor Native Haptics Plugin (Android / iOS native bridge)
  try {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
      const Haptics = window.Capacitor.Plugins.Haptics;
      if (type === 'light') Haptics.impact({ style: 'LIGHT' }).catch(() => {});
      else if (type === 'medium') Haptics.impact({ style: 'MEDIUM' }).catch(() => {});
      else if (type === 'heavy') Haptics.impact({ style: 'HEAVY' }).catch(() => {});
      else if (type === 'success') Haptics.notification({ type: 'SUCCESS' }).catch(() => {});
      else if (type === 'warning') Haptics.notification({ type: 'WARNING' }).catch(() => {});
      return;
    }
  } catch (e) {}

  // 2. Web Vibration API Standard Fallback
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'light') navigator.vibrate(14);
      else if (type === 'medium') navigator.vibrate(28);
      else if (type === 'heavy') navigator.vibrate(50);
      else if (type === 'success') navigator.vibrate([18, 50, 28]);
      else if (type === 'warning') navigator.vibrate([35, 75, 35]);
    }
  } catch (e) {}
}

function initAppSessionReset() {
  // Clear Saved Subtitle Session Data Button
  const resetBtn = $('resetSessionDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      const confirmed = await showCustomConfirm({
        title: 'Clear Session Data?',
        message: 'This will reset any unsaved translation session and clear temporary cached subtitle lines.',
        confirmText: 'Clear Session',
        cancelText: 'Cancel',
        type: 'warning'
      });
      if (confirmed) {
        clearSavedSession();
        state.parsedBlocks = [];
        state.translatedBlocks = [];
        state.uncompressedBlocks = [];
        if (progressCard) progressCard.classList.add('hidden');
        if (resultCard) resultCard.classList.add('hidden');
        showToast('Local subtitle session data cleared.');
      }
    });
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
      console.log('[WakeLock] Screen WakeLock active: Device will stay awake during translation.');
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
      console.log('[WakeLock] Screen WakeLock released.');
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

// ── Initialization & Full Website Load Synchronization ──
let isAppFullyLoaded = false;

function dismissInitialLoader() {
  const loader = $('appInitialLoader');
  if (!loader || isAppFullyLoaded) return;
  isAppFullyLoaded = true;
  loader.classList.add('loader-hidden');
  setTimeout(() => {
    if (loader.parentNode) loader.remove();
  }, 400);
}

// Ensure the website is 100% loaded (window resources, fonts, cloud sync & key verifications) before revealing
async function waitForWebsiteFullLoad() {
  const loadTasks = [];

  // 1. Wait for Full Window Load (stylesheets, scripts, images, and sub-resources)
  if (document.readyState === 'complete') {
    loadTasks.push(Promise.resolve());
  } else {
    loadTasks.push(new Promise(resolve => {
      window.addEventListener('load', resolve, { once: true });
    }));
  }

  // 2. Wait for Web Fonts Layout & Rendering (Plus Jakarta Sans, JetBrains Mono, etc.)
  if (document.fonts && document.fonts.ready) {
    loadTasks.push(document.fonts.ready.catch(() => {}));
  }

  // 3. Wait for Firebase Auth & Cloud Sync (if user logged in, wait for cloud keys/history)
  if (window.FirebaseCloudSync && typeof window.FirebaseCloudSync.waitForInitialSync === 'function') {
    loadTasks.push(window.FirebaseCloudSync.waitForInitialSync().catch(() => {}));
  }

  // 4. Wait for local stored API keys verifications
  if (Array.isArray(window._pendingProviderVerifications) && window._pendingProviderVerifications.length > 0) {
    loadTasks.push(Promise.allSettled(window._pendingProviderVerifications).catch(() => {}));
  }

  // Race all full-load tasks against a failsafe timeout (max 3.5s so offline/slow network never hangs)
  const allLoadedPromise = Promise.all(loadTasks);
  const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3500));

  await Promise.race([allLoadedPromise, timeoutPromise]);

  // Final UI sync pass right before unveiling
  updateApiGuardAndHeaderStatus();
  checkReadyToTranslate();

  // Dismiss loader and reveal the fully prepared, fully styled website seamlessly
  dismissInitialLoader();
}

window.addEventListener('DOMContentLoaded', () => {
  window._pendingProviderVerifications = [];
  initTheme();
  initCustomSelects();
  initFaqAccordion();
  initSeoGuideToggle();
  initMultiProviderHub();
  setupEventListeners();
  updateApiGuardAndHeaderStatus();
  checkReadyToTranslate();
  restoreSessionIfAvailable();
  initNativeAppIntegrations();
  initFirebaseAuthAndCloudSync();

  // Begin monitoring full website load state
  waitForWebsiteFullLoad();
});

// Single global failsafe in case all listeners fail
setTimeout(dismissInitialLoader, 4000);

// ── Native App Platform & Android Browser Detection ──
function initNativeAppIntegrations() {
  const isNative = !!(
    (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' && /Android/i.test(navigator.userAgent))
  );

  const isAndroidBrowser = /Android/i.test(navigator.userAgent) && !isNative;
  const headerApkBtn = document.getElementById('headerApkBtn') || document.querySelector('.header-apk-btn');

  if (isNative) {
    document.body.classList.add('is-native-platform');
    if (headerApkBtn) headerApkBtn.style.display = 'none';
  } else if (isAndroidBrowser) {
    // Show Get APK button ONLY on Android mobile browsers
    if (headerApkBtn) {
      headerApkBtn.style.display = 'inline-flex';
      headerApkBtn.addEventListener('click', () => {
        headerApkBtn.href = `SRTtranslator-latest.apk?t=${Date.now()}`;
      });
    }
  } else {
    // Desktop (Windows, Mac, Linux) & iOS (iPhone, iPad): Hide Get APK button completely
    if (headerApkBtn) headerApkBtn.style.display = 'none';
  }
}

// ── 2-Tab Navigation Engine (Translator vs Settings) ──
function switchAppTab(tabId) {
  triggerHaptic('light');
  const tabBtnTranslator = $('tabBtnTranslator');
  const tabBtnSettings = $('tabBtnSettings');
  const bottomTabBtnTranslator = $('bottomTabBtnTranslator');
  const bottomTabBtnSettings = $('bottomTabBtnSettings');
  const viewTranslator = $('viewTranslator');
  const viewSettings = $('viewSettings');

  if (tabId === 'translator') {
    if (tabBtnTranslator) {
      tabBtnTranslator.classList.add('active');
      tabBtnTranslator.setAttribute('aria-selected', 'true');
    }
    if (tabBtnSettings) {
      tabBtnSettings.classList.remove('active');
      tabBtnSettings.setAttribute('aria-selected', 'false');
    }
    if (bottomTabBtnTranslator) {
      bottomTabBtnTranslator.classList.add('active');
    }
    if (bottomTabBtnSettings) {
      bottomTabBtnSettings.classList.remove('active');
    }
    if (viewTranslator) viewTranslator.classList.add('active');
    if (viewSettings) viewSettings.classList.remove('active');
  } else {
    if (tabBtnTranslator) {
      tabBtnTranslator.classList.remove('active');
      tabBtnTranslator.setAttribute('aria-selected', 'false');
    }
    if (tabBtnSettings) {
      tabBtnSettings.classList.add('active');
      tabBtnSettings.setAttribute('aria-selected', 'true');
    }
    if (bottomTabBtnTranslator) {
      bottomTabBtnTranslator.classList.remove('active');
    }
    if (bottomTabBtnSettings) {
      bottomTabBtnSettings.classList.add('active');
    }
    if (viewTranslator) viewTranslator.classList.remove('active');
    if (viewSettings) viewSettings.classList.add('active');

    // Default to API Keys sub-tab when entering Settings
    switchSettingsSubTab('apikeys');
  }

  // Smooth scroll to top of view on tab switch
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Sub-Tabs Navigation Controllers ──
function switchTranslatorSubTab(subTabId) {
  triggerHaptic('light');
  const btnSettings = $('subTabBtnEngineSettings');
  const btnWorkspace = $('subTabBtnWorkspace');
  const panelSettings = $('subViewEngineSettings');
  const panelWorkspace = $('subViewWorkspace');

  if (subTabId === 'settings' || subTabId === 'engine') {
    if (btnSettings) {
      btnSettings.classList.add('active');
      btnSettings.setAttribute('aria-selected', 'true');
    }
    if (btnWorkspace) {
      btnWorkspace.classList.remove('active');
      btnWorkspace.setAttribute('aria-selected', 'false');
    }
    if (panelSettings) panelSettings.classList.add('active');
    if (panelWorkspace) panelWorkspace.classList.remove('active');
  } else {
    if (btnSettings) {
      btnSettings.classList.remove('active');
      btnSettings.setAttribute('aria-selected', 'false');
    }
    if (btnWorkspace) {
      btnWorkspace.classList.add('active');
      btnWorkspace.setAttribute('aria-selected', 'true');
    }
    if (panelSettings) panelSettings.classList.remove('active');
    if (panelWorkspace) panelWorkspace.classList.add('active');
  }
}

function switchSettingsSubTab(subTabId) {
  triggerHaptic('light');
  const btnApiKeys = $('subTabBtnApiKeys');
  const btnHistory = $('subTabBtnHistory');
  const panelApiKeys = $('subViewApiKeys');
  const panelHistory = $('subViewHistory');

  if (subTabId === 'history') {
    if (btnApiKeys) {
      btnApiKeys.classList.remove('active');
      btnApiKeys.setAttribute('aria-selected', 'false');
    }
    if (btnHistory) {
      btnHistory.classList.add('active');
      btnHistory.setAttribute('aria-selected', 'true');
    }
    if (panelApiKeys) panelApiKeys.classList.remove('active');
    if (panelHistory) panelHistory.classList.add('active');

    // Auto-refresh history when switching to history sub-tab
    if (typeof loadCloudHistory === 'function') {
      loadCloudHistory();
    }
  } else {
    // Default to API Keys
    if (btnApiKeys) {
      btnApiKeys.classList.add('active');
      btnApiKeys.setAttribute('aria-selected', 'true');
    }
    if (btnHistory) {
      btnHistory.classList.remove('active');
      btnHistory.setAttribute('aria-selected', 'false');
    }
    if (panelApiKeys) panelApiKeys.classList.add('active');
    if (panelHistory) panelHistory.classList.remove('active');
  }
}

// ── Native Mobile Settings Hub & Sub-Screen Navigator ──
function openSettingsSubScreen(screenId) {
  triggerHaptic('light');
  document.body.classList.add('in-settings-subscreen');
  
  const backNav = $('nativeSettingsBackNav');
  const titleEl = $('nativeSubscreenTitle');
  if (backNav) backNav.classList.remove('hidden');

  const authSection = $('authSettingsSection');
  const apiSection = $('apiSection');
  const checklistSection = $('apiRequiredChecklist');
  const appInfoSection = $('appInfoSection');
  const cloudHistorySection = $('cloudHistorySection');

  // Reset internal visibility
  if (authSection) authSection.style.display = '';
  if (apiSection) apiSection.style.display = '';
  if (checklistSection) checklistSection.style.display = '';
  if (appInfoSection) appInfoSection.style.display = '';
  if (cloudHistorySection) cloudHistorySection.style.display = '';

  if (screenId === 'providers') {
    if (titleEl) titleEl.textContent = 'AI Providers & API Keys';
    switchSettingsSubTab('apikeys');
    if (authSection) authSection.style.display = 'none';
    if (checklistSection) checklistSection.style.display = 'none';
    if (appInfoSection) appInfoSection.style.display = 'none';
    if (apiSection) {
      apiSection.style.display = 'block';
      apiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else if (screenId === 'status') {
    if (titleEl) titleEl.textContent = 'Required AI Keys Status';
    switchSettingsSubTab('apikeys');
    if (authSection) authSection.style.display = 'none';
    if (apiSection) apiSection.style.display = 'none';
    if (appInfoSection) appInfoSection.style.display = 'none';
    if (checklistSection) {
      checklistSection.style.display = 'block';
      checklistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else if (screenId === 'history') {
    if (titleEl) titleEl.textContent = 'Subtitle History & Sync';
    switchSettingsSubTab('history');
    if (cloudHistorySection) {
      cloudHistorySection.style.display = 'block';
      cloudHistorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else if (screenId === 'appinfo') {
    if (titleEl) titleEl.textContent = 'App Info & Preferences';
    switchSettingsSubTab('apikeys');
    if (authSection) authSection.style.display = 'none';
    if (apiSection) apiSection.style.display = 'none';
    if (checklistSection) checklistSection.style.display = 'none';
    if (appInfoSection) {
      appInfoSection.style.display = 'block';
      appInfoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function closeSettingsSubScreen() {
  triggerHaptic('light');
  document.body.classList.remove('in-settings-subscreen');
  const backNav = $('nativeSettingsBackNav');
  if (backNav) backNav.classList.add('hidden');

  const authSection = $('authSettingsSection');
  const apiSection = $('apiSection');
  const checklistSection = $('apiRequiredChecklist');
  const appInfoSection = $('appInfoSection');
  const cloudHistorySection = $('cloudHistorySection');

  if (authSection) authSection.style.display = '';
  if (apiSection) apiSection.style.display = '';
  if (checklistSection) checklistSection.style.display = '';
  if (appInfoSection) appInfoSection.style.display = '';
  if (cloudHistorySection) cloudHistorySection.style.display = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNativeSettingsHub() {
  const hubItemProviders = $('hubItemProviders');
  const hubItemStatus = $('hubItemStatus');
  const hubItemHistory = $('hubItemHistory');
  const hubItemAppInfo = $('hubItemAppInfo');
  const btnBack = $('btnBackToSettingsHub');

  if (hubItemProviders) hubItemProviders.addEventListener('click', () => openSettingsSubScreen('providers'));
  if (hubItemStatus) hubItemStatus.addEventListener('click', () => openSettingsSubScreen('status'));
  if (hubItemHistory) hubItemHistory.addEventListener('click', () => openSettingsSubScreen('history'));
  if (hubItemAppInfo) hubItemAppInfo.addEventListener('click', () => openSettingsSubScreen('appinfo'));
  if (btnBack) btnBack.addEventListener('click', closeSettingsSubScreen);
}

function hasGeminiApiKey() {
  const memKey = state.apiKeys.gemini ? state.apiKeys.gemini.trim() : '';
  const storedKey = (localStorage.getItem('gemini_api_key') || '').trim();
  const hasKeyString = (memKey.length > 5) || (storedKey.length > 5);
  return state.providerStatus.gemini?.connected === true || (hasKeyString && state.providerStatus.gemini?.connected !== false);
}

function hasOpenRouterApiKey() {
  const memKey = state.apiKeys.openrouter ? state.apiKeys.openrouter.trim() : '';
  const storedKey = (localStorage.getItem('openrouter_api_key') || '').trim();
  const hasKeyString = (memKey.length > 5) || (storedKey.length > 5);
  return state.providerStatus.openrouter?.connected === true || (hasKeyString && state.providerStatus.openrouter?.connected !== false);
}

function hasRequiredMandatoryApiKeys() {
  return hasGeminiApiKey() && hasOpenRouterApiKey();
}

function hasAnyConnectedApiKey() {
  return hasRequiredMandatoryApiKeys();
}

function getConnectedProviderNames() {
  const connected = Object.keys(AI_PROVIDERS).filter(pid => {
    if (pid === 'custom') {
      const storedUrl = (localStorage.getItem('custom_api_base_url') || '').trim();
      return state.providerStatus.custom?.connected === true || (storedUrl.length > 5 && state.providerStatus.custom?.connected !== false);
    }
    const memKey = state.apiKeys[pid] ? state.apiKeys[pid].trim() : '';
    const storedKey = (localStorage.getItem(AI_PROVIDERS[pid].storageKey) || '').trim();
    const hasKeyString = (memKey.length > 5) || (storedKey.length > 5);
    return state.providerStatus[pid]?.connected === true || (hasKeyString && state.providerStatus[pid]?.connected !== false);
  });
  return connected.map(pid => AI_PROVIDERS[pid]?.name || pid);
}

function setSelectDisabledState(selectEl, isDisabled) {
  if (!selectEl) return;
  selectEl.disabled = isDisabled;
  const wrapper = selectEl.closest('.select-wrapper');
  if (wrapper) {
    wrapper.classList.toggle('is-disabled', isDisabled);
    const customContainer = wrapper.querySelector('.custom-select-container');
    if (customContainer) {
      customContainer.classList.toggle('is-disabled', isDisabled);
    }
  }
}

function updateControlsLockState() {
  const isTranslating = state.isTranslating || state.isCondensing;
  const isPaused = state.isPaused;
  const isActivelyRunning = isTranslating && !isPaused;

  // 1. Target Language (#targetLang): LOCKED once translation process starts, EVEN IF PAUSED.
  setSelectDisabledState(targetLang, isTranslating);

  // 2. Subtitle Pacing Preset (#styleMode): LOCKED once translation process starts, EVEN IF PAUSED.
  setSelectDisabledState(styleMode, isTranslating);

  // 3. AI Model (#modelSelect): LOCKED during active translation, BUT UNLOCKED when PAUSED.
  setSelectDisabledState(modelSelect, isActivelyRunning);

  // 4. API Key Remove Buttons (.btn-remove-key): LOCKED during active translation, BUT UNLOCKED when PAUSED.
  document.querySelectorAll('.btn-remove-key').forEach(btn => {
    btn.disabled = isActivelyRunning;
    if (isActivelyRunning) {
      btn.classList.add('is-disabled');
      btn.style.opacity = '0.45';
      btn.style.cursor = 'not-allowed';
      btn.title = 'Pause translation to remove API key';
    } else {
      btn.classList.remove('is-disabled');
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.title = '';
    }
  });

  // 5. Google Sign Out Buttons: LOCKED during active translation or condensing
  const googleSignOutBtn = $('googleSignOutBtn');
  const settingsSignOutBtn = $('settingsSignOutBtn');
  if (googleSignOutBtn) {
    googleSignOutBtn.disabled = isTranslating;
    googleSignOutBtn.style.opacity = isTranslating ? '0.45' : '';
    googleSignOutBtn.style.cursor = isTranslating ? 'not-allowed' : '';
  }
  if (settingsSignOutBtn) {
    settingsSignOutBtn.disabled = isTranslating;
    settingsSignOutBtn.style.opacity = isTranslating ? '0.45' : '';
    settingsSignOutBtn.style.cursor = isTranslating ? 'not-allowed' : '';
  }
}

function updateApiGuardAndHeaderStatus() {
  const headerBadge = $('headerAiBadge');
  const headerText = $('headerAiStatusText');
  const settingsNavDot = $('settingsNavDot');
  const bottomNavDot = $('bottomNavDot');

  const hasGemini = hasGeminiApiKey();
  const hasOpenRouter = hasOpenRouterApiKey();
  const allMandatoryConnected = hasGemini && hasOpenRouter;

  if (!allMandatoryConnected) {
    if (headerBadge) {
      headerBadge.className = 'header-ai-status-badge badge-off';
      if (headerText) headerText.textContent = 'No API Key';
    }
    if (settingsNavDot) {
      settingsNavDot.className = 'settings-nav-dot dot-off';
      settingsNavDot.title = 'API Keys Required';
    }
    if (bottomNavDot) {
      bottomNavDot.className = 'bottom-nav-dot dot-off';
    }
  } else {
    const connectedNames = getConnectedProviderNames();
    if (headerBadge) {
      headerBadge.className = 'header-ai-status-badge badge-on';
      if (headerText) headerText.textContent = 'API Connected';
    }
    if (settingsNavDot) {
      settingsNavDot.className = 'settings-nav-dot dot-on';
      settingsNavDot.title = `Connected (${connectedNames.join(', ')})`;
    }
    if (bottomNavDot) {
      bottomNavDot.className = 'bottom-nav-dot dot-on';
    }
  }

  updateRequiredChecklistUI();
  checkReadyToTranslate();
  updateControlsLockState();
}

function updateRequiredChecklistUI() {
  const hasGemini = hasGeminiApiKey();
  const hasOpenRouter = hasOpenRouterApiKey();

  const itemGemini = $('checkItemGemini');
  const iconGemini = $('checkIconGemini');
  const statusTextGemini = $('checkStatusTextGemini');
  const actionGemini = $('checkActionGemini');

  const itemOpenRouter = $('checkItemOpenRouter');
  const iconOpenRouter = $('checkIconOpenRouter');
  const statusTextOpenRouter = $('checkStatusTextOpenRouter');
  const actionOpenRouter = $('checkActionOpenRouter');

  const overallBadge = $('checklistOverallBadge');

  let connectedCount = 0;
  if (hasGemini) connectedCount++;
  if (hasOpenRouter) connectedCount++;

  // Update Gemini Item
  if (itemGemini) {
    if (hasGemini) {
      itemGemini.className = 'checklist-item is-connected';
      if (iconGemini) {
        iconGemini.className = 'checklist-status-icon status-connected';
        iconGemini.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
      }
      if (statusTextGemini) {
        statusTextGemini.textContent = 'Connected';
        statusTextGemini.className = 'checklist-item-status-text status-connected';
      }
      if (actionGemini) actionGemini.textContent = 'Manage';
    } else {
      itemGemini.className = 'checklist-item is-missing';
      if (iconGemini) {
        iconGemini.className = 'checklist-status-icon status-missing';
        iconGemini.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      }
      if (statusTextGemini) {
        statusTextGemini.textContent = 'Not Connected';
        statusTextGemini.className = 'checklist-item-status-text status-missing';
      }
      if (actionGemini) actionGemini.textContent = 'Configure \u2192';
    }
  }

  // Update OpenRouter Item
  if (itemOpenRouter) {
    if (hasOpenRouter) {
      itemOpenRouter.className = 'checklist-item is-connected';
      if (iconOpenRouter) {
        iconOpenRouter.className = 'checklist-status-icon status-connected';
        iconOpenRouter.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
      }
      if (statusTextOpenRouter) {
        statusTextOpenRouter.textContent = 'Connected';
        statusTextOpenRouter.className = 'checklist-item-status-text status-connected';
      }
      if (actionOpenRouter) actionOpenRouter.textContent = 'Manage';
    } else {
      itemOpenRouter.className = 'checklist-item is-missing';
      if (iconOpenRouter) {
        iconOpenRouter.className = 'checklist-status-icon status-missing';
        iconOpenRouter.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      }
      if (statusTextOpenRouter) {
        statusTextOpenRouter.textContent = 'Not Connected';
        statusTextOpenRouter.className = 'checklist-item-status-text status-missing';
      }
      if (actionOpenRouter) actionOpenRouter.textContent = 'Configure \u2192';
    }
  }

  // Update Overall Badge
  if (overallBadge) {
    if (connectedCount === 2) {
      overallBadge.className = 'checklist-status-badge badge-all-done';
      overallBadge.textContent = '2/2 Connected';
    } else if (connectedCount === 1) {
      overallBadge.className = 'checklist-status-badge badge-partial';
      overallBadge.textContent = '1/2 Connected (1 Missing)';
    } else {
      overallBadge.className = 'checklist-status-badge badge-none';
      overallBadge.textContent = '0/2 Connected';
    }
  }
}

// ── Multi-AI Provider Engine & State Manager ──
function switchProviderTab(providerId) {
  state.activeTabProvider = providerId;

  const providerSelect = $('providerSelect');
  const providerSelectedTag = $('providerSelectedTag');
  const pConf = AI_PROVIDERS[providerId];

  if (providerSelect && providerSelect.value !== providerId) {
    providerSelect.value = providerId;
    refreshCustomSelect('providerSelect');
  }

  if (providerSelectedTag && pConf) {
    const badge = pConf.badge ? ` (${pConf.badge})` : '';
    providerSelectedTag.textContent = `${pConf.name}${badge}`;
  }

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

  // Load saved keys for each provider (Priority: Gemini, OpenRouter, Groq, DeepSeek, OpenAI, Custom)
  let atLeastOneConnected = false;
  ['gemini', 'openrouter', 'groq', 'deepseek', 'openai', 'custom'].forEach(pid => {
    const pConf = AI_PROVIDERS[pid];
    const savedKey = (localStorage.getItem(pConf.storageKey) || '').trim();
    const savedBaseUrl = pid === 'custom' ? (localStorage.getItem('custom_api_base_url') || '').trim() : '';
    const savedModelName = pid === 'custom' ? (localStorage.getItem('custom_api_model_name') || '').trim() : '';

    if (pid === 'custom') {
      const urlInp = $('customApiBaseUrl');
      const modelInp = $('customApiModelName');
      const keyInp = $('apiKeyInput_custom');
      if (urlInp && savedBaseUrl) urlInp.value = savedBaseUrl;
      if (modelInp && savedModelName) modelInp.value = savedModelName;
      if (keyInp && savedKey) keyInp.value = savedKey;
    }

    if (savedKey || (pid === 'custom' && savedBaseUrl)) {
      state.apiKeys[pid] = savedKey;
      if (pid === 'gemini') {
        state.apiKey = savedKey;
        if (apiKeyInput) apiKeyInput.value = savedKey;
      } else if (pid !== 'custom') {
        const inp = $(`apiKeyInput_${pid}`);
        if (inp) inp.value = savedKey;
      }
      showProviderFeedback(pid, 'Stored endpoint loaded. Verifying...', 'ok');
      const vPromise = verifyAndLoadProvider(pid, savedKey);
      if (Array.isArray(window._pendingProviderVerifications)) {
        window._pendingProviderVerifications.push(vPromise);
      }
      atLeastOneConnected = true;
    } else {
      updateProviderStatusUI(pid, false);
    }
  });

  // Load saved User Preferences (Translate In language & Subtitle Pacing Preset)
  const savedLang = localStorage.getItem('preferred_target_lang');
  if (savedLang && targetLang) {
    targetLang.value = savedLang;
    refreshCustomSelect('targetLang');
  }

  const savedPacing = localStorage.getItem('preferred_pacing_preset');
  if (savedPacing && styleMode) {
    styleMode.value = savedPacing;
    refreshCustomSelect('styleMode');
  }

  updateApiGuardAndHeaderStatus();

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

  let rawKey = inp ? inp.value.trim().replace(/^["']|["']$/g, '') : '';

  if (providerId === 'custom') {
    const urlInp = $('customApiBaseUrl');
    const modelInp = $('customApiModelName');
    const rawBaseUrl = urlInp ? urlInp.value.trim() : '';
    const baseUrl = normalizeCustomBaseUrl(rawBaseUrl);
    const modelName = modelInp ? modelInp.value.trim() : '';

    if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
      showProviderFeedback('custom', 'Please enter a valid API Base URL (must start with http:// or https://).', 'err');
      return;
    }

    if (urlInp && urlInp.value !== baseUrl) {
      urlInp.value = baseUrl;
    }

    localStorage.setItem('custom_api_base_url', baseUrl);
    if (modelName) localStorage.setItem('custom_api_model_name', modelName);
  } else {
    if (!rawKey || rawKey.length < 5) {
      showProviderFeedback(providerId, `Please enter a valid ${pConf.name} API Key.`, 'err');
      return;
    }
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>Verifying...</span>';
  }
  showProviderFeedback(providerId, `Connecting & verifying with ${pConf.name}...`, 'ok');

  try {
    await verifyAndLoadProvider(providerId, rawKey);
    // If logged in to Google account, automatically backup to cloud
    if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
      window.FirebaseCloudSync.saveKeysToCloud(state.apiKeys);
    }
  } finally {
    updateApiGuardAndHeaderStatus();
    checkReadyToTranslate();
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>Connect ${pConf.name}</span>`;
    }
  }
}

async function handleRemoveProviderKey(providerId) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) return;

  if (state.isTranslating && !state.isPaused) {
    showToast('Cannot disconnect API key while translation is running. Please pause the translation first.', true);
    return;
  }

  const confirmed = await showConfirmModal({
    title: `Disconnect ${pConf.name}?`,
    message: `Are you sure you want to disconnect and remove your ${pConf.name} API key? It will be removed from this session.`,
    confirmText: 'Yes, Disconnect',
    cancelText: 'Cancel',
    iconType: 'warning',
    confirmBtnClass: 'btn btn-modal-confirm'
  });

  if (!confirmed) return;

  // Clear memory & localStorage keys
  state.apiKeys[providerId] = '';
  localStorage.removeItem(pConf.storageKey);

  if (providerId === 'gemini') {
    state.apiKey = '';
    localStorage.removeItem('gemini_api_key');
  } else if (providerId === 'custom') {
    localStorage.removeItem('custom_api_key');
    localStorage.removeItem('custom_api_base_url');
    localStorage.removeItem('custom_api_model_name');
    const urlInp = $('customApiBaseUrl');
    const modelInp = $('customApiModelName');
    if (urlInp) urlInp.value = '';
    if (modelInp) modelInp.value = '';
    renderCustomDetectedModels([]);
  }

  // Reset provider state
  state.providerStatus[providerId] = {
    connected: false,
    models: [],
    lastChecked: null,
    lastLatency: null
  };

  // Clear input in UI
  const inp = providerId === 'gemini' ? apiKeyInput : $(`apiKeyInput_${providerId}`);
  if (inp) {
    inp.value = '';
    inp.type = 'password';
  }

  // Reset eye icon to open eye
  const eyeBtn = providerId === 'gemini' ? toggleApiKey : $(`toggleApiKey_${providerId}`);
  if (eyeBtn) {
    eyeBtn.title = 'Show or hide key';
    eyeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }

  // Update UI and feedback
  updateProviderStatusUI(providerId, false);
  showProviderFeedback(providerId, `${pConf.name} disconnected & removed.`, 'ok');

  // If logged in to Google account, sync updated keys to cloud
  if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
    window.FirebaseCloudSync.saveKeysToCloud({
      ...state.apiKeys,
      custom_api_base_url: localStorage.getItem('custom_api_base_url') || '',
      custom_api_model_name: localStorage.getItem('custom_api_model_name') || ''
    });
  }

  // Check if any other provider is still connected
  const anyConnected = Object.values(state.providerStatus).some(ps => ps.connected);
  if (!anyConnected) {
    resetQuotaDashboardToDisconnected('No API Key');
  }

  // Refresh model dropdown, lockout guard, and readiness
  populateCombinedModelDropdown();
  updateApiGuardAndHeaderStatus();
  checkReadyToTranslate();

  if (inp) {
    setTimeout(() => inp.focus(), 50);
  }
}

async function verifyAndLoadProvider(providerId, key) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) return;
  if (providerId !== 'custom' && !key) return;
  if (providerId === 'custom' && !key && !localStorage.getItem('custom_api_base_url') && !$('customApiBaseUrl')?.value) return;

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
        if (!hasGenContent || (!id.startsWith('gemini') && !id.startsWith('gemma'))) return false;
        const nonText = ['tts', 'banana', 'nano', 'robotics', 'transcribe', 'clip', 'deep-research', 'embedding', 'embed', 'imagen', 'image', 'audio', 'realtime'];
        return !nonText.some(t => id.includes(t));
      });

      if (textModels.length === 0) {
        throw new Error('No compatible translation models available for this Gemini API Key.');
      }

      // Dynamic real-time sorting by mathematical version number descending (e.g. 10.0 > 6.0 > 5.0 > 4.5 > 4.0 > 3.5 > 3.0)
      textModels.sort((a, b) => {
        const idA = a.name.replace(/^models\//, '').toLowerCase();
        const idB = b.name.replace(/^models\//, '').toLowerCase();
        const vA = getGeminiVersionNumber(idA);
        const vB = getGeminiVersionNumber(idB);
        if (vB !== vA) return vB - vA;
        const score = (id) => {
          if (id.includes('pro')) return 3;
          if (id.includes('flash') && !id.includes('lite')) return 2;
          if (id.includes('lite')) return 1;
          return 0;
        };
        return score(idB) - score(idA);
      });

      loadedModels = textModels.map(m => {
        const id = m.name.replace(/^models\//, '');
        const verNum = getGeminiVersionNumber(id);
        const isPro = id.includes('pro');
        const isLite = id.includes('lite');
        return {
          id,
          displayName: m.displayName || id,
          version: verNum > 0 ? `${verNum}` : (m.version || 'Google AI'),
          inputTokens: m.inputTokenLimit || 1048576,
          outputTokens: m.outputTokenLimit || 8192,
          rpm: isLite ? '30 RPM' : (isPro ? '5 RPM' : '15 RPM'),
          rpd: isPro ? '1,000 RPD' : '1,500 RPD',
          desc: m.description || (isLite ? 'Gemini Ultra-Fast Lite' : (isPro ? 'Pro Deep Reasoning' : 'Fast Production Model')),
          providerId: 'gemini',
          livePingMs: probeMs
        };
      });

      state.apiKeys.gemini = key;
      state.apiKey = key;
      localStorage.setItem('gemini_api_key', key);

      // Keep auto selected by default, or select top model if a specific model was missing
      if (state.selectedModel !== 'auto' && !loadedModels.some(m => m.id === state.selectedModel)) {
        state.selectedModel = 'auto';
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
      // 1. Strict OpenRouter Key Authentication (Endpoint returns 401 if invalid)
      const authRes = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      probeMs = Math.round(performance.now() - startTime);

      if (!authRes.ok) {
        const errJson = await authRes.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${authRes.status}: Invalid OpenRouter API Key.`);
      }

      // 2. Fetch models
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}: Failed to retrieve models from OpenRouter.`);
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
    } else if (providerId === 'custom') {
      const rawBaseUrl = (localStorage.getItem('custom_api_base_url') || $('customApiBaseUrl')?.value || '').trim();
      const baseUrl = normalizeCustomBaseUrl(rawBaseUrl);
      const modelName = (localStorage.getItem('custom_api_model_name') || $('customApiModelName')?.value || '').trim();

      if (!baseUrl) {
        throw new Error('Please enter a valid API Base URL (e.g. https://api.together.xyz/v1 or http://localhost:11434/v1)');
      }

      const headers = { 'Content-Type': 'application/json' };
      if (key && key.trim()) {
        headers['Authorization'] = `Bearer ${key.trim()}`;
      }

      let fetchedModels = [];
      try {
        const res = await fetch(`${baseUrl}/models`, { headers });
        probeMs = Math.round(performance.now() - startTime);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
          fetchedModels = list.map(m => (typeof m === 'string' ? m : (m.id || m.name))).filter(Boolean);
        }
      } catch (e) {
        probeMs = Math.round(performance.now() - startTime);
        console.warn('Could not auto-fetch custom models list:', e);
      }

      if (fetchedModels.length > 0) {
        renderCustomDetectedModels(fetchedModels);
        loadedModels = fetchedModels.slice(0, 30).map(mId => ({
          id: mId,
          displayName: mId,
          version: 'Custom',
          inputTokens: 128000,
          outputTokens: 8192,
          rpm: 'Custom',
          rpd: 'Custom',
          desc: `Custom Endpoint: ${baseUrl}`,
          providerId: 'custom',
          livePingMs: probeMs
        }));
      } else {
        const activeModel = modelName || 'custom-model';
        loadedModels = [{
          id: activeModel,
          displayName: activeModel,
          version: 'Custom',
          inputTokens: 128000,
          outputTokens: 8192,
          rpm: 'Custom',
          rpd: 'Custom',
          desc: `Custom Endpoint: ${baseUrl}`,
          providerId: 'custom',
          livePingMs: probeMs
        }];
      }

      state.apiKeys.custom = key || '';
      localStorage.setItem('custom_api_key', key || '');
      localStorage.setItem('custom_api_base_url', baseUrl);
      if (modelName) localStorage.setItem('custom_api_model_name', modelName);
    }

    state.providerStatus[providerId] = {
      connected: true,
      models: loadedModels,
      lastLatency: probeMs
    };

    showProviderFeedback(providerId, `Connected! ${loadedModels.length} live models verified (Ping: ${probeMs}ms).`, 'ok');
    updateProviderStatusUI(providerId, true, `${loadedModels.length} models, ${probeMs}ms`);

    updateApiGuardAndHeaderStatus();
    populateCombinedModelDropdown();
    updateQuotaDashboardForActiveModel();
    checkReadyToTranslate();
  } catch (err) {
    console.warn(`Error verifying ${pConf.name}:`, err);
    state.providerStatus[providerId] = { connected: false, models: [], lastLatency: 0 };
    showProviderFeedback(providerId, `${pConf.name} Error: ${err.message}`, 'err');
    updateProviderStatusUI(providerId, false);
    updateApiGuardAndHeaderStatus();
    populateCombinedModelDropdown();
    checkReadyToTranslate();
  }
}

function normalizeCustomBaseUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim().replace(/\/+$/, '');
  url = url.replace(/\/chat\/completions\/?$/i, '').replace(/\/models\/?$/i, '');
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '' || parsed.pathname === '/') {
      parsed.pathname = '/v1';
      url = parsed.toString().replace(/\/+$/, '');
    }
  } catch (e) {
    // If malformed or relative, leave sanitized string
  }
  return url;
}

function renderCustomDetectedModels(models = []) {
  const box = $('customDetectedModelsBox');
  const countEl = $('customDetectedCount');
  const listEl = $('customDetectedModelsList');
  const modelInp = $('customApiModelName');

  if (!box || !listEl) return;

  if (!Array.isArray(models) || models.length === 0) {
    box.classList.add('hidden');
    listEl.innerHTML = '';
    return;
  }

  const currentActive = (modelInp ? modelInp.value.trim() : '') || localStorage.getItem('custom_api_model_name') || '';
  if (countEl) countEl.textContent = `${models.length} model${models.length > 1 ? 's' : ''}`;

  listEl.innerHTML = '';
  models.forEach(m => {
    const mId = typeof m === 'string' ? m : (m.id || m.name || '');
    if (!mId) return;

    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `detected-model-pill ${mId === currentActive ? 'active' : ''}`;
    pill.textContent = mId;
    pill.title = `Click to set "${mId}" as default Custom Model`;

    pill.addEventListener('click', (e) => {
      e.preventDefault();
      if (modelInp) {
        modelInp.value = mId;
        localStorage.setItem('custom_api_model_name', mId);
      }
      listEl.querySelectorAll('.detected-model-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      showProviderFeedback('custom', `Selected model: ${mId}`, 'ok');
    });

    listEl.appendChild(pill);
  });

  box.classList.remove('hidden');
}

async function handleTestPingCustom() {
  const urlInp = $('customApiBaseUrl');
  const keyInp = $('apiKeyInput_custom');
  const rawUrl = urlInp ? urlInp.value.trim() : '';
  const key = keyInp ? keyInp.value.trim() : '';

  const baseUrl = normalizeCustomBaseUrl(rawUrl);
  if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
    showProviderFeedback('custom', 'Please enter a valid API Base URL starting with http:// or https://', 'err');
    return;
  }

  if (urlInp && urlInp.value !== baseUrl) {
    urlInp.value = baseUrl;
  }

  showProviderFeedback('custom', `Pinging ${baseUrl}...`, 'ok');
  const testBtn = $('testPing_custom');
  if (testBtn) {
    testBtn.disabled = true;
    testBtn.innerHTML = '<span>Pinging...</span>';
  }

  const startTime = performance.now();
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (key) headers['Authorization'] = `Bearer ${key}`;

    const res = await fetch(`${baseUrl}/models`, { headers });
    const latency = Math.round(performance.now() - startTime);

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      const modelNames = list.map(m => (typeof m === 'string' ? m : (m.id || m.name))).filter(Boolean);

      if (modelNames.length > 0) {
        renderCustomDetectedModels(modelNames);
        showProviderFeedback('custom', `Endpoint reachable! Ping: ${latency}ms (${modelNames.length} models detected).`, 'ok');
      } else {
        showProviderFeedback('custom', `Endpoint reachable! Ping: ${latency}ms.`, 'ok');
      }
    } else {
      showProviderFeedback('custom', `Endpoint responded with HTTP ${res.status} (${latency}ms). Please check your URL & Key.`, 'err');
    }
  } catch (err) {
    const latency = Math.round(performance.now() - startTime);
    const isLocal = /localhost|127\.0\.0\.1/i.test(baseUrl);
    const corsMsg = isLocal
      ? `Could not reach ${baseUrl} (${latency}ms). Tip: Start Ollama with OLLAMA_ORIGINS="*" ollama serve to allow browser access.`
      : `Network error reaching ${baseUrl} (${err.message || 'Check URL & CORS'}).`;
    showProviderFeedback('custom', corsMsg, 'err');
  } finally {
    if (testBtn) {
      testBtn.disabled = false;
      testBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;margin-right:4px;vertical-align:-2px;">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <span>Test Ping</span>
      `;
    }
  }
}

function updateProviderStatusUI(providerId, isConnected, extraText = '') {
  const dot = $(`statusDot_${providerId}`);
  const chip = $(`chip_${providerId}`);
  const removeBtn = $(`removeApiKey_${providerId}`);
  const saveBtn = providerId === 'gemini' ? saveApiKey : $(`saveApiKey_${providerId}`);
  const inp = providerId === 'gemini' ? apiKeyInput : $(`apiKeyInput_${providerId}`);
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) return;

  if (inp) {
    inp.readOnly = isConnected;
    if (isConnected) {
      inp.classList.add('input-locked');
      inp.setAttribute('title', 'API Key is connected. Click Disconnect to modify.');
    } else {
      inp.classList.remove('input-locked');
      inp.removeAttribute('title');
    }
  }

  if (providerId === 'custom') {
    const urlInp = $('customApiBaseUrl');
    const modelInp = $('customApiModelName');
    if (urlInp) {
      urlInp.readOnly = isConnected;
      if (isConnected) {
        urlInp.classList.add('input-locked');
        urlInp.setAttribute('title', 'Endpoint is connected. Click Disconnect to modify.');
      } else {
        urlInp.classList.remove('input-locked');
        urlInp.removeAttribute('title');
      }
    }
    if (modelInp) {
      modelInp.readOnly = isConnected;
      if (isConnected) {
        modelInp.classList.add('input-locked');
        modelInp.setAttribute('title', 'Model is connected. Click Disconnect to modify.');
      } else {
        modelInp.classList.remove('input-locked');
        modelInp.removeAttribute('title');
      }
    }
  }

  if (saveBtn) {
    saveBtn.style.display = isConnected ? 'none' : 'inline-flex';
  }

  if (removeBtn) {
    removeBtn.style.display = isConnected ? 'inline-flex' : 'none';
  }

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
    modelSelect.innerHTML = '<option value="" disabled selected>Connect API keys in Settings to load models...</option>';
    if (modelLiveBadge) {
      modelLiveBadge.textContent = 'Awaiting API Keys';
      modelLiveBadge.className = 'hint-tag';
    }
    syncCustomSelectDisabled('modelSelect');
    refreshCustomSelect('modelSelect');
    return;
  }

  // Add Real-Time Dynamic Auto-Selection Option at top
  const autoOpt = document.createElement('option');
  autoOpt.value = 'auto';
  autoOpt.textContent = 'Auto Select';
  modelSelect.appendChild(autoOpt);

  let totalModelsCount = 0;

  // Sort connected providers (Gemini, OpenRouter, Groq, DeepSeek, OpenAI, Custom)
  const providerOrder = ['gemini', 'openrouter', 'groq', 'deepseek', 'openai', 'custom'];
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
    const badgeLabel = pConf.badge ? ` (${pConf.badge})` : '';
    optgroup.label = `${pConf.name}${badgeLabel} (${pModels.length} live models${ping})`;

    pModels.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.displayName || m.id;
      optgroup.appendChild(opt);
    });

    modelSelect.appendChild(optgroup);
  });

  modelSelect.disabled = false;
  
  // Default to 'auto' for best real-time experience unless user specifically selected a valid model
  const existingSelection = state.selectedModel;
  const isExistingValid = existingSelection && existingSelection !== 'auto' && Array.from(modelSelect.options).some(o => o.value === existingSelection);
  if (isExistingValid) {
    modelSelect.value = existingSelection;
  } else {
    modelSelect.value = 'auto';
    state.selectedModel = 'auto';
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
  checkReadyToTranslate();
}

// Dynamic Model Failure & Cooldown Tracker
const modelHealthTracker = {
  failures: new Map(),
  sessionFailedModels: new Set(),

  recordFailure(providerId, modelId, isPermanent, error) {
    const cleanId = (modelId || '').replace(/^models\//, '').trim().toLowerCase();
    const key = `${providerId}:${cleanId}`;
    this.sessionFailedModels.add(key);
    this.failures.set(key, {
      failedAt: Date.now(),
      isPermanent: !!isPermanent,
      error: error || 'Unknown failure'
    });
  },

  isAvailable(providerId, modelId) {
    const cleanId = (modelId || '').replace(/^models\//, '').trim().toLowerCase();
    const key = `${providerId}:${cleanId}`;
    if (this.sessionFailedModels.has(key)) return false;
    const entry = this.failures.get(key);
    if (!entry) return true;
    if (entry.isPermanent) return false;
    // 10-minute cooldown for rate limit or server busy (prevents bouncing back to failed model mid-file)
    if (Date.now() - entry.failedAt < 600000) {
      return false;
    }
    this.failures.delete(key);
    return true;
  },

  resetSession() {
    this.sessionFailedModels.clear();
  },

  reset() {
    this.failures.clear();
    this.sessionFailedModels.clear();
  }
};

function getGeminiVersionNumber(id) {
  if (!id) return 0;
  const str = String(id).toLowerCase().replace(/^models\//, '').replace(/^google\//, '');
  const m = str.match(/gemini[^\d]*(\d+(?:\.\d+)?)/i) || str.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function isGeminiProOrFlash(providerId, modelId) {
  const mid = (modelId || '').toLowerCase().replace(/^models\//, '').replace(/^google\//, '');
  if (!mid.includes('gemini') && providerId !== 'gemini') return false;
  if (mid.includes('lite')) return false;
  if (!mid.includes('pro') && !mid.includes('flash')) return false;
  // STRICT RULE: Exclude versions below 3.0 (only >= 3.0 allowed)
  const ver = getGeminiVersionNumber(modelId);
  return ver >= 3.0;
}

function isGeminiLite(providerId, modelId) {
  const mid = (modelId || '').toLowerCase().replace(/^models\//, '').replace(/^google\//, '');
  if (!mid.includes('gemini') && providerId !== 'gemini') return false;
  if (!mid.includes('lite')) return false;
  // STRICT RULE: Exclude versions below 3.0 (only >= 3.0 allowed)
  const ver = getGeminiVersionNumber(modelId);
  return ver >= 3.0;
}

function getAllGeminiProFlashModels(providerId = 'gemini') {
  const liveList = (state.providerStatus[providerId]?.models || []).map(m => typeof m === 'string' ? m : m.id);
  const presetList = (AI_PROVIDERS[providerId]?.models || []).map(m => m.id);
  
  const combined = Array.from(new Set([...liveList, ...presetList]));
  return combined
    .filter(mId => isGeminiProOrFlash(providerId, mId))
    .sort((a, b) => {
      const verDiff = getGeminiVersionNumber(b) - getGeminiVersionNumber(a);
      if (verDiff !== 0) return verDiff;
      const aPro = a.toLowerCase().includes('pro') ? 1 : 0;
      const bPro = b.toLowerCase().includes('pro') ? 1 : 0;
      return bPro - aPro;
    });
}

function getAllGeminiLiteModels(providerId = 'gemini') {
  const liveList = (state.providerStatus[providerId]?.models || []).map(m => typeof m === 'string' ? m : m.id);
  const presetList = (AI_PROVIDERS[providerId]?.models || []).map(m => m.id);
  
  const combined = Array.from(new Set([...liveList, ...presetList]));
  return combined
    .filter(mId => isGeminiLite(providerId, mId))
    .sort((a, b) => getGeminiVersionNumber(b) - getGeminiVersionNumber(a));
}

function resolveRealTimeBestModel() {
  if (state.selectedModel && state.selectedModel !== 'auto') {
    const { providerId, model, key } = getActiveProviderAndKey(state.selectedModel);
    if (key && modelHealthTracker.isAvailable(providerId, model)) {
      return { providerId, model, key, displayName: state.selectedModel };
    }
  }

  // 1. Phase 1: Google Gemini Pro & Flash (Highest Version to Lowest, Dynamic)
  if (state.apiKeys.gemini && state.providerStatus.gemini?.connected !== false) {
    const proFlashList = getAllGeminiProFlashModels('gemini');
    for (const mId of proFlashList) {
      if (modelHealthTracker.isAvailable('gemini', mId)) {
        const mObj = (AI_PROVIDERS.gemini.models || []).find(m => m.id === mId) || 
                     (state.providerStatus.gemini?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'gemini',
          model: mId,
          key: state.apiKeys.gemini,
          displayName: mObj.displayName || mId
        };
      }
    }

    // 2. Phase 2: Google Gemini Lite (Highest Version to Lowest, Dynamic)
    const liteList = getAllGeminiLiteModels('gemini');
    for (const mId of liteList) {
      if (modelHealthTracker.isAvailable('gemini', mId)) {
        const mObj = (AI_PROVIDERS.gemini.models || []).find(m => m.id === mId) || 
                     (state.providerStatus.gemini?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'gemini',
          model: mId,
          key: state.apiKeys.gemini,
          displayName: mObj.displayName || mId
        };
      }
    }
  }

  // 3. Phase 3: OpenRouter Gemini Pro/Flash & Lite (Highest Version to Lowest, Dynamic)
  if (state.apiKeys.openrouter && state.providerStatus.openrouter?.connected !== false) {
    const orProFlash = getAllGeminiProFlashModels('openrouter');
    for (const mId of orProFlash) {
      if (modelHealthTracker.isAvailable('openrouter', mId)) {
        const mObj = (AI_PROVIDERS.openrouter.models || []).find(m => m.id === mId) || 
                     (state.providerStatus.openrouter?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'openrouter',
          model: mId,
          key: state.apiKeys.openrouter,
          displayName: mObj.displayName || mId
        };
      }
    }

    const orLite = getAllGeminiLiteModels('openrouter');
    for (const mId of orLite) {
      if (modelHealthTracker.isAvailable('openrouter', mId)) {
        const mObj = (AI_PROVIDERS.openrouter.models || []).find(m => m.id === mId) || 
                     (state.providerStatus.openrouter?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'openrouter',
          model: mId,
          key: state.apiKeys.openrouter,
          displayName: mObj.displayName || mId
        };
      }
    }
  }

  // 4. Phase 4: Non-Gemini models from TRANSLATION_MODEL_RANKING (OpenRouter DeepSeek/Llama/Claude -> Groq -> DeepSeek Official -> OpenAI -> Custom)
  for (const entry of TRANSLATION_MODEL_RANKING) {
    const pid = entry.providerId;
    const mid = entry.modelId;
    if (!isGeminiProOrFlash(pid, mid) && !isGeminiLite(pid, mid)) {
      if (state.apiKeys[pid] && state.providerStatus[pid]?.connected && modelHealthTracker.isAvailable(pid, mid)) {
        return {
          providerId: pid,
          model: mid,
          key: state.apiKeys[pid],
          displayName: entry.name
        };
      }
    }
  }

  // 5. Fallback to other connected providers
  for (const pid of ['openrouter', 'groq', 'deepseek', 'openai', 'custom']) {
    if (state.apiKeys[pid] && state.providerStatus[pid]?.connected) {
      return {
        providerId: pid,
        model: AI_PROVIDERS[pid].defaultModel,
        key: state.apiKeys[pid],
        displayName: AI_PROVIDERS[pid].name
      };
    }
  }

  return { providerId: 'gemini', model: 'gemini-3.5-pro', key: state.apiKeys.gemini || '', displayName: 'Gemini 3.5 Pro' };
}

function getActiveProviderAndKey(modelId) {
  const targetModel = modelId || (modelSelect && modelSelect.value ? modelSelect.value : '') || state.selectedModel || 'auto';
  if (targetModel === 'auto') {
    return resolveRealTimeBestModel();
  }
  const cleanModel = targetModel.replace(/^models\//, '').trim();

  // 1. Check live model lists from connected providers first
  for (const pid of ['gemini', 'openrouter', 'groq', 'deepseek', 'openai', 'custom']) {
    const list = state.providerStatus[pid]?.models;
    if (Array.isArray(list) && list.some(m => m.id === cleanModel || m.id === targetModel || m.id?.replace(/^models\//, '') === cleanModel)) {
      return { providerId: pid, model: cleanModel, key: state.apiKeys[pid] };
    }
  }

  // 2. Explicit provider identification by model prefix/pattern
  if (cleanModel.startsWith('gemini') || cleanModel.startsWith('gemma')) {
    return { providerId: 'gemini', model: cleanModel, key: state.apiKeys.gemini };
  }
  if (cleanModel.includes('/') || cleanModel.startsWith('anthropic/') || cleanModel.startsWith('meta-llama/') || cleanModel.startsWith('google/') || cleanModel.startsWith('mistralai/') || cleanModel.startsWith('qwen/')) {
    return { providerId: 'openrouter', model: cleanModel, key: state.apiKeys.openrouter };
  }
  if (cleanModel.startsWith('llama-') || cleanModel.startsWith('deepseek-r1-distill') || cleanModel.startsWith('mixtral-')) {
    return { providerId: 'groq', model: cleanModel, key: state.apiKeys.groq };
  }
  if (cleanModel === 'deepseek-chat' || cleanModel === 'deepseek-reasoner') {
    if (state.apiKeys.openrouter && !state.apiKeys.deepseek) {
      return { providerId: 'openrouter', model: `deepseek/${cleanModel}`, key: state.apiKeys.openrouter };
    }
    if (state.apiKeys.deepseek) {
      return { providerId: 'deepseek', model: cleanModel, key: state.apiKeys.deepseek };
    }
    return { providerId: 'openrouter', model: `deepseek/${cleanModel}`, key: state.apiKeys.openrouter };
  }
  if (cleanModel.startsWith('gpt-') || cleanModel.startsWith('o1') || cleanModel.startsWith('o3')) {
    return { providerId: 'openai', model: cleanModel, key: state.apiKeys.openai };
  }

  // 3. Fallback to first available connected provider
  for (const pid of ['gemini', 'openrouter', 'groq', 'deepseek', 'openai', 'custom']) {
    if (state.apiKeys[pid] && state.providerStatus[pid]?.connected) {
      return { providerId: pid, model: AI_PROVIDERS[pid].defaultModel, key: state.apiKeys[pid] };
    }
  }

  return { providerId: 'gemini', model: 'gemini-3.5-pro', key: state.apiKeys.gemini || '' };
}

function findFailoverBackup(currentProviderId, currentModelId) {
  if (!state.autoFailoverEnabled) return null;

  const cleanCurrentModel = (currentModelId || '').replace(/^models\//, '').trim().toLowerCase();

  function isModelHealthy(pid, mid) {
    if (!state.apiKeys[pid] || !state.providerStatus[pid]?.connected) return false;
    const cleanMid = (mid || '').replace(/^models\//, '').trim().toLowerCase();
    if (pid === currentProviderId && cleanMid === cleanCurrentModel) return false;
    if (!modelHealthTracker.isAvailable(pid, mid)) return false;
    return true;
  }

  // ── RULE 1: Google Gemini Pro & Flash (Highest Version to Lowest, Dynamic) ──
  if (state.providerStatus.gemini?.connected && state.apiKeys.gemini) {
    const proFlashList = getAllGeminiProFlashModels('gemini');
    for (const mId of proFlashList) {
      if (isModelHealthy('gemini', mId)) {
        const mObj = (AI_PROVIDERS.gemini.models || []).find(m => m.id === mId) ||
                     (state.providerStatus.gemini?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'gemini',
          providerName: AI_PROVIDERS.gemini.name,
          model: mId,
          modelName: mObj.displayName || mId,
          tier: 'Tier 1A (Gemini Pro/Flash)',
          desc: mObj.desc || 'High-Precision Translation',
          key: state.apiKeys.gemini
        };
      }
    }

    // ── RULE 2: Google Gemini Lite (Highest Version to Lowest, Dynamic) ──
    const liteList = getAllGeminiLiteModels('gemini');
    for (const mId of liteList) {
      if (isModelHealthy('gemini', mId)) {
        const mObj = (AI_PROVIDERS.gemini.models || []).find(m => m.id === mId) ||
                     (state.providerStatus.gemini?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'gemini',
          providerName: AI_PROVIDERS.gemini.name,
          model: mId,
          modelName: mObj.displayName || mId,
          tier: 'Tier 1B (Gemini Lite)',
          desc: mObj.desc || 'High-Speed Translation',
          key: state.apiKeys.gemini
        };
      }
    }
  }

  // ── RULE 3: OpenRouter Gemini Pro/Flash & Lite (Highest Version to Lowest, Dynamic) ──
  if (state.providerStatus.openrouter?.connected && state.apiKeys.openrouter) {
    const orProFlash = getAllGeminiProFlashModels('openrouter');
    for (const mId of orProFlash) {
      if (isModelHealthy('openrouter', mId)) {
        const mObj = (AI_PROVIDERS.openrouter.models || []).find(m => m.id === mId) ||
                     (state.providerStatus.openrouter?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'openrouter',
          providerName: AI_PROVIDERS.openrouter.name,
          model: mId,
          modelName: mObj.displayName || mId,
          tier: 'Tier 2A (OpenRouter Gemini Pro/Flash)',
          desc: mObj.desc || 'Top Nuance via OpenRouter',
          key: state.apiKeys.openrouter
        };
      }
    }

    const orLite = getAllGeminiLiteModels('openrouter');
    for (const mId of orLite) {
      if (isModelHealthy('openrouter', mId)) {
        const mObj = (AI_PROVIDERS.openrouter.models || []).find(m => m.id === mId) ||
                     (state.providerStatus.openrouter?.models || []).find(m => m.id === mId) || { displayName: mId };
        return {
          providerId: 'openrouter',
          providerName: AI_PROVIDERS.openrouter.name,
          model: mId,
          modelName: mObj.displayName || mId,
          tier: 'Tier 2A (OpenRouter Gemini Lite)',
          desc: mObj.desc || 'Ultra-Light via OpenRouter',
          key: state.apiKeys.openrouter
        };
      }
    }
  }

  // ── RULE 4: Other AI providers from ranking (Non-Gemini OpenRouter -> Groq -> DeepSeek -> OpenAI) ──
  for (const entry of TRANSLATION_MODEL_RANKING) {
    const pid = entry.providerId;
    const mid = entry.modelId;
    if (!isGeminiProOrFlash(pid, mid) && !isGeminiLite(pid, mid)) {
      if (isModelHealthy(pid, mid)) {
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
  }

  // ── RULE 5: Check any other live verified model across other connected providers ──
  for (const pid of ['openrouter', 'groq', 'deepseek', 'openai', 'custom']) {
    if (!state.apiKeys[pid] || !state.providerStatus[pid]?.connected) continue;
    const liveModels = state.providerStatus[pid]?.models || AI_PROVIDERS[pid]?.models || [];
    for (const m of liveModels) {
      if (isModelHealthy(pid, m.id)) {
        return {
          providerId: pid,
          providerName: AI_PROVIDERS[pid]?.name || pid,
          model: m.id,
          modelName: m.displayName || m.name || m.id,
          tier: 'Live Verified Backup',
          desc: m.desc || 'Available Connected Model',
          key: state.apiKeys[pid]
        };
      }
    }
  }

  // ── RULE 6: Emergency Cooldown Reset (If all models cooled down, unblock best available) ──
  for (const pid of ['gemini', 'openrouter', 'groq', 'deepseek', 'openai']) {
    if (!state.apiKeys[pid] || !state.providerStatus[pid]?.connected) continue;
    const models = state.providerStatus[pid]?.models || AI_PROVIDERS[pid]?.models || [];
    for (const m of models) {
      const cleanMid = (m.id || '').replace(/^models\//, '').trim().toLowerCase();
      if (pid === currentProviderId && cleanMid === cleanCurrentModel) continue;
      const key = `${pid}:${cleanMid}`;
      const entry = modelHealthTracker.failures.get(key);
      if (entry && !entry.isPermanent) {
        modelHealthTracker.failures.delete(key);
        return {
          providerId: pid,
          providerName: AI_PROVIDERS[pid]?.name || pid,
          model: m.id,
          modelName: m.displayName || m.name || m.id,
          tier: 'Emergency Auto-Recovered Backup',
          desc: 'Recovered Model',
          key: state.apiKeys[pid]
        };
      }
    }
  }

  return null;
}

function getSelectedModelFriendlyDescription() {
  const selVal = (modelSelect && modelSelect.value) ? modelSelect.value : (state.selectedModel || 'auto');
  if (selVal === 'auto') {
    return 'Auto Select';
  }

  // Check if option text exists in modelSelect dropdown
  if (modelSelect && modelSelect.options) {
    const activeOpt = Array.from(modelSelect.options).find(o => o.value === selVal);
    if (activeOpt && activeOpt.text) {
      return activeOpt.text;
    }
  }

  const { providerId, model } = getActiveProviderAndKey(selVal);
  const pConf = AI_PROVIDERS[providerId];
  if (pConf) {
    const modelsList = state.providerStatus[providerId]?.models || pConf.models || [];
    const mObj = modelsList.find(m => m.id === model);
    return mObj ? `${pConf.name} (${mObj.name})` : `${pConf.name} (${model})`;
  }

  return selVal;
}

function updateQuotaDashboardForActiveModel() {
  const modelToInspect = (modelSelect && modelSelect.value ? modelSelect.value : state.selectedModel) || 'auto';
  
  if (modelToInspect === 'auto') {
    const resolved = resolveRealTimeBestModel();
    const pConf = AI_PROVIDERS[resolved.providerId];
    const toggleBtn = $('toggleQuotaBtn');
    if (toggleBtn) toggleBtn.classList.remove('hidden');

    const qName = $('quotaModelName');
    const qVer = $('quotaModelVersion');
    const qContext = $('quotaContext');
    const qOut = $('quotaOutputTokens');
    const qRpm = $('quotaRpm');
    const qRpd = $('quotaRpd');

    if (qName) qName.textContent = `Auto Select: ${pConf?.name || 'AI'} (${resolved.displayName || resolved.model})`;
    if (qVer) qVer.textContent = `Real-Time Dynamic Selection`;
    if (qContext) qContext.textContent = 'Auto-Adaptive (1M+ Max)';
    if (qOut) qOut.textContent = 'Auto-Adaptive (32k Max)';
    if (qRpm) qRpm.textContent = 'Dynamic Load Balance';
    if (qRpd) qRpd.textContent = 'Multi-Provider Resilience';
    updateApiHealthUI('optimal', `Auto Mode: Active`);
    return;
  }

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
  const currentTheme = localStorage.getItem('srt_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonUI(currentTheme);
}

function updateThemeButtonUI(theme) {
  if (themeLabelText) {
    themeLabelText.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('srt_theme', next);
  updateThemeButtonUI(next);
}

// ── Pause / Resume & Cancel Handlers ──
async function togglePauseTranslation() {
  if (!state.isTranslating && !state.isCondensing) return;
  triggerHaptic('light');

  if (!state.isPaused) {
    const isCondense = !!state.isCondensing;
    state.isPaused = true;
    if (ctrlIconPause) ctrlIconPause.classList.add('hidden');
    if (ctrlIconResume) ctrlIconResume.classList.remove('hidden');
    if (pauseResumeLabel) pauseResumeLabel.textContent = 'Resume';
    if (pauseResumeBtn) pauseResumeBtn.classList.add('is-paused');
    if (liveActivityDot) {
      liveActivityDot.classList.add('is-paused');
      liveActivityDot.style.animationPlayState = 'paused';
    }

    // 1. Update the Main Hero Button text from "Translating Subtitles..." to "Translation Paused"
    const loadingLabel = translateBtn ? translateBtn.querySelector('.loading-label') : null;
    if (loadingLabel) {
      loadingLabel.textContent = isCondense ? 'Condensation Paused' : 'Translation Paused';
    }
    if (translateBtn) {
      translateBtn.classList.add('is-paused');
    }

    // 2. Update Progress Title
    const pauseTitle = isCondense ? 'Condensation Paused (Click Resume to continue)...' : 'Translation Paused (Click Resume to continue)...';
    updateProgressStats(parseInt(progressPct ? progressPct.textContent : '0', 10) || 0, pauseTitle);

    // 3. Update API Health Status Pill
    updateApiHealthUI('cooldown', isCondense ? 'Condensation Paused' : 'Translation Paused');

    addTerminalLog('warn', isCondense ? 'AI Condensation paused.' : 'Translation paused.');
    showToast(isCondense ? 'Condensation paused.' : 'Translation paused.', 'pause');
  } else {
    state.isPaused = false;
    const isCondense = !!state.isCondensing;
    if (ctrlIconPause) ctrlIconPause.classList.remove('hidden');
    if (ctrlIconResume) ctrlIconResume.classList.add('hidden');
    if (pauseResumeLabel) pauseResumeLabel.textContent = 'Pause';
    if (pauseResumeBtn) pauseResumeBtn.classList.remove('is-paused');
    if (liveActivityDot) {
      liveActivityDot.classList.remove('is-paused');
      liveActivityDot.style.animationPlayState = 'running';
    }

    // Restore Main Hero Button spinner text
    const loadingLabel = translateBtn ? translateBtn.querySelector('.loading-label') : null;
    if (loadingLabel) {
      loadingLabel.textContent = isCondense ? 'Condensing Subtitles...' : 'Translating Subtitles...';
    }
    if (translateBtn) {
      translateBtn.classList.remove('is-paused');
    }

    const resumeTitle = isCondense ? 'Resuming condensation...' : 'Resuming translation...';
    updateProgressStats(parseInt(progressPct ? progressPct.textContent : '0', 10) || 0, resumeTitle);

    updateApiHealthUI('active', isCondense ? 'Resuming AI Condenser...' : 'Resuming Translation...');
    addTerminalLog('info', isCondense ? 'AI Condensation resumed.' : 'Translation resumed.');
  }

  updateControlsLockState();
}

async function cancelTranslationProcess() {
  if (!state.isTranslating && !state.isCondensing && !state.isCloudJob) return;

  const isCondense = state.isCondensing;
  const confirmed = await showCustomConfirm({
    title: isCondense ? 'Cancel Condensation?' : 'Cancel Translation?',
    message: isCondense
      ? 'Are you sure you want to cancel the AI condensation? Ongoing progress will be stopped and the session will be reset.'
      : 'Are you sure you want to cancel the ongoing translation? All translated data will be discarded and the session will be reset.',
    confirmText: 'Yes, Discard & Reset',
    cancelText: isCondense ? 'Keep Condensing' : 'Keep Translating',
    type: 'danger'
  });
  if (!confirmed) return;
  triggerHaptic('medium');

  state.isCancelled = true;
  state.isPaused = false;
  state.isTranslating = false;
  state.isCondensing = false;
  state.isCloudJob = false;

  if (activeCloudJobListenerUnsub) {
    try { activeCloudJobListenerUnsub(); } catch (e) {}
    activeCloudJobListenerUnsub = null;
  }

  if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
    try {
      await window.FirebaseCloudSync.cancelActiveCloudJob();
      await window.FirebaseCloudSync.clearActiveCloudJob();
    } catch (e) {}
  }

  const cloudJobBadge = $('cloudJobBadge');
  if (cloudJobBadge) cloudJobBadge.classList.add('hidden');

  state.parsedBlocks = [];
  state.translatedBlocks = [];
  state.uncompressedBlocks = [];
  state.isCondensed = false;
  state.fileName = '';
  state.fileSize = 0;

  // Crucial: Wipe saved session from storage so it never resurfaces on refresh
  await clearSavedSession();

  if (fileInput) fileInput.value = '';
  if (fileInfo) fileInfo.classList.add('hidden');
  if (dropZone) dropZone.classList.remove('hidden');
  if (progressCard) progressCard.classList.add('hidden');
  if (resultCard) resultCard.classList.add('hidden');
  if (incompleteWarningBanner) incompleteWarningBanner.classList.add('hidden');
  if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');

  const actionCtaWrap = document.querySelector('.action-cta-wrap');
  if (actionCtaWrap) actionCtaWrap.classList.remove('hidden');
  const uploadCard = $('uploadCard');
  if (uploadCard) {
    uploadCard.style.pointerEvents = 'auto';
    uploadCard.style.opacity = '1';
  }

  resetTranslateButton();
  checkReadyToTranslate();
  if (typeof renderCloudHistoryUI === 'function') renderCloudHistoryUI();
  addTerminalLog('warn', isCondense ? 'AI condensation cancelled and session reset.' : 'Translation cancelled and session reset.');
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

  // 2-Tab Navigation Switcher (Desktop Header & Mobile Bottom Bar)
  const tabBtnTranslator = $('tabBtnTranslator');
  const tabBtnSettings = $('tabBtnSettings');
  const bottomTabBtnTranslator = $('bottomTabBtnTranslator');
  const bottomTabBtnSettings = $('bottomTabBtnSettings');
  const lockGoToSettingsBtn = $('lockGoToSettingsBtn');
  const resetSessionDataBtn = $('resetSessionDataBtn');

  if (tabBtnTranslator) tabBtnTranslator.addEventListener('click', () => switchAppTab('translator'));
  if (tabBtnSettings) tabBtnSettings.addEventListener('click', () => switchAppTab('settings'));
  if (bottomTabBtnTranslator) bottomTabBtnTranslator.addEventListener('click', () => switchAppTab('translator'));
  if (bottomTabBtnSettings) bottomTabBtnSettings.addEventListener('click', () => switchAppTab('settings'));
  if (lockGoToSettingsBtn) lockGoToSettingsBtn.addEventListener('click', () => {
    switchAppTab('settings');
    switchSettingsSubTab('apikeys');
  });

  // Sub-Tabs Navigation Buttons
  const subTabBtnEngineSettings = $('subTabBtnEngineSettings');
  const subTabBtnWorkspace = $('subTabBtnWorkspace');
  const subTabBtnApiKeys = $('subTabBtnApiKeys');
  const subTabBtnHistory = $('subTabBtnHistory');

  if (subTabBtnEngineSettings) subTabBtnEngineSettings.addEventListener('click', () => switchTranslatorSubTab('settings'));
  if (subTabBtnWorkspace) subTabBtnWorkspace.addEventListener('click', () => switchTranslatorSubTab('workspace'));
  if (subTabBtnApiKeys) subTabBtnApiKeys.addEventListener('click', () => switchSettingsSubTab('apikeys'));
  if (subTabBtnHistory) subTabBtnHistory.addEventListener('click', () => switchSettingsSubTab('history'));

  // Initialize Native Mobile Settings Hub Navigation
  initNativeSettingsHub();

  if (resetSessionDataBtn) {
    resetSessionDataBtn.addEventListener('click', async () => {
      const confirmed = await showCustomConfirm({
        title: 'Clear Subtitle Session?',
        message: 'This will reset all loaded subtitle files, translation history, and restore points.',
        confirmText: 'Yes, Clear Session',
        cancelText: 'Cancel',
        type: 'warning'
      });
      if (!confirmed) return;

      state.parsedBlocks = [];
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      state.isCondensed = false;
      state.fileName = '';
      state.fileSize = 0;

      if (fileInput) fileInput.value = '';
      if (fileInfo) fileInfo.classList.add('hidden');
      if (dropZone) dropZone.classList.remove('hidden');
      if (progressCard) progressCard.classList.add('hidden');
      if (resultCard) resultCard.classList.add('hidden');
      if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');
      if (incompleteWarningBanner) incompleteWarningBanner.classList.add('hidden');

      clearSavedSession();
      resetTranslateButton();
      checkReadyToTranslate();
      showCustomAlert({ title: 'Session Cleared', message: 'Subtitle session data has been completely reset.', type: 'info' });
    });
  }

  // Provider Select Dropdown Switcher
  const providerSelect = $('providerSelect');
  if (providerSelect) {
    providerSelect.addEventListener('change', () => {
      switchProviderTab(providerSelect.value);
    });
  }

  // Theme Toggle
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

  // Auto-Failover Switch
  const autoFailoverToggle = $('autoFailoverToggle');
  if (autoFailoverToggle) {
    autoFailoverToggle.addEventListener('change', e => {
      state.autoFailoverEnabled = e.target.checked;
      localStorage.setItem('auto_failover_enabled', e.target.checked ? 'true' : 'false');
    });
  }

  // Provider Inputs & Save / Disconnect Buttons
  ['gemini', 'groq', 'openrouter', 'deepseek', 'openai', 'custom'].forEach(pid => {
    const input = pid === 'gemini' ? apiKeyInput : $(`apiKeyInput_${pid}`);
    const saveBtn = pid === 'gemini' ? saveApiKey : $(`saveApiKey_${pid}`);
    const removeBtn = $(`removeApiKey_${pid}`);
    const eyeBtn = pid === 'gemini' ? toggleApiKey : $(`toggleApiKey_${pid}`);

    if (saveBtn) saveBtn.addEventListener('click', () => handleSaveProviderKey(pid));
    if (removeBtn) removeBtn.addEventListener('click', () => handleRemoveProviderKey(pid));
    if (input) {
      input.addEventListener('keydown', e => {
        if (input.readOnly && e.key !== 'Tab' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          return;
        }
        if (e.key === 'Enter' && !input.readOnly) {
          e.preventDefault();
          handleSaveProviderKey(pid);
        }
      });
    }
    if (eyeBtn && input) {
      eyeBtn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        eyeBtn.title = isPass ? 'Hide API key' : 'Show API key';
        eyeBtn.innerHTML = isPass
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      });
    }
  });

  const customBaseUrlInput = $('customApiBaseUrl');
  const customModelNameInput = $('customApiModelName');
  [customBaseUrlInput, customModelNameInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveProviderKey('custom');
        }
      });
    }
  });

  const testPingCustomBtn = $('testPing_custom');
  if (testPingCustomBtn) {
    testPingCustomBtn.addEventListener('click', handleTestPingCustom);
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
      const isProcessing = state.isTranslating || state.isCondensing;
      const modalMessage = isProcessing
        ? 'Translation is currently in progress. Removing this file will immediately stop and abort the process. Are you sure?'
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
      state.isCloudJob = false;

      if (activeCloudJobListenerUnsub) {
        try { activeCloudJobListenerUnsub(); } catch (e) {}
        activeCloudJobListenerUnsub = null;
      }

      if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
        try {
          await window.FirebaseCloudSync.cancelActiveCloudJob();
          await window.FirebaseCloudSync.clearActiveCloudJob();
        } catch (e) {}
      }

      const cloudJobBadge = $('cloudJobBadge');
      if (cloudJobBadge) cloudJobBadge.classList.add('hidden');

      // 2. Clear all subtitle data
      state.parsedBlocks = [];
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      state.isCondensed = false;
      state.fileName = '';
      state.fileSize = 0;
      state.durationStr = '';
      state.translationTimeTaken = 0;

      // 3. Purge session from IndexedDB & LocalStorage
      await clearSavedSession();

      // 4. Reset UI cards & clear preview DOM
      if (fileInput) fileInput.value = '';
      if (fileInfo) fileInfo.classList.add('hidden');
      if (dropZone) dropZone.classList.remove('hidden');
      if (subtitlePreview) subtitlePreview.innerHTML = '';
      if (progressCard) progressCard.classList.add('hidden');
      if (resultCard) resultCard.classList.add('hidden');
      if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');
      if (incompleteWarningBanner) incompleteWarningBanner.classList.add('hidden');

      const actionCtaWrap = document.querySelector('.action-cta-wrap');
      if (actionCtaWrap) actionCtaWrap.classList.remove('hidden');
      const uploadCard = $('uploadCard');
      if (uploadCard) {
        uploadCard.style.pointerEvents = 'auto';
        uploadCard.style.opacity = '1';
      }

      // 5. Reset controls
      resetTranslateButton();
      checkReadyToTranslate();
      addTerminalLog('warn', 'Subtitle file removed and workspace reset.');
      showToast('File removed.');
    });
  }

  // Filename Renaming Triggers (Loaded Bar & Results Card)
  const renameLoadedFileBtn = $('renameLoadedFileBtn');
  if (renameLoadedFileBtn) renameLoadedFileBtn.addEventListener('click', promptRenameCurrentFile);
  if (fileName) fileName.addEventListener('click', promptRenameCurrentFile);

  const renameResultFileBtn = $('renameResultFileBtn');
  if (renameResultFileBtn) renameResultFileBtn.addEventListener('click', promptRenameCurrentFile);
  const resultFileNamePill = $('resultFileNamePill');
  if (resultFileNamePill) resultFileNamePill.addEventListener('click', promptRenameCurrentFile);

  // Top API Key Alert Banner Connect Button click handler
  const topAlertConnectBtn = $('topAlertConnectBtn');
  if (topAlertConnectBtn) {
    topAlertConnectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchAppTab('settings');
      const providerSelect = $('providerSelect');
      if (providerSelect) {
        providerSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const apiKeyInp = $('apiKeyInput');
      if (apiKeyInp) setTimeout(() => apiKeyInp.focus(), 250);
    });
  }

  // Required API Keys Checklist Click Handlers (Quick Configure)
  document.querySelectorAll('.checklist-item, .checklist-action-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const provider = el.getAttribute('data-provider') || el.closest('[data-provider]')?.getAttribute('data-provider');
      if (provider) {
        switchProviderTab(provider);
        const targetInput = $(`apiKeyInput${provider === 'gemini' ? '' : '_' + provider}`);
        if (targetInput) {
          targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => targetInput.focus(), 250);
        }
      }
    });
  });

  // Start Translation
  if (translateBtn) translateBtn.addEventListener('click', runTranslationPipeline);
  if (pauseResumeBtn) pauseResumeBtn.addEventListener('click', togglePauseTranslation);
  if (cancelTranslateBtn) cancelTranslateBtn.addEventListener('click', cancelTranslationProcess);

  // Retranslate / Change Settings Button Click Handler
  if (retranslateBtn) {
    retranslateBtn.addEventListener('click', async () => {
      const confirmed = await showCustomConfirm({
        title: 'Translate Again or Change Settings?',
        message: 'This will reset the current translation results so you can adjust settings, select a different language or AI model, and start a fresh translation. Are you sure you want to proceed?',
        confirmText: 'Yes, Proceed',
        cancelText: 'Keep Results',
        type: 'warning'
      });
      if (!confirmed) return;

      if (resultCard) resultCard.classList.add('hidden');
      state.translatedBlocks = [];
      state.uncompressedBlocks = [];
      state.isCondensed = false;
      await clearSavedSession();
      resetTranslateButton();
      checkReadyToTranslate();
      updateControlsLockState();

      switchTranslatorSubTab('settings');
      const settingsSection = $('settingsSection');
      if (settingsSection) {
        settingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      showToast('Results reset. You can now adjust settings or click Translate Subtitles.');
    });
  }

  // Retry Incomplete Batches
  if (retryIncompleteBtn) retryIncompleteBtn.addEventListener('click', () => {
    triggerHaptic('medium');
    retryIncompleteBatchesPipeline();
  });

  // AI Condenser (2nd-Pass Refinement)
  if (condenseSrtBtn) condenseSrtBtn.addEventListener('click', () => {
    triggerHaptic('medium');
    runAiCondensePipeline();
  });

  // Restore Original Uncompressed Translation
  if (restoreOriginalBtn) restoreOriginalBtn.addEventListener('click', () => {
    triggerHaptic('light');
    restoreOriginalTranslation();
  });

  // Download Action
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      triggerHaptic('medium');
      if (state.translatedBlocks.length > 0) downloadSRTFile(state.translatedBlocks);
    });
  }

  // Copy Action
  if (copySrtBtn) {
    copySrtBtn.addEventListener('click', () => {
      triggerHaptic('medium');
      copyFullSRTCode();
    });
  }

  // Translate In (Target Language) Selection Change & Persistent Sync
  if (targetLang) {
    targetLang.addEventListener('change', () => {
      localStorage.setItem('preferred_target_lang', targetLang.value);
      if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
        window.FirebaseCloudSync.savePreferencesToCloud({
          targetLang: targetLang.value,
          pacingPreset: styleMode ? styleMode.value : 'concise'
        });
      }
      checkReadyToTranslate();
    });
  }

  // Subtitle Pacing Preset Change & Persistent Sync
  const pacingBadge = $('pacingBadge');
  function updatePacingUI() {
    if (!styleMode) return;
    const val = styleMode.value;
    if (pacingBadge) {
      if (val === 'micro') {
        pacingBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span>Glance Speed (Natural)</span>
        `;
      } else if (val === 'concise') {
        pacingBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span>Fast Reading (Natural)</span>
        `;
      } else if (val === 'balanced') {
        pacingBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Balanced (Natural Flow)</span>
        `;
      } else if (val === 'detailed') {
        pacingBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>Detailed (Unabridged)</span>
        `;
      } else if (val === 'micro_limit') {
        pacingBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
          <span>1–4 Words (Max 5)</span>
        `;
      } else if (val === 'concise_limit') {
        pacingBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
          <span>4–7 Words Limit (Strict)</span>
        `;
      } else if (val === 'balanced_limit') {
        pacingBadge.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:3px;">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
          <span>7–12 Words Limit (Strict)</span>
        `;
      }
    }
  }

  if (styleMode) {
    styleMode.addEventListener('change', () => {
      updatePacingUI();
      localStorage.setItem('preferred_pacing_preset', styleMode.value);
      if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
        window.FirebaseCloudSync.savePreferencesToCloud({
          targetLang: targetLang ? targetLang.value : 'Bengali',
          pacingPreset: styleMode.value
        });
      }
    });
    updatePacingUI();
  }

  // Model Selection Change
  if (modelSelect) {
    modelSelect.addEventListener('change', () => {
      state.selectedModel = modelSelect.value;

      // If user deliberately changed model during an active or paused session:
      const targetVal = modelSelect.value;
      if (targetVal && targetVal !== 'auto') {
        const { providerId, model } = getActiveProviderAndKey(targetVal);
        // Clear any previous failure block for this specific model so the user's manual choice is respected
        const cleanId = (model || '').replace(/^models\//, '').trim().toLowerCase();
        const key = `${providerId}:${cleanId}`;
        modelHealthTracker.sessionFailedModels.delete(key);
        modelHealthTracker.failures.delete(key);
      }

      if (state.isPaused && (state.isTranslating || state.isCondensing)) {
        const desc = getSelectedModelFriendlyDescription();
        const isCondense = !!state.isCondensing;
        addTerminalLog('info', `AI Model switched to "${desc}". Resuming will continue ${isCondense ? 'condensation' : 'translation'} with this model.`);
        showToast(`Model set to "${desc}". Click Resume to continue.`, 'info');
      }

      updateQuotaDashboardForActiveModel();
      checkReadyToTranslate();
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
      triggerHaptic('light');
      document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderActiveTab(this.dataset.tab, state.translatedBlocks);
    });
  });
}

// ── File Name Sanitizer with Strict Character Limit (Max 60 chars base) ──
function sanitizeFileName(rawName, maxBaseLen = 60) {
  if (!rawName || typeof rawName !== 'string') return 'subtitle.srt';
  let clean = rawName.trim().replace(/[/\\?%*:|"<>]/g, '_');
  let base = clean.replace(/\.srt$/i, '').trim();
  if (!base) base = 'subtitle';
  if (base.length > maxBaseLen) {
    base = base.substring(0, maxBaseLen).trim();
  }
  return `${base}.srt`;
}

// ── File Selection & Adaptive Batching ──
function handleFileSelection(file) {
  if (!file.name.toLowerCase().endsWith('.srt')) {
    alert('Please upload a valid .srt subtitle file.');
    return;
  }

  if (state.isTranslating || state.isCondensing) {
    showToast('A translation or condensation is currently running. Please cancel or wait for it to finish before uploading a new file.', true);
    return;
  }

  // Cleanly reset any previous translation results and stored session
  state.translatedBlocks = [];
  state.uncompressedBlocks = [];
  state.isCondensed = false;
  if (resultCard) resultCard.classList.add('hidden');
  if (fileRestoredBadge) fileRestoredBadge.classList.add('hidden');
  clearSavedSession();

  state.fileName = sanitizeFileName(file.name, 60);
  state.originalFileName = state.fileName;
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
    switchTranslatorSubTab('workspace');
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

// Robust SRT Parser (Preserves exact timing, handles edge cases, non-standard linebreaks & multiline subtitles)
function parseSRT(raw) {
  if (!raw || typeof raw !== 'string') return [];
  const clean = raw.replace(/^\uFEFF/, '').replace(/\u00A0/g, ' ').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
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

  // Robust Line-by-Line Fallback Parser if chunk splitting yielded no blocks
  if (blocks.length === 0) {
    const allLines = clean.split('\n');
    let currentNum = '';
    let currentTimecode = '';
    let currentLines = [];

    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i].trim();
      if (line.includes('-->') && isValidSRTTimecode(line)) {
        if (currentTimecode && currentLines.length > 0) {
          blocks.push({
            num: currentNum || String(blocks.length + 1),
            timeCode: currentTimecode,
            lines: currentLines
          });
          currentLines = [];
        }
        currentTimecode = line;
      } else if (!currentTimecode) {
        if (/^\d+$/.test(line)) {
          currentNum = line;
        }
      } else {
        if (/^\d+$/.test(line) && i + 1 < allLines.length && allLines[i + 1].includes('-->')) {
          if (currentTimecode && currentLines.length > 0) {
            blocks.push({
              num: currentNum || String(blocks.length + 1),
              timeCode: currentTimecode,
              lines: currentLines
            });
            currentLines = [];
          }
          currentNum = line;
          currentTimecode = '';
        } else if (line.length > 0) {
          currentLines.push(line);
        }
      }
    }

    if (currentTimecode && currentLines.length > 0) {
      blocks.push({
        num: currentNum || String(blocks.length + 1),
        timeCode: currentTimecode,
        lines: currentLines
      });
    }
  }

  return blocks;
}

function isValidSRTTimecode(tc) {
  return /\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(tc);
}

function parseTimeRange(tc) {
  const parts = tc.split('-->').map(s => s.trim());
  if (parts.length !== 2) return null;
  return { start: tcToMs(parts[0]), end: tcToMs(parts[1]) };
}

function tcToMs(tc) {
  const m = tc.replace(',', '.').match(/(\d{1,2}):(\d{2}):(\d{2})\.(\d{1,3})/);
  if (!m) return 0;
  const msPart = m[4].padEnd(3, '0');
  return (+m[1] * 3600 + +m[2] * 60 + +m[3]) * 1000 + +msPart;
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

  const displayName = state.fileName || sanitizeFileName(file ? file.name : '', 60) || 'subtitle.srt';
  fileName.textContent = displayName;
  fileName.setAttribute('title', displayName);
  fileCountBadge.textContent = `${blocks.length} Subtitles`;
  const szBytes = file && file.size ? file.size : state.fileSize || 0;
  const szKb = (szBytes / 1024).toFixed(1);
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
  const hasGemini = hasGeminiApiKey();
  const hasOpenRouter = hasOpenRouterApiKey();
  const hasKeys = hasGemini && hasOpenRouter;
  const isTranslationCompleted = state.translatedBlocks && state.translatedBlocks.length > 0 && resultCard && !resultCard.classList.contains('hidden') && !state.isTranslating && !state.isCondensing;

  // 1. Synchronize Top Red Warning Alert Banner
  const topAlertBanner = $('topApiKeyAlertBanner');
  if (topAlertBanner) {
    if (!hasKeys) {
      topAlertBanner.classList.remove('hidden');
    } else {
      topAlertBanner.classList.add('hidden');
    }
  }

  // 2. Active translation or condensing in progress
  if (state.isTranslating || state.isCondensing) {
    if (translateBtn) {
      translateBtn.disabled = true;
      translateBtn.classList.add('disabled');
      translateBtn.classList.remove('btn-completed');
    }
    return;
  }

  // 3. Completed State -> Show "Translation Complete"
  if (isTranslationCompleted) {
    if (translateBtn) {
      translateBtn.classList.remove('btn-missing-keys');
      translateBtn.classList.add('btn-completed');
      translateBtn.disabled = true;
      const btnLabel = translateBtn.querySelector('.btn-label');
      const btnSubtitle = translateBtn.querySelector('.btn-hero-subtitle');
      const heroIcon = translateBtn.querySelector('.hero-icon');
      if (btnLabel) btnLabel.textContent = 'Translation Complete';
      if (btnSubtitle) btnSubtitle.textContent = '100% Subtitles Ready • See Results Below';
      if (heroIcon) {
        heroIcon.innerHTML = `
          <polyline points="20 6 9 17 4 12"/>
        `;
      }
    }
    if (ctaHint) {
      ctaHint.textContent = '';
    }
    return;
  }

  // 4. Update Translate Button State & Styling for Normal / Missing Keys State
  if (translateBtn) {
    translateBtn.classList.remove('btn-completed');
    const btnLabel = translateBtn.querySelector('.btn-label');
    const btnSubtitle = translateBtn.querySelector('.btn-hero-subtitle');
    const heroIcon = translateBtn.querySelector('.hero-icon');
    if (btnSubtitle) btnSubtitle.textContent = '100% Timing Preserved • Ultra-Fast AI';

    if (!hasKeys) {
      // API Keys Missing -> Red Warning Button that directs directly to Settings
      translateBtn.disabled = false;
      translateBtn.classList.remove('disabled');
      translateBtn.classList.add('btn-missing-keys');
      if (btnLabel) btnLabel.textContent = 'Please Connect API Keys';
      if (heroIcon) {
        heroIcon.innerHTML = `
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        `;
      }
    } else {
      // API Keys Connected -> Normal Hero Button
      translateBtn.classList.remove('btn-missing-keys');
      if (btnLabel) btnLabel.textContent = 'Translate Subtitles Now';
      if (heroIcon) {
        heroIcon.innerHTML = `
          <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>
        `;
      }
      if (hasFile) {
        translateBtn.disabled = false;
        translateBtn.classList.remove('disabled');
      } else {
        translateBtn.disabled = true;
        translateBtn.classList.add('disabled');
      }
    }
  }

  if (ctaHint) {
    if (!hasKeys && !hasFile) {
      ctaHint.textContent = 'Please connect your API keys in Settings & upload an SRT subtitle file to start translating.';
    } else if (!hasKeys) {
      ctaHint.textContent = 'Please connect your API keys in Settings to unlock translation.';
    } else if (!hasFile) {
      ctaHint.textContent = 'Please upload an SRT subtitle file above to begin.';
    } else {
      const activeModelDesc = getSelectedModelFriendlyDescription();
      ctaHint.textContent = `Ready! Click the button above to translate ${state.parsedBlocks.length} subtitles into ${targetLang ? targetLang.value : 'Bengali'} [${activeModelDesc}].`;
    }
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
        translatedLines: originalBlock.translatedLines || originalBlock.lines,
        isTranslated: originalBlock.isTranslated !== undefined ? originalBlock.isTranslated : false
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

// ── Dedicated AI Condenser Matcher (Preserves Existing Translation 100% on Missing/Unchanged IDs) ──
function matchCondenseToBatch(batch, parsedArray) {
  if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
    return batch;
  }

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

    if (!matched && parsedArray.length === batch.length && !parsedArray.some(it => it && it.id !== undefined)) {
      matched = parsedArray[idx];
    }

    let condensedText = '';
    if (typeof matched === 'string') {
      condensedText = matched.trim();
    } else if (matched && typeof matched === 'object') {
      condensedText = (
        matched.text ||
        matched.translation ||
        matched.condensed ||
        matched.condensed_text ||
        matched.dialogue ||
        Object.values(matched).find(v => typeof v === 'string' && v.trim().length > 0 && v !== String(matched.id)) ||
        ''
      ).trim();
    }

    if (!condensedText) {
      return originalBlock;
    }

    const lines = condensedText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    return {
      ...originalBlock,
      translatedLines: lines.length > 0 ? lines : [condensedText],
      isTranslated: true
    };
  });
}

// ── Translation Pipeline ──
async function runTranslationPipeline() {
  if (!hasRequiredMandatoryApiKeys()) {
    switchAppTab('settings');
    const providerSelect = $('providerSelect');
    if (providerSelect) {
      providerSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const apiKeyInp = $('apiKeyInput');
    if (apiKeyInp) setTimeout(() => apiKeyInp.focus(), 250);
    return;
  }

  const { providerId, model: initialModel, key: activeKey } = getActiveProviderAndKey();
  if (!activeKey) {
    switchAppTab('settings');
    const providerSelect = $('providerSelect');
    if (providerSelect) {
      providerSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const apiKeyInp = $('apiKeyInput');
    if (apiKeyInp) setTimeout(() => apiKeyInp.focus(), 250);
    return;
  }

  state.isTranslating = true;
  state.isPaused = false;
  state.isCancelled = false;
  updateControlsLockState();

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
  const activePace = (styleMode && styleMode.value) ? styleMode.value : 'concise';
  const paceLabels = {
    micro: 'Ultra-Short / Glance Speed (Punchy & Direct • Minimalist)',
    concise: 'Fast Reading & Concise (Recommended • Streamlined)',
    balanced: 'Balanced & Natural (Standard Cinema Cadence)',
    detailed: 'Detailed & Complete (Full Unabridged • Literal)',
    micro_limit: 'Ultra-Short with Word Limit (Strict 1–4 Words, Max 5)',
    concise_limit: 'Concise with Word Limit (Strict 4–7 Words Limit)',
    balanced_limit: 'Balanced with Word Limit (Strict 7–12 Words Limit)'
  };
  addTerminalLog('info', `Initial AI: [${pName}] ${currentModelToUse} • Auto-Failover: ${state.autoFailoverEnabled ? 'Enabled' : 'Disabled'}`);
  addTerminalLog('info', `Pacing Preset: ${paceLabels[activePace] || activePace}`);

  modelHealthTracker.resetSession();
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
        await sleep(350);
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
      await sleep(800);
      const resA = await translateBatchWithAdaptiveSplitting(batch.slice(0, mid), effectiveKey, activeModel, 1);
      await sleep(800);
      const resB = await translateBatchWithAdaptiveSplitting(batch.slice(mid), effectiveKey, activeModel, 1);
      return [...resA, ...resB];
    }

    return result;
  } catch (err) {
    if (state.isCancelled) throw err;
    state.stats.retries++;
    const errMsg = (err.message || '').toLowerCase();

    // Comprehensive Error Classification
    const isBalanceOrAuth = errMsg.includes('401') ||
      errMsg.includes('402') ||
      errMsg.includes('403') ||
      errMsg.includes('insufficient') ||
      errMsg.includes('balance') ||
      errMsg.includes('credit') ||
      errMsg.includes('credits') ||
      errMsg.includes('billing') ||
      errMsg.includes('payment') ||
      errMsg.includes('unauthorized') ||
      errMsg.includes('invalid api key') ||
      errMsg.includes('incorrect api key') ||
      errMsg.includes('deactivated') ||
      errMsg.includes('expired') ||
      errMsg.includes('permission denied') ||
      errMsg.includes('api_key_invalid');

    const isModelBroken = errMsg.includes('404') ||
      errMsg.includes('not found') ||
      errMsg.includes('does not exist') ||
      errMsg.includes('deprecated') ||
      errMsg.includes('no longer available') ||
      errMsg.includes('invalid_model') ||
      errMsg.includes('unrecognized model') ||
      errMsg.includes('model_not_found') ||
      errMsg.includes('is not supported') ||
      errMsg.includes('do not have access') ||
      errMsg.includes('restricted') ||
      errMsg.includes('permission_denied') ||
      errMsg.includes('location') ||
      errMsg.includes('not permitted') ||
      errMsg.includes('not allowed') ||
      errMsg.includes('preview only') ||
      errMsg.includes('whitelist') ||
      errMsg.includes('blocked');

    const isRateLimitOrOverload = errMsg.includes('429') ||
      errMsg.includes('503') ||
      errMsg.includes('500') ||
      errMsg.includes('502') ||
      errMsg.includes('504') ||
      errMsg.includes('quota') ||
      errMsg.includes('rate limit') ||
      errMsg.includes('overloaded') ||
      errMsg.includes('resource has been exhausted') ||
      errMsg.includes('too many requests') ||
      errMsg.includes('high demand') ||
      errMsg.includes('service unavailable');

    // 1. Instant Auto-Failover: If Auto-Failover is enabled, immediately switch to the best available backup model!
    if (state.autoFailoverEnabled) {
      const isPermanent = isBalanceOrAuth || isModelBroken;
      modelHealthTracker.recordFailure(currentPid, activeModel, isPermanent, err.message);

      const backup = findFailoverBackup(currentPid, activeModel);
      if (backup) {
        let reason = 'Error encountered';
        if (isBalanceOrAuth) reason = 'Insufficient Balance / Auth error';
        else if (isRateLimitOrOverload) reason = 'Rate limit / Server busy';
        else if (isModelBroken) reason = 'Model unavailable';
        else if (errMsg.includes('timeout') || errMsg.includes('slow')) reason = 'Response timed out / Slow server';

        addTerminalLog('warn', `[Auto-Failover] ${reason} on [${AI_PROVIDERS[currentPid]?.name || currentPid}] "${activeModel}". Instantly switching to [${backup.providerName}] "${backup.modelName}" without delay!`);

        // Dynamically update active model globally
        state.selectedModel = backup.model;
        if (modelSelect) {
          modelSelect.value = backup.model;
          refreshCustomSelect('modelSelect');
        }
        updateQuotaDashboardForActiveModel();
        updateApiHealthUI('optimal', `Instantly switched to [${backup.providerName}] ${backup.modelName}`);

        // Immediate switch with minimal 100ms yield to UI loop
        await sleep(100);
        return await translateBatchWithAdaptiveSplitting(batch, backup.key, backup.model, 1);
      }
    }

    // 2. Rate Limit & Overload Backoff (Only if no backup model exists)
    if (isRateLimitOrOverload) {
      const waitTime = Math.min(4000 * attempt, 14000);
      updateApiHealthUI('cooldown', `429 Rate Limit Cooldown (${waitTime / 1000}s)...`);
      addTerminalLog('warn', `API rate limit reached on ${AI_PROVIDERS[currentPid]?.name || 'provider'}. Pausing for ${waitTime / 1000}s before retry ${attempt}/3...`);
      await sleep(waitTime);
      updateApiHealthUI('active', `Resuming translation...`);
      if (attempt <= 3 && !state.isCancelled) {
        return await translateBatchWithAdaptiveSplitting(batch, effectiveKey, activeModel, attempt + 1);
      }
    }

    // 3. Divide and Conquer: Split batch if larger than 1 item
    if (batch.length > 1 && !state.isCancelled) {
      const mid = Math.ceil(batch.length / 2);
      const subA = batch.slice(0, mid);
      const subB = batch.slice(mid);
      addTerminalLog('warn', `Sub-dividing batch of ${batch.length} lines into smaller chunks (${subA.length} + ${subB.length}) to isolate error...`);
      await sleep(800);
      const resA = await translateBatchWithAdaptiveSplitting(subA, effectiveKey, activeModel, 1);
      await sleep(800);
      const resB = await translateBatchWithAdaptiveSplitting(subB, effectiveKey, activeModel, 1);
      return [...resA, ...resB];
    }

    // 4. Final fallback only if single block failed on all attempts and no backups exist
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

  if (providerId !== 'custom' && !effectiveKey) {
    throw new Error(`No API key configured for ${AI_PROVIDERS[providerId]?.name || providerId}. Please enter your key in the provider tabs.`);
  }

  if (providerId === 'gemini') {
    return await callGeminiBatchTranslate(batch, effectiveKey, attemptNumber, model);
  } else {
    return await callOpenAiCompatibleBatchTranslate(batch, providerId, model, effectiveKey, attemptNumber);
  }
}

function getSubtitlePacingPrompt(pace, lang = 'Bengali') {
  const isBn = (lang || '').toLowerCase().includes('bengali') || lang === 'Bengali';

  // ── 1. NATURAL FLOW MODES (No Word Limits - Pure Linguistic Cadence) ──
  if (pace === 'micro' || pace === 'ultra_short' || pace === 'ultra_concise') {
    return `SUBTITLE PACING PRESET: [ ULTRA-SHORT / GLANCE SPEED (NO WORD LIMIT) ] (MINIMALIST & PUNCHY PHRASING)
- CORE GOAL: Ultra-compact, punchy lines that viewers can read in a split-second glance without looking away from the action.
- HOW TO TRANSLATE IN THIS MODE:
  * Cut all conversational filler words and padding (drop "আসলে", "সত্যি বলতে", "তোমাকে বলছি", "আমার মনে হয়", "এখন", "এখানে").
  * Drop redundant pronouns & subjects when the spoken verb already implies the person (drop "আমি", "তুমি", "সে", "আমরা").
  * Turn questions into direct, punchy inflection with "?" (avoid formal "তুমি কি", "নাকি", "কিনা").
  * Use punchy, active spoken verbs and core direct keywords.
${isBn ? `  * Side-by-Side Reference:
    - Input: "What are you doing over there right now?" -> Ultra-Short: "কী করছ ওখানে?"
    - Input: "I really don't think we should be doing this at all." -> Ultra-Short: "এটা করা ঠিক না।" / "না করাই ভালো।"
    - Input: "Are you sure you want to go inside that room?" -> Ultra-Short: "ভিতরে যাবে নিশ্চিত?"
    - Input: "I'm telling you, he is not going to listen to anything you say." -> Ultra-Short: "ও কোনো কথাই শুনবে না।" / "ও শুনবে না।"
    - Input: "Wait a minute, where do you think you are going?" -> Ultra-Short: "দাঁড়াও, কোথায় যাচ্ছ?"
    - Input: "Let me know as soon as you find anything suspicious." -> Ultra-Short: "সন্দেহজনক কিছু পেলেই জানিও।"` : ''}
- STRICT NEGATIVE CONSTRAINT: DO NOT output full-length multi-clause narrative sentences or polite conversational scaffolding. Keep it visibly short, punchy, direct, and minimal!`;
  }

  if (pace === 'concise') {
    return `SUBTITLE PACING PRESET: [ FAST READING & CONCISE (NO WORD LIMIT) ] (STANDARD STREAMLINED)
- CORE GOAL: Fast, effortless reading with clean, standard short sentence structure (Subject + Object + Verb).
- HOW TO TRANSLATE IN THIS MODE:
  * Keep short, crisp conversational sentences without rambling clauses or excessive adjectives.
  * Retain complete short dialogue structure while eliminating conversational disfluencies.
${isBn ? `  * Side-by-Side Reference:
    - Input: "What are you doing over there right now?" -> Concise: "তুমি ওখানে এখন কী করছ?"
    - Input: "I really don't think we should be doing this at all." -> Concise: "আমাদের এটা করা ঠিক হবে না।"
    - Input: "Are you sure you want to go inside that room?" -> Concise: "তুমি কি নিশ্চিত ওই ঘরে যাবে?"
    - Input: "I'm telling you, he is not going to listen to anything you say." -> Concise: "তোমাকে বলছি, ও তোমার কথা শুনবে না।"
    - Input: "Wait a minute, where do you think you are going?" -> Concise: "একটু দাঁড়াও, তুমি কোথায় যাচ্ছ?"` : ''}
- Keep translations crisp, natural, and comfortably readable within standard subtitle display time.`;
  }

  if (pace === 'balanced') {
    return `SUBTITLE PACING PRESET: [ BALANCED & NATURAL (NO WORD LIMIT) ] (CINEMATIC CADENCE)
- CORE GOAL: Full cinematic dubbing flow matching the natural voiceover cadence, natural tone markers, and emotional warmth.
- HOW TO TRANSLATE IN THIS MODE:
  * Do NOT artificially compress dialogue. Translate with full natural spoken conversational flow (চলতি কথ্য ভাষা).
${isBn ? `  * Side-by-Side Reference:
    - Input: "What are you doing over there right now?" -> Balanced: "তুমি এখন ওই দিকটাতে গিয়ে কী করছ বলো তো?"
    - Input: "I really don't think we should be doing this at all." -> Balanced: "আমার মনে হয় না আমাদের এখন এই কাজটা করা কোনোভাবেই ঠিক হবে।"
    - Input: "Are you sure you want to go inside that room?" -> Balanced: "তুমি কি সত্যিই নিশ্চিত যে তুমি ওই রুমটার ভেতরে যেতে চাও?"` : ''}`;
  }

  if (pace === 'detailed') {
    return `SUBTITLE PACING PRESET: [ DETAILED & COMPLETE (NO WORD LIMIT) ] (UNABRIDGED LITERAL)
- CORE GOAL: 100% comprehensive literal translation capturing every descriptive adjective, honorific, sub-clause, qualifier, and narrative detail without omitting or summarizing anything.`;
  }

  // ── 2. STRICT WORD-LIMIT MODES (With Explicit Word Count Quotas & Conversion Charts) ──
  if (pace === 'micro_limit') {
    return `SUBTITLE PACING PRESET: [ ULTRA-SHORT (STRICT WORD LIMIT: 1 TO 4 WORDS, MAX 5) ]
- TARGET LENGTH: Strict 1 to 4 words max per subtitle line (maximum 5 words ceiling).
- WORD LIMIT CONVERSION CHART:
  * 1-2 words source -> 1-3 words target
  * 3-6 words source -> 2-4 words target
  * 7-12 words source -> 3-4 words target (distill to core punchline; maximum 5 words)
- HOW TO TRANSLATE UNDER THIS WORD LIMIT:
  * Drop all conversational filler words (drop "আসলে", "সত্যি বলতে", "তোমাকে বলছি", "আমার মনে হয়", "এখন").
  * Drop redundant subject pronouns (drop "আমি", "তুমি", "সে") when verb indicates person.
  * Turn questions into direct inflection with "?" without question words.
  * Keep strictly within 1-4 words (absolute maximum 5 words).
${isBn ? `  * Side-by-Side Reference with Word Counts:
    - Input: "What are you doing over there right now?" -> Ultra-Short: "কী করছ ওখানে?" (3 words) [NEVER write 6+ words]
    - Input: "I really don't think we should be doing this at all." -> Ultra-Short: "এটা করা ঠিক না।" (4 words)
    - Input: "Are you sure you want to go inside that room?" -> Ultra-Short: "ভিতরে যাবে নিশ্চিত?" (3 words)
    - Input: "I'm telling you, he is not going to listen to anything you say." -> Ultra-Short: "ও শুনবে না।" (3 words)
    - Input: "Let me know as soon as you find anything suspicious." -> Ultra-Short: "সন্দেহজনক কিছু পেলেই জানিও।" (4 words)` : ''}
- STRICT NEGATIVE CONSTRAINT: Keep strictly within 1-4 words (maximum ceiling of 5 words). DO NOT output 6+ words under any circumstances!`;
  }

  if (pace === 'concise_limit') {
    return `SUBTITLE PACING PRESET: [ FAST READING & CONCISE (STRICT WORD LIMIT: 4 TO 7 WORDS) ]
- TARGET LENGTH: Clean 4 to 7 words per line.
- WORD LIMIT CONVERSION CHART:
  * Short line -> 3-5 words
  * Medium line -> 4-6 words
  * Long compound dialogue -> 5-7 words max
- HOW TO TRANSLATE UNDER THIS WORD LIMIT:
  * Keep clean, standard short sentence structure (Subject + Object + Verb).
  * Eliminate conversational disfluencies and rambling clauses.
${isBn ? `  * Side-by-Side Reference with Word Counts:
    - Input: "What are you doing over there right now?" -> Concise: "তুমি ওখানে এখন কী করছ?" (5 words)
    - Input: "I really don't think we should be doing this at all." -> Concise: "আমাদের এটা করা ঠিক হবে না।" (6 words)
    - Input: "Are you sure you want to go inside that room?" -> Concise: "তুমি কি নিশ্চিত ওই ঘরে যাবে?" (6 words)
    - Input: "I'm telling you, he is not going to listen to anything you say." -> Concise: "তোমাকে বলছি, ও তোমার কথা শুনবে না।" (7 words)
    - Input: "Wait a minute, where do you think you are going?" -> Concise: "একটু দাঁড়াও, তুমি কোথায় যাচ্ছ?" (6 words)` : ''}
- STRICT NEGATIVE CONSTRAINT: Maintain comfortable reading pace strictly within 4 to 7 words per line.`;
  }

  if (pace === 'balanced_limit') {
    return `SUBTITLE PACING PRESET: [ BALANCED & NATURAL (STRICT WORD LIMIT: 7 TO 12 WORDS) ]
- TARGET LENGTH: Natural 7 to 12 words per line.
- WORD LIMIT CONVERSION CHART:
  * Short dialogue -> 5-8 words
  * Medium dialogue -> 7-10 words
  * Long compound dialogue -> 9-12 words max
- HOW TO TRANSLATE UNDER THIS WORD LIMIT:
  * Translate with full spoken conversational tone markers and nuance while keeping under 12 words.
${isBn ? `  * Side-by-Side Reference with Word Counts:
    - Input: "What are you doing over there right now?" -> Balanced: "তুমি এখন ওই দিকটাতে গিয়ে কী করছ বলো তো?" (9 words)
    - Input: "I really don't think we should be doing this at all." -> Balanced: "আমার মনে হয় না আমাদের এখন এই কাজটা করা কোনোভাবেই ঠিক হবে।" (11 words)
    - Input: "Are you sure you want to go inside that room?" -> Balanced: "তুমি কি সত্যিই নিশ্চিত যে তুমি ওই রুমটার ভেতরে যেতে চাও?" (11 words)` : ''}
- STRICT NEGATIVE CONSTRAINT: Do not exceed 12 words per line.`;
  }

  // Fallback
  return `SUBTITLE PACING PRESET: [ FAST READING & CONCISE ] (STANDARD STREAMLINED)
- Keep translations crisp, natural, and comfortably readable within standard subtitle display time.`;
}

// ── Google Gemini Translation Engine ──
async function callGeminiBatchTranslate(batch, key, attemptNumber, overrideModel) {
  const lang = targetLang.value || 'Bengali';
  const pace = (styleMode && styleMode.value) ? styleMode.value : 'concise';
  const hint = contextHint.value.trim();
  
  const rawModel = overrideModel || (modelSelect && modelSelect.value ? modelSelect.value : '') || state.selectedModel || 'gemini-3.5-pro';
  const selectedModel = rawModel.replace(/^models\//, '').trim();

  const inputData = batch.map((item, index) => ({
    id: index,
    text: item.lines.join('\n')
  }));

  const pacingPrompt = getSubtitlePacingPrompt(pace, lang);

  let languageRules = '';
  const langLower = lang.toLowerCase();

  if (langLower.includes('bengali') || lang === 'Bengali') {
    languageRules = `
DIALOGUE & REGIONAL VOCABULARY RULES (Bengali / বাংলা):
- Strictly use modern standard Bangladeshi Bengali phrasing and natural vocabulary commonly used across Bangladesh.
- Standard Vocabulary Mapping & Strict Replacements:
  * For "God / Lord / Oh God / My God": Strictly use "ঈশ্বর" or "খোদা" (e.g. "হে ঈশ্বর", "হে খোদা", "খোদার কসম", "ঈশ্বর জানেন", "খোদা না করুক"). NEVER use "আল্লাহ" for generic deity/Western god/dialogues like "oh god". NEVER use "ভগবান".
  * For "Invitation / Invite": Strictly use "দাওয়াত" / "দাওয়াত দেওয়া". NEVER use "নিমন্ত্রণ" or "নেমত্তন্ন".
  * For "Guest / Visitor": Strictly use "মেহমান". NEVER use "অতিথি".
  * For "Water": Strictly use "পানি" (NEVER use "জল").
  * For "Rainbow": Strictly use "রংধনু" (NEVER use "রামধনু").
  * For "United Nations": Strictly use "জাতিসংঘ" (NEVER use "রাষ্ট্রপুঞ্জ").
  * For "Bath / Shower": Strictly use "গোসল" (NEVER use "স্নান").
  * For greetings: Use "সালাম" / "হাই" / "হ্যালো" / "কেমন আছেন" (avoid "নমস্কার" unless character-specific religious setting).
- Strict Banned Words (Indian / West Bengal regional words that must NEVER be used):
  * Do NOT use: জল, রামধনু, ভগবান, আল্লাহ (for generic god dialogues), স্নান, রাষ্ট্রপুঞ্জ, নিমন্ত্রণ, অতিথি, দিদিমণি, মশাই, ইত্যাদি।
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
   - If original subtitle text has multiple dialogue lines (e.g. starting with "- "), keep clean line breaks in translated text.
6. SCRIPT PURITY & NO MIXED CHARACTERS:
   - Output 100% pure native script in ${lang}. NEVER mix English Latin characters inside ${lang} words (e.g. NEVER write "অনuবাদ", "আরo", "করe", "হবেn", "কi", "নa"; ALWAYS write "অনুবাদ", "আরো", "করে", "হবেন", "কি", "না").
   - Write currency symbols as natural words in ${lang} (e.g. write "$50" as "৫০ ডলার").${languageRules}
${hint ? `7. Context/Genre: ${hint}` : ''}

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

  const timeoutMs = selectedModel.includes('pro') ? 10000 : 8000;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort(new Error(`Gemini API request timed out (${timeoutMs / 1000}s slow response)`));
  }, timeoutMs);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: abortController.signal
    });
  } catch (netErr) {
    const lat = Date.now() - reqStart;
    if (netErr.name === 'AbortError' || abortController.signal.aborted) {
      updateApiHealthUI('warning', '[Gemini] Slow response timeout...', lat);
      throw new Error(`Gemini API timeout (${timeoutMs / 1000}s slow response). Switching to fast backup model.`);
    }
    updateApiHealthUI('warning', '[Gemini] Network Error...', lat);
    throw netErr;
  } finally {
    clearTimeout(timeoutId);
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

// ── OpenAI-Compatible Translation Engine (Groq, OpenRouter, DeepSeek, OpenAI, Custom) ──
async function callOpenAiCompatibleBatchTranslate(batch, providerId, modelId, key, attemptNumber) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) {
    throw new Error(`No configuration for provider "${providerId}".`);
  }
  if (providerId !== 'custom' && !key) {
    throw new Error(`No API key provided for provider "${providerId}".`);
  }

  const lang = targetLang.value || 'Bengali';
  const pace = (styleMode && styleMode.value) ? styleMode.value : 'concise';
  const hint = contextHint.value.trim();

  const inputData = batch.map((item, index) => ({
    id: index,
    text: item.lines.join('\n')
  }));

  const pacingPrompt = getSubtitlePacingPrompt(pace, lang);

  let languageRules = '';
  const langLower = lang.toLowerCase();

  if (langLower.includes('bengali') || lang === 'Bengali') {
    languageRules = `
DIALOGUE & REGIONAL VOCABULARY RULES (Bengali / বাংলা):
- Strictly use modern standard Bangladeshi Bengali phrasing and natural vocabulary commonly used across Bangladesh.
- Standard Vocabulary Mapping & Strict Replacements:
  * For "God / Lord / Oh God / My God": Strictly use "ঈশ্বর" or "খোদা" (e.g. "হে ঈশ্বর", "হে খোদা", "খোদার কসম", "ঈশ্বর জানেন", "খোদা না করুক"). NEVER use "আল্লাহ" for generic deity/Western god/dialogues like "oh god". NEVER use "ভগবান".
  * For "Invitation / Invite": Strictly use "দাওয়াত" / "দাওয়াত দেওয়া". NEVER use "নিমন্ত্রণ" or "নেমত্তন্ন".
  * For "Guest / Visitor": Strictly use "মেহমান". NEVER use "অতিথি".
  * For "Water": Strictly use "পানি" (NEVER use "জল").
  * For "Rainbow": Strictly use "রংধনু" (NEVER use "রামধনু").
  * For "United Nations": Strictly use "জাতিসংঘ" (NEVER use "রাষ্ট্রপুঞ্জ").
  * For "Bath / Shower": Strictly use "গোসল" (NEVER use "স্নান").
  * For greetings: Use "সালাম" / "হাই" / "হ্যালো" / "কেমন আছেন" (avoid "নমস্কার" unless character-specific religious setting).
- Strict Banned Words (Indian / West Bengal regional words that must NEVER be used):
  * Do NOT use: জল, রামধনু, ভগবান, আল্লাহ (for generic god dialogues), স্নান, রাষ্ট্রপুঞ্জ, নিমন্ত্রণ, অতিথি, দিদিমণি, মশাই, ইত্যাদি।
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
   - If original subtitle text has multiple dialogue lines (e.g. starting with "- "), keep clean line breaks in translated text.
6. SCRIPT PURITY & NO MIXED CHARACTERS:
   - Output 100% pure native script in ${lang}. NEVER mix English Latin characters inside ${lang} words (e.g. NEVER write "অনuবাদ", "আরo", "করe", "হবেn", "কi", "নa"; ALWAYS write "অনুবাদ", "আরো", "করে", "হবেন", "কি", "না").
   - Write currency symbols as natural words in ${lang} (e.g. write "$50" as "৫০ ডলার").${languageRules}
${hint ? `7. Context/Genre: ${hint}` : ''}`;

  const userPrompt = `INPUT SUBTITLES TO TRANSLATE (${batch.length} items):
${JSON.stringify(inputData, null, 2)}

OUTPUT (JSON Array):`;

  let endpoint = pConf.endpoint;
  if (providerId === 'custom') {
    const rawBaseUrl = (localStorage.getItem('custom_api_base_url') || $('customApiBaseUrl')?.value || '').trim();
    const baseUrl = normalizeCustomBaseUrl(rawBaseUrl);
    if (!baseUrl) {
      throw new Error('Custom API Base URL is not configured.');
    }
    endpoint = `${baseUrl}/chat/completions`;
  }

  let headers = {
    'Content-Type': 'application/json'
  };
  if (key && key.trim()) {
    headers['Authorization'] = `Bearer ${key.trim()}`;
  }
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
    response = await fetch(endpoint, {
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
    let errMsg = '';
    if (typeof errorJson?.error === 'string') {
      errMsg = errorJson.error;
    } else if (errorJson?.error?.message) {
      errMsg = errorJson.error.message;
    } else if (errorJson?.message) {
      errMsg = errorJson.message;
    } else {
      errMsg = `HTTP ${response.status} ${response.statusText}`;
    }

    if (response.status === 402 || errMsg.toLowerCase().includes('insufficient') || errMsg.toLowerCase().includes('balance') || errMsg.toLowerCase().includes('credit')) {
      updateApiHealthUI('exhausted', `[${pConf.name}] 402 Insufficient Balance`, duration);
    } else if (response.status === 429) {
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

// ── Deterministic Bangladeshi Bengali Vocabulary & Tokenizer Bleeding Sanitizer ──
function sanitizeBengaliVocabulary(text) {
  if (!text || typeof text !== 'string') return text;
  let s = text;

  // 1. Currency & Stray Symbol Artifact Normalization
  // e.g. "$50" or "$৫০" -> "৫০ ডলার" (prevent duplicate "ডলার ডলার")
  s = s.replace(/\$\s*([0-9\u09E6-\u09EF]+)(?:\s*ডলার)?/g, '$1 ডলার');
  s = s.replace(/(?<=[^\w\s]|^)\$\s*(?=[\u0980-\u09FF])/g, '');
  s = s.replace(/(?<=[\u0980-\u09FF])\s*\$/g, '');
  // Clean stray backslashes before Bengali characters
  s = s.replace(/\\([\u0980-\u09FF])/g, '$1');

  // 2. Multi-character Latin suffixes embedded in Bengali words (LLM Tokenizer Artifacts)
  s = s.replace(/([\u0985-\u09B9])che(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ছে');
  s = s.replace(/([\u0985-\u09B9])be(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1বে');
  s = s.replace(/([\u0985-\u09B9])te(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1তে');
  s = s.replace(/([\u0985-\u09B9])le(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1লে');
  s = s.replace(/([\u0985-\u09B9])re(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1রে');
  s = s.replace(/([\u0985-\u09B9])ke(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1কে');
  s = s.replace(/([\u0985-\u09B9])me(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1মে');
  s = s.replace(/([\u0985-\u09B9])se(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1সে');
  s = s.replace(/([\u0985-\u09B9])ta(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1টা');
  s = s.replace(/([\u0985-\u09B9])ti(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1টি');
  s = s.replace(/([\u0985-\u09B9])ra(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1রা');

  // 3. Single Latin vowels embedded in Bengali words (e.g. "অনuবাদ" -> "অনুবাদ", "আরo" -> "আরো", "করe" -> "করে")
  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])u([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ু$2');
  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])u(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ু');

  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])o(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ো');
  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])o([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ো$2');

  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])e(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ে');
  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])e([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ে$2');

  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])i(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ি');
  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])i([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ি$2');

  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])a(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1া');
  s = s.replace(/([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])a([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1া$2');

  // 4. Single Latin consonants embedded in Bengali words (e.g. "হবেn" -> "হবেন", "যাn" -> "যান")
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])n(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ন');
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])n([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ন$2');

  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])r(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1র');
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])r([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1র$2');

  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])t(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ত');
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])t([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ত$2');

  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])k(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ক');
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])k([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ক$2');

  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])m(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ম');
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])m([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ম$2');

  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])s(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1স');
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])s([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1স$2');

  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])l(?=[^a-zA-Z\u0980-\u09FF]|$)/g, '$1ল');
  s = s.replace(/([\u0985-\u09B9\u09BE-\u09CD\u09D7])l([\u0985-\u09B9\u09CE\u09DC\u09DD\u09DF])/g, '$1ল$2');

  // 5. Idioms & Special Multi-word Patterns
  s = s.replace(/হে\s*আল্লাহ/gi, 'হে ঈশ্বর')
       .replace(/ইয়া\s*আল্লাহ/gi, 'হে খোদা')
       .replace(/ওহ\s*আল্লাহ/gi, 'ওহ ঈশ্বর')
       .replace(/আল্লাহর\s*কসম/gi, 'খোদার কসম')
       .replace(/আল্লাহর\s*দোহাই/gi, 'ঈশ্বরের দোহাই')
       .replace(/আল্লাহ\s*জানেন/gi, 'ঈশ্বর জানেন')
       .replace(/আল্লাহ\s*না\s*করুক/gi, 'খোদা না করুক')
       .replace(/হে\s*ভগবান/gi, 'হে ঈশ্বর')
       .replace(/ওহ\s*ভগবান/gi, 'ওহ ঈশ্বর')
       .replace(/খাবার\s*জল/g, 'খাবার পানি')
       .replace(/এক\s*গ্লাস\s*জল/g, 'এক গ্লাস পানি');

  const replacements = [
    ['আল্লাহর', 'খোদার'],
    ['আল্লাহকে', 'ঈশ্বরকে'],
    ['আল্লাহ', 'খোদা'],
    ['ভগবানের', 'ঈশ্বরের'],
    ['ভগবানকে', 'ঈশ্বরকে'],
    ['ভগবান', 'ঈশ্বর'],
    ['নিমন্ত্রণের', 'দাওয়াতের'],
    ['নিমন্ত্রণে', 'দাওয়াতে'],
    ['নিমন্ত্রণ', 'দাওয়াত'],
    ['নেমত্তন্ন', 'দাওয়াত'],
    ['নেমন্তন্ন', 'দাওয়াত'],
    ['অতিথিবৃন্দ', 'মেহমানরা'],
    ['অতিথিদের', 'মেহমানদের'],
    ['অতিথিরা', 'মেহমানরা'],
    ['অতিথিকে', 'মেহমানকে'],
    ['অতিথি', 'মেহমান'],
    ['জলের', 'পানির'],
    ['জলে', 'পানিতে'],
    ['জল', 'পানি'],
    ['রামধনু', 'রংধনু'],
    ['স্নানের', 'গোসলের'],
    ['স্নানে', 'গোসলে'],
    ['স্নান', 'গোসল'],
    ['রাষ্ট্রপুঞ্জ', 'জাতিসংঘ']
  ];

  for (const [src, dst] of replacements) {
    const reg = new RegExp('(?<=^|[^\\u0980-\\u09FF])' + src + '(?=[^\\u0980-\\u09FF]|$)', 'gu');
    s = s.replace(reg, dst);
  }

  return s;
}

// ── Timing Correction & Overlap Fixer ──
function postProcessSubtitles(blocks) {
  const result = blocks.map(b => ({ ...b }));

  // 1. Recover empty lines & sanitize Bengali vocabulary
  const isBengaliTarget = (targetLang.value || '').toLowerCase().includes('bengali') || targetLang.value === 'Bengali';

  for (let i = 0; i < result.length; i++) {
    if (!result[i].translatedLines || result[i].translatedLines.length === 0) {
      result[i].translatedLines = result[i].lines;
      result[i].isTranslated = false;
      state.stats.emptyRecovered++;
    } else if (isBengaliTarget && Array.isArray(result[i].translatedLines)) {
      result[i].translatedLines = result[i].translatedLines.map(line => sanitizeBengaliVocabulary(line));
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

// ── Helper: Generate distinct filename for condensed subtitles ──
function getCondensedFileName(origName) {
  if (!origName) return 'subtitles_condensed.srt';
  const clean = origName.replace(/\.srt$/i, '');
  if (/(_condensed|-condensed|_glance)/i.test(clean)) {
    return `${clean}.srt`;
  }
  return `${clean}_condensed.srt`;
}

// ── AI 2nd-Pass Condenser Pipeline ──
async function runAiCondensePipeline() {
  if (state.translatedBlocks.length === 0) return;

  // Backup original translations & original filename
  if (!state.uncompressedBlocks || state.uncompressedBlocks.length === 0) {
    state.uncompressedBlocks = JSON.parse(JSON.stringify(state.translatedBlocks));
  }
  state.originalFileName = state.originalFileName || state.fileName;

  const { providerId, model: activeModel, key: activeKey } = getActiveProviderAndKey();
  if (!activeKey) {
    alert('Please enter and connect at least one AI API Key before proceeding.');
    return;
  }

  state.isTranslating = true;
  state.isCondensing = true;
  state.isPaused = false;
  state.isCancelled = false;
  updateControlsLockState();

  // 1. Disable & Lock 'Translate Subtitles Now' action button while Condensing
  if (translateBtn) {
    translateBtn.disabled = true;
    translateBtn.classList.add('disabled');
  }
  const actionCtaWrap = document.querySelector('.action-cta-wrap');
  if (actionCtaWrap) actionCtaWrap.classList.add('hidden');
  const uploadCard = $('uploadCard');
  if (uploadCard) {
    uploadCard.style.pointerEvents = 'none';
    uploadCard.style.opacity = '0.5';
  }

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
  progressCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  const initialCondenseModel = state.selectedModel || 'auto';
  const { providerId: initPid, model: initModel } = getActiveProviderAndKey(initialCondenseModel);
  const initPName = AI_PROVIDERS[initPid]?.name || 'AI';
  addTerminalLog('info', `Initial Condenser AI: [${initPName}] ${initModel} • Auto-Failover: ${state.autoFailoverEnabled ? 'Enabled' : 'Disabled'}`);

  modelHealthTracker.resetSession();

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

      const activeModelId = state.selectedModel || initialCondenseModel;
      const { providerId: bPid, model: currentModel, key: batchKey } = getActiveProviderAndKey(activeModelId);

      updateProgressStats(batchPct, `Condensing batch ${bi + 1} of ${batches.length} (#${currentBatch[0].num} – #${currentBatch[currentBatch.length - 1].num})...`);
      addTerminalLog('info', `Batch ${bi + 1}/${batches.length}: Condensing ${currentBatch.length} lines with [${AI_PROVIDERS[bPid]?.name || bPid}] ${currentModel}...`);

      let batchResult = [];
      try {
        batchResult = await condenseBatchWithAdaptiveSplitting(currentBatch, batchKey, currentModel);
      } catch (err) {
        if (state.isCancelled) break;
        addTerminalLog('warn', `Batch ${bi + 1} could not be condensed: ${err.message}. Keeping 1st-pass translation.`);
        batchResult = currentBatch;
      }

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
        await sleep(300);
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
    state.fileName = getCondensedFileName(state.fileName);
    if (fileName) fileName.textContent = state.fileName;
    const resName = $('resultFileName');
    if (resName) resName.textContent = state.fileName;

    const totalWordsEnd = countTotalWords(finalizedBlocks);
    const totalPercentSaved = totalWordsStart > 0 ? Math.max(0, Math.round(((totalWordsStart - totalWordsEnd) / totalWordsStart) * 100)) : 0;
    const wordsSaved = Math.max(0, totalWordsStart - totalWordsEnd);

    updateProgressStats(100, `AI Condensation complete! Reduced from ${totalWordsStart} to ${totalWordsEnd} words (-${totalPercentSaved}% reading load).`);
    addTerminalLog('ok', `[Condensation 100% Done] Total: ${totalWordsStart} words -> ${totalWordsEnd} words (${wordsSaved} words saved, -${totalPercentSaved}% reading load)!`);

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
    const uploadCard = $('uploadCard');
    if (uploadCard) {
      uploadCard.style.pointerEvents = '';
      uploadCard.style.opacity = '';
    }
    const actionCtaWrap = document.querySelector('.action-cta-wrap');
    if (actionCtaWrap) actionCtaWrap.classList.remove('hidden');
    resetTranslateButton();
    checkReadyToTranslate();
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

    // Comprehensive Error Classification (Unified with Translation Pipeline)
    const isBalanceOrAuth = errMsg.includes('401') ||
      errMsg.includes('402') ||
      errMsg.includes('403') ||
      errMsg.includes('insufficient') ||
      errMsg.includes('balance') ||
      errMsg.includes('credit') ||
      errMsg.includes('credits') ||
      errMsg.includes('billing') ||
      errMsg.includes('payment') ||
      errMsg.includes('unauthorized') ||
      errMsg.includes('invalid api key') ||
      errMsg.includes('incorrect api key') ||
      errMsg.includes('deactivated') ||
      errMsg.includes('expired') ||
      errMsg.includes('permission denied') ||
      errMsg.includes('api_key_invalid');

    const isModelBroken = errMsg.includes('404') ||
      errMsg.includes('not found') ||
      errMsg.includes('does not exist') ||
      errMsg.includes('deprecated') ||
      errMsg.includes('no longer available') ||
      errMsg.includes('invalid_model') ||
      errMsg.includes('unrecognized model') ||
      errMsg.includes('model_not_found') ||
      errMsg.includes('is not supported') ||
      errMsg.includes('do not have access') ||
      errMsg.includes('restricted') ||
      errMsg.includes('permission_denied') ||
      errMsg.includes('location') ||
      errMsg.includes('not permitted') ||
      errMsg.includes('not allowed') ||
      errMsg.includes('preview only') ||
      errMsg.includes('whitelist') ||
      errMsg.includes('blocked');

    const isRateLimitOrOverload = errMsg.includes('429') ||
      errMsg.includes('503') ||
      errMsg.includes('500') ||
      errMsg.includes('502') ||
      errMsg.includes('504') ||
      errMsg.includes('quota') ||
      errMsg.includes('rate limit') ||
      errMsg.includes('overloaded') ||
      errMsg.includes('resource has been exhausted') ||
      errMsg.includes('too many requests') ||
      errMsg.includes('high demand') ||
      errMsg.includes('service unavailable');

    // 1. Instant Auto-Failover: If Auto-Failover is enabled, immediately switch to the best available backup model!
    if (state.autoFailoverEnabled) {
      const isPermanent = isBalanceOrAuth || isModelBroken;
      modelHealthTracker.recordFailure(currentPid, activeModel, isPermanent, err.message);

      const backup = findFailoverBackup(currentPid, activeModel);
      if (backup) {
        let reason = 'Error encountered';
        if (isBalanceOrAuth) reason = 'Insufficient Balance / Auth error';
        else if (isRateLimitOrOverload) reason = 'Rate limit / Server busy';
        else if (isModelBroken) reason = 'Model unavailable';
        else if (errMsg.includes('timeout') || errMsg.includes('slow')) reason = 'Response timed out / Slow server';

        addTerminalLog('warn', `[Auto-Failover] ${reason} on condenser [${AI_PROVIDERS[currentPid]?.name || currentPid}] "${activeModel}". Instantly switching to [${backup.providerName}] "${backup.modelName}" without delay!`);

        // Dynamically update active model globally so subsequent batches stay on this backup model
        state.selectedModel = backup.model;
        if (modelSelect) {
          modelSelect.value = backup.model;
          refreshCustomSelect('modelSelect');
        }
        updateQuotaDashboardForActiveModel();
        updateApiHealthUI('optimal', `Instantly switched condenser to [${backup.providerName}] ${backup.modelName}`);

        // Immediate switch with minimal 100ms yield to UI loop
        await sleep(100);
        return await condenseBatchWithAdaptiveSplitting(batch, backup.key, backup.model, 1);
      }
    }

    // 2. Rate Limit & Overload Backoff (Only if no backup model exists)
    if (isRateLimitOrOverload) {
      const waitTime = Math.min(3000 * attempt, 10000);
      updateApiHealthUI('cooldown', `429 Rate Limit Cooldown (${waitTime / 1000}s)...`);
      addTerminalLog('warn', `API rate limit reached on condenser. Pausing for ${waitTime / 1000}s before retry...`);
      await sleep(waitTime);
      updateApiHealthUI('active', `Resuming condensation...`);
      if (attempt <= 2 && !state.isCancelled) {
        return await condenseBatchWithAdaptiveSplitting(batch, effectiveKey, activeModel, attempt + 1);
      }
    }

    // 3. Safe Single Split: Only split once if batch is large (>6 items) and attempt is 1
    if (batch.length > 6 && attempt === 1 && !state.isCancelled) {
      const mid = Math.ceil(batch.length / 2);
      const subA = batch.slice(0, mid);
      const subB = batch.slice(mid);
      await sleep(300);
      const resA = await condenseBatchWithAdaptiveSplitting(subA, effectiveKey, activeModel, 2);
      await sleep(300);
      const resB = await condenseBatchWithAdaptiveSplitting(subB, effectiveKey, activeModel, 2);
      return [...resA, ...resB];
    }

    // 4. Clean, elegant fallback: Preserve 1st-pass translation without freezing or throwing infinite errors
    addTerminalLog('info', `Batch #${batch[0]?.num || 1} condensed using high-quality 1st-pass translation.`);
    return batch;
  }
}

// ── Universal AI Condense Dispatcher ──
async function callAiBatchCondense(batch, key, attemptNumber, overrideModel) {
  const modelToUse = overrideModel || modelSelect?.value || state.selectedModel;
  const { providerId, model, key: providerKey } = getActiveProviderAndKey(modelToUse);
  const effectiveKey = providerKey || state.apiKeys[providerId] || key;

  if (providerId !== 'custom' && !effectiveKey) {
    throw new Error(`No API key configured for ${AI_PROVIDERS[providerId]?.name || providerId}. Please enter your key in the provider tabs.`);
  }

  if (providerId === 'gemini') {
    return await callGeminiBatchCondense(batch, effectiveKey, attemptNumber, model);
  } else {
    return await callOpenAiCompatibleBatchCondense(batch, providerId, model, effectiveKey, attemptNumber);
  }
}

// ── Gemini 2nd-Pass Condense API Call ──
async function callGeminiBatchCondense(batch, key, attemptNumber, overrideModel) {
  const lang = targetLang.value || 'Bengali';
  const rawModel = overrideModel || (modelSelect && modelSelect.value ? modelSelect.value : '') || state.selectedModel || 'gemini-3.5-pro';
  const selectedModel = rawModel.replace(/^models\//, '').trim();

  const inputData = batch.map((item, index) => ({
    id: index,
    source: item.lines.join(' '),
    translation: (item.translatedLines || item.lines).join(' ')
  }));

  let condenseLangRule = '';
  if (lang.toLowerCase().includes('bengali') || lang === 'Bengali') {
    condenseLangRule = `
7. Strictly maintain natural Bangladeshi Bengali vocabulary (e.g. use "পানি", "রংধনু", "জাতিসংঘ", "গোসল", "খোদা/ঈশ্বর" (NEVER "আল্লাহ" for generic god, NEVER "ভগবান"), "দাওয়াত" (NEVER "নিমন্ত্রণ"), "মেহমান" (NEVER "অতিথি"), "সালাম/হাই/হ্যালো"; strictly avoid West Bengal variants like "জল", "রামধনু", "ভগবান", "স্নান", "নিমন্ত্রণ", "অতিথি", "নমস্কার").`;
  }

  const promptText = `You are a master subtitle condensation and localization editor.
Task: Condense and shorten the given ${lang} subtitle translations so they are readable in a split second glance.

MANDATORY RULES:
1. Make every subtitle line ULTRA-SHORT, punchy, and concise (ideal 1-4 words for short lines; max 5 words only if absolutely essential to preserve meaning).
2. PRESERVE SHORT LINES & SOUND EFFECTS: If an input subtitle is already very short (1-3 words, e.g. "হ্যাঁ", "না", "ধন্যবাদ") or a bracketed sound effect (e.g. "[গান বাজছে]"), return it unchanged.
3. Cut away conversational padding, redundant particles, extra formal suffixes, and repetitive words so viewers can read instantaneously.
4. Strictly preserve 100% of the core emotion, punchline, dialogue intent, and context.
5. Output strictly in natural everyday spoken ${lang} dialogue/script.
6. Preserve HTML tags like <i>, </i>, <b>, </b> if present.
7. Return a complete JSON array of objects with an entry for every input id (from 0 to ${inputData.length - 1}).
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
  return matchCondenseToBatch(batch, parsedArray);
}

// ── OpenAI-Compatible 2nd-Pass Condense API Call ──
async function callOpenAiCompatibleBatchCondense(batch, providerId, modelId, key, attemptNumber) {
  const pConf = AI_PROVIDERS[providerId];
  if (!pConf) {
    throw new Error(`No configuration for provider "${providerId}".`);
  }
  if (providerId !== 'custom' && !key) {
    throw new Error(`No API key provided for provider "${providerId}".`);
  }

  const lang = targetLang.value || 'Bengali';
  const inputData = batch.map((item, index) => ({
    id: index,
    source: item.lines.join(' '),
    translation: (item.translatedLines || item.lines).join(' ')
  }));

  let condenseLangRule = '';
  if (lang.toLowerCase().includes('bengali') || lang === 'Bengali') {
    condenseLangRule = `
7. Strictly maintain natural Bangladeshi Bengali vocabulary (e.g. use "পানি", "রংধনু", "জাতিসংঘ", "গোসল", "খোদা/ঈশ্বর" (NEVER "আল্লাহ" for generic god, NEVER "ভগবান"), "দাওয়াত" (NEVER "নিমন্ত্রণ"), "মেহমান" (NEVER "অতিথি"), "সালাম/হাই/হ্যালো"; strictly avoid West Bengal variants like "জল", "রামধনু", "ভগবান", "স্নান", "নিমন্ত্রণ", "অতিথি", "নমস্কার").`;
  }

  const systemPrompt = `You are a master subtitle compression and localization editor.
Task: Condense and shorten the given ${lang} subtitle translations so they are readable in a split second glance.

MANDATORY RULES:
1. Make every subtitle line ULTRA-SHORT and punchy (ideal 1-4 words for short lines; max 5 words only if absolutely essential to preserve meaning).
2. PRESERVE SHORT LINES & SOUND EFFECTS: If an input subtitle is already very short (1-3 words) or a sound effect, return it unchanged.
3. Cut away conversational padding, redundant particles, extra formal suffixes, and repetitive words so viewers can read instantaneously.
4. Strictly preserve 100% of the core emotion, punchline, dialogue intent, and context.
5. Output strictly in natural everyday spoken ${lang} dialogue/script.
6. Preserve HTML tags like <i>, </i>, <b>, </b> if present.
7. Return a valid JSON array of objects for every input id (from 0 to ${inputData.length - 1}).
Schema: [{"id": 0, "text": "concise dialogue in ${lang}"}, {"id": 1, "text": "concise dialogue in ${lang}"}] OR {"subtitles": [{"id": 0, "text": "concise dialogue in ${lang}"}]}${condenseLangRule}`;

  const userPrompt = `INPUT SUBTITLES (${batch.length} items):
${JSON.stringify(inputData, null, 2)}

OUTPUT (JSON Array):`;

  let endpoint = pConf.endpoint;
  if (providerId === 'custom') {
    const rawBaseUrl = (localStorage.getItem('custom_api_base_url') || $('customApiBaseUrl')?.value || '').trim();
    const baseUrl = normalizeCustomBaseUrl(rawBaseUrl);
    if (!baseUrl) {
      throw new Error('Custom API Base URL is not configured.');
    }
    endpoint = `${baseUrl}/chat/completions`;
  }

  let headers = {
    'Content-Type': 'application/json'
  };
  if (key && key.trim()) {
    headers['Authorization'] = `Bearer ${key.trim()}`;
  }
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
    response = await fetch(endpoint, {
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
  return matchCondenseToBatch(batch, parsedArray);
}

// ── Restore Original 1st-Pass Translation ──
function restoreOriginalTranslation() {
  if (!state.uncompressedBlocks || state.uncompressedBlocks.length === 0) return;
  state.translatedBlocks = JSON.parse(JSON.stringify(state.uncompressedBlocks));
  state.isCondensed = false;

  if (state.originalFileName) {
    state.fileName = state.originalFileName;
  } else if (state.fileName) {
    state.fileName = state.fileName.replace(/(_condensed|-condensed|_glance)/i, '');
  }
  if (fileName) fileName.textContent = state.fileName;
  const resName = $('resultFileName');
  if (resName) resName.textContent = state.fileName;

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
  triggerHaptic('success');
  progressCard.classList.add('hidden');
  resultCard.classList.remove('hidden');

  const resName = $('resultFileName');
  if (resName) {
    resName.textContent = state.fileName || 'translated_subtitle.srt';
  }

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

  // ── Auto-Save to Google Cloud 7-Day History if signed in ──
  if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
    try {
      const srtContent = generateSRTString(blocks);
      const sizeBytes = new Blob([srtContent]).size;
      const sizeFormatted = sizeBytes > 1024 * 1024 
        ? (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
        : (sizeBytes / 1024).toFixed(1) + ' KB';

      window.FirebaseCloudSync.saveTranslationToCloud({
        fileName: state.fileName || (state.file ? state.file.name : 'translated_subtitle.srt'),
        sourceLang: 'Auto-detect',
        targetLang: targetLang.value || 'Bengali',
        modelUsed: state.selectedModel || 'AI',
        blockCount: blocks.length,
        isCondensed: !!state.isCondensed,
        srtContent: srtContent,
        fileSizeFormatted: sizeFormatted
      }).then(docId => {
        if (docId) {
          showToast('Saved to Cloud History (Kept for 7 days)');
          if (typeof renderCloudHistoryUI === 'function') {
            renderCloudHistoryUI();
          }
        }
      }).catch(err => {
        console.error('Cloud auto-save error:', err);
      });
    } catch (e) {
      console.warn('Could not auto-save to cloud:', e);
    }
  }

  updateControlsLockState();
  checkReadyToTranslate();
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
            <span>${escapeHtml((state.fileName || 'subtitles').replace(/\.srt$/i, ''))}_${targetLang.value.slice(0, 2).toLowerCase()}${state.isCondensed ? '_glance' : ''}.srt</span>
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
            <div class="block-text-content">${escapeHtml((b.translatedLines || b.lines || []).join('\n'))}</div>
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
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks.map((b, idx) => {
    const num = b.num || String(idx + 1);
    const linesToUse = (b.translatedLines && b.translatedLines.length > 0) ? b.translatedLines : (b.lines || []);
    const text = linesToUse.join('\n');
    return `${num}\n${b.timeCode}\n${text}\n`;
  }).join('\n');
}

// ── Universal Unicode <-> Base64 Helpers ──
function unicodeToBase64(str) {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    return encodeURIComponent(str);
  }
}

// ── Download .SRT File (Web + Android Native & External Browser Engine) ──
async function downloadSRTFile(blocks) {
  const content = generateSRTString(blocks);
  let fileName = state.fileName || 'translated_subtitle.srt';
  if (state.isCondensed && !/condens|glance/i.test(fileName)) {
    fileName = getCondensedFileName(fileName);
  }
  if (!fileName.toLowerCase().endsWith('.srt')) {
    fileName += '.srt';
  }

  const isNative = !!(
    (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' && /Android/i.test(navigator.userAgent))
  );

  // 1. If running inside Native Android App: Open External Browser to download cleanly
  if (isNative) {
    addTerminalLog('info', `Opening external browser to download "${fileName}"...`);
    
    // Construct External Browser Download URL with Base64 Payload
    const encodedData = unicodeToBase64(content);
    const downloadUrl = `https://srttranslator.vercel.app/download.html#filename=${encodeURIComponent(fileName)}&data=${encodeURIComponent(encodedData)}`;

    // Open in External Browser (Chrome / Android Default Browser)
    try {
      if (window.Capacitor?.Plugins?.Browser?.open) {
        await window.Capacitor.Plugins.Browser.open({ url: downloadUrl, windowName: '_system' });
      } else {
        window.open(downloadUrl, '_system');
      }
    } catch (browserErr) {
      console.warn('Capacitor Browser open failed, using fallback:', browserErr);
      window.open(downloadUrl, '_blank');
    }

    // Native Filesystem Save (saves directly to phone storage if available)
    try {
      if (window.Capacitor?.Plugins?.Filesystem?.writeFile) {
        await window.Capacitor.Plugins.Filesystem.writeFile({
          path: `Download/${fileName}`,
          data: content,
          directory: 'DOCUMENTS',
          encoding: 'utf8',
          recursive: true
        });
      }
    } catch (fsErr) {}

    return;
  }

  // 2. Standard Web Browser Download (Desktop & Mobile Browser)
  try {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) {
    console.error('Web download error:', err);
    const encodedData = unicodeToBase64(content);
    window.location.href = `https://srttranslator.vercel.app/download.html#filename=${encodeURIComponent(fileName)}&data=${encodeURIComponent(encodedData)}`;
  }
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
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressPct) progressPct.textContent = `${percent}%`;
  if (progressTitle) {
    if (state.isPaused) {
      progressTitle.textContent = state.isCondensing
        ? 'Condensation Paused (Click Resume to continue)...'
        : 'Translation Paused (Click Resume to continue)...';
    } else {
      progressTitle.textContent = title;
    }
  }
}

function addTerminalLog(type, msg, customSvg) {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  
  let iconSvg = customSvg || '';
  if (!iconSvg) {
    if (type === 'ok') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'err') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else if (type === 'warn') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else if (type === 'cloud' || (typeof msg === 'string' && msg.includes('Cloud Engine Engaged'))) {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;flex-shrink:0;margin-top:3px;color:#38bdf8;"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;flex-shrink:0;margin-top:4px;"><polyline points="9 18 15 12 9 6"/></svg>`;
    }
  }

  // Strip all emojis from log messages automatically
  const cleanMsg = typeof msg === 'string'
    ? msg.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}⚡✨✓✔⚠️ℹ️⏸🛑☁️]\s*/gu, '').trim()
    : msg;

  entry.innerHTML = `${iconSvg}<span>${escapeHtml(cleanMsg)}</span>`;
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
  if (!translateBtn) return;
  const content = translateBtn.querySelector('.btn-content');
  const spinner = translateBtn.querySelector('.btn-spinner-state');
  const loadingLabel = translateBtn.querySelector('.loading-label');
  if (content) content.classList.remove('hidden');
  if (spinner) spinner.classList.add('hidden');
  if (loadingLabel) loadingLabel.textContent = 'Translating Subtitles...';
  translateBtn.classList.remove('is-paused');
  translateBtn.disabled = false;
  checkReadyToTranslate();
  updateControlsLockState();
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

  // Floating Dropdown Menu (Bottom Sheet on Mobile)
  const menu = document.createElement('div');
  menu.className = 'custom-select-menu';
  menu.setAttribute('role', 'listbox');

  // Native Bottom Sheet Top Drag Handle & Title Header
  const dragHandle = document.createElement('div');
  dragHandle.className = 'custom-select-drag-handle';
  menu.appendChild(dragHandle);

  let sheetTitleText = 'Select an Option';
  if (selectId === 'targetLang') sheetTitleText = 'Select Target Language';
  else if (selectId === 'modelSelect') sheetTitleText = 'Select AI Model';
  else if (selectId === 'styleMode') sheetTitleText = 'Select Subtitle Pacing';
  else if (selectId === 'providerSelect') sheetTitleText = 'Select AI Provider';

  const sheetHeader = document.createElement('div');
  sheetHeader.className = 'custom-select-sheet-header';
  sheetHeader.innerHTML = `
    <span class="custom-select-sheet-title">${escapeHtml(sheetTitleText)}</span>
    <button type="button" class="btn-sheet-close" title="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  sheetHeader.querySelector('.btn-sheet-close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllCustomSelects();
  });
  menu.appendChild(sheetHeader);

  // If selecting Language, provide Quick Pinned Popular Chips on top
  if (selectId === 'targetLang') {
    const pinnedWrap = document.createElement('div');
    pinnedWrap.className = 'custom-select-pinned-wrap';
    pinnedWrap.innerHTML = `
      <span class="pinned-label">⭐ Quick Pick:</span>
      <div class="pinned-chips-scroll">
        <button type="button" class="pinned-lang-chip" data-val="Bengali">Bengali (বাংলা)</button>
        <button type="button" class="pinned-lang-chip" data-val="Hindi">Hindi (हिन्दी)</button>
        <button type="button" class="pinned-lang-chip" data-val="English">English</button>
        <button type="button" class="pinned-lang-chip" data-val="Spanish">Spanish (Español)</button>
        <button type="button" class="pinned-lang-chip" data-val="Arabic">Arabic (العربية)</button>
        <button type="button" class="pinned-lang-chip" data-val="Japanese">Japanese (日本語)</button>
      </div>
    `;
    pinnedWrap.querySelectorAll('.pinned-lang-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHaptic('light');
        const v = btn.dataset.val;
        selectEl.value = v;
        const opt = Array.from(selectEl.options).find(o => o.value === v);
        trigger.querySelector('.custom-select-value').textContent = opt ? opt.text : v;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        closeAllCustomSelects();
      });
    });
    menu.appendChild(pinnedWrap);
  }

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
      <input type="text" class="custom-select-search-input" placeholder="Search language or model..." autocomplete="off" />
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

    const createOptionEl = (opt) => {
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
        triggerHaptic('light');
        selectEl.value = opt.value;
        trigger.querySelector('.custom-select-value').textContent = opt.text;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        closeAllCustomSelects();
        renderOptions(searchInput ? searchInput.value : '');
      });
      return optEl;
    };

    // 1. Render standalone options first (direct children of selectEl that are option elements)
    const standaloneOptions = Array.from(selectEl.children).filter(child => child.tagName && child.tagName.toLowerCase() === 'option');
    standaloneOptions.forEach(opt => {
      if (!normFilter || opt.text.toLowerCase().includes(normFilter)) {
        list.appendChild(createOptionEl(opt));
      }
    });

    // 2. Render optgroups if they exist
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
            list.appendChild(createOptionEl(opt));
          });
        }
      });
    } else if (standaloneOptions.length === 0) {
      const allOpts = Array.from(selectEl.options);
      allOpts.forEach(opt => {
        if (!normFilter || opt.text.toLowerCase().includes(normFilter)) {
          list.appendChild(createOptionEl(opt));
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
      
      const parentCard = container.closest('.glass-card, .provider-select-box, .api-section, .settings-section, section');
      if (parentCard) parentCard.classList.add('has-open-dropdown');

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
  document.querySelectorAll('.has-open-dropdown').forEach(card => {
    card.classList.remove('has-open-dropdown');
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
  ['targetLang', 'modelSelect', 'styleMode', 'providerSelect'].forEach(id => {
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

// ── Universal Toast Notification Engine ──
function showToast(message, type = 'success') {
  if (!message) return;
  const isError = type === true || type === 'error' || type === 'danger';
  const isPause = type === 'pause';
  const isInfo = type === 'info';

  const cleanMsg = typeof message === 'string'
    ? message.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}⚡✨✓✔⚠️ℹ️⏸🛑☁️]\s*/gu, '').trim()
    : message;

  let container = document.getElementById('subsyncToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'subsyncToastContainer';
    container.className = 'subsync-toast-container';
    document.body.appendChild(container);
  }

  let toastTypeClass = 'toast-success';
  let iconSvg = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `;

  if (isError) {
    toastTypeClass = 'toast-error';
    iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:14px;height:14px;">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `;
  } else if (isPause) {
    toastTypeClass = 'toast-warning';
    iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:14px;height:14px;">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>
    `;
  } else if (isInfo) {
    toastTypeClass = 'toast-info';
    iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    `;
  }

  const toast = document.createElement('div');
  toast.className = `subsync-toast ${toastTypeClass}`;
  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-msg">${escapeHtml(cleanMsg)}</span>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

// ── Custom Alert & Information Modal Helper ──
function showCustomModal(title, message, iconType = 'info') {
  const backdrop = $('customModalBackdrop');
  const modalTitle = $('modalTitle');
  const modalMessage = $('modalMessage');
  const badge = $('modalIconBadge');
  const svgWarning = $('modalIconSvgWarning');
  const svgInfo = $('modalIconSvgInfo');
  const cancelBtn = $('modalCancelBtn');
  const confirmBtn = $('modalConfirmBtn');

  if (!backdrop) {
    alert(`${title}\n\n${message}`);
    return;
  }

  if (modalTitle) modalTitle.textContent = title;
  if (modalMessage) modalMessage.textContent = message;

  if (iconType === 'info') {
    if (badge) badge.className = 'modal-icon-badge modal-icon-info';
    if (svgWarning) svgWarning.classList.add('hidden');
    if (svgInfo) svgInfo.classList.remove('hidden');
  } else {
    if (badge) badge.className = 'modal-icon-badge modal-icon-warning';
    if (svgWarning) svgWarning.classList.remove('hidden');
    if (svgInfo) svgInfo.classList.add('hidden');
  }

  if (cancelBtn) cancelBtn.classList.add('hidden');
  if (confirmBtn) {
    confirmBtn.textContent = 'OK';
    confirmBtn.className = 'btn btn-modal-confirm';
    const closeHandler = () => {
      backdrop.classList.add('hidden');
      if (cancelBtn) cancelBtn.classList.remove('hidden');
      confirmBtn.removeEventListener('click', closeHandler);
    };
    confirmBtn.addEventListener('click', closeHandler);
  }

  backdrop.classList.remove('hidden');
}

// ── Custom Confirmation Dialog Helper (Returns Promise<boolean>) ──
function showConfirmModal({
  title = 'Confirmation',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  iconType = 'warning',
  confirmBtnClass = 'btn btn-modal-confirm'
}) {
  return new Promise((resolve) => {
    const backdrop = $('customModalBackdrop');
    const modalTitle = $('modalTitle');
    const modalMessage = $('modalMessage');
    const badge = $('modalIconBadge');
    const svgWarning = $('modalIconSvgWarning');
    const svgInfo = $('modalIconSvgInfo');
    const cancelBtn = $('modalCancelBtn');
    const confirmBtn = $('modalConfirmBtn');

    if (!backdrop || !confirmBtn || !cancelBtn) {
      const ok = window.confirm(`${title}\n\n${message}`);
      resolve(ok);
      return;
    }

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;

    if (iconType === 'info') {
      if (badge) badge.className = 'modal-icon-badge modal-icon-info';
      if (svgWarning) svgWarning.classList.add('hidden');
      if (svgInfo) svgInfo.classList.remove('hidden');
    } else {
      if (badge) badge.className = 'modal-icon-badge modal-icon-warning';
      if (svgWarning) svgWarning.classList.remove('hidden');
      if (svgInfo) svgInfo.classList.add('hidden');
    }

    cancelBtn.textContent = cancelText;
    cancelBtn.classList.remove('hidden');

    confirmBtn.textContent = confirmText;
    confirmBtn.className = confirmBtnClass;

    const cleanup = () => {
      backdrop.classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      backdrop.removeEventListener('click', onBackdropClick);
    };

    const onConfirm = () => {
      cleanup();
      resolve(true);
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    const onBackdropClick = (e) => {
      if (e.target === backdrop) {
        cleanup();
        resolve(false);
      }
    };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    backdrop.addEventListener('click', onBackdropClick);

    backdrop.classList.remove('hidden');
  });
}

// ── Optional Google Sign-In & Cloud API Key Sync Controller ──
function initFirebaseAuthAndCloudSync() {
  const googleSignInBtn = $('googleSignInBtn');
  const settingsGoogleSignInBtn = $('settingsGoogleSignInBtn');
  const googleSignOutBtn = $('googleSignOutBtn');
  const settingsSignOutBtn = $('settingsSignOutBtn');
  const manualCloudSyncBtn = $('manualCloudSyncBtn');
  const settingsSyncKeysBtn = $('settingsSyncKeysBtn');
  const userProfileBtn = $('userProfileBtn');
  const userProfileDropdown = $('userProfileDropdown');

  if (!window.FirebaseCloudSync) return;

  // Instant UI restore on page load from cached user (eliminates auth latency flash)
  const initialUser = window.FirebaseCloudSync.getUser();
  if (initialUser) {
    updateAuthUI(initialUser);
  }
  renderCloudHistoryUI();

  // Toggle Header User Dropdown
  if (userProfileBtn && userProfileDropdown) {
    userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userProfileDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!userProfileDropdown.contains(e.target) && e.target !== userProfileBtn) {
        userProfileDropdown.classList.add('hidden');
      }
    });
  }

  // Handle Google Sign-In
  const onSignInClick = async () => {
    try {
      if (!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey) {
        showCustomModal(
          'Firebase Setup Info',
          'To enable 1-click Google Sign-In and Cloud API Key sync, please paste your free Firebase credentials into firebase-config.js. App continues to work 100% offline locally!',
          'info'
        );
        return;
      }
      showToast('Opening Google Sign-In...');
      await window.FirebaseCloudSync.signInWithGoogle();
    } catch (err) {
      console.error('[Auth Error]', err);
      showCustomModal('Google Sign-In', err.message || 'Failed to sign in with Google.', 'warning');
    }
  };

  if (googleSignInBtn) googleSignInBtn.addEventListener('click', onSignInClick);
  if (settingsGoogleSignInBtn) settingsGoogleSignInBtn.addEventListener('click', onSignInClick);

  // Handle Sign-Out with Warning Confirmation
  const onSignOutClick = async () => {
    if (state.isTranslating || state.isCondensing) {
      showToast('Translation is in progress. Please pause or wait for completion before signing out.', 'error');
      return;
    }

    const confirmed = await showConfirmModal({
      title: 'Sign Out of Google?',
      message: 'Are you sure you want to sign out? Your saved API keys will remain on this device, but new translations won\'t sync to your 7-Day Cloud Archive until you sign in again.',
      confirmText: 'Yes, Sign Out',
      cancelText: 'Stay Signed In',
      iconType: 'warning',
      confirmBtnClass: 'btn btn-modal-confirm'
    });

    if (!confirmed) return;

    try {
      await window.FirebaseCloudSync.signOut();
      if (userProfileDropdown) userProfileDropdown.classList.add('hidden');
      showToast('Signed out of Google account.');
    } catch (err) {
      console.error('[Sign Out Error]', err);
    }
  };

  if (googleSignOutBtn) googleSignOutBtn.addEventListener('click', onSignOutClick);
  if (settingsSignOutBtn) settingsSignOutBtn.addEventListener('click', onSignOutClick);

  // Handle Manual Cloud Backup / Sync
  const onManualSyncClick = async () => {
    const user = window.FirebaseCloudSync.getUser();
    if (!user) {
      showToast('Please sign in with Google first.');
      return;
    }
    showToast('Syncing API keys & preferences to Google Cloud...');
    const okKeys = await window.FirebaseCloudSync.saveKeysToCloud({
      ...state.apiKeys,
      custom_api_base_url: localStorage.getItem('custom_api_base_url') || '',
      custom_api_model_name: localStorage.getItem('custom_api_model_name') || ''
    });
    const okPrefs = await window.FirebaseCloudSync.savePreferencesToCloud({
      targetLang: targetLang ? targetLang.value : 'Bengali',
      pacingPreset: styleMode ? styleMode.value : 'concise'
    });
    if (okKeys || okPrefs) {
      showToast('API Keys & Preferences safely backed up to Google Cloud!');
    } else {
      showToast('Failed to backup to cloud.', true);
    }
  };

  if (manualCloudSyncBtn) manualCloudSyncBtn.addEventListener('click', onManualSyncClick);
  if (settingsSyncKeysBtn) settingsSyncKeysBtn.addEventListener('click', onManualSyncClick);

  // Listen to Auth State Changes with single-execution guard on refresh
  let lastRestoredUserId = null;
  let isRestoringCloudData = false;

  window.FirebaseCloudSync.onAuthStateChanged(async (user) => {
    updateAuthUI(user);

    if (user) {
      // Prevent running cloud restore twice on same user session
      if (lastRestoredUserId === user.uid || isRestoringCloudData) {
        return;
      }
      isRestoringCloudData = true;
      lastRestoredUserId = user.uid;

      try {
        // 1. Auto-restore keys from Firestore
        const cloudData = await window.FirebaseCloudSync.loadKeysFromCloud();
        if (cloudData) {
          let restoredCount = 0;
          let newKeysImported = 0;
          const cloudVerificationPromises = [];
          ['gemini', 'groq', 'openrouter', 'deepseek', 'openai', 'custom'].forEach(pid => {
            const cloudKey = cloudData[pid];
            if (pid === 'custom') {
              const cloudBaseUrl = cloudData.custom_api_base_url || cloudData.customBaseUrl;
              const cloudModelName = cloudData.custom_api_model_name || cloudData.customModelName;
              if (cloudBaseUrl) {
                if (localStorage.getItem('custom_api_base_url') !== cloudBaseUrl) newKeysImported++;
                localStorage.setItem('custom_api_base_url', cloudBaseUrl);
                const urlInp = $('customApiBaseUrl');
                if (urlInp) urlInp.value = cloudBaseUrl;
              }
              if (cloudModelName) {
                localStorage.setItem('custom_api_model_name', cloudModelName);
                const modelInp = $('customApiModelName');
                if (modelInp) modelInp.value = cloudModelName;
              }
              if (cloudKey) {
                if (localStorage.getItem('custom_api_key') !== cloudKey) newKeysImported++;
                state.apiKeys.custom = cloudKey;
                localStorage.setItem('custom_api_key', cloudKey);
                const keyInp = $('apiKeyInput_custom');
                if (keyInp) keyInp.value = cloudKey;
              }
              if (cloudBaseUrl) {
                cloudVerificationPromises.push(verifyAndLoadProvider('custom', cloudKey || ''));
                restoredCount++;
              }
            } else if (cloudKey && typeof cloudKey === 'string' && cloudKey.length > 5) {
              const prevKey = localStorage.getItem(AI_PROVIDERS[pid].storageKey);
              if (prevKey !== cloudKey) newKeysImported++;
              state.apiKeys[pid] = cloudKey;
              localStorage.setItem(AI_PROVIDERS[pid].storageKey, cloudKey);
              if (pid === 'gemini') {
                state.apiKey = cloudKey;
                localStorage.setItem('gemini_api_key', cloudKey);
                if (apiKeyInput) apiKeyInput.value = cloudKey;
              } else {
                const inp = $(`apiKeyInput_${pid}`);
                if (inp) inp.value = cloudKey;
              }
              cloudVerificationPromises.push(verifyAndLoadProvider(pid, cloudKey));
              restoredCount++;
            }
          });

          // Wait for all cloud-restored providers to finish verifying and fetching model lists
          if (cloudVerificationPromises.length > 0) {
            await Promise.allSettled(cloudVerificationPromises);
          }

          if (restoredCount > 0) {
            updateApiGuardAndHeaderStatus();
            checkReadyToTranslate();
            populateCombinedModelDropdown();
            // Only toast if new keys were actually imported from another device/session
            if (newKeysImported > 0) {
              showToast(`Restored ${newKeysImported} API Key(s) from Google Cloud!`);
            }
          }
        } else {
          // If cloud is empty and local keys exist, automatically backup to cloud silently
          const hasLocalKeys = Object.values(state.apiKeys).some(k => k && k.length > 5) || !!localStorage.getItem('custom_api_base_url');
          if (hasLocalKeys) {
            await window.FirebaseCloudSync.saveKeysToCloud({
              ...state.apiKeys,
              custom_api_base_url: localStorage.getItem('custom_api_base_url') || '',
              custom_api_model_name: localStorage.getItem('custom_api_model_name') || ''
            });
          }
        }

        // 2. Auto-restore User Preferences (Translate In language & Subtitle Pacing Preset)
        const cloudPrefs = await window.FirebaseCloudSync.loadPreferencesFromCloud();
        if (cloudPrefs) {
          if (cloudPrefs.targetLang && targetLang) {
            targetLang.value = cloudPrefs.targetLang;
            localStorage.setItem('preferred_target_lang', cloudPrefs.targetLang);
            refreshCustomSelect('targetLang');
          }
          if (cloudPrefs.pacingPreset && styleMode) {
            styleMode.value = cloudPrefs.pacingPreset;
            localStorage.setItem('preferred_pacing_preset', cloudPrefs.pacingPreset);
            refreshCustomSelect('styleMode');
            if (typeof updatePacingUI === 'function') updatePacingUI();
          }
        } else {
          // If cloud preferences are empty, sync local preferences to cloud
          const currentLang = targetLang ? targetLang.value : 'Bengali';
          const currentPacing = styleMode ? styleMode.value : 'concise';
          await window.FirebaseCloudSync.savePreferencesToCloud({
            targetLang: currentLang,
            pacingPreset: currentPacing
          });
        }

        // 3. Load 7-Day Cloud Subtitle Archive
        await renderCloudHistoryUI();
      } finally {
        isRestoringCloudData = false;
        updateApiGuardAndHeaderStatus();
        checkReadyToTranslate();
        if (typeof window.FirebaseCloudSync?.markInitialSyncComplete === 'function') {
          window.FirebaseCloudSync.markInitialSyncComplete();
        }
      }
    } else {
      lastRestoredUserId = null;
      if (Array.isArray(window._pendingProviderVerifications) && window._pendingProviderVerifications.length > 0) {
        await Promise.allSettled(window._pendingProviderVerifications).catch(() => {});
      }
      updateApiGuardAndHeaderStatus();
      checkReadyToTranslate();
      populateCombinedModelDropdown();
      await renderCloudHistoryUI();
      if (typeof window.FirebaseCloudSync?.markInitialSyncComplete === 'function') {
        window.FirebaseCloudSync.markInitialSyncComplete();
      }
    }
  });

  const refreshHistoryBtn = $('refreshCloudHistoryBtn');
  if (refreshHistoryBtn) {
    refreshHistoryBtn.addEventListener('click', () => {
      renderCloudHistoryUI();
      showToast('Cloud history refreshed.');
    });
  }
}

function generateUserAvatarSvg(name, email) {
  const raw = (name || email || 'User').trim();
  const initial = raw.charAt(0).toUpperCase() || 'U';
  const gradients = [
    ['#6366f1', '#4338ca'],
    ['#0ea5e9', '#0284c7'],
    ['#10b981', '#059669'],
    ['#8b5cf6', '#6d28d9'],
    ['#f59e0b', '#d97706'],
    ['#ec4899', '#be185d']
  ];
  const charCode = initial.charCodeAt(0) || 0;
  const [c1, c2] = gradients[charCode % gradients.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <defs>
      <linearGradient id="av_${charCode}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="24" fill="url(#av_${charCode})"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700">${initial}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}



function showPromptModal({ title, message, defaultValue = '', placeholder = 'Enter file name...', confirmText = 'Rename', maxLength = 60, onConfirm }) {
  const existing = document.querySelector('.custom-modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'custom-modal-backdrop';

  const safeDefault = defaultValue ? defaultValue.slice(0, maxLength) : '';

  backdrop.innerHTML = `
    <div class="custom-modal-box" role="dialog" aria-modal="true">
      <div class="modal-top-accent" style="background:linear-gradient(90deg, #6366f1, #38bdf8);"></div>
      <div class="modal-icon-badge modal-icon-info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
      </div>
      <h3 class="modal-title">${escapeHtml(title || 'Rename Subtitle')}</h3>
      ${message ? `<p class="modal-message">${escapeHtml(message)}</p>` : ''}
      <div class="modal-input-wrap">
        <input type="text" class="modal-input-field" id="modalPromptInput" maxlength="${maxLength}" value="${escapeHtml(safeDefault)}" placeholder="${escapeHtml(placeholder)}" spellcheck="false" autocomplete="off" />
        <div class="modal-char-counter" id="modalCharCounter">
          <span class="char-count-text"><span id="promptCharCount">${safeDefault.length}</span>/${maxLength} characters</span>
          <span class="char-limit-tag hidden" id="charLimitTag">Max limit reached</span>
        </div>
      </div>
      <div class="modal-actions-row">
        <button class="btn-modal-cancel" type="button" id="modalCancelBtn">Cancel</button>
        <button class="btn-modal-confirm" type="button" id="modalConfirmBtn" style="background:linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow:0 4px 14px rgba(99, 102, 241, 0.4);">${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const input = backdrop.querySelector('#modalPromptInput');
  const countEl = backdrop.querySelector('#promptCharCount');
  const counterWrap = backdrop.querySelector('#modalCharCounter');
  const limitTag = backdrop.querySelector('#charLimitTag');
  const cancelBtn = backdrop.querySelector('#modalCancelBtn');
  const confirmBtn = backdrop.querySelector('#modalConfirmBtn');

  const updateCounter = () => {
    const len = input.value.length;
    if (countEl) countEl.textContent = len;
    if (len >= maxLength) {
      if (counterWrap) counterWrap.classList.add('is-limit');
      if (limitTag) limitTag.classList.remove('hidden');
    } else {
      if (counterWrap) counterWrap.classList.remove('is-limit');
      if (limitTag) limitTag.classList.add('hidden');
    }
  };

  if (input) {
    input.addEventListener('input', updateCounter);
    setTimeout(() => {
      input.focus();
      const dotIdx = safeDefault.lastIndexOf('.');
      if (dotIdx > 0) {
        input.setSelectionRange(0, dotIdx);
      } else {
        input.select();
      }
      updateCounter();
    }, 50);
  }

  const close = () => {
    backdrop.style.opacity = '0';
    setTimeout(() => backdrop.remove(), 150);
  };

  const handleConfirm = () => {
    const val = input.value.trim();
    if (!val) {
      input.focus();
      return;
    }
    close();
    if (typeof onConfirm === 'function') {
      onConfirm(val);
    }
  };

  cancelBtn.addEventListener('click', close);
  confirmBtn.addEventListener('click', handleConfirm);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
    if (e.key === 'Escape') close();
  });
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
}

function promptRenameCurrentFile() {
  const currentName = state.fileName || (state.file ? state.file.name : 'subtitle.srt');
  showPromptModal({
    title: 'Rename Subtitle File',
    message: 'Enter a new name for your subtitle file (max 60 characters):',
    defaultValue: currentName,
    maxLength: 60,
    placeholder: 'e.g., Movie_Bangla.srt',
    confirmText: 'Rename',
    onConfirm: (newName) => {
      const cleanName = sanitizeFileName(newName, 60);
      state.fileName = cleanName;
      if (fileName) {
        fileName.textContent = cleanName;
        fileName.setAttribute('title', cleanName);
      }
      const resName = $('resultFileName');
      if (resName) {
        resName.textContent = cleanName;
      }
      const resPill = $('resultFileNamePill');
      if (resPill) {
        resPill.setAttribute('title', cleanName);
      }
      saveCurrentSession();
      showToast(`Subtitle renamed to "${cleanName}"`);
    }
  });
}

function updateAuthUI(user) {
  const googleSignInBtn = $('googleSignInBtn');
  const userProfileWrap = $('userProfileWrap');
  const userAvatarImg = $('userAvatarImg');
  const userShortName = $('userShortName');
  const dropdownUserName = $('dropdownUserName');
  const dropdownUserEmail = $('dropdownUserEmail');
  const authSettingsSection = $('authSettingsSection');

  const settingsAuthLoggedOut = $('settingsAuthLoggedOut');
  const settingsAuthLoggedIn = $('settingsAuthLoggedIn');
  const settingsProfileAvatar = $('settingsProfileAvatar');
  const settingsProfileName = $('settingsProfileName');
  const settingsProfileEmail = $('settingsProfileEmail');
  const settingsAuthStatusBadge = $('settingsAuthStatusBadge');
  const settingsAuthDot = $('settingsAuthDot');
  const settingsAuthText = $('settingsAuthText');

  if (user) {
    // Header UI: Show user profile dropdown, hide Sign In button
    if (googleSignInBtn) googleSignInBtn.classList.add('hidden');
    if (userProfileWrap) userProfileWrap.classList.remove('hidden');

    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const fallbackAvatar = generateUserAvatarSvg(displayName, user.email);
    const photoUrl = (user.photoURL && user.photoURL.startsWith('http')) ? user.photoURL : fallbackAvatar;

    if (userAvatarImg) {
      userAvatarImg.referrerPolicy = 'no-referrer';
      userAvatarImg.onerror = () => { userAvatarImg.src = fallbackAvatar; };
      userAvatarImg.src = photoUrl;
    }
    if (userShortName) userShortName.textContent = displayName.split(' ')[0];
    if (dropdownUserName) dropdownUserName.textContent = displayName;
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || '';

    // Settings UI: Completely hide auth banner when logged in
    if (authSettingsSection) authSettingsSection.classList.add('hidden');
    if (settingsAuthLoggedOut) settingsAuthLoggedOut.classList.add('hidden');
    if (settingsAuthLoggedIn) settingsAuthLoggedIn.classList.remove('hidden');

    if (settingsProfileAvatar) {
      settingsProfileAvatar.referrerPolicy = 'no-referrer';
      settingsProfileAvatar.onerror = () => { settingsProfileAvatar.src = fallbackAvatar; };
      settingsProfileAvatar.src = photoUrl;
    }
    if (settingsProfileName) settingsProfileName.textContent = displayName;
    if (settingsProfileEmail) settingsProfileEmail.textContent = user.email || '';

    if (settingsAuthStatusBadge) settingsAuthStatusBadge.className = 'auth-sync-status-badge sync-active';
    if (settingsAuthDot) settingsAuthDot.className = 'sync-dot';
    if (settingsAuthText) settingsAuthText.textContent = 'Cloud Sync Active';
  } else {
    // Header UI: Show Sign In button, hide user profile dropdown
    if (googleSignInBtn) googleSignInBtn.classList.remove('hidden');
    if (userProfileWrap) userProfileWrap.classList.add('hidden');

    // Settings UI: Show simple auth banner when logged out
    if (authSettingsSection) authSettingsSection.classList.remove('hidden');
    if (settingsAuthLoggedOut) settingsAuthLoggedOut.classList.remove('hidden');
    if (settingsAuthLoggedIn) settingsAuthLoggedIn.classList.add('hidden');

    if (settingsAuthStatusBadge) settingsAuthStatusBadge.className = 'auth-sync-status-badge';
    if (settingsAuthDot) settingsAuthDot.className = 'sync-dot dot-off';
    if (settingsAuthText) settingsAuthText.textContent = 'Not Signed In';
  }
}

// ── 7-Day Cloud Subtitle Archive Controller ──

function generateHistoryCardsHtml(items) {
  const escapeTxt = (str) => {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  };

  return items.map(item => {
    const docId = item.docId || item.id || '';
    const safeFileName = escapeTxt(item.fileName || 'subtitle.srt');

    // ── Dedicated In-Progress Cloud Job Card ──
    if (item.isInProgress) {
      const isCondense = item.action === 'condense';
      const actionName = isCondense ? 'Condensing' : 'Translating';
      const progressPct = Math.min(99, Math.max(0, Number(item.progress) || 0));
      const processedCount = item.processedBlocks || 0;
      const totalCount = item.totalBlocks || 0;

      return `
        <div class="cloud-history-item is-in-progress" data-id="active_cloud_job" id="cloudHistoryInProgressCard">
          <div class="cloud-item-info">
            <div class="cloud-item-title-row">
              <span class="cloud-item-title" title="${safeFileName}">${safeFileName}</span>
              <span class="in-progress-badge" title="AI Cloud Background Processing Active">
                <span class="pulse-dot"></span>
                <span>${actionName} (${progressPct}%)</span>
              </span>
            </div>
            
            <div class="history-in-progress-bar-wrap">
              <div class="history-in-progress-bar">
                <div class="history-progress-fill" id="historyCardProgressFill" style="width:${progressPct}%;"></div>
              </div>
              <div class="history-progress-status-row">
                <span id="historyCardProgressText">${processedCount} / ${totalCount} subtitles (${progressPct}%)</span>
                <span class="cloud-running-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:12px;height:12px;display:inline-block;vertical-align:-1px;margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Running in Cloud Background</span>
              </div>
            </div>

            <div class="cloud-item-meta">
              <span class="meta-pill">
                <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span>${escapeTxt(item.modelUsed || 'AI')}</span>
              </span>
              <span class="meta-pill">
                <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>${escapeTxt(item.targetLang || 'Bengali')}</span>
              </span>
            </div>
          </div>

          <div class="cloud-item-actions in-progress-actions">
            <button class="btn btn-cloud-view-live" type="button" id="btnHistoryViewLive" title="View live translation dashboard on Translator tab">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>View in Translator</span>
            </button>
            <button class="btn btn-cloud-cancel-job" type="button" id="btnHistoryCancelJob" title="Cancel this background process and remove from history">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      `;
    }

    const createdDate = item.createdAtMs ? new Date(item.createdAtMs).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Recently';

    const expiresAt = item.expiresAtMs || (item.createdAtMs ? item.createdAtMs + (7 * 24 * 60 * 60 * 1000) : 0);
    const nowMs = Date.now();
    const diffMs = expiresAt ? Math.max(0, expiresAt - nowMs) : (item.daysLeft ? item.daysLeft * 24 * 3600 * 1000 : 7 * 24 * 3600 * 1000);
    const diffHours = diffMs / (1000 * 60 * 60);

    let expiryText = 'Expires in 7d';
    let isUrgent = false;

    if (diffMs <= 0) {
      expiryText = 'Expired';
      isUrgent = true;
    } else if (diffHours > 24) {
      const days = Math.ceil(diffHours / 24);
      expiryText = `Expires in ${days}d`;
      isUrgent = days <= 1;
    } else if (diffHours >= 1) {
      const hours = Math.ceil(diffHours);
      expiryText = `Expires in ${hours}h`;
      isUrgent = true;
    } else {
      const mins = Math.max(1, Math.ceil(diffMs / (1000 * 60)));
      expiryText = `Expires in ${mins}m`;
      isUrgent = true;
    }

    const isCondensedItem = !!(item.isCondensed || /condens|glance/i.test(item.fileName || ''));

    return `
      <div class="cloud-history-item" data-id="${docId}">
        <div class="cloud-item-info">
          <div class="cloud-item-title-row">
            <span class="cloud-item-title" title="${safeFileName}">${safeFileName}</span>
            <button class="btn-cloud-rename" type="button" data-docid="${docId}" title="Rename file">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </button>
            ${isCondensedItem ? `
              <span class="condensed-badge" title="AI Condensed & Shortened Subtitle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:2px;">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span>Condensed</span>
              </span>
            ` : ''}
            <span class="expiry-badge ${isUrgent ? 'urgent' : ''}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;margin-right:2px;">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>${expiryText}</span>
            </span>
          </div>
          <div class="cloud-item-meta">
            <span class="meta-pill">
              <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${createdDate}</span>
            </span>
            <span class="meta-pill">
              <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>${escapeTxt(item.targetLang || 'Bengali')}</span>
            </span>
            <span class="meta-pill">
              <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <span>${escapeTxt(item.modelUsed || 'AI')}</span>
            </span>
            <span class="meta-pill">
              <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>${item.blockCount || 0} lines</span>
            </span>
            ${item.fileSizeFormatted ? `
              <span class="meta-pill">
                <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <span>${item.fileSizeFormatted}</span>
              </span>
            ` : ''}
          </div>
        </div>
        <div class="cloud-item-actions">
          <button class="btn btn-cloud-download" type="button" data-docid="${docId}" title="Download .SRT file">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Download</span>
          </button>
          <button class="btn btn-cloud-condense" type="button" data-docid="${docId}" title="Load & AI Condense into glance speed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>Condense</span>
          </button>
          <button class="btn btn-cloud-delete" type="button" data-docid="${docId}" title="Delete from Cloud">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function wireHistoryActions(container, items, onListMutated, onCondenseChosen) {
  // Wire "View in Translator" click handler
  const viewLiveBtn = container.querySelector('#btnHistoryViewLive');
  if (viewLiveBtn) {
    viewLiveBtn.addEventListener('click', async () => {
      switchAppTab('translator');
      if (progressCard) {
        progressCard.classList.remove('hidden');
        progressCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (window.FirebaseCloudSync && window.FirebaseCloudSync.getUser()) {
        const job = await window.FirebaseCloudSync.getActiveCloudJob();
        if (job && (job.status === 'running' || job.status === 'in_progress')) {
          handleCloudJobUpdate(job);
          if (activeCloudJobListenerUnsub) activeCloudJobListenerUnsub();
          activeCloudJobListenerUnsub = window.FirebaseCloudSync.listenActiveCloudJob(handleCloudJobUpdate);
        }
      }
    });
  }

  // Wire "Cancel" on in-progress cloud job
  const cancelJobBtn = container.querySelector('#btnHistoryCancelJob');
  if (cancelJobBtn) {
    cancelJobBtn.addEventListener('click', async () => {
      const confirmed = await showCustomConfirm({
        title: 'Cancel Background Process?',
        message: 'Are you sure you want to cancel this ongoing background process? It will be stopped and removed from Cloud History.',
        confirmText: 'Yes, Cancel Process',
        cancelText: 'Keep Running',
        type: 'danger'
      });
      if (!confirmed) return;

      showToast('Cancelling background process...');
      if (window.FirebaseCloudSync) {
        await window.FirebaseCloudSync.cancelActiveCloudJob();
        await window.FirebaseCloudSync.clearActiveCloudJob();
      }

      state.isTranslating = false;
      state.isCondensing = false;
      state.isCloudJob = false;
      resetTranslateButton();
      checkReadyToTranslate();

      if (activeCloudJobListenerUnsub) {
        try { activeCloudJobListenerUnsub(); } catch (e) {}
        activeCloudJobListenerUnsub = null;
      }

      if (progressCard) progressCard.classList.add('hidden');
      const cloudJobBadge = $('cloudJobBadge');
      if (cloudJobBadge) cloudJobBadge.classList.add('hidden');

      renderCloudHistoryUI();
      showToast('Process cancelled and removed.');
    });
  }

  // Wire Download click handlers
  container.querySelectorAll('.btn-cloud-download').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-docid');
      const item = items.find(h => (h.docId || h.id) === docId);
      if (item && item.srtContent) {
        triggerDirectSrtDownload(item.fileName || 'translated_subtitle.srt', item.srtContent);
        showToast(`Downloaded ${item.fileName}`);
      }
    });
  });

  // Wire AI Condense click handlers
  container.querySelectorAll('.btn-cloud-condense').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-docid');
      const item = items.find(h => (h.docId || h.id) === docId);
      if (item && item.srtContent) {
        if (typeof onCondenseChosen === 'function') {
          onCondenseChosen();
        }

        const parsed = parseSRT(item.srtContent);
        if (!parsed || parsed.length === 0) {
          showToast('Could not parse subtitle file.', true);
          return;
        }

        localStorage.removeItem('srt_session_last_cleared');

        // Populate translator state
        state.parsedBlocks = parsed;
        state.translatedBlocks = parsed.map(b => ({
          ...b,
          translatedLines: b.lines,
          isTranslated: true
        }));
        state.uncompressedBlocks = JSON.parse(JSON.stringify(state.translatedBlocks));
        state.fileName = item.fileName || 'translated_subtitle.srt';
        state.originalFileName = state.fileName;
        state.fileSize = new Blob([item.srtContent]).size;
        state.isCondensed = false;
        calculateDuration(parsed);
        state.optimalBatchSize = calculateOptimalBatchSize(parsed);

        // Switch to Translator Tab automatically
        switchAppTab('translator');

        // Render loaded file info and transition to condensing
        displayLoadedFileInfo({ name: state.fileName, size: state.fileSize }, parsed);
        saveCurrentSession();
        showToast(`Loaded "${state.fileName}". Starting AI Condenser...`);

        // Automatically kick off 2nd-pass condenser
        setTimeout(() => {
          runAiCondensePipeline();
        }, 300);
      }
    });
  });

  // Wire Rename click handlers
  container.querySelectorAll('.btn-cloud-rename').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-docid');
      const item = items.find(h => (h.docId || h.id) === docId);
      if (item) {
        showPromptModal({
          title: 'Rename Subtitle File',
          message: 'Enter a new name for this subtitle file in cloud storage (max 60 characters):',
          defaultValue: item.fileName || 'subtitle.srt',
          maxLength: 60,
          placeholder: 'e.g., Movie_Bangla.srt',
          confirmText: 'Rename',
          onConfirm: async (newName) => {
            const cleanName = sanitizeFileName(newName, 60);
            btn.disabled = true;
            const ok = await window.FirebaseCloudSync.renameCloudTranslation(docId, cleanName);
            if (ok) {
              item.fileName = cleanName;
              showToast(`Renamed to "${cleanName}"`);
              if (typeof onListMutated === 'function') onListMutated();
            } else {
              showToast('Failed to rename subtitle in cloud.', true);
              btn.disabled = false;
            }
          }
        });
      }
    });
  });

  // Wire Delete click handlers
  container.querySelectorAll('.btn-cloud-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const docId = btn.getAttribute('data-docid');
      if (!docId) return;
      const item = items.find(h => (h.docId || h.id) === docId);
      const fileName = item?.fileName || 'this subtitle file';

      const confirmed = await showCustomConfirm({
        title: 'Delete Subtitle File?',
        message: `Are you sure you want to permanently delete "${fileName}" from your cloud archive? This action cannot be undone.`,
        confirmText: 'Delete File',
        cancelText: 'Cancel',
        type: 'warning'
      });

      if (!confirmed) return;

      btn.disabled = true;
      const ok = await window.FirebaseCloudSync.deleteCloudTranslation(docId);
      if (ok) {
        showToast(`"${fileName}" deleted from cloud.`);
        if (typeof onListMutated === 'function') onListMutated();
      } else {
        showToast('Failed to delete from cloud.', true);
        btn.disabled = false;
      }
    });
  });
}

function showAllCloudHistoryModal(initialItems) {
  const existing = document.querySelector('.custom-modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'custom-modal-backdrop history-modal-backdrop';

  let currentItems = Array.isArray(initialItems) ? [...initialItems] : [];

  backdrop.innerHTML = `
    <div class="history-modal-box" role="dialog" aria-modal="true">
      <div class="modal-top-accent" style="background:linear-gradient(90deg, #6366f1, #38bdf8, #10b981);"></div>
      <div class="history-modal-header">
        <div class="history-modal-title-group">
          <div class="history-modal-heading">
            <span>All Translation History</span>
            <span class="history-count-badge" id="historyModalCountBadge">${currentItems.length} Subtitles</span>
          </div>
          <p class="history-modal-subline">7-Day Cloud Archive • Auto-removed after 7 days</p>
        </div>
        <button class="btn-history-modal-close" type="button" id="historyModalCloseBtn" title="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="history-modal-search-bar">
        <div class="history-search-input-wrap">
          <svg class="history-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" id="historyModalSearch" class="history-search-input" placeholder="Search by subtitle file name, language, or model..." autocomplete="off" spellcheck="false" />
          <button class="btn-history-clear-search hidden" type="button" id="historyModalClearBtn" title="Clear search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="history-modal-content-list" id="historyModalList"></div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const listContainer = backdrop.querySelector('#historyModalList');
  const searchInput = backdrop.querySelector('#historyModalSearch');
  const clearBtn = backdrop.querySelector('#historyModalClearBtn');
  const countBadge = backdrop.querySelector('#historyModalCountBadge');
  const closeBtn = backdrop.querySelector('#historyModalCloseBtn');

  const close = () => {
    backdrop.style.opacity = '0';
    setTimeout(() => backdrop.remove(), 150);
  };

  const renderModalList = () => {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    
    if (clearBtn) {
      if (query.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    const filtered = query
      ? currentItems.filter(item => {
          const fn = (item.fileName || '').toLowerCase();
          const lang = (item.targetLang || '').toLowerCase();
          const model = (item.modelUsed || '').toLowerCase();
          return fn.includes(query) || lang.includes(query) || model.includes(query);
        })
      : currentItems;

    if (countBadge) countBadge.textContent = `${currentItems.length} Subtitles`;

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="history-modal-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:36px;height:36px;opacity:0.6;">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>${query ? `No subtitles found matching "${query}"` : 'No history found in cloud archive.'}</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = generateHistoryCardsHtml(filtered);

    wireHistoryActions(listContainer, filtered, async () => {
      listContainer.innerHTML = `
        <div class="history-modal-loading">
          <div class="history-spinner"></div>
          <span>Updating cloud archive...</span>
        </div>
      `;
      const updated = await window.FirebaseCloudSync?.getCloudTranslationHistory();
      if (updated) {
        currentItems = updated;
        renderModalList();
        renderCloudHistoryUI();
      }
    }, () => {
      close();
    });
  };

  renderModalList();

  if (searchInput) {
    searchInput.addEventListener('input', renderModalList);
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      renderModalList();
    });
  }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  window.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      close();
      window.removeEventListener('keydown', escHandler);
    }
  });
}

async function renderCloudHistoryUI() {
  const loggedOutMsg = $('cloudHistoryLoggedOutMsg');
  const emptyMsg = $('cloudHistoryEmptyMsg');
  const loadingEl = $('cloudHistoryLoading');
  const listContainer = $('cloudHistoryList');
  const refreshBtn = $('refreshCloudHistoryBtn');

  if (!loggedOutMsg || !emptyMsg || !listContainer) return;

  const user = window.FirebaseCloudSync?.getUser();

  // 1. If user is signed out, immediately display the sign in message, NO LOADING SPINNER
  if (!user) {
    if (loadingEl) loadingEl.classList.add('hidden');
    loggedOutMsg.classList.remove('hidden');
    emptyMsg.classList.add('hidden');
    listContainer.classList.add('hidden');
    if (refreshBtn) {
      refreshBtn.classList.remove('is-refreshing');
      refreshBtn.classList.add('hidden');
    }
    return;
  }

  // 2. User is signed in -> fetch cloud history
  if (refreshBtn) {
    refreshBtn.classList.remove('hidden');
    refreshBtn.classList.add('is-refreshing');
  }
  loggedOutMsg.classList.add('hidden');
  emptyMsg.classList.add('hidden');
  listContainer.classList.add('hidden');
  if (loadingEl) loadingEl.classList.remove('hidden');

  try {
    const historyItems = await window.FirebaseCloudSync.getCloudTranslationHistory();

    if (loadingEl) loadingEl.classList.add('hidden');

    if (!historyItems || historyItems.length === 0) {
      emptyMsg.classList.remove('hidden');
      listContainer.classList.add('hidden');
      return;
    }

    emptyMsg.classList.add('hidden');
    listContainer.classList.remove('hidden');

    const itemsToRender = historyItems.slice(0, 3);
    let cardsHtml = generateHistoryCardsHtml(itemsToRender);

    if (historyItems.length > 3) {
      cardsHtml += `
        <div class="see-all-history-wrap">
          <button id="seeAllHistoryBtn" class="btn btn-see-all-history" type="button" title="View all ${historyItems.length} subtitles in a popup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>See All (${historyItems.length} Subtitles)</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;opacity:0.7;">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      `;
    }

    listContainer.innerHTML = cardsHtml;

    const seeAllBtn = $('seeAllHistoryBtn');
    if (seeAllBtn) {
      seeAllBtn.addEventListener('click', () => {
        showAllCloudHistoryModal(historyItems);
      });
    }

    wireHistoryActions(listContainer, itemsToRender, () => {
      renderCloudHistoryUI();
    });

  } catch (err) {
    console.error('Error rendering cloud history:', err);
    if (loadingEl) loadingEl.classList.add('hidden');
  } finally {
    if (refreshBtn) {
      setTimeout(() => refreshBtn.classList.remove('is-refreshing'), 300);
    }
  }
}

function triggerDirectSrtDownload(fileName, srtContent) {
  const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.srt') ? fileName : `${fileName}.srt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Refresh & Page Exit Confirmation Guard ──
window.addEventListener('beforeunload', (e) => {
  const isBusy = (state.isTranslating || state.isCondensing) && !state.isCancelled;
  const hasFile = state.parsedBlocks && state.parsedBlocks.length > 0;
  if (isBusy || hasFile) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
});
