# Kagua Jani, hosted demo

A presentation of the coffee leaf rust check, built for Noor, the farmer in the World Bank brief (`docs/challenge-04-concept-note.pdf`, Annex B). Live at https://shhs-leaf-check.vercel.app.

It is a prototype for show. The camera is simulated: it takes no real photo and runs no model. The four photos and their answers are saved from the real model (run `real_d140_f10_s0`, four Uganda field photos), and the short "looking at the leaf" step only shows how the real flow feels. Every simulated screen says "Example only". Nothing is uploaded, and the page asks for no camera, microphone or location.

The page is built for people who find devices hard: one job per screen, Swahili in text and voice, a person always one tap away, and a card to show a helper. `docs/accessibility-study.md` explains why, with the sources, the measurements and what has not been tested. A native speaker has not checked the Swahili, and no farmer has used the page.

## Folders

- `src/strings.json`: every word the page shows or speaks, in Swahili and English. Edit the words here.
- `src/index.template.html`: the page itself.
- `tools/build.py`: builds `public/index.html` from the two files above. It also writes the plain-HTML page that shows when scripts do not run, and the version tag in `public/sw.js`.
- `tools/make_voice.py`: makes the voice clips from `src/strings.json` with Meta MMS-TTS (`facebook/mms-tts-swh`, CC-BY-NC 4.0) and shrinks them to MP3 with ffmpeg. Run it again after any change to the words that are spoken.
- `tools/make_icons.py`: draws the app icons and the favicon.
- `tools/check.mjs`: 55 automated checks in a real Chrome (reflow, target size, contrast, keyboard focus, the camera flow, the back button, offline use, no-script page, audio length, page weight). Run `npm install` in `tools/` first.
- `tools/shots.mjs`: takes the screenshots used in the study.
- `public/`: what Vercel serves.
- `live-upload/`: the old function that forwarded a photo to a laptop running the model. It is not deployed. Its README says how to bring it back.

## Edit and deploy

1. Change the words in `src/strings.json` or the page in `src/index.template.html`.
2. If spoken words changed, run `.venv/bin/python presentation/demo/tools/make_voice.py presentation/demo/public/voice` from the repo root.
3. Run `python3 presentation/demo/tools/build.py`, then `node check.mjs http://localhost:5294/` in `tools/` with `python3 -m http.server 5294 --directory ../public` running.
4. Deploy with `vercel deploy --prod --yes` in this folder. The Vercel project is not connected to GitHub, so a push alone does not update the live link.
5. `vercel link` writes a `.env.local` file with a token. Delete it. The `.gitignore` in this folder keeps it out of git.
