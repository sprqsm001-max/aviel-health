import re
import base64
import os

html_path = 'C:/Users/user/.gemini/antigravity-ide/scratch/aviel-health/index.html'
assets_dir = 'C:/Users/user/.gemini/antigravity-ide/scratch/aviel-health/assets'

if not os.path.exists(assets_dir):
    os.makedirs(assets_dir)

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the base64 string
match = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', content)
if match:
    b64_data = match.group(1)
    # Write the image
    img_path = os.path.join(assets_dir, 'logo.png')
    with open(img_path, 'wb') as img_f:
        img_f.write(base64.b64decode(b64_data))
    print(f"Extracted logo to {img_path}")
    
    # Replace the base64 in HTML with 'assets/logo.png'
    # There are two occurrences (header and footer)
    new_content = re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+', 'assets/logo.png', content)
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced base64 occurrences with 'assets/logo.png'")
else:
    print("Base64 string not found.")
