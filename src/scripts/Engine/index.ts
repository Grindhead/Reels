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
  /**
   * @param {string} containerId - The div id to render the canvas object into
   */
  containerId: string;

  /**
   * @param {number} canvasW - The width of the rendered canvas
   */
  canvasW: number;

  /**
   * @property {number} canvasH - The height of the rendered canvas
   */
  canvasH: number;
}

export default class Engine {
  /**
   * @property {HTMLElement} container - The container {HTMLElement} of the canvas element
   */
  container: HTMLElement;

  /**
   * @property {PIXI.Loader} loader - A reference to the global {PIXI.Loader} object
   */
  loader: PIXI.Loader;

  /**
   * @property {PIXI.Renderer} renderer - A reference to the {PIXI.Renderer} object
   */
  renderer: PIXI.Renderer;

  /**
   * @property {PIXI.Container} stage - A reference to the top level display container
   */
  stage: PIXI.Container;

  /**
   * @property {PIXI.Graphics} graphics - A reference to the top level graphics container
   */
  graphics: PIXI.Graphics;

  /**
   * @property {Howl} audio - A reference to the audio library Howl
   */
  audio!: Howl;

  /**
   * @property {number} reelSpinCtr - A int for how many times the reels have spun
   */
  reelSpinCtr: number = 0;

  /**
   * @property {UI} reelSpinCtr - A reference to the game UI object
   */
  ui?: UI;

  /**
   * @property { Reel[]} reelList - An array that contains all the active reels
   */
  reelList: Reel[] = [];

  /**
   * @constructor
   * @param {EngineParams} params - Parameters used by the Engine class
   */
  constructor(params: EngineParams) {
    this.loader = PIXI.Loader.shared;

    this.renderer = PIXI.autoDetectRenderer({
      width: params.canvasW,
      height: params.canvasH,
      antialias: true,
    });

    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();

    this.container = params.containerId
      ? document.getElementById(params.containerId) || document.body
      : document.body;
    this.container.appendChild(this.renderer.view);

    this.loadTextureAtlas();
  }

  private loadTextureAtlas = () => {
    this.loader.add('atlas', 'images/atlas.json');
    this.loader.load(() => {
      this.loadAudiosprite(AudioData, this.displayGame);
    });
  };

  /**
   * @param {Object} audiospriteData - a JSON file exported from Audiosprite that defines the Audiosprite file locations and markers within the files.
   * MP3, ogg, m4a and ac3 are normally loaded
   * @callback {HowlCallback} onLoad - a method to call once audio loading has been completed
   */
  private loadAudiosprite = (audiospriteData: Object, onLoad: HowlCallback) => {
    this.audio = new Howl(audiospriteData);
    this.audio.once('load', onLoad);
  };

  private createUI = () => {
    this.ui = new UI(this.stage);

    globalEvent.on(EVENTS.SPIN_START, this.startSpin);

    this.stage.addChild(this.ui);
  };

  private createReels = () => {
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

  private displayGame = () => {
    this.createReels();
    this.createUI();
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

  private spinComplete = () => {
    this.reelSpinCtr += 1;
    if (this.reelSpinCtr === NUM_REELS) {
      globalEvent.offAll();
      this.ui?.activate();
      globalEvent.on(EVENTS.SPIN_START, this.startSpin);
    }
  };
}
