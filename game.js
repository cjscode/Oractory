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
let buildings = [
    {
        name: "Main Base",
        id: "MainBase"
    }
]
let tilechance = []
tiles.forEach((v, x) => {
    let i = new Image()
    i.src = `img/${v}.png`
    imgs.push(i)
    if (x == 0) {
        x = -3
    }
    for (i = 0; i < Math.pow(2, tiles.length - x - 1); i++) {
        tilechance.push(v)
    }
})
buildings.forEach((v,x) => {
    let i = new Image()
    i.src = `img/${v.id}.png`
    imgs.push(i)
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
    ng.data[Math.floor(Math.random()*ng.data.length)].d = 1
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
    e = e.touches[0]
    if (!(screen == "game") || e.clientY >= document.body.clientHeight-Math.min(document.body.clientWidth,document.body.clientHeight)*0.11) { return }
    bx = x
    by = y
    dx = e.clientX
    dy = e.clientY
}
document.ontouchmove = function (e) {
    e = e.touches[0]
    if (!(screen == "game") || e.clientY >= document.body.clientHeight-Math.min(document.body.clientWidth,document.body.clientHeight)*0.11) { return }
    x = e.clientX - dx + bx
    y = e.clientY - dy + by
}
document.onclick = function (e) {
    if (!(screen == "game") || e.clientY >= document.body.clientHeight-Math.min(document.body.clientWidth,document.body.clientHeight)*0.11) { return }
    handleClick(e)
}
let frame = 0
let fps = 60
let lloop = new Date()
document.onkeyup = (e) => {
    if (!(screen == "game")) { return }
    if (e.key == "i") {
        zoom = (zoom <= 0.5 ? 0.5 : zoom - 0.5)
    } else if (e.key == "o") {
        zoom = (zoom >= 10 ? 10 : zoom + 0.5) 
    } else if (e.key == "e") {
        expand()
    } else if (e.key == "r") {
        zoom = 1
        x = 0
        y = 0
    }
}
document.querySelector("#zoomin").addEventListener("click",() => {
    zoom = (zoom <= 0.5 ? 0.5 : zoom - 0.5)
    x = -250*Math.pow(zoom,-1)+250//-x
    y = -250*Math.pow(zoom,-1)+250//-y
})
document.querySelector("#zoomout").addEventListener("click",() => {
    zoom = (zoom >= 10 ? 10 : zoom + 0.5)
    x = -250*Math.pow(zoom,-1)+250//-x
    y = -250*Math.pow(zoom,-1)+250//-y
})
document.querySelector("#reset").addEventListener("click",() => {
    zoom = 1
    x = 0
    y = 0
})
function render() {
    let tloop = new Date()
    fps = 1000/(tloop-lloop)
    lloop = tloop
    /*move boundaries that dont work
    x = (x < ((ng.exp-1)*500+250)*zoom ? ((ng.exp-1)*500+250)*zoom : x)
    x = (x > -((ng.exp-1)*500+250)*zoom ? -((ng.exp-1)*500+250)*zoom : x)
    y = (y < ((ng.exp-1)*500+250)*zoom ? ((ng.exp-1)*500+250)*zoom : y)
    y = (y > -((ng.exp-1)*500+250)*zoom ? -((ng.exp-1)*500+250)*zoom : y)
    */
    document.querySelector("#fps").innerHTML = Math.floor(fps)+" - x:"+x+" y:"+y//+(document.body.clientWidth/2-((5 * 50/zoom)+x-250+document.body.clientWidth/2))+" y:"+(document.body.clientHeight/2-((5 * 50/zoom)+y-250+document.body.clientHeight/2))
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