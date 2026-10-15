# Нарезка СВОЕЙ записи голоса на фразы под сцены.
# Запуск:  python3 scripts/cut_voice.py public/reel/cuts.json
# cuts.json: {"src": "public/reel/my_voice.wav", "speed": 1.3, "cuts": [["danu", 0.0, 1.36], ["okey", 1.36, 2.2], ...]}
#   id должны совпадать с id из lines.src.json, время в секундах исходной записи.
#   Режь в паузах между словами (найти их: ffmpeg -i my_voice.wav -af silencedetect=noise=-38dB:d=0.12 -f null -).
#   speed — ускорение голоса без смены тембра (1.0 = как записано).
import json, os, subprocess, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(sys.argv[1], encoding="utf-8"))
src = os.path.join(root, cfg["src"])
speed = float(cfg.get("speed", 1.0))
d = os.path.join(root, "public/reel")
trim = "silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse"
dur = {}
for i, a, b in cfg["cuts"]:
    out = os.path.join(d, i + ".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(a), "-to", str(b), "-i", src, "-af",
        f"{trim},atempo={speed},afade=t=in:d=0.015,areverse,afade=t=in:d=0.03,areverse", "-ar", "48000", "-ac", "1", out], check=True)
    dur[i] = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).decode())
json.dump(dur, open(os.path.join(root, "src/reel/durations.json"), "w"), indent=1)
print("Готово:", round(sum(dur.values()), 1), "сек речи")
