# Kagua Jani, hosted demo

The page behind the hosted demo link: https://shhs-leaf-check.vercel.app

It is built for Noor, the farmer in the World Bank brief (`docs/challenge-04-concept-note.pdf`, Annex B). She has a basic phone, uses her daughter's smartphone only at weekends, has no Wi-Fi and buys 3G data bundles. So the page has one screen with one big button. The answer is a full-screen colour, a drawn leaf and a voice. The technical numbers sit in a "For reviewers" box at the bottom.

## How the page follows the brief

- **Local language.** The page is in Swahili, in text and voice. English is a small switch for reviewers. A native speaker has not checked the Swahili. The voice clips come from Meta MMS-TTS (`facebook/mms-tts-swh`, CC-BY-NC 4.0) and are made by `tools/make_voice.py`.
- **Fixed list of answers.** Three: rust, no rust, not sure. The model never writes free text, so every answer can be checked.
- **Human in the loop.** Every answer sends her to a person: the extension officer or her cooperative.
- **Built light.** No web fonts and no outside scripts. About 55 KB without the voice. Each voice clip is about 200 KB and loads only when it plays.
- **References.** A row in the white card at the bottom links the talk (on Vercel), the GitHub repo, the results table and the not-sure rule. The links are in the `refs` block of `public/index.html`. Check each one after a push, because GitHub paths only work once the file is on the remote.

## How the model runs

Vercel cannot run the model. It has no GPU, and a function cannot hold 5 to 10 GB of weights. So the page works in two ways:

- The four sample photos show saved answers from the real model (run `real_d140_f10_s0`, four Uganda field photos). They need no server and always work.
- An uploaded photo goes to `api/score.js`. That function forwards it to the computer that runs `scripts/model/serve.py`. The address of that computer is the `MODEL_URL` setting of the Vercel project. If `MODEL_URL` is not set, or the computer is off, the page says the service is not available.

## Edit and deploy

- All the words are in the `T` object at the top of the script in `public/index.html`.
- If the Swahili answers change, make the voice again: `.venv/bin/python presentation/demo/tools/make_voice.py presentation/demo/public/voice`.
- Deploy with `vercel deploy --prod --yes` in this folder.
- To turn on live uploads, run `serve.py` on a computer that has a public address (a tunnel works), set `MODEL_URL` to that address in the Vercel project settings, and deploy again.
- `vercel link` writes a `.env.local` file with a token. Delete it. The `.gitignore` in this folder keeps it out of git.
