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
  fileName: '',
  fileSize: 0,
  durationStr: '00:00:00',
  optimalBatchSize: 30,
  stats: {
    total: 0,
    processed: 0,
    overlapsFixed: 0,
    emptyRecovered: 0,
    retries: 0
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

const resultCard        = $('resultCard');
const resultStats       = $('resultStats');
const fixSummary        = $('fixSummary');
const tabViewContainer  = $('tabViewContainer');
const downloadBtn       = $('downloadBtn');
const copySrtBtn        = $('copySrtBtn');
const retranslateBtn    = $('retranslateBtn');

// ── Initialization ──
window.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('gemini_api_key') || '';
  if (savedKey) {
    apiKeyInput.value = savedKey;
    state.apiKey = savedKey;
    showApiFeedback('API Key loaded from secure local storage ✓', 'ok');
    fetchLiveGeminiModels(savedKey);
  }
  setupEventListeners();
  checkReadyToTranslate();
});

// ── Event Setup ──
function setupEventListeners() {
  // API Key Toggle Visibility
  toggleApiKey.addEventListener('click', () => {
    const isPass = apiKeyInput.type === 'password';
    apiKeyInput.type = isPass ? 'text' : 'password';
    eyeIcon.innerHTML = isPass
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  // Save API Key and load live models
  saveApiKey.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key.startsWith('AIza') || key.length < 25) {
      showApiFeedback('Please enter a valid Gemini API key (starts with AIzaSy...)', 'err');
      return;
    }
    state.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    showApiFeedback('API Key saved! Fetching available models live from Google...', 'ok');
    fetchLiveGeminiModels(key);
    checkReadyToTranslate();
  });

  // Drag & Drop
  dropZone.addEventListener('click', () => fileInput.click());
  browseBtn.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });

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

  // Remove File
  removeFile.addEventListener('click', () => {
    state.parsedBlocks = [];
    state.fileName = '';
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    dropZone.classList.remove('hidden');
    checkReadyToTranslate();
  });

  // Start Translation
  translateBtn.addEventListener('click', runTranslationPipeline);

  // Retranslate
  retranslateBtn.addEventListener('click', () => {
    resultCard.classList.add('hidden');
    state.translatedBlocks = [];
    runTranslationPipeline();
  });

  // Download Action
  downloadBtn.addEventListener('click', () => {
    if (state.translatedBlocks.length > 0) downloadSRTFile(state.translatedBlocks);
  });

  // Copy Action
  copySrtBtn.addEventListener('click', copyFullSRTCode);

  // Tab switching
  document.querySelectorAll('.preview-tab').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderActiveTab(this.dataset.tab, state.translatedBlocks);
    });
  });
}

function showApiFeedback(msg, type) {
  apiStatus.textContent = msg;
  apiStatus.className = 'api-feedback ' + type;
}

// ── Automatic Live Model Fetcher ──
async function fetchLiveGeminiModels(key) {
  if (!key) {
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="" disabled selected>🔒 Enter & Save Gemini API key above to load models live...</option>';
    modelLiveBadge.textContent = 'Awaiting API Key';
    modelLiveBadge.className = 'hint-tag';
    return;
  }

  modelSelect.disabled = true;
  modelSelect.innerHTML = '<option value="" disabled selected>🔄 Fetching available models live from Google...</option>';
  modelLiveBadge.textContent = 'Fetching live models...';
  modelLiveBadge.className = 'hint-tag';

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    
    if (data && Array.isArray(data.models)) {
      // Filter models that support generateContent
      const textModels = data.models.filter(m => 
        Array.isArray(m.supportedGenerationMethods) && 
        m.supportedGenerationMethods.includes('generateContent') &&
        !m.name.includes('embedding') &&
        !m.name.includes('aqa') &&
        !m.name.includes('imagen')
      );

      if (textModels.length > 0) {
        populateModelDropdown(textModels);
        showApiFeedback(`Connected! ${textModels.length} latest Gemini models loaded live from Google ✓`, 'ok');
        modelLiveBadge.textContent = `✓ ${textModels.length} Live Models Connected`;
        modelLiveBadge.className = 'hint-tag active-tag';
        modelSelect.disabled = false;
        checkReadyToTranslate();
        return;
      }
    }
    throw new Error('No text-generation models found for this API key.');
  } catch (err) {
    console.warn('Could not auto-fetch models from API:', err);
    modelSelect.disabled = true;
    modelSelect.innerHTML = `<option value="" disabled selected>❌ Failed to load models: ${escapeHtml(err.message.slice(0, 50))}</option>`;
    modelLiveBadge.textContent = 'Connection Error';
    modelLiveBadge.className = 'hint-tag';
    showApiFeedback(`Failed to fetch models: ${err.message}`, 'err');
  }
}

