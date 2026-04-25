export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }
    
    preload() {
        this.load.image('fundo_menu', './assets/fundo_menu.png');
        this.load.image('logo_jogo', './assets/logo.png');
        this.load.audio('musica_menu', './assets/musica_menu.mp3');
    }

    create() {
        this.add.image(0, 0, 'fundo_menu').setOrigin(0, 0).setScale(0.4);
        this.add.image(400, 200, 'logo_jogo').setOrigin(0.5);
        this.add.text(400, 400, 'Clique para Iniciar', { fontSize: '20px', fill: '#000000' }).setOrigin(0.5);
        this.musicaBGM = this.sound.add('musica_menu', { loop: true, volume: 0.3 });
        this.musicaBGM.play();
        this.input.on('pointerdown', () => {
        this.musicaBGM.stop();
        this.scene.start('Phase1Scene');
           
        });
    }
}