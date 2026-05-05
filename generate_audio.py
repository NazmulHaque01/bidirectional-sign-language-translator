import urllib.request
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
SILENCE_FILE = 'silence_500ms.mp3'
SILENCE_URL = "https://github.com/anars/blank-audio/raw/master/500-milliseconds-of-silence.mp3"

# Download 500ms silence file
if not os.path.exists(SILENCE_FILE):
    print("Downloading 500ms silence reference file...")
    urllib.request.urlretrieve(SILENCE_URL, SILENCE_FILE)

with open(SILENCE_FILE, 'rb') as f:
    silence_data = f.read()

# Create audio directory if it doesn't exist
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)
    print(f"Created directory: {AUDIO_DIR}/")

print("Loading class labels...")
with open(LABELS_FILE, 'r', encoding='utf-8') as f:
    labels = json.load(f)

total = len(labels)
print(f"Found {total} labels. Starting audio generation...\n")

def create_padded_audio(text, lang, output_filename):
    temp_file = f"temp_{lang}.mp3"
    tts = gTTS(text=text, lang=lang)
    tts.save(temp_file)
    
    with open(temp_file, 'rb') as f:
        voice_data = f.read()
        
    # Binary concatenate: silence + voice + silence
    with open(output_filename, 'wb') as f:
        f.write(silence_data)
        f.write(voice_data)
        f.write(silence_data)
        
    os.remove(temp_file)

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
            create_padded_audio(bengali_text, 'bn', bn_filename)
            print(f"Saved Bengali (padded): {bn_filename}")
            time.sleep(0.5)
        except Exception as e:
            print(f"Failed to generate Bengali for '{bengali_text}': {e}")
            
    # 2. Generate English Audio
    if not os.path.exists(en_filename):
        try:
            create_padded_audio(english_text, 'en', en_filename)
            print(f"Saved English (padded): {en_filename}")
            time.sleep(0.5)
        except Exception as e:
            print(f"Failed to generate English for '{english_text}': {e}")

print("\nAll audio files have been successfully generated in the 'audio/' folder!")
