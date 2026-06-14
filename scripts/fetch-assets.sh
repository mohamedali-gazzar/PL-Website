#!/usr/bin/env bash
# Downloads the real Powerline imagery from the live Shopify CDN into /public/img.
# Run once. Re-running re-downloads (idempotent).
set -u
OUT="public/img"
mkdir -p "$OUT"
B="https://powerlinei.com/cdn/shop/files"

dl () { # url localname
  curl -sSL --fail "$1" -o "$OUT/$2" && echo "ok  $2" || echo "ERR $2  <- $1"
}

# Brand / logo
dl "$B/logo-powerline-PNG-high-quality.png?v=1741172362&width=1748" "logo.png"
dl "$B/RRR.png?v=1741173047&width=907" "logo-mark.png"
dl "$B/abb_and_schneider_rectangle.png?v=1745996956&width=2240" "abb-schneider.png"

# Hero / facility / safety
dl "$B/AR-2498.jpg?v=1745828118&width=2400" "facility-1.jpg"
dl "$B/AR-2356.jpg?v=1745952439&width=2400" "facility-2.jpg"

# Projects
dl "$B/cover_655dc69ee6cb7.jpg?v=1746622458&width=2293" "proj-almehwar.jpg"
dl "$B/5Tob47ul2nrgtSiDfQU2RSkjZ0Blr6Townhousepool.jpg?v=1745746439&width=2400" "proj-sodic-vilette.jpg"
dl "$B/0_img-20220331-143046-1-1_352e70c8_9d2d1601-fc57-4323-82e0-17707c676f31.jpg?v=1746622547&width=1920" "proj-acrow.jpg"
dl "$B/Sodic_June.png?v=1745848956&width=2240" "proj-sodic-june.jpg"
dl "$B/Mountain_View.png?v=1745848959&width=2240" "proj-mountain-view.jpg"
dl "$B/Zed_Park.png?v=1745848956&width=2240" "proj-zed-park.jpg"

# Product line covers
dl "$B/WhatsApp_Image_2026-05-19_at_15.02.38.jpg?v=1779192773&width=1200" "line-lv.jpg"
dl "$B/WhatsApp_Image_2026-05-19_at_14.59.31.jpg?v=1779192972&width=1200" "line-mv.jpg"
dl "$B/WhatsApp_Image_2026-05-19_at_15.36.53.jpg?v=1779194379&width=1200" "line-supplies.jpg"

# Milestones
dl "$B/2012.png?v=1745950188&width=2240" "ms-2012.jpg"
dl "$B/2015_16da3543-b5a9-4f08-ad0a-1287db79bf15.png?v=1745950187&width=2240" "ms-2015.jpg"
dl "$B/2017_e4190af1-8e51-44ed-905f-3d2c18711546.png?v=1745950188&width=2240" "ms-2017.jpg"
dl "$B/abb_certificate_mockup.png?v=1746008792&width=2240" "ms-2018.jpg"
dl "$B/2021_-_updated.png?v=1746622184&width=2240" "ms-2021.jpg"
dl "$B/2022_028d2d77-e80f-48a0-99da-5968defc9973.png?v=1745950188&width=2240" "ms-2022.jpg"
dl "$B/2024_-_updated.png?v=1746622186&width=2240" "ms-2024.jpg"
dl "$B/2025_f8b87507-fe6a-41a3-9819-e4211adf24fe.png?v=1745950186&width=2240" "ms-2025.jpg"

# Before / after
dl "$B/WhatsApp_Image_2026-05-12_at_12.32.35.jpg?v=1778578535&width=1200" "effect-before.jpg"
dl "$B/WhatsApp_Image_2026-05-11_at_15.48.59.jpg?v=1778578579&width=1200" "effect-after.jpg"

# Memorial
dl "$B/eng._hassan.png?v=1745836015&width=1080" "memorial.png"

# Customer logos
dl "$B/1_9843341c-1c34-4bda-8bfb-17c6c814f5ba.png?v=1745865138&width=1080" "cust-1.png"
dl "$B/el_sewedy_logo.png?v=1746009860&width=1080" "cust-elsewedy.png"
dl "$B/3_0d37696b-82f6-4d74-b04a-6aea71c76929.png?v=1745865138&width=1080" "cust-3.png"
dl "$B/4_809a1087-cf4b-44b0-bb52-2a3ec08ba3c5.png?v=1745865138&width=1080" "cust-4.png"
dl "$B/5_a1143e05-093a-4157-8060-40ec649784fc.png?v=1745865138&width=1080" "cust-5.png"
dl "$B/10_92f083a1-56fa-43b6-8b46-6296a8856bc6.png?v=1745869703&width=1080" "cust-6.png"
dl "$B/7_6badf91c-d160-4b53-8523-3b0a37ecd111.png?v=1745869703&width=1080" "cust-7.png"
dl "$B/9_48949902-32c1-4b7f-9d9a-0b7e12f597a8.png?v=1745869703&width=1080" "cust-8.png"
dl "$B/6_09d5ec9b-d286-4fff-a07a-15ea72170cc2.png?v=1745869703&width=1080" "cust-9.png"
dl "$B/8_4af77319-4c5a-4c38-98ce-0314bf6ebbbd.png?v=1745869703&width=1080" "cust-10.png"

# Partner logos
dl "$B/1_926116c8-6338-4c8c-b0f1-4d3fed99718c.png?v=1745744829&width=1080" "partner-1.png"
dl "$B/2_82249933-0422-4b78-9c64-96efd5cae515.png?v=1745744829&width=1080" "partner-2.png"
dl "$B/5_1d2d7d1d-2552-439c-8a03-d9285e8040d2.png?v=1745848651&width=1080" "partner-3.png"

# Product detail images
dl "$B/WhatsApp_Image_2026-05-19_at_15.41.08.jpg?v=1779195001&width=1080" "prod-dry.jpg"
dl "$B/WhatsApp_Image_2026-05-19_at_15.41.39.jpg?v=1779194976&width=1080" "prod-oil.jpg"
dl "$B/290684ba-bf65-40c8-a790-614c9505fe44.png?v=1779197514&width=1024" "prod-plp.png"
dl "$B/2-2.png?v=1779197384&width=1254" "prod-plp-2.png"
dl "$B/WhatsApp_Image_2026-05-19_at_16.03.40.jpg?v=1779197099&width=1080" "prod-mcset.jpg"
dl "$B/WhatsAppImage2026-05-19at16.01.03.jpg?v=1779195811&width=1080" "prod-gis-rmu.jpg"

echo "DONE"
