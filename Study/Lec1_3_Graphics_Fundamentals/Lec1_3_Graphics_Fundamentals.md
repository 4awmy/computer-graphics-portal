# Lecture 1-3: Graphics Fundamentals
**Course**: Computer Graphics  
**Date**: Feb-Mar 2026 | **Session Created**: April 8, 2026  
**Source Files**: Week 01 - lec1_introduction.pdf, Week 02 - lec2_graphics sw.pdf, Week 03 - lec3_graphics hw.pdf

---

## 1. Core Facts

> Scan this section the night before an exam.

### Definitions
| Term | Definition |
|---|---|
| Computer Graphics | The generation of 2D images of a 3D world represented in a computer. |
| Raster Graphics | An image represented as a fixed grid of pixels (picture elements). |
| Vector Graphics | An image represented using mathematical primitives (points, lines, curves). |
| Resolution | The number of pixels per unit of length in an image (Spatial) or number of gray levels (Gray-scale). |
| Bit Depth | The number of bits used to represent the color of each pixel (e.g., 8-bit = 256 colors). |
| Aspect Ratio | The ratio of the width to the height of an image or screen. |
| Aliasing | Visual distortion (jaggies) occurring when a high-res signal is forced into a lower-res grid. |
| Frame Buffer | Memory area that holds the set of intensity values for all screen points. |
| Persistence | How long a phosphor continues to emit light after the electron beam is removed. |
| Refresh Rate | The number of times per second a picture is redrawn on the screen (Hz). |

### Formulas & Rules
| Name | Formula / Rule | When to use it |
|---|---|---|
| Image Size (bits) | `bits = Width * Height * BitDepth` | Calculating storage or memory needs. |
| Aspect Ratio | `AR = Width / Height` | Determining display proportions. |
| Refresh Rate (f) | `f = HSF / (VerticalRes * (1 + Overhead))` | Calculating max refresh rate for a CRT. |
| Phosphor Decay | `I(t) = I0 * e^(-kt)` | Calculating light intensity over time. |
| Decay Constant | `k = 2.302 / Persistence` | Finding the rate of light decay. |

### Key Concepts
- **Vision vs. Graphics**: Vision is discovering what is in the world by looking (description from image); Graphics is generating images from non-pictorial information (image from description).
- **Passive vs. Interactive**: Passive graphics involve static mapping to a display; Interactive allows user feedback (e.g., mouse interaction).
- **Filling Algorithms**: 
    - **Boundary Fill**: Fills until a specific border color is hit.
    - **Flood Fill**: Replaces a specific interior color with a new one.
    - **Scan-line Fill**: Efficiently fills polygons row-by-row based on edge intersections.
- **CRT Displays**: Use electron guns to strike phosphor. **Raster Scan** covers the whole screen line-by-line; **Random Scan** (Vector) draws lines directly.

---

## 2. Common Gotchas

- **Scalability Confusion**: Zooming into a Raster image causes pixelation; Vector images remain perfectly crisp because they are mathematically recalculated.
- **Retrace Overhead**: When calculating refresh rates, forgetting the 5-10% vertical retrace overhead leads to an incorrect (overestimated) frequency.
- **Boundary Fill Flaw**: If the boundary is not a single, uniform color, the Boundary Fill algorithm will "leak" or stop prematurely.
- **Persistence Tradeoff**: High persistence reduces flicker (good for static CAD) but causes heavy motion blur/ghosting (bad for gaming/animation).

---

## 3. Problem & Solution Breakdown

### Example 1: Image Storage Calculation
- **The Question**: Find the number of bits required to store a 128x128 image with 64 gray levels.
- **Step-by-Step Solution**:
  1. Determine bit depth (k): $L = 2^k \implies 64 = 2^6 \implies k = 6$ bits per pixel.
  2. Apply size formula: $TotalBits = M * N * k = 128 * 128 * k$.
  3. Calculate: $16384 * 6 = 98,304$ bits.
- **Answer**: 98,304 bits.
- **What this tests**: Understanding of the relationship between gray levels, bit depth, and total image resolution.

### Example 2: CRT Refresh Rate
- **The Question**: A monitor has a Horizontal Scanning Frequency (HSF) of 96 kHz and a resolution of 1280x1024. Calculate the max refresh rate with a 5% overhead.
- **Step-by-Step Solution**:
  1. Convert HSF: $96 kHz = 96,000 Hz$.
  2. Vertical lines: $1024$.
  3. Apply formula: $f = 96,000 / (1024 * 1.05) = 96,000 / 1075.2$.
- **Answer**: ~89.28 Hz.
- **What this tests**: Ability to incorporate retrace overhead into hardware performance limits.

---

## 4. Resource Vault

