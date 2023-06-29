var subBt = document.getElementById("subBut")
var splashDiv = document.getElementById("container")
var floorContainer = document.getElementsByClassName("floorContainer")
var floorInput = document.getElementById("nFloor")
var liftInput = document.getElementById("nLift")
var backBt = document.getElementsByClassName("back-bt")
var nFloor = 0;
var nLift = 0;

let queue = [];

function hideSplashScreen() {
    splashDiv.style.display = "none"
    floorContainer[0].style.display = "block"
}

function showSplashScreen() {

    console.log(nFloor)

    for (let i = nFloor; i > 0; i--) {
        let floordiv = document.querySelector('.floor');
        floordiv.remove();
    }
    floorInput.value = 0
    liftInput.value = 0
    splashDiv.style.display = "block"
    floorContainer[0].style.display = "none"
}

function nearestFreeLift(calledFloor, liftPos, isLiftBusy) {
    console.log("nearest "+calledFloor+" "+liftPos+" "+isLiftBusy)
    let diff = [];
    for (let pos of liftPos)
        diff.push(Math.abs(pos - (+(calledFloor))))   // array containing distance from calledFloor
    // console.log(`diff ${diff}`);

    let mini = 100, ind = -1;
    for (let d = 0; d < diff.length; d++) {
        if (diff[d] < mini && isLiftBusy[d] === false) {
            mini = diff[d];
            ind = d;
        }
        else continue;
    }
    return ind;
}

function fetchFloorLiftCount() {
    nFloor = Number(floorInput.value)
    nLift = Number(liftInput.value)
    // console.log(""+nFloor+" "+nLift)
    if(nFloor == "" || nLift == ""){
        alert("Invalid")
        return
    }
    if (nFloor === 0 && nLift === 0) {
        alert("Atleast 1 floor and 1 lift required")
        return
    }
    if(nLift > 7){
        alert("Not more than 6 lift")
        return
    }
    if(nLift >nFloor){
        alert("No. of lift can't be more than floor")
        return
    }
    hideSplashScreen()
    fillFloorsWithLift()

}

function fillFloorsWithLift() {

    queue = [];

    for (let i = 0; i < nFloor; i++) {
   
        let flrDiv = document.createElement('div')
        flrDiv.className = "floor"

        let liftBtDiv = document.createElement('div')
        liftBtDiv.className = "liftButton"
        
        let bt1 = document.createElement('button')
        let icon1 = document.createElement('i')
        icon1.classList.add("fa-solid", "fa-angle-up")
        bt1.appendChild(icon1)
        bt1.classList.add("lift-buttons", "open-lift-btn")

      
        let bt2 = document.createElement('button')
        let icon2 = document.createElement('i')
        icon2.classList.add("fa-solid", "fa-angle-down")
        bt2.appendChild(icon2)
        bt2.classList.add("lift-buttons", "close-lift-btn")

        liftBtDiv.appendChild(bt1)
        liftBtDiv.appendChild(bt2)


        flrDiv.appendChild(liftBtDiv)


        document.getElementById("floorContainer").appendChild(flrDiv);
    }

   
    const mainbuttonlift = document.querySelectorAll('.floor');
    console.log(mainbuttonlift);

    const lastbox = mainbuttonlift[mainbuttonlift.length - 1];
    console.log(lastbox)

    for (let index = 0; index < nLift; index++) {

       
        liftContainerDiv = document.createElement('div')
        liftContainerDiv.className = "lift-container"
        liftContainerDiv.setAttribute('flag', `free`);

      
        let leftDoorDiv = document.createElement('div')
        leftDoorDiv.className = "left-door"

        
        let rightDoorDiv = document.createElement('div')
        rightDoorDiv.className = "right-door"

        liftContainerDiv.appendChild(leftDoorDiv)
        liftContainerDiv.appendChild(rightDoorDiv)

      
        lastbox.appendChild(liftContainerDiv);
    }

    let liftPos = Array(+nFloor).fill(0);
    let isLiftBusy = Array(+nFloor).fill(false);

    for (let i = 0; i < nFloor; i++) {
        callLift(i, nFloor, liftPos, isLiftBusy);

    }
}

