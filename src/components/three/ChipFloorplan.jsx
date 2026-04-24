import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

const DARK = "#141418";
const DARK2 = "#1a1a20";
const CHARCOAL = "#2a2a32";
const TEAL = "#00e6c8";
const TEAL_DIM = "#0a7a68";
const GOLD = "#c4a24a";

/* ═══════ Instanced grid helper ═══════ */
function InstanceGrid({ positions, geometry, material }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useMemo(() => {
    if (!ref.current) return;
    positions.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      if (p[3]) dummy.scale.set(p[3], p[4] || p[3], p[5] || p[3]);
      else dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={ref} args={[null, null, positions.length]}>
      {geometry}
      {material}
    </instancedMesh>
  );
}

/* ═══════ BGA Solder Ball Array ═══════ */
function BGAArray({ width, depth, y, pitch = 0.28, radius = 0.048, depopCenter = 0 }) {
  const positions = useMemo(() => {
    const arr = [];
    const hw = width / 2 - 0.4;
    const hd = depth / 2 - 0.4;
    const cols = Math.floor((hw * 2) / pitch);
    const rows = Math.floor((hd * 2) / pitch);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = -hw + i * pitch;
        const z = -hd + j * pitch;
        // Depopulate center area (thermal pad zone)
        if (depopCenter > 0 && Math.abs(x) < depopCenter && Math.abs(z) < depopCenter) continue;
        arr.push([x, y, z]);
      }
    }
    return arr;
  }, [width, depth, y, pitch, depopCenter]);

  return (
    <InstanceGrid
      positions={positions}
      geometry={<sphereGeometry args={[radius, 8, 8]} />}
      material={<meshStandardMaterial color={GOLD} metalness={0.92} roughness={0.1} />}
    />
  );
}

