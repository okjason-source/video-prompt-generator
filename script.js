// Load settings from localStorage
document.getElementById('openaiKey').value = localStorage.getItem('openaiKey') || '';
document.getElementById('xaiKey').value = localStorage.getItem('xaiKey') || '';
document.getElementById('anthropicKey').value = localStorage.getItem('anthropicKey') || '';
document.getElementById('geminiKey').value = localStorage.getItem('geminiKey') || '';
document.getElementById('llmProvider').value = localStorage.getItem('llmProvider') || 'openai';
document.getElementById('generatorMode').value = localStorage.getItem('generatorMode') || 'professional';
document.getElementById('ollamaUrl').value = localStorage.getItem('ollamaUrl') || 'http://localhost:11434';
document.getElementById('ollamaModel').value = localStorage.getItem('ollamaModel') || 'llama3.2:3b';

// Save settings
document.getElementById('openaiKey').addEventListener('change', (e) => {
    localStorage.setItem('openaiKey', e.target.value);
});

document.getElementById('xaiKey').addEventListener('change', (e) => {
    localStorage.setItem('xaiKey', e.target.value);
});

document.getElementById('anthropicKey').addEventListener('change', (e) => {
    localStorage.setItem('anthropicKey', e.target.value);
});

document.getElementById('geminiKey').addEventListener('change', (e) => {
    localStorage.setItem('geminiKey', e.target.value);
});

document.getElementById('llmProvider').addEventListener('change', (e) => {
    localStorage.setItem('llmProvider', e.target.value);
});

document.getElementById('generatorMode').addEventListener('change', (e) => {
    localStorage.setItem('generatorMode', e.target.value);
});

document.getElementById('ollamaUrl').addEventListener('change', (e) => {
    localStorage.setItem('ollamaUrl', e.target.value);
});

document.getElementById('ollamaModel').addEventListener('change', (e) => {
    localStorage.setItem('ollamaModel', e.target.value);
});

// Track current active tab
let currentTab = 0;

// Tab switching function
function switchTab(tabIndex) {
    currentTab = tabIndex;
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update outputs
    const outputs = document.querySelectorAll('.prompt-output');
    outputs.forEach((output, index) => {
        if (index === tabIndex) {
            output.classList.add('active');
        } else {
            output.classList.remove('active');
        }
    });
    
    // Update refinement prompt number
    document.getElementById('currentPromptNum').textContent = tabIndex + 1;
}

