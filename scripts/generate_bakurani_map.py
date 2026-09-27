#!/usr/bin/env python3
"""Generate a high-precision, military-grade tactical topographic 2D vector map for Bakurani (WARDOGS).

Dimensions: 16 km x 16 km (256 sq km)
Features:
- Full 16x16 1km grid (Columns A-P, Rows 01-16) with 100m sub-grid ticks
- Multi-tier elevation contours (Northern peaks, Central hill ridges, Southern rolling fields)
- River system with bridges and water bodies
- Road network (Main M1 Highway, secondary routes, dirt tracks, rail line)
- Settlement areas (Bakurani Town, Industrial District, Farmlands, Logging Camps)
- 2x2km Central Control Zone with tactical corner brackets
- Verified 5 Tower Terminals (Tower 1 to Tower 5)
- Military map margin, Scale bar, Compass Rose, Legend, and Map Metadata Block
"""
import os
import math

SIZE = 4096  # 4096 x 4096 px for crisp 4K rendering
GRID_COUNT = 16
CELL_SIZE = SIZE / GRID_COUNT  # 256 px per 1 km
METERS_PER_PX = 16000.0 / SIZE  # 3.90625 m per px

OUT_DIR = "/Users/black/Documents/Wardogs/public/images/maps/bakurani"
os.makedirs(OUT_DIR, exist_ok=True)
SVG_PATH = os.path.join(OUT_DIR, "overview.svg")