/* ═══════ Structured Bus Lines (parallel, organized) ═══════ */
function BusLines({ width, depth, y, axis = "x", count = 12, offset = 0, span = 0.8, color = TEAL, emissiveI = 0.5 }) {
  const lines = useMemo(() => {
    const arr = [];
    const hw = width / 2 * span;
    const hd = depth / 2 * span;
    const spacing = (axis === "x" ? hd * 2 : hw * 2) / (count + 1);

    for (let i = 1; i <= count; i++) {
      if (axis === "x") {
        const z = -hd + i * spacing + offset;
        arr.push({ pos: [0, y, z], size: [hw * 2, 0.005, 0.018] });
      } else {
        const x = -hw + i * spacing + offset;
        arr.push({ pos: [x, y, 0], size: [0.018, 0.005, hd * 2] });
      }
    }
    return arr;
  }, [width, depth, y, axis, count, offset, span]);

  return (
    <group>
      {lines.map((l, i) => (
        <mesh key={i} position={l.pos}>
          <boxGeometry args={l.size} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissiveI} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════ Power Ring (around perimeter) ═══════ */
function PowerRing({ width, depth, y, inset = 0.15, thickness = 0.04, color = TEAL, emissiveI = 0.6 }) {
  const hw = width / 2 - inset;
  const hd = depth / 2 - inset;
  const h = 0.006;
  const mat = { color, emissive: color, emissiveIntensity: emissiveI, transparent: true, opacity: 0.8 };

  return (
    <group>
      {/* Top */}
      <mesh position={[0, y, -hd]}><boxGeometry args={[hw * 2, h, thickness]} /><meshStandardMaterial {...mat} /></mesh>
      {/* Bottom */}
      <mesh position={[0, y, hd]}><boxGeometry args={[hw * 2, h, thickness]} /><meshStandardMaterial {...mat} /></mesh>
      {/* Left */}
      <mesh position={[-hw, y, 0]}><boxGeometry args={[thickness, h, hd * 2]} /><meshStandardMaterial {...mat} /></mesh>
      {/* Right */}
      <mesh position={[hw, y, 0]}><boxGeometry args={[thickness, h, hd * 2]} /><meshStandardMaterial {...mat} /></mesh>
      {/* Inner ring (VDD) */}
      <mesh position={[0, y, -(hd - 0.08)]}><boxGeometry args={[(hw - 0.08) * 2, h, thickness * 0.6]} /><meshStandardMaterial {...mat} opacity={0.5} /></mesh>
      <mesh position={[0, y, (hd - 0.08)]}><boxGeometry args={[(hw - 0.08) * 2, h, thickness * 0.6]} /><meshStandardMaterial {...mat} opacity={0.5} /></mesh>
      <mesh position={[-(hw - 0.08), y, 0]}><boxGeometry args={[thickness * 0.6, h, (hd - 0.08) * 2]} /><meshStandardMaterial {...mat} opacity={0.5} /></mesh>
      <mesh position={[(hw - 0.08), y, 0]}><boxGeometry args={[thickness * 0.6, h, (hd - 0.08) * 2]} /><meshStandardMaterial {...mat} opacity={0.5} /></mesh>
    </group>
  );
}

/* ═══════ IO Pad Ring (tabs with bond wire pads) ═══════ */
function IOPadRing({ width, depth, y }) {
  const pads = useMemo(() => {
    const arr = [];
    const hw = width / 2;
    const hd = depth / 2;
    const padW = 0.15, padH = 0.13, tab = 0.24;

    for (let i = 0; i < 16; i++) {
      const x = -hw + 0.35 + (i / 15) * (width - 0.7);
      arr.push({ pos: [x, y + padH / 2, -hd - tab / 2 + 0.02], size: [padW, padH, tab] });
      arr.push({ pos: [x, y + padH / 2, hd + tab / 2 - 0.02], size: [padW, padH, tab] });
    }
    for (let i = 0; i < 12; i++) {
      const z = -hd + 0.45 + (i / 11) * (depth - 0.9);
      arr.push({ pos: [-hw - tab / 2 + 0.02, y + padH / 2, z], size: [tab, padH, padW] });
      arr.push({ pos: [hw + tab / 2 - 0.02, y + padH / 2, z], size: [tab, padH, padW] });
    }
    return arr;
  }, [width, depth, y]);

  return (
    <group>
      {pads.map((p, i) => (
        <group key={i}>
          <mesh position={p.pos}>
            <boxGeometry args={p.size} />
            <meshStandardMaterial color={CHARCOAL} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[p.pos[0], p.pos[1] + 0.068, p.pos[2]]}>
            <boxGeometry args={[p.size[0] * 0.55, 0.003, p.size[2] * 0.55]} />
            <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.4} transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════ Memory Array Block (regular grid pattern) ═══════ */
function MemoryBlock({ x, z, w, d, h }) {
  const cells = useMemo(() => {
    const arr = [];
    const cols = Math.floor(w / 0.12);
    const rows = Math.floor(d / 0.12);
    const cw = w / cols;
    const cd = d / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        arr.push([-w / 2 + cw * (i + 0.5), h + 0.004, -d / 2 + cd * (j + 0.5)]);
      }
    }
    return arr;
  }, [w, d, h]);

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[w, 0.03, d]} />
        <meshStandardMaterial color={DARK} metalness={0.3} roughness={0.65} />
      </mesh>
      {/* Regular memory cell grid on top */}
      {cells.map((c, i) => (
        <mesh key={i} position={c}>
          <boxGeometry args={[0.08, 0.003, 0.08]} />
          <meshStandardMaterial color={TEAL_DIM} emissive={TEAL} emissiveIntensity={0.2} transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Word lines (horizontal) */}
      <BusLines width={w} depth={d} y={h + 0.005} axis="x" count={Math.floor(d / 0.15)} span={0.92} color={TEAL_DIM} emissiveI={0.25} />
      {/* Top glow border */}
      <mesh position={[0, h + 0.002, 0]}>
        <boxGeometry args={[w - 0.01, 0.002, d - 0.01]} />
        <meshStandardMaterial color={TEAL_DIM} emissive={TEAL} emissiveIntensity={0.12} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ═══════ Logic Block (structured cell rows + routing channels) ═══════ */
function LogicBlock({ x, z, w, d, h, routingDensity = 10 }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[w, 0.03, d]} />
        <meshStandardMaterial color={DARK} metalness={0.3} roughness={0.65} />
      </mesh>
      {/* Standard cell rows (horizontal stripes) */}
      {Array.from({ length: Math.floor(d / 0.08) }, (_, i) => (
        <mesh key={`row${i}`} position={[0, h + 0.004, -d / 2 + 0.04 + i * 0.08]}>
          <boxGeometry args={[w * 0.9, 0.003, 0.03]} />
          <meshStandardMaterial color={TEAL_DIM} emissive={TEAL} emissiveIntensity={0.15} transparent opacity={0.3} />
        </mesh>
      ))}
      {/* Vertical routing channels */}
      <BusLines width={w} depth={d} y={h + 0.006} axis="z" count={routingDensity} span={0.88} color={TEAL_DIM} emissiveI={0.2} />
      {/* Power straps (thicker horizontal) */}
      {[0.25, 0.5, 0.75].map((frac, i) => (
        <mesh key={`pwr${i}`} position={[0, h + 0.005, -d / 2 + d * frac]}>
          <boxGeometry args={[w * 0.92, 0.004, 0.035]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.35} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Top glow border */}
      <mesh position={[0, h + 0.002, 0]}>
        <boxGeometry args={[w - 0.01, 0.002, d - 0.01]} />
        <meshStandardMaterial color={TEAL_DIM} emissive={TEAL} emissiveIntensity={0.12} transparent opacity={0.18} />
      </mesh>
      {/* Front face: cell row edges visible */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`fe${i}`} position={[0, 0.06 + i * (h / 5), -d / 2 + 0.001]}>
          <boxGeometry args={[w * 0.85, 0.008, 0.002]} />
          <meshStandardMaterial color={TEAL_DIM} emissive={TEAL} emissiveIntensity={0.15} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════ LAYER 0: Substrate ═══════ */
function SubstrateLayer({ y }) {
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[5.6, 0.22, 5.6]} />
        <meshStandardMaterial color={DARK} metalness={0.15} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.115, 0]}>
        <boxGeometry args={[5.55, 0.005, 5.55]} />
        <meshStandardMaterial color={DARK2} metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Organized power delivery: H + V bus lines */}
      <BusLines width={5.6} depth={5.6} y={0.118} axis="x" count={18} span={0.85} color={TEAL_DIM} emissiveI={0.6} />
      <BusLines width={5.6} depth={5.6} y={0.118} axis="z" count={18} span={0.85} color={TEAL_DIM} emissiveI={0.4} />
      {/* Power ring */}
      <PowerRing width={5.4} depth={5.4} y={0.119} />
      {/* BGA solder balls with depopulated center */}
      <BGAArray width={5.6} depth={5.6} y={0.12} pitch={0.28} radius={0.048} depopCenter={0.8} />
      {/* Thermal pad in center (where center is depopulated) */}
      <mesh position={[0, 0.115, 0]}>
        <boxGeometry args={[1.4, 0.008, 1.4]} />
        <meshStandardMaterial color="#8a7a40" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* IO Pads */}
      <IOPadRing width={5.6} depth={5.6} y={0.11} />
    </group>
  );
}

/* ═══════ LAYER 1: Interposer ═══════ */
function InterposerLayer({ y }) {
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[5.0, 0.14, 5.0]} />
        <meshStandardMaterial color={DARK} metalness={0.3} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[4.95, 0.004, 4.95]} />
        <meshStandardMaterial color={DARK2} metalness={0.25} roughness={0.6} />
      </mesh>
      {/* Redistribution layer: organized routing */}
      <BusLines width={5.0} depth={5.0} y={0.078} axis="x" count={22} span={0.88} color={TEAL_DIM} emissiveI={0.3} />
      <BusLines width={5.0} depth={5.0} y={0.078} axis="z" count={14} span={0.88} color={TEAL_DIM} emissiveI={0.2} />
      {/* Micro-bump array (tighter pitch) */}
      <BGAArray width={5.0} depth={5.0} y={0.078} pitch={0.2} radius={0.025} depopCenter={0} />
      {/* Power ring */}
      <PowerRing width={4.8} depth={4.8} y={0.079} thickness={0.03} emissiveI={0.35} />
    </group>
  );
}

