# Static Rebuild QA

Source package counts:

- Sections: 11
- Chapters: 70
- Resource cards: 171

Static checks are run with scripts/validate-static-rebuild.js.

Checks run on 2026-07-06:

- `node scripts/validate-static-rebuild.js` passed for 70 chapter routes, 11 section routes and 171 book resources.
- `node scripts/validate-site.mjs` passed for 158 HTML files and 154 sitemap URLs.
- Phrase scan found no generated public-page claim that Vols4Vets is VA or provides legal, medical, tax, financial or VA claims advice.
- Phrase scan found no generated public-page QR placeholder text, source gap placeholder text or internal production note.

Drive write status: Google Drive upload worked. The same reports were also written locally under codex-output/.

Uploaded Drive reports:

- Vols4Vets_Codex_Static_Rebuild_Plan_v0_1.md: https://drive.google.com/file/d/1K05000EZaDbxBCC9TD7hiCUqDaHfPE3N/view?usp=drivesdk
- Vols4Vets_Codex_Static_Rebuild_Change_Log_v0_1.md: https://drive.google.com/file/d/1uibMmtw0l3GXixC9GsC2OYfNzT8VghVP/view?usp=drivesdk
- Vols4Vets_Codex_Static_Rebuild_QA_v0_1.md: https://drive.google.com/file/d/1hFlcNfWMJY3NzA9DtmX2nguGLtaeRo5F/view?usp=drivesdk
- Vols4Vets_Codex_Static_Rebuild_Route_Check_v0_1.md: https://drive.google.com/file/d/14M1eupTAWcR2LZ-U4y9kBwIrjMVpVqtD/view?usp=drivesdk
