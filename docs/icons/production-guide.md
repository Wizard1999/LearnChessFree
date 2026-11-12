# Production, exports and review

## Workflow

1. Choose an actual lesson/tool need and write a one-sentence intended meaning.
2. Choose a concrete metaphor. Check that a newcomer recognizes the object/action without explanation.
3. Consult the review ledger and approved references. Avoid rejected compositions.
4. Generate one separate master per icon, using the available image generator. Do not generate a giant sheet and crop it into production assets.
5. Keep the original PNG unchanged and record tool, date, prompt, references and revision lineage.
6. Inspect at original size and at 64, 48 and 32px on the real black field. Inspect grayscale and neighboring icons when color or similarity is a concern.
7. Apply the separate approved frame. Inset the complete art 6.25% on every side. Never overlay the frame on full-bleed art. Check all four edges.
8. Present numbered review sheets. Production batches are twenty; style/revision tests can be smaller. Collect explicit owner feedback.
9. Record approved / needs revision / rejected / visually good but meaning unassigned / pending review. Approval is per asset version.
10. Update the doctrine only for actual accepted decisions. Preserve rejected attempts for context without mixing them into approved assets.

## Files

approved/: originals explicitly approved by the owner, with exports.
review/: current candidates or unresolved assets, not ready to ship automatically.
history/: previous versions, including rejected candidates, kept for traceability.
frames/: approved SVG, transparent PNGs and CSS.
references/: approved earlier shield/fork and original pin source.
docs/: the current doctrine, prompt guide, production guide and review ledger.
manifest.json: exact prompts, files and statuses.
tools/export_icon.py: deterministic resizing and frame composition for future PNG masters; does not generate or edit artwork.

## Export contract

- Master: original square PNG, original dimensions, no baked frame.
- Web image: 256px WebP, quality 92 in this batch; inspect before reducing quality further.
- Framed export: 512, 64, 48 and 32px RGBA PNG, separate from master.
- Overlay: frames/frame.svg for scalable reuse, plus transparent PNG sizes.
- Preserve black within the art. Only the outside rounded corners of composed exports become transparent.
- Use Lanczos downsampling once from master; do not repeatedly resize an already-small export.
- Retain an unframed version so frame changes require no image regeneration.

## Web use

Copy frames/icon-frame.css and frame.svg together. Use a square wrapper with the image and a pointer-events:none frame overlay. The existing CSS supplies this. Never use the decorative frame as the sole keyboard focus indicator. Provide the accessible name on the containing control or image; use empty alt text for decorative duplicates beside a clear label.

## Review checks

The question at 32px is not whether every scratch survives. It is whether the intended object/action is identifiable, differentiated from its neighbors and emotionally appropriate. Check physical construction too: aligned skewer handles, believable book geometry, correct pin fastening and readable hourglass chamber. A good rendering does not rescue a weak metaphor.

The final collection should carry this living guide and the latest ledger forward after every accepted batch. No source repository or live site was changed in this batch.

## Batch 03 export correction
The full square master fits into the 87.5% central opening. The original art is resized, never cropped or painted over. Radius is 3.5% of the inner artwork width. Compositing runs at 8x output size for consistent fractional spacing. CSS and raster exports use the same geometry. To keep the same apparent art size as an old 64px unframed icon, allocate about 73px for the outside frame.
