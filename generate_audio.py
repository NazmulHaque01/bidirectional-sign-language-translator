import json
import os
import time
try:
    from gtts import gTTS
except ImportError:
    print("Error: gTTS library not found. Please run: pip install gtts")
    exit()

# Setup paths
LABELS_FILE = 'data/class_labels.json'
AUDIO_DIR = 'audio'

# Create audio directory if it doesn't exist
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)
    print(f"Created directory: {AUDIO_DIR}/")

print("Loading class labels...")
with open(LABELS_FILE, 'r', encoding='utf-8') as f:
    labels = json.load(f)

total = len(labels)
print(f"Found {total} labels. Starting audio generation...\n")

for key, value in labels.items():
    # Value format is "Bengali_English", e.g., "অপেক্ষা করো_Wait"
    parts = value.split('_')
    if len(parts) != 2:
        print(f"Skipping invalid format: {value}")
        continue
        
    bengali_text = parts[0]
    english_text = parts[1]
    
    bn_filename = os.path.join(AUDIO_DIR, f"{english_text}_bn.mp3")
    en_filename = os.path.join(AUDIO_DIR, f"{english_text}_en.mp3")
    
    # 1. Generate Bengali Audio
    if not os.path.exists(bn_filename):
        try:
            # Adding Bengali 'Danda' (।) to force silence before and after
            padded_bn = f"। । । {bengali_text} । । ।"
            tts_bn = gTTS(text=padded_bn, lang='bn')
            tts_bn.save(bn_filename)
            print(f"Saved Bengali (padded): {bn_filename}")
            time.sleep(0.5) # Be polite to the API
        except Exception as e:
            print(f"Failed to generate Bengali for '{bengali_text}': {e}")
            
    # 2. Generate English Audio
    if not os.path.exists(en_filename):
        try:
            # Adding dots (.) to force silence before and after
            padded_en = f". . . {english_text} . . ."
            tts_en = gTTS(text=padded_en, lang='en')
            tts_en.save(en_filename)
            print(f"Saved English (padded): {en_filename}")
            time.sleep(0.5)
        except Exception as e:
            print(f"Failed to generate English for '{english_text}': {e}")

print("\nAll audio files have been successfully generated in the 'audio/' folder!")
