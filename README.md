# 🧠 Agentic.ai — AI Content Strategy Agent

> **A memory-driven, AI-powered content intelligence platform built for creators who want data-backed strategy, not guesswork.**

![Agentic.ai](https://img.shields.io/badge/Agentic-Content%20Intelligence-6366f1?style=for-the-badge&logo=brain&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 🚀 Overview

**Agentic.ai** is a browser-based, AI-powered **Content Strategy Agent** that uses a persistent **Hindsight Memory Bank** to generate personalized, data-driven content recommendations. Built for the hackathon, it leverages the **Google Gemini API** to analyze past content performance and deliver actionable strategy in real time.

The core idea: *your own content history is the best training data*. By logging past post performance into the memory bank, the agent learns your unique content DNA and uses it to plan, predict, and critique future content.

---

## ✨ Features

### 🎯 Core Capabilities
| Feature | Description |
|---|---|
| **7-Day Content Plan** | Generates a full week of content anchored to your highest-performing memory patterns |
| **Content DNA Analysis** | Analyses your unique tone, formats, and top content vectors from memory data |
| **What To Stop** | Identifies and eliminates low-performing content concepts based on engagement data |
| **Audience Persona** | Infers skill levels and behavioral preferences from your engagement signals |

### 🔬 Analysis Tools
| Tool | Description |
|---|---|
| **Viral Predictor** | Scores your content idea 0–100 against your memory patterns using AI |
| **Roast Mode** | Delivers a merciless, brutally honest critique of your draft post |

### 🧠 Hindsight Memory Bank
- Log past posts with topic, format, and engagement metrics
- Memory persists in **localStorage** (no backend needed)
- All AI responses are contextualised against your logged memories
- Visual memory counter with animated ring indicator

### 🎨 Premium UI/UX
- Dark-mode glassmorphism design with animated ambient orbs
- Smooth micro-animations and hover effects
- Responsive sidebar + main panel layout
- Markdown-rendered AI output via `marked.js`
- Phosphor Icons throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | HTML5 (semantic) |
| **Styling** | Vanilla CSS (glassmorphism, CSS animations, CSS Grid) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **AI Engine** | Google Gemini API (`gemini-2.0-flash`) |
| **Markdown** | [marked.js](https://marked.js.org/) v18 |
| **Icons** | [Phosphor Icons](https://phosphoricons.com/) |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) |

---

## 📦 Getting Started

### Prerequisites
- A modern web browser (Chrome, Edge, Firefox)
- *(Optional)* A free **Google Gemini API Key** from [AI Studio](https://aistudio.google.com/app/apikey)

> **Note:** The app includes a **demo mode** and works without an API key. A real API key unlocks live AI-generated responses.

### Installation

```bash
# 1. Clone or download the project
git clone <your-repo-url>
cd HACKATHON

# 2. Install dependencies (only marked.js)
npm install

# 3. Open index.html directly in your browser
# No build step required!
```

Or simply open `index.html` directly in your browser — no server needed.

---

## ⚙️ Configuration

1. Click the **API Config** button (⚙️) in the top-right corner
2. Paste your **Google Gemini API Key** (`AIzaSy...`)
3. Click **Save Configuration**

Your key is stored **only in your browser's localStorage** and is never transmitted anywhere except directly to Google's API.

---

## 📖 How To Use

### Step 1 — Build Your Memory Bank
1. Click **"Log New Memory"** in the sidebar
2. Enter a past post's **topic/context**, **media format**, and **engagement/views**
3. Save it — repeat for multiple past posts to give the agent more data

### Step 2 — Run a Capability
Click any of the 4 capability cards:
- **7-Day Content Plan** → Get a full weekly calendar
- **Content DNA** → Understand your unique creator profile
- **What To Stop** → Prune underperforming angles
- **Audience Persona** → Know exactly who you're creating for

### Step 3 — Use Analysis Tools
- **Viral Predictor:** Type a content idea → click *Predict* → get a 0–100 score with reasoning
- **Roast Mode:** Paste a draft post → click *Roast It* → receive brutal, constructive feedback

---

## 📁 Project Structure

```
HACKATHON/
├── index.html          # Main application shell & UI structure
├── style.css           # Full design system (glassmorphism, animations, layout)
├── app.js              # Core logic (memory management, Gemini API, agent engine)
├── package.json        # Node dependencies (marked.js)
└── README.md           # This file
```

---

## 🧩 How It Works (Architecture)

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│  ┌──────────────┐     ┌────────────────────────┐ │
│  │ Memory Bank  │────▶│   Prompt Builder       │ │
│  │ (localStorage│     │ (injects memories into │ │
│  │  JSON array) │     │  system context)       │ │
│  └──────────────┘     └──────────┬─────────────┘ │
│                                  │               │
│                          ┌───────▼──────────┐    │
│                          │  Gemini API Call │    │
│                          │ (gemini-2.0-flash│    │
│                          └───────┬──────────┘    │
│                                  │               │
│                          ┌───────▼──────────┐    │
│                          │  marked.js render│    │
│                          │  → Output Panel  │    │
│                          └──────────────────┘    │
└─────────────────────────────────────────────────┘
```

1. **Memory Logging** — User logs post performance data into localStorage
2. **Context Injection** — Logged memories are serialised into a rich system prompt
3. **Gemini API** — The prompt is sent to `gemini-2.0-flash` with a capability-specific instruction
4. **Markdown Rendering** — The AI response is rendered as formatted markdown in the output panel

---

## 🔑 API Key Security

- API keys are stored **exclusively in `localStorage`** on the user's own device
- Keys are sent **only** in direct HTTPS requests to `generativelanguage.googleapis.com`
- No backend, no database, no third-party logging
- The app works in **offline demo mode** if no key is provided

---

## 🏆 Hackathon Context

This project was built for a hackathon focused on **Agentic AI** — AI systems that act autonomously using memory, planning, and tools. Agentic.ai demonstrates:

- ✅ **Memory** — Persistent hindsight data informs all agent decisions
- ✅ **Planning** — Multi-day content calendars generated from past performance
- ✅ **Tool Use** — Viral prediction and critique tools powered by AI
- ✅ **Persona** — Audience inference from engagement patterns

---

## 📄 License

This project was created for hackathon purposes. Feel free to fork and extend it.

---

<div align="center">
  <strong>Built with 🧠 + ☕ for the Hackathon</strong><br>
  <em>Agentic.ai — Content Intelligence, Powered by Memory</em>
</div>