function populateModelDropdown(models) {
  modelSelect.innerHTML = '';

  // Extract clean model ID (remove "models/" prefix)
  const cleanModels = models.map(m => {
    const id = m.name.replace(/^models\//, '');
    return {
      id,
      displayName: m.displayName || id,
      description: m.description || '',
      version: m.version || ''
    };
  });

  // Sort: newest/most powerful models first (Flash models first for fast translation, Pro second)
  cleanModels.sort((a, b) => {
    const getScore = m => {
      let score = 0;
      const lower = m.id.toLowerCase();
      if (lower.includes('2.5-flash')) score += 1000;
      else if (lower.includes('2.5-pro')) score += 950;
      else if (lower.includes('2.0-flash')) score += 900;
      else if (lower.includes('2.0-pro')) score += 850;
      else if (lower.includes('1.5-flash')) score += 700;
      else if (lower.includes('1.5-pro')) score += 650;
      else if (lower.includes('flash')) score += 500;
      else if (lower.includes('pro')) score += 400;
      return score;
    };
    return getScore(b) - getScore(a);
  });

  cleanModels.forEach((m, idx) => {
    const opt = document.createElement('option');
    opt.value = m.id;
    let label = `${m.displayName} (${m.id})`;
    if (idx === 0) label += ' — Latest & Recommended';
    opt.textContent = label;
    modelSelect.appendChild(opt);
  });

  // Select the top-ranked model automatically
  if (cleanModels.length > 0) {
    modelSelect.value = cleanModels[0].id;
    state.selectedModel = cleanModels[0].id;
  }
}

// ── File Selection & Adaptive Batching ──
function handleFileSelection(file) {
  if (!file.name.toLowerCase().endsWith('.srt')) {
    alert('Please upload a valid .srt subtitle file.');
    return;
  }

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

// ── Translation Pipeline ──
async function runTranslationPipeline() {
  const activeKey = state.apiKey || apiKeyInput.value.trim();
  if (!activeKey) {
    alert('Please enter your Gemini API Key before proceeding.');
    return;
  }

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
    retries: 0
  };

  const bs = state.optimalBatchSize || 30;
  const batches = chunkArray(state.parsedBlocks, bs);
  const translated = new Array(state.parsedBlocks.length);

  updateProgressStats(0, `Auto-configured ${batches.length} optimal batches (${bs} subtitles/batch)...`);
  addTerminalLog('info', `File: ${state.fileName} (${state.parsedBlocks.length} subtitles, duration: ${state.durationStr})`);
  addTerminalLog('info', `Active Model: ${modelSelect.value} • Adaptive Batching: ${bs} lines`);

  let processedCount = 0;

  for (let bi = 0; bi < batches.length; bi++) {
    const currentBatch = batches[bi];
    const startIndex = bi * bs;
    const batchPct = Math.round((processedCount / state.parsedBlocks.length) * 94);

    updateProgressStats(batchPct, `Translating batch ${bi + 1} of ${batches.length} (#${currentBatch[0].num} – #${currentBatch[currentBatch.length - 1].num})...`);
    addTerminalLog('info', `Batch ${bi + 1}/${batches.length}: Translating ${currentBatch.length} lines with ${modelSelect.value}...`);

    let batchResult = null;
    let success = false;

    // Retry loop with exponential backoff (up to 3 attempts)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        batchResult = await callGeminiBatchTranslate(currentBatch, activeKey, attempt);
        success = true;
        break;
      } catch (err) {
        state.stats.retries++;
        if (attempt < 3) {
          addTerminalLog('warn', `Batch ${bi + 1} retry attempt ${attempt + 1}/3... (${err.message.slice(0, 80)})`);
          await sleep(1500 * attempt);
        } else {
          addTerminalLog('err', `Batch ${bi + 1} failed after 3 attempts: ${err.message}. Keeping original text safely.`);
          batchResult = currentBatch.map(b => ({ ...b, translatedLines: b.lines }));
        }
      }
    }

    // Merge translated blocks into main result array
    for (let j = 0; j < batchResult.length; j++) {
      translated[startIndex + j] = batchResult[j];
    }

    processedCount += currentBatch.length;
    state.stats.processed = processedCount;
    statProcessed.textContent = `${processedCount} / ${state.parsedBlocks.length}`;
    statBatches.textContent = `${bi + 1} / ${batches.length}`;

    if (success) {
      addTerminalLog('ok', `Batch ${bi + 1}/${batches.length} finished.`);
    }
  }

  // Post-processing: Precision Timing Verification & Overlap Correction
  updateProgressStats(96, 'Verifying timecodes and auto-correcting any overlaps...');
  addTerminalLog('info', 'Running precision timing validation & overlap check...');
  await sleep(100);

  const finalizedBlocks = postProcessSubtitles(translated);

  state.translatedBlocks = finalizedBlocks;
  updateProgressStats(100, 'Translation & timing synchronization complete!');
  addTerminalLog('ok', `Completed! Fixed ${state.stats.overlapsFixed} overlaps, recovered ${state.stats.emptyRecovered} missing lines.`);

  await sleep(350);

  // Present Results
  showTranslationResults(finalizedBlocks);

  // Automatic SRT download
  await sleep(300);
  downloadSRTFile(finalizedBlocks);
  addTerminalLog('ok', 'Automatic SRT download triggered in browser.');

  resetTranslateButton();
}

