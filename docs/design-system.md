# BONUS HMI design system

This revision uses an application layout: a quiet navigation sidebar, one open machine workspace and a fixed command dock. The operating state is the primary heading. The machine drawing, actual sensor states and immediate commands carry the overview; there is no dashboard of competing cards.

The original BONUS ENGINEERING wordmark is displayed at 158px wide in the header, and the actual company icon appears at 32px at the top of the sidebar. Both are local assets, displayed without redrawing or changing proportions. Inter is hosted locally with its OFL license. Project SVG navigation icons are ordinary vector paths; no Apple proprietary font or icon assets are bundled. The visual direction draws on Apple's hierarchy, precise alignment and restrained material cues rather than reproducing an Apple product.

## Tokens

| Token | Value | Role |
|---|---|---|
| `--bg` | `#fafbfc` | Open workspace field |
| `--surface` | `#ffffff` | Command dock and grouped controls |
| `--sidebar` | `#f0f1f4` | Navigation and machine identity |
| `--ink` | `#202126` | Adapted primary text |
| `--muted` | `#686c77` | Adapted secondary text |
| `--line` | `#e4e6eb` | Quiet boundaries |
| `--accent` | `#0053be` | Verified BONUS blue; primary command and active feedback |
| `--active` | `#eaf1fc` | Selected-state surface reserve |
| `--alarm` | `#bb342f` | Abnormal condition |
| `--warning` | `#946311` | Warning reserve |
| `--radius` | `14px` | Grouped diagnostic/manual surfaces |
| `--space` | `8px` | Base spacing unit |

The corporate wordmark, icon, blue and Inter family come from the company source. Workspace neutrals, typography sizes and functional alarm colors are HMI adaptations, not claims about exact website CSS. See `branding-research.md` for the original source values.

## Fixed layout

The panel is exactly **800 × 480px**, without scrolling on the main operator screens.

- Sidebar: 128px wide, full height. The original company icon appears above a quiet Workspace label and four labeled navigation rows; machine identity and the Simulation label sit below.
- Workspace: 672px wide.
- Header: 52px high, with the original full wordmark, location, selected screen, machine status, alarm shortcut and time.
- Main: 356px high, from y=52 to y=408; inset 24px horizontally and 18px vertically.
- Command dock: 72px high, from y=408 to y=480. Mode and safety context stay left; Stop and Start cycle stay right on every screen.

The overview has a 61px introduction, a 218px visual stage and a 38px sensor strip. Its technical illustration is unboxed. Good parts and last cycle form one quiet vertical pair at the right, separated from the process by a fine line. Active recipe is a functional shortcut to Diagnostics.

## Typography and touch

Use local Inter, with installed system sans-serif fallbacks. The process-state heading is 31px; other screen titles are 27px. Process metrics are 31px with tabular numerals. Group titles use 12–14px; navigation labels use 12px, and command buttons and ordinary field labels use 11–12px. Secondary identification, units and diagnostic metadata use 9–10px sparingly. These small labels require physical-panel review at the real viewing distance; they should never carry the sole indication of a fault or required action.

Touch controls have a 44px minimum height. Sidebar rows are 48px; persistent command buttons are 46px. Selected navigation uses a white surface and brand-blue icon/text. Focus uses a visible blue outline. Do not remove focus indication to make screenshots cleaner.

## Components

| Pattern | Behavior and appearance |
|---|---|
| `.sidebar`, `nav button.selected` | Stable navigation, consistent SVG icon and explicit label, quiet white selected row |
| `.intro`, `#process-heading` | Machine type above the dominant plain-language operating state |
| `.recipe-pill` | Current recipe and shortcut to Diagnostics; behaves as a button |
| `#process-art`, `.machine-svg` | Lightweight technical SVG, reflecting actual simulator state |
| `.metrics`, `.metric` | Count and last completed cycle, with explicit labels and units |
| `.sensor-strip`, `.io` | Fixed sensor identity and binary state; active blue dot pairs with the text label |
| `.dock-info`, `.actions` | Persistent mode, process-stop context, Stop and deliberate Start cycle |
| `.card`, `.manual-card` | Grouped actuator controls with command/actual feedback and hold-state feedback |
| `.settings-card`, `.diagnostic-row` | Aligned recipe fields, live I/O and component feedback |
| `.tabs`, `.alarm` | Active/history selection, severity, time, component, response and acknowledgement |
| `.banner`, `.note` | Concise interlock and simulation context |
| `#toast` | Temporary feedback above the command dock; never substitutes for a persistent alarm |

The machine SVG uses subtle metal, belt and cylinder gradients to distinguish material surfaces and an understated floor ellipse to ground its geometry. These are local vector fills, not an image or heavy renderer. Machine movement is driven by the process state; there are no decorative entrance animations or glass-blur effects. Surface shadows, where present, are minimal and distinguish selected or actionable controls.

## Runtime behavior

The app creates a screen when navigation changes and updates live content in place. It does not replace focused fields, manual hold buttons or persistent footer commands on every simulation tick. Diagnostics retains focus while the cycle runs. Changes that affect an alarm list explicitly refresh that list, while live values use targeted updates.

The PLC simulation owns state, feedback and interlocks. The appearance must not imply that a disabled command has been accepted. Start, Stop, acknowledgement, condition restoration and reset remain separate operations. Acknowledgement never clears an active condition; reset never starts motion. Physical emergency stop and safety functions remain outside ordinary HMI logic.

## Visual and operator acceptance

Inspect actual screenshots at 800 × 480 and 100% zoom. Check the longest operating-state heading, alarm text, diagnostic values and enabled/disabled combinations. The intended checks include a complete automatic cycle, navigation, hold/release, conflicting-command interlocks, recipes, both simulated faults, acknowledgement/reset, command persistence and field focus during live updates.

Review the actual panel under plant lighting with intended gloves and viewing distance. Confirm secondary-label legibility, target size, contrast, alarm priority and vocabulary with operators. This design follows high-performance HMI intent; it is not an ISA-101 or machine-safety certification.
