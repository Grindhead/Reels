import * as PIXI from 'pixi.js';
import {
  NUM_REELS,
  NUM_SYMBOLS_TO_SHOW,
  SYMBOL_HEIGHT,
  SYMBOL_WIDTH,
} from '../Utils/Constants';
import { EVENTS } from '../Utils/Constants';
import { getImageData } from '../Utils/Utils';
import { globalEvent } from '@billjs/event-emitter';

export default class UI extends PIXI.Container {
  /**
   * @param {PIXI.Sprite} spinButton - A reference to the spin button
   */
  spinButton: PIXI.Sprite;

  /**
   * @param {boolean} isEnabled - Can the UI be used? Disabled if the reels are spinning
   */
  isEnabled: boolean = true;

  /**
   * @param {object} mousePos - Stores mouse pos. This will be deprecated
   */
  mousePos = { x: 0, y: 0 };

  /**
   * @constructor
   * @param {PIXI.Container} stage - a reference to the stage object
   */
  constructor(stage: PIXI.Container) {
    super();

    this.spinButton = this.createSpinButton();

    this.activate();

    stage.interactive = true;
    stage.on('pointermove', (e: any) => {
      this.mousePos.x = e.data.global.x;
      this.mousePos.y = e.data.global.y;
    });
  }

  public activate = () => {
    this.isEnabled = true;
    this.spinButton.interactive = true;
    this.spinButton.buttonMode = true;
    this.spinButton.texture = getImageData('ui/btn_spin_normal.png');

    // This is dirty and disgusting and will get updated
    if (
      this.mousePos.x >= 841 &&
      this.mousePos.x <= 1020 &&
      this.mousePos.y >= 605 &&
      this.mousePos.y <= 770
    ) {
      this.spinButton.texture = getImageData('ui/btn_spin_hover.png');
    }
  };

  private disable = () => {
    this.isEnabled = false;
    this.spinButton.buttonMode = false;
    this.spinButton.interactive = false;
  };

  /**
   * @return {PIXI.Sprite} - a new spin button with events applied
   */
  private createSpinButton = () => {
    const button: PIXI.Sprite = new PIXI.Sprite(
      getImageData('ui/btn_spin_normal.png'),
    );

    this.addChild(button);

    button.on('pointerdown', () => {
      button.texture = getImageData('ui/btn_spin_pressed.png');
    });

    button.on('pointerup', () => {
      button.texture = getImageData('ui/btn_spin_disabled.png');
      this.disable();

      globalEvent.fire(EVENTS.SPIN_START);
    });

    button.on('pointerover', () => {
      button.texture = getImageData('ui/btn_spin_hover.png');
    });

    button.on('pointerout', () => {
      button.texture = getImageData('ui/btn_spin_normal.png');
    });

    const padding = 20;

    button.x = NUM_REELS * SYMBOL_WIDTH - SYMBOL_WIDTH + padding;
    button.y = NUM_SYMBOLS_TO_SHOW * SYMBOL_HEIGHT + padding;

    return button;
  };
}
