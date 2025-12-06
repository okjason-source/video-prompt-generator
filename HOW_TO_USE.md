# 🎬 How to Use Your Video Prompt Generator

## Super Simple Start - Two Ways!

### 🌐 Web Interface (Easiest!)

1. **Open** `video-prompt-generator.html` in your browser
2. **Select mode** from the "Generator Mode" dropdown:
   - 🎯 Professional Mode
   - 🎭 Comedy Mode
3. **Choose LLM** provider (or use Mock Mode to demo)
4. **Enter your ideas** and click Generate!

**This is the easiest way** - both modes in one interface, just switch the dropdown!

---

### 💻 Command Line (Alternative)

1. **Run the launcher:**
   ```bash
   python video_prompt_launcher.py
   ```

2. **Choose Your Mode:**
   ```
   1 = Professional Mode (serious production work)
   2 = Comedy Mode (absurd hilarious videos)
   3 = Exit
   ```

3. **Follow the prompts!**

---

## What Each Mode Does

### 🎯 Professional Mode (`video_prompt_cli.py`)
**Use this for:**
- Serious video projects
- Client work and commercials
- Documentaries and narratives
- Music videos and corporate content
- AI video tools (Runway, Pika, Sora)

**Output style:**
- Industry-standard terminology
- Professional cinematography specs
- Detailed lighting and composition
- Practical, production-ready prompts
- Sophisticated color grading guidance

**Example input:**
```
- Tech startup commercial
- Modern office, natural lighting
- Diverse team collaborating
- 15 seconds, aspirational tone
```

---

### 🎭 Comedy Mode (`video_prompt_comedy.py`)
**Use this for:**
- Comedy sketches and parodies
- Absurd content ideas
- Social media comedy
- Satirical videos
- When you need a laugh

**Output style:**
- Hilariously detailed prompts
- Serious treatment of absurd concepts
- Perfect comedic timing notes
- High-energy descriptions
- Deadpan professional terminology

**Example input:**
```
- Nature documentary about pigeons
- Treated like apex predators
- Slow motion bread stealing
- David Attenborough narration
```

---

## Your Output Format (Both Modes)

Both modes generate prompts in this professional structure:

```
{
title: "..."
quality: "..."
duration: "30s"
style: "..."

scene:
    location: "..."
    details: "..."

camera:
    lens: "..."
    motion: "..."
    frame: "..."
    lighting: "..."
    atmosphere: "..."

subject:
    character/n: "...", "...", "..."
    outfit: "..."
    action sequence:
        - cut 1, "..."
        - cut 2, "..."
        - cut 3, "..."

audio:
    ambience: "..."
    music: "..."
    dialogue style: "..."
    dialogue:
        character: "..."

output:
    format: "..."
    color: "..."
}
```

The difference is:
- **Professional Mode** = Serious, practical, industry-standard content
- **Comedy Mode** = Absurd, hilarious, ridiculous content (but with professional detail!)

---

## Pro Tips

### Getting the Best Results

1. **Be specific about what you want**
   - Include genre, tone, and mood
   - Mention duration and platform
   - Describe key moments or beats

2. **For Comedy Mode:**
   - Explain the absurd juxtaposition
   - Specify the serious genre you're parodying
   - Mention if characters should be deadpan

3. **For Professional Mode:**
   - Include target audience
   - Mention brand tone
   - Specify technical requirements

### LLM Provider Recommendations

- **Anthropic (Claude)** - Best for detailed, nuanced prompts (recommended!)
- **OpenAI (GPT-4)** - Great for creative variety
- **Mock Mode** - Try it first to see the format without using API credits

### Saving Your Work

Both modes ask if you want to save the output to a file. Say yes and give it a descriptive name:
- `tech_commercial_v1.txt`
- `pigeon_documentary_comedy.txt`
- etc.

---

## Quick Reference

| What You Want | Run This |
|--------------|----------|
| **Easiest - both modes** | Open `video-prompt-generator.html` ⭐ |
| CLI menu to choose | `python video_prompt_launcher.py` |
| Professional CLI only | `python video_prompt_cli.py` |
| Comedy CLI only | `python video_prompt_comedy.py` |

---

## Need Ideas?

Check these files:
- `example_ideas.txt` - Examples for both modes
- `COMEDY_IDEAS_EXAMPLES.md` - 10+ comedy prompt ideas with tips

---

## Troubleshooting

**"anthropic package not installed"**
```bash
pip install anthropic
```

**"openai package not installed"**
```bash
pip install openai
```

**Need API key?**
- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/api-keys

**Want to test first?**
- Choose "Mock Mode" to see output without API costs

---

## That's It!

You now have a super user-friendly system to generate:
- ✅ Professional video production prompts
- ✅ Absurdly hilarious comedy prompts
- ✅ Both in the same consistent format
- ✅ Easy to switch between modes

**Start with:** `python video_prompt_launcher.py`

Have fun! 🎬🎭

