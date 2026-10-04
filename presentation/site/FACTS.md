# FACTS: outside claims for the ShhS page

Checked on 2026-10-04. This file covers twelve claims. It is for the people who build the page.

## How to read this file

Verdicts:

- VERIFIED: a source I opened says it.
- VERIFIED WITH A CHANGE: a source says something close. Use the corrected wording.
- UNVERIFIED: no source I opened says it. Do not publish it.
- WRONG: the source says something different.

How I read each source:

- "Read directly" means I looked at the document itself: a PDF page, a local file, or the full text.
- "Via fetch tool" means a fetch tool summarised a web page for me. I did not see the raw text. I give the numbers as returned, and a second source where I found one.

Quotes are short on purpose. Lines marked "Safe wording" are ours, so we can put them on the page.

## Verdicts at a glance

| # | Claim | Verdict |
| --- | --- | --- |
| 1 | FAO: up to 40 percent of food crops lost | VERIFIED |
| 2 | Mohanty et al. 2016: 99.35 percent, then about 31 percent | VERIFIED WITH A CHANGE |
| 3 | Coffee leaf rust: cause, look, effect, spread, scale | VERIFIED, one wording change |
| 4 | 25 million smallholders produce 80 percent of coffee | VERIFIED WITH A CHANGE |
| 5 | BRACOL dataset | VERIFIED |
| 6 | Gemma 4 E2B-it | VERIFIED, open points on Android |
| 7 | Kenya JMuBEN set | VERIFIED, one open point |
| 8 | Uganda coffee leaf set | VERIFIED WITH A CHANGE (title) |
| 9 | Klein et al. 2024 | VERIFIED WITH A CHANGE |
| 10 | Wadhwani AI papers | 10a VERIFIED WITH A CHANGE. 10b WRONG as worded. |
| 11 | Kiswahili phrases | Mostly natural. A native speaker must check. |
| 12 | AgriConnect | VERIFIED WITH A CHANGE |

---

## 1. FAO: up to 40 percent of food crops lost to pests and diseases

Claim: Up to 40 percent of global food crops are lost to plant pests and diseases every year.

Verdict: VERIFIED. Keep the words "up to".

Safe wording: "Plant pests and diseases destroy up to 40 percent of the world's food crops every year (FAO, 2019)."

Sources:

- FAO, "FAO launches 2020 as the UN's International Year of Plant Health". FAO newsroom, News, Rome, 2 December 2019. https://www.fao.org/newsroom/detail/FAO-launches-2020-as-the-UN-s-International-Year-of-Plant-Health/en (via fetch tool). Short quote: "up to 40 percent of global food crops are lost".
- IPPC, "The official launch event of the International Year of Plant Health". Posted 3 December 2019. https://ippc.int/en/news/the-official-launch-event-of-the-international-year-of-plant-health/ (via fetch tool). It gives the same number, credits FAO, and ties it to the Director-General's opening remarks. It links to the old FAO address (fao.org/news/story/en/item/1253551/icode/). That address now returns HTTP 404, so cite the newsroom address above.
- FAO, "International Year of Plant Health 2020", about page. https://www.fao.org/plant-health-2020/about/en/ (via fetch tool). It says up to 40 percent in one place and gives a range of 20 to 40 percent in its key messages. FAO uses both, so "up to 40 percent" is the safe line.

Caution. The number is an upper bound. Savary et al. (2019) estimated average losses for five crops: potato 17.2 percent, soybean 21.4, wheat 21.5, maize 22.5 and rice 30.0. Their ranges reach 41.1 percent. Source: Savary S, Willocquet L, Pethybridge SJ, Esker P, McRoberts N, Nelson A (2019), "The global burden of pathogens and pests on major food crops", Nature Ecology & Evolution 3:430-439, doi 10.1038/s41559-018-0793-y. Abstract read via https://pure.psu.edu/en/publications/the-global-burden-of-pathogens-and-pests-on-major-food-crops/ (fetch tool). I did not check whether the FAO figure comes from this paper.

Not verified. The FAO text also gives a dollar figure of about 220 billion US dollars a year. The fetch tool described it in two different ways and I did not see the raw sentence. UNVERIFIED. Do not use it.

---

## 2. Mohanty, Hughes and Salathe (2016)

Claim: A deep network reached 99.35 percent accuracy on a held-out PlantVillage test set. Accuracy fell to about 31 percent on images taken under other conditions.

Verdict: VERIFIED WITH A CHANGE. The numbers are right. Use the exact figures below, and do not say the 31 percent sits in the Frontiers abstract.

Exact figures (via fetch tool; the abstract and the key sentences came back as text):

- Data: 54,306 leaf images, 14 crop species, 26 diseases. With healthy leaves that makes 38 classes. The abstract says the images were taken under controlled conditions.
- 99.35 percent is overall accuracy on a held-out test set. The best model was GoogLeNet with transfer learning on colour images, trained on 80 percent of the images and tested on the other 20 percent. Mean F1 was 0.9934.
- Outside test: two small sets of images found through Bing Image Search and IPM Images, checked by eye. Set 1 has 121 images. Set 2 has 119 images. Accuracy was 31.40 percent on set 1 and 31.69 percent on set 2. The model had to pick one of 38 classes. Random guessing scores 2.63 percent. The text also says "just above 31%".
- The authors tie the drop to the training data. PlantVillage was collected in a controlled environment.

Where the 31.4 appears. It is in the abstract of the arXiv version (arXiv:1604.03169, April 2016) and in the Results of the Frontiers paper. The Frontiers abstract has no 31 percent figure.

Safe wording: "A model trained on PlantVillage leaf photos scored 99.35 percent on held-out PlantVillage photos. On two small sets of photos taken under other conditions it scored about 31 percent (31.4 and 31.7 percent)."

Source: Mohanty SP, Hughes DP, Salathe M (2016). "Using Deep Learning for Image-Based Plant Disease Detection". Frontiers in Plant Science 7:1419. doi 10.3389/fpls.2016.01419.
https://www.frontiersin.org/articles/10.3389/fpls.2016.01419/full
https://pmc.ncbi.nlm.nih.gov/articles/PMC5032846
https://arxiv.org/abs/1604.03169

