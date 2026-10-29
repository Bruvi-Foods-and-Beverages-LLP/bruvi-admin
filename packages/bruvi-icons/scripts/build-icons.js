import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgDir = path.resolve(__dirname, "../assets/svg");
const outputFile = path.resolve(__dirname, "../src/icons-data.json");

const files = fs.readdirSync(svgDir).filter(f => f.endsWith(".svg"));
const iconsMap = {};

for (const file of files) {
  const name = path.basename(file, ".svg");
  const content = fs.readFileSync(path.join(svgDir, file), "utf-8");

  // Extract viewBox
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";

  // Extract inner SVG content
  let inner = content
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>/i, "")
    .trim();

  // Convert stroke-width to strokeWidth, etc. for React compatibility
  inner = inner
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    .replace(/stroke-miterlimit=/g, "strokeMiterlimit=")
    .replace(/clip-path=/g, "clipPath=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/fill-opacity=/g, "fillOpacity=")
    .replace(/stroke-opacity=/g, "strokeOpacity=");

  iconsMap[name] = {
    viewBox,
    innerHtml: inner
  };
}

fs.writeFileSync(outputFile, JSON.stringify(iconsMap, null, 2), "utf-8");
console.log(`Successfully built ${Object.keys(iconsMap).length} icons into icons-data.json`);

