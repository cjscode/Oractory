let canv = document.querySelector("#game")
let ctx = canv.getContext("2d")
let screen = "home"
let imgs = []
let zoom = 1
let selectedtab = 0
let version = "v1.0.14"
document.querySelector("#version").innerHTML = version
//banger bg music
let bgm = new Audio("bg.mp3")
bgm.onended = function () {
    setTimeout(() => {
        bgm.play()
    }, 500)
}
//this is broken sometimes it doesnt play :(
//let sfx = new Audio("build.mp3")
function buildsfx() {
    return
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
const itemdata = {
    "Stone": {
        price: 1,
        src:"RawStone.png",
        name: "Raw Stone"
    },
    "Iron": {
        price: 5,
        src:"RawIron.png",
        name: "Raw Iron"
    },
    "Gold": {
        price: 25,
        src:"RawGold.png",
        name: "Raw Gold"
    },
    "Ruby": {
        price: 125,
        src:"RawRuby.png",
        name: "Raw Ruby"
    },
    "Diamond": {
        price: 625,
        src:"RawDiamond.png",
        name: "Raw Diamond"
    },
    "Uranium": {
        price: 3125,
        src:"RawUranium.png",
        name: "Raw Uranium"
    },
    "Iridium": {
        price: 15625,
        src:"RawIridium.png",
        name: "Raw Iridium"
    },
    "Adamantine": {
        price: 78125,
        src:"RawAdamantine.png",
        name: "Raw Adamantine"
    },
    "Rock":{
        price: 6.5,
        src: null,
        name: "Rock"
    },
    "IronBar":{
        price: 35,
        src: null,
        name: "Iron Bar"
    },
    "GoldBar":{
        price: 150,
        src: null,
        name: "Gold Bar"
    },
    "GoldenWatch":{
        price: 2500,
        src: null,
        name: "Golden Watch"
    }
}
function getabbv(n) {
    return (Math.floor(n * 100) / 100).toLocaleString("en-US")
}
const buildings = [
    {
        name: "Home Base",
        id: "HomeBase",
        baseprice: 0,
        basedmg: 0,
        basehealth: 5000,
        desc: "This is your home base. Upgrade this to get new buildings. If this gets destroyed, its all over.",
        type: "base"
    },
    {
        name: "Stone Mine",
        id: "StoneMine",
        baseprice: 35,
        basedmg: 0,
        basehealth: 750,
        desc: `A basic Stone Mine. Stone collected from here is worth $${getabbv(itemdata["Stone"].price)}.`,
        time: 1,
        type: "mine"
    },
    {
        name: "Iron Mine",
        id: "IronMine",
        baseprice: 192.5,
        basedmg: 0,
        basehealth: 900,
        desc: `A small Iron Mine. Iron collected from here is worth $${getabbv(itemdata["Iron"].price)}.`,
        time: 1,
        type: "mine"
    },
    {
        name: "Gold Mine",
        id: "GoldMine",
        baseprice: 1058.75,
        basedmg: 0,
        basehealth: 1200,
        desc: `A nice Gold Mine. Gold collected from here is worth $${getabbv(itemdata["Gold"].price)}.`,
        time: 1.5,
        type: "mine"
    },
    {
        name: "Ruby Mine",
        id: "RubyMine",
        baseprice: 5823.13,
        basedmg: 0,
        basehealth: 1350,
        desc: `A cool Ruby Mine. Rubies collected from here are worth $${getabbv(itemdata["Ruby"].price)}.`,
        time: 1.5,
        type: "mine"
    },
    {
        name: "Diamond Mine",
        id: "DiamondMine",
        baseprice: 32027.19,
        basedmg: 0,
        basehealth: 1500,
        desc: `A complex Diamond Mine. Diamonds collected from here are worth $${getabbv(itemdata["Diamond"].price)}.`,
        time: 2,
        type: "mine"
    },
    {
        name: "Uranium Mine",
        id: "UraniumMine",
        baseprice: 176149.53,
        basedmg: 0,
        basehealth: 1650,
        desc: `An expensive Uranium Mine. Uranium collected from here is worth $${getabbv(itemdata["Uranium"].price)}.`,
        time: 2,
        type: "mine"
    },
    {
        name: "Iridium Mine",
        id: "IridiumMine",
        baseprice: 968822.42,
        basedmg: 0,
        basehealth: 1800,
        desc: `A top-of-the-line Iridium Mine. Iridium collected from here is worth $${getabbv(itemdata["Iridium"].price)}.`,
        time: 2.5,
        type: "mine"
    },
    {
        name: "Adamantine Mine",
        id: "AdamantineMine",
        baseprice: 5328523.32,
        basedmg: 0,
        basehealth: 1950,
        desc: `A hi-tech Adamantine Mine. Adamantine collected from here is worth $${getabbv(itemdata["Adamantine"].price)}`,
        time: 2.5,
        type: "mine"
    },
    {
        name: "Basic Crafter",
        id: "BasicCrafter",
        baseprice: 75,
        basedmg: 0,
        basehealth: 750,
        desc: "A basic and simple Crafter. Can't make much, but it works.",
        type: "crafter",
        recipes: {
            "Rock":{
                "Stone":5
            },
            "IronBar":{
                "Iron":5
            },
            "GoldBar":{
                "Gold":5
            },
            "GoldenWatch":{
                "GoldBar":10,
                "IronBar":25
            }
        }
    },
    {
        name: "Advanced Crafter",
        id: "AdvancedCrafter",
        baseprice: 9375,
        basedmg: 0,
        basehealth: 1250,
        desc: "An Advanced Crafter. Makes a lot of things.",
        type: "crafter",
        recipes: {}
    },
    {
        name: "Super Crafter",
        id: "SuperCrafter",
        baseprice: 234375,
        basedmg: 0,
        basehealth: 2000,
        desc: "A Crafter that is Super Advanced in making things. Crafts many different things.",
        type: "crafter",
        recipes: {}
    },
    {
        name: "Extreme Crafter",
        id: "ExtremeCrafter",
        baseprice: 29296875,
        basedmg: 0,
        basehealth: 3500,
        desc: "A Crafter that is better than all of the previous ones combined, the Extreme Crafter.",
        type: "crafter",
        recipes: {}
    }
]
let truckdata = []
let tilechance = []
tiles.forEach((v, z) => {
    let i = new Image()
    i.src = `img/${v}.png`
    imgs.push(i)
    if (z == 0) {
        z = -3
    }
    for (i = 0; i < Math.pow(2, tiles.length - z - 1); i++) {
        tilechance.push(v)
    }
})
buildings.forEach((v, x) => {
    let i = new Image()
    i.src = `img/${v.id}.png`
    imgs.push(i)
})
let im = new Image()
im.src = "img/TruckRight.png"
imgs.push(im)
im = new Image()
im.src = "img/TruckLeft.png"
imgs.push(im)
let ng = {
    wave: 1,
    data: [],
    exp: 0,
    bdata: [],
    base: false,
    lvl: 50,
    bct: [],
    money: 0
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
    bgm.play()
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
let tox = x
let toy = y
let tozoom = zoom
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
    tox = e.clientX - dx + bx
    toy = e.clientY - dy + by
}
//pc
document.onmousemove = handlemove
//mobile
document.ontouchmove = (e) => {
    handlemove(e.touches[0])
}
function zoomin() {
    if (tozoom <= 0.5) {
        return
    }
    tozoom = (tozoom <= 0.5 ? 0.5 : tozoom - 0.5)
    //x = -250*Math.pow(zoom,-1)+250+x/zoom
    //y = -250*Math.pow(zoom,-1)+250+y/zoom
}
function zoomout() {
    if (tozoom >= 10) {
        return
    }
    tozoom = (tozoom >= 10 ? 10 : tozoom + 0.5)
    //x = -250*Math.pow(zoom,-1)+250+x*zoom
    //y = -250*Math.pow(zoom,-1)+250+y*zoom
}
document.onwheel = function (e) {
    if (!(screen == "game") || inspectingbuilding) { return }
    if (e.clientY >= document.body.clientHeight - Math.min(document.body.clientWidth, document.body.clientHeight) * 0.11) {
        document.querySelector(`#${building ? "buildbar" : "gamebar"}`).scrollLeft += e.deltaY
        return
    }
    if (e.deltaY == -100) {
        zoomin()
    } else if (e.deltaY == 100) {
        zoomout()
    }
}
let frame = 0
let fps = 60
let lloop = new Date()
document.onkeydown = (e) => {
    if (!(screen == "game")) { return }
    if (e.key == "i") {
        zoomin()
    } else if (e.key == "o") {
        zoomout()
    } else if (e.key == "e") {
        expand()
    } else if (e.key == "r") {
        tozoom = 1
        tox = 0
        toy = 0
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
    tozoom = 1
    tox = 0
    toy = 0
})
document.querySelector("#reset2").addEventListener("click", () => {
    tozoom = 1
    tox = 0
    toy = 0
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
    document.querySelector("#bamount").innerHTML = `${ng.bct[selectedbuilding]} / ${buildings[selectedbuilding].type == "base" ? 1 : (ng.lvl - (selectedbuilding - (buildings[selectedbuilding].type == "crafter" ? 10 : 2)) * 3)}`
    document.querySelector("#bprice").innerHTML = `$${getabbv(buildings[selectedbuilding].baseprice)}`
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
            l: 1,
            i: {
                "Stone": 500,
                "Iron": 250,
                "Gold": 125
            },
            p: (selectedbuilding == 0 ? null : 1),
            s: 5
        })
        ng.bct[selectedbuilding] = ng.bct[selectedbuilding] == undefined ? 1 : ng.bct[selectedbuilding] + 1
        document.querySelector("#bprice").innerHTML = `$${getabbv(buildings[selectedbuilding].baseprice)}`
        document.querySelector("#bamount").innerHTML = `${ng.bct[selectedbuilding]} / ${buildings[selectedbuilding].type == "base" ? 1 : (ng.lvl - (selectedbuilding - (buildings[selectedbuilding].type == "crafter" ? 10 : 2)) * 3)}`
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
let inspectidx = null
document.addEventListener("click", (e) => {
    if (!(screen == "game") || building || e.clientY >= document.body.clientHeight - Math.min(document.body.clientWidth, document.body.clientHeight) * 0.11 || inspectingbuilding) {
        return
    }
    const bx = Math.floor((e.clientX + 250 - x - document.body.clientWidth / 2) / (50 / zoom))
    const by = Math.floor((e.clientY + 250 - y - document.body.clientHeight / 2) / (50 / zoom))
    const idx = ng.bdata.findIndex(item => (bx == item.x && by == item.y))
    if (idx == -1) {
        return
    }
    inspectingbuilding = true
    selectedtab = 0
    inspectidx = idx
    document.querySelector("#inv").innerHTML = ""
    for (let key in ng.bdata[inspectidx].i) {
        let c = document.createElement("span")
        c.classList.add("invitem")
        c.innerHTML = `<img src="img/${itemdata[key].src}" class="invimg"><p class="invp">${itemdata[key].name} - ${ng.bdata[inspectidx].i[key]}</p>`
        document.querySelector("#inv").appendChild(c)
    }
    document.querySelector("#uslider").value = ng.bdata[inspectidx].s
    const z = (buildings[buildings.findIndex(item => (ng.bdata[inspectidx].id == item.id))].type == "base" ? "none" : "block")
    document.querySelector("#uslider").style.display = z
    const v = document.querySelector("#uslider").value
    document.querySelector("#upercent").innerHTML = `Sell: ${100 - v * 10}% - Craft: ${v * 10}%`
    document.querySelector("#upercent").style.display = z
    const bidx = buildings.findIndex(item => item.id == ng.bdata[idx].id)
    document.querySelector("#upgname").innerHTML = `<b>${buildings[bidx].name}</b>`
    document.querySelector("#upgdesc").innerHTML = buildings[bidx].desc
    document.querySelector("#uworth").innerHTML = "<b>Worth:</b> N/A"
    document.querySelector("#ulvl").innerHTML = `<b>Level:</b> ${ng.bdata[idx].l}`
    document.querySelector("#uhealth").innerHTML = `<b>Health:</b> ${getabbv(buildings[bidx].basehealth)}`
    document.querySelector("#udmg").innerHTML = `<b>DMG:</b> ${buildings[bidx].basedmg}`
    document.querySelector("#utime").innerHTML = `<b>Process Time:</b> ${buildings[bidx].time}s`
    document.querySelector("#utime").style.display = (buildings[bidx].time ? "block" : "none")
})
function isenabled(idx) {
    if (idx < 0) { return false }
    // logic
    if (idx == 0) {
        // homebase
        if (ng.base) {
            return false
        }
    } else if (buildings[idx].type == "mine") {
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
    } else if (buildings[idx].type == "crafter") {
        if (!(ng.base)) {
            return false
        }
        if (ng.lvl < (idx - 9) * 3) {
            return false
        }
        if (ng.bct[idx] >= (ng.lvl - (idx - 10) * 3) && !(ng.bct[idx] == undefined)) {
            return false
        }
    }
    return true
}
document.querySelector("#upgexit").addEventListener("click", () => {
    ng.bdata[inspectidx].s = document.querySelector("#uslider").value
    inspectidx = null
    inspectingbuilding = false
})
function newtruck(to, from, carrying, camount) {
    truckdata.push({
        tx: to.x,
        ty: to.y,
        x: from.x,
        y: from.y,
        item: {
            a: camount,
            n: carrying
        }
    })
}
document.querySelector("#uslider").addEventListener("input", (e) => {
    const v = document.querySelector("#uslider").value
    document.querySelector("#upercent").innerHTML = `Sell: ${100 - v * 10}% - Craft: ${v * 10}%`
})
document.querySelectorAll(".invbutton").forEach((v, i) => {
    v.addEventListener("click", () => {
        selectedtab = i
    })
})
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
        ng.data.forEach((v) => {
            ctx.drawImage(imgs[v.d], (v.x * 50 / zoom) + xoffset, (v.y * 50 / zoom) + yoffset, Math.ceil(50 / zoom), Math.ceil(50 / zoom))
        })
        ng.bdata.forEach((v) => {
            if (!(v.p == null)) {
                v.p -= 1 / fps
                if (v.p <= 0) {
                    v.p = buildings[buildings.findIndex(item => (item.id == v.id))].time
                    let d = false
                    let idx = buildings.findIndex(item => (item.id == v.id))
                    if (idx >= 1 && idx <= 8) {
                        if (ng.data[ng.data.findIndex(item => (item.x == v.x - 1 && item.y == v.y && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        } else if (ng.data[ng.data.findIndex(item => (item.x == v.x - 1 && item.y == v.y + 1 && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        } else if (ng.data[ng.data.findIndex(item => (item.x == v.x && item.y == v.y + 1 && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        } else if (ng.data[ng.data.findIndex(item => (item.x == v.x + 1 && item.y == v.y + 1 && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        } else if (ng.data[ng.data.findIndex(item => (item.x == v.x + 1 && item.y == v.y && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        } else if (ng.data[ng.data.findIndex(item => (item.x == v.x + 1 && item.y == v.y - 1 && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        } else if (ng.data[ng.data.findIndex(item => (item.x == v.x && item.y == v.y - 1 && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        } else if (ng.data[ng.data.findIndex(item => (item.x == v.x - 1 && item.y == v.y - 1 && v.id.split("Mine")[0] == tiles[item.d]))]) {
                            d = true
                        }
                    } else {
                        d = true
                    }
                    if (d) {
                        newtruck(ng.bdata[0], v, v.id.split("Mine")[0], 1)
                    }
                }
            }
            ctx.drawImage(imgs[buildings.findIndex(item => item.id == v.id) + 9], (v.x * 50 / zoom) + xoffset, (v.y * 50 / zoom) + yoffset, 50 / zoom, 50 / zoom)
        })
        truckdata.forEach((v) => {
            let d = ""
            const dir = (v.tx > v.x ? 90 : -90) - Math.atan((v.ty - v.y) / (v.tx - v.x))
            if (v.tx > v.x) {
                d = "r"
                v.x += Math.min(1 / fps, v.tx - v.x)
            } else if (v.tx < v.x) {
                d = "l"
                v.x -= Math.min(1 / fps, v.x - v.tx)
            } else {
                d = "r"
            }
            if (v.ty > v.y) {
                v.y += Math.min(1 / fps, v.ty - v.y)
            } else if (v.ty < v.y) {
                v.y -= Math.min(1 / fps, v.y - v.ty)
            }
            ctx.drawImage(d == "l" ? imgs[imgs.length - 1] : imgs[imgs.length - 2], (v.x * 50 / zoom) + xoffset, (v.y * 50 / zoom) + yoffset, 50 / zoom, 50 / zoom)
        })
        truckdata.forEach((v, i) => {
            if (v.tx == v.x && v.ty == v.y) {
                const to = ng.bdata[ng.bdata.findIndex(item => (item.x == v.tx && item.y == v.ty))]
                to.i[v.item.n] = (!(to.i[v.item.n]) ? v.item.a : to.i[v.item.n] + v.item.a)
                if (to.id == "HomeBase") {
                    for (let key in to.i) {
                        ng.money += itemdata[key].price * to.i[key]
                        delete to.i[key]
                    }
                }
                truckdata.splice(i, 1)
                if (inspectingbuilding && selectedtab == 0) {
                    document.querySelector("#inv").innerHTML = ""
                    for (let key in ng.bdata[inspectidx].i) {
                        let c = document.createElement("span")
                        c.classList.add("invitem")
                        c.innerHTML = `<img src="img/${itemdata[key].src}" class="invimg"><p class="invp">${itemdata[key].name} - ${ng.bdata[inspectidx].i[key]}</p>`
                        document.querySelector("#inv").appendChild(c)
                    }
                }
            }
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
        v.style.top = `calc(${-8 + i * 3}vmin + ${document.querySelector("#upgname").clientHeight + document.querySelector("#upgdesc").clientHeight}px)`
    })
    document.querySelectorAll(".invitem").forEach((v, i) => {
        v.style.top = `${14 * i + 2}vmin`
    })
    if (inspectingbuilding) {
        document.querySelectorAll(".invbutton").forEach((v, i) => {
            if (i == selectedtab) {
                v.classList.add("selected")
            } else {
                v.classList.remove("selected")
            }
            if (i == 1) {
                if (buildings.find(item => (item.id == ng.bdata[inspectidx].id)).type == "crafter") {
                    v.classList.remove("locked")
                } else {
                    v.classList.add("locked")
                }
            }
        })
        if (selectedtab == 0) {
            document.querySelector("#inv").style.display = "block"
            document.querySelector("#recipes").style.display = "none"
        } else if (selectedtab == 2) {
            document.querySelector("#inv").style.display = "none"
            document.querySelector("#recipes").style.display = "block"
        }
    }
    document.querySelector("#upercent").style.top = `calc(${-4 + document.querySelectorAll(".ustat").length * 2.5}vmin + ${document.querySelector("#upgname").clientHeight + document.querySelector("#upgdesc").clientHeight}px)`
    document.querySelector("#uslider").style.top = `calc(${document.querySelectorAll(".ustat").length * 2.5}vmin + ${document.querySelector("#upgname").clientHeight + document.querySelector("#upgdesc").clientHeight}px)`
    document.querySelector("#gamebar").style.width = `${document.querySelectorAll(".gbitem").length * 10 + 1}vmin`
    document.querySelector("#buildbar").style.width = `${document.querySelectorAll(".bitem").length * 10 + 1}vmin`
    document.querySelector("#upgui").style.display = inspectingbuilding ? "block" : "none"
    document.querySelector("#smoney").innerHTML = `Money: $${getabbv(ng.money)}`
    x += (tox - x) / (fps / 5)
    y += (toy - y) / (fps / 5)
    zoom += (tozoom - zoom) / (fps / 5)
    frame++
    requestAnimationFrame(render)
}
render()