---

## 3. Coffee leaf rust (Hemileia vastatrix)

Verdict by part:

- Cause is a fungus: VERIFIED.
- Yellow-orange powdery spots on the underside, later brown: VERIFIED.
- Early leaf fall and lower yield: VERIFIED.
- Spreads by wind and rain splash: VERIFIED WITH A CHANGE. Write "wind and rain". No source I opened says "rain splash".
- Scale, Central America 2012-13: VERIFIED. The best figures are below.

What the sources say.

Cause. A rust fungus. Cenicafe calls it a basidiomycete of the order Uredinales. [A]

Look. The first spots are small and pale yellow, 2 to 3 mm wide, and grow up to 15 mm. The underside shows yellow-orange powder, which is the spores. Later the centre of the spot turns brown, with a yellow edge. Spots can join and cover the blade. [B] Cenicafe gives the same picture. It says one lesion can cover up to 25 percent of a leaf. [A, p. 149]

Effect. Infected leaves fall early. Severe cases also kill back branches. [A, B, C]

Yield. The sources give different numbers because they measure different things. Pick one source and name it. Do not write a yield figure without a source.

- Cenicafe: in a severe epidemic year, production fell by up to 19.5 percent in the same crop cycle, and the next year's crop was hit too. [A, pp. 151-152]
- Pacific Pests fact sheet: a 30 to 50 percent loss of yield is possible. [B]
- Plantwise factsheet: up to 70 percent in severe cases. [C]

Spread. Spores travel on wind and rain, and they need water to start growing. [A, p. 151; B] Insects can also carry them. [B] People can carry the powder on clothes and skin. [C] Infonet-Biovision also says wind and rain. I read that page via the fetch tool. https://infonet-biovision.org/crops-fruits-vegetables/coffee-revised

Scale. Best-sourced figures, crop year 2012/13:

- ICO report ED 2157/13 (13 May 2013), Table 1, using PROMECAFE figures. It covers eight countries: Costa Rica, Dominican Republic, El Salvador, Guatemala, Honduras, Jamaica, Nicaragua and Panama. Estimated loss: 2,706,454 bags of 60 kg, worth US$ 499.4 million. Job losses: 373,584. The text says "some 374,000". Area hit: 593,037 of 1,082,421 hectares. The text says more than 50 percent of the coffee area in Central America was hit. Incidence: El Salvador 74 percent, Guatemala 70, Costa Rica 64, Nicaragua 37, Honduras 25. The ICO says 2.7 million bags equals a 17.1 percent drop from the 2011/12 crop of 15.8 million bags. These are estimates from May 2013, not final counts. [D]
- Avelino et al. (2015), peer reviewed. Central American production fell 16 percent in 2013 compared with 2011-12, and 10 percent in 2013-14 compared with 2012-13. In Colombia it fell 31 percent on average in the epidemic years compared with 2007. [E]
- The ICO report also says the Council called it the worst epidemic since the rust first reached Central America in 1976. [D, para 1]

Safe wording: "In crop year 2012/13, coffee leaf rust cost Central America and nearby countries an estimated 2.7 million bags of coffee, worth about 500 million US dollars, and about 374,000 jobs (ICO, May 2013)."

Sources:

- [A] Gil Vallejo LF (2003). "Roya anaranjada Hemileia vastatrix Berk. y Br.", chapter 20 in Gil LF, Castro BL, Cadena G (eds), "Enfermedades del cafeto en Colombia". Cenicafe, Manizales. ISBN 958-97218-5-0. The chapter runs pp. 149-163. I read pp. 149-152 (read directly, scanned pages). https://biblioteca.cenicafe.org/jspui/bitstream/10778/993/22/20.%20Roya%20anaranjada.pdf
- [B] Jackson G (2020). "Coffee rust (141)", Pacific Pests, Pathogens and Weeds fact sheets. Made with ACIAR support by the University of Queensland and the Pacific Community (read directly). https://apps.lucidcentral.org/ppp_v9/pdf/web_full/coffee_rust_141.pdf
- [C] Mushimiyimana S, Nduwayezu A (Rwanda Agriculture Board), edited by Plantwise (CABI) (2012). "Coffee leaf rust". Factsheets for Farmers, code RW014En, created in Rwanda, May 2012, CC-BY-SA 4.0 (read directly). https://factsheetadmin.plantwise.org/Uploads/PDFs/20127801774.pdf
- [D] International Coffee Organization (2013). "Report on the outbreak of coffee leaf rust in Central America and Action Plan to combat the pest". Document ED 2157/13, 13 May 2013 (read directly). https://www.ico.org/documents/cy2012-13/ed-2157e-report-clr.pdf
- [E] Avelino J, Cristancho M, Georgiou S, Imbach P, Aguilar L, Bornemann G, Laderach P, Anzueto F, Hruska A, Morales C (2015). "The coffee rust crises in Colombia and Central America (2008-2013): impacts, plausible causes and proposed solutions". Food Security. doi 10.1007/s12571-015-0446-9. https://link.springer.com/article/10.1007/s12571-015-0446-9 . I read the abstract text through a Semantic Scholar record. The publisher page redirected to a login handshake, so I did not open the full paper.

The CABI Invasive Species Compendium page returned HTTP 403. I used the Plantwise factsheet (a CABI programme) and the sources above instead.

---

## 4. Smallholders in coffee

Claim: About 25 million smallholder farmers produce about 80 percent of the world's coffee.

Verdict: VERIFIED WITH A CHANGE. Both numbers appear in primary sources, but not in this combined form.

What the sources say:

- FAO Director-General Qu Dongyu, statement to the UN Food Systems Summit Stocktake (UNFSS+4) panel on the coffee value chain, 27 July 2025. He says more than 25 million farmers depend on coffee. He also says smallholders produce 80 percent of the world's supply. Short quote: "Smallholders produce 80% of the world's supply". (via fetch tool) https://www.fao.org/director-general/speeches/details/un-food-systems-summit-stocktake-(unfss-4)-high-level-panel---advancing-transformation-of-the-coffee-value-chain--statement/en
- A second FAO page of the same date, "FAO Director-General: Transforming the global coffee value chain is more than just an economic necessity", says more than 25 million farmers depend on coffee and most are smallholders. It gives no 80 percent. (via fetch tool) https://www.fao.org/newsroom/detail/fao-director-general--transforming-the-global-coffee-value-chain-is-more-than-just-an-economic-necessity/en
- ICO, "Draft strategic action plan for the International Coffee Organization", WP-Council 173/08 Rev. 5, 23 July 2010 (read directly). The executive summary says coffee gives a livelihood to 25 million smallholder farmers and their families. Section I, paragraph 1 (p. 4) says: "25 million smallholder farmers and their families who produce 80% of world production". https://ico.org/documents/wp-council-173e-r5-action-plan.pdf

Two limits. The ICO words "and their families" leave it unclear whether 25 million counts farmers only. The ICO figure is also about 16 years old.

Not found. The Fairtrade library page I opened has no such sentence. For the ICO Coffee Development Report 2019 I opened only the cover note (ED 2320/19), which has no figures. A search summary credits a figure of up to 25 million farmers and their families to that report. UNVERIFIED.

Safe wording: "More than 25 million farmers depend on coffee, and smallholders grow about 80 percent of the world's coffee (FAO, July 2025)."

Do not write "25 million smallholder farmers produce 80 percent". FAO says 25 million farmers, not all of them smallholders. The ICO says farmers and their families.

---

## 5. BRACOL dataset

Claim: BRACOL has 1,747 leaf images taken with five phones, under CC BY 4.0. The severity scale 0 to 4 is the share of leaf area with symptoms.

Verdict: VERIFIED. The "0 to 4" numbers are our file's codes, not the paper's. The paper uses five named bands.

Sources:

- Dataset: Krohling RA, Esgario JGM, Ventura JA (2019). "BRACOL - A Brazilian Arabica Coffee Leaf images dataset to identification and quantification of coffee diseases and pests". Mendeley Data, V1, published 6 November 2019. doi 10.17632/yy2k5y8mxg.1. CC BY 4.0. https://data.mendeley.com/datasets/yy2k5y8mxg/1 (via fetch tool, two fetches agree).
- Paper: Esgario JGM, Krohling RA, Ventura JA (2020). "Deep learning for classification and severity estimation of coffee leaf biotic stress". Computers and Electronics in Agriculture 169:105162. doi 10.1016/j.compag.2019.105162. I read the arXiv version 1 (arXiv:1907.11561, 26 July 2019) directly. https://arxiv.org/abs/1907.11561 . The DOI resolves to Elsevier, but I could not open the paywalled text, so page numbers below are for the arXiv PDF. The Mendeley page lists this arXiv paper as the related publication.
- Local copy: /Users/santiago/Downloads/BRACOL_coffee_leaf_images. Its README says the files came from github.com/esgario/lara2018.

Which source states which fact:

| Fact | Mendeley page | Paper (arXiv v1) | Our local copy |
| --- | --- | --- | --- |
| Leaf images | 1,747 | 1,747 (Sec. 2.1, p. 3) | 1,747 files and 1,747 rows in dataset.csv |
| Cropped symptom images | 2,147 | 2,147, plus 575 from Barbedo (2019), total 2,722 (p. 4) | not downloaded |
| Phones | five: ASUS Zenfone 2, Xiaomi Redmi 5A, Xiaomi S2, Galaxy S8, iPhone 6S | same five (p. 3) | not applicable |
| Image size | not stated | not stated in the text. Fig. 4 (p. 6) shows a 2048 x 1024 x 3 input | all 1,747 files are 2048 x 1024 pixels |
| Licence | CC BY 4.0 | not stated | not stated |
| Setting | underside (abaxial) of the leaf, white background | same, plus "partially controlled conditions", Espirito Santo state, Brazil, labels assisted by a specialist (p. 3) | not applicable |
| Severity | five bands in percent | five bands, and how they were computed (pp. 3-4) | severity code 0 to 4 |

Severity. It is the share of the leaf area that shows symptoms. The authors got it from automatic leaf and symptom masks, checked every mask by eye, and had a specialist score the images with poor masks (p. 4). The five bands:

| Our code | Name in the paper | Share of leaf area |
| --- | --- | --- |
| 0 | healthy | under 0.1 percent |
| 1 | very low | 0.1 to 5 percent |
| 2 | low | 5.1 to 10 percent |
| 3 | high | 10.1 to 15 percent |
| 4 | very high | over 15 percent |

I derived the code-to-name mapping, because the paper gives no numbers. It rests on counts. Our file has 272, 924, 332, 101 and 56 leaves for codes 0 to 4. Those are the paper's Table 1 counts for healthy, very low, low, high and very high. The same counts match for the stress classes: healthy 272, miner 387, rust 531, brown leaf spot 348 (our code 3, named "phoma" in the file) and cercospora 147. The 62 images with code 5 ("undetermined") match the 62 leaves the paper dropped because several stresses had similar severity. That leaves 1,685 leaves in the paper's leaf dataset.

Two facts from the local file that matter for a "rust yes or no" screen:

- 531 leaves have rust as the main stress. 684 leaves carry the rust flag, which includes leaves where rust is a second stress.
- Of the 531 main-rust leaves, 313 (59 percent) sit in the very low band, 134 in low, 45 in high and 39 in very high.

Safe wording: "BRACOL: 1,747 photos of Arabica coffee leaves taken with five smartphones in Espirito Santo, Brazil, with the leaf underside on a white background (Krohling, Esgario and Ventura, 2019, CC BY 4.0)."

---

## 6. Gemma 4 E2B-it

Claim: Gemma 4 E2B-it has 2.3 billion effective parameters, uses Apache 2.0, takes text, image and audio, and has a 128K context. The Android build is a file of about 2.6 GB that needs the LiteRT-LM runtime.

