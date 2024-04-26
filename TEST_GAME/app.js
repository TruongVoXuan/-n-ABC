const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = document.documentElement.clientWidth // Sử dụng document.documentElement.clientWidth thay vì innerWidth
canvas.height = document.documentElement.clientHeight // Sử dụng document.documentElement.clientHeight thay vì innerHeight

class Player {
  constructor() {

    this.velocity = {
      x: 0,
      y: 0,
    }

    this.rotation = 0;

    const image = new Image()
    image.src = './spaceship.png'



    image.onload = () => {

      this.image = image

      this.width = image.width * 0.2
      this.height = image.height * 0.2

      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      }
    }


  }




  draw() {

    c.save(); // Lưu trạng thái hiện tại của canvas

    // Di chuyển và xoay canvas để vẽ hình ảnh theo hướng mong muốn
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.rotate(this.rotation);
    c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);

    // Vẽ hình ảnh của người chơi
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    c.restore(); // Khôi phục trạng thái canvas trước đó
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x

    }
  }

}
class Enemy {
  constructor({ position }) {

    this.velocity = {
      x: -2,
      y: 0,
    }

    this.rotation = 0;

    const image = new Image()
    image.src = './alien.png'

    image.onload = () => {
      this.image = image

      this.width = image.width * 0.04
      this.height = image.height * 0.04

      this.position = {
    
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    // Vẽ hình ảnh của người chơi
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  update({ velocity }) {
    if (this.image) {
      // Cập nhật vận tốc của kẻ thù theo vận tốc của lưới
    

      // Di chuyển kẻ thù theo vận tốc mới
      this.position.x += velocity.x;
      this.position.y += velocity.y;

      this.draw();
    }
  }
}


class Bullet {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }
  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'red'
    c.fill()
    c.closePath()
  }
  //update để hiển thị hình ảnh đạn
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
class Grid {
  constructor() {
    this.position = {
      x: 0, // Bắt đầu từ bên trái của màn hình
      y: 0,
    };
    this.velocity = {
      x: 9, // Bắt đầu bằng cách di chuyển sang phải
      y: 0,
    };
    this.enemies = [];

    const rows = Math.floor(Math.random() * 5 + 4);
    const columns = Math.floor(Math.random() * 5 + 2);

    this.cellWidth = 60;
    this.cellHeight = 60;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.enemies.push(new Enemy({
          position: {
            x: x * this.cellWidth,
            y: y * this.cellHeight
          }
        }));
      }
    }

    this.width = columns * this.cellWidth;
    this.height = rows * this.cellHeight;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Kiểm tra xem lưới đã đi đến biên của màn hình chưa
    if (this.position.x + this.width >= canvas.width) {
        // Nếu di chuyển đến biên phải của lưới, chuyển hướng sang trái
        this.velocity.x = -Math.abs(this.velocity.x);
    } else if (this.position.x <= 0) {
        // Nếu di chuyển đến biên trái của màn hình, chuyển hướng sang phải
        this.velocity.x = Math.abs(this.velocity.x);
    }

    this.enemies.forEach(enemy => {
        enemy.update({ velocity: this.velocity });
    });
}
}


const player = new Player()

const grids = [new Grid()]

const Bullets = []

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

let shootingInterval;
let shootingKeyDown = false;
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'black' 
  c.clearRect(0, 0, canvas.width, canvas.height*2);
  c.fillRect(0, 10000, canvas.width, canvas.height*2)
  player.update()



  Bullets.forEach((bullet, index) => {

    // Xóa đạn nếu đi ra ngoài màn hình
    if (bullet.position.y + bullet.radius <= 0) {
      setTimeout(() => {
        Bullets.splice(index, 1);
      }, 0);
    }
    else bullet.update();
  });

  grids.forEach((grid) => {
    grid.update()
    grid.enemies.forEach(enemy => {
      enemy.update({velocity: grid.velocity})
    })
  })

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  }
  else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  }
  else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  if ((keys.a.pressed && keys.ArrowLeft.pressed) || (keys.d.pressed && keys.ArrowRight.pressed)) {
    // Kiểm tra xem đã bắn đạn chưa, nếu chưa thì bắt đầu bắn
    if (!shootingKeyDown) {
      // Bắt đầu setInterval để tự động bắn đạn mỗi 0.2 giây
      shootingInterval = setInterval(() => {
        Bullets.push(
          new Bullet({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -15,
            }
          })
        );
      }, 200);

      shootingKeyDown = true; // Đánh dấu rằng phím đã được giữ
    }
  } else {
    // Nếu không giữ phím nữa, dừng bắn và đặt lại trạng thái
    clearInterval(shootingInterval); // Dừng setInterval
    shootingKeyDown = false; // Đánh dấu rằng phím không còn được giữ nữa
  }
}
animate()


addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      //console.log('left')
      player.velocity.x = -7;
      keys.a.pressed = true
      keys.ArrowLeft.pressed = true
      break;
    case 'd':
    case 'ArrowRight':
      //console.log('right')
      player.velocity.x = 7;
      keys.d.pressed = true
      keys.ArrowRight.pressed = true
      break;
    case ' ':
      console.log('space')
      Bullets.push(
        new Bullet({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10,
          }
        })
      )
      break;
  }
})

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      // console.log('left')
      player.velocity.x = -7;
      keys.a.pressed = false;
      keys.ArrowLeft.pressed = false;
      break;
    case 'd':
    case 'ArrowRight':
      //   console.log('right')
      player.velocity.x = 7;
      keys.d.pressed = false
      keys.ArrowRight.pressed = false
      break;
    case ' ':
      //  console.log('space')
      break;
  }
})