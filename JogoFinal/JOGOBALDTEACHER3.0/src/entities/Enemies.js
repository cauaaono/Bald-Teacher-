import { Entity } from './Entity.js';

export class Enemy extends Entity {
    constructor(scene, x, y, texture, speed = 60, damage = 1) {
        super(scene, x, y, texture);
        this.speed = speed;
        this.damage = damage;
    }

    update(player) {
        this.scene.physics.moveToObject(this, player, this.speed);
    }
}

export class Student extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'inimigo', 50, 1);
        this.changeDirectionTimer = 0;
        this.setScale(2);
        this.body.setSize(30, 30);
        this.body.setOffset(20, 20);
        this.setCollideWorldBounds(true);
        this.body.setBounce(1, 1);

        this.body.setVelocity(
            Phaser.Math.Between(-100, 100),
            Phaser.Math.Between(-100, 100)
        );
    }

    update() {
        this.changeDirectionTimer++;
        if (this.changeDirectionTimer > 100) {
            this.body.setVelocity(
                Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(-100, 100)
            );
            this.changeDirectionTimer = 0;
        }
    }
}

export class Rat extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'barata', 50, 1);
        this.changeDirectionTimer = 0;

        this.setScale(1.5);

        this.body.setSize(28, 18);
        this.body.setOffset(10, 18);

        this.setCollideWorldBounds(true);
        this.body.setBounce(1, 1);

        this.body.setVelocity(
            Phaser.Math.Between(-100, 100),
            Phaser.Math.Between(-100, 100)
        );
    }

    update() {
        this.changeDirectionTimer++;
        if (this.changeDirectionTimer > 100) {
            this.body.setVelocity(
                Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(-100, 100)
            );
            this.changeDirectionTimer = 0;
        }
    }
}

export class Boss extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'inimigo', 80, 2);
        this.health = 100;
        this.setScale(0.9);
    }

    update(player) {
        super.update(player);
    }
}