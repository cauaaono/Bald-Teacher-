import { Entity } from './Entity.js';

export class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'professor');

        this.health = 3;
        this.speed = 150;
        this.hasSword = false;

        this.setScale(2.5);

        //o body existe e se ajusta melhor ao sprite
        if (this.body) {
            this.body.setCollideWorldBounds(true);
            this.body.setSize(14, 18);
            this.body.setOffset(9, 12);
        }

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyC = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    update() {
        if (!this.body) return;

        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown || this.keyA.isDown) {
            velocityX = -this.speed;
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
            velocityX = this.speed;
        }

        if (this.cursors.up.isDown || this.keyW.isDown) {
            velocityY = -this.speed;
        } else if (this.cursors.down.isDown || this.keyS.isDown) {
            velocityY = this.speed;
        }

        this.body.setVelocity(velocityX, velocityY);

        // normaliza diagonal
        if (velocityX !== 0 && velocityY !== 0) {
            this.body.velocity.normalize().scale(this.speed);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
}