"""
ELYF EVSPARE Product Scraper (Improved)

This script scrapes all product data and images from https://store.elyfevspare.com/.
It outputs:
- products.csv
- products.json
- product-images.zip (all images)

Instructions:
1. Install dependencies: pip install requests beautifulsoup4 pandas tqdm
2. Run: python scrape_elyf_evspare.py
"""
import os
import re
import csv
import json
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from zipfile import ZipFile

BASE_URL = "https://store.elyfevspare.com/"
IMG_DIR = "product-images"

os.makedirs(IMG_DIR, exist_ok=True)

def sanitize_filename(name):
    return re.sub(r'[^a-zA-Z0-9_-]', '_', name)

def get_soup(url):
    resp = requests.get(url)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, 'html.parser')

def extract_products():
    soup = get_soup(BASE_URL)
    products = []
    current_category = None
    # Find all elements that could be category headers or product blocks
    for elem in soup.find_all(['h2', 'h3', 'h4', 'p']):
        text = elem.get_text(strip=True)
        # Category header: all caps or known category names
        if text.isupper() and len(text) > 3:
            current_category = text
            continue
        # Product name pattern: starts with [ or contains 'CHARGR' or 'CHARGER'
        if re.match(r'^[\[]?([A-Z0-9]+\])? ?[A-Z0-9 ]+(CHARGER|CHARGR|BODY|MOTOR|KIT|PART|CONNECTOR|BMS|BATTERY|MACHINE|CABLE|SWITCH|LIGHT|HELMET|DISC|GLASS|TYRE|CELL|BOX|RESIN|TUBE|PAPER|PVC)', text, re.I):
            name = text
            # Try to find price in the next sibling or next p tag
            price = ''
            code = ''
            gst = ''
            unit = 'PCS'
            desc = ''
            tags = []
            image_url = ''
            # Look for price in next siblings
            next_elem = elem.find_next_sibling()
            while next_elem and not price:
                next_text = next_elem.get_text(strip=True)
                if re.search(r'₹\d+', next_text):
                    price = next_text
                next_elem = next_elem.find_next_sibling()
            # Extract code from name
            code_match = re.search(r'\(([^)]+)\)', name)
            code = code_match.group(1) if code_match else ''
            # Extract GST if present
            gst_match = re.search(r'\+GST ?(\d+%)', price)
            gst = gst_match.group(1) if gst_match else ''
            # Extract price value
            price_val_match = re.search(r'₹([\d,]+)', price)
            price_val = price_val_match.group(1).replace(',', '') if price_val_match else ''
            # Find image: look for img in previous or next siblings
            img_tag = None
            for sib in [elem.find_previous_sibling(), elem.find_next_sibling()]:
                if sib and sib.find('img'):
                    img_tag = sib.find('img')
                    break
            if not img_tag:
                img_tag = elem.find('img')
            if img_tag and img_tag.has_attr('src'):
                image_url = img_tag['src']
                if not image_url.startswith('http'):
                    image_url = BASE_URL + image_url.lstrip('/')
            else:
                image_url = ''
            img_filename = ''
            if image_url:
                ext = os.path.splitext(image_url)[-1]
                img_filename = sanitize_filename(code or name) + ext
                try:
                    img_data = requests.get(image_url).content
                    with open(os.path.join(IMG_DIR, img_filename), 'wb') as f:
                        f.write(img_data)
                except Exception as e:
                    print(f"Failed to download image for {name}: {e}")
                    img_filename = ''
            products.append({
                'name': name,
                'code': code,
                'category': current_category or '',
                'price': price_val,
                'currency': 'INR',
                'unit': unit,
                'gst': gst,
                'description': desc,
                'image_filename': img_filename,
                'tags': tags
            })
    return products

def save_csv(products):
    if not products:
        print("No products found!")
        return
    keys = products[0].keys()
    with open('products.csv', 'w', newline='', encoding='utf-8') as f:
        dict_writer = csv.DictWriter(f, keys)
        dict_writer.writeheader()
        dict_writer.writerows(products)

def save_json(products):
    with open('products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

def zip_images():
    with ZipFile('product-images.zip', 'w') as zipf:
        for root, _, files in os.walk(IMG_DIR):
            for file in files:
                zipf.write(os.path.join(root, file), arcname=file)

def main():
    print("Extracting products...")
    products = extract_products()
    print(f"Extracted {len(products)} products.")
    print("Saving CSV...")
    save_csv(products)
    print("Saving JSON...")
    save_json(products)
    print("Zipping images...")
    zip_images()
    print("All done! Files: products.csv, products.json, product-images.zip")

if __name__ == "__main__":
    main() 