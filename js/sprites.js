const gravity = 0.5;

const floorHigh = 200

const backgroundSpritePath = '../assets/bg/bg.jpg';
const defaultObjectSpritePath = '../assets/objects/square.svg';

let restartGame

// Classe para carregar sprites
class Sprite {
    constructor({position, velocity, source, scale, offset, sprites}) {
        this.position = position // Posição inicial do sprite X e Y
        this.velocity = velocity // A velocidade do sprite

        // Ajustes dos sprites
        this.scale = scale || 1
        this.image = new Image()
        this.image.src = source || defaultObjectSpritePath

        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale

        // Define o deslocamento da img X e Y
        this.offset = offset || {
            x: 0,
            y: 0
        }

        // Guarda todos os sprites fornecidos
        this.sprites = sprites || {
            idle: {
                src: this.image.src,
                totalSpriteFrames: 1,
                framesPerSpriteFrame: 1
            }
        }

        // Guarda a ordem atual de sprites
        this.currentSprite = this.sprites.idle

        
        this.elapsedTime = 0 // Controla o tempo entre as animações
        this.currentSpriteFrame = 0 // Controla cada sprite da ordem
        this.totalSpriteFrames = this.sprites.idle.totalSpriteFrames // Guarda o total de sprites da ordem
        this.framesPerSpriteFrame = this.sprites.idle.framesPerSpriteFrame
    }

    setSprite(sprite){
        // Busca por uma ordem de sprites no objeto sprites.
        this.currentSprite = this.sprites[sprite]

        // Se o sprite não foi encontrado, idle é o sprite padrãp.
        if (!this.currentSprite) {
            this.currentSprite = this.sprites.idle
        }
    }

    // Carrega a imagem do sprite atual e ajusta a posição se necessário
    loadSprite() {
        let previousSprite = this.image.src

        this.image = new Image()
        this.image.src = this.currentSprite.src
        this.width = this.image.width * this.scale
        this.height = this.image.height * this.scale

        this.totalSpriteFrames = this.currentSprite.totalSpriteFrames
        this.framesPerSpriteFrame = this.currentSprite.framesPerSpriteFrame

        let newSprite = this.image.src

        if (previousSprite != newSprite) {
            let previousSpriteImage = new Image()
            previousSpriteImage.src = previousSprite

            this.position.y += (previousSpriteImage.height - this.image.height) * this.scale
        }
    }

    // Carregar o sprite
    draw() {
        ctx.imageSmoothingEnabled = false

        const xScale = this.facing === 'left' ? -1 : 1

        ctx.save()
        ctx.translate(this.position.x + this.offset.x, this.position.y + this.offset.y)
        ctx.scale(xScale, 1)
        
        ctx.drawImage(
            this.image,
            this.currentSpriteFrame * this.image.width / this.totalSpriteFrames,
            0,
            this.image.width / this.totalSpriteFrames,
            this.image.height,
            0,
            0,
            this.width / this.totalSpriteFrames * xScale,
            this.height
        )

        ctx.restore()
    }

    animate(isAlive) {
        this.elapsedTime++;
    
        if (isAlive) {
            if (this.elapsedTime >= this.framesPerSpriteFrame) {
                this.currentSpriteFrame++;
    
                if (this.currentSpriteFrame >= this.totalSpriteFrames) {
                    this.currentSpriteFrame = 0; 
                }
    
                this.elapsedTime = 0;
            }
        } else {
            if (this.elapsedTime >= this.framesPerSpriteFrame) {
                if (!this.stopIncrement) {
                    this.currentSpriteFrame++;
    
                    if (this.currentSpriteFrame >= this.totalSpriteFrames) {
                        this.currentSpriteFrame = this.totalSpriteFrames - 1;
                        this.stopIncrement = true; 
                    }
                }
    
                this.elapsedTime = 0;
            }
        }
    }
    

    // Atualizar o sprite
    update() {
        this.draw()
        this.animate(true)
    }
};

// Classe para carregar personagem
class Character extends Sprite {
    constructor({
        position,
        velocity,
        scale,
        sprites,
        damage,
        health
    }) {
        super({
            position,
            velocity,
            scale,
            sprites
        })

        this.velocity = velocity

        this.damage = damage || 15
        this.health = health || 20
        this.previousHealth = this.health

        this.enemyHurting
        this.isAlive = true

        this.isAttacking
        this.attackCooldown = 500
        this.onAttackCooldown

        this.lastKeyPressed
        this.onGround
    }

