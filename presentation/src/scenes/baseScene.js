import * as THREE from 'three';

// What every scene offers the app. A scene owns one THREE.Group and a set of camera poses,
// one per beat id. The app shows the group, flies the camera, and calls update() each frame.
export class BaseScene {
  constructor(app) {
    this.app = app;
    this.group = new THREE.Group();
    this.group.visible = false;
    this.poses = {};
    this.built = false;
  }

  build() { this.built = true; }          // create geometry and tags
  enter(beatId, prevId) {}                 // a beat of this scene became active
  leave() {}                               // the app moved on to another scene
  update(dt, t, motion) {}                 // per frame, only while this scene is shown. motion=false means hold still
  control(name, el, ev) {}                 // panel controls (sliders, buttons)
  pick(x, y) {}                            // canvas click
  resize(w, h) {}
  setLite(on) {}
  pose(beatId) { return this.poses[beatId]; }
}
