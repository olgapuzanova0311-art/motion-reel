// Расшифровка своей записи с таймингами слов (whisper.cpp, локально, бесплатно).
// Запуск:  node scripts/transcribe.mjs public/reel/my_voice.wav
// Печатает «секунда:слово» — по этим меткам и паузам составляется cuts.json.
import path from "path";
import fs from "fs";
import {execSync} from "child_process";
import {downloadWhisperModel, installWhisperCpp, transcribe, toCaptions} from "@remotion/install-whisper-cpp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const whisperPath = path.join(root, "whisper.cpp");
await installWhisperCpp({to: whisperPath, version: "1.5.5"});
await downloadWhisperModel({model: "medium", folder: whisperPath});
const input = path.resolve(process.argv[2]);
const wav = path.join(root, "out", "voice.16k.wav");
fs.mkdirSync(path.dirname(wav), {recursive: true});
execSync(`ffmpeg -y -loglevel error -i "${input}" -ar 16000 -ac 1 "${wav}"`);
const res = await transcribe({inputPath: wav, whisperPath, whisperCppVersion: "1.5.5", model: "medium", tokenLevelTimestamps: true, language: "ru"});
const {captions} = toCaptions({whisperCppOutput: res});
const words = [];
for (const c of captions) {
  if (c.text.startsWith(" ") || !words.length) words.push({t: c.text.trim(), s: c.startMs});
  else words[words.length - 1].t += c.text;
}
console.log(words.map((w) => `${(w.s / 1000).toFixed(2)}:${w.t}`).join("  "));
