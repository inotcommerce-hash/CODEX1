# Component and token library

All components are ordinary DOM elements using `styles.css`. No UI framework or external font is required. Brand colors and Inter typography were extracted from the company website. Layout sizes and alarm colors are industrial adaptations.

| Token | Current value | Purpose |
|---|---|---|
| `--bg` | `#f5f5f7` | Quiet screen field |
| `--surface` | `#ffffff` | Information panels |
| `--ink` | `#1d1d1f` | Primary text |
| `--muted` | `#6e6e73` | Secondary text |
| `--line` | `#d2d2d7` | Boundaries and passive indicators |
| `--accent` | `#0053be` | Normal active state / primary command |
| `--active` | `#eaf0fa` | Selected control background |
| `--alarm` | `#b5372f` | Abnormal state / stop |
| `--warning` | `#946311` | Warning reserve |
| `--radius` | `8px` | Restrained corner treatment |
| `--space` | `8px` | Base spacing unit |

Typography: locally hosted Inter variable font / Arial / sans-serif; 19px screen titles, 20px step text, 23px process metrics, 14px controls, 12–13px descriptive text, 10–11px secondary labels. Secondary labels require physical panel readability review; enlarge them if site viewing distance requires it. Controls use 44px minimum height; segmented alarm tabs also use 44px targets.

## Reusable patterns

- `.card`: white surface, 1px boundary, 14px inset.
- `.title`: title with contextual selection or action.
- `.primary`: one deliberate machine start action.
- `.stop`: text plus red boundary; physical emergency stop is separate.
- `.io` + `.dot.on`: named binary state, with position and text context.
- `.metric`: value, units and explicit label; no decorative gauge.
- `.tabs`: locally scoped content selection.
- `.alarm`: severity/code/time, condition, component, response, acknowledgement state.
- `.banner`, `.note`: operational context and limitations.
- `.progress`: discrete cycle stage indicator paired with plain-language step.
- `schematic()` in `app.js`: parameterized SVG driven by `io()` and machine state. Preserve `viewBox` and strokes when porting.

## Layout contract

800 × 480; header 66, status rail 38, main 316, bottom navigation 60. Main inset 20 horizontal / 16 vertical. Overview gives the process 535px and actions 209px. Persistent machine state and alarm shortcut remain visible across screens. No main-screen scrolling; alarm lists alone may scroll as history grows.

Use text, position and state together; never color alone. Reserve red for abnormal/stop functions, keep stationary equipment neutral, avoid flashing and decorative motion. The moving part and press position reflect process state rather than adding animation. This follows high-performance HMI design intent; it is not an ISA-101 compliance certification.

## Acceptance review

Inspect captures at native resolution, then on the physical panel under plant lighting with intended gloves and viewing distance. Validate touch targets, contrast, alarm prioritization and operator vocabulary with operators. The original logo is displayed at its intrinsic aspect ratio without redrawing or cropping.
