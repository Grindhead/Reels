import * as PIXI from 'pixi.js';
import { Howl, HowlCallback } from 'howler';
import * as AudioData from '../../sounds/audiosprite.json';
import UI from '../UI';
import Reel from '../Reel';
import {
  EVENTS,
  GAME_WIDTH,
  NUM_REELS,
  SYMBOL_HEIGHT,
} from '../Utils/Constants';
import ReelMask from '../Reel/ReelMask';
import { globalEvent } from '@billjs/event-emitter';

interface EngineParams {
  containerId: string;
  canvasW: number;
  canvasH: number;
  fpsMax: number;
}

export default class Engine {
  container: HTMLElement;
  loader: PIXI.Loader;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  graphics: PIXI.Graphics;
  fpsMax: number;
  audio!: Howl;
  reelSpinCtr: number = 0;
  ui?: UI;
  reelList: Reel[] = [];

  constructor(params: EngineParams) {
    this.loader = PIXI.Loader.shared;

    this.renderer = PIXI.autoDetectRenderer({
      width: params.canvasW,
      height: params.canvasH,
      antialias: true,
    });

    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.fpsMax = params.fpsMax;

    this.container = params.containerId
      ? document.getElementById(params.containerId) || document.body
      : document.body;
    this.container.appendChild(this.renderer.view);

    this.loadTextureAtlas();
  }

  loadTextureAtlas = () => {
    this.loader.add('atlas', 'images/atlas.json');
    this.loader.load(() => {
      this.loadAudiosprite(AudioData, this.displayGame);
    });
  };

  loadAudiosprite = (audiospriteData: Object, onLoad: HowlCallback) => {
    this.audio = new Howl(audiospriteData);
    this.audio.once('load', onLoad);
  };

  displayGame = () => {
    this.createReels();
    this.createUI();
  };

  createUI = () => {
    this.ui = new UI(this.startSpin, this.stage);
    this.stage.addChild(this.ui);
  };

  createReels = () => {
    let reel;

    for (let i = 0; i < NUM_REELS; i++) {
      reel = new Reel(this);
      this.reelList.push(reel);
      reel.x = i * reel.width;
      this.stage.addChild(reel);
    }

    const scale: number = GAME_WIDTH / this.stage.width;
    this.stage.scale.set(scale);
    new ReelMask(scale * SYMBOL_HEIGHT, this.reelList);
  };

  update = () => {
    this.reelList.forEach((reel: Reel) => {
      reel.update();
    });
  };

  startSpin = () => {
    this.reelList.forEach((reel: Reel, index: number) => {
      reel.startSpin(index * 0.1);
    });

    globalEvent.on(EVENTS.SPIN_COMPLETE, this.spinComplete);

    this.reelSpinCtr = 0;
  };

  spinComplete = () => {
    this.reelSpinCtr += 1;

    if (this.reelSpinCtr === NUM_REELS) {
      globalEvent.offAll();
      this.ui?.activate();
    }
  };
}