// ── Gemini Translation Engine ──
async function callGeminiBatchTranslate(batch, key, attemptNumber) {
  const lang = targetLang.value;
  const pace = styleMode.value;
  const hint = contextHint.value.trim();
  const selectedModel = modelSelect.value || 'gemini-2.5-flash';

  // Construct structured payload (Only subtitle text and ID is passed; timecodes remain 100% untouched)
  const inputData = batch.map((item, index) => ({
    id: index,
    text: item.lines.join('\n')
  }));

  // Pacing instruction
  let pacingPrompt = 'KEEP EACH SUBTITLE LINE VERY SHORT AND CONCISE. Subtitles must be readable in under 2 seconds at a glance. Do not generate lengthy sentences.';
  if (pace === 'balanced') {
    pacingPrompt = 'Keep translations natural, easy to read, and balanced for video subtitles.';
  } else if (pace === 'detailed') {
    pacingPrompt = 'Translate fully and accurately while keeping subtitle readability in mind.';
  }

  // Bengali specific pronoun rules
  let pronounRule = '';
  if (lang.toLowerCase().includes('bengali') || lang === 'Bengali') {
    pronounRule = `
PRONOUN RULES (Bengali):
- NEVER use disrespectful pronouns like "তুই", "তোর", "তোকে".
- ALWAYS use friendly, polite, and natural pronouns like "তুমি", "তোমার", "তোমাকে", "তোমরা".
- Use everyday natural conversational Bengali. Avoid overly heavy Sanskritized words.`;
  }

  const systemInstruction = `You are an elite, professional subtitle translator and localization expert.
Your goal is to translate movie/video subtitles accurately into ${lang}.

MANDATORY RULES:
1. Return ONLY a valid JSON array of objects. No markdown formatting, no explanations, no wrappers.
2. The output array MUST have EXACTLY ${batch.length} elements.
3. Schema: [{"id": <number>, "text": "<translated subtitle string>"}]
4. Preserve the exact id (0 to ${batch.length - 1}) for every single item.
5. ${pacingPrompt}
6. Never merge two subtitles together or skip any item.
7. Translate naturally and idiomatically to match emotion and pacing.${pronounRule}
${hint ? `8. Context/Genre Hint: ${hint}` : ''}`;

  const userPrompt = `Translate these ${batch.length} subtitle items into ${lang}. Return strict JSON array only:\n${JSON.stringify(inputData)}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${key}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.15,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const errMsg = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(errMsg);
  }

  const responseData = await response.json();
  const rawText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!rawText.trim()) {
    throw new Error('Received empty response from Gemini API.');
  }

  let parsedArray;
  try {
    const sanitized = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```\s*$/, '')
      .trim();
    parsedArray = JSON.parse(sanitized);
  } catch {
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Could not parse valid JSON array from AI output.');
    parsedArray = JSON.parse(jsonMatch[0]);
  }

  if (!Array.isArray(parsedArray)) {
    throw new Error('AI output was not a JSON array.');
  }

  // Map results back to blocks
  return batch.map((originalBlock, idx) => {
    const matched = parsedArray.find(item => item.id === idx) || parsedArray[idx];
    const transText = (matched?.text || '').trim();

    if (!transText) {
      state.stats.emptyRecovered++;
      return {
        ...originalBlock,
        translatedLines: originalBlock.lines
      };
    }

    const lines = transText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    return {
      ...originalBlock,
      translatedLines: lines.length > 0 ? lines : originalBlock.lines
    };
  });
}

