import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {back, BgDark, BgLight, BgRed, Burst, ClaudeMark, disp, Enter, H, K, Letters, lerp, mono, p, Pop, Rays} from "./kit";

/** d — длина сцены в кадрах, v — кадры начала каждой фразы, ve — кадры конца каждой фразы */
export type SP = {d: number; v: number[]; ve: number[]};
const center: React.CSSProperties = {alignItems: "center", justifyContent: "center"};
const left = (x = 200): React.CSSProperties => ({justifyContent: "center", paddingLeft: x});

/* 1. Красный экран */
export const Intro: React.FC<SP> = () => {
  const f = useCurrentFrame();
  return <BgRed><AbsoluteFill style={{background: `rgba(255,255,255,${0.05 * Math.sin(f / 5)})`}} /></BgRed>;
};

/* 2. ДА НУ НАХ*Й. */
export const DaNu: React.FC<SP> = ({d}) => (
  <BgLight>
    <Enter>
      <AbsoluteFill style={left(220)}>
        <Letters text="ДА НУ" size={190} color={K.ink} stagger={1.2} />
        <Letters text="НАХ*Й." size={230} color={K.red} at={6} from="scale" stagger={1.3} />
      </AbsoluteFill>
    </Enter>
  </BgLight>
);

/* 3. ОКЕЙ. → ОКЕЙ! */
export const Okey: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const flash = 1 - p(f, 0, 8);
  const pulse = 1 + 0.06 * Math.sin(f / 4);
  const second = Math.round((v[0] + ve[0]) / 2);
  const bang = true;
  const bs = lerp(p(f, second, 10, back), 1.8, 1);
  return (
    <AbsoluteFill>
      <BgDark grid={false}>
        <AbsoluteFill style={center}>
          <div style={{width: 760, height: 760, borderRadius: 999, background: "radial-gradient(circle, rgba(242,33,74,0.95) 0%, rgba(242,33,74,0.5) 40%, rgba(242,33,74,0) 70%)", transform: `scale(${pulse})`}} />
        </AbsoluteFill>
        <AbsoluteFill style={center}>
          <div style={{display: "flex", alignItems: "baseline", transform: `scale(${lerp(p(f, 2, 12, back), 0.6, 1) * (bang ? 1.08 : 1)})`}}>
            <H size={250}>ОКЕЙ</H>
            <H size={250} color={K.red} style={{transform: `scale(${bang ? bs : 1})`}}>{bang ? "!" : "."}</H>
          </div>
        </AbsoluteFill>
      </BgDark>
      <AbsoluteFill style={{opacity: flash}}>
        <BgLight><Rays color="rgba(242,33,74,0.5)" burst={lerp(p(f, 0, 8), 0.3, 1.4)} /></BgLight>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 4. ВЫ ВЕРИТЕ? + окно After Effects, которое зачёркивают */
export const Verite: React.FC<SP> = ({d}) => {
  const f = useCurrentFrame();
  const cut = p(f, d * 0.6, 10);
  const bars = ["#4F7CFF", "#F2214A", "#FF8A3D", "#B05CFF", "#43D17A", "#FFD23F", "#3FD0FF"];
  return (
    <BgDark>
      <AbsoluteFill style={{...left(170)}}>
        <Letters text="ВЫ" size={170} />
        <Letters text="ВЕРИТЕ?" size={120} color={K.red} at={5} from="blur" />
      </AbsoluteFill>
      <Pop at={8} dx={120} dy={0} style={{position: "absolute", left: 1000, top: 270}}>
        <div style={{width: 720, height: 470, borderRadius: 18, background: "#1B1F3A", border: "2px solid #39407A", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", overflow: "hidden"}}>
          <div style={{height: 46, background: "#262B4D", display: "flex", alignItems: "center", gap: 10, paddingLeft: 18}}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 9, background: c}} />)}
            <div style={{fontFamily: mono, color: "#AEB3D6", fontSize: 18, marginLeft: 18}}>After Effects — Untitled.aep</div>
          </div>
          <div style={{padding: "34px 40px", display: "flex", flexDirection: "column", gap: 22}}>
            {bars.map((c, i) => (
              <div key={i} style={{height: 22, borderRadius: 6, background: c, marginLeft: (i * 47) % 120, width: interpolate(f, [8 + i * 2, 22 + i * 2], [0, 380 + ((i * 71) % 180)], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}} />
            ))}
          </div>
        </div>
        <svg width={760} height={500} style={{position: "absolute", left: -20, top: -10}}>
          <line x1={30} y1={440} x2={lerp(cut, 30, 740)} y2={lerp(cut, 440, 40)} stroke={K.red} strokeWidth={22} strokeLinecap="round" />
        </svg>
        <div style={{position: "absolute", left: lerp(cut, 360, 610), top: lerp(cut, 380, 230), fontSize: 44, color: "#fff"}}>➤</div>
      </Pop>
    </BgDark>
  );
};

/* 5. РАДИ ЭТОГО ВИДЕО? */
export const Radi: React.FC<SP> = () => (
  <BgDark>
    <AbsoluteFill style={left(200)}>
      <Letters text="РАДИ ЭТОГО" size={100} stagger={1} />
      <div style={{display: "flex", marginTop: 10}}>
        <Letters text="ВИДЕО" size={220} at={5} from="blur" />
        <Letters text="?" size={220} color={K.red} at={14} from="scale" />
      </div>
    </AbsoluteFill>
  </BgDark>
);

