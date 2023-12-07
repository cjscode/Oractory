let canv = document.querySelector("#game")
let ctx = canv.getContext("2d")
let screen = "home"
let imgs = []
let zoom = 1
let tiles = [
    "Air",
    "Stone",
    "Iron",
    "Gold",
    "Ruby",
    "Diamond",
    "Uranium",
    "Iridium",
    "Adamantine"
]
let tilechance = []
tiles.forEach((v, x) => {
    let i = new Image()
    i.src = `img/${v}.png`
    imgs[x] = i
    if (x == 0) {
        x = -3
    }
    for (i = 0; i < Math.pow(2, tiles.length - x - 1); i++) {
        tilechance.push(v)
    }
})
let ng = {
    wave: 1,
    data: [],
    exp: 0
}
let ngat = ""
function expand () {
    ng.exp++
    let g = (ng.exp*2+1)*(ng.exp*2+1)
    for (let m = 0; m < g; m++) {
        let cx = ng.exp-(m%Math.sqrt(g))
        let cy = ng.exp-(Math.floor(m/Math.sqrt(g)))
        if (cx == 0-ng.exp || cx == ng.exp || cy == 0-ng.exp || cy == ng.exp) {
            for (let i = 0; i < 100; i++) {
                ng.data.push({
                    x: cx*10+(i % 10),
                    y: cy*10+Math.floor(i / 10),
                    d: tiles.indexOf(tilechance[Math.floor(tilechance.length * Math.random())])
                })
            }
        }
    }
}
async function newgame() {
    ngat = "Generating World"
    for (let i = 0; i < 100; i++) {
        ng.data.push({
            x: i % 10,
            y: Math.floor(i / 10),
            d: tiles.indexOf(tilechance[Math.floor(tilechance.length * Math.random())])
        })
    }
    setTimeout(() => {
        ngat = "Finishing Up"
    },250)
    setTimeout(()=> {
        ngat = ""
        screen = "game"
    },Math.random()*3500)
}
document.querySelector("#loadfile").addEventListener("change", function () {
    let fr = new FileReader()
    if (this.files[0].type && !(this.files[0].type.startsWith("application/json"))) {
        alert("File is not in requested format. Please try again.")
        return
    }
    fr.addEventListener("load", (e) => {
        alert(atob(e.target.result.split(",")[1]))
    })
    fr.readAsDataURL(this.files[0])
})
document.querySelector("#ng").addEventListener("click", function () {
    screen = "loading"
    newgame()
})
if (ctx == null) {
    alert("Your browser does not support this game. Please upgrade your browser to continue.")
}
window.addEventListener("error", function (e) {
    alert(`Error occured: ${e.error} at #${e.lineno} in ${e.filename}`)
})
function handleClick(e) {

}
let x = 0
let y = 0
let px = 0
let py = 0
let dx = 0
let dy = 0
let bx = 0
let by = 0
let starx = []
let stary = []
let starspd = []
for (let i = 0; i < 200; i++) {
    starx[i] = Math.random()
    stary[i] = Math.random()
    starspd[i] = Math.random() / 5
}
document.ontouchstart = function (e) {
    if (!(screen == "game")) { return }
    bx = x
    by = y
    e = e.touches[0]
    dx = e.clientX
    dy = e.clientY
}
document.ontouchmove = function (e) {
    if (!(screen == "game")) { return }
    e = e.touches[0]
    x = e.clientX - dx + bx
    y = e.clientY - dy + by
}
document.onclick = function (e) {
    if (!(screen == "game")) { return }
    handleClick(e)
}
let frame = 0
let fps = 60
let lloop = new Date()
document.onkeyup = (e) => {
    if (e.key == "i") {
        zoom = (zoom <= 0.5 ? zoom : zoom - 0.5)
    } else if (e.key == "o") {
        zoom = (zoom >= 10 ? zoom : zoom + 0.5) 
    } else if (e.key == "e") {
        expand()
    }
}
function render() {
    let tloop = new Date()
    fps = 1000/(tloop-lloop)
    lloop = tloop
    //move boundaries that dont work
    /*x = (x < ((ng.exp-1)*500+250)*zoom ? ((ng.exp-1)*500+250)*zoom : x)
    x = (x > -((ng.exp-1)*500+250)*zoom ? -((ng.exp-1)*500+250)*zoom : x)
    y = (y < ((ng.exp-1)*500+250)*zoom ? ((ng.exp-1)*500+250)*zoom : y)
    y = (y > -((ng.exp-1)*500+250)*zoom ? -((ng.exp-1)*500+250)*zoom : y)
    */
    document.querySelector("#fps").innerHTML = Math.floor(fps)
    canv.width = document.body.clientWidth
    canv.height = document.body.clientHeight
    canv.style.width = document.body.clientWidth+"px"
    canv.style.height = document.body.clientHeight+"px"
    ctx.clearRect(0, 0, canv.width, canv.height)
    ctx.fillStyle = "rgb(240,240,240)"
    starx.forEach((v, i) => {
        ctx.fillRect(v * canv.width, stary[i] * canv.height, 2, 2)
        starx[i] += starspd[i] / 500
        if (starx[i] > 1) {
            starx[i] = -2 / canv.height
            stary[i] = Math.random()
            starspd[i] = Math.random() / 5
        }
    })
    if (screen == "loading") {
        function dots() {
            let g = Math.ceil(Date.now() % 3000 / 1000)
            if (g == 1) {
                return "."
            } else if (g == 2) {
                return ".."
            } else {
                return "..."
            }
        }
        document.querySelector("#loading").innerHTML = `${ngat}${dots()}`
        document.querySelector("#menutitle").style.display = "block"
        document.querySelector("#gamebar").style.display = "none"
        document.querySelector("#stats").style.display = "none"
    } else if (screen == "game") {
        document.querySelector("#menutitle").style.display = "none"
        document.querySelector("#gamebar").style.display = "block"
        document.querySelector("#stats").style.display = "block"
        ng.data.forEach((v, i) => {
            ctx.drawImage(imgs[v.d], (v.x * 50/zoom)+x-250+document.body.clientWidth/2, (v.y * 50/zoom)+y-250+document.body.clientHeight/2, 50/zoom, 50/zoom)
        })
    } else if (screen == "home") {
        document.querySelector("#gamebar").style.display = "none"
        document.querySelector("#stats").style.display = "none"
    }
    document.querySelectorAll(".toggle").forEach((v) => {
        if (v.classList.contains("enabled")) {
            v.src = "img/toggle-enabled.png"
        } else {
            v.src = "img/toggle-disabled.png"
        }
    })
    document.querySelectorAll("#buttons > button, #loading").forEach((v) => {
        if (screen == v.dataset.show) {
            v.style.display = "block"
        } else {
            v.style.display = "none"
        }
    })
    document.querySelectorAll(".gbitem").forEach((v,i) => {
        v.style.left = `${1+i*10}vmin`
    })
    document.querySelector("#gamebar").style.width = `${document.querySelectorAll(".gbitem").length*10+1}vmin`
    frame++
    requestAnimationFrame(render)
}
render()