// Convert every raster image in public/img to .webp (keeps originals; a
// separate step removes them after references are updated & verified).
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/img";
const files = readdirSync(DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));

let ok = 0;
let fail = 0;
let savedBefore = 0;
let savedAfter = 0;

for (const f of files) {
  const src = join(DIR, f);
  const out = join(DIR, f.replace(/\.(png|jpe?g)$/i, ".webp"));
  const isPng = /\.png$/i.test(f);
  try {
    await sharp(src)
      .webp({ quality: isPng ? 88 : 80, effort: 5 })
      .toFile(out);
    savedBefore += statSync(src).size;
    savedAfter += statSync(out).size;
    ok++;
  } catch (e) {
    console.error("FAIL", f, e.message);
    fail++;
  }
}

const mb = (n) => (n / 1048576).toFixed(2) + " MB";
console.log(`converted ${ok}, failed ${fail}`);
console.log(`originals ${mb(savedBefore)} -> webp ${mb(savedAfter)}`);
