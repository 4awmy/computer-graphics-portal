# Computer Graphics - Master Study Guide

---

## Lecture 2: Graphics Software and Filling Algorithms

### 1. The Core Facts

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

### 2. Problem & Solution Breakdown

- **Scenario:** Perform a Boundary-Fill (4-connected) on a closed shape.
- **Step-by-Step Solution:**
  1. Start at interior seed point $(x, y)$.
  2. Check if pixel is not the border color AND not the fill color.
  3. Set pixel to fill color.
  4. Recursively call for $(x+1, y), (x-1, y), (x, y+1), (x, y-1)$.
- **Common Gotchas:** Stack overflow in recursive implementations for large regions; using 4-connected on a boundary that needs 8-connected check.

### 3. The Resource Vault

- **Videos**: [Boundary Fill vs Flood Fill](https://www.youtube.com/watch?v=ZInZ6_v_m_M) - Visualizing recursion.
- **Primary Resources**: `lec2_graphics sw.pdf` - Slides 10-45.
- **Secondary Resources**: `Sheet IV - Region Filling.pdf` - Practical exercises.

### 4. The Execution Plan (Study Schedule)

#### Sub-Topic 1: Graphics Software & Primitives

- [ ] **Watch:** [OpenGL Primitives Introduction](https://www.youtube.com/watch?v=W5P8GlaH_6k)
- [ ] **Read (Primary):** `lec2_graphics sw.pdf` Slides 2-25.

#### Sub-Topic 2: Filling Algorithms (Boundary & Flood)

- [ ] **Watch:** [Flood Fill 4 vs 8 Point](https://www.youtube.com/watch?v=Vp_W_m_m_M)
- [ ] **Read (Primary):** `lec2_graphics sw.pdf` Slides 30-60.
- [ ] **Practice:** Apply Boundary Fill logic to Sheet IV Figure (1).

---

## Lecture 4: Design of Line Algorithms

### 1. The Core Facts

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

### 2. Problem & Solution Breakdown

- **Scenario:** Plot a line from $(30, 20)$ to $(40, 28)$ using Bresenham’s.
- **Step-by-Step Solution:**
  1. $dx = 10$, $dy = 8$.
  2. $P_0 = 2(8) - 10 = 6$ ($P > 0$).
  3. Plot $(31, 21)$, calculate $P_1 = 6 + 16 - 20 = 2$ ($P > 0$).
  4. Plot $(32, 22)$, calculate $P_2 = 2 + 16 - 20 = -2$ ($P < 0$).
  5. Plot $(33, 22)$, calculate $P_3 = -2 + 16 = 14$ ($P > 0$).
- **Common Gotchas:** Forgetting to swap roles of $x$ and $y$ when slope $m > 1$.

### 3. The Resource Vault

- **Videos**: [Bresenham's Line Algorithm](https://www.youtube.com/watch?v=1SA03g7MBKg) - Step-by-step derivation.
- **Primary Resources**: `lec4_line.pdf` - Slides 5-30.
- **Secondary Resources**: `Sheet I - Line Drawing Algorithms.pdf` - Plotting practice.

### 4. The Execution Plan (Study Schedule)

#### Sub-Topic 1: Line Drawing (DDA & Bresenham)

- [ ] **Watch:** [DDA & Bresenham Visual Logic](https://www.youtube.com/watch?v=W5P8GlaH_6k)
- [ ] **Read (Primary):** `lec4_line.pdf` Slides 10-25.
- [ ] **Practice:** Sheet I - Problems a, b (DDA vs Bresenham comparison).

---

## Lecture 5: Design of Circle Algorithms

### 1. The Core Facts

- **Naive Algorithm**: Uses $y = \pm \sqrt{r^2 - x^2}$. Inefficient (square roots) and leaves gaps.
- **Polar Coordinates**: Uses $x = x_c + r\cos\theta$, $y = y_c + r\sin\theta$. Slow due to trigonometric calls.
- **8-Way Symmetry**: Only calculate $1/8$ of the circle (one octant); others are mirrors $(x,y), (y,x), (-y,x), (-x,y)$, etc.
- **Midpoint Circle Algorithm**: Incremental integer-based algorithm.
  - **Decision Parameter (P)**: $P_0 = 5/4 - r \approx 1 - r$.
  - If $P < 0$: Next point is $(x+1, y)$, $P_{new} = P + 2x + 3$.
  - If $P \geq 0$: Next point is $(x+1, y-1)$, $P_{new} = P + 2x - 2y + 5$.

### 2. Problem & Solution Breakdown

- **Scenario:** Plot a circle with $r=10$ at $(0,0)$ using Midpoint.
- **Step-by-Step Solution:**
  1. $P_0 = 1 - 10 = -9$ ($P < 0$).
  2. Next point $(1, 10)$, $P_1 = -9 + 2(1) + 1 = -6$ ($P < 0$).
  3. Next point $(2, 10)$, $P_2 = -6 + 2(2) + 1 = -1$ ($P < 0$).
  4. Next point $(3, 10)$, $P_3 = -1 + 2(3) + 1 = 6$ ($P \geq 0$).
- **Common Gotchas:** Not applying the center offset $(x_c, y_c)$ to calculated points.

### 3. The Resource Vault

- **Videos**: [Midpoint Circle Algorithm](https://www.youtube.com/watch?v=9hB1mbZBFwE) - Explanation of 8-way symmetry.
- **Primary Resources**: `lec5_circle.pdf` - Slides 3-25.
- **Secondary Resources**: `Sheet II - Circle Drawing Algorithm.pdf` - Graphical intersections.

### 4. The Execution Plan (Study Schedule)

#### Sub-Topic 2: Circle Drawing & Intersection

- [ ] **Watch:** [Circle Symmetry & Midpoint Logic](https://www.youtube.com/watch?v=ZInZ6_v_m_M)
- [ ] **Read (Primary):** `lec5_circle.pdf` Slides 10-20.
- [ ] **Practice:** Sheet II - Problem 1 (Midpoint derivation).
- [ ] **Bonus:** Solve Sheet II - Problem 2 (Graphical Intersection).

#### Sub-Topic 3: Region Filling (Flood Fill)

- [ ] **Watch:** [Flood Fill 4 vs 8 Point](https://www.youtube.com/watch?v=Vp_W_m_m_M)
- [ ] **Read (Primary):** `Sheet IV - Region Filling.pdf` instructions.
- [ ] **Practice:** Apply Flood Fill to Figure (1) in Sheet IV.

### Final Lecture Review

- [ ] **Active Recall:** 
  
  > What is the initial decision parameter for Bresenham's Line?
  > $P_0 = 2dy - dx$
  > Why is 8-way symmetry used in circle drawing?
  > To reduce calculations by 8x by mirroring points across octants.
  > Difference between 4-point and 8-point Flood Fill?
  > 4-point checks cardinal neighbors; 8-point includes diagonals.