/* 6. И СРАЗУ — БЛ* НЕТ. */
export const Srazu: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const len = ve[0] - v[0];
  const tag = v[0] + len * 0.35;
  const net = v[0] + len * 0.6;
  return (
    <BgLight>
      <AbsoluteFill style={left(200)}>
        <div style={{display: "flex", alignItems: "center", gap: 30}}>
          <Letters text="И СРАЗУ —" size={130} color={K.ink} stagger={1.6} spacing={0.06} />
          <Pop at={tag} s0={2} dy={0} len={8}>
            <div style={{background: K.ink, color: "#fff", fontFamily: disp, fontWeight: 900, fontSize: 64, padding: "6px 22px", transform: "rotate(-8deg) translateY(-50px)", borderRadius: 8}}>БЛ*</div>
          </Pop>
        </div>
        <div style={{marginTop: 20, transform: `scale(${lerp(p(f, net, 8, back), 2.5, 1)})`, transformOrigin: "left center", opacity: p(f, net, 4)}}>
          <H size={300} color={K.red}>НЕТ.</H>
        </div>
      </AbsoluteFill>
    </BgLight>
  );
};

/* 7. НЕ ШАБЛОН / НЕ ПЛАГИН ?? */
const Strike: React.FC<{text: string; at: number; strikeAt: number; color?: string}> = ({text, at, strikeAt, color = K.ink}) => {
  const f = useCurrentFrame();
  const s = p(f, strikeAt, 8);
  return (
    <div style={{position: "relative", display: "inline-block"}}>
      <Letters text={text} size={120} color={color} at={at} stagger={1} />
      <div style={{position: "absolute", left: -10, top: "48%", height: 16, background: K.red, width: `${s * 104}%`, borderRadius: 8}} />
    </div>
  );
};
export const Shablon: React.FC<SP> = ({v, ve}) => {
  const len = ve[0] - v[0];
  return (
    <BgLight>
      <AbsoluteFill style={left(190)}>
        <Strike text="НЕ ШАБЛОН" at={0} strikeAt={v[0] + len * 0.4} />
        <div style={{height: 30}} />
        <Strike text="НЕ ПЛАГИН" at={v[0] + len * 0.45} strikeAt={v[0] + len * 0.85} />
      </AbsoluteFill>
      <Pop at={v[0] + len * 0.45} s0={2.4} dy={0} style={{position: "absolute", left: 1450, top: 250}}>
        <H size={300} color={K.red}>?</H>
      </Pop>
      <Pop at={v[0] + len * 0.85} s0={2.4} dy={0} style={{position: "absolute", left: 1640, top: 540}}>
        <H size={170} color={K.ink}>?</H>
      </Pop>
    </BgLight>
  );
};