Verdict: VERIFIED. Open points on the Android minimum version are listed at the end.

From the local model card (read directly): /Users/santiago/GitHub/ShhS/models/gemma-4-E2B-it/README.md and config.json.

- Parameters, as the card states them. The E2B column reads "2.3B effective (5.1B with embeddings)". The row is labelled "Total Parameters", so do not read 2.3B as the total. The card says the E stands for "effective" and that per-layer embeddings make the total much larger.
- Cross-check by arithmetic. The local model.safetensors is 10,246,621,918 bytes. config.json says bfloat16, which is 2 bytes per parameter. That gives about 5.12 billion parameters, which matches 5.1B.
- Other size facts on the card: 35 layers, sliding window 512 tokens, vocabulary 262K, vision encoder about 150M parameters, audio encoder about 300M.
- Licence: Apache 2.0. The header and the front matter say so, and link to ai.google.dev/gemma/docs/gemma_4_license.
- Inputs: text, image and audio for E2B. Video works as frames. Output is text. Audio is limited to 30 seconds. Video is limited to 60 seconds at one frame per second.
- Context length: 128K tokens for E2B. config.json has max_position_embeddings 131072.
- Image token budgets: 70, 140, 280, 560 and 1120. The card advises lower budgets for classification. config.json has 280 as the default output length.

From the web: Hugging Face model litert-community/gemma-4-E2B-it-litert-lm (via fetch tool). Model page: https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm . File list from the Hugging Face API: https://huggingface.co/api/models/litert-community/gemma-4-E2B-it-litert-lm?blobs=true . Last modified 2026-08-31, licence Apache-2.0, library tag litert-lm. GB here means 1,000,000,000 bytes.

| File | Bytes | GB |
| --- | --- | --- |
| gemma-4-E2B-it.litertlm | 2,588,147,712 | 2.59 |
| gemma-4-E2B-it-gpu.litertlm | 2,008,432,640 | 2.01 |
| gemma-4-E2B-it-web.litertlm | 2,008,432,640 | 2.01 |
| gemma-4-E2B-it-web.task | 2,003,697,664 | 2.00 |
| gemma-4-E2B-it_Google_Tensor_G5.litertlm | 3,113,545,589 | 3.11 |
| gemma-4-E2B-it_Google_Tensor_G6.litertlm | 3,313,938,293 | 3.31 |
| gemma-4-E2B-it_intel_LNL.litertlm | 2,960,506,880 | 2.96 |
| gemma-4-E2B-it_intel_PTL.litertlm | 2,948,333,568 | 2.95 |
| gemma-4-E2B-it_qualcomm_qcs8275.litertlm | 3,294,593,024 | 3.29 |
| gemma-4-E2B-it_qualcomm_sm8750.litertlm | 3,016,294,400 | 3.02 |

The Hugging Face file tree page shows the same sizes in GB, which I checked as a second read. The card's own size table says 2583 MB (standard), 2967 MB (NPU) and 2008 MB (web). The standard build is 2,588,147,712 bytes in the file list. The small gap is unexplained. Use the byte count.

Runtime:

- It needs LiteRT-LM, Google's on-device LLM runtime built on LiteRT. The Kotlin API is listed as Stable. CLI, Python and C++ are also Stable. Swift and JavaScript are early preview. https://developers.google.com/edge/litert-lm/overview and https://github.com/google-ai-edge/LiteRT-LM (via fetch tool)
- The Android guide gives the Gradle line implementation("com.google.ai.edge.litertlm:litertlm-android:latest.release"). https://developers.google.com/edge/litert-lm/android (via fetch tool)
- The docs list vision and audio support. The Kotlin guide lists image and audio content types and says they work only with models that have multi-modality support. Its example names Gemma 3n, not Gemma 4. The model card says the vision and audio models "are loaded on demand" to save memory. I read that as meaning the file bundles them. That is my inference.
- The card's benchmark on a Samsung S26 Ultra uses text prompts (1024 prefill and 256 decode tokens, context 2048). CPU: 557 tokens per second prefill, 46.9 decode, 1.8 seconds to first token, 1733 MB memory. GPU: 3,808 prefill, 52.1 decode, 0.3 seconds, 676 MB. These are text numbers on a flagship phone. They say nothing about photo classification.

Not verified:

- The minimum Android API level. None of the official pages I opened state it. A search summary said API 24. I found no page that says so. UNVERIFIED.
- The card's 32K context limit for this build, and its line that Android AI Core offers Gemma 4 as Gemini Nano on supported devices. Both came through the fetch tool. I did not see the raw text.
- Whether a fine-tuned checkpoint can be turned into a .litertlm file. The page does not cover it.

Safe wording: "Gemma 4 E2B has 2.3 billion effective parameters (5.1 billion counting embeddings), reads text, images and audio, and is released under Apache 2.0. Google's LiteRT-LM build for phones is one file of about 2.6 GB."

---

## 7. Kenya coffee leaf set (JMuBEN)

Claim: JMuBEN has 58,555 images, taken with a Fujifilm X-T4 at one plantation, in five classes, under an open licence.

Verdict: VERIFIED. One open point: whether the count includes augmented copies.

Paper (via fetch tool): Jepkoech J, Mugo DM, Kenduiywo BK, Too EC (2021). "Arabica coffee leaf images dataset for coffee leaf disease detection and classification". Data in Brief 36:107142. doi 10.1016/j.dib.2021.107142. Received 31 March 2021, accepted 5 May 2021, online June 2021. Open access under CC BY. https://pmc.ncbi.nlm.nih.gov/articles/PMC8165403

Facts from the paper:

- 58,555 leaf images in five classes: healthy 18,985, miner 16,979, rust 8,337, cercospora 7,682, phoma 6,572. The classes add up to 58,555.
- Camera: Fujifilm X-T4, APS-C sensor, 26.1 MP. Files are JPEG. It is not a phone.
- One site: Mutira coffee plantation, Kirinyaga County, Kenya.
- Taken on sunny, windy and cloudy days. Both the upper and the lower side of healthy and infected leaves, on the plant.
- Labelled by hand in a web labelling tool, with help from one pathologist.

