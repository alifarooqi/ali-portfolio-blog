"use client";

import { useEffect, useRef } from "react";
import "./ShaderBackground.scss";

/**
 * Full-viewport WebGL2 gradient-mesh background.
 *
 * Renders a single fragment shader that paints a slow-moving, mouse-reactive
 * gradient. Color palette swaps between light and dark themes by observing the
 * `.dark` class on <html>. The committed `.webp` backgrounds remain visible as
 * a CSS fallback layer behind the canvas — if WebGL is unavailable or the
 * context is lost, the canvas stays transparent and the fallback shows through.
 *
 * Honors prefers-reduced-motion by skipping the RAF loop (shader draws a single
 * static frame).
 */

type Uniforms = {
  uTime: WebGLUniformLocation | null;
  uMouse: WebGLUniformLocation | null;
  uScroll: WebGLUniformLocation | null;
  uResolution: WebGLUniformLocation | null;
  uColorA: WebGLUniformLocation | null;
  uColorB: WebGLUniformLocation | null;
  uColorC: WebGLUniformLocation | null;
  uColorD: WebGLUniformLocation | null;
};

const PALETTE = {
  light: {
    a: [0.96, 0.97, 0.99], // #f5f7fb-ish
    b: [0.83, 0.9, 1.0], // soft cyan
    c: [0.55, 0.78, 1.0], // brand-blue tint
    d: [0.13, 0.9, 0.9], // brand-cyan-light
  },
  dark: {
    a: [0.04, 0.05, 0.08], // near-black blue
    b: [0.06, 0.12, 0.25],
    c: [0.12, 0.32, 0.62], // brand-blue tint
    d: [0.05, 0.55, 0.65], // muted cyan
  },
} as const;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uScroll;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;

// 2D simplex noise — Ashima/Stefan Gustavson.
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// FBM layered noise for softer fields.
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv;
  // Correct aspect so noise fields don't stretch.
  p.x *= uResolution.x / uResolution.y;

  float t = uTime * 0.05;
  // Mouse parallax — small shift toward cursor.
  vec2 m = (uMouse - 0.5) * 0.6;
  p += m * 0.15;

  // Scroll nudges the field vertically.
  p.y += uScroll * 0.4;

  float n1 = fbm(p * 1.2 + vec2(t, -t * 0.7));
  float n2 = fbm(p * 1.8 - vec2(t * 0.6, t * 0.9) + n1 * 0.6);

  float mask1 = smoothstep(-0.2, 0.6, n1);
  float mask2 = smoothstep(0.0, 0.8, n2);
  float mask3 = smoothstep(0.2, 0.5, (n1 + n2) * 0.5);

  vec3 col = mix(uColorA, uColorB, mask1);
  col = mix(col, uColorC, mask2 * 0.85);
  col = mix(col, uColorD, mask3 * 0.4);

  // Subtle vignette to keep content readable.
  float d = distance(uv, vec2(0.5));
  col *= smoothstep(1.05, 0.2, d);

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main(){
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("ShaderBackground shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) {
      // WebGL2 unavailable — leave canvas transparent; CSS fallback shows through.
      return;
    }

    // --- Program setup ---
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("ShaderBackground program link failed:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Full-screen triangle — covers clip space without a quad.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uniforms: Uniforms = {
      uTime: gl.getUniformLocation(program, "uTime"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uScroll: gl.getUniformLocation(program, "uScroll"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uColorA: gl.getUniformLocation(program, "uColorA"),
      uColorB: gl.getUniformLocation(program, "uColorB"),
      uColorC: gl.getUniformLocation(program, "uColorC"),
      uColorD: gl.getUniformLocation(program, "uColorD"),
    };

    // --- Theme detection ---
    const getPalette = () =>
      document.documentElement.classList.contains("dark") ? PALETTE.dark : PALETTE.light;
    const applyPalette = () => {
      const p = getPalette();
      gl.uniform3f(uniforms.uColorA, p.a[0], p.a[1], p.a[2]);
      gl.uniform3f(uniforms.uColorB, p.b[0], p.b[1], p.b[2]);
      gl.uniform3f(uniforms.uColorC, p.c[0], p.c[1], p.c[2]);
      gl.uniform3f(uniforms.uColorD, p.d[0], p.d[1], p.d[2]);
    };
    applyPalette();

    const themeObserver = new MutationObserver(applyPalette);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // --- Pointer + scroll state ---
    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
    let targetScroll = 0;
    let currentScroll = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1 - e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = Math.min(1, Math.max(0, window.scrollY / max));
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Resize ---
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uniforms.uResolution, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // --- Render loop ---
    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      // Ease mouse + scroll toward target for buttery follow.
      mouse.x += (targetMouse.x - mouse.x) * 0.06;
      mouse.y += (targetMouse.y - mouse.y) * 0.06;
      currentScroll += (targetScroll - currentScroll) * 0.08;

      const t = prefersReducedMotion ? 0 : (now - start) / 1000;
      gl.uniform1f(uniforms.uTime, t);
      gl.uniform2f(uniforms.uMouse, mouse.x, mouse.y);
      gl.uniform1f(uniforms.uScroll, currentScroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(render);
      }
    };
    raf = requestAnimationFrame(render);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="shader-background" aria-hidden="true">
      <div className="shader-background__fallback" />
      <canvas ref={canvasRef} className="shader-background__canvas" />
    </div>
  );
}