/* 8. Взрыв → лого CLAUDE CODE */
export const Claude: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const flash = 1 - p(f, 3, 6);
  return (
    <AbsoluteFill>
      <BgDark grid={false}>
        <AbsoluteFill style={{...center, flexDirection: "row", gap: 50}}>
          <Pop at={4} s0={0.2} dy={0}><ClaudeMark size={260} rot={f * 2} /></Pop>
          <div>
            <Letters text="CLAUDE" size={150} at={7} />
            <Letters text="CODE" size={150} at={10} />
          </div>
        </AbsoluteFill>
      </BgDark>
      <AbsoluteFill style={{opacity: flash}}>
        <BgLight><Rays color="rgba(255,200,40,0.8)" burst={lerp(p(f, 0, 8), 0.2, 1.5)} /></BgLight>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 9. ТЫ ПИШЕШЬ КЛОДУ. + поле ввода */
export const Pishesh: React.FC<SP> = ({v, ve}) => {
  const f = useCurrentFrame();
  const len = ve[0] - v[0];
  const typed = "что хочу увидеть";
  const n = Math.round(interpolate(f, [v[0] + len * 0.5, ve[0]], [0, typed.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  return (
    <BgLight>
      <AbsoluteFill style={left(200)}>
        <Letters text="ТЫ ПИШЕШЬ" size={150} color={K.ink} stagger={1.1} />
        <div style={{display: "flex"}}>
          <Letters text="КЛОДУ" size={200} color={K.ink} at={v[0] + len * 0.3} from="blur" />
          <Letters text="." size={200} color={K.red} at={v[0] + len * 0.45} from="scale" />
        </div>
        <Pop at={v[0] + len * 0.45} style={{marginTop: 50}}>
          <div style={{width: 1100, height: 92, borderRadius: 60, background: "#fff", border: "3px solid #1A1A2E", display: "flex", alignItems: "center", padding: "0 14px 0 40px", boxShadow: "0 20px 50px rgba(30,60,120,0.18)"}}>
            <div style={{fontFamily: mono, fontSize: 38, color: "#333", flex: 1}}>
              {typed.slice(0, n)}
              <span style={{opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: K.red}}>|</span>
            </div>
            <div style={{width: 66, height: 66, borderRadius: 40, background: K.red}} />
          </div>
        </Pop>
      </AbsoluteFill>
    </BgLight>
  );
};

/* 10. Плёнка + А ОН ПРЕВРАЩАЕТ ЭТО В АНИМАЦИЮ. */
export const Prevr: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const len = ve[0] - v[0];
  return (
    <BgDark>
      <Pop at={0} dy={-60} style={{position: "absolute", top: 120, left: 0, width: 1920}}>
        <div style={{height: 230, background: "#fff", position: "relative", overflow: "hidden"}}>
          {[14, 192].map((y) => (
            <div key={y} style={{position: "absolute", top: y, left: -80 + ((f * 6) % 80), display: "flex", gap: 40}}>
              {Array.from({length: 30}, (_, i) => <div key={i} style={{width: 24, height: 22, background: K.dark, borderRadius: 4}} />)}
            </div>
          ))}
          <div style={{position: "absolute", top: 46, left: -420 + ((f * 6) % 420), display: "flex", gap: 20}}>
            {Array.from({length: 7}, (_, i) => {
              const m = Math.min(1, Math.max(0, (f - 8 - i * 3) / 14));
              return (
                <div key={i} style={{width: 400, height: 138, background: K.dark, display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <div style={{width: 74, height: 74, background: K.red, borderRadius: `${m * 50}%`, transform: `rotate(${(1 - m) * (30 + i * 15) + f * (i % 2 ? 2 : -2) * (1 - m)}deg)`}} />
                </div>
              );
            })}
          </div>
        </div>
      </Pop>
      <AbsoluteFill style={{paddingLeft: 150, paddingTop: 470}}>
        <Letters text="А ОН ПРЕВРАЩАЕТ ЭТО" size={64} at={4} stagger={0.7} />
        <div style={{display: "flex", marginTop: 30}}>
          <Letters text="В АНИМАЦИЮ" size={150} at={v[0] + len * 0.55} from="blur" stagger={1} />
          <Letters text="." size={150} color={K.red} at={v[0] + len * 0.85} from="scale" />
        </div>
      </AbsoluteFill>
    </BgDark>
  );
};

/* 11. ВСЁ. */
export const Vse: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const t = p(f, 0, 14);
  return (
    <AbsoluteFill style={{background: "radial-gradient(ellipse at center, #FFE3EA 0%, #F7B4C6 60%, #EE8DA8 100%)"}}>
      <Rays color="rgba(255,255,255,0.7)" />
      <AbsoluteFill style={center}>
        <H size={480} style={{transform: `scale(${lerp(t, 1.9, 1)})`, filter: `blur(${lerp(t, 20, 0)}px)`, color: "#fff", textShadow: "0 20px 60px rgba(200,20,60,0.35)"}}>ВСЁ.</H>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 12. НУЖНО ТОЛЬКО НАПИСАТЬ: */
export const Nuzhno: React.FC<SP> = () => {
  const f = useCurrentFrame();
  return (
    <BgDark>
      <AbsoluteFill style={left(210)}>
        <Letters text="НУЖНО ТОЛЬКО" size={100} stagger={1} />
        <div style={{display: "flex", alignItems: "center", marginTop: 20}}>
          <Letters text="НАПИСАТЬ:" size={170} at={6} from="blur" />
          <div style={{width: 14, height: 170, background: K.red, marginLeft: 16, opacity: Math.floor(f / 7) % 2 ? 0 : 1}} />
        </div>
      </AbsoluteFill>
    </BgDark>
  );
};

/* 13. Промпт печатается */
const PROMPT: [string, boolean][] = [
  ["«Сделай ", false], ["15-секундную", true], [" кинематографичную анимацию: ", false], ["кинетическая", true], [" ", false], ["типографика", true], [", ", false],
  ["морфинг", true], [" ", false], ["форм", true], [", ", false], ["3D", true], [", ", false], ["плавная", true], [" ", false], ["камера", true], ["»", false],
];
const RedFloor: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{perspective: 700, overflow: "hidden"}}>
      <div
        style={{
          position: "absolute", left: -1000, right: -1000, top: 780, height: 900,
          transform: "rotateX(72deg)", transformOrigin: "top",
          backgroundImage: "linear-gradient(rgba(242,33,74,0.75) 2px, transparent 2px), linear-gradient(90deg, rgba(242,33,74,0.75) 2px, transparent 2px)",
          backgroundSize: "120px 120px", backgroundPosition: `0 ${f * 3}px`,
          maskImage: "linear-gradient(to bottom, black, transparent 80%)",
        }}
      />
    </AbsoluteFill>
  );
};
export const Prompt: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const total = PROMPT.reduce((a, [s]) => a + s.length, 0);
  const n = Math.round(interpolate(f, [v[0], ve[0] - 4], [0, total], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const press = p(f, ve[0] - 2, 6);
  let acc = 0;
  return (
    <BgDark grid={false}>
      <RedFloor />
      <Pop at={0} s0={0.92}>
        <div style={{position: "absolute", left: 150, top: 150, width: 1620, height: 640, borderRadius: 26, background: "rgba(18,12,26,0.92)", border: "2px solid rgba(242,33,74,0.55)", boxShadow: "0 0 80px rgba(242,33,74,0.25)", padding: "50px 60px"}}>
          <div style={{fontFamily: mono, fontSize: 22, letterSpacing: "0.2em", color: K.grey, marginBottom: 30}}>ПРОМПТ ДЛЯ CLAUDE CODE</div>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 54, lineHeight: 1.55, color: "#fff"}}>
            {PROMPT.map(([s, hl], i) => {
              const show = Math.max(0, Math.min(s.length, n - acc));
              acc += s.length;
              if (!show) return null;
              return (
                <span key={i} style={hl ? {background: K.red, padding: "0 6px", borderRadius: 4} : undefined}>{s.slice(0, show)}</span>
              );
            })}
            <span style={{color: K.red, opacity: Math.floor(f / 7) % 2 ? 0 : 1}}>▌</span>
          </div>
          <div style={{position: "absolute", right: 46, bottom: 46, width: 96, height: 96, borderRadius: 18, background: K.red, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 54, fontWeight: 900, transform: `scale(${1 - 0.15 * Math.sin(press * Math.PI)})`, boxShadow: `0 0 ${40 + press * 60}px rgba(242,33,74,0.8)`}}>↑</div>
        </div>
      </Pop>
    </BgDark>
  );
};

/* 14. А ТЕПЕРЬ СМОТРИ */
export const Smotri: React.FC<SP> = () => (
  <BgRed>
    <Rays color="rgba(255,255,255,0.3)" />
    <AbsoluteFill style={{...center, flexDirection: "column"}}>
      <Letters text="А ТЕПЕРЬ" size={70} stagger={1} />
      <Letters text="СМОТРИ" size={240} at={6} from="scale" stagger={2} style={{marginTop: 20}} />
    </AbsoluteFill>
  </BgRed>
);

/* 15. БУКВЫ ТЯНУТСЯ */
export const Bukvy: React.FC<SP> = ({d}) => {
  const f = useCurrentFrame();
  const t = p(f, 3, d - 6);
  const sx = interpolate(t, [0, 0.4, 0.75, 1], [0.3, 1.45, 0.9, 1.15]);
  return (
    <BgDark>
      <AbsoluteFill style={{...center, flexDirection: "column"}}>
        <Letters text="БУКВЫ" size={60} color="#C8C6D6" />
        <div style={{transform: `scaleX(${sx}) scaleY(${2 - sx * 0.8})`, marginTop: 30}}>
          <H size={220}>ТЯНУТСЯ</H>
        </div>
      </AbsoluteFill>
    </BgDark>
  );
};

/* 16. КАМЕРА — видоискатель */
export const Kamera: React.FC<SP> = ({d}) => {
  const f = useCurrentFrame();
  const t = p(f, 0, d);
  const corner = (s: React.CSSProperties) => <div style={{position: "absolute", width: 90, height: 90, borderColor: K.red, borderStyle: "solid", borderWidth: 0, ...s}} />;
  const tc = `00:00:${String(31 + Math.floor(f / 30)).padStart(2, "0")}:${String(f % 30).padStart(2, "0")}`;
  return (
    <BgDark>
      <div style={{position: "absolute", inset: 90}}>
        {corner({left: 0, top: 0, borderLeftWidth: 6, borderTopWidth: 6})}
        {corner({right: 0, top: 0, borderRightWidth: 6, borderTopWidth: 6})}
        {corner({left: 0, bottom: 0, borderLeftWidth: 6, borderBottomWidth: 6})}
        {corner({right: 0, bottom: 0, borderRightWidth: 6, borderBottomWidth: 6})}
        <div style={{position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 14, fontFamily: mono, fontWeight: 700, color: "#fff", fontSize: 26}}>
          <div style={{width: 20, height: 20, borderRadius: 10, background: K.red, opacity: Math.floor(f / 10) % 2 ? 0.2 : 1}} /> REC
        </div>
        <div style={{position: "absolute", right: 40, top: 30, fontFamily: mono, color: "#fff", fontSize: 26}}>{tc}</div>
      </div>
      <AbsoluteFill style={{...center, perspective: 1200}}>
        <div style={{transform: `translateX(${lerp(t, 380, -200)}px) rotateY(${lerp(t, -35, 18)}deg) scale(${lerp(t, 0.85, 1.15)})`, filter: `blur(${Math.abs(lerp(t, 6, -4)) * 0.6}px)`}}>
          <H size={230}>КАМЕРА</H>
        </div>
      </AbsoluteFill>
    </BgDark>
  );
};

/* 17. Красный шар — «и жди переход —» */
export const Perehod: React.FC<SP> = ({d}) => {
  const f = useCurrentFrame();
  const ring = p(f, 0, d);
  return (
    <BgDark grid={false}>
      <AbsoluteFill style={center}>
        <div style={{position: "absolute", width: 600, height: 600, borderRadius: 999, background: "radial-gradient(circle, rgba(242,33,74,0.9) 0%, rgba(242,33,74,0.35) 35%, rgba(242,33,74,0) 70%)"}} />
        <div style={{position: "absolute", width: 230, height: 230, borderRadius: 999, background: K.red, boxShadow: "0 0 80px #F2214A"}} />
        <div style={{position: "absolute", width: lerp(ring, 260, 330), height: lerp(ring, 260, 330), borderRadius: 999, border: "5px solid #fff"}} />
      </AbsoluteFill>
      <Pop at={3} dx={-40} dy={0} style={{position: "absolute", left: 1150, top: 500}}>
        <div style={{fontFamily: disp, fontWeight: 600, fontSize: 42, color: "#fff", lineHeight: 1.1}}>и жди<br />переход —</div>
      </Pop>
    </BgDark>
  );
};

/* 18. ВЫ, БЛ*ДЬ, ИЗДЕВАЕТЕСЬ? */
export const Izdev: React.FC<SP> = ({v, ve}) => {
  const f = useCurrentFrame();
  const len = ve[0] - v[0];
  return (
    <BgLight>
      <div style={{position: "absolute", left: 1150, top: 160, transform: `scale(${lerp(p(f, 2, 14, back), 0, 1)})`}}>
        <Burst size={720} rot={f * 1.5} points={18} inner={0.7} />
      </div>
      <AbsoluteFill style={left(170)}>
        <Letters text="ВЫ, БЛ*ДЬ," size={150} color={K.ink} stagger={1} />
        <Letters text="ИЗДЕВАЕТЕСЬ?" size={150} color={K.ink} at={v[0] + len * 0.35} from="blur" stagger={1.2} style={{marginTop: 20}} />
      </AbsoluteFill>
    </BgLight>
  );
};

/* 19. ПРЕДСТАВЬ. как это делают обычно */
export const Predst: React.FC<SP> = ({v, ve}) => {
  const f = useCurrentFrame();
  const sub = "как это делают обычно";
  const n = Math.round(interpolate(f, [v[0] + (ve[0] - v[0]) * 0.35, ve[0]], [0, sub.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  return (
    <BgDark>
      <AbsoluteFill style={left(200)}>
        <div style={{display: "flex"}}>
          <Letters text="ПРЕДСТАВЬ" size={190} stagger={1.3} />
          <Letters text="." size={190} color={K.red} at={14} from="scale" />
        </div>
        <div style={{fontFamily: disp, fontWeight: 600, fontSize: 56, color: "#fff", marginTop: 40}}>{sub.slice(0, n)}</div>
      </AbsoluteFill>
    </BgDark>
  );
};

/* 20. Слои → ключевые кадры → граф-эдитор */
export const Sloi: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const len = ve[0] - v[0];
  const ph = f < v[0] + len * 0.3 ? 0 : f < v[0] + len * 0.72 ? 1 : 2;
  const phStart = [0, v[0] + len * 0.3, v[0] + len * 0.72][ph];
  const labels = ["СЛОИ", "КЛЮЧЕВЫЕ\nКАДРЫ", "ГРАФ-\nЭДИТОР"];
  const rows = ["Text 1", "Shape 2", "Camera", "Null 4", "Adj. 5"];
  const curve = p(f, phStart, 14);
  return (
    <BgDark>
      <Pop at={0} dx={-80} dy={0} style={{position: "absolute", left: 140, top: 200}}>
        <div style={{width: 900, height: 640, borderRadius: 20, background: "#141020", border: "2px solid #2E2840", padding: 36, position: "relative"}}>
          {rows.map((r, i) => (
            <div key={r} style={{display: "flex", alignItems: "center", height: 70, opacity: ph === 2 ? 0.25 : 1}}>
              <div style={{fontFamily: mono, color: "#C9C6DA", fontSize: 24, width: 160}}>{r}</div>
              <div style={{position: "relative", flex: 1, height: 26}}>
                <div style={{position: "absolute", left: (i * 53) % 140, height: 26, borderRadius: 6, background: K.red, width: interpolate(f, [3 + i * 3, 16 + i * 3], [0, 420 + ((i * 89) % 160)], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}} />
                {ph >= 1 &&
                  [0, 1, 2].map((k) => (
                    <div key={k} style={{position: "absolute", left: (i * 53) % 140 + 40 + k * 170, top: -4, width: 30, height: 30, background: "#fff", transform: `rotate(45deg) scale(${p(f, phStart + i * 2 + k * 2, 8, back)})`}} />
                  ))}
              </div>
            </div>
          ))}
          {ph === 2 && (
            <svg width={900} height={640} style={{position: "absolute", left: 0, top: 0}}>
              <path d="M 80 560 C 360 560, 420 120, 820 110" fill="none" stroke={K.red} strokeWidth={8} strokeDasharray={1000} strokeDashoffset={1000 * (1 - curve)} />
              <circle cx={80} cy={560} r={14} fill="#fff" />
              <circle cx={820} cy={110} r={14} fill="#fff" opacity={curve} />
            </svg>
          )}
        </div>
      </Pop>
      <AbsoluteFill style={{paddingLeft: 1130, justifyContent: "center"}}>
        <Letters key={ph} text={labels[ph].split("\n")[0]} size={110} at={phStart} stagger={1} />
        {labels[ph].includes("\n") && <Letters key={ph + "b"} text={labels[ph].split("\n")[1]} size={110} at={phStart + 3} stagger={1} />}
      </AbsoluteFill>
    </BgDark>
  );
};

/* 21. И РЕНДЕР. (прогресс еле ползёт) */
export const Render: React.FC<SP> = ({d}) => {
  const f = useCurrentFrame();
  return (
    <BgLight>
      <AbsoluteFill style={left(130)}>
        <div style={{display: "flex"}}>
          <Letters text="И РЕНДЕР" size={250} color={K.ink} stagger={1} />
          <Letters text="." size={250} color={K.red} at={9} from="scale" />
        </div>
        <Pop at={6}>
          <div style={{width: 1600, height: 12, borderRadius: 8, background: "rgba(0,0,0,0.1)", marginTop: 50}}>
            <div style={{width: `${1 + f * 0.08}%`, height: 12, borderRadius: 8, background: K.ink}} />
          </div>
          <div style={{fontFamily: mono, fontSize: 30, color: "#4A5568", marginTop: 20}}>рендер 2% · осталось 4 ч 12 мин</div>
        </Pop>
      </AbsoluteFill>
    </BgLight>
  );
};

/* 22. ЗДЕСЬ? */
export const Zdes: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const t = p(f, 0, 9, back);
  return (
    <BgRed>
      <AbsoluteFill style={center}>
        <H size={300} color="#E6F3FB" style={{transform: `rotate(-7deg) scale(${lerp(t, 2.2, 1)})`, textShadow: "12px 12px 0 rgba(120,0,20,0.35)"}}>ЗДЕСЬ?</H>
      </AbsoluteFill>
    </BgRed>
  );
};

/* 23. CLAUDE → ПРОМПТ → КОД → РЕНДЕР */
export const Chain: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const words = ["CLAUDE", "ПРОМПТ", "КОД", "РЕНДЕР"];
  const len = ve[0] - v[0];
  const k = Math.min(3, Math.max(0, Math.floor(((f - v[0]) / len) * 4)));
  const ks = v[0] + (len / 4) * k;
  const g = 1 - p(f, ks, 6);
  return (
    <BgDark>
      <AbsoluteFill style={{...center, flexDirection: "column"}}>
        <div style={{display: "flex", alignItems: "center", gap: 30, filter: `blur(${g * 14}px)`, transform: `scaleX(${1 + g * 0.5})`, opacity: 1 - g * 0.6}}>
          <H size={60} color={K.red}>›</H>
          <H size={210}>{words[k]}</H>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 18, marginTop: 70}}>
          {words.map((w, i) => (
            <React.Fragment key={w}>
              <div style={{fontFamily: disp, fontWeight: 800, fontSize: 26, padding: "14px 34px", borderRadius: 40, color: "#fff", background: i <= k ? K.red : "transparent", border: `3px solid ${i <= k ? K.red : "#5B566E"}`, boxShadow: i === k ? "0 0 40px rgba(242,33,74,0.7)" : "none"}}>{w}</div>
              {i < 3 && <div style={{width: 40, height: 3, background: "#5B566E"}} />}
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>
    </BgDark>
  );
};

/* 24. ЭТО ВИДЕО? */
export const Video: React.FC<SP> = ({d}) => {
  const f = useCurrentFrame();
  const fr = p(f, 0, 10);
  return (
    <BgDark>
      <AbsoluteFill style={center}>
        <div style={{width: lerp(fr, 600, 1300), height: lerp(fr, 340, 640), border: "4px solid rgba(255,255,255,0.7)", borderRadius: 24, position: "relative", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div style={{position: "absolute", width: 0, height: 0, borderTop: "90px solid transparent", borderBottom: "90px solid transparent", borderLeft: `150px solid ${K.red}`, transform: `scale(${p(f, 6, 10, back)})`, left: "47%"}} />
          <Letters text="ЭТО ВИДЕО?" size={140} at={5} stagger={1} style={{position: "relative"}} />
          <div style={{position: "absolute", left: 40, right: 40, bottom: 40, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 4}}>
            <div style={{width: `${p(f, 0, d) * 100}%`, height: 6, background: K.red, borderRadius: 4}} />
          </div>
        </div>
      </AbsoluteFill>
    </BgDark>
  );
};

/* 25. ДА. */
export const Da: React.FC<SP> = () => {
  const f = useCurrentFrame();
  const t = p(f, 0, 8, back);
  return (
    <BgLight>
      <AbsoluteFill style={center}>
        <div style={{display: "flex", transform: `scale(${lerp(t, 2.4, 1)})`}}>
          <H size={420} color={K.ink}>ДА</H>
          <H size={420} color={K.ink}>.</H>
        </div>
      </AbsoluteFill>
    </BgLight>
  );
};

/* 26. ОТ ПЕРВОЙ ИДЕИ — линия — ДО ПОСЛЕДНЕГО КАДРА */
export const Ot: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const t = p(f, 4, d - 6);
  return (
    <BgDark>
      <div style={{position: "absolute", left: 140, top: 200}}>
        <Letters text="ОТ ПЕРВОЙ ИДЕИ" size={90} stagger={0.8} />
      </div>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <circle cx={170} cy={400} r={16} fill="#fff" />
        <path d="M 170 400 C 600 420, 900 560, 1720 690" fill="none" stroke={K.red} strokeWidth={7} strokeDasharray={1700} strokeDashoffset={1700 * (1 - t)} />
      </svg>
      <div style={{position: "absolute", right: 140, top: 760}}>
        <Letters text="ДО ПОСЛЕДНЕГО КАДРА" size={90} at={v[0] + (ve[0] - v[0]) * 0.45} stagger={0.7} from="blur" />
      </div>
    </BgDark>
  );
};

/* 27. СДЕЛАНО ОДНИМ ПРОМПТОМ. */
export const Odnim: React.FC<SP> = ({v, ve}) => (
  <BgRed>
    <Rays color="rgba(255,255,255,0.35)" spin={0.4} />
    <AbsoluteFill style={left(200)}>
      <Letters text="СДЕЛАНО" size={40} spacing={0.2} />
      <Letters text="ОДНИМ" size={230} at={2} from="scale" stagger={1.2} style={{marginTop: 10}} />
      <Letters text="ПРОМПТОМ." size={170} at={v[0] + (ve[0] - v[0]) * 0.45} from="blur" stagger={1} />
    </AbsoluteFill>
  </BgRed>
);

/* 28. ОХ*Е-Е-ЕТЬ! */
export const Oh: React.FC<SP> = ({d}) => {
  const f = useCurrentFrame();
  const sh = (1 - p(f, 0, d)) * 14;
  const out = p(f, d - 6, 6);
  return (
    <AbsoluteFill>
      <BgRed>
        <AbsoluteFill style={center}>
          <H size={190} style={{transform: `translate(${Math.sin(f * 2.3) * sh}px, ${Math.cos(f * 1.7) * sh}px) scale(${lerp(p(f, 0, 8, back), 1.8, 1)})`}}>ОХ*Е-Е-ЕТЬ!</H>
        </AbsoluteFill>
      </BgRed>
      <AbsoluteFill style={{background: K.dark, opacity: out}} />
    </AbsoluteFill>
  );
};

/* 29. КАК ПОВТОРИТЬ? */
export const Kak: React.FC<SP> = () => (
  <BgDark>
    <AbsoluteFill style={{...center, flexDirection: "column"}}>
      <Letters text="КАК" size={200} stagger={1.5} />
      <Letters text="ПОВТОРИТЬ?" size={200} color={K.red} at={5} from="blur" stagger={1} />
    </AbsoluteFill>
  </BgDark>
);

/* 30. 4 шага в терминале */
const Hl: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{background: K.red, padding: "0 5px", borderRadius: 3}}>{children}</span>;
export const Steps: React.FC<SP> = ({d, v}) => {
  const f = useCurrentFrame();
  const step = v.filter((x) => f >= x).length; // 1..4
  const s = Math.max(1, step);
  const at = v[s - 1] ?? 0;
  const titles: React.ReactNode[] = [
    <>ОТКРОЙ<br /><span style={{color: K.red}}>CLAUDE CODE</span></>,
    <>ПОДКЛЮЧИ<br />НАВЫК<br /><span style={{color: K.red}}>HYPERFRAMES</span></>,
    <>ВСТАВЬ<br /><span style={{color: K.red}}>ПРОМПТ</span></>,
    <>ЖМИ <span style={{color: K.red}}>ENTER</span> —<br />ЗАБИРАЙ<br />ВИДЕО</>,
  ];
  const renderP = Math.min(100, Math.round(p(f, v[3] + 6, d - v[3] - 14) * 100));
  const line = (show: boolean, at0: number, node: React.ReactNode) => (show ? <Pop at={at0} dy={20} len={8}>{node}</Pop> : null);
  return (
    <BgDark>
      <div style={{position: "absolute", left: 100, right: 100, top: 70, display: "flex", gap: 16}}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{flex: 1, height: 8, borderRadius: 4, background: "#2A2538"}}>
            <div style={{height: 8, borderRadius: 4, background: K.red, width: `${i < s ? 100 : i === s ? p(f, at, 12) * 100 : 0}%`}} />
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 100, top: 110, fontFamily: mono, fontSize: 24, color: K.grey, letterSpacing: "0.15em"}}>ШАГ {s} / 4</div>
      <div style={{position: "absolute", left: 100, top: 180, width: 1000, height: 800, borderRadius: 20, background: "#120E1C", border: "2px solid #2E2840", overflow: "hidden"}}>
        <div style={{height: 50, background: "#1C1729", display: "flex", alignItems: "center", gap: 10, paddingLeft: 20}}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 9, background: c}} />)}
          <div style={{fontFamily: mono, color: K.grey, fontSize: 18, marginLeft: 16}}>~/reels — claude</div>
        </div>
        <div style={{padding: "30px 36px", fontFamily: mono, fontSize: 26, color: "#E8E6F0", display: "flex", flexDirection: "column", gap: 22}}>
          <div>$ claude</div>
          {line(true, v[0] + 4, <div style={{border: `2px solid ${K.red}`, borderRadius: 10, padding: "16px 22px"}}><span style={{color: K.red}}>✻</span> Welcome to Claude Code<div style={{color: K.grey, fontSize: 20, marginTop: 6}}>/help · cwd: ~/reels</div></div>)}
          {line(s >= 2, v[1], <div style={{border: "2px solid #3A3450", borderRadius: 10, padding: "12px 22px"}}>&gt; /hyperframes</div>)}
          {line(s >= 2, v[1] + 10, <div style={{color: "#7BE0A0", fontSize: 22}}>✓ навык HyperFrames подключён</div>)}
          {line(s >= 3, v[2], <div style={{border: "2px solid #3A3450", borderRadius: 10, padding: "14px 22px", lineHeight: 1.6, fontSize: 22}}>&gt; Сделай <Hl>15-секундную</Hl> кинематографичную анимацию: <Hl>кинетическая</Hl> <Hl>типографика</Hl>, <Hl>морфинг</Hl> <Hl>форм</Hl>, <Hl>3D</Hl>, <Hl>плавная</Hl> <Hl>камера</Hl></div>)}
          {line(s >= 4, v[3] + 4, <div><div style={{fontSize: 22}}><span style={{color: K.red}}>●</span> Рендерю кадры… {renderP}%</div><div style={{height: 8, background: "#2A2538", borderRadius: 4, marginTop: 12}}><div style={{width: `${renderP}%`, height: 8, background: K.red, borderRadius: 4}} /></div></div>)}
        </div>
      </div>
      <div style={{position: "absolute", left: 1200, top: 260, width: 640}}>
        <Pop key={s} at={at} dx={60} dy={0}>
          <H size={70} style={{lineHeight: 1.1, whiteSpace: "normal"}}>{titles[s - 1]}</H>
        </Pop>
        {s === 4 && (
          <Pop at={at + 14} dy={30}>
            <div style={{marginTop: 50, display: "flex", alignItems: "center", gap: 22, background: "#E8F3FA", borderRadius: 18, padding: "20px 26px", width: 520}}>
              <div style={{width: 70, height: 70, borderRadius: 12, background: K.red, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 34}}>▶</div>
              <div style={{fontFamily: mono, fontSize: 28, color: K.ink}}>reel.mp4<div style={{fontSize: 18, color: "#667"}}>15 с · 1080p</div></div>
            </div>
          </Pop>
        )}
        {s === 4 && (
          <Pop at={at + 4} dy={0}>
            <div style={{marginTop: 30, display: "inline-block", fontFamily: mono, fontWeight: 700, fontSize: 28, color: K.ink, background: "#fff", borderRadius: 12, padding: "14px 30px", boxShadow: "0 6px 0 #9DB3C4", transform: `translateY(${Math.sin(p(f, at + 10, 6) * Math.PI) * 6}px)`}}>⏎ ENTER</div>
          </Pop>
        )}
      </div>
    </BgDark>
  );
};

