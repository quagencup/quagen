========================================
PYTHON — GENERATE PROFILE CARD (card.png)
========================================

from PIL import Image, ImageDraw, ImageFont, ImageFilter

out_path = "card.png"

profile = {
    "name": "Windows",
    "role": "Software Developer",
    "bio": "Building neat webhooks & AI voice tools",
    "initials": "W",
    "stats": [("Repos", "24"), ("Followers", "1.2k"), ("Following", "180")]
}

SIZE = 512
AVATAR_SIZE = 160
PADDING = 36

img = Image.new("RGBA", (SIZE, SIZE), (0,0,0,0))
draw = ImageDraw.Draw(img)

top_color = (28, 33, 74)
bottom_color = (92, 79, 170)

for y in range(SIZE):
    t = y / (SIZE - 1)
    r = int(top_color[0]*(1-t) + bottom_color[0]*t)
    g = int(top_color[1]*(1-t) + bottom_color[1]*t)
    b = int(top_color[2]*(1-t) + bottom_color[2]*t)
    draw.line([(0, y), (SIZE, y)], fill=(r, g, b))

CARD_MARGIN = 28
card_box = [CARD_MARGIN, CARD_MARGIN, SIZE - CARD_MARGIN, SIZE - CARD_MARGIN]

card = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 0))
cd = ImageDraw.Draw(card)
radius = 24

def rounded_rect(draw_obj, box, r, fill):
    x0,y0,x1,y1 = box
    draw_obj.rectangle([x0+r, y0, x1-r, y1], fill=fill)
    draw_obj.rectangle([x0, y0+r, x1, y1-r], fill=fill)
    draw_obj.pieslice([x0, y0, x0+2*r, y0+2*r], 180, 270, fill=fill)
    draw_obj.pieslice([x1-2*r, y0, x1, y0+2*r], 270, 360, fill=fill)
    draw_obj.pieslice([x0, y1-2*r, x0+2*r, y1], 90, 180, fill=fill)
    draw_obj.pieslice([x1-2*r, y1-2*r, x1, y1], 0, 90, fill=fill)

rounded_rect(cd, card_box, radius, (255,255,255,150))
card = card.filter(ImageFilter.GaussianBlur(4))
img = Image.alpha_composite(img, card)

try:
    NAME_FONT = ImageFont.truetype("DejaVuSans-Bold.ttf", 28)
    ROLE_FONT = ImageFont.truetype("DejaVuSans.ttf", 16)
    BIO_FONT  = ImageFont.truetype("DejaVuSans.ttf", 14)
    STAT_NUM_FONT = ImageFont.truetype("DejaVuSans-Bold.ttf", 16)
    STAT_LABEL_FONT = ImageFont.truetype("DejaVuSans.ttf", 12)
except:
    NAME_FONT = ROLE_FONT = BIO_FONT = STAT_NUM_FONT = STAT_LABEL_FONT = ImageFont.load_default()

center_x = SIZE//2
avatar_y = CARD_MARGIN + 36
avatar_x = center_x - AVATAR_SIZE//2

avatar = Image.new("RGBA", (AVATAR_SIZE, AVATAR_SIZE), (255,255,255,0))
ad = ImageDraw.Draw(avatar)

for i in range(AVATAR_SIZE):
    t = i / (AVATAR_SIZE-1)
    ra = int(220*(1-t) + 100*t)
    ga = int(120*(1-t) + 180*t)
    ba = int(80*(1-t) + 220*t)
    ad.line([(0,i),(AVATAR_SIZE,i)], fill=(ra,ga,ba))

mask = Image.new("L", (AVATAR_SIZE, AVATAR_SIZE), 0)
md = ImageDraw.Draw(mask)
md.ellipse((0,0,AVATAR_SIZE,AVATAR_SIZE), fill=255)
avatar.putalpha(mask)

initial_font = ImageFont.truetype("DejaVuSans-Bold.ttf", 72) if True else ImageFont.load_default()
w,h = ad.textsize(profile["initials"], font=initial_font)
ad.text(((AVATAR_SIZE-w)/2,(AVATAR_SIZE-h)/2-6), profile["initials"], fill=(255,255,255,220), font=initial_font)

