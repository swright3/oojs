// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
    constructor(x,y,velX,velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }
}

class EvilCircle extends Shape {
    constructor(x,y) {
        super(x,y,20,20);
        this.color = "white";
        this.size = 10;

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
              case 'a':
                this.x -= this.velX;
                break;
              case 'd':
                this.x += this.velX;
                break;
              case 'w':
                this.y -= this.velY;
                break;
              case 's':
                this.y += this.velY;
                break;
            }
          });
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    checkBounds() {
        if (this.x + this.size > width) {this.x = width-this.size}
        if (this.x - this.size < 0) {this.x = this.size}
        if (this.y + this.size > height) {this.y = height-this.size}
        if (this.y - this.size < 0) {this.y = this.size}
    }

    detectCollision() {
        for (var ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                    updateBallCount();
                }
            }
        }
    }
}

class Ball extends Shape {
    constructor(x,y,velX,velY,color,size){
        super(x,y,velX,velY);
        this.color = color;
        this.size = size;
        this.exists = true;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size >= width) || (this.x - this.size <= 0)) {this.velX = -this.velX}
        if ((this.y + this.size >= height) || (this.y - this.size <= 0)) {this.velY = -this.velY}
        this.x += this.velX;
        this.y += this.velY;
    }

    detectCollision() {
        for (var ball of balls) {
            if (this !== ball && ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }
}

const balls = [];

while (balls.length < 10) {
  const size = random(10,20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

const evil = new EvilCircle(50,50);

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    evil.draw();
    evil.checkBounds();
    evil.detectCollision();
  
    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.detectCollision();
        }
    }
  
    requestAnimationFrame(loop);
}

const updateBallCount = () => {
    let count = 0;
    for (const ball of balls) {
        if (ball.exists) {count += 1}
    }
    const scoreCounter = document.getElementsByTagName('p')[0];
    scoreCounter.innerHTML = `Ball count: ${count}`;
}

const scoreCounter = document.createElement('p');
scoreCounter.innerHTML = "Ball count: 0";
scoreCounter.setAttribute('style','position: absolute; margin: 0; top: 35px; right: 5px;color: #aaa;');
const heading1 = document.getElementsByTagName('h1')[0];
heading1.appendChild(scoreCounter);

updateBallCount();
loop();
