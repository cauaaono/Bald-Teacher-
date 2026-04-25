export class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // adiciona na cena
        scene.add.existing(this);

        // ativa física no objeto
        scene.physics.add.existing(this);

        // configurações básicas de física
        this.setCollideWorldBounds(true);
    }
}