    gravity() {
        if (Math.ceil(this.position.y + this.height >= canvasHeight - floorHigh)){
            this.onGround = true
        } else {
            this.onGround = false
        }

        if (this.position.y + this.height > canvasHeight - floorHigh){
            this.position.y = canvasHeight - this.height - floorHigh
            this.velocity.y = 0
        } else {
            if (!this.onGround) this.velocity.y += gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    update(){
        if (this.isAlive) {
            this.gravity()
            this.loadSprite()
            this.takingDamage()
            this.draw()
            this.animate(this.isAlive)

        } else {
            this.setSprite('death')

            this.gravity()
            this.loadSprite()
            this.draw()
            this.animate(this.isAlive)
        }
    }

    takeDamage(amount) {
        if (!this.isAlive) return;

        this.health -= amount;

        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }

        this.previousHealth = this.health; 
    }

    takingDamage() {
        if (this.health !== this.previousHealth) {
            this.setSprite('hurt');
            console.log('dano')
        }

        this.previousHealth = this.health;
    }

    attack() {
        if (this.onAttackCooldown) return

        this.isAttacking = true
        this.onAttackCooldown = true

        setTimeout(() => {
            this.isAttacking = false
        }, 400)

        setTimeout(() => {
            this.onAttackCooldown = false
        }, this.attackCooldown)
    }

    jump() {
        if (!this.onGround) return
        this.velocity.y = -16
    }
};

class CentipleEnemy extends Sprite {
    constructor({
        position,
        velocity,
        scale,
        sprites,
        damage,
        health,
        fov,
        atkRange
    }) {
        super({
            position,
            velocity,
            scale,
            sprites
        });

        this.damage = damage || 10; // Dano do inimigo
        this.health = health || 50; // Vida do inimido
        this.closeToPlayer = false // se está proximo do player
        this.fov = fov || 500 // Campo de visão do inimigo
        this.AtkRange = atkRange || 100
        this.isAlive = true // Se está vivo
        this.canMove = false // Se pode se mover
        
        this.playerLife = 50

        this.isAttacking
        this.attackCooldown = 1600
        this.onAttackCooldown
    }

    walkToPlayer() {
        const playerDistanceX = player.position.x - this.position.x;
        const playerDistanceY = player.position.y - this.position.y;
    
        // Verifica se o jogador está dentro do campo de visão
        if (Math.abs(playerDistanceX) <= this.fov) {
            this.setSprite('sneer');
    
            setTimeout(() => {
                this.canMove = true;
            }, 1000);
        }
    
        if (this.canMove) {
            // Determina se o inimigo está perto do jogador (dentro do alcance de ataque)
            if (Math.abs(playerDistanceX) <= this.AtkRange && Math.abs(playerDistanceY) <= this.AtkRange) {
                this.closeToPlayer = true;
                this.setSprite('idle');
                this.velocity.x = 0;
            } else {
                this.closeToPlayer = false;
                this.setSprite('walk');
    
                // Move em direção ao jogador
                if (playerDistanceX < 0) {
                    this.facing = 'right';
                    this.velocity.x = -1.5; 
                } else { // Jogador está à direita
                    this.facing = 'left';
                    this.velocity.x = 1.5; 
                }
            }
        }
    }

    attack() {
        if (this.onAttackCooldown) return

        this.isAttacking = true
        this.onAttackCooldown = true
        player.takeDamage(this.damage)

        console.log(player.health)

        setTimeout(() => {
            this.isAttacking = false
        }, 800)

        setTimeout(() => {
            this.onAttackCooldown = false
        }, 1600)
    }

    gravity() {
        if (Math.ceil(this.position.y + this.height >= canvasHeight - floorHigh)){
            this.onGround = true
        } else {
            this.onGround = false
        }

        if (this.position.y + this.height > canvasHeight - floorHigh){
            this.position.y = canvasHeight - this.height - floorHigh
            this.velocity.y = 0
        } else {
            if (!this.onGround) this.velocity.y += gravity
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    update() {
        if (this.isAlive) {
            this.gravity();
            this.loadSprite();
            this.draw();
            this.animate(this.isAlive)
            this.walkToPlayer()

            if (this.closeToPlayer && player.isAlive) {
                this.attack();
            }

            if (this.isAttacking) {
                this.setSprite('attacking')
            }
        }
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    source: backgroundSpritePath
});

let player = new Character({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    scale: 2
});

let centipede = new CentipleEnemy({
    position: {
        x: 1300,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    sprites: {
        idle: {
            src: '../assets/enemy/Centiple/Centipede_idle.png',
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 20
        },
        walk: {
            src: '../assets/enemy/Centiple/Centipede_walk.png',
            totalSpriteFrames: 4,
            framesPerSpriteFrame: 12
        },
        sneer: {
            src: '../assets/enemy/Centiple/Centipede_sneer.png',
            totalSpriteFrames: 6,
            framesPerSpriteFrame: 18
        },
        attacking: {
            src: '../assets/enemy/Centiple/Centipede_attack2.png',
            totalSpriteFrames: 6,
            framesPerSpriteFrame: 10
        },
    },
    offset: {
        x: 0,
        y: 0
    },
    fov: 900,
    scale: 3
});

if (restartGame) {
    player = new Character({
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        scale: 2
    });
    
    centipede = new CentipleEnemy({
        position: {
            x: 1300,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        sprites: {
            idle: {
                src: '../assets/enemy/Centiple/Centipede_idle.png',
                totalSpriteFrames: 4,
                framesPerSpriteFrame: 20
            },
            walk: {
                src: '../assets/enemy/Centiple/Centipede_walk.png',
                totalSpriteFrames: 4,
                framesPerSpriteFrame: 12
            },
            sneer: {
                src: '../assets/enemy/Centiple/Centipede_sneer.png',
                totalSpriteFrames: 6,
                framesPerSpriteFrame: 18
            },
            attacking: {
                src: '../assets/enemy/Centiple/Centipede_attack2.png',
                totalSpriteFrames: 6,
                framesPerSpriteFrame: 10
            },
        },
        offset: {
            x: 0,
            y: 0
        },
        fov: 900,
        scale: 3
    });
}
