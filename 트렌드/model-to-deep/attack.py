import requests
import os
import time
import json

def attack(target_url, images_dir):
    image_files = sorted(os.listdir(images_dir))
    results = []

    for image_file in image_files:
        image_path = os.path.join(images_dir, image_file)
        with open(image_path, 'rb') as f:
            files = {'file': (image_file, f, 'image/png')}
            try:
                response = requests.post(target_url, files=files)
                if response.status_code == 200:
                    data = response.json()
                    similarity = data.get('similarity', 0)
                    results.append({'image': image_path, 'similarity': similarity})
                    print(f"Testing {image_file}: {response.status_code} - {response.text}")
                    if "fiesta{" in response.text:
                        print("\n\033[92mFlag found!\033[0m")
                        print(response.text)
                        return results
                else:
                    print(f"Testing {image_file}: {response.status_code} - {response.text}")

            except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
                print(f"An error occurred: {e}")

        time.sleep(0.1)
    return results

if __name__ == "__main__":
    attack("http://54.180.253.212/verify-face", "variations")
