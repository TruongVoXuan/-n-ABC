export const canvas = document.querySelector('canvas')
export const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight   // Sử dụng document.documentElement.clientHeight thay vì innerHeight

export class Player {
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

  checkItemCollision(items) {
    items.forEach((item, index) => {
      if (
        this.position.y + this.height >= item.position.y && // Kiểm tra va chạm theo chiều dọc
        this.position.y <= item.position.y + item.height && // Kiểm tra va chạm theo chiều dọc
        this.position.x + this.width >= item.position.x && // Kiểm tra va chạm theo chiều ngang
        this.position.x <= item.position.x + item.width // Kiểm tra va chạm theo chiều ngang
      ) {
        // Xóa item khi người chơi ăn được
        items.splice(index, 1);
        // Tăng điểm số hoặc thực hiện hành động tương ứng
        score += 50; // Ví dụ: Tăng điểm số lên 50 khi ăn được item
        console.log("Score: ", score);
      }
    });
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x

      
    }
  }

}

export class Bullet {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 10
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

export class Explosion {
  constructor({ position, velocity, radius, color }) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    //Độ mờ của đạn
    this.opacity = 1
  }
  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }
  //update để hiển thị hình ảnh đạn
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.opacity -= 0.01
  }
}

export class EnemyBullet {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.width = 3
    this.height = 10
  }
  draw() {
    c.fillStyle = 'yellow'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  //update để hiển thị hình ảnh đạn
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

export class Enemy {
  constructor({ position }) {
    this.velocity = {
      x: 1, // Bắt đầu bằng cách di chuyển sang trái
      y: 0.09, // Thêm tốc độ y để kẻ thù di chuyển xuống
    }

    this.image = new Image()
    this.image.src = './alien.png'

    this.isLevel2 = false; // Biến cờ đánh dấu màn 2

    this.shootInterval = 300; // Khoảng thời gian giữa các đợt bắn (miligiây)
    this.shootTimer = 0; // Đếm thời gian đã trôi qua từ lần bắn đạn trước đó
    this.canShoot = false; // Biến đánh dấu xem kẻ địch có thể bắn hay không

    this.image.onload = () => {
      this.width = this.image.width * 0.05
      this.height = this.image.height * 0.05

      this.position = { 
        x: position.x,
        y: position.y // Đặt enemy ở trên cùng màn hình
      }
    }
  }



  spawnEnemyBullet(enemyBullets) {
    // Tạo một viên đạn mới và thêm nó vào mảng enemyBullets
    enemyBullets.push(new EnemyBullet({
      position: {
        x: this.position.x + this.width / 2, // Bắt đầu từ giữa kẻ thù
        y: this.position.y + this.height, // Bắt đầu từ dưới cùng của kẻ thù
      },
      velocity: {
        x: 0, // Đạn di chuyển thẳng xuống
        y: 2, // Tốc độ di chuyển của đạn
      }
    }));
  }
  
  destroy(items) {
    // Kiểm tra xem enemy là ở màn 2 hay không
    if (this.isLevel2) {
      // Nếu ở màn 2, kiểm tra lại với Math.random() để quyết định có item hay không
      if (Math.random() < 0.9) { // Ví dụ: tỷ lệ là 90%
        const newItem = new Item({ position: this.position }); // Tạo mới item
        newItem.velocity.y = 2; // Gán vận tốc cho item để rơi xuống
        items.push(newItem); // Thêm item vào mảng items
      }
    }
  }
  draw() {
    // Vẽ hình ảnh của enemy
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    if (this.position && this.image) {
      // Di chuyển enemy theo vận tốc hiện tại
      this.position.x += this.velocity.x;

      this.position.y += this.velocity.y; // Thêm dòng này để kẻ thù di chuyển xuống

      // Kiểm tra xem enemy đã đi đến biên của màn hình chưa
      if (this.position.x + this.width >= canvas.width) {
        // Nếu di chuyển đến biên phải của màn hình, chuyển hướng sang trái
        this.velocity.x = -Math.abs(this.velocity.x);
      } else if (this.position.x <= 0) {
        // Nếu di chuyển đến biên trái của màn hình, chuyển hướng sang phải
        this.velocity.x = Math.abs(this.velocity.x);
      }

      this.draw();
    }

    this.shootTimer += 1; // Tăng đếm thời gian
    if (this.shootTimer >= this.shootInterval) {
      this.canShoot = true; // Đủ thời gian để bắn đạn
      this.shootTimer = 0; // Đặt lại đếm thời gian
    }
  }


  shoot(enemyBulletArray) {
    if (this.canShoot) {
      enemyBulletArray.push(
        new EnemyBullet({
          position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height,
          },
          velocity: {
            x: 0, // Cập nhật tốc độ di chuyển theo ý muốn
            y: 2, // Cập nhật tốc độ di chuyển theo ý muốn
          }
        })
      );
      this.canShoot = false; // Đánh dấu là đã bắn
    }
  }
}

