# presentation

The two web pages we present. Each one is its own small project, with its own README, build and `node_modules`.

| Folder | What it is | How to open it |
| --- | --- | --- |
| `talk/` | The 10-minute interactive talk. It has 3D farm scenes in Three.js and runs with the arrow keys. | Double-click `talk/shhs-talk.html`. It is the whole talk in one offline file. |
| `site/` | The one-page site "Does this leaf have rust?". It has four chapters: the problem, the solution, the results and what is next. It is also published as a claude.ai Artifact. | Double-click `site/index.html`. |

Both pages show real numbers and real pictures from this repo. Small scripts in each `tools/` folder copy them in from `runs/`, `data/` and `results/`, so the pages stay in step with the experiment. Read the README of a page before you rebuild it.

Old names: `site/` was `presentation-v2/`, and `talk/` was the whole `presentation/` folder.
