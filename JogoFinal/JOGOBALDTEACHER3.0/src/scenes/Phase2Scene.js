import { Player } from '../entities/Player.js';
import { Rat } from '../entities/Enemies.js';
import { Hair } from '../entities/Hair.js';

export class Phase2Scene extends Phaser.Scene {
    constructor() {
        super('Phase2Scene');
    }

    preload() {
        this.load.image('fundo_fase2', './assets/fase2_banheiro.png');
        this.load.image('professor', './assets/professor.png');
        this.load.image('barata', './assets/barata.png');
        this.load.image('cabelo', './assets/cabelo.png');
        this.load.image('coracao_cheio', './assets/coracao_cheio.png');
        this.load.image('coracao_vazio', './assets/coracao_vazio.png');
        this.load.image('cabelo_vazio', './assets/cabelo_vazio.png');
        this.load.audio('musica_fase2', './assets/song_fase2.mp3');
        this.load.image('gameover_img', './assets/gameover.png');
    }

    create() {
        const mapScale = 0.45;
        this.bg = this.add.image(0, 0, 'fundo_fase2').setOrigin(0, 0).setScale(mapScale);

        const worldWidth = this.bg.displayWidth;
        const worldHeight = this.bg.displayHeight;
        this.musicaBGM = this.sound.add('musica_fase2', { loop: true, volume: 0.3 });
        this.musicaBGM.play();

        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

        this.player = new Player(this, 520, 500);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(18, 24);
        this.player.body.setOffset(7, 6);
        this.player.health = 3;

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.obstacles = this.physics.add.staticGroup();
        this.rats = this.physics.add.group();
        this.hairs = this.physics.add.group();

        this.playerInvulnerable = false;
        this.requiredHair = 5;
        this.hairCollected = 0;

        const addObstacle = (x, y, width, height) => {
            const rect = this.add.rectangle(x, y, width, height, 0x000000, 0);
            this.physics.add.existing(rect, true);
            this.obstacles.add(rect);
        };

    addObstacle(650, 305, 300, 150);   // pia
    addObstacle(640, 600, 1000, 70);   // canto inferior centro
    addObstacle(1080, 330, 200, 150);  // parede direita (box)
    addObstacle(1150, 350, 50, 500);  // parede direita completa
    addObstacle(230, 350, 70, 500);   // esquerda
    addObstacle(640, 100, 1000, 70);


        const barataPositions = [
            { x: 320, y: 510 },
            { x: 860, y: 540 },
            { x: 950, y: 300 },
            { x: 1090, y: 620 },
           
        ];

        barataPositions.forEach(pos => {
            const barata = new Rat(this, pos.x, pos.y);
            this.rats.add(barata);
            barata.body.setSize(25, 45);
            barata.body.setOffset(24, 7);
            barata.body.setCollideWorldBounds(true);
        });

        const hairPositions = [
            { x: 430, y: 250 },
            { x: 900, y: 250 },
            { x: 750, y: 450 },
            { x: 260, y: 530 },
            { x: 400, y: 545 },
        ];

        hairPositions.forEach(pos => {
            this.hairs.add(new Hair(this, pos.x, pos.y));
        });


        this.coracoesUI = [];
        for (let i = 0; i < 3; i++) {
            const posX = 30 + (i * 40);
            const imgCoracao = this.add.image(posX, 50, 'coracao_cheio')
                .setScale(1.5)
                .setScrollFactor(0)
                .setDepth(10);
            this.coracoesUI.push(imgCoracao);
        }

        this.cabelosUI = [];
        for (let i = 0; i < this.requiredHair; i++) {
            const posX = 30 + (i * 35);
            const imgCabelo = this.add.image(posX, 100, 'cabelo_vazio')
                .setScale(1.2)
                .setScrollFactor(0)
                .setDepth(10);
            this.cabelosUI.push(imgCabelo);
        }

        this.physics.add.overlap(this.player, this.hairs, this.collectHair, null, this);
        this.physics.add.collider(this.player, this.rats, this.hitRat, null, this);
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.rats, this.obstacles);
        this.physics.add.collider(this.rats, this.rats);
    }

    update() {
        if (this.player) {
            this.player.update();
        }

        this.rats.getChildren().forEach(rat => {
            rat.update();
        });
    }

    collectHair(player, hair) {
        hair.destroy();
        this.hairCollected++;

        //Array: Subtrai 1 para a ordem ficar certa (0, 1, 2, 3, 4)
        let indice = this.hairCollected - 1; 

        //Muda a imagem do cabelo vazio para o cheio
        if (indice < this.requiredHair) {
            this.cabelosUI[indice].setTexture('cabelo'); 
        }

        //Checa a Vitória
        if (this.hairCollected >= this.requiredHair) {
            if (this.musicaBGM) {
                this.musicaBGM.stop();
            }
            this.scene.start('Phase3Scene');
        }
    }

    hitRat(player, rat) {
        if (player.health <= 0 || this.playerInvulnerable) return;

        this.playerInvulnerable = true;
        player.health -= 1;

        if (player.health >= 0 && player.health < 3) {
            this.coracoesUI[player.health].setTexture('coracao_vazio');
        }

        player.setTint(0xff0000);
        this.time.delayedCall(200, () => player.clearTint());
        this.time.delayedCall(900, () => {
            this.playerInvulnerable = false;
        });

        const angle = Phaser.Math.Angle.Between(rat.x, rat.y, player.x, player.y);
        player.x += Math.cos(angle) * 20;
        player.y += Math.sin(angle) * 20;

        if (player.health <= 0) {
            this.gameOver();
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