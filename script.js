let width = 5;
const wait = 10;
const reso = 250;
const oneColor = false;
const highCont = true;
let go = true;
let Stop = false;
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const delay = ms => new Promise(res => setTimeout(res, ms));

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 5000, 5000);

let t = 0;
let scale = 1;
let min = 1000;

let cornerPos = [
    [25, 25],
    [900, 25],
    [900, 900],
    [25, 900],
]

const randInt = (max) => {
    return Math.floor(Math.random() * max)
}

const generateCornerPos = () => {
    cornerPos = [];
    console.log(cornerPos)
    let cNum = randInt(5) + 4;

    for (let i = 1; i <= cNum; i++) {
        if (i < cNum/2) {
            let p = [i*1.5*window.innerWidth/cNum, randInt(300)];
            // console.log("adding " + p + " to cornerPos");
            cornerPos.push(p);
        } else {
            let p = [(cNum - i + 1)*1.5*window.innerWidth/cNum, randInt(300) + 300];
            // console.log("adding " + p + " to cornerPos");
            cornerPos.push(p);
        }
    }

    for (let i = 0; i < cNum; i++) {
        if (Math.sqrt((cornerPos[i])**2 + (cornerPos[i+1])**2) < min) {
            min = Math.sqrt((cornerPos[i])**2 + (cornerPos[i+1])**2);
        }
    }

    width *= scale;

    cornerPos.push(cornerPos[0]);
}

const reset = () => {
    generateCornerPos();

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 5000, 5000);

    makeSpiral();
}

const makeSpiral = async () => {
    // console.log("resetting")
    let cStyle = 'black';

    r1 = randInt(255);
    g1 = randInt(255);
    b1 = randInt(255);
   
    let r2 = randInt(255);
    let g2 = randInt(255);
    let b2 = randInt(255);
    
    while (Math.sqrt((cornerPos[0][0] - cornerPos[1][0])**2 + (cornerPos[0][1] - cornerPos[1][1])**2) > 2 && t < 50) {
        t++
        await delay(25);

        if (highCont) {
            r2 = 255 - r1;
            g2 = 255 - g1;
            b2 = 255 - b1;
        }

        if (oneColor) {
            cStyle = `rgb(
                ${255*(t/30)}, 
                ${(255 - 255*(t/30))}, 
                ${(255*(t/30) + 150)}
            )`
        } else {
            cStyle = `rgb(
                ${r1*(t/20) + r2*(1- t/20)}, 
                ${g1*(t/20) + g2*(1- t/20)}, 
                ${b1*(t/20) + b2*(1- t/20)}
            )`;
        }

        // console.log("test")
        for (let i = 0; i < cornerPos.length - 1; i++) {

            ctx.fillRect(cornerPos[i][0], cornerPos[i][1], width, width);

            let x = cornerPos[i][0]; 
            let dx = cornerPos[i+1][0] - x;

            let y = cornerPos[i][1]
            let dy = cornerPos[i+1][1] - y;

            let loopTime = 0;
            let hitRange = 100*width;

            while ((Math.sqrt((x-cornerPos[i+1][0])**2 + (y-cornerPos[i+1][1])**2) > Math.sqrt((x-cornerPos[i+1][0]+(dx/reso))**2 + (y-cornerPos[i+1][1]+(dy/reso))**2)) && loopTime < 600) {
                
                ctx.fillStyle = cStyle;
                ctx.fillRect(x, y, width, width);
                
                x += dx/reso;
                y += dy/reso;

                loopTime++;

            }
        }
        
        for (let i = 0; i < cornerPos.length - 1; i++) {
            cornerPos[i][0] += (cornerPos[i+1][0] - cornerPos[i][0])/10;
            cornerPos[i][1] += (cornerPos[i+1][1] - cornerPos[i][1])/10;

            // ctx.fillRect(cornerPos[i][0], cornerPos[i][1], width, width);
        }

        cornerPos[cornerPos.length - 1][0] = cornerPos[0][0];
        cornerPos[cornerPos.length - 1][1] = cornerPos[0][1];

        width /= 1.1;
    }

    //cornerPos = [];
    t = 0;
    width = 5;
    // console.log("finished");

    await delay(1500);

    if (!Stop) {
        reset();
    }
}

document.addEventListener('click', function(event) {
     Stop = true;
})

reset();
