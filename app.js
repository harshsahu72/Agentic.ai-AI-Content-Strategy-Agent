4/**
 * Agentic AI - App Logic
 * Client-side integration with LocalStorage Memory & Gemini API
 */

document.addEventListener('DOMContentLoaded', () => {

    // ---- State Management ----
    let settings = JSON.parse(localStorage.getItem('agentSettings')) || { apiKey: '' };

    let defaultMemory = [
        { id: 1, content: "Post about 5 AI tools that will save you hours.", format: "Carousel / Slides", engagement: 14200, date: new Date().toISOString() },
        { id: 2, content: "My personal morning routine and why waking up at 5AM is crucial.", format: "Text / Tweet", engagement: 210, date: new Date().toISOString() },
        { id: 3, content: "A deep dive tutorial on using Python for data analysis.", format: "Longform / Blog", engagement: 890, date: new Date().toISOString() },
        { id: 4, content: "Stop using ChatGPT like a google search. Try this prompt structure instead...", format: "Reel / Short Video", engagement: 35000, date: new Date().toISOString() }
    ];

    let memory = JSON.parse(localStorage.getItem('agentMemory'));
    if (!memory) {
        memory = defaultMemory;
        localStorage.setItem('agentMemory', JSON.stringify(memory));
    }

    // ---- DOM Elements ----
    const elements = {
        settingsBtn:    document.getElementById('settings-btn'),
        settingsModal:  document.getElementById('settings-modal'),
        closeModals:    document.querySelectorAll('.close-modal'),
        apiKeyInput:    document.getElementById('api-key-input'),
        saveSettingsBtn:document.getElementById('save-settings'),

        addMemoryBtn:   document.getElementById('add-memory-btn'),
        memoryModal:    document.getElementById('memory-modal'),
        memoryContent:  document.getElementById('memory-content'),
        memoryFormat:   document.getElementById('memory-format'),
        memoryEngagement: document.getElementById('memory-engagement'),
        saveMemoryBtn:  document.getElementById('save-memory'),

        memoryCount:    document.getElementById('memory-count'),
        memoryList:     document.getElementById('memory-list'),

        outputPanel:    document.getElementById('output-content'),
        loading:        document.getElementById('loading'),

        actionCards:    document.querySelectorAll('.action-card'),
        predictBtn:     document.querySelector('[data-action="predict"]'),
        roastBtn:       document.querySelector('[data-action="roast"]'),

        viralInput:     document.getElementById('viral-input'),
        roastInput:     document.getElementById('roast-input')
    };

    // ---- Modal Helpers ----
    const openModal  = (node) => node.classList.add('active');
    const closeModal = (node) => node.classList.remove('active');

    // ---- Initialization ----
    const initUI = () => {
        elements.apiKeyInput.value = settings.apiKey;
        if (settings.apiKey) {
            elements.settingsBtn.innerHTML = '<i class="ph ph-check-circle" style="color:#10b981;"></i> Configured';
        } else {
            elements.outputPanel.innerHTML =
                '<div style="text-align:center;padding:24px;">' +
                  '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;color:#a5b4fc;margin-bottom:20px;letter-spacing:0.5px;">' +
                    '<i class="ph ph-cpu"></i> DEMO MODE ACTIVE' +
                  '</div>' +
                  '<h3 style="color:#e2e8f0;margin-bottom:8px;font-size:18px;">Ready to go — no API key needed</h3>' +
                  '<p style="color:#9ca3af;font-size:14px;margin-bottom:20px;">Click any capability card above. The agent generates smart responses from your memory data.</p>' +
                  '<p style="color:#6b7280;font-size:12px;">Want live AI? Click <strong style="color:#a5b4fc;">Agent Config</strong> and paste a free <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#60a5fa;">Gemini API key</a>.</p>' +
                '</div>';
        }
        renderMemory();
    };

    // ---- Modal Event Listeners ----
    elements.settingsBtn.addEventListener('click', () => openModal(elements.settingsModal));
    elements.addMemoryBtn.addEventListener('click', () => openModal(elements.memoryModal));

    elements.closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal-overlay')));
    });

    elements.saveSettingsBtn.addEventListener('click', () => {
        settings.apiKey = elements.apiKeyInput.value.trim();
        localStorage.setItem('agentSettings', JSON.stringify(settings));
        closeModal(elements.settingsModal);
        if (settings.apiKey) {
            elements.settingsBtn.innerHTML = '<i class="ph ph-check-circle" style="color:#10b981;"></i> Configured';
        } else {
            elements.settingsBtn.innerHTML = '<i class="ph ph-gear"></i> Agent Config';
        }
    });

    // ---- Memory Synthesizer ----
    elements.saveMemoryBtn.addEventListener('click', () => {
        const content = elements.memoryContent.value.trim();
        const format  = elements.memoryFormat.value;
        const eng     = parseInt(elements.memoryEngagement.value) || 0;

        if (!content) return alert("Strategic parameter 'Content' cannot be empty.");

        memory.unshift({ id: Date.now(), content, format, engagement: eng, date: new Date().toISOString() });
        localStorage.setItem('agentMemory', JSON.stringify(memory));

        elements.memoryContent.value   = '';
        elements.memoryEngagement.value = '';
        closeModal(elements.memoryModal);
        renderMemory();
    });

    const renderMemory = () => {
        // Update both count badges
        const count = memory.length;
        elements.memoryCount.innerText = count;
        const ring = document.getElementById('memory-count-ring');
        if (ring) ring.innerText = count;

        if (count === 0) {
            elements.memoryList.innerHTML =
                '<div style="color:var(--text-lo,#475569);font-size:12px;text-align:center;padding:24px 16px;line-height:1.6;">' +
                '<i class="ph ph-database" style="display:block;font-size:28px;margin-bottom:8px;opacity:0.3;"></i>' +
                'Memory bank is empty.<br>Add your first context record above.' +
                '</div>';
            return;
        }

        elements.memoryList.innerHTML = memory.map(m =>
            '<div class="memory-item">' +
              '<div class="format">' + m.format + '</div>' +
              '<div class="topic">"' + (m.content.length > 55 ? m.content.substring(0, 55) + '...' : m.content) + '"</div>' +
              '<div class="eng"><i class="ph-fill ph-trend-up"></i> ' + m.engagement.toLocaleString() + ' interactions</div>' +
            '</div>'
        ).join('');
    };

    // ---- Core AI System Instructions ----
    const getSystemInstructions = () =>
        'You are an advanced AI Content Strategy Agent powered by "MEMORY" (a database of the user\'s past actions and results).\n' +
        'You learn from past content and adapt realistically.\n\n' +
        'YOUR CAPABILITIES & RULES:\n' +
        '1. 7-DAY CONTENT PLAN: Output a weekly table/list with (Topic, Hook, Format, Goal). Prioritize high-performing formats/topics dynamically fetched from MEMORY.\n' +
        '2. CONTENT DNA: Output an analysis of their profile. Define their Tone, Hooks, and Top content vectors using MEMORY.\n' +
        '3. WHAT TO STOP: Critically identify what underperforms in MEMORY and confidently tell the user to STOP doing it and WHY.\n' +
        '4. AUDIENCE PERSONA: Infer standard psychographics (skill level, core desires) strictly looking at what got high engagement in MEMORY.\n' +
        '5. VIRAL PREDICTION: Score a new idea 0-100 based strictly on patterns from MEMORY. State reasons why.\n' +
        '6. ROAST MODE: Brutal, witty critique. Point out lack of value or bad hooks.\n\n' +
        'STRICT OUTPUT RULES:\n' +
        '- Output pure Markdown. Use bolding (**), lists, and headings (##).\n' +
        '- NEVER say "As an AI...". Embody the persona of a cutthroat, highly-paid elite content strategist.\n' +
        '- ALWAYS explicitly cite a node from MEMORY to prove you are analyzing data.\n' +
        '- If MEMORY lacks data for a thorough analysis, provide strong strategic advice but insult them (professionally) for not providing enough data.\n\n' +
        'CURRENT HINDSIGHT DATA (MEMORY):\n' +
        JSON.stringify(memory.slice(0, 20));

    // ---- Demo Mode Engine ----
    const generateDemoResponse = (taskName, inputData) => {
        inputData = inputData || '';

        const sorted    = [...memory].sort((a, b) => b.engagement - a.engagement);
        const top       = sorted[0]                   || { content: 'N/A', format: 'N/A', engagement: 0 };
        const bottom    = sorted[sorted.length - 1]   || top;
        const formats   = [...new Set(memory.map(m => m.format))];
        const totalEng  = memory.reduce((s, m) => s + m.engagement, 0);
        const avgEng    = memory.length ? Math.round(totalEng / memory.length) : 0;
        const days      = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

        // --- Build reusable blocks ---
        const dayPlan = (memory.length ? sorted.slice(0, 7) : days.map((d, i) => ({ content: 'AI Tools & Productivity tip #' + (i + 1), format: 'Carousel' })))
            .map((m, i) => '**Day ' + (i + 1) + ' — ' + days[i] + ':** ' + m.content.substring(0, 60) + '… *(' + m.format + ')*')
            .join('\n');

        const formatStats = formats.map(f => {
            const items = memory.filter(m => m.format === f);
            const avg   = Math.round(items.reduce((s, m) => s + m.engagement, 0) / items.length);
            return '- **' + f + '** — avg ' + avg.toLocaleString() + ' interactions (' + items.length + ' posts)';
        }).join('\n');

        const worstTruth = bottom.engagement < 500
            ? '- You are wasting execution energy on formats your audience ignores.\n- Low engagement = the algorithm buries you. Stop feeding it bad signals.'
            : '- Even your lowest performer is decent — push your ceiling higher by doubling down on what works.';

        const viralScore = Math.min(95, 55 + Math.floor(Math.random() * 35));
        const viralMatch = /ai|tool|tip|hack|top|vs|how/i.test(inputData)
            ? '✅ HIGH — keyword overlap detected'
            : '⚠️ MEDIUM — limited keyword overlap with proven winners';

        let roastVerdict;
        if (inputData.length < 30) {
            roastVerdict = '**Too short.** This reads like a shower thought, not a post. Your audience will scroll past it before they finish the first word.';
        } else if (inputData.length < 100) {
            roastVerdict = '**It\'s fine. And "fine" is the death of a content strategy.** Your top post (' + top.engagement.toLocaleString() + ' int.) was bold. This isn\'t.';
        } else {
            roastVerdict = '**It has potential, but it\'s buried.** The hook is weak — your reader decides in 0.3 seconds. You\'re not selling the value fast enough.';
        }

        const hookOk     = /^(Stop|Never|Why|How|The|I |\d)/i.test(inputData);
        const specificOk = inputData.length > 80;
        const ctaOk      = inputData.includes('?') || inputData.includes('you');

        const responses = {
            '7-day': (
                '## 📅 7-Day Content Plan\n\n' +
                '> Strategy anchored to your top performer: **"' + top.content.substring(0, 55) + '…"** which drove **' + top.engagement.toLocaleString() + ' interactions**.\n\n' +
                dayPlan + '\n\n---\n\n' +
                '### ⚡ Execution Notes\n' +
                '- **Best format in your bank:** ' + top.format + ' — lean into it hard.\n' +
                '- **Avg engagement target:** ' + avgEng.toLocaleString() + ' per post.\n' +
                '- **Hook rule:** Lead with a number or a contrarian claim. Every. Single. Time.\n' +
                '- Post at peak hours: **Tue–Thu, 8–10 AM** your audience timezone.'
            ),
            'dna': (
                '## 🧬 Your Content DNA\n\n' +
                '> Analyzed **' + memory.length + ' memory records** | Total reach: **' + totalEng.toLocaleString() + ' interactions**\n\n' +
                '### 🎯 Core Identity\nYou are a **technical educator with viral instincts**. Your audience trusts you because you simplify complex ideas without dumbing them down.\n\n' +
                '### 📊 Format Fingerprint\n' + formatStats + '\n\n' +
                '### 🔥 Top Content Vector\n**"' + top.content + '"** → ' + top.engagement.toLocaleString() + ' interactions.\nThis is your **golden template**. Reverse-engineer the hook, structure, and CTA.\n\n' +
                '### ✍️ Tone Profile\n- **Primary:** Authoritative & Practical\n- **Secondary:** Slightly contrarian (you challenge assumptions)\n- **Avoid:** Generic motivation — your audience came for *specifics*.'
            ),
            'stop': (
                '## 🛑 What You Need to STOP Immediately\n\n' +
                '> This analysis is based on your **lowest-performing memory nodes**.\n\n' +
                '### ❌ Kill These Now\n\n' +
                '**Stop posting:** *"' + bottom.content.substring(0, 70) + '…"*\n' +
                'This format (' + bottom.format + ') delivered only **' + bottom.engagement.toLocaleString() + ' interactions** — your worst performer by a factor of ' + Math.round(top.engagement / Math.max(bottom.engagement, 1)) + '×.\n\n' +
                '### 🔑 The Hard Truth\n' + worstTruth + '\n\n' +
                '### ✅ Redirect Budget To\n' +
                '- **' + top.format + '** — your highest-ROI format (proven at ' + top.engagement.toLocaleString() + ' interactions)\n' +
                '- Shorter hooks, higher information density, clear CTA every post.'
            ),
            'persona': (
                '## 👥 Audience Persona Report\n\n' +
                '> Inferred from **' + memory.length + ' engagement data points** across your memory bank.\n\n' +
                '### 🎯 Primary Persona: The Ambitious Technologist\n' +
                '- **Age range:** 22–35\n- **Skill level:** Intermediate → Advanced\n' +
                '- **Core desire:** Shortcuts, tools, and frameworks that give them a career edge\n' +
                '- **Pain point:** Information overload — they trust curated recommendations over raw tutorials.\n\n' +
                '### 📈 Engagement Signal Analysis\n' +
                '- Posts breaking **' + Math.round(avgEng * 1.5).toLocaleString() + '+ interactions** skew toward **AI, productivity, and tools**.\n' +
                '- Your top post **"' + top.content.substring(0, 55) + '…"** (' + top.engagement.toLocaleString() + ' interactions) confirms they crave **frameworks** over theory.\n\n' +
                '### 💡 Content-Audience Match Score: **87 / 100**\nYou are speaking to the right room. Tighten your hooks to convert passive scrollers into followers.'
            ),
            'predict': (
                '## 🚀 Viral Prediction: "' + inputData + '"\n\n' +
                '### Score: **' + viralScore + ' / 100**\n\n' +
                '### 📊 Signal Analysis\n' +
                '- **Relevance match** to your top performer (' + top.engagement.toLocaleString() + ' int.): ' + viralMatch + '\n' +
                '- **Format recommendation:** ' + top.format + ' — your highest conversion format.\n' +
                '- **Hook strength:** Add a number or a bold claim to the opening line.\n\n' +
                '### ✅ What Will Work\n- Lead with a punchy stat or counter-intuitive claim\n- Promise a specific, measurable outcome\n- Reference a familiar tool your audience already uses\n\n' +
                '### ⚠️ Risk Factors\n- If this overlaps with your lowest performer ("' + bottom.content.substring(0, 40) + '…"), tighten the angle.\n- Avoid generalized advice — your audience demands specifics.'
            ),
            'roast': (
                '## 🔥 Roast Mode: Draft Analysis\n\n> *"' + inputData + '"*\n\n---\n\n' +
                '### The Verdict\n' + roastVerdict + '\n\n' +
                '### 🩺 Diagnosis\n' +
                '- **Hook:** '         + (hookOk     ? '✅ Starts with intent — good.'              : '❌ Doesn\'t grab. Start with a number, a bold claim, or a direct challenge.') + '\n' +
                '- **Specificity:** '  + (specificOk  ? '✅ Has some detail'                          : '❌ Too vague — add a data point or concrete example.') + '\n' +
                '- **CTA / Value:** '  + (ctaOk       ? '✅ Audience-aware language detected.'        : '❌ Missing. Tell them exactly what they will get.') + '\n\n' +
                '### 💊 Prescription\n- Rewrite the first 6 words. **They are your entire distribution strategy.**\n- Reference your audience\'s pain point directly.\n- End with 1 clear action or takeaway.'
            )
        };

        return responses[taskName] || '## Demo Mode\n\nNo template for this action. Add an API key for live AI responses.';
    };

    // ---- Core Agent Trigger ----
    const triggerAgent = async (taskName, inputData) => {
        inputData = inputData || '';
        const isDemo = !settings.apiKey;

        elements.loading.style.display = 'flex';
        elements.outputPanel.innerHTML = '';

        // Animate output panel
        const panelWrapper = document.getElementById('output-panel');
        panelWrapper.classList.remove('active');
        void panelWrapper.offsetWidth;
        panelWrapper.classList.add('active');

        // Build live-mode prompt
        const userCommands = {
            '7-day':   'Execute Capability 1: Generate a 7-Day Content Plan aligned with my highest performing MEMORY records.',
            'dna':     'Execute Capability 2: Extract my Content DNA. Who am I as a creator based on MEMORY?',
            'stop':    'Execute Capability 3: What do I need to STOP posting immediately? Base this on my lowest performing MEMORY nodes.',
            'persona': 'Execute Capability 4: Extrapolate my Audience Persona based on MEMORY variables.',
            'predict': 'Execute Capability 5: Viral Prediction Model. Evaluate the viability of this new concept: "' + inputData + '"',
            'roast':   'Execute Capability 6: Roast Mode. Brutally critique this draft using insights from my MEMORY: "' + inputData + '"'
        };

        try {
            if (isDemo) {
                await new Promise(r => setTimeout(r, 900));
                const demoText = generateDemoResponse(taskName, inputData);
                const badge = '<div style="display:inline-flex;align-items:center;gap:6px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#a5b4fc;margin-bottom:20px;letter-spacing:0.5px;"><i class="ph ph-cpu"></i> DEMO MODE — Add API key for live AI</div><br>';
                elements.outputPanel.innerHTML = window.marked ? badge + marked.parse(demoText) : demoText;
            } else {
                const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + settings.apiKey;
                const payload = {
                    contents: [{ role: 'user', parts: [{ text: getSystemInstructions() + '\n\n---\n\nUSER COMMAND:\n' + (userCommands[taskName] || '') }] }],
                    generationConfig: { temperature: 0.7 }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (!response.ok) {
                    let msg = (data.error && data.error.message) || ('HTTP ' + response.status);
                    if (response.status === 400) msg += ' — Verify your API key has Gemini API access.';
                    if (response.status === 429) msg += ' — Rate limit hit. Wait a moment and retry.';
                    if (response.status === 403) msg += ' — Enable the Generative Language API in Google Cloud Console.';
                    throw new Error('Gemini API Error: ' + msg);
                }

                const text = data.candidates[0].content.parts[0].text;
                elements.outputPanel.innerHTML = window.marked ? marked.parse(text) : text;
            }
        } catch (err) {
            elements.outputPanel.innerHTML =
                '<div style="color:#ef4444;background:rgba(239,68,68,0.08);padding:20px;border-radius:10px;border:1px solid rgba(239,68,68,0.3);">' +
                  '<h3 style="color:#ef4444;margin-bottom:8px;">Execution Failure</h3>' +
                  '<p style="color:#fca5a5;font-size:14px;">' + err.message + '</p>' +
                '</div>';
        } finally {
            elements.loading.style.display = 'none';
        }
    };

    // ---- Action Card Listeners ----
    elements.actionCards.forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('output-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
            triggerAgent(card.dataset.action);
        });
    });

    elements.predictBtn.addEventListener('click', () => {
        const val = elements.viralInput.value.trim();
        if (!val) {
            elements.viralInput.style.borderColor = '#ef4444';
            setTimeout(() => elements.viralInput.style.borderColor = '', 1000);
            return;
        }
        document.getElementById('output-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
        triggerAgent('predict', val);
    });

    elements.roastBtn.addEventListener('click', () => {
        const val = elements.roastInput.value.trim();
        if (!val) {
            elements.roastInput.style.borderColor = '#ef4444';
            setTimeout(() => elements.roastInput.style.borderColor = '', 1000);
            return;
        }
        document.getElementById('output-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
        triggerAgent('roast', val);
    });

    // ---- Boot ----
    initUI();

    // Spawn floating background particles
    for (let i = 0; i < 18; i++) {
        const p    = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 2;
        p.style.cssText =
            'width:' + size + 'px;' +
            'height:' + size + 'px;' +
            'left:' + (Math.random() * 100) + 'vw;' +
            'top:' + (80 + Math.random() * 20) + 'vh;' +
            'animation-duration:' + (Math.random() * 12 + 10) + 's;' +
            'animation-delay:' + (Math.random() * 10) + 's;' +
            'opacity:0;';
        document.body.appendChild(p);
    }
});
