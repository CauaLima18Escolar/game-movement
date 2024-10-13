const windows = {
    menu: {
        window: document.getElementById('gameMenu'),
        sound: document.getElementById('main-menu-msc')
    },
    character: {
        window: document.getElementById('characterMenu'),
        sound: document.getElementById('main-menu-msc')
    },
    game: {
        window: document.querySelector('canvas'),
        sound: document.getElementById('solo-battle-msc')
    },
    gameOver: {
        window: document.getElementById('gameOver'),
        sound: document.getElementById('death-msc')
    }
}

let currentWindow = windows['menu']
let gameOverW = windows['gameOver']

function windowChange(choose){
    if (currentWindow === windows['game'] && choose === 'gameOver') {
        currentWindow.sound.pause()
        gameOverW.window.style.display = 'grid';
        gameOverW.sound.play()
        return
    }

    if (currentWindow) {
        currentWindow.window.style.display = 'none'
        currentWindow.sound.pause()
    }

    

    currentWindow = windows[choose];
    currentWindow.window.style.display = 'grid';
    currentWindow.sound.play()
}