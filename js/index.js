

var subBt = document.getElementById("subBut")
var splashDiv = document.getElementById("container")
var floorContainer = document.getElementsByClassName("floorContainer")
var floorInput = document.getElementById("nFloor")
var liftInput = document.getElementById("nLift")
var nFloor = 0;
var nLift = 0;


function hideSplashScreen() {
    splashDiv.style.display = "none"
    floorContainer[0].style.display = "block"
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
    hideSplashScreen()
    fillFloorsWithLift()

}

function fillFloorsWithLift() {

    for (let i = 1; i <= nFloor; i++) {
        // create floor div
        let flrDiv = document.createElement('div')
        flrDiv.className = "floor"

        // create lift button div
        let liftBtDiv = document.createElement('div')
        liftBtDiv.className = "liftButton"

        // create lift button 1 UP
        let bt1 = document.createElement('button')
        let icon1 = document.createElement('i')
        icon1.classList.add("fa-solid", "fa-angle-up")
        bt1.appendChild(icon1)
        bt1.classList.add("lift-buttons", "open-lift-btn")

        // create lift button 2 DOWN
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

    // get all floor
    const mainbuttonlift = document.querySelectorAll('.floor');
    console.log(mainbuttonlift);

    // select last floor
    const lastbox = mainbuttonlift[mainbuttonlift.length - 1];
    console.log(lastbox)

    for (let index = 1; index <= nLift; index++) {

        // create lift container div
        liftContainerDiv = document.createElement('div')
        liftContainerDiv.className = "lift-container"
        liftContainerDiv.setAttribute('flag', `free`);

        // create left door div
        let leftDoorDiv = document.createElement('div')
        leftDoorDiv.className = "left-door"

        // create right door div
        let rightDoorDiv = document.createElement('div')
        rightDoorDiv.className = "right-door"

        liftContainerDiv.appendChild(leftDoorDiv)
        liftContainerDiv.appendChild(rightDoorDiv)

        // add lift in last floor
        lastbox.appendChild(liftContainerDiv);
    }


    //  select all lift we created above using querySelectorAll
    let selectAllLift = document.querySelectorAll('.lift-container');
    // console.log('s',selectAllLift)

    // select all up button <button class="up" id="up1">Up</button> using querySelectorAll
    let up = document.querySelectorAll('.open-lift-btn');
    console.log(up)

    // select all down button <button class="down" id="down1">Down</button> using querySelectorAll
    let down = document.querySelectorAll('.close-lift-btn');
    console.log(down)

    //create oldFloorValueArray for calculation purpose
    let oldFloorValueArray = [];

    for (let i = 0; i < selectAllLift.length; i++) {
        oldFloorValueArray.push(1)
    }


    //Now we loop through all up button and add eventListener in all up button
    up.forEach((e, i) => {
        e.addEventListener('click', () => {

            //create floorValue for calculation purpose
            let floorValue = nFloor - i;
            for (let i = 0; i < selectAllLift.length; i++) {
                console.log(selectAllLift)

                //check <div class="lift" id="lift1" flag="free"> lift attribute flag has value free
                if (selectAllLift[i].getAttribute('flag') === 'free') {
                    // set attribute flag value busy i.e. <div class="lift" id="lift1" flag="busy">
                    selectAllLift[i].setAttribute('flag', 'busy');

                    console.log(" call a function moveLift")
                    moveLift(selectAllLift[i], floorValue, oldFloorValueArray[i]);
                    oldFloorValueArray[i] = floorValue;
                    // console.log(oldFloorValueArray);
                    // console.log(selectAllLift[i]);
                    break;
                }
            }
        })
    })


    //same steps like above we do in up button now we are going to do in down buttons 
    down.forEach((e, i) => {
        ''
        e.addEventListener('click', () => {
            let floorValue = nFloor - i;
            for (let i = 0; i < selectAllLift.length; i++) {
                // console.log(selectAllLift)
                if (selectAllLift[i].getAttribute('flag') === 'free') {
                    selectAllLift[i].setAttribute('flag', 'busy');
                    moveLift(selectAllLift[i], floorValue, oldFloorValueArray[i]);
                    oldFloorValueArray[i] = floorValue;
                    // console.log(oldFloorValueArray);
                    // console.log(selectAllLift[i]);
                    break;
                }
            }
        })
    })
}

function moveLift(liftno, floorNo, oldFloorValue) {

    //add styling transform to move lift smooth in Y direction using transform property
    liftno.style.transform = `translateY(${-100 * (floorNo - 1)}px)`;

    // add styling transition-duration to particular lift i.e. we do this because Lift moving at 2s per floor 
    let prev = `${2 * Math.abs(floorNo - oldFloorValue)}s`
    liftno.style.transitionDuration = prev;
    // console.log('snjh',2*(floorNo -oldFloorValue));



    //What we are doing in below steps
    // we want that Lift stopping at every floor where it was called after 2sec we set attribute flag value free
    // and then we want ki Lift having doors open in 2.5s, then closing in another 2.5s for that we call function gateopenclose(liftno);
    setTimeout(() => {
        gateopenclose(liftno);
        setTimeout(() => {
            liftno.setAttribute('flag', 'free')
        }, 5500);
        console.log(liftno.getAttribute('flag'))
    }, 2 * Math.abs(floorNo - oldFloorValue) * 1000)

}

function gateopenclose(liftno) {
    console.log(liftno)
    let gates = liftno;


    //gate open in 1sec and you see gate open smoothly because i decrease the width and 
    // add transition property in css in class .gate1 , .gate2
    setTimeout(() => {
        //     <div class="gates" id="gates">
        //         <div class="gate1"></div> gates.children[0]
        //         <div class="gate2"></div>gates.children[1]
        //     </div>
        gates.children[0].style.width = '0px';
        gates.children[1].style.width = '0px';
    }, 1000);

    // gate close in 3.5s
    setTimeout(() => {
        gates.children[0].style.width = '30px';
        gates.children[1].style.width = '30px';
    }, 3500)
}

function main() {
    subBt.addEventListener("click", fetchFloorLiftCount)
}

main()