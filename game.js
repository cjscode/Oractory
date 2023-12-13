let canv = document.querySelector("#game")
let ctx = canv.getContext("2d")
let screen = "home"
let imgs = []
let zoom = 1
let version = "v1.0.8"
document.querySelector("#version").innerHTML = version
// audio stuff that is broken
/*let bgm = new Audio("bg.mp3")
bgm.onended = function () {
    setTimeout(()=>{
        bgm.play()
    },500)
}*/
//let sfx = new Audio("build.mp3")
function buildsfx() {
    //sfx.currentTime = 0
    //sfx.play()
}
const tiles = [
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
const buildings = [
    {
        name: "Home Base",
        id: "HomeBase",
        baseprice: 0,
        basedmg: 0,
        basehealth: 5000,
        desc: "This is your home base. Upgrade this to get new buildings. If this gets destroyed, its all over."
    },
    {
        name: "Stone Mine",
        id: "StoneMine",
        baseprice: 35,
        basedmg: 0,
        basehealth: 750,
        desc: "A basic Stone Mine. Stone collected from here is worth $1."
    },
    {
        name: "Iron Mine",
        id: "IronMine",
        baseprice: 192.5,
        basedmg: 0,
        basehealth: 900,
        desc: "A small Iron Mine. Iron collected from here is worth $5."
    },
    {
        name: "Gold Mine",
        id: "GoldMine",
        baseprice: 1058.75,
        basedmg: 0,
        basehealth: 1200,
        desc: "A nice Gold Mine. Gold collected from here is worth $25."
    },
    {
        name: "Ruby Mine",
        id: "RubyMine",
        baseprice: 5823.13,
        basedmg: 0,
        basehealth: 1350,
        desc: "A cool Ruby Mine. Rubies collected from here are worth $125."
    },
    {
        name: "Diamond Mine",
        id: "DiamondMine",
        baseprice: 32027.19,
        basedmg: 0,
        basehealth: 1500,
        desc: "A complex Diamond Mine. Diamonds collected from here are worth $625."
    },
    {
        name: "Uranium Mine",
        id: "UraniumMine",
        baseprice: 176149.53,
        basedmg: 0,
        basehealth: 1650,
        desc: "An expensive Uranium Mine. Uranium collected from here is worth $3,125."
    },
    {
        name: "Iridium Mine",
        id: "IridiumMine",
        baseprice: 968822.42,
        basedmg: 0,
        basehealth: 1800,
        desc: "A top-of-the-line Iridium Mine. Iridium collected from here is worth $15,625."
    },
    {
        name: "Adamantine Mine",
        id: "AdamantineMine",
        baseprice: 5328523.32,
        basedmg: 0,
        basehealth: 1950,
        desc: "A hi-tech Adamantine Mine. Adamantine collected from here is worth $78,125."
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
buildings.forEach((v, x) => {
    let i = new Image()
    i.src = `img/${v.id}.png`
    imgs.push(i)
})
let ng = {
    wave: 1,
    data: [],
    exp: 0,
    bdata: [],
    base: false,
    lvl: 12,
    bct: []
}
let ngat = ""
function expand() {
    ng.exp++
    const g = (ng.exp * 2 + 1) * (ng.exp * 2 + 1)
    for (let m = 0; m < g; m++) {
        const cx = ng.exp - (m % Math.sqrt(g))
        const cy = ng.exp - (Math.floor(m / Math.sqrt(g)))
        if (cx == 0 - ng.exp || cx == ng.exp || cy == 0 - ng.exp || cy == ng.exp) {
            for (let i = 0; i < 100; i++) {
                ng.data.push({
                    x: cx * 10 + (i % 10),
                    y: cy * 10 + Math.floor(i / 10),
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
    ng.data[Math.floor(Math.random() * ng.data.length)].d = 1
    setTimeout(() => {
        ngat = "Finishing Up"
    }, 250)
    setTimeout(() => {
        ngat = ""
        screen = "game"
    }, Math.random() * 3500)
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
    //bgm.play()
    newgame()
})
if (ctx == null) {
    alert("Your browser does not support this game. Please upgrade your browser to continue.")
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
let down = false
let building = false
for (let i = 0; i < 200; i++) {
    starx[i] = Math.random()
    stary[i] = Math.random()
    starspd[i] = Math.random() / 5
}
function handledown(e) {
    if (!(screen == "game") || e.clientY >= document.body.clientHeight - Math.min(document.body.clientWidth, document.body.clientHeight) * 0.11 || inspectingbuilding) { return }
    bx = x
    by = y
    dx = e.clientX
    dy = e.clientY
    down = true
}
//pc
document.onmousedown = handledown
//mobile
document.ontouchstart = (e) => {
    handledown(e.touches[0])
}
//global
document.onmouseup = function () { down = false }
function handlemove(e) {
    if (!(screen == "game") || e.clientY >= document.body.clientHeight - Math.min(document.body.clientWidth, document.body.clientHeight) * 0.11 || !(down) || inspectingbuilding) { return }
    x = e.clientX - dx + bx
    y = e.clientY - dy + by
}
//pc
document.onmousemove = handlemove
//mobile
document.ontouchmove = (e) => {
    handlemove(e.touches[0])
}
function zoomin() {
    if (zoom <= 0.5) {
        return
    }
    zoom = (zoom <= 0.5 ? 0.5 : zoom - 0.5)
    //x = -250*Math.pow(zoom,-1)+250+x/zoom
    //y = -250*Math.pow(zoom,-1)+250+y/zoom
}
function zoomout() {
    if (zoom >= 10) {
        return
    }
    zoom = (zoom >= 10 ? 10 : zoom + 0.5)
    //x = -250*Math.pow(zoom,-1)+250+x*zoom
    //y = -250*Math.pow(zoom,-1)+250+y*zoom
}
document.onwheel = function (e) {
    if (!(screen == "game") || inspectingbuilding) { return }
    if (e.deltaY == -100) {
        zoomin()
    } else if (e.deltaY == 100) {
        zoomout()
    }
}
let frame = 0
let fps = 60
let lloop = new Date()
document.onkeyup = (e) => {
    if (!(screen == "game")) { return }
    if (e.key == "i") {
        zoomin()
    } else if (e.key == "o") {
        zoomout()
    } else if (e.key == "e") {
        expand()
    } else if (e.key == "r") {
        zoom = 1
        x = 0
        y = 0
    }
}
document.querySelector("#zoomin").addEventListener("click", () => {
    zoomin()
})
document.querySelector("#zoomout").addEventListener("click", () => {
    zoomout()
})
document.querySelector("#zoomin2").addEventListener("click", () => {
    zoomin()
})
document.querySelector("#zoomout2").addEventListener("click", () => {
    zoomout()
})
document.querySelector("#reset").addEventListener("click", () => {
    zoom = 1
    x = 0
    y = 0
})
document.querySelector("#reset2").addEventListener("click", () => {
    zoom = 1
    x = 0
    y = 0
})
buildings.forEach((v, i) => {
    ng.bct[i] = ng.bct[i] ? ng.bct[i] : 0
})
let selectedbuilding = null
let inspectingbuilding = false
function beginbuilding(b) {
    if (building || inspectingbuilding) { return }
    const index = buildings.findIndex(item => item.id == b)
    if (!(isenabled(index))) {
        return
    }
    selectedbuilding = index
    document.querySelector("#bamount").innerHTML = `${ng.bct[selectedbuilding]} / ${selectedbuilding == 0 ? 1 : (ng.lvl - (selectedbuilding - 2) * 3)}`
    document.querySelector("#bprice").innerHTML = `$${buildings[selectedbuilding].baseprice}`
    document.querySelector("#selectedb").src = `img/${b}.png`
    building = true
    let ev = document.addEventListener("click", (e) => {
        if (!(building)) {
            return
        }
        if (!(screen == "game") || e.clientY >= document.body.clientHeight - Math.min(document.body.clientWidth, document.body.clientHeight) * 0.11) {
            return
        }
        const bx = Math.floor((e.clientX + 250 - x - document.body.clientWidth / 2) / (50 / zoom))
        const by = Math.floor((e.clientY + 250 - y - document.body.clientHeight / 2) / (50 / zoom))
        const idx = ng.data.findIndex(item => (bx == item.x && by == item.y))
        if (idx == -1) {
            return
        }
        if (!(ng.data[idx].d == 0) || !(ng.bdata.findIndex(item => (item.x == bx) && (item.y == by)) == -1)) {
            return
        }
        if (selectedbuilding == 0) {
            if (ng.base) {
                return
            } else {
                ng.base = true
            }
        }
        ng.bdata.push({
            x: bx,
            y: by,
            id: buildings[selectedbuilding].id,
            l: 1
        })
        ng.bct[selectedbuilding] = ng.bct[selectedbuilding] == undefined ? 1 : ng.bct[selectedbuilding] + 1
        document.querySelector("#bprice").innerHTML = `$${buildings[selectedbuilding].baseprice}`
        document.querySelector("#bamount").innerHTML = `${ng.bct[selectedbuilding]} / ${ng.lvl - (selectedbuilding - 2) * 3}`
        buildsfx()
        if (!(isenabled(selectedbuilding))) {
            building = false
            selectedbuilding = null
            document.removeEventListener("click", ev)
        }
    })
    document.querySelector("#bexit").addEventListener("click", () => {
        if (!(building) || !(screen == "game")) { return }
        building = false
        selectedbuilding = null
        document.removeEventListener("click", ev)
    })
}
buildings.forEach((v, i) => {
    let c = document.createElement("span")
    c.classList.add("gbitem")
    c.innerHTML = `<img src="img/${v.id}.png">`
    c.addEventListener("click", () => {
        beginbuilding(v.id)
    })
    document.querySelector("#gamebar").appendChild(c)
})
document.querySelectorAll(".bstat").forEach((v, i) => {
    v.style.bottom = `${12 + i * 3}vmin`
})
document.addEventListener("click", (e) => {
    if (!(screen == "game") || building) {
        return
    }
    inspectingbuilding = true
    const bx = Math.floor((e.clientX + 250 - x - document.body.clientWidth / 2) / (50 / zoom))
    const by = Math.floor((e.clientY + 250 - y - document.body.clientHeight / 2) / (50 / zoom))
    const idx = ng.bdata.findIndex(item => (bx == item.x && by == item.y))
    if (idx == -1) {
        return
    }
    const bidx = buildings.findIndex(item => item.id == ng.bdata[idx].id)
    document.querySelector("#upgname").innerHTML = `<b>${buildings[bidx].name}</b>`
    document.querySelector("#upgdesc").innerHTML = buildings[bidx].desc
    document.querySelector("#uworth").innerHTML = "<b>Worth:</b> N/A"
    document.querySelector("#ulvl").innerHTML = `<b>Level:</b> ${ng.bdata[idx].l}`
    document.querySelector("#uhealth").innerHTML = `<b>Health:</b> ${buildings[bidx].basehealth}`
    document.querySelector("#udmg").innerHTML = `<b>DMG:</b> ${buildings[bidx].basedmg}`
    document.querySelector("#upgui").style.display = "block"
})
function isenabled(idx) {
    if (idx < 0) { return false }
    // logic
    if (idx == 0) {
        // homebase
        if (ng.base) {
            return false
        }
    } else if (idx >= 1 && idx <= 8) {
        // mines
        if (!(ng.base)) {
            return false
        }
        if (ng.lvl < (idx - 1) * 3) {
            return false
        }
        if (ng.bct[idx] >= (ng.lvl - (idx - 2) * 3) && !(ng.bct[idx] == undefined)) {
            return false
        }
    }
    return true
}
function render() {
    let tloop = new Date()
    fps = 1000 / (tloop - lloop)
    lloop = tloop
    /*move boundaries that dont work
    x = (x < ((ng.exp-1)*500+250)*zoom ? ((ng.exp-1)*500+250)*zoom : x)
    x = (x > -((ng.exp-1)*500+250)*zoom ? -((ng.exp-1)*500+250)*zoom : x)
    y = (y < ((ng.exp-1)*500+250)*zoom ? ((ng.exp-1)*500+250)*zoom : y)
    y = (y > -((ng.exp-1)*500+250)*zoom ? -((ng.exp-1)*500+250)*zoom : y)
    */
    document.querySelector("#fps").innerHTML = Math.floor(fps)
    canv.width = document.body.clientWidth
    canv.height = document.body.clientHeight
    canv.style.width = document.body.clientWidth + "px"
    canv.style.height = document.body.clientHeight + "px"
    ctx.clearRect(0, 0, canv.width, canv.height)
    ctx.fillStyle = "rgb(240,240,240)"
    starx.forEach((v, i) => {
        ctx.fillRect(v * canv.width, stary[i] * canv.height, 10 * starspd[i], 10 * starspd[i])
        starx[i] += starspd[i] / 500
        if (starx[i] > 1) {
            starx[i] = -2 / canv.height
            stary[i] = Math.random()
            starspd[i] = Math.random() / 5
        }
    })
    if (screen == "loading") {
        function dots() {
            const g = Math.ceil(Date.now() % 3000 / 1000)
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
        const yoffset = -250 + document.body.clientHeight / 2 + y
        const xoffset = -250 + document.body.clientWidth / 2 + x
        ng.data.forEach((v, i) => {
            ctx.drawImage(imgs[v.d], (v.x * 50 / zoom) + xoffset, (v.y * 50 / zoom) + yoffset, 50 / zoom, 50 / zoom)
        })
        ng.bdata.forEach((v, i) => {
            ctx.drawImage(imgs[buildings.findIndex(item => item.id == v.id) + 9], (v.x * 50 / zoom) + xoffset, (v.y * 50 / zoom) + yoffset, 50 / zoom, 50 / zoom)
        })
    } else if (screen == "home") {
        document.querySelector("#gamebar").style.display = "none"
        document.querySelector("#stats").style.display = "none"
    }
    if (building) {
        document.querySelector("#gamebar").style.display = "none"
        document.querySelector("#buildbar").style.display = "block"
    } else {
        document.querySelector("#buildbar").style.display = "none"
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
    document.querySelectorAll(".gbitem").forEach((v, i) => {
        v.style.left = `${1 + i * 10}vmin`
        if (i > 3) {
            if (isenabled(i - 4)) {
                v.classList.remove("disabled")
            } else {
                v.classList.add("disabled")
            }
        }
    })
    document.querySelectorAll(".bitem").forEach((v, i) => {
        v.style.left = `${1 + i * 10}vmin`
    })
    document.querySelectorAll(".bstat").forEach((v) => {
        if (building) {
            v.style.display = "block"
        } else {
            v.style.display = "none"
        }
    })
    document.querySelectorAll(".ustat").forEach((v, i) => {
        v.style.top = `${i * 3}vmin`
    })
    document.querySelector("#gamebar").style.width = `${document.querySelectorAll(".gbitem").length * 10 + 1}vmin`
    document.querySelector("#buildbar").style.width = `${document.querySelectorAll(".bitem").length * 10 + 1}vmin`
    frame++
    requestAnimationFrame(render)
}
render()