const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false,
    },

    M1: {
        pressed: false,
		hold: false
    },
}

window.addEventListener('keydown', (e) => {
    let key = e.key

    switch(key){
		case 'ArrowLeft':
        case 'a':
            keys.a.pressed = true
			player.lastKeyPressed = key
            break
		case 'ArrowRight':
        case 'd':
            keys.d.pressed = true
			player.lastKeyPressed = key
            break
		case 'z':
		case ' ':
			keys.space.pressed = true
			break
    }
});

window.addEventListener('keyup', (e) => {
    let key = e.key

    switch(key){
		case 'ArrowLeft':
        case 'a':
            keys.a.pressed = false
            break
		case 'ArrowRight':
        case 'd':
            keys.d.pressed = false
            break
		case 'z':
		case ' ':
			keys.space.pressed = false
			keys.space.hold = false
			break
    }
});

window.addEventListener('mousedown', (e) => {
	let mouseButton = e.button

	if (mouseButton === 0){
		keys.M1.pressed = true
	}
});

window.addEventListener('mouseup', (e) => {
	let mouseButton = e.button

	if (mouseButton === 0){
		keys.M1.pressed = false
		keys.M1.hold = false
	}
});

function handleControls(){
	player.setSprite('idle')

	if (!player.onGround) player.setSprite('jumping')
	if (player.isAttacking) player.setSprite('attacking')
	
	if (player.isAlive) {
		movement()
		attacks()
	}

	function movement(){
		player.velocity.x = 0

		if (keys.a.pressed && ['a', 'ArrowLeft'].includes(player.lastKeyPressed)){
			player.velocity.x = -1.5 * 3.5
			player.facing = 'left'

			if (!player.onGround) return
		
			player.setSprite('running')
		}

		if (keys.d.pressed && ['d', 'ArrowRight'].includes(player.lastKeyPressed)){
			player.velocity.x = 1.5 * 3.5
			player.facing = 'right'

			if (!player.onGround) return
			
			player.setSprite('running')
		}

		if (keys.space.pressed){
			player.jump()
			player.setSprite('jumping')
		}
	}

	function attacks() {
		if (keys.M1.pressed && !keys.M1.hold){
			player.attack()
			keys.M1.hold = true
		}
	}
}

