# ASIC Physical Design Flow — A Beginner's Roadmap

*April 2026 · 8 min read*

---

When I started my journey in physical design, the sheer number of steps felt overwhelming. Synthesis, floorplanning, placement, CTS, routing, signoff — each one a universe of its own. Here's the roadmap I wish I had.

## The Big Picture

Physical design is the bridge between **RTL** (your Verilog) and **GDSII** (what the fab prints on silicon). Every step has one goal: make the design manufacturable while meeting timing, power, and area targets.

## The Flow

### 1. Synthesis
This is where your RTL becomes a gate-level netlist. Tools like **Design Compiler** map your logic to standard cells from the technology library.

**Key metrics:** Area, timing (WNS/TNS), power estimate.

### 2. Floorplanning
You define the chip's physical boundaries:
- **Die size** and core area
- **Macro placement** (SRAMs, PLLs, analog blocks)
- **IO pad ring** placement
- **Power grid** planning (PG mesh, rings, straps)

This step is critical. A bad floorplan = months of pain later.

### 3. Placement
Standard cells get placed inside the core area. The tool optimizes for:
- Timing (cells on critical paths close together)
- Congestion (don't pack everything in one corner)
- Power (minimize switching activity density)

### 4. Clock Tree Synthesis (CTS)
The clock network is built. This is where **skew** and **insertion delay** matter.
- Balance clock arrival times across all flip-flops
- Insert buffers/inverters for drive strength
- Handle multiple clock domains

### 5. Routing
Metal wires connect everything. At advanced nodes (3nm, 5nm), routing is incredibly constrained:
- Limited metal layers
- Strict DRC rules
- Via resistance matters

### 6. Signoff
The final checks before tapeout:
- **STA** (Static Timing Analysis) — PrimeTime
- **Physical Verification** — DRC, LVS (IC Validator)
- **IR Drop** — Dynamic and static analysis
- **EM** (Electromigration) checks

## My Advice for Beginners

1. **Understand the WHY** before the HOW. Don't just run scripts — know why each step exists.
2. **Learn TCL.** Seriously. Every EDA tool speaks TCL.
3. **Read the log files.** The tool tells you what went wrong. Read it.
4. **Floorplanning is king.** Spend time here. Everything downstream depends on it.
5. **Timing is a puzzle.** Learn to read timing reports like a story.

---

*This is the first in a series about physical design. Next up: deep dive into floorplanning strategies.*