/* 31. ЭТО РАЗРЫВ ДЛЯ МОНТАЖА */
export const Razryv: React.FC<SP> = ({v, ve}) => {
  const len = ve[0] - v[0];
  const words: [string, string][] = [["ЭТО", K.white], ["РАЗРЫВ", K.white], ["ДЛЯ", K.white], ["МОНТАЖА", K.red]];
  const at = [0, v[0] + len * 0.2, v[0] + len * 0.5, v[0] + len * 0.65];
  return (
    <BgDark>
      <div style={{position: "absolute", left: 200, top: 200}}>
        {words.map(([w, c], i) => <Letters key={w} text={w} size={120} color={c} at={at[i]} stagger={0.8} from="blur" style={{marginBottom: 8}} />)}
      </div>
    </BgDark>
  );
};

/* 32. ХОЧЕШЬ ТАК ЖЕ? + комментарий «клод» */
export const Hochesh: React.FC<SP> = ({d, v, ve}) => {
  const f = useCurrentFrame();
  const len = ve[0] - v[0];
  const typeA = v[0] + len * 0.3;
  const word = "клод";
  const n = Math.round(interpolate(f, [typeA, typeA + 14], [0, word.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const zoom = lerp(p(f, ve[0], d - ve[0]), 1, 1.06);
  return (
    <BgDark>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <div style={{position: "absolute", left: 150, top: 220}}>
          <Letters text="ХОЧЕШЬ" size={130} stagger={1} />
          <Letters text="ТАК ЖЕ?" size={130} color={K.red} at={5} stagger={1} from="blur" />
        </div>
        <Pop at={8} dx={80} dy={0} style={{position: "absolute", left: 1080, top: 200}}>
          <div style={{width: 680, borderRadius: 26, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)", padding: "34px 36px"}}>
            {["#C9C6DA", "#E58FA6", "#8FB7E5"].map((c, i) => (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 20, marginBottom: 24}}>
                <div style={{width: 40, height: 40, borderRadius: 20, background: c}} />
                <div style={{height: 14, borderRadius: 7, background: "rgba(255,255,255,0.22)", width: 380 - i * 60}} />
              </div>
            ))}
            <div style={{marginTop: 10, height: 78, borderRadius: 40, background: "#E8F3FA", display: "flex", alignItems: "center", padding: "0 12px 0 30px"}}>
              <div style={{flex: 1, fontFamily: disp, fontWeight: 800, fontSize: 34, color: n ? K.ink : "#99A"}}>
                {n ? word.slice(0, n) : <span style={{fontSize: 24, fontWeight: 600}}>Добавьте комментарий…</span>}
              </div>
              <div style={{width: 56, height: 56, borderRadius: 30, background: K.red, transform: `scale(${1 + 0.2 * Math.sin(p(f, typeA + 16, 8) * Math.PI)})`}} />
            </div>
          </div>
        </Pop>
        <div style={{position: "absolute", left: 150, top: 760, display: "flex", gap: 22}}>
          {[["ПРИШЛЮ", K.white], ["ПРОМПТ", K.red], ["И", K.white], ["ИНСТРУКЦИЮ", K.white]].map(([w, c], i) => (
            <Pop key={w} at={v[0] + len * 0.6 + i * 3} dy={30}>
              <H size={66} color={c}>{w}</H>
            </Pop>
          ))}
        </div>
      </AbsoluteFill>
    </BgDark>
  );
};
