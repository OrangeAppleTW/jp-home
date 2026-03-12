// 呼叫 Gemini API 生成 CourseStages 的課程示意圖，存到 public/images/
import { writeFileSync } from "fs";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("請設定 GEMINI_API_KEY 環境變數");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash-image";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const STYLE =
  "flat illustration, vibrant colors, clean UI-focused design, isometric or 2.5D perspective, white background, no text labels";

const images = [
  {
    file: "course-minecraft.png",
    prompt: `Isometric Minecraft game scene showing redstone circuits with torches and wires connecting command blocks, pixel-art style 3D blocks in green and grey, colorful TNT and levers visible. ${STYLE}`,
  },
  {
    file: "course-roblox.png",
    prompt: `Colorful Roblox-style 3D platformer game level: floating platforms, bright neon colors, cartoon character avatars running, obstacle course with traps and checkpoints visible. ${STYLE}`,
  },
  {
    file: "course-scratch-editor.png",
    prompt: `Scratch programming editor interface showing colorful drag-and-drop code blocks: blue Motion blocks, yellow Control blocks, orange Events blocks stacked together on the left panel. Clean UI layout. ${STYLE}`,
  },
  {
    file: "course-scratch-game.png",
    prompt: `A cute 2D platformer game made in Scratch: cartoon cat sprite jumping on colorful platforms, score counter in corner, bright sky background with clouds, simple pixel art style. ${STYLE}`,
  },
  {
    file: "course-python-game.png",
    prompt: `Pygame 2D game screen: colorful spaceship shooter game with pixel spaceships, laser beams, star enemies exploding, lives counter and score displayed, retro arcade aesthetic. ${STYLE}`,
  },
  {
    file: "course-js-game.png",
    prompt: `Browser-based JavaScript canvas game: colorful 2D maze or puzzle game with HTML game UI, health bar, level counter, vibrant cartoon graphics, modern web game aesthetic. ${STYLE}`,
  },
  {
    file: "course-algorithm.png",
    prompt: `Visual diagram of sorting algorithm: colorful vertical bars of different heights being sorted with arrows showing swap operations, graph nodes connected by edges beside it, clean data visualization aesthetic. ${STYLE}`,
  },
  {
    file: "course-ai-web.png",
    prompt: `Modern web app dashboard with AI features: neural network diagram with glowing nodes and connections, line charts and bar charts showing data, clean card-based UI layout, teal and purple accent colors. ${STYLE}`,
  },
];

for (const { file, prompt } of images) {
  console.log(`Generating ${file}...`);

  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error(`Error for ${file}:`, JSON.stringify(json, null, 2));
    continue;
  }

  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) {
    console.error(`No image data for ${file}:`, JSON.stringify(json, null, 2));
    continue;
  }

  const buf = Buffer.from(part.inlineData.data, "base64");
  writeFileSync(`public/images/${file}`, buf);
  console.log(`  ✓ saved public/images/${file}`);
}