/* ═══════ LAYER 2: Die with structured blocks ═══════ */
function DieSurface({ y }) {
  return (
    <group position={[0, y, 0]}>
      {/* Die base */}
      <mesh>
        <boxGeometry args={[4.4, 0.08, 4.4]} />
        <meshStandardMaterial color={DARK} metalness={0.25} roughness={0.7} />
      </mesh>

      {/* Power/ground mesh on die surface */}
      <BusLines width={4.4} depth={4.4} y={0.045} axis="x" count={10} span={0.9} color={TEAL_DIM} emissiveI={0.4} />
      <BusLines width={4.4} depth={4.4} y={0.045} axis="z" count={10} span={0.9} color={TEAL_DIM} emissiveI={0.3} />
      <PowerRing width={4.2} depth={4.2} y={0.046} thickness={0.035} emissiveI={0.5} />

      {/* ── Row 1: CPU (logic), Cache (memory), DSP (logic) ── */}
      <group position={[0, 0.04, 0]}>
        <LogicBlock  x={-1.35} z={-1.25} w={1.1} d={0.9} h={0.5} routingDensity={10} />
        <MemoryBlock  x={0.0}  z={-1.25} w={1.0} d={0.9} h={0.44} />
        <LogicBlock  x={1.25}  z={-1.25} w={0.9} d={0.9} h={0.52} routingDensity={8} />
      </group>

      {/* ── Row 2: SRAM (memory), NOC (logic), IO (logic) ── */}
      <group position={[0, 0.04, 0]}>
        <MemoryBlock  x={-1.35} z={0.0} w={1.1} d={0.9} h={0.46} />
        <LogicBlock  x={0.0}   z={0.0} w={1.0} d={0.9} h={0.4} routingDensity={12} />
        <LogicBlock  x={1.25}  z={0.0} w={0.9} d={0.9} h={0.48} routingDensity={9} />
      </group>

      {/* ── Row 3: PLL (logic), DMA (logic), PMU (logic) ── */}
      <group position={[0, 0.04, 0]}>
        <LogicBlock  x={-1.35} z={1.25} w={1.1} d={0.9} h={0.52} routingDensity={7} />
        <LogicBlock  x={0.0}   z={1.25} w={1.0} d={0.9} h={0.42} routingDensity={11} />
        <MemoryBlock  x={1.25}  z={1.25} w={0.9} d={0.9} h={0.5} />
      </group>

      {/* Routing channels between blocks (horizontal) */}
      {[-0.65, 0.65].map((z, i) => (
        <mesh key={`hch${i}`} position={[0, 0.046, z]}>
          <boxGeometry args={[4.0, 0.004, 0.06]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.5} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Routing channels between blocks (vertical) */}
      {[-0.7, 0.65].map((x, i) => (
        <mesh key={`vch${i}`} position={[x, 0.046, 0]}>
          <boxGeometry args={[0.06, 0.004, 4.0]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.5} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════ LAYER 3: Heat spreader / Lid ═══════ */
function LidLayer({ y }) {
  return (
    <group position={[0, y, 0]}>
      {/* Main lid body — taller to look like a real IC package */}
      <mesh>
        <boxGeometry args={[5.6, 0.35, 5.6]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.35} />
      </mesh>
      {/* Top surface — slightly lighter */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[5.55, 0.005, 5.55]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.45} roughness={0.35} />
      </mesh>
      {/* Die window (center marking on top of package) */}
      <mesh position={[0, 0.184, 0]}>
        <boxGeometry args={[2.8, 0.003, 2.8]} />
        <meshStandardMaterial color="#3a3a44" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Inner die shadow */}
      <mesh position={[0, 0.186, 0]}>
        <boxGeometry args={[2.0, 0.002, 2.0]} />
        <meshStandardMaterial color="#444450" metalness={0.35} roughness={0.5} />
      </mesh>
      {/* Top center label area (like real IC markings) */}
      <mesh position={[0, 0.187, -0.5]}>
        <boxGeometry args={[1.4, 0.002, 0.25]} />
        <meshStandardMaterial color="#333340" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.187, 0.3]}>
        <boxGeometry args={[0.8, 0.002, 0.15]} />
        <meshStandardMaterial color="#333340" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Alignment notch (pin 1 indicator) */}
      <mesh position={[-2.65, 0.184, -2.65]}>
        <boxGeometry args={[0.2, 0.004, 0.2]} />
        <meshStandardMaterial color={TEAL_DIM} emissive={TEAL} emissiveIntensity={0.15} transparent opacity={0.35} />
      </mesh>
      {/* Subtle edge bevel */}
      <mesh position={[0, -0.17, 0]}>
        <boxGeometry args={[5.62, 0.01, 5.62]} />
        <meshStandardMaterial color="#222228" metalness={0.45} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ═══════ Assembly ═══════ */
function ExplodedChip({ scrollProgress }) {
  const groupRef = useRef();
  const t = Math.max(0, Math.min(1, scrollProgress));
  const spread = t * t * (3 - 2 * t);

  // Internal layers only visible when opening
  const internalOpacity = Math.min(1, spread * 4); // fades in quickly
  const blockScale = Math.max(0.01, spread * 1.5); // blocks grow from nothing

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.45 + Math.sin(state.clock.elapsedTime * 0.03) * 0.008;
    }
  });

  const gap = spread * 1.5;

  return (
    <group ref={groupRef} rotation={[0, -0.45, 0]} position={[0, 0, 0]}>
      {/* Always visible: Substrate (bottom) */}
      <SubstrateLayer y={-2.0 * gap} />

      {/* Internal layers: fade in as it opens */}
      <group visible={spread > 0.02}>
        <group position={[0, 0, 0]} scale={[1, Math.max(0.01, blockScale), 1]}>
          <InterposerLayer y={-0.7 * gap / Math.max(0.01, blockScale)} />
        </group>
      </group>

      <group visible={spread > 0.05}>
        <group position={[0, 0, 0]} scale={[1, Math.max(0.01, blockScale), 1]}>
          <DieSurface y={0.6 * gap / Math.max(0.01, blockScale)} />
        </group>
      </group>

      {/* Always visible: Lid (top) — sits ON TOP when closed */}
      <LidLayer y={spread < 0.01 ? 0.25 : 2.0 * gap} />
    </group>
  );
}

/* ═══════ Export ═══════ */
export default function ChipFloorplan({ scrollProgress = 0, className = "" }) {
  const { isDark } = useTheme();

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [3, 3.5, 14], fov: 32 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isDark ? 1.3 : 0.95,
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={isDark ? 0.35 : 0.2} />
        <directionalLight position={[8, 14, 8]} intensity={isDark ? 2.0 : 1.0} />
        <directionalLight position={[-6, 8, -4]} intensity={isDark ? 0.15 : 0.12} color="#6688aa" />
        <pointLight position={[0, 6, 0]} intensity={isDark ? 0.8 : 0.2} color={TEAL} distance={20} />
        <pointLight position={[3, 3, 3]} intensity={isDark ? 0.4 : 0.12} color={TEAL} distance={15} />
        <pointLight position={[-3, 4, -3]} intensity={isDark ? 0.3 : 0.05} color={TEAL} distance={18} />

        <ExplodedChip scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}