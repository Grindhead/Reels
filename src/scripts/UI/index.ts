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
import { Engine } from '../Engine';

export const UI = {
  /**
   * @param {PIXI.Sprite} spinButton - A reference to the spin button
   */
  spinButton: <PIXI.Sprite>{},
  /**
   * @param {boolean} isEnabled - Can the UI be used? Disabled if the reels are spinning
   */
  isEnabled: true,
  /**
   * @param {object} mousePos - Stores mouse pos. This will be deprecated
   */
  mousePos: { x: 0, y: 0 },
  /**
   * create the UI
   * @return {UI}
   */
  init() {
    UI.spinButton = this.createSpinButton();

    UI.activate();

    Engine.stage.interactive = true;
    Engine.stage.on('pointermove', (e: any) => {
      this.mousePos.x = e.data.global.x;
      this.mousePos.y = e.data.global.y;
    });

    Engine.stage.addChild(UI.spinButton);

    return this;
  },

  /**  activate the UI to enable a new spin */
  activate: () => {
    UI.isEnabled = true;
    UI.spinButton.interactive = true;
    UI.spinButton.buttonMode = true;
    UI.spinButton.texture = getImageData('ui/btn_spin_normal.png');

    // This is dirty and disgusting and will get updated
    if (
      UI.mousePos.x >= 841 &&
      UI.mousePos.x <= 1020 &&
      UI.mousePos.y >= 605 &&
      UI.mousePos.y <= 770
    ) {
      UI.spinButton.texture = getImageData('ui/btn_spin_hover.png');
    }
  },

  /**  disable the UI during a new spin */
  disable: () => {
    UI.isEnabled = false;
    UI.spinButton.buttonMode = false;
    UI.spinButton.interactive = false;
  },

  /**
   * create a new spin button
   * @return {PIXI.Sprite} - a new spin button with events applied
   */
  createSpinButton: () => {
    const button: PIXI.Sprite = new PIXI.Sprite(
      getImageData('ui/btn_spin_normal.png'),
    );

    button.on('pointerdown', () => {
      button.texture = getImageData('ui/btn_spin_pressed.png');
    });

    button.on('pointerup', () => {
      button.texture = getImageData('ui/btn_spin_disabled.png');
      UI.disable();

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
  },
};
