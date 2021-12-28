import * as PIXI from 'pixi.js';
import {
  EVENTS,
  FEATURES,
  GAME_HEIGHT,
  NUM_SYMBOLS_TO_SHOW,
  SPIN_DURATION,
  SPIN_END,
  SPIN_SPEED,
  SPIN_START,
  SYMBOL_HEIGHT,
} from '../Utils/Constants';
import { getImageData, getRandomStopSound } from '../Utils/Utils';
import { gsap, Power1 } from 'gsap';
import _, { orderBy } from 'lodash';
import { getRandomSymbol } from '../Utils/Utils';
import { Engine } from '../Engine';
import { globalEvent } from '@billjs/event-emitter';

export default class Reel extends PIXI.Container {
  /**
   * @param {PIXI.Sprite[]} symbolList - An array of all the current displayed symbols in this vertical column
   */
  symbolList: PIXI.Sprite[] = [];
  /**
   * @param {number} yVel - the speed at which the reels will move
   */
  yVel: number = 0;

  /**
   * @param {boolean} iSpinning - determines if the reels are currently spinning
   */
  isSpinning: boolean = false;

  /**
   * @constructor
   */
  constructor() {
    super();
    this.createSymbols();
  }

  /**
   * create all the symbols we need
   */
  private createSymbols = () => {
    for (let i = 0; i < NUM_SYMBOLS_TO_SHOW + 1; i++) {
      const key: string = getRandomSymbol();
      const symbol: PIXI.Sprite = new PIXI.Sprite(getImageData(key));
      symbol.anchor.set(0.5);
      this.symbolList.push(symbol);
      symbol.x = symbol.height * 0.5;
      symbol.y = i * symbol.height + symbol.height / 2;
      this.addChild(symbol);
    }
  };

  /**
   * perform a normal spin animation
   * @param {number} delay - the delay before the reels begin to spin
   */
  private normalSpin = (delay: number) => {
    var timeline = gsap.timeline();

    timeline.to(this, {
      yVel: SPIN_SPEED,
      duration: SPIN_START,
      delay,
    });

    timeline.to(this, {
      duration: SPIN_DURATION,
      onComplete: () => {
        this.isSpinning = false;
        this.symbolList = orderBy(this.symbolList, ['y']);
        this.symbolList.forEach((symbol, index) =>
          this.animateOut(symbol, index),
        );
      },
    });
  };

  /**
   * perform a cascade spin animation
   * @param {number} delay - the delay before the reels begin to spin
   */
  private cascadeSpin = (delay: number) => {
    var timeline = gsap.timeline();

    timeline.to(this, {
      delay,
      onComplete: () => {
        this.symbolList = orderBy(this.symbolList, ['y']);
        this.isSpinning = false;
        this.symbolList.forEach((symbol, index) => {
          gsap.to(symbol, {
            duration: SPIN_END,
            y: GAME_HEIGHT + SYMBOL_HEIGHT,
            angle: _.random(-360, 360),
            ease: Power1.easeInOut,
            onComplete: () => {
              symbol.y = -SYMBOL_HEIGHT;
              this.animateOut(symbol, index);
            },
          });
        });
      },
    });
  };

  /**
   * animate the symbol out of the screen. When complete, fire EVENTS.SPIN_COMPLETE
   * @param {PIXI.Sprite} symbol - a reference to the symbol to animate
   * @param {number} index - a reference to the symbol index within the symbolList array
   */
  private animateOut = (symbol: PIXI.Sprite, index: number) => {
    let y = symbol.y + -this.symbolList[0].y + SYMBOL_HEIGHT * 0.5;
    let delay = 0;
    this.yVel = 0;

    if (FEATURES.CASCADING_REELS) {
      symbol.angle = _.random(-360, 360);
      y = index * SYMBOL_HEIGHT + SYMBOL_HEIGHT * 0.5;
      delay = (NUM_SYMBOLS_TO_SHOW - 1 - index) * 0.5;
    }

    const ease = FEATURES.CASCADING_REELS ? Power1.easeInOut : undefined;

    const anim = gsap.to(symbol, {
      duration: SPIN_END,
      y,
      rotation: 0,
      delay,
      ease,
      onComplete: () => {
        Engine.audio.play(getRandomStopSound());
        if (index === 0) {
          anim.then(() => globalEvent.fire(EVENTS.SPIN_COMPLETE));
        }
      },
    });
  };

  /**
   * reset a symbol position to the top of the screen, and choose a new symbol asset from the texture atlas
   * @param {PIXI.Sprite} symbol - a reference to the symbol to animate
   */
  private resetSymbol = (symbol: PIXI.Sprite) => {
    if (FEATURES.CASCADING_REELS && !this.isSpinning) {
      symbol.y = -SYMBOL_HEIGHT * 2;
    } else {
      symbol.y -= NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT + symbol.height;
    }

    symbol.texture = getImageData(getRandomSymbol());
  };

  /**
   * update the symbols within this reel each frame
   */
  public update = () => {
    this.symbolList.forEach((symbol: PIXI.Sprite) => {
      if (!this.isSpinning && symbol.y <= -SYMBOL_HEIGHT) {
      } else {
        symbol.y += this.yVel;
      }

      if (
        symbol.y >
        NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT + SYMBOL_HEIGHT * 0.5
      ) {
        this.resetSymbol(symbol);
      }
    });
  };

  /**
   * start a spin beginning with a delay
   * @param {number} delay - the delay before the reels begin to spin
   */
  public startSpin = (delay: number) => {
    Engine.audio.play('Start_Button');
    this.isSpinning = true;

    if (FEATURES.CASCADING_REELS) {
      this.cascadeSpin(delay);
    } else {
      this.normalSpin(delay);
    }
  };
}
