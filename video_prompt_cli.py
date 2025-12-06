#!/usr/bin/env python3
"""
Professional Video Production Prompt Generator - CLI Version
Generate world-class video production prompts for any genre using AI-powered LLMs
"""

import os
import json
import sys
import getpass
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


SYSTEM_PROMPT = """You are a world-class professional director assistant with expertise in scripts, cinematography, storytelling, and production design. Generate EXACTLY 5 DIFFERENT highly detailed, advanced video production prompts based on the user's ideas. Each should explore different creative approaches or styles while staying true to the core concept.

IMPORTANT:
- Generate EXACTLY 5 variations
- Separate each prompt with: ===== PROMPT 2 =====, ===== PROMPT 3 =====, etc.
- Each prompt under 2000 characters
- Keep duration at "15s" for all

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
	dialogue style: ""
	dialogue: 
		character: ""

output:
	format: "16:9, vertical display optimized"
	color: ""

notes: ""    

}

Provide professional, advanced cinematography terminology and techniques to describe lighting, composition, color theory, sound design, and pacing. Be visually descriptive and CONCISE - your entire response must be under 2000 characters. Adapt your style to match the ideas and intent of the video. Always set duration to "15s"."""


def generate_with_anthropic(ideas: str, api_key: str) -> str:
    """Generate prompt using Anthropic's Claude."""
    if not ANTHROPIC_AVAILABLE:
        raise ImportError("anthropic package not installed. Run: pip install anthropic")
    
    client = anthropic.Anthropic(api_key=api_key)
    
    message = client.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"Generate a professional video production prompt based on these ideas:\n{ideas}"
            }
        ],
        temperature=0.9
    )
    
    return message.content[0].text


def generate_with_openai(ideas: str, api_key: str) -> str:
    """Generate prompt using OpenAI's GPT-4."""
    if not OPENAI_AVAILABLE:
        raise ImportError("openai package not installed. Run: pip install openai")
    
    client = openai.OpenAI(api_key=api_key)
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Generate a professional video production prompt based on these ideas:\n{ideas}"}
        ],
        temperature=0.9
    )
    
    return response.choices[0].message.content


def generate_with_xai(ideas: str, api_key: str) -> str:
    """Generate prompt using xAI's Grok-4-Fast."""
    if not OPENAI_AVAILABLE:
        raise ImportError("openai package not installed. Run: pip install openai")
    
    # xAI uses OpenAI-compatible API
    client = openai.OpenAI(
        api_key=api_key,
        base_url="https://api.x.ai/v1"
    )
    
    response = client.chat.completions.create(
        model="grok-4-fast",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Generate a professional video production prompt based on these ideas:\n{ideas}"}
        ],
        temperature=0.9
    )
    
    return response.choices[0].message.content


def generate_mock_prompt(ideas: str) -> str:
    """Generate a mock prompt for demonstration."""
    return """{

title: "Innovation Rising"

quality: "4K ProRes"

duration: "15s"

style: "Modern cinematic commercial"

scene: 
	location: "Contemporary office with floor-to-ceiling windows, golden hour"
	details: "Minimalist design, natural light, reflective surfaces, urban skyline backdrop"

camera: 
	lens: "35mm prime (T1.5)"
	motion: "Smooth gimbal push-in, intentional pauses"
	frame: "Rule of thirds, leading lines, strategic focus pulls"
	lighting: "Natural golden hour key, practical fills, soft bounce, HDR capture"
	atmosphere: "Aspirational yet authentic, warm and inviting"

subject: 
	character/n: "Lead innovator (30s, confident)", "Team members (background)", "Product close-ups"
	outfit: "Contemporary professional, neutral tones with color accent"
	action sequence: 
		- cut 1, "Wide establishing, subject enters naturally, camera follows"
		- cut 2, "Medium close-up, moment of realization, light on face"
		- cut 3, "Pull back to reveal team collaboration, subtle defocus"

audio: 
	ambience: "Subtle office sounds, distant city hum"
	music: "Minimalist piano and electronics, 85 BPM, builds emotionally"
	dialogue style: "Natural voice-over, intimate"
	dialogue: 
		Lead: "Innovation is every decision we make."

output:
	format: "16:9, 4K delivery"
	color: "Warm grade, lifted blacks, teal/orange, natural skin tones"

}"""


def main():
    """Main CLI interface."""
    print("🎬 Professional Video Production Prompt Generator - CLI\n")
    
    # Get provider choice
    print("Choose your LLM provider:")
    print("1. Anthropic (Claude) - Recommended")
    print("2. OpenAI (GPT-4)")
    print("3. xAI (Grok-4-Fast)")
    print("4. Ollama (Local, no API key needed)")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    provider = None
    if choice == "1":
        provider = "anthropic"
        if not ANTHROPIC_AVAILABLE:
            print("\n❌ Error: anthropic package not installed.")
            print("Install it with: pip install anthropic")
            sys.exit(1)
    elif choice == "2":
        provider = "openai"
        if not OPENAI_AVAILABLE:
            print("\n❌ Error: openai package not installed.")
            print("Install it with: pip install openai")
            sys.exit(1)
    elif choice == "3":
        provider = "xai"
        if not OPENAI_AVAILABLE:
            print("\n❌ Error: openai package not installed.")
            print("Install it with: pip install openai")
            sys.exit(1)
    elif choice == "4":
        provider = "mock"
    else:
        print("Invalid choice. Exiting.")
        sys.exit(1)
    
    # Get API key if needed
    api_key = None
    if provider != "mock":
        if provider == "anthropic":
            env_var = "ANTHROPIC_API_KEY"
        elif provider == "openai":
            env_var = "OPENAI_API_KEY"
        elif provider == "xai":
            env_var = "XAI_API_KEY"
        
        api_key = os.environ.get(env_var)
        
        if not api_key:
            api_key = getpass.getpass(f"\nEnter your {provider.upper()} API key (hidden): ").strip()
            if not api_key:
                print("API key required. Exiting.")
                sys.exit(1)
    
    # Get ideas
    print("\n" + "="*60)
    print("Enter your video ideas (press ENTER for new lines)")
    print("When finished, press Ctrl+D (Mac/Linux) or Ctrl+Z then Enter (Windows)")
    print("="*60)
    print("Example:")
    print("- Tech company commercial")
    print("- Showcasing innovation and collaboration")
    print("- Modern, aspirational, authentic")
    print("- 30 seconds, high-end production")
    print("="*60 + "\n")
    
    try:
        ideas = sys.stdin.read().strip()
    except KeyboardInterrupt:
        print("\nCancelled.")
        sys.exit(0)
    
    if not ideas:
        print("No ideas provided. Exiting.")
        sys.exit(1)
    
    # Generate prompt
    print("\n✨ Generating your professional video prompt...\n")
    
    try:
        if provider == "anthropic":
            result = generate_with_anthropic(ideas, api_key)
        elif provider == "openai":
            result = generate_with_openai(ideas, api_key)
        elif provider == "xai":
            result = generate_with_xai(ideas, api_key)
        else:  # mock
            result = generate_mock_prompt(ideas)
        
        print("="*60)
        print("GENERATED VIDEO PROMPT")
        print("="*60)
        print(result)
        print("="*60)
        
        # Ask to save
        save = input("\nSave to file? (y/n): ").strip().lower()
        if save == 'y':
            filename = input("Enter filename (default: video_prompt.txt): ").strip()
            if not filename:
                filename = "video_prompt.txt"
            
            with open(filename, 'w') as f:
                f.write(result)
            
            print(f"✅ Saved to {filename}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

