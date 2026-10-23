# Siemens WinCC Unified implementation proposal

Target: user-specified MTP700 Unified Comfort, 800 × 480. Confirm actual panel order number, firmware, TIA Portal/WinCC Unified version and licensed capabilities before implementation. This browser prototype cannot be imported as a complete native Unified project. No TIA project has been generated or validated here.

## Native mapping

| Prototype element | Proposed production implementation |
|---|---|
| Persistent header / status / navigation | Base screen with native text, graphic, buttons and screen window |
| Four content screens | Native screens loaded in the shared screen window; preserve status and selected navigation |
| Production values and parameters | Native I/O fields with units, bounds, access checks and PLC validation |
| Mode, start, stop, recipe | Native buttons and selectors writing request tags, never output coils |
| Alarm list / history / acknowledgement | Native alarm control and configured discrete/process alarms; use supported alarm classes, timestamps, acknowledgement and logging |
| User levels | Unified user administration and authorized operator groups; never the demo role dropdown |
| Machine graphic | Native SVG graphics and dynamic properties where supported; split moving/stateful elements into simple objects |
| Sensor / actuator detail | Faceplate types using stable PLC UDT interfaces |

Create Conveyor, Press, BinarySensor and MachineStatus faceplates. Expose command permission, command request, actual feedback, fault code and quality. Keep colors/fonts centralized through Corporate Designer styles where supported by the installed version; some SVG details and object properties require manual styling. Define the 800 × 480 screens, tag bindings, alarm classes, archives, user permissions and target compilation in TIA Portal manually.

## Proposed PLC interface (symbolic names, subject to PLC design)

| Tag / member | Type | Direction relative to HMI | Meaning |
|---|---|---|---|
| `Machine.Status.Mode` | UInt | Read | Enumerated auto/manual mode |
| `Machine.Status.State` / `Step` | UInt | Read | State machine and sequence step |
| `Machine.Status.SafetyPermitted` | Bool | Read | Informational result from safety system, not safety control |
| `Machine.Status.Ready` / `Busy` | Bool | Read | PLC-confirmed operating permission/state |
| `Machine.Status.GoodCount` | UDInt | Read | Retentive production count |
| `Machine.Status.LastCycle_ms` | UDInt | Read | Last completed cycle |
| `Machine.Command.StartReq` / `StopReq` / `ResetReq` | Bool | Write request | PLC consumes request and returns result/sequence acknowledgement |
| `Machine.Command.ModeReq` | UInt | Write request | PLC checks safe transition conditions |
| `Recipe.RequestId` / `Recipe.AppliedId` | UInt | Write / Read | Transactional recipe apply and feedback |
| `Recipe.PressDwell_ms` | UInt | Write request | PLC validates allowed range while stopped |
| `Infeed` / `Outfeed`. `JogReq`, `Running`, `Ready`, `Fault` | Bool members | Mixed | Conveyor faceplate interface |
| `Press.ExtendReq`, `Upper`, `Lower`, `Ready`, `Fault` | Bool members | Mixed | Press faceplate interface |
| `Sensors.S1` / `S2` | Bool | Read | Actual part detection |
| `Diagnostics.CommsHealthy` / `Quality` | Bool / UInt | Read | Connection status and bad-quality presentation |

For all commands add PLC-side access/mode/interlock validation, bounded request lifetime, sequence IDs or an equivalent handshake, and rejection feedback. Do not trust HMI enable states. Manual hold requests need PLC-side watchdog/heartbeat handling and release on lost communication, screen exit or user session change. Whether hold-to-run is permissible must follow the machine risk assessment; ordinary HMI touch and JavaScript events are not safety-rated enabling devices.

## Sequence and safety

PLC owns infeed → S1 → press descent → lower proof → dwell → retract → upper proof → outfeed → S2 → completion, with separate timeouts, sensor plausibility, jam handling and deliberate recovery. The prototype compresses/manualizes some feedback for demonstration; never reuse its browser state machine as production control. Real stop behavior must account for pressure retention, load and tooling. Do not automatically retract or restart following safety loss without an engineered recovery procedure. Physical emergency stop, guard interlocks and safe energy isolation remain in the validated safety architecture.

## JavaScript and controls

Prefer tag bindings and native events for navigation and commands. Use short supported JavaScript handlers only for presentation or formatting where native facilities are insufficient. Do not port browser `document`, global timers, pointer capture or DOM event code to Unified runtime scripts. A Custom Web Control could encapsulate the lightweight SVG only if native graphics are insufficient; define explicit properties/events, connection quality and offline behavior and validate packaging against the exact target version. Avoid web controls for safety decisions, alarm authority or command arbitration.

## Commissioning checklist

Consult the installed-version Siemens documentation for Corporate Designer, faceplate interface types, SVG dynamic property support, screen-window navigation, alarm controls/logging, user administration and Custom Web Controls. Version-specific API and packaging details are intentionally not asserted here because no Siemens engineering runtime or documentation access was available for verification. Compile for the selected device; test in Unified simulation and then on the actual panel. Verify communication loss, stale data, stuck buttons, simultaneous touches, timeout alarms, recipe rejection, authorization, count retention, alarm time synchronization, touch ergonomics and recovery with PLC/safety engineers.
