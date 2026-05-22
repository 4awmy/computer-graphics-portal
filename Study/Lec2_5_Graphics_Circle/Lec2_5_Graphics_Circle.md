# Study Session: Lecture 2 & 5 - Graphics Software & Circle Algorithms

## 1. The Core Facts
- **Filling Algorithms (Lec 2)**:
    - **Boundary-Fill**: Recursive. Fills until a border color is hit.
    - **Flood-Fill**: Recursive. Replaces an interior color.
    - **4-Connected vs 8-Connected**: 8-connected is safer for complex boundaries to prevent leakage.
- **Circle Algorithms (Lec 5)**:
    - **8-Way Symmetry**: Mirroring $(x,y)$ to 7 other octants to save $87.5\%$ of calculations.
    - **Midpoint Circle Algorithm**: The efficient integer-based standard.
    - **Decision Parameter (P)**: $P_0 = 1 - r$.
    - Update: $P < 0 \rightarrow P + 2x + 3$; $P \geq 0 \rightarrow P + 2x - 2y + 5$.

## 2. Problem & Solution Breakdown
- **Scenario (Circle):** Plot $r=10$ at $(0,0)$ using Midpoint.
- **Step-by-Step:**
    1. $P_0 = -9$ (Inside). Next: $(1, 10)$.
    2. $P_1 = -9 + 2(1) + 1 = -6$. Next: $(2, 10)$.
    3. $P_2 = -6 + 2(2) + 1 = -1$. Next: $(3, 10)$.
- **Scenario (Filling):** Recursive Boundary fill checks `if(color != border && color != fill)`.

## 3. The Resource Vault
- **Videos**: 
    - [Midpoint Circle Algorithm](https://www.youtube.com/watch?v=9hB1mbZBFwE)
    - [Flood Fill 4 vs 8 Point](https://www.youtube.com/watch?v=Vp_W_m_m_M)

## 4. The Execution Plan (Study Schedule)
### Sub-Topic 1: Circle Drawing (Lec 5)
- [ ] **Watch:** Midpoint Circle Visual Logic.
- [ ] **Read (Primary):** Lecture 5 (Slides 5-25).
- [ ] **Practice:** Sheet II - Problem 1 (Midpoint derivation).

### Sub-Topic 2: Filling & Intersection (Lec 2 & Sheet II)
- [ ] **Watch:** Flood Fill logic video.
- [ ] **Read (Primary):** Lecture 2 (Slides 30-60).
- [ ] **Practice:** Sheet II - Problem 2 (Graphical Intersection) & Sheet IV (Filling).

### Final Lecture Review
- [ ] **Active Recall:** 
> Initial P for Midpoint Circle? -> 1 - r.
> When do you use 8-connected fill? -> When boundaries have diagonal gaps that 4-connected would miss.
