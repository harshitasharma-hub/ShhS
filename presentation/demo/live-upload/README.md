# Live upload (not deployed)

`score.js` is the Vercel function that forwarded a photo to a computer running `scripts/model/serve.py`. We chose to keep the hosted demo as a presentation, so it is not in `api/` and nothing serves it. To use it again, move it to `presentation/demo/api/score.js`, set `MODEL_URL` in the Vercel project, add `"functions": {"api/score.js": {"maxDuration": 60}}` to `vercel.json`, and put an upload control back in `src/index.template.html`. The page would also need a note that photos leave the phone.
