import json
import re

# 1. Read class_labels.json (60 Camera Signs)
with open('data/class_labels.json', 'r', encoding='utf-8') as f:
    class_labels_raw = json.load(f)

# The values in class_labels.json are like "অপেক্ষা করো_Wait"
camera_signs = []
for idx, label in class_labels_raw.items():
    # The image path will be avatars/label.webp
    bengali_word = label.split('_')[0]
    english_word = label.split('_')[1] if '_' in label else ''
    camera_signs.append({
        'label': label,
        'bengali': bengali_word,
        'english': english_word,
        'image': f'avatars/{label}.webp'
    })

# Sort alphabetically by bengali word
camera_signs.sort(key=lambda x: x['bengali'])


# 2. Read speech-to-sign.js for the 50 Avatar Signs
with open('js/speech-to-sign.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

wim_match = re.search(r'const wordImageMap = \{(.*?)\};', js_content, re.DOTALL)
avatar_words = []
if wim_match:
    lines = wim_match.group(1).split('\n')
    for line in lines:
        match = re.search(r'"(.*?)"\s*:\s*"(.*?)"', line)
        if match:
            # Avoid duplicates like "তুমি" and "আপনি" pointing to the same image if needed,
            # but listing all keys is fine.
            avatar_words.append(match.group(1))

avatar_words = sorted(list(set(avatar_words)))


# 3. Generate HTML
html_template = """<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supported Signs and Words</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; margin: 0; padding: 20px; text-align: center; color: #1a202c; }}
        .container {{ max-width: 1200px; margin: auto; }}
        .back-btn {{ display: inline-block; margin-bottom: 20px; padding: 10px 20px; background: #4a90e2; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }}
        
        .section-title {{ font-size: 1.8em; margin: 40px 0 20px; border-bottom: 2px solid #cbd5e0; padding-bottom: 10px; }}
        
        /* Section 1: Images Grid */
        .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; margin-top: 20px; }}
        .card {{ background: white; border-radius: 16px; padding: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }}
        .card img {{ width: 100%; max-width: 400px; height: auto; border-radius: 12px; display: block; margin: auto; }}
        .card p {{ margin: 15px 0 0; font-size: 1.3em; font-weight: 700; color: #2d3748; }}
        .card .eng {{ font-size: 0.9em; color: #718096; font-weight: normal; margin-top: 5px; }}

        /* Section 2: Words List Grid */
        .words-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 20px; }}
        .word-card {{ background: white; border-radius: 8px; padding: 15px; font-size: 1.2em; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back-btn">← Back to App</a>
        
        <h2 class="section-title">Section 1: Images of Signs (Sign to Speech - Camera)</h2>
        <p>Total: {camera_count} signs supported by the camera detection.</p>
        <div class="grid">
{camera_cards}
        </div>

        <h2 class="section-title">Section 2: List of Words (Speech to Sign - Avatar)</h2>
        <p>Total: {avatar_count} core words supported by the 3D avatars (plus hundreds of synonyms).</p>
        <div class="words-grid">
{avatar_cards}
        </div>
    </div>
</body>
</html>"""

# Generate Camera Cards
camera_cards_html = ""
for sign in camera_signs:
    camera_cards_html += f"""
            <div class="card">
                <img src="{sign['image']}" alt="{sign['bengali']}" width="400" height="400" loading="lazy">
                <p>{sign['bengali']}</p>
                <div class="eng">{sign['english']}</div>
            </div>"""

# Generate Avatar Cards
avatar_cards_html = ""
for word in avatar_words:
    avatar_cards_html += f"""
            <div class="word-card">{word}</div>"""

# Finalize HTML
final_html = html_template.format(
    camera_count=len(camera_signs),
    camera_cards=camera_cards_html,
    avatar_count=len(avatar_words),
    avatar_cards=avatar_cards_html
)

with open('dictionary.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Created dictionary.html successfully!")
