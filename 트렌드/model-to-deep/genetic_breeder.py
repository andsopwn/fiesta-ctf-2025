from PIL import Image, ImageEnhance, ImageOps
import os
import random
import shutil
from attack import attack

NUM_GENERATIONS = 10
POPULATION_SIZE = 20
NUM_PARENTS = 5
MUTATION_CHANCE = 0.3
TARGET_SIMILARITY = 0.8
ELITE_COUNT = 2

def mutate(image):
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(random.uniform(0.9, 1.1))
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(random.uniform(0.9, 1.1))
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(random.uniform(0.9, 1.1))

    image = image.rotate(random.uniform(-5, 5), resample=Image.BICUBIC)

    base_width, base_height = image.size
    scale_factor = random.uniform(0.95, 1.05)
    new_size = (
        max(1, int(base_width * scale_factor)),
        max(1, int(base_height * scale_factor)),
    )
    scaled = image.resize(new_size, resample=Image.BICUBIC)
    image = ImageOps.fit(scaled, (base_width, base_height), method=Image.BICUBIC, centering=(0.5, 0.5))

    return image

def breed(parent1_path, parent2_path, output_path):
    parent1 = Image.open(parent1_path).convert("RGBA")
    parent2 = Image.open(parent2_path).convert("RGBA")

    width, height = parent1.size
    child = Image.new('RGBA', (width, height))

    p1_pixels = parent1.load()
    p2_pixels = parent2.load()
    child_pixels = child.load()

    for x in range(width):
        for y in range(height):
            if random.random() > 0.5:
                child_pixels[x, y] = p1_pixels[x, y]
            else:
                child_pixels[x, y] = p2_pixels[x, y]

    if random.random() < MUTATION_CHANCE:
        child = mutate(child)

    child.save(output_path)

def main():
    if not os.path.exists("variations"):
        os.makedirs("variations")
    base_image = Image.open("source.png")
    for i in range(POPULATION_SIZE):
        variant_image = base_image.copy()
        variant_image = mutate(variant_image)
        variant_image.save(os.path.join("variations", f"variant_{i}.png"))

    for generation in range(NUM_GENERATIONS):
        print(f"\n--- Generation {generation + 1} ---")

        results = attack("http://54.180.253.212/verify-face", "variations")
        if not results:
            print("Attack failed, stopping.")
            break

        results.sort(key=lambda x: x['similarity'], reverse=True)

        best_image = results[0]
        print(f"Best similarity in generation {generation + 1}: {best_image['similarity']}")

        if best_image['similarity'] >= TARGET_SIMILARITY:
            print("\n\033[92mSuccess! Image found with high enough similarity.\033[0m")
            print(f"Image: {best_image['image']}")
            return

        parents = [r['image'] for r in results[:NUM_PARENTS]]

        new_generation_dir = "new_generation"
        if not os.path.exists(new_generation_dir):
            os.makedirs(new_generation_dir)

        next_index = 0

        for elite_path in parents[:ELITE_COUNT]:
            shutil.copy(elite_path, os.path.join(new_generation_dir, f"variant_{next_index}.png"))
            next_index += 1

        while next_index < POPULATION_SIZE:
            parent1 = random.choice(parents)
            parent2 = random.choice(parents)
            child_path = os.path.join(new_generation_dir, f"variant_{next_index}.png")
            breed(parent1, parent2, child_path)
            next_index += 1

        shutil.rmtree("variations")
        os.rename(new_generation_dir, "variations")

if __name__ == "__main__":
    main()
