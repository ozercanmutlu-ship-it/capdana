import os
import random
from PIL import Image, ImageChops, ImageEnhance

# Define paths
BRAIN_DIR = r"C:\Users\Ali\.gemini\antigravity\brain\9e8f9fed-2be0-40a7-b84f-10cb5b2765d9"
OUTPUT_DIR = r"public\images\products\bandanas"

# Base patterns
PATTERNS = [
    "bandana_pattern_camo_1772229124182.png",
    "bandana_pattern_cyber_1772229164670.png",
    "bandana_pattern_graffiti_1772229152251.png",
    "bandana_pattern_paisley_1772229137864.png",
    "bandana_pattern_topo_1772229176564.png"
]

# Premium Streetwear Color Palette (HSL based)
COLORS = [
    (181, 54, 255),  # Neon Purple
    (57, 255, 20),   # Neon Green
    (255, 77, 77),   # Street Red
    (245, 245, 245), # Off White
    (40, 40, 40),    # Charcoal
    (0, 150, 255),   # Cyber Blue
    (255, 200, 0),   # Caution Yellow
    (255, 50, 150),  # Electric Pink
]

def colorize(image, color):
    """Simple colorizing function."""
    image = image.convert("L")  # Grayscale
    image = image.convert("RGB")
    
    # Create color layer
    color_layer = Image.new("RGB", image.size, color)
    # Multiply or blend? Let's use multiply for deep blacks and vibrant colors
    return ImageChops.multiply(image, color_layer)

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    count = 0
    total_needed = 33
    
    # Generate variations
    for i in range(total_needed):
        pattern_file = PATTERNS[count % len(PATTERNS)]
        color = random.choice(COLORS)
        
        input_path = os.path.join(BRAIN_DIR, pattern_file)
        img = Image.open(input_path)
        
        # Colorize
        varied_img = colorize(img, color)
        
        # Save
        filename = f"bandana-{i+1}.png"
        output_path = os.path.join(OUTPUT_DIR, filename)
        varied_img.save(output_path)
        print(f"Generated {filename}")
        count += 1

if __name__ == "__main__":
    main()
