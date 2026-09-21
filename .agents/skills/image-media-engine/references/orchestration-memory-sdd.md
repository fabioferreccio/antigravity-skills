# Sub-Agent Orchestration, Persistent Project Memory & SDD/Prompt-Engineering Architecture

## 1. Overview & System Vision
To eliminate context pollution, quality degradation over long interactive sessions, logo divergence, and unstructured "vibe coding", `image-media-engine` operates as a **Sub-Agent Orchestrator & Memory-Grounded Architecture**. 

It combines:
1. **Spec-Driven Development (SDD)**: Enforces `BRAND_SPEC.md` as the single source of truth for all client visual parameters before code or image asset generation.
2. **Cognitive Prompt Engineering**: Optimizes sub-agent instructions and image generation prompts using Architect-Diagnostician-Optimizer simulation.
3. **Sub-Agent Reflection & Loss Function Loop**: Intercepts intermediate outputs, evaluates them against `BRAND_SPEC.md` and the Loss Function Reward Matrix, and re-processes them until quality threshold ($\ge 95\%$) is met.
4. **Surgical State Locking**: Freezes approved vector paths and applies surgical edits to targeted areas without touching approved geometry.
5. **True Vectoring**: Strictly prohibits Base64 raster wrappers inside SVG files and enforces `fill-rule="evenodd"` for clean transparent cutouts.
6. **Paint/Hand Sketch Translation Protocol**: Translates crude MS Paint pixel sketches into precise geometric cuts applied directly to approved vectors.
7. **Persistent Project Memory**: Stores client brand specs and state in `.media-engine/projects/<client_id>/`.
8. **Context Window Metrics & Compaction**: Metrics-driven context garbage collection to prevent history bloat and context drift.

---

## 2. SDD & Prompt-Engineering Synergy Framework

```
User Request / Discovery
  │
  ├─→ Phase 0: CONSTITUTION (.media-engine/projects/<client_id>/constitution.md)
  │    └── Non-negotiable client rules, brand values, press constraints
  │
  ├─→ Phase 1: BRAND SPECIFICATION (.media-engine/projects/<client_id>/BRAND_SPEC.md)
  │    └── Single Source of Truth: Logo geometry, grid, Pantone/CMYK/OKLCH, typography
  │
  ├─→ Phase 2: SURGICAL STATE LOCKING (.media-engine/projects/<client_id>/PROJECT_STATE.json)
  │    └── Freezes approved vector elements (e.g. letters B & K) while mutating targeted elements (A)
  │
  ├─→ Phase 3: PROMPT & MEDIA PLAN (.media-engine/projects/<client_id>/MEDIA_PLAN.md)
  │    └── /prompt-engineering synthesis: optimized CLI commands & rendering prompts
  │
  ├─→ Phase 4: ATOMIC TASKS (.media-engine/projects/<client_id>/TASKS.md)
  │    └── Task decomposition for sub-agents (Vector, Retouching, Preflight, Web)
  │
  └─→ Phase 5: ORCHESTRATION & LOSS FUNCTION REFLECTION LOOP
       └── Multi-loop candidate evaluation against Loss Function Matrix until Score >= 95%
```

---

## 3. Sub-Agent Loss Function / Reward Matrix

During candidate evaluation, intermediate sub-agent outputs are scored against this strict Loss Function matrix:

| Agent Action / Technical Pattern | Score Weight / Penalty | Rationale & Governance Rule |
| :--- | :--- | :--- |
| **Pasting Base64 raster wrapper in SVG (`<image href="data:..."/>`)** | **`-1.0` (Maximum Penalty)** | Destroys technical utility of vector files; produces black inner borders and artifacts. |
| **Altering previously approved brand elements during fine-tuning** | **`-0.8` (High Penalty)** | Breaks iterative trust, destroys progress, frustrates the client. |
| **Literal interpretation of crude MS Paint pixel sketches** | **`-0.5` (Medium Penalty)** | Sketches indicate geometric intent/position, not finished line art style. |
| **Surgical isolation of requested vector edits (State Locking)** | **`+0.9` (High Reward)** | Preserves approved progress and focuses strictly on targeted pain points. |
| **True vectoring with `fill-rule="evenodd"` & linear gradients** | **`+1.0` (Maximum Reward)** | Guarantees professional press/web vector files with clean transparent cutouts. |

---

## 4. Surgical State Locking & Sketch Translation Protocol

### Surgical State Locking Protocol
When a client approves specific parts of an asset (e.g. letters B and K) and requests fine-tuning on another part (e.g. letter A):
1. **Lock Approved State**: Save approved vector paths in `01_Vector_Master/logo_primary.svg` and register path IDs in `PROJECT_STATE.json`.
2. **Isolate Mutation Zone**: Define bounding box or path ID for targeted modification.
3. **Execute Surgical Mutation**: Modify only the target path parameters or apply geometric cutouts.
4. **Re-assemble Vector Master**: Combine locked paths + mutated target path. Never re-generate the full logo from an AI prompt.

### Paint/Hand Sketch Translation Protocol
When a client sends a crude MS Paint pixel sketch or hand drawing:
1. **Identify Geometric Intent**: Determine the exact geometric cut or addition indicated by the sketch (e.g. 45° diagonal slit, key blade notches, bevel cuts).
2. **Ignore Pixel Artifacts**: Ignore pixelation, uneven lines, mouse jitter, or hand-drawing noise.
3. **Apply Clean Geometry**: Construct mathematically precise SVG vectors (e.g. `M ... L ... Z` at exact 45° angle) and apply them onto the approved master vector geometry.

---

## 5. Sub-Agent Orchestration & Quality Reflection Loop

```
                        ┌──────────────────────────────┐
                        │   Sub-Agent Candidate Output │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Loss Function Evaluator      │
                       │  - Check Base64 Wrapper (-1.0)│
                       │  - Check State Locking (-0.8) │
                       │  - Check fill-rule evenodd    │
                       └──────────────┬────────────────┘
                                       │
                        Score >= 95%? ├─────────────────────────┐
                                       │ YES                    │ NO
                                       ▼                        ▼
                        ┌────────────────────────┐  ┌─────────────────────────┐
                        │  Deliver Master Asset  │  │ Internal Refinement Loop│
                        │  (01_Vector_Master)    │  │ (Max 3 Iterations)      │
                        └────────────────────────┘  └─────────────────────────┘
```

---

## 6. Persistent Project Memory Structure

Client persistent memory is saved under `.media-engine/projects/<client_id>/`:

```
.media-engine/projects/<client_id>/
├── constitution.md       # Client non-negotiable rules & values
├── BRAND_SPEC.md         # Approved single source of truth specification
├── PROJECT_STATE.json    # Persistent state & approved path locks
├── MEDIA_PLAN.md         # Optimized prompt engineering plan
└── TASKS.md              # Active task checklist
```