border = Image.new("RGBA", (AVATAR_SIZE+8, AVATAR_SIZE+8), (0,0,0,0))
bd = ImageDraw.Draw(border)
bd.ellipse((0,0,AVATAR_SIZE+8,AVATAR_SIZE+8), fill=(255,255,255,60))
border.paste(avatar, (4,4), avatar)
img.paste(border, (avatar_x-4, avatar_y-4), border)

draw = ImageDraw.Draw(img)

text_y = avatar_y + AVATAR_SIZE + 12
name = profile["name"]
w_name, h_name = draw.textsize(name, font=NAME_FONT)
draw.text((center_x-w_name/2, text_y), name, font=NAME_FONT, fill=(255,255,255))

text_y += h_name + 6
role = profile["role"]
w_role, h_role = draw.textsize(role, font=ROLE_FONT)
draw.text((center_x-w_role/2, text_y), role, font=ROLE_FONT, fill=(220,220,220))

text_y += h_role + 8
bio = profile["bio"]
max_w = SIZE - 2*PADDING - 40
words = bio.split()
line = ""
lines = []
for word in words:
    test = (line+" "+word).strip()
    if draw.textsize(test, BIO_FONT)[0] <= max_w:
        line = test
    else:
        lines.append(line)
        line = word
if line:
    lines.append(line)
for l in lines[:2]:
    w_l, h_l = draw.textsize(l, BIO_FONT)
    draw.text((center_x-w_l/2, text_y), l, font=BIO_FONT, fill=(230,230,230))
    text_y += h_l + 4

stat_y = SIZE - CARD_MARGIN - 64
count = len(profile["stats"])
total_w = SIZE - 2*CARD_MARGIN - 40
item_w = total_w // count
start_x = CARD_MARGIN + 20

for i,(label,num) in enumerate(profile["stats"]):
    x = start_x + i*item_w
    w_num,h_num = draw.textsize(num, STAT_NUM_FONT)
    draw.text((x+(item_w-w_num)/2, stat_y), num, font=STAT_NUM_FONT, fill="white")
    w_lbl,h_lbl = draw.textsize(label, STAT_LABEL_FONT)
    draw.text((x+(item_w-w_lbl)/2, stat_y+h_num+6), label, font=STAT_LABEL_FONT, fill=(220,220,220))

img.convert("RGB").save(out_path)
print("Saved card.png")


========================
HTML — DISPLAY THE CARD
========================

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="card">
    <img src="card.png" class="profile-img">
    <div class="name-tag">
        <h3>Windows</h3>
        <p>Software Developer</p>
    </div>
</div>

<div class="card-overlay"></div>

<script src="script.js"></script>
</body>
</html>


=======================
CSS — GUNS.LOL STYLING
=======================

.card {
    width: 260px;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    transition: .2s ease;
}
.card:hover {
    transform: scale(1.03);
}
.profile-img {
    width: 100%;
}
.card-overlay {
    position: fixed;
    inset: 0;
    backdrop-filter: blur(10px);
    background: rgba(0,0,0,0.45);
    opacity: 0;
    pointer-events: none;
    transition: .25s;
}
.card-overlay.active {
    opacity: 1;
    pointer-events: auto;
}
.card-expanded {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 90%;
    max-width: 420px;
    padding: 25px;
    background: #161616;
    border-radius: 22px;
}


==============================
JAVASCRIPT — EXPAND THE CARD
==============================

class CardClickHandler {
    constructor(cardSelector, overlaySelector, expandedCardSelector) {
        this.cards = document.querySelectorAll(cardSelector);
        this.overlay = document.querySelector(overlaySelector);
        this.expandedCard = document.querySelector(expandedCardSelector);
        this.init();
    }
    init() {
        this.cards.forEach(card => {
            card.addEventListener("click", () => {
                this.overlay.classList.add("active");
                this.showExpanded(card);
            });
        });
        this.overlay.addEventListener("click", () => {
            this.overlay.classList.remove("active");
            this.expandedCard.classList.remove("active");
        });
    }
    showExpanded(card) {
        this.expandedCard.innerHTML = card.innerHTML;
        this.expandedCard.classList.add("active");
    }
}
new CardClickHandler(".card", ".card-overlay", ".card-expanded");