function callLift(i, totalFloors, liftPos, isLiftBusy) {
    const up_btn = document.querySelectorAll('.open-lift-btn');
    const down_btn = document.querySelectorAll('.close-lift-btn');

    up_btn.forEach((btn, id) => {
        if (i == id) {
            btn.addEventListener('click', () => {
                const calledFloor = `${totalFloors - id}`;

                if (liftPos[0] === 0) {
                    if (isLiftBusy[0] === false)
                        moveLift(calledFloor, 0, liftPos, isLiftBusy);
                }
                else {
                    let ind = nearestFreeLift(calledFloor, liftPos, isLiftBusy);

                    if (isLiftBusy[ind] === false)
                        moveLift(calledFloor, ind, liftPos, isLiftBusy);
                    else {
                        // alert(`Lifts are busy. Please wait! it will come to you`);
                        if (!queue.includes(calledFloor))
                            queue.push(calledFloor)

                        let timeout = setInterval(() => {
                            let curlift = isLiftBusy.some((lift) => {
                                return lift === false
                            })
                            if (curlift && queue.length > 0) {
                                let ind = nearestFreeLift(queue[0], liftPos, isLiftBusy);

                                moveLift(queue[0], ind, liftPos, isLiftBusy);
                                queue.shift();
                                // console.log(queue);
                            }
                        }, 500)
                        if (queue.length === 0)
                            clearInterval(timeout)
                    }
                    console.log(`queue = ${queue}`);
                }
            })
        }
    })

    down_btn.forEach((btn, id) => {
        if (i == id) {
            btn.addEventListener('click', () => {
                const calledFloor = `${totalFloors - id}`;

                if (liftPos[0] === 0) {
                    if (isLiftBusy[0] === false)
                        moveLift(calledFloor, 0, liftPos, isLiftBusy);
                }
                else {
                    let ind = nearestFreeLift(calledFloor, liftPos, isLiftBusy);

                    if (isLiftBusy[ind] === false)
                        moveLift(calledFloor, ind, liftPos, isLiftBusy);
                    else {
                        // alert(`Lifts are busy. Please wait! it will come to you`);
                        if (!queue.includes(calledFloor))
                            queue.push(calledFloor)

                        let timeout = setInterval(() => {
                            let curlift = isLiftBusy.some((lift) => {
                                return lift === false
                            })
                            if (curlift && queue.length > 0) {
                                let ind = nearestFreeLift(queue[0], liftPos, isLiftBusy);

                                moveLift(queue[0], ind, liftPos, isLiftBusy);
                                queue.shift();
                            }
                        }, 500)
                        if (queue.length === 0)
                            clearInterval(timeout)
                    }
                }
                console.log(`queue = ${queue}`);
            })
        }
    })
}

const moveLift = (floor, liftNum, liftPos, isLiftBusy) => {

    console.log("movelift "+floor+" "+liftNum+" "+liftPos+" "+isLiftBusy)
    const lifts = Array.from(document.querySelectorAll('.lift-container'));

    isLiftBusy[liftNum] = true;
   
    lifts[liftNum].style.transform = `translateY(${-100 * (floor - 1)}px)`;

    let prev = `${2 * Math.abs(floor - liftPos[liftNum])}s`
    lifts[liftNum].style.transitionDuration = prev;
    
    setTimeout(() => {
           gateopenclose(liftNum);
           setTimeout(() => {
            isLiftBusy[liftNum] = false;
           }, 5500);
    }, 2 * Math.abs(floor - liftPos[liftNum]) * 1000)

    liftPos[liftNum] = +floor;
}

function gateopenclose(liftno) {
    console.log(liftno)
    let gates = document.querySelectorAll('.lift-container')[liftno];
    
    setTimeout(() => {
        gates.children[0].style.width = '0px';
        gates.children[1].style.width = '0px';
    }, 1000);

    // gate close in 3.5s
    setTimeout(() => {
        gates.children[0].style.width = '30px';
        gates.children[1].style.width = '30px';
    }, 3500)
}


function onBackBtClicked(){
    showSplashScreen()
    nFloor = 0;
    nLift = 0;
}

function main() {
    subBt.addEventListener("click", fetchFloorLiftCount)
    backBt[0].addEventListener("click",onBackBtClicked)
}

main()