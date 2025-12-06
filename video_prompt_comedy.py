#!/usr/bin/env python3
"""
Absurd Comedy Video Prompt Generator - CLI Version
Generate hilarious, high-energy, absurdly creative video prompts using AI-powered LLMs
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


SYSTEM_PROMPT = """You are a creative comedy writer and director with world-class expertise in physical comedy, surreal humor, and perfect comedic timing. Generate hilarious, high-energy, ridiculous video production prompts that are professionally detailed but absolutely absurd in concept. Be visually descriptive and CONCISE - your entire response must be under 2000 characters. IMPORTANT: Keep your entire response under 2000 characters. Always respond in this exact format:

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

audio: 
	ambience: ""
	music: ""
	dialogue style: ""
	dialogue: 
		character: ""
        character: ""
        ...

output:
	format: ""
	color: ""

notes: ""

}

Make it ABSURD, HILARIOUS, and HIGH-ENERGY! Create the best comedy video prompt possible with funny scripts and hilarious scenarios. Use professional video production terminology and apply it to completely ridiculous scenarios. Be visually descriptive and CONCISE - your entire response must be under 2000 characters. USE perfect comedic timing, visual gags, or deadpan delivery. Always set duration to "15s"."""


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
                "content": f"Generate an absurdly hilarious video prompt based on these ideas:\n{ideas}"
            }
        ],
        temperature=0.95
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
            {"role": "user", "content": f"Generate a hilarious video prompt based on these ideas:\n{ideas}"}
        ],
        temperature=0.95
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
            {"role": "user", "content": f"Generate a hilarious video prompt based on these ideas:\n{ideas}"}
        ],
        temperature=0.95
    )
    
    return response.choices[0].message.content


def generate_mock_prompt(ideas: str) -> str:
    """Generate a mock prompt for demonstration."""
    return """{

title: "The Sandwich Incident"

quality: "4K Noir"

duration: "15s"

style: "Film noir meets absurdist comedy"

scene: 
	location: "Rain-soaked alley with giant sandwich crime scene"
	details: "Massive club sandwich on ground, crime tape, flickering street lamp, detective's fedora blowing dramatically"

camera: 
	lens: "50mm prime, dutch angles"
	motion: "Slow tracking, crash zoom on evidence"
	frame: "Low angles making sandwich menacing, tight close-ups on detective's face"
	lighting: "High contrast noir, single harsh key, deep shadows, fog"
	atmosphere: "Inappropriately tense for a sandwich"

subject: 
	character/n: "Detective Marlowe (grizzled)", "Beat Cop Jenkins (confused)", "Dame in Red"
	outfit: "Noir detective: trench coat, fedora, loosened tie. Cop: uniform with tiny evidence bag. Dame: red dress, breadcrumbs"
	action sequence: 
		- cut 1, "Detective arrives slow-mo, kneels, examines giant tomato with magnifying glass, dead serious"
		- cut 2, "Pulls notepad, sketches sandwich, narrates 'The mayo tells a story'"
		- cut 3, "Points at bite mark: 'Someone bit off more than they could chew.' Thunder crashes"

audio: 
	ambience: "Dramatic rain, sirens, condiments dripping with reverb"
	music: "Orchestral noir with wailing sax, string stabs for pickle discovery"
	dialogue style: "Hard-boiled deadpan, treating it like Chinatown"
	dialogue: 
		Marlowe: "A 12-layer homicide. Extra mayo."
		Jenkins: "Time of death was... lunch."

output:
	format: "16:9 with film grain, cigarette burns"
	color: "B&W except red tomato, yellow mustard (Sin City style)"

}"""


def main():
    """Main CLI interface."""
    print("🎭 Absurd Comedy Video Prompt Generator - CLI\n")
    print("(Where professional filmmaking meets ridiculous concepts!)\n")
    
    # Get provider choice
    print("Choose your LLM provider:")
    print("1. Anthropic (Claude) - Recommended for absurdity")
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
    print("Enter your ABSURD video ideas (press ENTER for new lines)")
    print("When finished, press Ctrl+D (Mac/Linux) or Ctrl+Z then Enter (Windows)")
    print("="*60)
    print("Example:")
    print("- A nature documentary about pigeons")
    print("- But they're treated like apex predators")
    print("- Slow motion, dramatic narration")
    print("- Pigeon doing mundane things = epic moments")
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
    print("\n✨ Generating your ABSURDLY HILARIOUS video prompt...\n")
    
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
        print("GENERATED COMEDY VIDEO PROMPT")
        print("="*60)
        print(result)
        print("="*60)
        
        # Ask to save
        save = input("\nSave to file? (y/n): ").strip().lower()
        if save == 'y':
            filename = input("Enter filename (default: comedy_prompt.txt): ").strip()
            if not filename:
                filename = "comedy_prompt.txt"
            
            with open(filename, 'w') as f:
                f.write(result)
            
            print(f"✅ Saved to {filename}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

