# Video scripts

Three videos, 60 seconds each at most: demo, tech and team. About 130 words fit in 60 seconds at a calm pace. Each script has fewer than that, so you have room to pause. Every number comes from `results/summary.md` and `results/calibration.md`. Where a script needs something only you know, it says FILL IN.

## Video 1: demo

Before you record, open a terminal in the repo root and have the four photos in `submission/demo_photos/` ready. Run the command once off camera so the model is cached, then run it again for the take. It takes about 25 seconds.

```bash
.venv/bin/python scripts/model/predict.py submission/demo_photos/*.jpg --run real_d140_f10_s0 --lang es
```

Use `--lang en` for an English take. `--lang pt` gives Portuguese.

| Time | On screen | Voice |
| --- | --- | --- |
| 0:00 to 0:10 | The clear rust photo, full screen | "Noor grows coffee. Her yields dropped, and she cannot say why. One cause is leaf rust. So she takes a photo of a leaf." |
| 0:10 to 0:28 | The terminal. The command runs. The rust and no-rust answers appear. | "Our model reads the photo on this laptop, with no internet. Orange spots like these: rust, yes. This glossy leaf: rust, no." |
| 0:28 to 0:42 | The two blurred or pale photos, then their answers in the terminal | "This photo is blurred. This leaf is pale, and the spots are faint. The model does not guess. It says: not sure, ask a person." |
| 0:42 to 0:58 | Text on screen: "300 real Uganda photos, never seen in training. 89 in 100 right. Not sure on 28 in 100. Right on 96 in 100 answers." | "We tested it on 300 real farm photos from Uganda that it never saw. If it must answer every photo, it is right 89 times in 100. With the not sure option, it answers 72 photos in 100 and is right 96 times in 100 of those." |
| 0:58 to 1:00 | The ShhS name and the repo link | "ShhS." |

The model runs on a laptop here, not on a phone yet. Say "laptop" and not "phone", because we have not tested it on a phone.

## Video 2: tech

Show the results table from `results/summary.md` and the picture of three photo styles, `results/figures/three_photo_styles.jpg`.

| Time | On screen | Voice |
| --- | --- | --- |
| 0:00 to 0:15 | A line: BRACOL photos, then Gemma 4 E2B with a LoRA adapter, then a yes or no score | "We fine-tune Gemma 4 E2B, a small model with a build for phones. We train a LoRA adapter with 24 million parameters on public BRACOL leaf photos. The model scores each photo, yes or no." |
| 0:15 to 0:30 | `results/figures/three_photo_styles.jpg`: clean BRACOL, our renders, real Uganda photos | "BRACOL photos are clean. Farm photos are not. So we asked: do leaves rendered in Blender help on real farm photos? We made 1,353 renders and ran 42 experiments." |
| 0:30 to 0:48 | The results table: BRACOL accuracy 94.6% against 92.8%. Uganda 87.5% against 88.2%. | "On clean photos, renders help a little: 94.6% right against 92.8%. On 1,792 real Uganda photos they never beat real photos. Our best mix ties them: 87.5% against 88.2%." |
| 0:48 to 1:00 | A line: 128 photos, 100 local photos, about $5 | "What works is small. 128 real photos give the best field score. About 100 local photos set the cut-off and the not sure margin. The whole study cost about five dollars." |

## Video 3: team

We only know that ShhS is a team of two at the Dresden hub. The names, roles and reasons are yours. Keep to one idea per sentence, and film it in one take if you can.

| Time | On screen | Voice |
| --- | --- | --- |
| 0:00 to 0:10 | Both of you, or the team photo | "We are ShhS, a team of two at the Dresden hub. I am FILL IN NAME, and this is FILL IN NAME." |
| 0:10 to 0:25 | You, speaking | "FILL IN: one sentence each on what you do. For example, who built the render pipeline and who ran the training." |
| 0:25 to 0:40 | You, speaking | "We chose challenge 04b because FILL IN: your own reason, in one sentence." |
| 0:40 to 0:55 | The result table, or you | "Our test said the synthetic photos match real photos but do not beat them on real farm photos. We report it as it came out." |
| 0:55 to 1:00 | The ShhS name | "Next: put the model on a phone, and test it with farmers. Thank you." |