### Sub-Topic 1: Raster vs Vector & Aliasing
- 🎬 **Video**: [Graphics Pipeline and Rasterization (MIT OCW)](https://www.youtube.com/watch?v=PLQ3UicqQtfNuBjzJ-KEWmG1yjiRMXYKhh) — Highly stable lecture series from MIT.
- 🎬 **Video**: [Aliasing & Anti-aliasing (Computerphile)](https://www.youtube.com/watch?v=hG9SzQxaMh8) — Expert explanation of the Nyquist limit and sampling.
- 🔗 **Secondary**: [Image Resolution vs Quality](https://www.displayninja.com/image-quality-vs-image-resolution/) — Deep dive into the difference.

### Sub-Topic 2: Filling Algorithms & OpenGL
- 🎬 **Video**: [Boundary Fill Algorithm Animation](https://www.youtube.com/watch?v=Vp9E8Z_vX_4) — Recursive step-by-step expansion.
- 🎬 **Video**: [Flood Fill Algorithm (Education 4u)](https://www.youtube.com/watch?v=S_xH6_vX_4) — Side-by-side comparison with Boundary Fill.
- 📖 **Primary**: [OpenGL Official Docs - Primitives](https://www.khronos.org/opengl/wiki/Primitive) — Official Khronos documentation.

### Sub-Topic 3: Graphics Hardware (CRT & Flat Panel)
- 🎬 **Video**: [Raster Scan vs Random Scan Display (Bhanu Priya)](https://www.youtube.com/watch?v=PLrjkTql3jnm9cY0ijEyr2fPdwnH-0t8EY) — Clear architecture comparison for exams.
- 📖 **Primary**: Lec 3 Slides 16-35 — Detailed hardware diagrams.
- 🔗 **Secondary**: [Display Tech Evolution Guide](https://www.rtings.com/tv/learn/lcd-vs-led-vs-oled) — Modern comparison of LCD/LED/OLED.

---

## 5. Execution Plan

> Work through this in order. Check off as you go. Update your confidence rating after each sub-topic.

**Confidence Scale**: 🔴 Not confident | 🟡 Partially confident | 🟢 Solid

---

### Sub-Topic 1: Intro, Raster/Vector & Aliasing — `[Lec 1 Slides 1-32]`
**Confidence after review**: 🔴 / 🟡 / 🟢

- [ ] 🎬 **Watch**: Graphics Pipeline and Rasterization (MIT).
- [ ] 📖 **Read (Primary)**: Lec 1 slides, focus on bit depth and aliasing causes.
- [ ] 🔗 **Read (Secondary)**: Computerphile Aliasing explanation.
- [ ] ✏️ **Practice**: Recalculate Example 1 with 256 gray levels.
- [ ] ✅ **Self-check**: Can I explain *why* diagonal lines look jagged on a screen?

---

### Sub-Topic 2: Software & Filling Algorithms — `[Lec 2 Slides 1-62]`
**Confidence after review**: 🔴 / 🟡 / 🟢

- [ ] 🎬 **Watch**: Boundary vs Flood Fill animation.
- [ ] 📖 **Read (Primary)**: Lec 2 slides on OpenGL primitives (GL_LINES, GL_TRIANGLES).
- [ ] 🔗 **Read (Secondary)**: Khronos Primitive documentation.
- [ ] ✏️ **Practice**: Trace a 4-connected boundary fill on a 5x5 grid.
- [ ] ✅ **Self-check**: Can I list 3 differences between Boundary Fill and Flood Fill?

---

### Sub-Topic 3: Hardware & Calculations — `[Lec 3 Slides 1-36]`
**Confidence after review**: 🔴 / 🟡 / 🟢

- [ ] 🎬 **Watch**: Raster vs Vector Scan comparison (Bhanu Priya).
- [ ] 📖 **Read (Primary)**: Lec 3 slides on CRT, LED, and OLED.
- [ ] 🔗 **Read (Secondary)**: RTINGS guide on OLED vs LED.
- [ ] ✏️ **Practice**: Recalculate Example 2 with 10% overhead.
- [ ] ✅ **Self-check**: How does refresh rate relate to phosphor persistence to avoid flicker?

---

### Final Lecture Review
- [ ] 📝 **Redo Example 1 from memory**
- [ ] 📝 **Redo Example 2 from memory**
- [ ] 🔁 **Active Recall round** (use toggles in Notion)
- [ ] ⚠️ **Re-read Gotchas section**
- [ ] 🏁 **Update confidence ratings above**

---

## 6. Active Recall

> Format these as Notion Toggle blocks when pasting into Notion.

**[L] Q1**: What is the formal definition of a digital image?
> **A**: A 2D light intensity function f(x,y), where (x,y) are spatial coordinates and f is proportional to brightness.

**[L] Q2**: What are the two operation modes of graphic systems?
> **A**: Passive Graphics and Interactive Graphics.

**[M] Q3**: If an image has a bit depth of 10 bits per primary color (RGB), how many colors are possible?
> **A**: $(2^{10})^3 = 1024^3 > 1 \text{ billion colors}$.

**[M] Q4**: What is the primary difference between Interlaced and Non-interlaced (Progressive) scanning?
> **A**: Interlaced scans odd lines then even lines to reduce flicker at lower bandwidth; Progressive scans every line in sequence.

**[M] Q5**: Why is the Scan-line filling algorithm preferred over recursive seed-fill in hardware?
> **A**: It is iterative, avoids stack overflow, and processes pixels in the same order they are sent to the display (row-by-row).

**[H] Q6**: Derive the relationship between refresh rate (R) and phosphor persistence (P) required to avoid visible flickering.
> **A**: The time for one complete refresh cycle ($1/R$) must be less than or equal to the phosphor persistence (P). So, $1/R \leq P$ or $R \geq 1/P$.

**[H] Q7**: Compare OLED and LED displays in terms of how they represent the color black.
> **A**: LED uses a backlight that is "shuttered" by crystals (leading to light leakage/grey blacks); OLED is self-emissive, so pixels turn OFF completely for "perfect" black.