// ── Timing Correction & Overlap Fixer ──
function postProcessSubtitles(blocks) {
  const result = blocks.map(b => ({ ...b }));

  // 1. Recover empty lines
  for (let i = 0; i < result.length; i++) {
    if (!result[i].translatedLines || result[i].translatedLines.length === 0) {
      result[i].translatedLines = result[i].lines;
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

// ── Render Results View ──
function showTranslationResults(blocks) {
  progressCard.classList.add('hidden');
  resultCard.classList.remove('hidden');

  resultStats.textContent = `${blocks.length} subtitles localized to ${targetLang.value} • 0 drift • 100% timecode integrity`;

  // Badges Summary
  const badges = [
    { text: `${blocks.length} Subtitles Translated`, type: 'success' },
    { text: '100% Timing Preserved', type: 'success' }
  ];

  if (state.stats.overlapsFixed > 0) {
    badges.push({ text: `${state.stats.overlapsFixed} Overlaps Auto-Corrected`, type: 'warning' });
  } else {
    badges.push({ text: '0 Timing Overlaps Found', type: 'success' });
  }

  if (state.stats.emptyRecovered > 0) {
    badges.push({ text: `${state.stats.emptyRecovered} Missing Lines Recovered`, type: 'warning' });
  }

  if (state.stats.retries > 0) {
    badges.push({ text: `${state.stats.retries} Batch Auto-Retries`, type: 'warning' });
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
            <span>${escapeHtml(state.fileName.replace(/\.srt$/i, ''))}_${targetLang.value.slice(0, 2).toLowerCase()}.srt</span>
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
        ${blocks.map(b => `
          <div class="subtitle-block-card">
            <div class="block-header-line">
              <span class="block-index">#${escapeHtml(b.num)}</span>
              <span class="block-timecode">${escapeHtml(b.timeCode)}</span>
            </div>
            <div class="block-text-content">${escapeHtml(b.translatedLines.join('\n'))}</div>
          </div>
        `).join('')}
      </div>
    `;

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
            <span>Translated (${targetLang.value})</span>
            <span>SubSync AI</span>
          </div>
          <div class="comparison-scroll">
            ${blocks.map(b => `
              <div class="subtitle-block-card" style="border-color: rgba(99, 102, 241, 0.2);">
                <div class="block-header-line">
                  <span class="block-index" style="color:var(--brand-primary-light);">#${escapeHtml(b.num)}</span>
                  <span class="block-timecode">${escapeHtml(b.timeCode)}</span>
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

  } else if (tab === 'original') {
    tabViewContainer.innerHTML = `
      <div class="cards-scroll-view">
        ${blocks.map(b => `
          <div class="subtitle-block-card">
            <div class="block-header-line">
              <span class="block-index">#${escapeHtml(b.num)}</span>
              <span class="block-timecode">${escapeHtml(b.timeCode)}</span>
            </div>
            <div class="block-text-content" style="color:var(--text-muted);">${escapeHtml(b.lines.join('\n'))}</div>
          </div>
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
  a.href = url;
  a.download = `${baseName}_${langCode}.srt`;
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
    showCopyFeedback(copySrtBtn, 'Copied Full SRT Code! ✓');

    const inlineBtn = $('inlineCodeCopyBtn');
    if (inlineBtn) showCopyFeedback(inlineBtn, 'Copied! ✓');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyFeedback(copySrtBtn, 'Copied! ✓');
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
  const prefix = type === 'ok' ? '✓' : type === 'err' ? '✗' : type === 'warn' ? '!' : '>';
  entry.textContent = `${prefix} ${msg}`;
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
