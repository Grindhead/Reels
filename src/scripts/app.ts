import Stats from 'stats.js';
import { Engine } from './Engine';
import { FEATURES, GAME_HEIGHT, GAME_WIDTH } from './Utils/Constants';

window.onload = () => {
  Engine.init({
    containerId: 'game',
    canvasW: GAME_WIDTH,
    canvasH: GAME_HEIGHT,
  });

  const render = () => {
    requestAnimationFrame(render);
    if (FEATURES.SHOW_STATS) {
      stats.begin();
    }
    Engine.update();
    Engine.renderer.render(Engine.stage);
    if (FEATURES.SHOW_STATS) {
      stats.end();
    }
  };

  if (FEATURES.SHOW_STATS) {
    showStats();
  }

  render();
};

const stats = new Stats();

const showStats = () => {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
};
