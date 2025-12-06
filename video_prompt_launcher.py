#!/usr/bin/env python3
"""
Video Prompt Generator - Main Launcher
Choose between Professional or Comedy modes
"""

import os
import sys
import subprocess
from pathlib import Path


def clear_screen():
    """Clear the terminal screen."""
    os.system('clear' if os.name != 'nt' else 'cls')


def print_banner():
    """Print a nice banner."""
    print("\n" + "="*70)
    print("🎬  VIDEO PROMPT GENERATOR  🎬".center(70))
    print("="*70)
    print()


def main():
    """Main launcher interface."""
    clear_screen()
    print_banner()
    
    print("Welcome! Choose your prompt generator:\n")
    print("  1. 🎯 PROFESSIONAL MODE")
    print("     → World-class video production prompts")
    print("     → Industry-standard cinematography & direction")
    print("     → Perfect for: commercials, narratives, documentaries, etc.\n")
    
    print("  2. 🎭 COMEDY MODE")
    print("     → Absurdly hilarious video prompts")
    print("     → High-energy, perfect comedic timing")
    print("     → Perfect for: comedy sketches, parodies, ridiculous concepts\n")
    
    print("  3. ❌ Exit\n")
    
    print("="*70)
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    script_dir = Path(__file__).parent
    
    if choice == "1":
        print("\n🎯 Launching PROFESSIONAL MODE...\n")
        professional_script = script_dir / "video_prompt_cli.py"
        
        if not professional_script.exists():
            print("❌ Error: video_prompt_cli.py not found!")
            sys.exit(1)
        
        try:
            subprocess.run([sys.executable, str(professional_script)])
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            sys.exit(0)
    
    elif choice == "2":
        print("\n🎭 Launching COMEDY MODE...\n")
        comedy_script = script_dir / "video_prompt_comedy.py"
        
        if not comedy_script.exists():
            print("❌ Error: video_prompt_comedy.py not found!")
            sys.exit(1)
        
        try:
            subprocess.run([sys.executable, str(comedy_script)])
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            sys.exit(0)
    
    elif choice == "3":
        print("\n👋 Goodbye!")
        sys.exit(0)
    
    else:
        print("\n❌ Invalid choice. Please run again and select 1, 2, or 3.")
        sys.exit(1)


if __name__ == "__main__":
    main()

