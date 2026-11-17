# FR 1.7.4 Windows evaluation: verified delivery

Source commit: 4b8f35d. Release tag: fr-test-win-v1.7.4-preview.2.

Windows build/install/offline smoke passed: https://github.com/fabianrcastroc/luxury-eyewear-atelier/actions/runs/44126194249.

Installer: FR-eyewear-studio-1.7.4-win-x64.exe. Size: 121851824 bytes.
SHA-256: 270d2a8646488cac37bf269e3e87af733795e232b728819bc7cb33375dbb5d9b.
Downloaded the public executable and published checksum to the execution workspace, verified matching SHA-256 and MZ executable header.

138 unit tests passed. Installed Windows application passed the native smoke covering its 28-model library, actual mouse/node editing, project roundtrip, GLB/STL, exactly two PDF pages, renderer isolation and no external HTTP requests. Browser regressions additionally exercised explicit nasal/temporal controls, curve smoothing, wrap/radius/sag, new/scratch/clear/undo, focus layout, template switch and slider completion. A geometry audit tested 28 bases × 4 modifier scenarios (112 valid cases).

This is an unsigned evaluation, preserving the existing 30-day trial. It does not establish editor identity, physical clean-machine certification, industrial manufacturing accuracy, universal real-time latency, optical suitability or CAD feature parity. Older saved projects retain their geometry; select a template again to use its corrected reference mode.
