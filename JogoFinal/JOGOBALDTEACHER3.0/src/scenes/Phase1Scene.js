import { Player } from '../entities/Player.js';
import { Student } from '../entities/Enemies.js';
import { Hair } from '../entities/Hair.js';

export class Phase1Scene extends Phaser.Scene {
    constructor() {
        super('Phase1Scene');
    }

    preload() {
        this.load.image('professor', './assets/professor.png');
        this.load.image('cabelo', './assets/cabelo.png');
        this.load.image('fundo_sala', './assets/fase1sala.png');
        this.load.image('gameover_img', './assets/gameover.png');
        this.load.image('inimigo', './assets/inimigo.png');
        this.load.image('coracao_cheio', './assets/coracao_cheio.png');
        this.load.image('coracao_vazio', './assets/coracao_vazio.png');
        this.load.audio('musica_fundo', './assets/musica_fase1.mp3');
        this.load.image('cabelo_vazio', './assets/cabelo_vazio.png');
    }

    create() {
        const mapScale = 0.5;
        this.bg = this.add.image(0, 0, 'fundo_sala').setOrigin(0, 0).setScale(mapScale);
        const worldWidth = this.bg.displayWidth;
        const worldHeight = this.bg.displayHeight;

        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

        this.musicaBGM = this.sound.add('musica_fundo', { loop: true, volume: 0.3 });
        this.musicaBGM.play();

        this.hairCollected = 0;
        this.requiredHair = 5;
        this.playerInvulnerable = false;

        this.coracoesUI = [];
        for (let i = 0; i < 3; i++) {
            const posX = 30 + (i * 40);
            const imgCoracao = this.add.image(posX, 50, 'coracao_cheio').setScale(1.5).setScrollFactor(0).setDepth(10);
            this.coracoesUI.push(imgCoracao);
        }

        this.cabelosUI = [];
        for (let i = 0; i < this.requiredHair; i++) {
            const posX = 30 + (i * 35);
            const imgCabelo = this.add.image(posX, 100, 'cabelo_vazio').setScale(1.2).setScrollFactor(0).setDepth(10);
            this.cabelosUI.push(imgCabelo);
        }

        this.player = new Player(this, 400, 300);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(18, 24);
        this.player.body.setOffset(7, 6);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.enemies = this.physics.add.group();
        this.hairs = this.physics.add.group();
        this.obstacles = this.physics.add.staticGroup();

        const addObstacle = (x, y, width, height) => {
            const rect = this.add.rectangle(x, y, width, height, 0x000000, 0);
            this.physics.add.existing(rect, true);
            this.obstacles.add(rect);
        };

        addObstacle(650, 250, 200, 80);
        addObstacle(210, 415, 100, 60);
        addObstacle(480, 415, 100, 60);
        addObstacle(750, 415, 100, 60);
        addObstacle(750, 565, 100, 60);
        addObstacle(210, 565, 100, 60);
        addObstacle(480, 565, 100, 60);
        addObstacle(400, 90, 1550, 80);
        addObstacle(210, 745, 100, 60);
        addObstacle(480, 745, 100, 60);
        addObstacle(750, 745, 100, 60);
        addObstacle(1000, 415, 100, 60);
        addObstacle(1000, 565, 100, 60);
        addObstacle(1000, 745, 100, 60);

      const enemyPositions = [
    { x: 100, y: 100 },
    { x: 700, y: 100 },
    { x: 100, y: 500 },
    { x: 400, y: 100 },
    { x: 700, y: 500 }
];

    enemyPositions.forEach(pos => {
    const enemy = new Student(this, pos.x, pos.y);
    enemy.setScale(2);
    enemy.body.setSize(40, 40);
    enemy.body.setOffset(15, 10);
    enemy.body.setCollideWorldBounds(true);
    this.enemies.add(enemy);
    
});
        

        const hairPositions = [
            { x: 90, y: 155 },
            { x: 135, y: 320 },
            { x: 440, y: 530 },
            { x: 700, y: 330 },
            { x: 780, y: 560 }
        ];

        hairPositions.forEach(pos => this.hairs.add(new Hair(this, pos.x, pos.y)));

        this.physics.add.overlap(this.player, this.hairs, this.collectHair, null, this);
        this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.enemies, this.obstacles);
        this.physics.add.collider(this.enemies, this.enemies);
    }
    

    update() {
        this.player.update();
        this.enemies.getChildren().forEach(enemy => enemy.update(this.player));
    }

    collectHair(player, hair) {
        hair.destroy();

        if (this.hairCollected < this.requiredHair) {
            this.cabelosUI[this.hairCollected].setTexture('cabelo');
        }

        this.hairCollected++;

        if (this.hairCollected >= this.requiredHair) {
            this.musicaBGM.stop();
            this.scene.start('Phase2Scene');
        }
    }

    hitEnemy(player, enemy) {
        if (player.health <= 0 || this.playerInvulnerable) return;

        this.playerInvulnerable = true;
        player.health -= (enemy.damage || 1);

        if (player.health >= 0 && player.health < 3) {
            this.coracoesUI[player.health].setTexture('coracao_vazio');
        }

        player.setTint(0xff0000);
        this.time.delayedCall(200, () => player.clearTint());
        this.time.delayedCall(900, () => {
            this.playerInvulnerable = false;
        });

        if (player.health <= 0) {
            this.gameOver();
        } else {
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
            player.x += Math.cos(angle) * 40;
            player.y += Math.sin(angle) * 40;
        }
    }

    gameOver() {
        this.physics.pause();
        this.player.setTint(0x555555);
        this.musicaBGM.stop();
        this.add.image(400, 300, 'gameover_img')
            .setOrigin(0.5)
            .setScale(0.3)
            .setScrollFactor(0)
            .setDepth(20);

        this.add.text(400, 550, 'Clique para tentar novamente', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#000'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }
}
