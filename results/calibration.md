# Setting the cut-off and the not-sure margin on field photos

Test: 300 Uganda photos, 150 rust and 150 not. Calibration pool: 1492 other Uganda photos (0 more were left out because a near copy sits in the test sample). The cut-off maximizes balanced accuracy on the pool. The not-sure margin is the smallest one for which the answered photos reach 95% balanced accuracy on the pool. Numbers are means over seeds.

## With the whole pool

| Arm | Accuracy, BRACOL cut-off | Accuracy, field cut-off | Not-sure: answers | Right when it answers |
|---|---|---|---|---|
| Zero-shot | 81.0% | 86.0% | 72.0% | 95.6% |
| Real only, 10% real | 89.3% | 89.6% | 76.0% | 96.6% |
| Real only, 25% real | 88.3% | 88.3% | 48.7% | 95.9% |
| Real only, 50% real | 87.1% | 88.4% | 48.8% | 96.5% |
| Real only, 100% real | 87.8% | 88.3% | 23.6% | 94.7% |
| Synthetic only | 86.9% | 86.9% | 57.2% | 93.4% |
| Synthetic only (combo) | 85.0% | 86.3% | 32.2% | 93.9% |
| Synthetic only (v3) | 81.6% | 83.3% | 17.6% | 92.8% |
| Synthetic + real, 10% real | 87.8% | 89.4% | 75.9% | 95.7% |
| Synthetic + real, 25% real | 86.6% | 88.0% | 47.7% | 95.5% |
| Synthetic + real, 50% real | 87.1% | 87.9% | 39.9% | 96.0% |
| Synthetic + real, 100% real | 85.8% | 85.8% | 43.4% | 94.8% |
| Synthetic + real (combo), 100% real | 86.7% | 89.7% | 0.0% | - |
| Synthetic + real (v3), 10% real | 89.0% | 89.4% | 72.0% | 95.4% |
| Synthetic + real (v3), 100% real | 83.4% | 82.7% | 33.2% | 92.8% |

## How many local photos are needed

The cut-off and margin are set on a random sample of the pool, 40 draws each. Accuracy is on all 300 test photos. Answers and Right when it answers are for the not-sure mode.

