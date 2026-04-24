```md
# IR Drop Survival Guide — From Analysis to Fix

*April 2026 · 10 min read*

---

IR drop is one of those things that can kill your chip if ignored. Here's my practical approach to analyzing and fixing IR issues.

## What is IR Drop?

Ohm's law on silicon: **V = I × R**

Current flowing through the power grid creates a voltage drop. If the voltage at a cell drops too much, the cell slows down (or worse, doesn't switch correctly).

## Static vs Dynamic IR Drop

**Static IR drop:** Average current over time. Easier to fix.

**Dynamic IR drop:** Worst-case instantaneous current (e.g., clock edge when thousands of flip-flops toggle). Harder to fix.

## My Analysis Flow

### Step 1: Run RedHawk-SC Analysis

Generate the power grid report and identify hotspots:
- Which instances have the worst voltage drop?
- Which metal layers contribute most to the resistance?

### Step 2: Identify the Layer

This is crucial. If M1-M3 are the problem, PG augmentation at M15 won't help.

Look at the resistance breakdown per layer for each violating instance.

### Step 3: PG Augmentation Strategy

Don't blindly add straps everywhere:
- Add straps **only on layers that contribute to the drop**
- Add straps **near the violating instances**
- Be careful: PG straps consume routing tracks

### Step 4: Verify Timing Impact

After PG augmentation, re-run timing:
- The new straps may block routing channels
- The tool might detour signal nets, creating new timing violations
- Always check **both IR and timing** together

## The Metal Layer Game

At 3nm with 15+ metal layers:
- **Lower metals (M0-M3):** High resistance, carry local power
- **Middle metals (M4-M8):** Moderate resistance, intermediate distribution
- **Upper metals (M9-M15+):** Low resistance, global power grid

The trick is ensuring power gets from the top metals down to the cells efficiently.

## Practical Tips

1. **Check IR early** — don't wait until signoff
2. **Cluster analysis** — group violations by region, not individual instances
3. **Clock cells matter** — clock buffers draw significant current, include them in IR analysis
4. **Decap cells** — place them near clock tree roots and high-activity regions
5. **Iterate** — IR fix → timing check → routing check → repeat

---

*IR drop is a game of balance. Too little power grid = voltage problems. Too much = routing congestion. Finding the sweet spot is the art.*