// Copy current prompt
function copyCurrentPrompt() {
    const currentOutput = document.getElementById(`output${currentTab}`);
    const text = currentOutput.value;
    
    if (!text.trim()) {
        alert('No prompt to copy!');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const btn = document.querySelector('.icon-btn[onclick="copyCurrentPrompt()"]');
        const originalText = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Copy all prompts
function copyAllPrompts() {
    let allText = '';
    for (let i = 0; i < 5; i++) {
        const output = document.getElementById(`output${i}`);
        const text = output.value.trim();
        if (text) {
            allText += `===== PROMPT ${i + 1} =====\n\n${text}\n\n`;
        }
    }
    
    if (!allText.trim()) {
        alert('No prompts to copy!');
        return;
    }
    
    navigator.clipboard.writeText(allText).then(() => {
        // Visual feedback
        const btn = document.querySelector('.icon-btn[onclick="copyAllPrompts()"]');
        const originalText = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Parse multiple prompts from LLM response
function parseMultiplePrompts(text) {
    // Try to split by separators
    const separators = [
        /=====\s*PROMPT\s*\d+\s*=====/gi,
        /---\s*PROMPT\s*\d+\s*---/gi,
        /\n\n\{/g  // Fallback: split by double newline before {
    ];
    
    let prompts = [];
    
    // Try first separator pattern
    prompts = text.split(separators[0]).filter(p => p.trim());
    
    // If we got exactly 5 prompts, use them
    if (prompts.length === 5) {
        return prompts.map(p => p.trim());
    }
    
    // Otherwise, try to split intelligently
    // Look for patterns like multiple { } blocks
    const promptPattern = /\{[\s\S]*?\n\}/g;
    const matches = text.match(promptPattern);
    
    if (matches && matches.length >= 5) {
        return matches.slice(0, 5).map(p => p.trim());
    }
    
    // If still can't parse 5, fill with what we have
    while (prompts.length < 5) {
        prompts.push(prompts[0] || text.trim());
    }
    
    return prompts.slice(0, 5).map(p => p.trim());
}

// Update UI based on selected mode
function updateModeUI() {
    const mode = document.getElementById('generatorMode').value;
    const title = document.getElementById('mainTitle');
    const subtitle = document.getElementById('mainSubtitle');
    const ideaInput = document.getElementById('ideaInput');
    const loadingText = document.getElementById('loadingText');
    
    if (mode === 'professional') {
        title.textContent = 'Professional Generator';
        subtitle.textContent = 'Create high-quality video production prompts';
        ideaInput.placeholder = `Enter your video ideas here...`;
        loadingText.textContent = 'Generating 5 professional video prompts...';
    } else if (mode === 'comedy') {
        title.textContent = 'Comedy Generator';
        subtitle.textContent = 'Create absurdly hilarious, zany video prompts';
        ideaInput.placeholder = `Enter your video ideas here...`;
        loadingText.textContent = 'Generating 5 ABSURDLY HILARIOUS prompts...';
    } else if (mode === 'trailer') {
        title.textContent = '🎬 Movie Trailer Generator';
        subtitle.textContent = 'Create epic fictional movie trailer prompts';
        ideaInput.placeholder = `Enter your movie concept (e.g., genre, plot elements, mood, key scenes, characters)...`;
        loadingText.textContent = 'Generating 5 EPIC MOVIE TRAILER prompts...';
    }
}

// Initialize UI on load
updateModeUI();
updateProviderUI();

// Update provider UI to show/hide appropriate fields
function updateProviderUI() {
    const provider = document.getElementById('llmProvider').value;
    const openaiKeySection = document.getElementById('openaiKeySection');
    const xaiKeySection = document.getElementById('xaiKeySection');
    const anthropicKeySection = document.getElementById('anthropicKeySection');
    const geminiKeySection = document.getElementById('geminiKeySection');
    const ollamaSection = document.getElementById('ollamaSection');
    
    // Hide all sections first
    openaiKeySection.style.display = 'none';
    xaiKeySection.style.display = 'none';
    anthropicKeySection.style.display = 'none';
    geminiKeySection.style.display = 'none';
    ollamaSection.style.display = 'none';
    
    // Show the relevant section
    if (provider === 'openai') {
        openaiKeySection.style.display = 'block';
    } else if (provider === 'xai') {
        xaiKeySection.style.display = 'block';
    } else if (provider === 'anthropic') {
        anthropicKeySection.style.display = 'block';
    } else if (provider === 'gemini') {
        geminiKeySection.style.display = 'block';
    } else if (provider === 'ollama') {
        ollamaSection.style.display = 'block';
    }
}

function fillExample() {
    const mode = document.getElementById('generatorMode').value;
    
    if (mode === 'professional') {
        document.getElementById('ideaInput').value = `- Tech startup commercial
- Showcasing innovation and collaboration
- Modern office with natural lighting
- Diverse team working together
- Aspirational yet authentic tone
- 30 seconds, high production value
- For digital platforms and social media`;
    } else if (mode === 'comedy') {
        document.getElementById('ideaInput').value = `- Nature documentary about pigeons
- Treated like apex predators
- Slow motion, dramatic cinematography
- They're hunting for bread crumbs
- David Attenborough style narration
- Epic orchestral music
- Take it 100% seriously`;
    } else if (mode === 'trailer') {
        document.getElementById('ideaInput').value = MovieTrailerMode.getExampleIdeas();
    }
}

function clearInputs() {
    document.getElementById('ideaInput').value = '';
    // Clear all 5 outputs
    for (let i = 0; i < 5; i++) {
        document.getElementById(`output${i}`).value = '';
    }
    document.getElementById('refinementInput').value = '';
    document.getElementById('refinementSection').style.display = 'none';
    // Reset to first tab
    switchTab(0);
}

async function generatePrompt() {
    const ideas = document.getElementById('ideaInput').value;
    const provider = document.getElementById('llmProvider').value;
    const mode = document.getElementById('generatorMode').value;
    const openaiKey = document.getElementById('openaiKey').value;
    const xaiKey = document.getElementById('xaiKey').value;
    const anthropicKey = document.getElementById('anthropicKey').value;
    const geminiKey = document.getElementById('geminiKey').value;
    const ollamaUrl = document.getElementById('ollamaUrl').value;
    const ollamaModel = document.getElementById('ollamaModel').value;

    if (!ideas.trim()) {
        alert('Please enter some ideas first!');
        return;
    }

    if (provider === 'openai' && !openaiKey.trim()) {
        alert('Please enter your OpenAI API key');
        return;
    }
    
    if (provider === 'xai' && !xaiKey.trim()) {
        alert('Please enter your xAI API key');
        return;
    }
    
    if (provider === 'anthropic' && !anthropicKey.trim()) {
        alert('Please enter your Anthropic API key');
        return;
    }
    
    if (provider === 'gemini' && !geminiKey.trim()) {
        alert('Please enter your Google Gemini API key');
        return;
    }

    if (provider === 'ollama' && !ollamaModel.trim()) {
        alert('Please enter your Ollama model name (e.g., llama3.2:latest, mistral)');
        return;
    }
    
    if (provider === 'ollama' && !ollamaUrl.trim()) {
        alert('Please enter your Ollama server URL (e.g., http://localhost:11434)');
        return;
    }

    const loading = document.getElementById('loading');
    const generateBtn = document.querySelector('.generate-btn');
    
    loading.classList.add('active');
    generateBtn.disabled = true;

    try {
        let result;
        if (provider === 'openai') {
            result = await generateWithOpenAI(ideas, openaiKey, mode);
        } else if (provider === 'xai') {
            result = await generateWithXAI(ideas, xaiKey, mode);
        } else if (provider === 'anthropic') {
            result = await generateWithAnthropic(ideas, anthropicKey, mode);
        } else if (provider === 'gemini') {
            result = await generateWithGemini(ideas, geminiKey, mode);
        } else if (provider === 'ollama') {
            result = await generateWithOllama(ideas, ollamaUrl, ollamaModel, mode);
        }

        // Parse and split the 5 prompts
        const prompts = parseMultiplePrompts(result);
        
        // Display each prompt in its respective textarea
        prompts.forEach((prompt, index) => {
            document.getElementById(`output${index}`).value = prompt;
        });
        
        // Show refinement section after first generation
        document.getElementById('refinementSection').style.display = 'block';
        
        // Switch to first tab
        switchTab(0);
    } catch (error) {
        alert('Error generating prompt: ' + error.message);
        console.error(error);
    } finally {
        loading.classList.remove('active');
        generateBtn.disabled = false;
    }
}

async function refinePrompt() {
    const currentPrompt = document.getElementById(`output${currentTab}`).value;
    const refinementNotes = document.getElementById('refinementInput').value;
    const provider = document.getElementById('llmProvider').value;
    const mode = document.getElementById('generatorMode').value;
    const openaiKey = document.getElementById('openaiKey').value;
    const xaiKey = document.getElementById('xaiKey').value;
    const anthropicKey = document.getElementById('anthropicKey').value;
    const geminiKey = document.getElementById('geminiKey').value;
    const ollamaUrl = document.getElementById('ollamaUrl').value;
    const ollamaModel = document.getElementById('ollamaModel').value;

    if (!currentPrompt.trim()) {
        alert('No prompt to refine! Please generate a prompt first.');
        return;
    }

    if (!refinementNotes.trim()) {
        alert('Please enter your refinement notes!');
        return;
    }

    if (provider === 'openai' && !openaiKey.trim()) {
        alert('Please enter your OpenAI API key');
        return;
    }
    
    if (provider === 'xai' && !xaiKey.trim()) {
        alert('Please enter your xAI API key');
        return;
    }
    
    if (provider === 'anthropic' && !anthropicKey.trim()) {
        alert('Please enter your Anthropic API key');
        return;
    }
    
    if (provider === 'gemini' && !geminiKey.trim()) {
        alert('Please enter your Google Gemini API key');
        return;
    }

    if (provider === 'ollama' && !ollamaModel.trim()) {
        alert('Please enter your Ollama model name');
        return;
    }
    
    if (provider === 'ollama' && !ollamaUrl.trim()) {
        alert('Please enter your Ollama server URL');
        return;
    }

    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loadingText');
    const originalLoadingText = loadingText.textContent;
    loadingText.textContent = 'Refining your prompt...';
    
    loading.classList.add('active');

    try {
        let result;
        if (provider === 'openai') {
            result = await refineWithOpenAI(currentPrompt, refinementNotes, openaiKey, mode);
        } else if (provider === 'xai') {
            result = await refineWithXAI(currentPrompt, refinementNotes, xaiKey, mode);
        } else if (provider === 'anthropic') {
            result = await refineWithAnthropic(currentPrompt, refinementNotes, anthropicKey, mode);
        } else if (provider === 'gemini') {
            result = await refineWithGemini(currentPrompt, refinementNotes, geminiKey, mode);
        } else if (provider === 'ollama') {
            result = await refineWithOllama(currentPrompt, refinementNotes, ollamaUrl, ollamaModel, mode);
        }

        document.getElementById(`output${currentTab}`).value = result;
        // Clear refinement input after successful refinement
        document.getElementById('refinementInput').value = '';
    } catch (error) {
        alert('Error refining prompt: ' + error.message);
        console.error(error);
    } finally {
        loading.classList.remove('active');
        loadingText.textContent = originalLoadingText;
    }
}

function getSystemPrompt(mode) {
    if (mode === 'trailer') {
        return MovieTrailerMode.getSystemPrompt();
    } else if (mode === 'comedy') {
        return `You are a creative comedy writer and director with world-class expertise in surreal humor, and observational comedy. Generate EXACTLY 5 DIFFERENT hilarious, high-energy, ridiculous video production prompts that are professionally detailed but designed to be funny. Each prompt should be aligned with the user's ideas and explore different comedic narrative styles.

IMPORTANT: 
- Generate EXACTLY 5 variations
- Separate each prompt with: ===== PROMPT 2 =====, ===== PROMPT 3 =====, etc.
- Each prompt under 2000 characters
- Keep duration at "15s" for all
- BE VISUALLY DESCRIPTIVE AND CONCISE - your entire response must be under 2000 characters.

Always respond in this exact format for EACH of the 5 prompts:

{

title: ""

quality: ""

duration: "15s"

style: ""

scene: 
	location: ""
	details: ""

camera: 
	lens: ""
	motion: ""
	frame: ""
	lighting: ""
	atmosphere: ""

subject: 
	characters: "","",…
	outfit: ""
    dialogue style: ""
	action sequence: 
	- cut 1, ""
	- cut 2, ""
	- cut 3, ""
    ...

    effects:
	stylization: ""
	special effects: ""
    
audio: 
	ambience: ""
	music: ""

output:
	format: ""
	color: ""

notes: ""

}

Make each one HILARIOUS and HIGH-ENERGY! Create 5 unique comedy video prompts with funny scripts and hilarious scenarios. Use professional video production and comedy terminology applied to completely ridiculous scenarios. Each should have different comedic styles (slapstick, deadpan, satire, absurdist, etc.). Always set duration to "15s" for all 5.`;
    } else {
        return `You are a world-class professional director assistant with expertise in scripts, cinematography, storytelling, and production design. Generate EXACTLY 5 DIFFERENT highly detailed, advanced video production prompts based on the user's ideas. Each should explore different creative approaches or styles while staying true to the core concept.

IMPORTANT:
- Generate EXACTLY 5 variations
- Separate each prompt with: ===== PROMPT 2 =====, ===== PROMPT 3 =====, etc.
- Each prompt under 2000 characters
- Keep duration at "15s" for all
- BE VISUALLY DESCRIPTIVE AND CONCISE - your entire response must be under 2000 characters.

Always respond in this exact format for EACH of the 5 prompts:

{

title: ""

quality: ""

duration: "15s"

style: ""

scene: 
	location: ""
	details: ""

camera: 
	lens: ""
	motion: ""
	frame: ""
	lighting: ""
	atmosphere: ""

subject: 
	characters: "","",…
	outfit: ""
    dialogue style: ""
	action sequence: 
	- cut 1, ""
	- cut 2, ""
	- cut 3, ""
	...

effects:
	stylization: ""
	special effects: ""
	

audio: 
	ambience: ""
	music: ""

output:
	format: "16:9, vertical display optimized"
	color: ""

notes: ""    

}

Provide 5 unique professional approaches with advanced cinematography terminology. Each should explore different styles, tones, or techniques while maintaining the core concept. Adapt each variation to different potential contexts or creative directions. Always set duration to "15s" for all 5.`;
    }
}

async function generateWithOpenAI(ideas, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = (mode === 'comedy' || mode === '') ? 0.95 : 0.9;
    
    let userPrompt;
    if (mode === 'comedy') {
        userPrompt = `Generate 5 DIFFERENT hilarious video prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    } else if (mode === 'trailer') {
        userPrompt = MovieTrailerMode.getUserPrompt(ideas);
    } else {
        userPrompt = `Generate 5 DIFFERENT professional video production prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: temperature
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateWithXAI(ideas, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = (mode === 'comedy' || mode === '') ? 0.95 : 0.9;
    
    let userPrompt;
    if (mode === 'comedy') {
        userPrompt = `Generate 5 DIFFERENT hilarious video prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    } else if (mode === 'trailer') {
        userPrompt = MovieTrailerMode.getUserPrompt(ideas);
    } else {
        userPrompt = `Generate 5 DIFFERENT professional video production prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'grok-4-fast',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: temperature
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`xAI API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateWithAnthropic(ideas, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = (mode === 'comedy' || mode === '') ? 0.95 : 0.9;
    
    let userPrompt;
    if (mode === 'comedy') {
        userPrompt = `Generate 5 DIFFERENT hilarious video prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    } else if (mode === 'trailer') {
        userPrompt = MovieTrailerMode.getUserPrompt(ideas);
    } else {
        userPrompt = `Generate 5 DIFFERENT professional video production prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            system: systemPrompt,
            messages: [
                { 
                    role: 'user', 
                    content: userPrompt
                }
            ],
            temperature: temperature
        })
    });

    if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

async function generateWithOllama(ideas, ollamaUrl, model, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = (mode === 'comedy' || mode === '') ? 0.95 : 0.9;
    
    let userPrompt;
    if (mode === 'comedy') {
        userPrompt = `Generate 5 DIFFERENT hilarious video prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    } else if (mode === 'trailer') {
        userPrompt = MovieTrailerMode.getUserPrompt(ideas);
    } else {
        userPrompt = `Generate 5 DIFFERENT professional video production prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    }

    const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            stream: false,
            options: {
                temperature: temperature,
                num_predict: 2000
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}. Make sure Ollama is running at ${ollamaUrl}`);
    }

    const data = await response.json();
    return data.message.content;
}

async function generateWithGemini(ideas, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = (mode === 'comedy' || mode === '') ? 0.95 : 0.9;
    
    let userPrompt;
    if (mode === 'comedy') {
        userPrompt = `Generate 5 DIFFERENT hilarious video prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    } else if (mode === 'trailer') {
        userPrompt = MovieTrailerMode.getUserPrompt(ideas);
    } else {
        userPrompt = `Generate 5 DIFFERENT professional video production prompts based on these ideas and instructions. Make each unique:\n${ideas}`;
    }

    // Combine system prompt and user prompt for Gemini
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: 8000,
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Refinement functions
async function refineWithOpenAI(currentPrompt, refinementNotes, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = mode === 'comedy' ? 0.95 : 0.9;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Here is the current video prompt:\n\n${currentPrompt}` },
                { role: 'assistant', content: 'I have the current prompt.' },
                { role: 'user', content: `Now refine and adjust THIS EXACT PROMPT based on these specific changes: ${refinementNotes}\n\nIMPORTANT: Do NOT create a new prompt. Take the existing prompt above and modify it according to the refinement notes. Keep the same format, structure, and all fields. Only change what the refinement notes specify. Keep your entire response under 2000 characters and maintain duration at 15s.` }
            ],
            temperature: temperature
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function refineWithXAI(currentPrompt, refinementNotes, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = mode === 'comedy' ? 0.95 : 0.9;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'grok-4-fast',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Here is the current video prompt:\n\n${currentPrompt}` },
                { role: 'assistant', content: 'I have the current prompt.' },
                { role: 'user', content: `Now refine and adjust THIS EXACT PROMPT based on these specific changes: ${refinementNotes}\n\nIMPORTANT: Do NOT create a new prompt. Take the existing prompt above and modify it according to the refinement notes. Keep the same format, structure, and all fields. Only change what the refinement notes specify. Keep your entire response under 2000 characters and maintain duration at 15s.` }
            ],
            temperature: temperature
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`xAI API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function refineWithAnthropic(currentPrompt, refinementNotes, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = mode === 'comedy' ? 0.95 : 0.9;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            system: systemPrompt,
            messages: [
                { 
                    role: 'user', 
                    content: `Here is the current video prompt:\n\n${currentPrompt}`
                },
                {
                    role: 'assistant',
                    content: 'I have the current prompt.'
                },
                {
                    role: 'user',
                    content: `Now refine and adjust THIS EXACT PROMPT based on these specific changes: ${refinementNotes}\n\nIMPORTANT: Do NOT create a new prompt. Take the existing prompt above and modify it according to the refinement notes. Keep the same format, structure, and all fields. Only change what the refinement notes specify. Keep your entire response under 2000 characters and maintain duration at 15s.`
                }
            ],
            temperature: temperature
        })
    });

    if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

async function refineWithOllama(currentPrompt, refinementNotes, ollamaUrl, model, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = mode === 'comedy' ? 0.95 : 0.9;

    const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Here is the current video prompt:\n\n${currentPrompt}` },
                { role: 'assistant', content: 'I have the current prompt.' },
                { role: 'user', content: `Now refine and adjust THIS EXACT PROMPT based on these specific changes: ${refinementNotes}\n\nIMPORTANT: Do NOT create a new prompt. Take the existing prompt above and modify it according to the refinement notes. Keep the same format, structure, and all fields. Only change what the refinement notes specify. Keep your entire response under 2000 characters and maintain duration at 15s.` }
            ],
            stream: false,
            options: {
                temperature: temperature,
                num_predict: 2000
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}. Make sure Ollama is running at ${ollamaUrl}`);
    }

    const data = await response.json();
    return data.message.content;
}

async function refineWithGemini(currentPrompt, refinementNotes, apiKey, mode) {
    const systemPrompt = getSystemPrompt(mode);
    const temperature = mode === 'comedy' ? 0.95 : 0.9;

    // Combine all context for Gemini
    const fullPrompt = `${systemPrompt}\n\nHere is the current video prompt:\n\n${currentPrompt}\n\nNow refine and adjust THIS EXACT PROMPT based on these specific changes: ${refinementNotes}\n\nIMPORTANT: Do NOT create a new prompt. Take the existing prompt above and modify it according to the refinement notes. Keep the same format, structure, and all fields. Only change what the refinement notes specify. Keep your entire response under 2000 characters and maintain duration at 15s.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: 8000,
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function copyToClipboard() {
    const output = document.getElementById('output');
    output.select();
    document.execCommand('copy');
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

