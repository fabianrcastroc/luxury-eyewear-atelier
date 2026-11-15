# Windows evaluation 1.7.3: delivery evidence

- App source/build commit: 5eaf4a5.
- Test tag: fr-test-win-v1.7.3-preview.1. Explicitly unsigned prerelease, not marked latest and not a commercial signed delivery.
- Windows build/install/offline smoke: https://github.com/fabianrcastroc/luxury-eyewear-atelier/actions/runs/43759779714 (success).
- Installer: FR-eyewear-studio-1.7.3-win-x64.exe; 121840224 bytes.
- SHA-256: 211f764f54cd3fd0315541cc027c0a4bb806fabcaa36035dec53b53bbb3ea6ef.
- Downloaded the public EXE and checksum to the execution workspace and verified matching SHA-256 plus executable MZ header.
- Windows CI installed with NSIS, launched the installed executable, verified the 28-model desktop library, editing, project save/reopen, GLB/STL, two-page PDF and no external HTTP requests. 132 unit tests passed before packaging.
- Full functionality is available during the existing 30-day local evaluation or via a valid compatible licence. Installing this build does not reset an earlier trial. Live commercial activation remains unconfigured.
- This does not verify Windows 10/11 physical clean PCs, SmartScreen reputation, industrial fit, authentic publisher signatures or live payment/licensing services. Windows may block this unsigned test installer; do not disable OS protections.
