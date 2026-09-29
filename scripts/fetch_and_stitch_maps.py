import os
import urllib.request
import io
from PIL import Image

MAPS = ["bakurani", "ozeti", "zestafona"]
BASE_URL = "https://assets.wardogs-artillery.com/releases/assets-v1/maps/tiles-color"
ZOOM = 3  # 8x8 grid = 64 tiles per map -> 2048 x 2048 px crisp map
GRID_DIM = 2 ** ZOOM
TILE_SIZE = 256
FULL_SIZE = GRID_DIM * TILE_SIZE

HEADERS = {
    "Referer": "https://wardogs-artillery.com/",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}

OUT_BASE = "public/images/maps"

for map_id in MAPS:
    out_dir = os.path.join(OUT_BASE, map_id)
    os.makedirs(out_dir, exist_ok=True)
    print(f"\n--- Processing {map_id} (Zoom {ZOOM}: {GRID_DIM}x{GRID_DIM} tiles -> {FULL_SIZE}x{FULL_SIZE}px) ---")
    
    full_image = Image.new("RGBA", (FULL_SIZE, FULL_SIZE), (15, 23, 42, 255))
    
    downloaded_count = 0
    for x in range(GRID_DIM):
        for y in range(GRID_DIM):
            url = f"{BASE_URL}/{map_id}/zoom_{ZOOM}/{x}_{y}.webp"
            req = urllib.request.Request(url, headers=HEADERS)
            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    tile_bytes = resp.read()
                    tile_img = Image.open(io.BytesIO(tile_bytes)).convert("RGBA")
                    full_image.paste(tile_img, (x * TILE_SIZE, y * TILE_SIZE))
                    downloaded_count += 1
            except Exception as e:
                # If tile 404 or missing, keep transparent/background
                pass
                
    print(f"Stitched {downloaded_count}/{GRID_DIM*GRID_DIM} tiles for {map_id}.")
    
    # Save as webp and png
    webp_path = os.path.join(out_dir, "overview.webp")
    png_path = os.path.join(out_dir, "overview.png")
    
    full_image.save(webp_path, "WEBP", quality=92)
    full_image.save(png_path, "PNG")
    print(f"Saved: {webp_path} ({os.path.getsize(webp_path)} bytes)")
    print(f"Saved: {png_path} ({os.path.getsize(png_path)} bytes)")

print("\nAll maps successfully fetched and stitched!")