Mendeley Data records (via fetch tool). Two records, both published 26 March 2021 by Jepkoech and co-authors, both CC BY 4.0:

- "JMuBEN", doi 10.17632/t2r6rszp5c.1, 22,591 images of rust, cercospora and phoma. https://data.mendeley.com/datasets/t2r6rszp5c/1
- "JMuBEN2", doi 10.17632/tgv3zb82nd.1, the healthy and miner images. https://data.mendeley.com/datasets/tgv3zb82nd/1

The paper's data section, as the fetch tool returned it, lists these two DOIs the other way round. The Mendeley page titles are the safer guide. For rust against healthy we need both records, because the paper puts the healthy and miner images in JMuBEN2.

Open point. The paper describes noise filtering, centre-square cropping and augmentation by rotation and flipping (Section 3). It does not say whether 58,555 counts images before or after augmentation. The Mendeley pages also mention cropping and augmentation. So I cannot confirm that all 58,555 are distinct photos. UNVERIFIED. Say "images", not "photos", and look for near-duplicates before a stress test.

Safe wording: "JMuBEN: 58,555 labelled Arabica coffee leaf images in five classes, taken with a Fujifilm X-T4 camera at one plantation in Kirinyaga County, Kenya (Jepkoech et al., 2021, CC BY)."

---

## 8. Uganda coffee leaf set

Claim: "Coffee leaf diseases in Uganda" by Chelangat, Anirwoth, Mayanja and Sserwadda, Mendeley Data 2025, doi 10.17632/k36wnd6knb.1, CC BY 4.0, smartphone photos.

Verdict: VERIFIED WITH A CHANGE. The title is different. The authors, DOI and licence are right.

Facts (via fetch tool, two fetches agree). https://data.mendeley.com/datasets/k36wnd6knb/1

- Title: "A Machine Learning Dataset for Classification of Common Coffee Leaf Diseases in Uganda".
- Authors in order: Specioza Chelangat, Racheal Anirwoth, Kizito Najib Mayanja, Abubakhari Sserwadda. Institution: Soroti University.
- Mendeley Data, V1, published 7 February 2025. doi 10.17632/k36wnd6knb.1. Licence CC BY 4.0.
- 3,312 labelled images in three classes: healthy 1,179, coffee leaf rust 1,023, phoma 1,110. The classes add up.
- JPEG, 256 x 256 pixels. Taken with a smartphone camera on farms in Uganda, in daylight and in low light, on leaves at early, medium and advanced growth stages. No phone model is named.
- The page says rotation, flipping and brightness changes were applied to balance the classes. It does not say whether the 3,312 includes those copies. Say "images", and check for near-duplicates before using the set as a test.

Safe wording: "A Ugandan set of 3,312 smartphone images of coffee leaves (healthy, coffee leaf rust, phoma), published by Soroti University researchers in 2025 under CC BY 4.0."

---

## 9. Klein et al. 2024: synthetic data for tomato disease detection

Paper: Klein J, Waller R, Pirk S, Palubicki W, Tester M, Michels DL (2024). "Synthetic data at scale: a development model to efficiently leverage machine learning in agriculture". Frontiers in Plant Science 15:1360113. doi 10.3389/fpls.2024.1360113. Published 16 September 2024. Read directly from /Users/santiago/GitHub/ShhS/docs/klein-2024-synthetic-data-at-scale.pdf (16 pages). Page numbers below are the printed page numbers.

Verdict: VERIFIED WITH A CHANGE. The 26 of 29 is right. Four cautions must travel with it.

Answers:

- Crop and disease (abstract p. 1, Sec. 5 p. 7). Tomato (Solanum lycopersicum) grown in a greenhouse. The classifier has two classes, healthy and infected. The paper names no disease. Figure 10 (p. 11) shows leaf textures from several disease types but gives no names. Write "infected tomato leaves", not a disease name.
- Training data (abstract p. 1, Sec. 5 pp. 7-10, Appendix 1.2 p. 15). Only synthetic images, made with procedural plant models and textures and rendered in Blender.
- Real test images (Sec. 5.7 p. 11, Figs. 9 and 11 on pp. 10-11). 29 real greenhouse photos. 19 show infected leaves and 10 show healthy leaves. The text gives 29 and 19. The 10 healthy follows by subtraction and matches the letters A to J on Figure 11.
- Correct count (Sec. 5.7 p. 11). 26 of 29. The paper writes 89.6 percent. 26 divided by 29 is 89.66 percent, which rounds to 89.7. Write "26 of 29" or "about 90 percent". The target set before the work was about 90 percent (p. 7).
- First iterations. Average accuracy on the 19 real infected photos, from the panel titles of Figure 9 (p. 10): iteration 1 scored 4.77 percent, 2 scored 24.29, 3 scored 25.44, 4 scored 17.87, 5 scored 21.93 and 6 scored 45.45. Healthy photos stayed at about 82 to 98 percent in iterations 1 to 6 (Fig. 8, p. 10, read off the plot). The text on p. 8 says almost all real photos were called healthy at first.
- What changed, by iteration:
  - 1 (p. 8): 3,400 images, half healthy and half infected. Input 256 x 256. Basic augmentation.
  - 2 (p. 8): a second, slightly blurred branch in the background to mimic greenhouse clutter. 2,472 new images. More augmentation (blur, contrast, hue, noise). Better, not enough.
  - 3 (pp. 8-9): stronger augmentation on the same images. Only a small gain.
  - 4 (p. 9): more disease types in the texture generator. 6,400 images. Training got harder.
  - 5 (p. 10): augmentation back to the level of iteration 2. Overall about the same as iteration 3, but spread more evenly over the photos.
  - 6 (pp. 10-11): medium augmentation for the first half of training, then strong augmentation. Same images.
  - Final step (Sec. 5.7 p. 11): classify each photo many times with random augmentation (32 times in Fig. 11). Call a photo infected when its healthy score is below 80 percent. That gave 26 of 29.
