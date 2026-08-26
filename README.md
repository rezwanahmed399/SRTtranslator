# SubSync AI Studio — Precision Subtitle Translator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**SubSync AI** is a state-of-the-art, 100% client-side web application designed to translate SRT subtitle files with zero timing drift, automatic overlap resolution, glance-optimized reading length, and instant 1-click SRT export.

---

## ✨ Key Features

- **⏱️ 100% Timing Preservation:** Subtitle timecodes are isolated during translation, guaranteeing that timing never drifts or gets desynchronized.
- **⚡ Zero Overlap Engine:** Automatically detects and resolves dialogue collisions so subtitles never appear on top of each other.
- **🧠 Live Gemini Model Integration:** Connects directly to Google Gemini API to fetch available models live (Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 2.0 Flash, etc.).
- **📦 Adaptive Smart Chunking:** Automatically calculates optimal 25–35 line request batches based on subtitle length and rate limits.
- **🗣️ Natural Dialogue & Pronoun Rules:** Translates conversationally rather than word-for-word. Enforces polite/natural pronouns (e.g. "তুমি / তোমার" in Bengali).
- **📋 Raw SRT Code Box (1-Click Copy):** View the formatted subtitle output and copy the entire file with one click.
- **📥 Auto-Download:** Automatically generates and downloads clean UTF-8 encoded `.srt` files compatible with VLC, TVs, and all major media players.
- **🔒 100% Private & Client-Side:** Your API key and subtitle files are processed directly in your browser. No server storage or third-party intermediaries.

---

## 🚀 How to Deploy to Vercel (1-Click)

### Method 1: Push to GitHub & Connect with Vercel (Recommended)

1. **Initialize Git & Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SubSync AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/subsync-ai.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your `subsync-ai` GitHub repository.
   - Click **Deploy** (No build settings or framework configurations needed!).
   - Your site is live worldwide with free global CDN and SSL!

---

## 💻 Local Usage

Simply double-click `index.html` or serve with any static HTTP server:

```bash
# Using Node / npx
npx serve .

# Using Python
python -m http.server 3000
```

---

## 🔑 Requirements
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- Standard `.srt` subtitle file.

---

## 📄 License
MIT License
