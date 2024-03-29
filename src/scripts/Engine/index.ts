import * as PIXI from 'pixi.js';
import { Howl, HowlCallback } from 'howler';
import * as AudioData from '../../sounds/audiosprite.json';
import { UI } from '../UI';
import Reel from '../Reel';
import {
  EVENTS,
  GAME_WIDTH,
  NUM_REELS,
  SYMBOL_HEIGHT,
} from '../Utils/Constants';
import { ReelMask } from '../Reel/ReelMask';
import { globalEvent } from '@billjs/event-emitter';

export interface EngineParams {
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

export const Engine = {
  /**
   * @property {HTMLElement} container - The container {HTMLElement} of the canvas element
   */
  container: <HTMLElement>{},

  /**
   * @property {PIXI.Loader} loader - A reference to the global {PIXI.Loader} object
   */
  loader: <PIXI.Loader>{},

  /**
   * @property {PIXI.Renderer} renderer - A reference to the {PIXI.Renderer} object
   */
  renderer: <PIXI.Renderer>{},

  /**
   * @property {PIXI.Container} stage - A reference to the top level display container
   */
  stage: <PIXI.Container>{},

  /**
   * @property {Howl} audio - A reference to the audio library Howl
   */
  audio: <Howl>{},

  /**
   * @property {number} reelSpinCtr - A int for how many times the reels have spun
   */
  reelSpinCtr: 0,

  /**
   * @property {UI} ui - A reference to the game UI object
   */
  ui: UI,

  /**
   * @property {Reel[]} reelList - An array that contains all the active reels
   */
  reelList: <Reel[]>[],

  /**
   * start the game and begin loading assets
   * @param {EngineParams} params - Parameters used by the Engine class
   */
  init(params: EngineParams) {
    Engine.loader = PIXI.Loader.shared;

    Engine.renderer = PIXI.autoDetectRenderer({
      width: params.canvasW,
      height: params.canvasH,
      antialias: true,
    });

    Engine.stage = new PIXI.Container();

    Engine.container = params.containerId
      ? document.getElementById(params.containerId) || document.body
      : document.body;
    Engine.container.appendChild(Engine.renderer.view);

    Engine.loadTextureAtlas();
  },

  /**
   * load the games' texture atlas
   */
  loadTextureAtlas: () => {
    Engine.loader.add('atlas', 'images/atlas.json');
    Engine.loader.load(() => {
      Engine.loadAudiosprite(AudioData, Engine.displayGame);
    });
  },

  /**
   * @param {Object} audiospriteData - a JSON file exported from Audiosprite that defines the Audiosprite file locations and markers within the files.
   * MP3, ogg, m4a and ac3 are normally loaded
   * @callback {HowlCallback} onLoad - a method to call once audio loading has been completed
   */
  loadAudiosprite: (audiospriteData: Object, onLoad: HowlCallback) => {
    Engine.audio = new Howl(audiospriteData);
    Engine.audio.once('load', onLoad);
  },

  /**
   *create the {UI} singleton object
   */
  createUI: () => {
    Engine.ui = UI.init();

    globalEvent.on(EVENTS.SPIN_START, Engine.startSpin);
  },

  /**
   * create all the reels
   */
  createReels: () => {
    let reel;

    for (let i = 0; i < NUM_REELS; i++) {
      reel = new Reel();
      Engine.reelList.push(reel);
      reel.x = i * reel.width;
      Engine.stage.addChild(reel);
    }

    const scale: number = GAME_WIDTH / Engine.stage.width;
    Engine.stage.scale.set(scale);
    ReelMask.apply(scale * SYMBOL_HEIGHT);
  },

  /**
   * display the game
   */
  displayGame: () => {
    Engine.createReels();
    Engine.createUI();
  },

  /**
   * update the game each frame TODO: add a time delta
   */
  update: () => {
    Engine.reelList.forEach((reel: Reel) => {
      reel.update();
    });
  },

  /**
   * start the reel animation
   */
  startSpin: () => {
    Engine.reelList.forEach((reel: Reel, index: number) => {
      reel.startSpin(index * 0.1);
    });

    globalEvent.on(EVENTS.SPIN_COMPLETE, Engine.spinComplete);

    Engine.reelSpinCtr = 0;
  },

  /**
   * handle each reel finishing the animation
   */
  spinComplete: () => {
    Engine.reelSpinCtr += 1;
    if (Engine.reelSpinCtr === NUM_REELS) {
      globalEvent.offAll();
      Engine.ui?.activate();
      globalEvent.on(EVENTS.SPIN_START, Engine.startSpin);
    }
  },
};