- Total effort (pp. 12-13): 125.5 hours, 64 hours of human work and 61.5 hours of computing.

Four cautions:

1. The 80 percent rule was chosen after looking at these same 29 photos. The plain 50 percent rule gave only 75 percent (pp. 11-12). So 26 of 29 is a tuned result, not a clean test.
2. The test is small and comes from one greenhouse.
3. The best fixes were changes to how the images look (clutter, extra disease textures, augmentation), not a more realistic leaf. The paper says photorealism was not the main driver (p. 13).
4. Section 5.9 (p. 12) trained the same network on real tomato leaf photos: a community extension of PlantVillage. The original PlantVillage tomato set has about 5,500 pictures of detached leaves on grey, and the extension adds leaves in natural settings. Accuracy on its own validation images was very high. On the authors' greenhouse photos it was "barely better than random guessing". The paper reads this as a domain gap.

Safe wording: "In a tomato greenhouse study, a classifier trained only on synthetic images first called nearly every sick leaf healthy (4.8 percent of sick leaves right). After six rounds of fixes and a tuned decision threshold, it got 26 of 29 real photos right (Klein et al., 2024)."

---

## 10. Wadhwani AI

### 10a. Phone, cloud, human (arXiv 2402.00015)

Paper: Agrawal C, Papanai A, White J (2024). "Maintaining User Trust Through Multistage Uncertainty Aware Inference". arXiv:2402.00015 (v1 28 December 2023, v2 15 April 2024). Wadhwani Institute for Artificial Intelligence. Presented at the Deployable AI Workshop, AAAI-2024. https://arxiv.org/abs/2402.00015 . Read directly (v2 PDF).

Verdict: VERIFIED WITH A CHANGE. The title, authors, phone model and human step are right. Two changes: the app name, and the cloud model's size.

- Pipeline (Fig. 1, p. 2). A trap photo goes to the phone model (YOLOv8 small). If it is unsure, the photo goes to a larger cloud model. If that one is unsure, a human expert judges. The output is a spray recommendation. Caption: "If the cloud model is uncertain, a human expert is engaged." The paper treats the human answer as certain and accurate.
- Phone model (p. 2). YOLOv8 small, 11.2 million parameters. The Ultralytics docs also list 11.2 M for YOLOv8s.
- Cloud model (p. 2). The text says YOLOv5x6 xlarge with 43.7 million parameters. Figure 1 labels it YOLOv5 xlarge. The Ultralytics docs list 43.7 M for YOLOv8l and 155.5 M for YOLOv5x6 (YOLOv5u table). So the two statements do not fit each other. Do not quote the cloud model's size. Say "a larger cloud model". https://docs.ultralytics.com/models/yolov8/ and https://docs.ultralytics.com/models/yolov5/ (via fetch tool)
- Task (p. 2). Count pink and American bollworms in photos of pheromone trap contents. Zero pests means no action, one to seven means be cautious, eight or more means spray. The validation set has 2,093 images (698, 728 and 667 in the three groups).
- Why a small phone model (p. 2). Farmers resist apps above about 50 MB, and field internet is weak, so the phone model must be small and work offline.
- Timing (pp. 2-3). Users would wait up to 24 hours in small tests. In one deployment the phone answered in under a second. The cloud took about seven hours on average, and the most common wait was nearly 12 hours.
- Scale (abstract and p. 1). The abstract says thousands of cotton farmers across India use the architecture. The introduction says a variant of these models is the one in use.
- App name. "CottonAce" is not in the paper. It is the product name on Wadhwani AI's page, which says farmers and field officers snap a trap photo and get advice in their language, in 9 Indian languages, offline-ready. https://aiopportunity.wadhwaniai.org/main-page-dev-lib/cottonace (via fetch tool). Cite both pages.

Safe wording: "Wadhwani AI's cotton pest app first runs a small model on the phone (YOLOv8 small, 11.2 million parameters). If that model is unsure, the photo goes to a larger model in the cloud. If that one is unsure too, a human expert decides (Agrawal, Papanai and White, 2024)."

### 10b. Rejection (arXiv 2208.06359)

Paper: White J, Madaan P, Shenoy N, Agnihotri A, Sharma M, Doshi J (2022). "A Case for Rejection in Low Resource ML Deployment". arXiv:2208.06359 (v1 12 August 2022, v2 15 August 2022). Wadhwani AI. NeurIPS 2022 workshop on challenges in deploying and monitoring machine learning systems (venue as cited in the 2402.00015 reference list). https://arxiv.org/abs/2208.06359 . Read directly.

Claim as we had it: rejecting the least confident 10 percent of predictions cuts error by about 66 percent.

Verdict: WRONG as worded.

What the paper says (p. 2, on Figure 1). The curves with rejection above zero show what happens when an oracle throws away the worst-performing images, the ones with the highest error. The text then says: "at just 10 percent, K20h can be improved by almost 66 percent." It adds that rejecting 90 percent would give a near-perfect error but would burden users. The authors say a real system cannot do this, because the oracle knows each image's error in advance. They use it to set bounds.

Three differences from our wording:

1. It is an oracle that knows the error, not a filter that uses model confidence.
2. The measure is mean absolute error of bollworm counts, not a classification error rate.
3. It applies to one test set, K20h. That is the 2020 kharif season (July to December), scored by models trained only on earlier seasons.

For the real confidence-based filter, the text gives no percentage. Figure 5 plots error against rejected share. I could not read an exact figure from it. UNVERIFIED.

Safe wording: "In a Wadhwani AI study of cotton pest counting, an ideal filter that discarded the worst 10 percent of photos would have cut the counting error on one test season by almost 66 percent. A real filter cannot know which photos are worst, so this is a best case, not a result."

---

## 11. Kiswahili phrases for a farmer's phone screen

A native speaker must still check all seven phrases. I am not one. Where I write "my assessment", no public source I opened confirms the point.

