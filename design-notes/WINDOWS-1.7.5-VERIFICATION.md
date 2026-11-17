# FR 1.7.5 Windows evaluation — delivery evidence

Source commit: 3fe4260. Test release: fr-test-win-v1.7.5-preview.1.

Windows build, installed executable and offline smoke passed: https://github.com/fabianrcastroc/luxury-eyewear-atelier/actions/runs/44150361427.

Installer: FR-eyewear-studio-1.7.5-win-x64.exe. Size: 121858333 bytes.
SHA-256: 8eb0cf1f6ee21e2e658d0811cfd77880c90015e9b7d1381e30fe153caef2cb29.
Downloaded the public executable and checksum to the cloud workspace; verified MZ header and matching SHA-256.

Validation completed:
- 150 unit tests passed, including fixed optical outlines/centres/forming radius, legacy source rebasing, independent temple profiles, closed mirrored/formed STL, free-profile print specifications, bounded cleaning and mixed manual traces retaining all marked corners.
- Browser tests at desktop/laptop sizes exercised frame-only temporal edits, visible optical node dragging with the exterior held fixed, actual temple node/handle dragging, straight/curve changes, split/undo, shared and independent temple lengths, project format 8 save/reopen, GLB accessor bounds proving the longer right temple and right STL download.
- Real crop from the supplied sistemaFR.pdf black-frame image: two apertures detected, editable overlay, repeated crops with composed source coordinates, detection-point correction, mixed manual marking, calibration and application. Synthetic regression fixture is separately included in tests; the supplied PDF image is not redistributed as a fixture.
- Existing mouse multi-selection/tangent regression and single-lens/manual-reference regression passed.
- Linux native offline smoke passed; Windows installed native smoke passed. These cover the 28-model library, edits, project roundtrip, GLB/STL and two PDF pages without external HTTP requests.

Limits: unsigned evaluation with existing trial/licence preserved; no publisher identity certification, no guarantee of universal image recognition or exact hidden 3D reconstruction, no physical manufacturing/hinge/clinical-fit certification, and no claim of full industrial-CAD feature parity. Free temple profiles are constant-thickness stock and explicitly labelled horizontal Lh. New project files require 1.7.5+ (format 8); older files remain readable.
