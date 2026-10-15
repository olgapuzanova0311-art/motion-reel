import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import dur from "./durations.json";
import * as S from "./scenes";

const FPS = 30;
const D = dur as Record<string, number>;

type Scene = {C: React.FC<S.SP>; voices: string[]; pre?: number; tail?: number; min?: number; gap?: number};

// Порядок сцен 1 в 1 как в оригинальном рилсе
const SCENES: Scene[] = [
  {C: S.Intro, voices: [], tail: 0, min: 0.01}, // красный экран на 1 кадр
  {C: S.DaNu, voices: ["danu"], tail: 0.15, min: 1.1},
  {C: S.Okey, voices: ["okey"], pre: 0.05, tail: 0.2, min: 0.9},
  {C: S.Verite, voices: ["verite"], tail: 0.05},
  {C: S.Radi, voices: ["radi"], tail: 0.1},
  {C: S.Srazu, voices: ["srazu"], pre: 0.05, tail: 0.15},
  {C: S.Shablon, voices: ["shablon"], tail: 0.15},
  {C: S.Claude, voices: ["claude"], pre: 0.1, tail: 0.1, min: 1.1},
  {C: S.Pishesh, voices: ["pishesh"], tail: 0.25},
  {C: S.Prevr, voices: ["prevr"], pre: 0.15, tail: 0.15},
  {C: S.Vse, voices: ["vse"], tail: 0.15, min: 0.7},
  {C: S.Nuzhno, voices: ["nuzhno"], tail: 0.1},
  {C: S.Prompt, voices: ["prompt"], pre: 0.1, tail: 0.3},
  {C: S.Smotri, voices: ["smotri"], tail: 0.15},
  {C: S.Bukvy, voices: ["bukvy"], tail: 0.2},
  {C: S.Kamera, voices: ["kamera"], tail: 0.25},
  {C: S.Perehod, voices: [], min: 0.6},
  {C: S.Izdev, voices: ["izdev"], tail: 0.15},
  {C: S.Predst, voices: ["predst"], tail: 0.1},
  {C: S.Sloi, voices: ["sloi"], tail: 0.05},
  {C: S.Render, voices: ["render"], tail: 0.4},
  {C: S.Zdes, voices: ["zdes"], tail: 0.15, min: 0.7},
  {C: S.Chain, voices: ["chain"], tail: 0.15},
  {C: S.Video, voices: ["video"], pre: 0.1, tail: 0.15},
  {C: S.Da, voices: ["da"], tail: 0.25, min: 0.7},
  {C: S.Ot, voices: ["ot"], tail: 0.05},
  {C: S.Odnim, voices: ["odnim"], tail: 0.25},
  {C: S.Oh, voices: ["oh"], tail: 0.3, min: 1.1},
  {C: S.Kak, voices: ["kak"], tail: 0.1},
  {C: S.Steps, voices: ["s1", "s2", "s3", "s4"], gap: 0.25, tail: 0.8},
  {C: S.Razryv, voices: ["razryv"], tail: 0.2},
  {C: S.Hochesh, voices: ["hochesh"], tail: 1.0},
];

// SPEED сжимает паузы между сценами
const SPEED = 1; // 1 для синтеза; 1.3 если свой голос ускорен в cut_voice.py
const f = (s: number) => Math.max(1, Math.round(s * FPS));
const k = (s: number) => s / SPEED;

type Placed = {C: React.FC<S.SP>; from: number; d: number; v: number[]; ve: number[]; voices: string[]};
const build = () => {
  let t = 0;
  const out: Placed[] = [];
  for (const sc of SCENES) {
    const v: number[] = [];
    const ve: number[] = [];
    let cur = k(sc.pre ?? 0);
    sc.voices.forEach((id, i) => {
      if (i > 0) cur += k(sc.gap ?? 0.2);
      v.push(f(cur));
      cur += D[id];
      ve.push(f(cur));
    });
    const len = Math.max(cur + k(sc.tail ?? 0.2), k(sc.min ?? 0));
    const d = f(len);
    out.push({C: sc.C, from: t, d, v, ve, voices: sc.voices});
    t += d;
  }
  return {scenes: out, total: t};
};
const PLAN = build();
export const REEL_DURATION = PLAN.total;

export const Reel: React.FC = () => (
  <AbsoluteFill style={{background: "#0D0A15"}}>
    {PLAN.scenes.map(({C, from, d, v, ve, voices}, i) => (
      <Sequence key={i} from={from} durationInFrames={d}>
        <C d={d} v={v} ve={ve} />
        {voices.map((id, k) => (
          <Sequence key={id} from={v[k]} layout="none">
            <Audio src={staticFile(`reel/${id}.wav`)} />
          </Sequence>
        ))}
      </Sequence>
    ))}
  </AbsoluteFill>
);
