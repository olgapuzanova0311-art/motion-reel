# Озвучка синтезом (бесплатно, Microsoft Edge TTS).
# Запуск:  uvx --with edge-tts python scripts/tts.py [id ...]
# Текст берётся из public/reel/lines.src.json: [["id", "текст"], ...]
# Ударение ставится апострофом ПОСЛЕ ударной гласной: «ка'мера», «шабло'н».
# Без ударений голос часто ошибается, ставь их во всех словах из 2+ слогов.
import asyncio, json, os, subprocess, sys
import edge_tts

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = os.path.join(root, "public/reel")
lines = json.load(open(os.path.join(d, "lines.src.json"), encoding="utf-8"))
only = sys.argv[1:]
VOICE = os.environ.get("VOICE", "ru-RU-SvetlanaNeural")  # мужской: ru-RU-DmitryNeural
RATE = os.environ.get("RATE", "+25%")
PITCH = os.environ.get("PITCH", "+8Hz")
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"

async def one(i, text):
    raw = os.path.join(d, i + ".raw.mp3")
    await edge_tts.Communicate(text.replace("'", "́"), VOICE, rate=RATE, pitch=PITCH).save(raw)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", TRIM, "-ar", "48000", "-ac", "1", os.path.join(d, i + ".wav")], check=True)
    os.remove(raw)

async def main():
    for i, t in lines:
        if not only or i in only:
            await one(i, t)

asyncio.run(main())
dur = {}
for i, _ in lines:
    dur[i] = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(d, i + ".wav")]).decode().strip())
json.dump(dur, open(os.path.join(root, "src/reel/durations.json"), "w"), indent=1)
print("Готово:", round(sum(dur.values()), 1), "сек речи")
