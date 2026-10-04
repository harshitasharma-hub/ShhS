import { App } from './app.js';
import { FarmScene } from './scenes/farmScene.js';
import { PipelineScene } from './scenes/pipelineScene.js';
import { GapScene } from './scenes/gapScene.js';
import { IdeaScene } from './scenes/ideaScene.js';
import { ProofScene } from './scenes/proofScene.js';
import { PhoneScene } from './scenes/phoneScene.js';
import { ShowcaseScene } from './scenes/showcaseScene.js';

const app = new App({ farm: FarmScene, pipeline: PipelineScene, gap: GapScene, idea: IdeaScene, proof: ProofScene, phone: PhoneScene, showcase: ShowcaseScene });
app.boot().catch((err) => {
  console.error(err);
  document.body.classList.add('is-ready');
});