| Arm | Local photos | Accuracy | Not-sure: answers | Right when it answers |
|---|---|---|---|---|
| Zero-shot | 25 | 83.6% +/- 3.2 | 62.4% | 90.0% |
| Zero-shot | 50 | 84.2% +/- 1.5 | 57.2% | 92.9% |
| Zero-shot | 100 | 85.0% +/- 1.1 | 57.9% | 95.0% |
| Zero-shot | 200 | 84.9% +/- 0.9 | 59.5% | 94.3% |
| Zero-shot | 500 | 85.4% +/- 0.9 | 67.0% | 95.4% |
| Zero-shot | 1492 | 86.0% | 72.0% | 95.6% |
| Real only, 10% real | 25 | 87.2% +/- 4.6 | 69.3% | 89.8% |
| Real only, 10% real | 50 | 88.6% +/- 2.2 | 62.2% | 91.4% |
| Real only, 10% real | 100 | 89.0% +/- 1.4 | 59.8% | 94.4% |
| Real only, 10% real | 200 | 89.4% +/- 1.1 | 64.4% | 94.8% |
| Real only, 10% real | 500 | 89.6% +/- 0.6 | 73.9% | 96.0% |
| Real only, 10% real | 1492 | 89.6% +/- 0.3 | 76.0% | 96.6% |
| Real only, 100% real | 25 | 84.7% +/- 4.2 | 60.1% | 87.1% |
| Real only, 100% real | 50 | 86.7% +/- 1.7 | 45.9% | 91.2% |
| Real only, 100% real | 100 | 87.1% +/- 1.5 | 39.6% | 93.0% |
| Real only, 100% real | 200 | 87.5% +/- 1.0 | 35.3% | 94.4% |
| Real only, 100% real | 500 | 87.7% +/- 0.8 | 34.7% | 94.6% |
| Real only, 100% real | 1492 | 88.3% +/- 0.7 | 23.6% | 94.7% |
| Synthetic only | 25 | 84.5% +/- 3.8 | 56.2% | 87.9% |
| Synthetic only | 50 | 85.9% +/- 1.9 | 46.5% | 91.0% |
| Synthetic only | 100 | 86.4% +/- 1.4 | 39.6% | 92.7% |
| Synthetic only | 200 | 86.6% +/- 1.2 | 39.1% | 92.9% |
| Synthetic only | 500 | 86.7% +/- 1.0 | 31.8% | 94.5% |
| Synthetic only | 1492 | 86.9% +/- 0.4 | 57.2% | 93.4% |
| Synthetic only (combo) | 25 | 82.3% +/- 6.0 | 50.4% | 84.3% |
| Synthetic only (combo) | 50 | 85.3% +/- 2.7 | 35.4% | 87.9% |
| Synthetic only (combo) | 100 | 85.9% +/- 2.0 | 33.7% | 88.6% |
| Synthetic only (combo) | 200 | 86.5% +/- 1.2 | 38.9% | 93.3% |
| Synthetic only (combo) | 500 | 86.4% +/- 1.0 | 38.9% | 94.2% |
| Synthetic only (combo) | 1492 | 86.3% +/- 0.7 | 32.2% | 93.9% |
| Synthetic only (v3) | 25 | 80.2% +/- 4.6 | 45.4% | 82.6% |
| Synthetic only (v3) | 50 | 82.2% +/- 2.7 | 36.2% | 86.2% |
| Synthetic only (v3) | 100 | 82.4% +/- 2.6 | 34.5% | 87.3% |
| Synthetic only (v3) | 200 | 83.1% +/- 1.8 | 30.8% | 88.3% |
| Synthetic only (v3) | 500 | 83.3% +/- 1.7 | 33.2% | 89.8% |
| Synthetic only (v3) | 1492 | 83.3% +/- 1.7 | 17.6% | 92.8% |
| Synthetic + real, 10% real | 25 | 86.4% +/- 4.4 | 69.5% | 88.5% |
| Synthetic + real, 10% real | 50 | 87.6% +/- 2.6 | 56.8% | 91.4% |
| Synthetic + real, 10% real | 100 | 88.5% +/- 1.9 | 51.9% | 93.5% |
| Synthetic + real, 10% real | 200 | 88.9% +/- 1.3 | 51.2% | 95.3% |
| Synthetic + real, 10% real | 500 | 89.3% +/- 0.8 | 68.1% | 95.5% |
| Synthetic + real, 10% real | 1492 | 89.4% +/- 0.6 | 75.9% | 95.7% |
| Synthetic + real, 100% real | 25 | 84.0% +/- 2.7 | 48.6% | 87.2% |
| Synthetic + real, 100% real | 50 | 84.5% +/- 2.6 | 42.3% | 89.9% |
| Synthetic + real, 100% real | 100 | 85.2% +/- 1.6 | 38.0% | 90.9% |
| Synthetic + real, 100% real | 200 | 85.3% +/- 1.4 | 36.0% | 91.4% |
| Synthetic + real, 100% real | 500 | 85.7% +/- 0.7 | 39.4% | 92.0% |
| Synthetic + real, 100% real | 1492 | 85.8% +/- 0.4 | 43.4% | 94.8% |
| Synthetic + real (combo), 100% real | 25 | 85.2% +/- 4.9 | 62.1% | 87.6% |
| Synthetic + real (combo), 100% real | 50 | 87.3% +/- 2.4 | 46.8% | 90.6% |
| Synthetic + real (combo), 100% real | 100 | 87.4% +/- 2.5 | 39.3% | 92.7% |
| Synthetic + real (combo), 100% real | 200 | 88.0% +/- 1.9 | 29.9% | 93.6% |
| Synthetic + real (combo), 100% real | 500 | 88.8% +/- 1.7 | 17.1% | 94.3% |
| Synthetic + real (combo), 100% real | 1492 | 89.7% +/- 0.3 | 0.0% | - |
| Synthetic + real (v3), 10% real | 25 | 86.0% +/- 5.4 | 56.9% | 88.3% |
| Synthetic + real (v3), 10% real | 50 | 88.0% +/- 2.7 | 63.0% | 91.1% |
| Synthetic + real (v3), 10% real | 100 | 88.7% +/- 2.2 | 59.3% | 92.8% |
| Synthetic + real (v3), 10% real | 200 | 88.8% +/- 2.2 | 58.7% | 94.1% |
| Synthetic + real (v3), 10% real | 500 | 89.2% +/- 2.1 | 53.5% | 95.0% |
| Synthetic + real (v3), 10% real | 1492 | 89.4% +/- 1.9 | 72.0% | 95.4% |
| Synthetic + real (v3), 100% real | 25 | 80.5% +/- 4.4 | 38.5% | 82.4% |
| Synthetic + real (v3), 100% real | 50 | 82.0% +/- 1.9 | 36.0% | 85.7% |
| Synthetic + real (v3), 100% real | 100 | 82.0% +/- 2.3 | 28.3% | 85.7% |
| Synthetic + real (v3), 100% real | 200 | 82.4% +/- 1.5 | 36.2% | 89.7% |
| Synthetic + real (v3), 100% real | 500 | 82.7% +/- 1.2 | 34.5% | 88.1% |
| Synthetic + real (v3), 100% real | 1492 | 82.7% +/- 0.5 | 33.2% | 92.8% |