export class Item {
  constructor({ position }) {
    this.position = position;
    this.image = new Image();
    this.image.src = './item.png';

    this.width = 40;
    this.height = 40;

    // Thêm thuộc tính velocity để quy định vận tốc của item khi rơi xuống
    this.velocity = {
      x: 0,
      y: 2 // Đặt vận tốc ban đầu là 2 để item rơi xuống
    };
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    // Cập nhật vị trí của item bằng cách tăng giá trị y của vị trí với vận tốc
    this.position.y += this.velocity.y;

    this.draw();
  }
}
export class Grid {
  constructor() {
    this.position = {
      x: 0, // Bắt đầu từ bên trái của màn hình
      y: 0,
    };
    this.velocity = {
      x: 0, // Bắt đầu bằng cách di chuyển sang phải
      y: 0,
    };
    this.enemies = [];

    const columns = Math.floor(Math.random() * 5 + 2)
    const rows = Math.floor(Math.random() * 5 + 1) // Đổi số hàng từ 100 thành 4

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const randomYOffset = Math.random() * 60; // Random một khoảng cách y ngẫu nhiên
        this.enemies.push(new Enemy({
          position: {
            x: x * 60,
            y: y * 60 + randomYOffset // Thêm randomYOffset vào vị trí y
          }
        }));
      }
    }

  }

  update() {
    this.enemies.forEach(enemy => {
      enemy.update();
    });
  }
}

const player = new Player()

const grids = [new Grid()]

const Bullets = []

const enemyBullets = []

const Explosions = []

const items = [];

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

function createExplosion({ object, color }) {
  for (let i = 0; i < 15; i++) {
    Explosions.push(new Explosion({
      position: {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2
      },
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      radius: Math.random() * 3,
      color: '#adff2f80'
    }))
  }

}

let frames = 0; // Di chuyển lên phía trên hàm animate
let shootingInterval;
let shootingKeyDown = false;
let gameOverFlag = false;
// let animationId; // Thêm biến này để lưu ID của requestAnimationFrame
let score = 0;


function gameOver() {
  // Dừng vòng lặp game
  cancelAnimationFrame(animationId);
  clearInterval(spawnInterval);
  gameOverFlag = true;

  // Hiển thị thông báo game over
  c.fillStyle = 'red';
  c.font = '30px Arial';
  c.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
}
let animationId; // Thêm biến này để lưu ID của requestAnimationFrame

