
from PIL import Image, ImageEnhance, ImageOps
import os
import random

def generate_variations(source_image_path, output_dir, num_variations=100):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    base_image = Image.open(source_image_path)

    for i in range(num_variations):
        variant_image = base_image.copy()

        # Add random brightness and contrast changes
        enhancer = ImageEnhance.Brightness(variant_image)
        variant_image = enhancer.enhance(random.uniform(0.7, 1.3))
        enhancer = ImageEnhance.Contrast(variant_image)
        variant_image = enhancer.enhance(random.uniform(0.7, 1.3))
        enhancer = ImageEnhance.Color(variant_image)
        variant_image = enhancer.enhance(random.uniform(0.7, 1.3))

        # Add slight rotation
        variant_image = variant_image.rotate(random.uniform(-10, 10))

        # Add slight scaling
        scale_factor = random.uniform(0.9, 1.1)
        new_size = (int(variant_image.width * scale_factor), int(variant_image.height * scale_factor))
        variant_image = variant_image.resize(new_size)

        # Crop back to original size
        left = (variant_image.width - base_image.width) / 2
        top = (variant_image.height - base_image.height) / 2
        right = (variant_image.width + base_image.width) / 2
        bottom = (variant_image.height + base_image.height) / 2
        variant_image = variant_image.crop((left, top, right, bottom))

        variant_image.save(os.path.join(output_dir, f"variant_{i}.png"))

if __name__ == "__main__":
    generate_variations("source.png", "variations")
