const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

const canvasWidth = 1024
const canvasHeight = 576

canvas.width = canvasWidth
canvas.height = canvasHeight

let preventTime = 0

animate()

function animate(){
    window.requestAnimationFrame(animate)

    handleControls()

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    player.update()

    let delta = (performance.now() - preventTime) / 1000
    let fps = 1 / delta

    preventTime = performance.now()
    // console.log(`FPS: ${fps}`)
}