What I found. I found no Swahili extension leaflet from TaCRI, Kenya or Uganda that names coffee leaf rust. Plantwise factsheets are in English. The best primary text is a Tanzanian ministry speech. The other Swahili sources are a farm-advice blog and an app library, which are weaker.

Sources:

- Tanzania Ministry of Agriculture, Food Security and Cooperatives, "Hotuba ya Waziri wa Kilimo Chakula na Ushirika, Mheshimiwa Stephen Wasira (MB.), kuhusu makadirio ya matumizi ya fedha ... kwa mwaka 2007/2008". Paragraph 18 pairs chule buni (coffee berry disease) with the words "kutu ya majani (Coffee Leaf Rust - CLR)". Paragraphs 37 and 38 and a training list use the terms maafisa ugani, wataalam wa ugani and mabwana shamba. Read directly as text. https://www.kilimo.go.tz/uploads/speeches/sw1731303825-BSpeech_2007-08.pdf
- Plantix, Swahili library page for coffee rust. The page title is "Kutu ya Kahawa". It also uses jani, madoa, manjano, machungwa, unga and upande wa chini for the symptoms. Via fetch tool. https://plantix.net/sw/library/plant-diseases/100360/rust-of-coffee/
- Blog "Mitiki - Kilimo Kwanza", post "KUTU YA MAJANI - COFFEE LEAF RUST", 28 December 2009. It uses "Kutu ya Majani" and "Kutu ya Majani ya kahawa". Via fetch tool. It credits no research body, so treat it as a weak source. http://mitiki.blogspot.com/2009/12/kutu-ya-majani-coffee-leaf-rust.html
- Wiktionary entries for kutu (rust), picha, piga (the phrase "piga picha" means take a photo), ndiyo, hapana, uhakika and jaribu. Via fetch tool. https://en.wiktionary.org/wiki/kutu and the matching pages for the other words.

| Phrase | Meaning | Verdict | Evidence | Better option |
| --- | --- | --- | --- | --- |
| Kutu ya majani | leaf rust | Natural. The standard term. | The ministry speech, the blog and Plantix all use it or a close form. Wiktionary gives kutu as "rust". | Use "Kutu ya majani ya kahawa" for the full name. Add a photo, because kutu is the general word for rust (my assessment). |
| Piga picha ya jani | take a photo of the leaf | Natural | Wiktionary lists "piga picha" as take a photo. I opened no farm app that uses it. | "Piga picha ya jani moja la kahawa" if the screen must say one coffee leaf. |
| Ndiyo / Hapana | yes / no | Natural | Wiktionary: ndiyo is yes, hapana is no. | On the result screen "Kuna kutu" and "Hakuna kutu" read better than a bare yes or no. Keep Ndiyo and Hapana for questions. |
| Sina uhakika | I am not sure | Natural | uhakika means certainty. "Sina" is "I do not have". | None needed. |
| Muulize afisa ugani | ask the extension officer | Grammatical, but not the usual wording | "Afisa ugani" is the official Tanzanian title, seen in the speech above. I found no Kenyan or Ugandan source for it. I found no source for "Muulize". | "Wasiliana na afisa ugani" (contact the extension officer) or "Uliza afisa ugani". Ask a Kenyan speaker whether "afisa wa kilimo" is more common there (my assessment, unchecked). |
| Jaribu tena | try again | Natural | Wiktionary: jaribu is to try. I opened no app string with the full phrase. | None needed. |
| Hakuna kutu | no rust | Correct grammar, but too strong | hakuna means there is none. A photo model can say it sees no signs. It cannot prove a leaf is healthy. | "Hakuna dalili za kutu" (no signs of rust) and "Kuna dalili za kutu" (there are signs of rust). "Dalili" means signs or symptoms (my knowledge, not opened). |

---

## 12. World Bank AgriConnect

Claim: AgriConnect aims to reach 300 million farmers and double annual agribusiness investment to 9 billion dollars by 2030.

Verdict: VERIFIED WITH A CHANGE. The word "investment" is wrong. The 9 billion dollars is the World Bank Group's own financing.

Facts (via fetch tool):

- AgriConnect page on worldbank.org. AgriConnect is a World Bank Group initiative to "transform farming for 300 million smallholders". https://www.worldbank.org/ext/en/agriconnect
- "Farming and Agribusiness" topic page on worldbank.org. It says AgriConnect aims at 300 million farmers by 2030, and that the Group's collective agribusiness financing will double to 9 billion dollars a year by 2030. https://www.worldbank.org/ext/en/topic/farming-and-agribusiness
- Press release, "World Bank Group Announces Strategic Pivot in Agribusiness, Doubles Financial Commitment", 23 October 2024. The Group is doubling its "agri-finance and agribusiness commitments to $9 billion annually by 2030". It also aims to mobilise another 5 billion dollars of private capital. The release does not use the name AgriConnect or the 300 million figure. https://www.worldbank.org/en/news/press-release/2024/10/23/world-bank-group-announces-strategic-pivot-in-agribusiness-doubles-financial-commitment
- AgriConnect FAQ (updated 30 June 2026) repeats 300 million smallholder farmers. It has no 9 billion figure. https://www.worldbank.org/ext/en/agriconnect/faq

Safe wording: "The World Bank Group's AgriConnect initiative aims to help 300 million smallholder farmers by 2030. The Group plans to double its own agribusiness financing to 9 billion US dollars a year by 2030."

---

## Safe to publish now

Each line gives the sentence or figure and its source.