function animate() {
  // Bỏ qua vòng lặp nếu trò chơi đã kết thúc
  if (gameOverFlag) return;

  frames++;
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.clearRect(0, 0, canvas.width, canvas.height); // Xóa màn hình để vẽ lại
  player.update();

  Explosions.forEach(explosion => {
    explosion.update()
  })

  // Gọi hàm kiểm tra va chạm giữa người chơi và item
  player.checkItemCollision(items);

  updateScoreAndCheckOverlay();

  // Cập nhật đạn của người chơi
  Bullets.forEach((bullet, index) => {
    if (bullet.position.y + bullet.radius <= 0) {
      setTimeout(() => {
        Bullets.splice(index, 1);
      }, 0);
    } else {
      bullet.update();
    }
  });

  grids.forEach((grid) => {
    grid.update();
    grid.enemies.forEach((enemy, i) => {
      enemy.update({ velocity: grid.velocity });

      // Tạo đạn từ kẻ thù sau mỗi 100 khung hình
      if (frames % (2000/1.5) === 0) {
        enemy.spawnEnemyBullet(enemyBullets);
      }

      // Va chạm giữa đạn của người chơi và kẻ địch
      Bullets.forEach((bullet, j) => {
        if (
          bullet.position.y - bullet.radius <= enemy.position.y + enemy.height &&
          bullet.position.x + bullet.radius >= enemy.position.x &&
          bullet.position.x - bullet.radius <= enemy.position.x + enemy.width
        ) {

          createExplosion({
            object: enemy
          })


          setTimeout(() => {
            grid.enemies.splice(i, 1);
            Bullets.splice(j, 1);
            score += 10;
            // Hiển thị điểm số mới (nếu cần)
            console.log("Score: ", score);

            // Kiểm tra điểm số và hiển thị thông báo khi đạt 3000
            if (score >= 3000) {
              showLevel2Message();
            }
            enemy.destroy(items);
          }, 0);
        }
        enemy.shoot(enemyBullets);
      });
    });
  });
      
// Vẽ tất cả các item có trong mảng items
items.forEach(item => {
  item.update();
});
  //HIển thị điểm trên màn hình
  c.fillStyle = 'white'; // Màu của chữ
  c.font = '30px Arial'; // Kích thước và kiểu chữ
  c.fillText('Score: ' + score, 10, 50); // Vị trí của chữ trên màn hình

  // Cập nhật đạn của kẻ địch (cần sửa đoạn này)
  enemyBullets.forEach((enemyBullet) => {
    enemyBullet.update();
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
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

  // Kiểm tra va chạm giữa đạn của kẻ địch và người chơi, nếu trò chơi chưa kết thúc
  enemyBullets.forEach((enemyBullet, k) => {
    if (
      enemyBullet.position.y <= player.position.y + player.height &&
      enemyBullet.position.y + enemyBullet.height >= player.position.y &&
      enemyBullet.position.x + enemyBullet.width >= player.position.x &&
      enemyBullet.position.x <= player.position.x + player.width
    ) {
      // Khi va chạm xảy ra, gọi hàm gameOver
      gameOver();
    }
  });
}

animate();

let level2Flag  = false; // Biến đánh dấu liệu game có đang ở màn 2 hay không
function updateScoreAndCheckOverlay() {
  // Cập nhật điểm số
  // Đoạn code cập nhật điểm số đã có sẵn trong hàm animate(), chỉ cần di chuyển vào đây

  // Kiểm tra điểm số và hiển thị overlay khi cần
  if (score >= 100 && !level2Flag) { // Thêm điều kiện !level2Flag để đảm bảo chỉ hiển thị overlay một lần
    level2Flag = true; // Đánh dấu rằng đã hiển thị overlay màn 2
    showLevel2Message();
  }
}


function showLevel2Message() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex'; // Hiển thị overlay

  // Dừng vòng lặp chính của game
  cancelAnimationFrame(animationId);
  clearInterval(spawnInterval);

  // Đặt sự kiện lắng nghe khi người chơi nhấn phím Enter để tiếp tục
  window.addEventListener('keydown', handleEnterKey);
}

function handleEnterKey(event) {
  // Người chơi nhấn phím Enter để tiếp tục
  if (event.key === 'Enter') {
    // Ẩn bảng thông báo
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';

    // Đặt lại trạng thái của game và bắt đầu màn 2
    resetGame();
    startLevel2();

    // Gỡ bỏ sự kiện lắng nghe phím Enter
    window.removeEventListener('keydown', handleEnterKey);
  }
}


function resetGame() {
  // Đặt lại tất cả các biến và mảng đối tượng của game
  // Xóa toàn bộ các kẻ thù, đạn, v.v.
  grids.length = 0;
  Bullets.length = 0;
  enemyBullets.length = 0;
  Explosions.length = 0;
  score = 0; // Đặt lại điểm số
}

function startLevel2() {
  // Bắt đầu màn 2
  // Tạo một môi trường mới cho màn 2
  grids.length = 0; // Xóa các grid của màn trước
  const newGrid = new Grid(); // Tạo một grid mới
  for (let i = 0; i < 20; i++) {
    // Thêm kẻ thù vào grid mới
    const enemy = new Enemy({
      position: {
        x: Math.random() * canvas.width, // Random vị trí theo chiều ngang
        y: Math.random() * canvas.height * 0.5, // Random vị trí theo chiều dọc (trên một nửa màn hình)
      },
    });
    enemy.isLevel2 = true; // Thiết lập isLevel2 thành true cho màn 2
    newGrid.enemies.push(enemy);
  }
  grids.push(newGrid); // Thêm grid mới vào mảng grids

  // Thiết lập isLevel2 thành true cho tất cả các kẻ thù trong màn 2
  grids.forEach(grid => {
    grid.enemies.forEach(enemy => {
      enemy.isLevel2 = true;
      enemy.image.src = './boss.png';
    });
  });

   // Bắt đầu tạo kẻ thù sau một khoảng thời gian trong màn 2
   spawnEnemies();
  // Bắt đầu vòng lặp game lại
  animate();

 

 
}




let spawnInterval;
function spawnEnemies() {
  // Tạo một kẻ thù mới và thêm vào mảng grids
  grids.push(new Grid());

  // Thiết lập một khoảng thời gian để tạo ra kẻ thù tiếp theo
  spawnInterval = setTimeout(spawnEnemies, 12000); // Tạo ra một kẻ thù mới mỗi 2 giây
}

// Bắt đầu tạo kẻ thù
spawnEnemies();

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