const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 1600
const canvasHeight = 900 

canvas.width = canvasWidth
canvas.height = canvasHeight

const desiredFPS = 120
const frameTime = 1000 / desiredFPS
    
let preventTime = performance.now()
let lag = 0

function getCharacter({ target }){
    const characters = {
        Enchantress: {
            idle: {
                src: '../assets/player/Enchantress/idle.png',
                totalSpriteFrames: 5,
                framesPerSpriteFrame: 16
            },
            jumping: {
                src: '../assets/player/Enchantress/jump.png',
                totalSpriteFrames: 8,
                framesPerSpriteFrame: 8
            },
            attacking: {
                src: '../assets/player/Enchantress/attack_1.png',
                totalSpriteFrames: 6,
                framesPerSpriteFrame: 8
            },
            running: {
                src: '../assets/player/Enchantress/run.png',
                totalSpriteFrames: 8,
                framesPerSpriteFrame: 4
            },
            death: {
                src: '../assets/player/Enchantress/dead.png',
                totalSpriteFrames: 5,
                framesPerSpriteFrame: 30
            },
            hurt: {
                src: '../assets/player/Enchantress/hurt.png',
                totalSpriteFrames: 2,
                framesPerSpriteFrame: 8
            }
        },
        Knight: {
            idle: {
                src: '../assets/player/Knight/idle.png',
                totalSpriteFrames: 6,
                framesPerSpriteFrame: 16
            },
            jumping: {
                src: '../assets/player/Knight/jump.png',
                totalSpriteFrames: 6,
                framesPerSpriteFrame: 8
            },
            attacking: {
                src: '../assets/player/Knight/attack_3.png',
                totalSpriteFrames: 5,
                framesPerSpriteFrame: 8
            },
            running: {
                src: '../assets/player/Knight/run.png',
                totalSpriteFrames: 7,
                framesPerSpriteFrame: 4
            },
            death: {
                src: '../assets/player/Knight/dead.png',
                totalSpriteFrames: 4,
                framesPerSpriteFrame: 18
            },
        },
        Musketeer: {
            idle: {
                src: '../assets/player/Musketeer/idle.png',
                totalSpriteFrames: 5,
                framesPerSpriteFrame: 16
            },
            jumping: {
                src: '../assets/player/Musketeer/jump.png',
                totalSpriteFrames: 7,
                framesPerSpriteFrame: 8
            },
            attacking: {
                src: '../assets/player/Musketeer/attack_4.png',
                totalSpriteFrames: 5,
                framesPerSpriteFrame: 8
            },
            running: {
                src: '../assets/player/Musketeer/run.png',
                totalSpriteFrames: 8,
                framesPerSpriteFrame: 4
            },
            death: {
                src: '../assets/player/Musketeer/dead.png',
                totalSpriteFrames: 4,
                framesPerSpriteFrame: 18
            },
        }
    }

    const characterName = target.textContent.trim()
    const characterSprite = characters[characterName]

    startSoloGame(characterSprite)
}

function startSoloGame(character) {
    windowChange('game')
    animate()

    function animate(){
        const currentTime = performance.now()
        const elapsed = currentTime - preventTime
        preventTime = currentTime
        lag += elapsed

        handleControls()

        while (lag >= frameTime) {
            ctx.fillStyle = "black"
            ctx.fillRect(0, 0, canvasWidth, canvasHeight)
            
            background.update()
            centipede.update()
            player.sprites = character
            player.update()

            lag -= frameTime

            if (!player.isAlive) {
                windowChange('gameOver')
            }

            if (restartGame) {
                windowChange('menu')
                break
            }
        }

        window.requestAnimationFrame(animate)
    }
}

function restart() {
    restartGame = true
}



