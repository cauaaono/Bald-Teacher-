import { Player } from '../entities/Player.js';

export class Phase3Scene extends Phaser.Scene {
    constructor() {
        super('Phase3Scene');
    }

    preload() {
        this.load.image('fundo_fase3', './assets/fundo_fase3.png');
        this.load.image('professor', './assets/professor.png');
        this.load.image('chefe', './assets/boss.png'); 
        this.load.image('projetil_prof', './assets/projetil_prof.png');
        this.load.image('projetil_boss', './assets/ataque_boss.png'); 
        this.load.image('coracao_cheio', './assets/coracao_cheio.png');
        this.load.image('coracao_vazio', './assets/coracao_vazio.png');
        this.load.audio('musica_final', './assets/song_final.mp3');
        this.load.video('video_final', './assets/cutscene.mp4');
        this.load.video('video_creditos', './assets/creditos.mp4');
    }

    create() {
        this.add.image(0, 0, 'fundo_fase3').setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, 800, 600);
        this.musicaBGM = this.sound.add('musica_final', { loop: true, volume: 0.3 });
        this.musicaBGM.play();

        this.player = new Player(this, 400, 500);
        this.player.body.setCollideWorldBounds(true);
        this.player.health = 3; 

        this.boss = this.physics.add.sprite(400, 100, 'chefe').setScale(2);
        this.boss.setCollideWorldBounds(true);
        this.boss.health = 25; 

        
        this.playerBullets = this.physics.add.group();
        this.bossBullets = this.physics.add.group();

        this.input.on('pointerdown', (pointer) => {
            this.atirar(pointer);
        });


        this.time.addEvent({
            delay: 1000, 
            callback: this.bossAtacar, 
            callbackScope: this, 
            loop: true 
        });

        this.physics.add.overlap(this.playerBullets, this.boss, this.hitBoss, null, this);
        this.physics.add.overlap(this.player, this.bossBullets, this.hitPlayer, null, this);
        this.coracoesUI = [];
        for (let i = 0; i < 3; i++) {
            const posX = 30 + (i * 40); 
            const imgCoracao = this.add.image(posX, 50, 'coracao_cheio')
                .setScale(1.5)
                .setScrollFactor(0) // Gruda na tela
                .setDepth(10);      // Fica por cima de tudo
            this.coracoesUI.push(imgCoracao);
        }
    }

    update() {
        if (this.player) {
            this.player.update();
        }
    }

    atirar(pointer) {
        let tiro = this.playerBullets.create(this.player.x, this.player.y, 'projetil_prof');
        let angulo = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
        let velocidade = 200; 
        tiro.setVelocity(Math.cos(angulo) * velocidade, Math.sin(angulo) * velocidade);
        tiro.rotation = angulo;
    }

    hitBoss(boss, tiro) {
        tiro.destroy(); 

      // Se o chefe já morreu, ignora qualquer outro tiro!
        if (boss.isDead) return; 

        boss.health -= 1; 

        boss.setTint(0xff0000);
        this.time.delayedCall(100, () => boss.clearTint());

        
        if (boss.health <= 0) {
            
            // Ele morreu agora! Nenhum outro tiro conta mais.
            boss.isDead = true; 
            boss.setVisible(false);
            boss.body.enable = false;

            this.physics.pause(); 

            if (this.musicaBGM) { 
                this.musicaBGM.stop(); 
            }
            this.time.delayedCall(1500, () => {
                
                this.add.rectangle(400, 300, 800, 600, 0x000000).setDepth(9000).setScrollFactor(0);

                let cutscene = this.add.video(400, 300, 'video_final');
                cutscene.setDepth(9001).setScrollFactor(0).setScale(0.6);
                cutscene.play();

                let avisoSpace = this.add.text(400, 550, '[ APERTE ESPAÇO PARA OS CRÉDITOS ]', {
                    fontSize: '22px', fill: '#ffffff', backgroundColor: '#000000'
                }).setOrigin(0.5).setDepth(9999);

                this.input.keyboard.once('keydown-SPACE', () => {
                    
                    avisoSpace.destroy();
                    cutscene.destroy();

                    let videoCreditos = this.add.video(400, 300, 'video_creditos');
                    videoCreditos.setDepth(9002).setScrollFactor(0).setScale(0.6);
                    videoCreditos.play();

                    videoCreditos.on('complete', () => {
                        this.add.text(400, 300, 'FIM', { 
                            fontSize: '50px', fill: '#ffd700', backgroundColor: '#000000' 
                        }).setOrigin(0.5).setDepth(9999);
                    });
                });
            });
        }
    }
    bossAtacar() {
        if (!this.boss.active) return; // Se o boss morreu, ele não atira mais
        // Cria o projétil na posição do Boss
        let tiro = this.bossBullets.create(this.boss.x, this.boss.y, 'projetil_boss');
        // Calcula o ângulo na direção do Professor
        let angulo = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
        // Define a velocidade do tiro do Boss (um pouco mais lento que o do player para ser justo)
        let velocidade = 250; 
        tiro.setVelocity(Math.cos(angulo) * velocidade, Math.sin(angulo) * velocidade);
        // Gira o projétil para apontar pro player
        tiro.rotation = angulo;
    }

    hitPlayer(player, tiroBoss) {
        tiroBoss.destroy(); // O tiro some ao te acertar
        if (this.playerInvulnerable) return; // Não toma dano se estiver no tempo de invencibilidade
        // Ativa o sistema de dano e invencibilidade momentânea
        this.playerInvulnerable = true;
        player.health -= 1;

        if (player.health >= 0 && player.health < 3) {
            this.coracoesUI[player.health].setTexture('coracao_vazio');
        }

        player.setTint(0xff0000);
        this.time.delayedCall(200, () => player.clearTint());
        this.time.delayedCall(1000, () => {
            this.playerInvulnerable = false;
        });
        
        if (player.health <= 0) {
            this.gameOver(); 
        }
    }
    gameOver() {
        this.physics.pause();
        this.player.setTint(0x555555);
         this.musicaBGM.stop();

        this.add.image(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y, 'gameover_img')
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