## Video 4: the brief video, 2 to 5 minutes

This one is required. Section 08 of the World Bank brief (`docs/challenge-04-concept-note.pdf`, page 10) asks for "a video, 2 to 5 minutes", and says entries without it will not make the shortlist. It is separate from the three 60 second videos that HackOS asks for. The brief lists five parts, and the script below follows them in that order. It runs 3 to 3.5 minutes at a calm pace, so the times are a guide.

Part 3 can be a slide deck or a screen recording. You can use the terminal run from video 1, and slides from `presentation/talk/shhs-talk.html`.

| Time | Part of the brief | On screen | Voice |
| --- | --- | --- | --- |
| 0:00 to 0:20 | 1. Problem statement, in the brief's one-sentence form | The sentence as text, over a coffee leaf with rust | "Because of this tool, Noor can find out whether a coffee leaf has rust on the day she sees the spots, instead of waiting for an extension officer who visits twice a year at best. We know the problem is real because the World Bank brief says so." |
| 0:20 to 1:10 | 2. What the AI does, why a simpler tool would not, and the guardrails | A line from photo to model to one of three answers, then the three answers in Spanish | "The tool does one job with computer vision. It looks at a leaf photo and says rust, no rust, or not sure. An SMS or a spreadsheet cannot look at a leaf. We use Gemma 4 E2B, a small model with a build for phones, and we fine-tune it on public coffee leaf photos. 128 labelled photos are enough, and about 100 local photos set it up for a new place. The guardrails are built in. The tool can only say three things, in the farmer's language, so it cannot make anything up. When the score is close to the cut-off, it says not sure, ask a person. A person makes the final call. The tool never tells Noor what to spray." |
| 1:10 to 2:10 | 3. Tool demo, end to end | The terminal run on the four demo photos, then the results table | "Here is the journey. Noor sees yellow-orange spots on a leaf and takes a photo. The model reads it on this laptop, with no internet. This leaf: rust, yes. This glossy leaf: rust, no. This photo is blurred, so the tool says not sure and asks her to show the leaf to a person. We tested it on 300 real farm photos from Uganda that it never saw. If it must answer every photo, it is right 89 times in 100. With not sure, it answers 72 photos in 100 and is right 96 times in 100 of those. On tiny photos from Kenya with odd colours, it fails, and we say so." |
| 2:10 to 2:40 | 4. The gap, and where the tool sits in the user's day. Tech stack. | A simple day line: sees spots, takes a photo, gets an answer, asks a person | "In our design, Noor opens the tool at the edge of the field when she sees spots. She takes one photo and gets one of three answers. If the answer is not sure, she shows the leaf to the extension officer or the cooperative. The tool answers in Spanish and Portuguese today. For a language with less support, such as Luganda or Swahili, we translate and record only three lines. The stack is Gemma 4 E2B, LoRA, Hugging Face transformers and PEFT, and Python. All 42 runs took one rented GPU and about five dollars. Today it runs on a laptop, not yet on a phone." |
| 2:40 to 3:10 | 5. Your take on localizing AI | The two of you, or one slide with two lines | "For us, localizing AI means two things. First, set the tool up with photos from the place where it is used. In our tests, more studio photos did not help on real farms, and about 100 local photos did most of the work. Second, let the tool say it does not know, and let a person decide. Our rendered photos matched real photos on clean pictures but did not beat them on real farms. We report that as it came out." |

Part 5 is a draft. It is your take, so change it to say what you think.

If you are asked how the tool would fare in a less-supported language, the answer is in part 4: the tool can only say three things, so a new language needs three translated lines, and recorded audio if the user cannot read.
