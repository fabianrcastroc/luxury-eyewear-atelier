# FR 1.7.5 — separate optical/frame editing and editable temples

## Corrected editing contract

The previous local-modifier implementation deformed the optical outline along with the stock; its test even expected that behaviour. This did not satisfy independent frame editing. The default is now **fixed optical geometry**: capture the current optical outline and global centres, deform only stock, validate material and keep the prior model on rejection. Explicit linked mode is optional. Legacy modifier sources are rebased to the currently visible lens on first edit. Fixed lenses retain their cylindrical forming radius when the temporal stock grows (within the 20° forming limit).

Visible optical-node access starts the optical editor, marks it in cyan and freezes the exterior before editing an optical curve. Frame/lens centre spacing is preserved when a linked optical profile and its nominal template A differ.

## Temple editing

A dedicated millimetre plane supports node/handle drag, coordinates, cubic or straight segments, splitting/deletion, undo, smoothing, bounded cleaning, zoom/pan, length, a local reference image, shared left profile or independent left/right profiles. Keep the vertical hinge face. New free profiles are constant-thickness stock; parametric ear/terminal/style controls are disabled while a free profile is active. Reset to parametric construction restores those controls.

The shared outline feeds the printed pattern, visible mesh, GLB and closed STL per part. Horizontal length is labelled Lh, rather than falsely reporting an inferred centreline length or a parametric ear bend. Free-profile print sheets suppress parametric bend/terminal specifications that no longer apply. This does not certify a particular hinge or physical fit.

## References

Detected overlays retain their interactive crop coordinate surface. Cropping an already cropped image composes coordinates with the original crop and invalidates the previous apply result. Switching to manual drawing removes the old canvas while the image decodes, preventing clicks on a soon-to-be-replaced surface. Buttons expose manual marking and editing the last successful detection. Corrected points show indices, drag, deletion and per-segment straight/curve choice; the displayed curve is the same sampled curve used when applying. Manual sampling now includes every marked corner even when its count does not divide 128, and preserves distinct subpixel anchors instead of silently discarding them.

A real crop from the supplied sistemaFR.pdf black-frame reference detected two apertures; the browser regression then edited detection points, manually marked/calibrated the source and applied it. This is evidence for that source, not a claim of universal photo recognition or exact 3D reconstruction. Scale, camera/perspective error, hidden geometry and manual inspection remain relevant.

## Cleaning and project compatibility

Bounded trace cleaning refits with a user-selected maximum deviation and protects intentional straight spans, including short spans. A noisy 100-node test profile reduced to fewer controls within 0.15 mm while retaining the protected edge. Tangent smoothing remains a separate operation. Geometry/material validation still controls application of edits.

Project format advances to **8** so older versions reject files containing independently designed temple profiles rather than silently discarding those parts. Older projects remain readable by 1.7.5. Keep backups; full CAD equivalence and manufacturing certification are not asserted. The Windows evaluation remains unsigned and preserves the existing trial/licence.
