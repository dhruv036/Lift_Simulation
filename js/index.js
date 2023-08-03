var splashDiv = document.getElementById("containerMain")  // for input div
var floorInput = document.getElementById("nFloor")
var liftInput = document.getElementById("nLift")
var nFloor = 0;
var nLift = 0;

var floorContainer = document.getElementsByClassName("floorContainer")
const totalLifts = document.getElementById("nLift");
const totalFloors = document.getElementById("nFloor");
var backBt = document.getElementById("back-bt")
const liftSimulator = document.getElementById("liftSimulator");
const DOMlifts = document.getElementById("lifts");
const DOMfloors = document.getElementById("floors");
const submit = document.getElementById('subBut');
let liftData = [], queueStack = [], enableButtons = [];
let newQueue = [...liftData];

submit.addEventListener("click", generateDOM)
backBt.addEventListener("click", onBackBtClicked)

function generateDOM() {
    liftData = [];
    queueStack = [];
    newQueue = [...liftData];
    enableButtons = [];
    nLift = Number(totalLifts.value)
    nFloor = Number(totalFloors.value)
    if (nLift > 10 || nFloor > 10 || nLift <= 0 || nFloor <= 0) return alert("Entered value must be between 0 and 10");
    if (nLift > nFloor) return alert("Number of lifts should be less than number of floors");
    hideSplashScreen()
    generateFloors(nFloor)
    generateLifts(nLift)
}

function generateFloors(getFloors) {
    const floors = Array.from(Array(getFloors).keys());

    DOMfloors.innerHTML = "";
    for (idx = floors.length - 1; idx >= 0; idx--) {
        const singleFloor = document.createElement('div');
        singleFloor.classList.add("single-floor");

        const up = document.createElement("button");
        up.setAttribute("data-id", `${idx}-up`);
        up.setAttribute("data-floor", idx);
        up.classList.add("fa-solid", "fa-angle-up")
        // up.textContent = "arrow_upward";

        const down = document.createElement("button");
        down.setAttribute("data-id", `${idx}-down`);
        down.setAttribute("data-floor", idx);
        down.setAttribute("class", "down")
        down.classList.add("fa-solid", "fa-angle-down")

        // down.textContent = "arrow_downward";

        if (idx === 0) {
            singleFloor.appendChild(up);
        }
        else if (idx === floors.length - 1) {
            singleFloor.appendChild(down);
        }
        else {
            singleFloor.appendChild(up);
            singleFloor.appendChild(down);
        }

        up.addEventListener("click", (e) => getThoseLifts(e))
        down.addEventListener("click", e => getThoseLifts(e))
        DOMfloors.appendChild(singleFloor)

    }
}

function generateLifts(getLifts) {
    const lifts = Array.from(Array(getLifts).keys());

    DOMlifts.innerHTML = "";
    lifts.map((_, idx) => {
        const singleLift = document.createElement('div');
        singleLift.classList.add("single-lift");
        singleLift.setAttribute("id", idx)
        DOMlifts.appendChild(singleLift)
        liftData.push({
            id: idx,
            isMoving: false,
            currentFloor: 0,
            position: 0
        })
    })
}

function getThoseLifts(e) {
    const liftCalledAt = parseInt(e.target.getAttribute("data-floor"))
    const getButtons = document.querySelectorAll(`[data-floor="${liftCalledAt}"]`)
    Object.values(getButtons).map(item => item.setAttribute("disabled", "true"));
    moveLift(liftCalledAt, getButtons);
}

function moveLift(floorNumber, getButtons) {
    let availableLift = liftData.filter(item => !item.isMoving);
    const getNearestLift = availableLift.reduce((acc, curr) => {
        const diff = Math.abs(floorNumber - curr.currentFloor);
        const accDiff = Math.abs(floorNumber - acc.currentFloor);
        let myLift;
        (diff < accDiff) ? myLift = curr : myLift = acc;
        return myLift;
    }, availableLift[0]);

    if (liftData.find(item => item.currentFloor === floorNumber)) {
        const liftElement = liftData.find(item => item.currentFloor === floorNumber);
        const newPromise = new Promise((res, _) => {
            res(liftElement.classList.add("openDoors"));
        })
        newPromise.then(() => liftElement.classList.remove("openDoors"))
            .then(() => {
                Object.values(getButtons).map(item => item.removeAttribute("disabled"))
                return;
            })
    };

    if (availableLift.length === 0) {
        if (newQueue.length === 0) newQueue = [...liftData];
        const noLiftFree = newQueue.reduce((acc, curr) => {
            const diff = Math.abs(floorNumber - curr.currentFloor);
            const accDiff = Math.abs(floorNumber - acc.currentFloor);
            let myLift;
            (diff < accDiff) ? myLift = curr : myLift = acc;
            return myLift;
        })

        newQueue = newQueue.filter(item => item.id !== noLiftFree.id);

        queueStack.push({ floor: floorNumber, lift: noLiftFree.id, diff: Math.abs(floorNumber - noLiftFree.currentFloor) });
        queueStack.sort((a, b) => a.diff - b.diff);
        enableButtons.push(getButtons);
    } else {
        queueStack.push({ floor: floorNumber, lift: getNearestLift.id, diff: Math.abs(floorNumber - getNearestLift.currentFloor) });
        queueStack.sort((a, b) => a.diff - b.diff);
        callLift(getNearestLift, getButtons);
    }

}

function callLift(nearestLift, getButtons) {
    const lift = liftData.find(item => item.id === nearestLift.id);
    const liftElement = document.getElementById(lift.id);
    const floorNumber = queueStack.filter(item => item.lift === lift.id).shift().floor;
    const newPosition = floorNumber * 160 + floorNumber;
    const timer = Math.abs(floorNumber - lift.currentFloor) * 2000;
    lift.isMoving = true;
    lift.position = newPosition;
    lift.currentFloor = floorNumber;

    console.log(queueStack);

    liftElement.style.transform = `translateY(-${newPosition}px)`;
    liftElement.style.transition = `transform ${timer}ms linear`;
    const newPromise = new Promise((res, _) => {
        setTimeout(() => {
            res(liftElement.classList.add("openDoors"));
        }, timer)
    })

    if (queueStack[0].lift === lift.id) queueStack.shift()
    else return;

    newPromise.then(() => {
        setTimeout(() => {
            lift.isMoving = false;
            liftElement.classList.remove("openDoors");
            if (getButtons) Object.values(getButtons).map(item => item.removeAttribute("disabled"));
            if (queueStack.length !== 0) {
                callLift(nearestLift);
                if (enableButtons.length !== 0) {
                    let buttons = enableButtons.shift();
                    Object.values(buttons).map(item => item.removeAttribute("disabled"));
                }
            }
        }, 4000)
    })
}

function hideSplashScreen() {
    splashDiv.style.display = "none"
    floorContainer[0].style.display = "block"
}

function showSplashScreen() {
    for (let i = nFloor; i > 0; i--) {
        let floordiv = document.querySelector('.single-floor');
        floordiv.remove();
    }
    for (let i = nLift; i > 0; i--) {
        let lift = document.querySelector('.single-lift');
        lift.remove();
    }
    splashDiv.style.display = "block"
    floorInput.value = null
    liftInput.value = null
    backBt.style.display = "none"
}

function onBackBtClicked() {
    showSplashScreen()
    nFloor = 0;
    nLift = 0;
    queue = [];
}
