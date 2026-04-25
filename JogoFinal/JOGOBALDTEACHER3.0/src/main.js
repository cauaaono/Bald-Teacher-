import { MenuScene } from './scenes/MenuScene.js';
import { Phase1Scene } from './scenes/Phase1Scene.js';
import { Phase2Scene } from './scenes/Phase2Scene.js';
import { Phase3Scene } from './scenes/Phase3Scene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug:false 
        }
    },
    scene: [MenuScene, Phase1Scene, Phase2Scene, Phase3Scene]
};

new Phaser.Game(config);