def generate_svg():
    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}" width="{SIZE}" height="{SIZE}" style="background:#090d14; font-family:\'Courier New\', monospace, sans-serif;">')
    
    # Defs: filters, gradients, markers, patterns
    svg.append('<defs>')
    # Subtle glow
    svg.append('<filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    # Radar ring glow
    svg.append('<filter id="radar-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    # Grid pattern for 100m squares
    svg.append(f'<pattern id="subgrid" width="{CELL_SIZE/10}" height="{CELL_SIZE/10}" patternUnits="userSpaceOnUse"><path d="M {CELL_SIZE/10} 0 L 0 0 0 {CELL_SIZE/10}" fill="none" stroke="#162232" stroke-width="0.75" opacity="0.6"/></pattern>')
    # Farm pattern
    svg.append('<pattern id="farmland" width="40" height="40" patternTransform="rotate(25 0 0)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="40" stroke="#1c2c26" stroke-width="1.5" /><line x1="10" y1="0" x2="10" y2="40" stroke="#1c2c26" stroke-width="1.5" /><line x1="20" y1="0" x2="20" y2="40" stroke="#1c2c26" stroke-width="1.5" /><line x1="30" y1="0" x2="30" y2="40" stroke="#1c2c26" stroke-width="1.5" /></pattern>')
    svg.append('</defs>')

    # 1. Base terrain background
    svg.append(f'<rect width="{SIZE}" height="{SIZE}" fill="#0a0f18"/>')
    # 100m Subgrid
    svg.append(f'<rect width="{SIZE}" height="{SIZE}" fill="url(#subgrid)"/>')

    # 2. Elevation Topography / Contour Shading (Northern Peaks & Valleys)
    # North Alpine Ridge (High Mountains > 1000m)
    svg.append('<g id="topography" opacity="0.85">')
    # Low contour (Forest / Valley base)
    svg.append('<path d="M 0,0 L 4096,0 L 4096,1800 Q 3400,1650 2800,1900 T 1600,1750 T 800,2100 T 0,1950 Z" fill="#0d1824" stroke="#172a3e" stroke-width="1.5"/>')
    svg.append('<path d="M 0,0 L 4096,0 L 4096,1400 Q 3200,1200 2400,1350 T 1200,1200 T 0,1450 Z" fill="#101f30" stroke="#1c334b" stroke-width="1.5"/>')
    svg.append('<path d="M 0,0 L 4096,0 L 4096,950 Q 3100,800 2200,950 T 900,850 T 0,1050 Z" fill="#14283e" stroke="#223f5e" stroke-width="2"/>')
    svg.append('<path d="M 200,0 L 3900,0 L 3700,600 Q 2800,450 2000,550 T 400,650 Z" fill="#19334e" stroke="#2a4e74" stroke-width="2"/>')
    # Snow-capped peaks (> 1200m)
    svg.append('<path d="M 600,0 L 1500,0 L 1300,320 Q 950,220 700,340 Z" fill="#244466" stroke="#4a76a8" stroke-width="2" opacity="0.9"/>')
    svg.append('<path d="M 2100,0 L 3200,0 L 3000,360 Q 2600,240 2250,380 Z" fill="#244466" stroke="#4a76a8" stroke-width="2" opacity="0.9"/>')

    # Southern Farmlands & Terraces
    svg.append('<path d="M 0,2700 Q 900,2500 1900,2650 T 3200,2550 T 4096,2750 L 4096,4096 L 0,4096 Z" fill="#0c1815" stroke="#172b25" stroke-width="1.5"/>')
    svg.append('<path d="M 400,2900 Q 1200,2800 2200,2920 T 3800,2850 L 4096,3100 L 4096,4096 L 0,4096 L 0,3100 Z" fill="url(#farmland)" opacity="0.35"/>')
    svg.append('<path d="M 0,3400 Q 1100,3300 2300,3450 T 4096,3350 L 4096,4096 L 0,4096 Z" fill="#0d1f1a" stroke="#1c362d" stroke-width="1.5"/>')

    # Mountain Spot Elevations
    svg.append('<text x="1050" y="220" fill="#6ba6e2" font-size="20" font-weight="bold" letter-spacing="2">▲ MT. KAVKAZI 1,420M</text>')
    svg.append('<text x="2600" y="240" fill="#6ba6e2" font-size="20" font-weight="bold" letter-spacing="2">▲ NORTH RIDGE 1,285M</text>')
    svg.append('<text x="450" y="850" fill="#527fa8" font-size="18">▲ EAGLE CRAG 960M</text>')
    svg.append('<text x="3450" y="920" fill="#527fa8" font-size="18">▲ WATCHTOWER HILL 890M</text>')
    svg.append('<text x="800" y="3750" fill="#3f7260" font-size="18">▲ SOUTH MEADOW 310M</text>')
    svg.append('<text x="3100" y="3650" fill="#3f7260" font-size="18">▲ VALLEY PLATEAU 345M</text>')
    svg.append('</g>')

    # 3. Water Network: River Aragvi & Tributaries
    svg.append('<g id="hydrology">')
    # Main river body flowing NW to SE
    river_path = "M 450,1100 Q 800,1400 1200,1650 T 1750,1850 T 2150,1950 T 2650,2250 T 3250,2800 T 3750,3500 T 4096,3950"
    # River outer bank
    svg.append(f'<path d="{river_path}" fill="none" stroke="#0e2a47" stroke-width="85" stroke-linecap="round" stroke-linejoin="round"/>')
    # River core
    svg.append(f'<path d="{river_path}" fill="none" stroke="#1d4ed8" stroke-width="45" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>')
    svg.append(f'<path d="{river_path}" fill="none" stroke="#60a5fa" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>')
    # North lake / reservoir
    svg.append('<ellipse cx="500" cy="1120" rx="180" ry="110" fill="#133355" stroke="#1d4ed8" stroke-width="4"/>')
    svg.append('<text x="360" y="1125" fill="#93c5fd" font-size="20" font-weight="bold" letter-spacing="3">RESERVOIR</text>')
    svg.append('</g>')

    # 4. Built-Up Sectors & Town Footprints
    svg.append('<g id="settlements">')
    # Central Town (Bakurani Central, around Col H-I, Row 7-8: ~1800-2200px, 1600-2000px)
    town_cx, town_cy = 2050, 1850
    svg.append(f'<rect x="{town_cx - 260}" y="{town_cy - 220}" width="520" height="440" fill="#1e293b" stroke="#334155" stroke-width="3" rx="10"/>')
    svg.append(f'<text x="{town_cx - 160}" y="{town_cy - 170}" fill="#e2e8f0" font-size="28" font-weight="bold" letter-spacing="4">BAKURANI TOWN</text>')
    # Town blocks
    for bx in range(-200, 220, 90):
        for by in range(-120, 180, 70):
            svg.append(f'<rect x="{town_cx + bx}" y="{town_cy + by}" width="65" height="45" fill="#334155" stroke="#475569" stroke-width="1.5"/>')
    
    # Industrial Foundry (East of Town)
    ind_x, ind_y = 2650, 1750
    svg.append(f'<rect x="{ind_x - 180}" y="{ind_y - 140}" width="360" height="280" fill="#262338" stroke="#4f46e5" stroke-width="2" rx="8"/>')
    svg.append(f'<text x="{ind_x - 140}" y="{ind_y - 95}" fill="#c7d2fe" font-size="22" font-weight="bold" letter-spacing="3">FOUNDRY / DEPOT</text>')
    svg.append(f'<rect x="{ind_x - 130}" y="{ind_y - 60}" width="110" height="160" fill="#3730a3" opacity="0.6"/>')
    svg.append(f'<rect x="{ind_x + 10}" y="{ind_y - 60}" width="130" height="90" fill="#3730a3" opacity="0.6"/>')

    # Southern Village (Sunflower Farm Settlement)
    svg.append('<rect x="1400" y="3150" width="300" height="200" fill="#182822" stroke="#2d5244" stroke-width="2" rx="6"/>')
    svg.append('<text x="1430" y="3200" fill="#86efac" font-size="20" font-weight="bold" letter-spacing="2">SUNFLOWER FARMS</text>')

    # Logging Camp (West Woods)
    svg.append('<rect x="650" y="2150" width="260" height="180" fill="#1a242f" stroke="#334155" stroke-width="2" rx="6"/>')
    svg.append('<text x="680" y="2200" fill="#94a3b8" font-size="20" font-weight="bold" letter-spacing="2">LOGGING CAMP</text>')
    svg.append('</g>')

    # 5. Road & Rail Logistics Network
    svg.append('<g id="transport-network">')
    # Highway M1 (West to East via Central Town)
    hw1 = "M 0,1920 Q 900,1900 1700,1850 T 2050,1850 T 2650,1780 T 3400,1950 T 4096,2020"
    svg.append(f'<path d="{hw1}" fill="none" stroke="#78350f" stroke-width="26" stroke-linecap="round"/>')
    svg.append(f'<path d="{hw1}" fill="none" stroke="#f59e0b" stroke-width="14" stroke-linecap="round"/>')
    svg.append(f'<path d="{hw1}" fill="none" stroke="#fef3c7" stroke-width="2.5" stroke-dasharray="25,25" stroke-linecap="round"/>')

    # North-South Artery
    ns_road = "M 2050,0 Q 2000,800 2050,1850 T 2150,2800 T 2100,4096"
    svg.append(f'<path d="{ns_road}" fill="none" stroke="#334155" stroke-width="20" stroke-linecap="round"/>')
    svg.append(f'<path d="{ns_road}" fill="none" stroke="#94a3b8" stroke-width="10" stroke-linecap="round"/>')

    # Secondary Access Routes
    svg.append('<path d="M 650,2250 Q 1100,2100 1790,1850" fill="none" stroke="#475569" stroke-width="8" stroke-dasharray="16,8"/>')
    svg.append('<path d="M 2150,1850 Q 2300,2400 1550,3150" fill="none" stroke="#475569" stroke-width="8" stroke-dasharray="16,8"/>')
    svg.append('<path d="M 2650,1780 Q 3000,2500 3750,3500" fill="none" stroke="#475569" stroke-width="8" stroke-dasharray="16,8"/>')

    # Bridges crossing River Aragvi
    # Bridge 1 (Central North)
    svg.append('<rect x="1710" y="1800" width="80" height="90" fill="#f8fafc" stroke="#0f172a" stroke-width="4" transform="rotate(-15 1750 1845)"/>')
    svg.append('<text x="1620" y="1780" fill="#f8fafc" font-size="16" font-weight="bold">NORTH BRIDGE</text>')
    # Bridge 2 (Town East Crossing)
    svg.append('<rect x="2610" y="2210" width="80" height="85" fill="#f8fafc" stroke="#0f172a" stroke-width="4" transform="rotate(35 2650 2250)"/>')
    svg.append('<text x="2690" y="2230" fill="#f8fafc" font-size="16" font-weight="bold">LOWER BRIDGE</text>')
    svg.append('</g>')

    # 6. Central 2x2km Control Zone (Combat Area)
    # Scaled to exactly 2000m x 2000m (512px x 512px) centered at cx: 82.40% (2058px), cy: 73.30% in 163.84 scale = ~1832px
    cz_w = 512
    cz_h = 512
    cz_x = 2058 - cz_w / 2
    cz_y = 1832 - cz_h / 2
    
    svg.append('<g id="control-zone">')
    # Zone fill with subtle caution pulse
    svg.append(f'<rect x="{cz_x}" y="{cz_y}" width="{cz_w}" height="{cz_h}" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-width="4" stroke-dasharray="20,12"/>')
    
    # Tactical Corner Brackets (HUD style)
    b_len = 50
    # Top-Left
    svg.append(f'<path d="M {cz_x},{cz_y+b_len} L {cz_x},{cz_y} L {cz_x+b_len},{cz_y}" fill="none" stroke="#ef4444" stroke-width="8"/>')
    # Top-Right
    svg.append(f'<path d="M {cz_x+cz_w-b_len},{cz_y} L {cz_x+cz_w},{cz_y} L {cz_x+cz_w},{cz_y+b_len}" fill="none" stroke="#ef4444" stroke-width="8"/>')
    # Bottom-Left
    svg.append(f'<path d="M {cz_x},{cz_y+cz_h-b_len} L {cz_x},{cz_y+cz_h} L {cz_x+b_len},{cz_y+cz_h}" fill="none" stroke="#ef4444" stroke-width="8"/>')
    # Bottom-Right
    svg.append(f'<path d="M {cz_x+cz_w-b_len},{cz_y+cz_h} L {cz_x+cz_w},{cz_y+cz_h} L {cz_x+cz_w},{cz_y+cz_h-b_len}" fill="none" stroke="#ef4444" stroke-width="8"/>')

    # Label
    svg.append(f'<rect x="{cz_x + 10}" y="{cz_y + 12}" width="290" height="42" fill="#ef4444" rx="4"/>')
    svg.append(f'<text x="{cz_x + 22}" y="{cz_y + 40}" fill="#0f172a" font-size="22" font-weight="900" letter-spacing="3">CONTROL ZONE 2x2KM</text>')
    svg.append('</g>')

    # 7. 5 Key Tower Terminals (Confirmed in Closed Beta / EA)
    # Coordinates normalized from 163.84 scale to 4096px
    # T1: 80.50, 69.86 -> (80.50/163.84)*4096 = 2012, (69.86/163.84)*4096 = 1746
    # T2: 77.19, 70.00 -> 1929, 1750
    # T3: 77.18, 73.46 -> 1929, 1836
    # T4: 83.63, 72.86 -> 2090, 1821
    # T5: 82.21, 68.43 -> 2055, 1710
    towers = [
        ("TOWER 01 (NORTH)", 2012, 1746),
        ("TOWER 02 (WEST-UPPER)", 1929, 1750),
        ("TOWER 03 (WEST-LOWER)", 1929, 1836),
        ("TOWER 04 (EAST-DEPOT)", 2090, 1821),
        ("TOWER 05 (CENTRAL-RIDGE)", 2055, 1710)
    ]

    svg.append('<g id="towers">')
    for idx, (tname, tx, ty) in enumerate(towers, 1):
        # Pulsing radar rings
        svg.append(f'<circle cx="{tx}" cy="{ty}" r="45" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" opacity="0.7"/>')
        svg.append(f'<circle cx="{tx}" cy="{ty}" r="22" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="3" filter="url(#radar-glow)"/>')
        svg.append(f'<circle cx="{tx}" cy="{ty}" r="8" fill="#f0f9ff"/>')
        # Tactical Pin Diamond
        svg.append(f'<polygon points="{tx},{ty-16} {tx+14},{ty} {tx},{ty+16} {tx-14},{ty}" fill="none" stroke="#38bdf8" stroke-width="2"/>')
        # Callout Badge
        svg.append(f'<rect x="{tx + 22}" y="{ty - 18}" width="165" height="34" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5" rx="4"/>')
        svg.append(f'<text x="{tx + 30}" y="{ty + 6}" fill="#f0f9ff" font-size="16" font-weight="bold" letter-spacing="1">T{idx} {tname.split()[0]}</text>')
    svg.append('</g>')

    # 8. 16x16 Major 1km Grid Lines & Tactical Labels
    cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]
    svg.append('<g id="grid-lines">')
    for i in range(GRID_COUNT + 1):
        pos = i * CELL_SIZE
        # Vertical grid line
        svg.append(f'<line x1="{pos}" y1="0" x2="{pos}" y2="{SIZE}" stroke="#223954" stroke-width="2.5" opacity="0.8"/>')
        # Horizontal grid line
        svg.append(f'<line x1="0" y1="{pos}" x2="{SIZE}" y2="{pos}" stroke="#223954" stroke-width="2.5" opacity="0.8"/>')

    # Grid Cell Labels along margins & grid intersections
    for c in range(GRID_COUNT):
        for r in range(GRID_COUNT):
            label = f"{cols[c]}{r+1:02d}"
            gx = c * CELL_SIZE + 10
            gy = r * CELL_SIZE + 26
            svg.append(f'<text x="{gx}" y="{gy}" fill="#476f9b" font-size="18" font-weight="bold" opacity="0.75">{label}</text>')
    svg.append('</g>')

    # 9. Military Borders, Frame & Outer Coordinates
    svg.append('<g id="frame-decorations">')
    # Inner border
    svg.append(f'<rect x="2" y="2" width="{SIZE-4}" height="{SIZE-4}" fill="none" stroke="#38bdf8" stroke-width="4"/>')
    svg.append(f'<rect x="12" y="12" width="{SIZE-24}" height="{SIZE-24}" fill="none" stroke="#1e293b" stroke-width="2"/>')

    # Tactical Header Bar
    svg.append('<rect x="20" y="20" width="760" height="110" fill="#0b1320" stroke="#38bdf8" stroke-width="2" rx="6" opacity="0.95"/>')
    svg.append('<text x="42" y="62" fill="#38bdf8" font-size="34" font-weight="900" letter-spacing="4">BAKURANI / 巴库拉尼</text>')
    svg.append('<text x="44" y="94" fill="#94a3b8" font-size="16" letter-spacing="2">OPERATIONAL THEATER • 16x16 KM (256 SQ KM)</text>')
    svg.append('<text x="44" y="116" fill="#64748b" font-size="13" letter-spacing="1">GEO: KOLCHIA CAUCASUS • CONTOUR INT: 50M • GRID: 1000M/100M</text>')

    # North Arrow & Compass Rose (Top Right)
    compass_x = SIZE - 160
    compass_y = 160
    svg.append(f'<circle cx="{compass_x}" cy="{compass_y}" r="80" fill="#0b1320" stroke="#38bdf8" stroke-width="2.5" opacity="0.9"/>')
    svg.append(f'<circle cx="{compass_x}" cy="{compass_y}" r="64" fill="none" stroke="#1e293b" stroke-width="1.5"/>')
    # North Needle (Red)
    svg.append(f'<polygon points="{compass_x},{compass_y-68} {compass_x+16},{compass_y} {compass_x},{compass_y-14} {compass_x-16},{compass_y}" fill="#ef4444" stroke="#fca5a5" stroke-width="1.5"/>')
    # South Needle (White)
    svg.append(f'<polygon points="{compass_x},{compass_y+68} {compass_x+16},{compass_y} {compass_x},{compass_y+14} {compass_x-16},{compass_y}" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>')
    svg.append(f'<text x="{compass_x-10}" y="{compass_y-74}" fill="#ef4444" font-size="24" font-weight="bold">N</text>')
    svg.append(f'<text x="{compass_x-7}" y="{compass_y+96}" fill="#cbd5e1" font-size="18" font-weight="bold">S</text>')

    # Legend & Scale Bar (Bottom Left)
    leg_x = 24
    leg_y = SIZE - 210
    svg.append(f'<rect x="{leg_x}" y="{leg_y}" width="680" height="180" fill="#0b1320" stroke="#334155" stroke-width="2" rx="6" opacity="0.95"/>')
    svg.append(f'<text x="{leg_x+24}" y="{leg_y+36}" fill="#f8fafc" font-size="20" font-weight="bold" letter-spacing="3">TACTICAL MAP LEGEND / 图例</text>')
    
    # Legend items
    # Highway
    svg.append(f'<line x1="{leg_x+24}" y1="{leg_y+65}" x2="{leg_x+80}" y2="{leg_y+65}" stroke="#f59e0b" stroke-width="8"/>')
    svg.append(f'<text x="{leg_x+95}" y="{leg_y+72}" fill="#cbd5e1" font-size="16">Main Highway M1</text>')
    # River
    svg.append(f'<line x1="{leg_x+24}" y1="{leg_y+95}" x2="{leg_x+80}" y2="{leg_y+95}" stroke="#2563eb" stroke-width="8"/>')
    svg.append(f'<text x="{leg_x+95}" y="{leg_y+102}" fill="#cbd5e1" font-size="16">Aragvi River</text>')
    # Control Zone
    svg.append(f'<rect x="{leg_x+24}" y="{leg_y+120}" width="40" height="24" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="2"/>')
    svg.append(f'<text x="{leg_x+80}" y="{leg_y+138}" fill="#cbd5e1" font-size="16">2x2km Control Zone</text>')
    # Tower terminal
    svg.append(f'<circle cx="{leg_x+340}" cy="{leg_y+65}" r="8" fill="#38bdf8" stroke="#f8fafc" stroke-width="2"/>')
    svg.append(f'<text x="{leg_x+365}" y="{leg_y+72}" fill="#cbd5e1" font-size="16">Tower Terminal 1-5</text>')
    # Scale Bar
    svg.append(f'<line x1="{leg_x+340}" y1="{leg_y+120}" x2="{leg_x+340+256}" y2="{leg_y+120}" stroke="#f8fafc" stroke-width="6"/>')
    svg.append(f'<line x1="{leg_x+340}" y1="{leg_y+110}" x2="{leg_x+340}" y2="{leg_y+130}" stroke="#f8fafc" stroke-width="4"/>')
    svg.append(f'<line x1="{leg_x+340+128}" y1="{leg_y+113}" x2="{leg_x+340+128}" y2="{leg_y+127}" stroke="#f8fafc" stroke-width="2"/>')
    svg.append(f'<line x1="{leg_x+340+256}" y1="{leg_y+110}" x2="{leg_x+340+256}" y2="{leg_y+130}" stroke="#f8fafc" stroke-width="4"/>')
    svg.append(f'<text x="{leg_x+335}" y="{leg_y+152}" fill="#94a3b8" font-size="15">0m</text>')
    svg.append(f'<text x="{leg_x+340+112}" y="{leg_y+152}" fill="#94a3b8" font-size="15">500m</text>')
    svg.append(f'<text x="{leg_x+340+235}" y="{leg_y+152}" fill="#94a3b8" font-size="15">1,000m (1km)</text>')

    # Copyright & System watermark
    svg.append(f'<text x="{SIZE-380}" y="{SIZE-30}" fill="#475569" font-size="15" letter-spacing="1">WARDOGSWIKI.COM • CARTOGRAPHY DEPT</text>')
    svg.append('</g>')

    svg.append('</svg>')
    return '\n'.join(svg)

content = generate_svg()
with open(SVG_PATH, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Generated Bakurani tactical SVG at {SVG_PATH} ({len(content)} bytes)")
