import json
import os
import time
import subprocess
try:
    from google.cloud import texttospeech
except ImportError:
    print("Error: google-cloud-texttospeech library not found. Please run: pip install google-cloud-texttospeech")
    exit()

try:
    import imageio_ffmpeg
except ImportError:
    print("Error: imageio_ffmpeg not found. Please run: pip install imageio-ffmpeg")
    exit()

# Setup paths and environment
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "google_credentials.json"
LABELS_FILE = 'data/class_labels.json'
AUDIO_DIR = 'audio'
FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

# Models selected
BN_MODEL = "bn-IN-Standard-A"
EN_MODEL = "en-US-Standard-F" # Standard female voice for English

# Initialize Google Cloud Client
client = texttospeech.TextToSpeechClient()

# Create audio directory if it doesn't exist
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)
    print(f"Created directory: {AUDIO_DIR}/")

print("Loading class labels...")
with open(LABELS_FILE, 'r', encoding='utf-8') as f:
    labels = json.load(f)

total = len(labels)
print(f"Found {total} labels. Starting high-quality audio generation...\n")

def create_padded_audio(text, lang_code, voice_name, output_filename):
    temp_file = f"temp_{voice_name}.mp3"
    
    # 1. Generate Audio via Google Cloud
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code=lang_code, name=voice_name)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    
    with open(temp_file, "wb") as out:
        out.write(response.audio_content)
        
    # 2. Use ffmpeg to add 500ms silence at start and end
    cmd = [
        FFMPEG_EXE,
        '-y', # overwrite
        '-i', temp_file,
        '-af', 'adelay=500|500,apad=pad_dur=0.5',
        '-loglevel', 'error', # Suppress output unless error
        output_filename
    ]
    
    subprocess.run(cmd, check=True)
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
            create_padded_audio(bengali_text, 'bn-IN', BN_MODEL, bn_filename)
            print(f"Saved Bengali (Cloud Padded): {bn_filename}")
            time.sleep(0.2) # API Rate limiting protection
        except Exception as e:
            print(f"Failed to generate Bengali for '{bengali_text}': {e}")
            
    # 2. Generate English Audio
    if not os.path.exists(en_filename):
        try:
            create_padded_audio(english_text, 'en-US', EN_MODEL, en_filename)
            print(f"Saved English (Cloud Padded): {en_filename}")
            time.sleep(0.2)
        except Exception as e:
            print(f"Failed to generate English for '{english_text}': {e}")

print("\nAll high-quality Google Cloud audio files have been generated!")
