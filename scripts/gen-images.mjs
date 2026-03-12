// 呼叫 Gemini API 生成 AiSection 的三張示意圖，存到 public/images/
import { writeFileSync } from "fs";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("請設定 GEMINI_API_KEY 環境變數");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash-image";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const STYLE =
  "flat vector illustration, pastel colors, clean minimal design, kid-friendly, white background, no text";

const images = [
  {
    file: "ai-use.png",
    prompt: `A cheerful child sitting at a glowing computer, chatting with a friendly AI assistant on the screen. The screen shows a conversation bubble. ${STYLE}`,
  },
  {
    file: "ai-collab.png",
    prompt: `A happy child and a cute friendly robot sitting side by side, collaborating on building something creative together on a desk. Warm, colorful. ${STYLE}`,
  },
  {
    file: "ai-create.png",
    prompt: `A young child engineer assembling a small robot from colorful pieces, with gear icons and circuit patterns floating around. Sense of creation and invention. ${STYLE}`,
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
