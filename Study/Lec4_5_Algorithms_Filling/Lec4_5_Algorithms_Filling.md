# Study Session: Lecture 4 & 5 - Algorithms & Filling

## 1. The Core Facts

- **Output Primitives**: Basic geometric structures (Points, Lines, Circles, Spline curves) used to describe a scene.
- **Parametric Form**: $x = x_1 + t(x_2-x_1)$, $y = y_1 + t(y_2-y_1)$ where $0 \leq t \leq 1$.
- **Direct Scan Conversion**: Uses $y = mx + b$. High computational cost due to multiplication and rounding.
- **DDA (Digital Differential Analyzer)**: Incremental algorithm based on $\Delta x$ or $\Delta y$. 
  - **Pros**: Faster than $y=mx+b$, eliminates multiplication.
  - **Cons**: Floating-point math is slower than integer, cumulative rounding errors for long lines.
- **Bresenham’s Algorithm**: Most efficient incremental algorithm using **only integer arithmetic**.
  - **Decision Parameter (P)**: $P_0 = 2dy - dx$.
  - If $P < 0$: Next point is $(x+1, y)$, $P_{new} = P + 2dy$.
  - If $P \geq 0$: Next point is $(x+1, y+1)$, $P_{new} = P + 2dy - 2dx$.
- **Midpoint Circle Algorithm**: Incremental integer-based algorithm using 8-way symmetry.
  - **Decision Parameter (P)**: $P_0 = 5/4 - r \approx 1 - r$.
- **Flood Fill**: Seed-based region filling. 4-point (cardinal) vs 8-point (includes diagonals).

## 2. Problem & Solution Breakdown

- **Scenario:** Plot a line from $(30, 20)$ to $(40, 28)$ using Bresenham’s.
- **Step-by-Step Solution:**
  1. $dx = 10$, $dy = 8$, $P_0 = 6$ ($P > 0$).
  2. Plot $(31, 21)$, $P_1 = 6 + 16 - 20 = 2$ ($P > 0$).
  3. Plot $(32, 22)$, $P_2 = 2 + 16 - 20 = -2$ ($P < 0$).
  4. Plot $(33, 22)$, $P_3 = -2 + 16 = 14$ ($P > 0$).

## 3. The Resource Vault

- **Videos**: 
  - [Bresenham's Line Algorithm](https://www.youtube.com/watch?v=1SA03g7MBKg)
  - [Midpoint Circle Algorithm](https://www.youtube.com/watch?v=9hB1mbZBFwE)
  - [Flood Fill 4 vs 8 Point](https://www.youtube.com/watch?v=Vp_W_m_m_M)

## 4. The Execution Plan (Study Schedule)

### Sub-Topic 1: Line & Circle Drawing

- [ ] **Watch:** Video References (Bresenham & Midpoint Circle)
- [ ] **Read (Primary):** Lecture 4 (Slides 10-25) & Lecture 5 (Slides 10-20)
- [ ] **Practice:** Sheet I (Line) & Sheet II (Circle/Intersection)

### Sub-Topic 2: Region Filling

- [ ] **Watch:** Video Reference (Flood Fill logic)
- [ ] **Read (Primary):** Sheet IV instructions
- [ ] **Practice:** Polygon Filling Exercises