- Plant pests and diseases destroy up to 40 percent of the world's food crops every year. (FAO newsroom, 2 December 2019)
- A model trained on PlantVillage leaf photos scored 99.35 percent on held-out PlantVillage photos. On two small sets of photos taken under other conditions it scored about 31 percent (31.4 and 31.7 percent). (Mohanty, Hughes and Salathe, Frontiers in Plant Science, 2016)
- Coffee leaf rust is caused by the fungus Hemileia vastatrix. It shows as yellow-orange powdery spots on the underside of the leaf. Later the spot centres turn brown and the leaf falls early. (Gil Vallejo, Cenicafe, 2003; Jackson, Pacific Pests fact sheet, 2020)
- The spores travel on wind and rain. (Gil Vallejo, Cenicafe, 2003, p. 151)
- In crop year 2012/13, coffee leaf rust cost Central America and nearby countries an estimated 2.7 million bags of coffee, worth about 500 million US dollars, and about 374,000 jobs. (ICO report ED 2157/13, 13 May 2013, using PROMECAFE figures)
- Central American coffee production fell 16 percent in 2013 compared with 2011-12, and 10 percent in 2013-14 compared with 2012-13. (Avelino et al., Food Security, 2015)
- More than 25 million farmers depend on coffee, and smallholders grow about 80 percent of the world's coffee. (FAO Director-General, 27 July 2025)
- BRACOL: 1,747 photos of Arabica coffee leaves taken with five smartphones in Espirito Santo, Brazil, with the leaf underside on a white background, under CC BY 4.0. (Krohling, Esgario and Ventura, Mendeley Data, 2019)
- BRACOL severity is the share of leaf area with symptoms, in five bands: under 0.1, 0.1 to 5, 5.1 to 10, 10.1 to 15 and over 15 percent. (Esgario, Krohling and Ventura, arXiv:1907.11561, pp. 3-4)
- Gemma 4 E2B has 2.3 billion effective parameters (5.1 billion counting embeddings), reads text, images and audio, has a 128K context, and uses the Apache 2.0 licence. (local model card, google/gemma-4-E2B-it)
- Google's LiteRT-LM build of Gemma 4 E2B for phones is one file of 2,588,147,712 bytes, about 2.6 GB, and it runs on the LiteRT-LM runtime. (Hugging Face, litert-community/gemma-4-E2B-it-litert-lm)
- JMuBEN: 58,555 labelled Arabica coffee leaf images in five classes, taken with a Fujifilm X-T4 camera at one plantation in Kirinyaga County, Kenya, under CC BY. (Jepkoech et al., Data in Brief 36:107142, 2021)
- A Ugandan set of 3,312 smartphone images of coffee leaves (healthy, coffee leaf rust, phoma), published by Soroti University researchers in 2025 under CC BY 4.0. (Chelangat, Anirwoth, Mayanja and Sserwadda, Mendeley Data, doi 10.17632/k36wnd6knb.1)
- In a tomato greenhouse study, a classifier trained only on synthetic images first called nearly every sick leaf healthy (4.8 percent of sick leaves right). After six rounds of fixes and a tuned decision threshold, it got 26 of 29 real photos right. (Klein et al., Frontiers in Plant Science 15:1360113, 2024, pp. 8, 10 and 11)
- The same Klein paper trained the network on real tomato leaf photos instead (a community extension of PlantVillage). It did barely better than random guessing on the greenhouse photos. (Klein et al., 2024, p. 12)
- Wadhwani AI's cotton pest app first runs a small model on the phone (YOLOv8 small, 11.2 million parameters). If that model is unsure, the photo goes to a larger model in the cloud. If that one is unsure too, a human expert decides. (Agrawal, Papanai and White, arXiv:2402.00015, 2024)
- In a Wadhwani AI study of cotton pest counting, an ideal filter that discarded the worst 10 percent of photos would have cut the counting error on one test season by almost 66 percent. A real filter cannot know which photos are worst, so this is a best case, not a result. (White et al., arXiv:2208.06359, 2022, p. 2)
- The World Bank Group's AgriConnect initiative aims to help 300 million smallholder farmers by 2030. The Group plans to double its own agribusiness financing to 9 billion US dollars a year by 2030. (worldbank.org AgriConnect page; World Bank Group press release, 23 October 2024)
- Kiswahili, after a native speaker agrees: "Kutu ya majani ya kahawa", "Piga picha ya jani", "Ndiyo" and "Hapana", "Sina uhakika", "Jaribu tena". For "no rust" prefer "Hakuna dalili za kutu". For the officer line prefer "Wasiliana na afisa ugani". (see section 11)

## Do not use

- "Rejecting the least confident 10 percent of predictions cuts error by about 66 percent." WRONG. The 66 percent comes from an oracle that removes the worst photos. It applies to one test season and to counting error.
- "25 million smallholder farmers produce 80 percent of the world's coffee", in that exact form. FAO says 25 million farmers, not all smallholders. The ICO says farmers and their families.
- "The coffee rust spreads by rain splash." No source I opened says "splash". Write "wind and rain".
- A single yield-loss figure for coffee rust with no source. The sources range from 19.5 to 70 percent, and they measure different things.
- The cloud model in the 2402.00015 paper as "YOLOv5x6 with 43.7 million parameters". The two facts conflict. Do not quote the cloud model's size.
- "CottonAce" as a name used in the arXiv paper. The paper does not use it. Cite the Wadhwani AI product page for the name.
- "31.4 percent" as a figure in the Frontiers abstract of Mohanty et al. It is in the arXiv abstract and in the Results.
- "89.6 percent accuracy on unseen photos" for Klein et al. The threshold was tuned on the same 29 photos, and 26 of 29 is 89.66 percent.
- "Coffee leaf diseases in Uganda" as the dataset title. The title is "A Machine Learning Dataset for Classification of Common Coffee Leaf Diseases in Uganda".
- "AgriConnect doubles agribusiness investment". The 9 billion dollars is World Bank Group financing, not total investment.
- "58,555 photos" (Kenya) or "3,312 photos" (Uganda). Both sets were cropped and augmented, and I cannot tell whether the counts include augmented copies.
- "Gemma 4 E2B is a 2 billion parameter model". The card says 2.3 billion effective and 5.1 billion with embeddings.
- A minimum Android API level for LiteRT-LM. UNVERIFIED.
- The FAO dollar figure of about 220 billion US dollars. UNVERIFIED.
- Any "25 million" claim credited to the ICO Coffee Development Report 2019. I did not see it in the report.
- Any Kiswahili phrase that a native speaker has not checked. "Hakuna kutu" and "Muulize afisa ugani" should change as shown in section 11.
