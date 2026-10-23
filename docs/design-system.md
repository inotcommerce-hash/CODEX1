# Component and token library

The interface pairs BONUS ENGINEERING branding with Apple-inspired clarity: generous grouping, quiet neutral surfaces, rounded controls and a strong type hierarchy. It uses locally hosted Inter and project SVG icons, with no Apple proprietary fonts or icon assets. All components are ordinary DOM elements using `styles.css`; no UI framework or external runtime assets are required. There are no glass-blur effects, gradients or decorative animations.

The original logo, blue accent, primary ink, white surfaces and Inter typography come from the company website. Muted text, separators, selected surfaces, layout sizes and alarm colors are industrial adaptations; they are not claimed as exact source brand values. See `branding-research.md` for the verified source values.

| Token | Current value | Purpose |
|---|---|---|
| `--bg` | `#f5f5f7` | Quiet screen field |
| `--surface` | `#ffffff` | Grouped information surfaces |
| `--ink` | `#1d1d1f` | Primary text; verified brand value |
| `--muted` | `#63636b` | Adapted secondary text |
| `--line` | `#e3e3e8` | Adapted quiet separators |
| `--accent` | `#0053be` | Verified brand blue; primary command and active state |
| `--active` | `#eaf1fc` | Adapted pale-blue selected surface |
| `--alarm` | `#b5372f` | Abnormal state / stop |
| `--warning` | `#946311` | Warning reserve |
| `--radius` | `16px` | Grouped card corners |
| `--control-radius` | `12px` | Button and navigation corners |
| `--space` | `8px` | Base spacing unit |

Typography: locally hosted Inter variable font / Arial / Helvetica / sans-serif; 22px screen and cycle headings, 25px tabular process metrics, 14px command buttons, 12–13px descriptive text, and 10–11px secondary labels. Tight heading tracking and restrained weights establish hierarchy without making every label bold. Secondary labels require physical-panel readability review at the intended viewing distance.

Buttons, navigation, alarm tabs, recipe selectors and dwell fields have 44px minimum height. Validate all targets with the intended gloves and viewing conditions on the physical panel.

## Reusable patterns

- `.card`: white grouped surface, fine boundary, 16px corners and 14px default inset.
- `.title`: 22px title with a contextual selection or action.
- `.recipe-pill`: quiet contextual recipe label, distinct from an action.
- `.drawing`: calm machine canvas with a heading, live-state label and integrated `.sensor-strip` along the bottom.
- `.io` + `.dot.on`: named binary state; active sensor chips pair blue fill with an explicit label and fixed location.
- `.cycle-card`: operating step, discrete progress, Start/Stop and completion metrics in one compact group.
- `.primary`: one deliberate solid-blue machine-start action.
- `.stop`: red text on a restrained pale-red surface; physical emergency stop remains separate.
- `.holding`: clear blue feedback for an actively held manual control.
- `.metric`: tabular value, units and explicit label; no decorative gauge.
- `.tabs`: gray segmented container with a white selected segment.
- `.alarm`: severity/code/time, condition, component, operator response and acknowledgement state; abnormal state retains a red edge and text context.
- `.banner`, `.note`: operational context and limitations.
- `nav button.selected`: pale-blue rounded selection capsule with a consistent line icon and text label.
- `.progress`: discrete cycle-stage bars paired with a plain-language step.
- `schematic()` in `app.js`: parameterized SVG driven by `io()` and machine state. Preserve its `viewBox` and intentional strokes when porting.

## Layout contract

800 × 480; header 66px, status rail 38px, main 316px, bottom navigation 60px. Main inset is 20px horizontally and 14px vertically. The overview assigns 516px to the process column and 232px to the cycle column, with a 12px gap. Its 228px machine canvas includes the sensor strip, aligning with the 228px cycle card. Persistent machine state and the alarm shortcut remain visible across screens. No main-screen scrolling is required; alarm lists alone may scroll as history grows.

Use text, position and state together; never color alone. Reserve red for abnormal/stop functions, keep stationary equipment neutral, and avoid flashing or decorative movement. The part and press position reflect the simulated process. This follows high-performance HMI design intent; it is not an ISA-101 compliance certification.

## Acceptance review

Inspect actual captures at native resolution, then review on the physical panel under plant lighting with the intended gloves and viewing distance. Validate touch targets, contrast, alarm prioritization and operator vocabulary with operators. The original logo is displayed at its intrinsic aspect ratio without redrawing or cropping. Rounded styling must preserve visible alarms, explicit actuator feedback and deliberate command behavior.
