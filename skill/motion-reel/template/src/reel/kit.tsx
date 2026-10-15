import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {loadFont as loadUnbounded} from "@remotion/google-fonts/Unbounded";
import {loadFont as loadMono} from "@remotion/google-fonts/JetBrainsMono";

export const disp = loadUnbounded("normal", {weights: ["600", "800", "900"], subsets: ["cyrillic", "latin"]}).fontFamily;
export const mono = loadMono("normal", {weights: ["500", "700"], subsets: ["cyrillic", "latin"]}).fontFamily;

export const K = {
  red: "#F2214A",
  redDeep: "#C8102E",
  dark: "#0D0A15",
  ink: "#0B0B12",
  white: "#FFFFFF",
  light: "#CFE7F5",
  grey: "#8C8A99",
};

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const back = Easing.bezier(0.34, 1.7, 0.64, 1);
const cl = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** 0→1 from frame `a` over `len` frames */
export const p = (f: number, a: number, len: number, e = ease) => interpolate(f, [a, a + len], [0, 1], {...cl, easing: e});
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/* ---------- backgrounds ---------- */

export const BgLight: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: "radial-gradient(ellipse 70% 75% at 50% 48%, #FFFFFF 0%, #E4F2FA 40%, #BFDDF0 100%)"}}>
    {children}
  </AbsoluteFill>
);

export const BgRed: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: "radial-gradient(ellipse 80% 80% at 50% 50%, #FF3A5F 0%, #F2214A 45%, #C8102E 100%)"}}>
    {children}
  </AbsoluteFill>
);

export const BgDark: React.FC<{children?: React.ReactNode; grid?: boolean; glow?: boolean}> = ({children, grid = true, glow = true}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: K.dark, overflow: "hidden"}}>
      {glow && (
        <AbsoluteFill style={{background: "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(242,33,74,0.28) 0%, rgba(242,33,74,0) 70%)"}} />
      )}
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            backgroundPosition: `${-f * 0.6}px ${-f * 0.3}px`,
          }}
        />
      )}
      <Stars />
      {children}
    </AbsoluteFill>
  );
};

const STARS = Array.from({length: 40}, (_, i) => ({
  x: (i * 937) % 1920,
  y: (i * 571) % 1080,
  r: 1 + ((i * 7) % 3),
  ph: i * 0.7,
}));
const Stars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: 9,
            background: "#fff",
            opacity: 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(f / 12 + s.ph)),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** радиальные лучи из центра (взрыв, фон «смотри», «одним промптом») */
export const Rays: React.FC<{color?: string; n?: number; spin?: number; opacity?: number; burst?: number}> = ({
  color = "rgba(255,255,255,0.35)",
  n = 36,
  spin = 0.15,
  opacity = 1,
  burst = 1,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={1920} height={1080} viewBox="-960 -540 1920 1080">
        <g transform={`rotate(${f * spin})`}>
          {Array.from({length: n}, (_, i) => {
            const a = (i / n) * Math.PI * 2 + ((i * 13) % 7) * 0.03;
            const r0 = 60 + ((i * 37) % 120);
            const r1 = (500 + ((i * 53) % 700)) * burst;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r0}
                y1={Math.sin(a) * r0}
                x2={Math.cos(a) * r1}
                y2={Math.sin(a) * r1}
                stroke={color}
                strokeWidth={1 + (i % 3)}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** заголовок, буквы которого вылетают по очереди */
export const Letters: React.FC<{
  text: string;
  at?: number;
  stagger?: number;
  size: number;
  color?: string;
  style?: React.CSSProperties;
  from?: "up" | "blur" | "scale";
  spacing?: number;
}> = ({text, at = 0, stagger = 1.5, size, color = K.white, style, from = "up", spacing = -0.02}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: disp, fontWeight: 900, fontSize: size, lineHeight: 0.95, color, letterSpacing: `${spacing}em`, whiteSpace: "pre", ...style}}>
      {[...text].map((ch, i) => {
        const t = p(f, at + i * stagger, 10);
        const tb = p(f, at + i * stagger, 12, back);
        const tr =
          from === "up"
            ? `translateY(${lerp(t, 0.6, 0) * size}px)`
            : from === "scale"
              ? `scale(${lerp(tb, 2.2, 1)})`
              : `translateX(${lerp(t, 0.4, 0) * size}px)`;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: tr,
              opacity: t,
              filter: `blur(${lerp(t, from === "blur" ? 18 : 8, 0)}px)`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};

/** блок, который «влетает» с размытием */
export const Pop: React.FC<{at?: number; children: React.ReactNode; style?: React.CSSProperties; dx?: number; dy?: number; s0?: number; len?: number}> = ({
  at = 0,
  children,
  style,
  dx = 0,
  dy = 40,
  s0 = 1,
  len = 12,
}) => {
  const f = useCurrentFrame();
  const t = p(f, at, len);
  const tb = p(f, at, len + 2, back);
  return (
    <div
      style={{
        opacity: t,
        transform: `translate(${lerp(t, dx, 0)}px, ${lerp(t, dy, 0)}px) scale(${lerp(tb, s0, 1)})`,
        filter: `blur(${lerp(t, 14, 0)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const H: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = K.white, children, style}) => (
  <div style={{fontFamily: disp, fontWeight: 900, fontSize: size, lineHeight: 0.95, color, letterSpacing: "-0.02em", whiteSpace: "pre", ...style}}>{children}</div>
);

/** короткий «вход» сцены: лёгкий зум и размытие в первые кадры */
export const Enter: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const t = p(f, 0, 8);
  return <AbsoluteFill style={{transform: `scale(${lerp(t, 1.06, 1)})`, filter: `blur(${lerp(t, 10, 0)}px)`}}>{children}</AbsoluteFill>;
};

/** колючая звезда (лого Claude и «бабах») */
export const Burst: React.FC<{size: number; color?: string; points?: number; inner?: number; rot?: number}> = ({size, color = K.red, points = 16, inner = 0.72, rot = 0}) => {
  const pts = Array.from({length: points * 2}, (_, i) => {
    const r = i % 2 ? inner : 1;
    const a = (i / (points * 2)) * Math.PI * 2;
    return `${50 + Math.cos(a) * 50 * r},${50 + Math.sin(a) * 50 * r}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${rot}deg)`}}>
      <polygon points={pts} fill={color} />
    </svg>
  );
};

/** лого Claude: лучи-«звёздочка» */
export const ClaudeMark: React.FC<{size: number; rot?: number}> = ({size, rot = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${rot}deg)`}}>
    {Array.from({length: 12}, (_, i) => {
      const a = (i / 12) * 360 + (i % 2 ? 8 : 0);
      const len = i % 3 === 0 ? 48 : i % 3 === 1 ? 40 : 44;
      return <rect key={i} x={-4} y={-len} width={8} height={len - 6} rx={4} fill={K.red} transform={`rotate(${a})`} />;
    })}
  </svg>
);
