# Study Session: Lecture 2 & 4 - Graphics Software & Line Algorithms

## 1. The Core Facts
- **Software Categories**: 
    - **Special Purpose**: CAD systems, painting programs.
    - **General Programming**: OpenGL, GL, VRML, Java2D/3D.
- **Standards**: OpenGL (Early 1990s, hardware independent), WebGL (JavaScript-based, for browsers).
- **Geometric Primitives (OpenGL)**: `GL_POINTS`, `GL_LINES`, `GL_LINE_STRIP`, `GL_LINE_LOOP`, `GL_TRIANGLES`, `GL_QUADS`, `GL_POLYGON`.
- **Polygon Filling**:
    - **Scan-Line Fill**: Uses intersection of scan lines with polygon edges.
    - **Boundary-Fill**: Recursive. Fills until a specific border color is reached.
    - **Flood-Fill**: Recursive. Replaces an interior color with a new color.
- **Connectivity**: 
    - **4-Connected**: Checks above, below, left, right.
    - **8-Connected**: Includes diagonals. Required for more complex boundaries to avoid "leakage" or incomplete fills.
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

## 2. Problem & Solution Breakdown
- **Scenario 1 (Filling):** Perform a Boundary-Fill (4-connected) on a closed shape.
- **Step-by-Step Solution:**
    1. Start at interior seed point $(x, y)$.
    2. Check if pixel is not the border color AND not the fill color.
    3. Set pixel to fill color.
    4. Recursively call for $(x+1, y), (x-1, y), (x, y+1), (x, y-1)$.
- **Scenario 2 (Line):** Plot a line from $(30, 20)$ to $(40, 28)$ using Bresenham’s.
- **Step-by-Step Solution:**
    1. $dx = 10$, $dy = 8$, $P_0 = 6$ ($P > 0$).
    2. Plot $(31, 21)$, $P_1 = 6 + 16 - 20 = 2$ ($P > 0$).
    3. Plot $(32, 22)$, $P_2 = 2 + 16 - 20 = -2$ ($P < 0$).
    4. Plot $(33, 22)$, $P_3 = -2 + 16 = 14$ ($P > 0$).

## 3. The Resource Vault
- **Videos**: 
    - [Boundary Fill vs Flood Fill](https://www.youtube.com/watch?v=ZInZ6_v_m_M)
    - [Bresenham's Line Algorithm](https://www.youtube.com/watch?v=1SA03g7MBKg)
    - [DDA Algorithm Visual Logic](https://www.youtube.com/watch?v=W5P8GlaH_6k)

## 4. The Execution Plan (Study Schedule)
### Sub-Topic 1: Graphics Software & Primitives (Lec 2)
- [ ] **Watch:** OpenGL Primitives Introduction
- [ ] **Read (Primary):** Lecture 2 (Slides 2-25)
- [ ] **Practice:** Identify primitives used in Figure (1) of Sheet IV.

### Sub-Topic 2: Line Drawing Algorithms (Lec 4)
- [ ] **Watch:** DDA & Bresenham Visual Logic
- [ ] **Read (Primary):** Lecture 4 (Slides 10-25)
- [ ] **Practice:** Sheet I (DDA vs Bresenham comparison).

### Sub-Topic 3: Filling & Connectivity (Lec 2)
- [ ] **Watch:** Flood Fill 4 vs 8 Point
- [ ] **Read (Primary):** Lecture 2 (Slides 30-60)
- [ ] **Practice:** Sheet IV - Region Filling exercises.

### Final Lecture Review
- [ ] **Active Recall:** 
> What is the initial decision parameter for Bresenham's Line? -> A: P0 = 2dy - dx
> Why is 8-way symmetry used in circle drawing? -> A: To reduce calculations by 8x by mirroring points across octants.
> Difference between 4-point and 8-point Flood Fill? -> A: 4-point checks cardinal neighbors; 8-point includes diagonals.
