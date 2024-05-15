
export const canvas = document.querySelector('canvas')
export const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight   // Sử dụng document.documentElement.clientHeight thay vì innerHeight



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
    // Kích hoạt hiệu ứng nổ
  createExplosion({ object: this });
  // Kiểm tra xem enemy là ở màn 2 hay không
  if (this.isLevel2) {
    // Nếu ở màn 2, kiểm tra lại với Math.random() để quyết định có item hay không
    if (Math.random() < 0.9) { // Ví dụ: tỷ lệ là 90%
      const newItem = new Item({ position: this.position, type: 'item_boss' }); // Tạo mới item với loại là 'item_boss'
      newItem.velocity.y = 2; // Gán vận tốc cho item để rơi xuống
      items.push(newItem); // Thêm item vào mảng items
    }
  }
  // Loại bỏ kẻ địch khỏi grid
  const index = grids[0].enemies.indexOf(this);
  if (index !== -1) {
    grids[0].enemies.splice(index, 1);
  }
}
  draw() {
    // Vẽ hình ảnh của enemy
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    // Kiểm tra xem position và image đã được khởi tạo chưa
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
  
      // Vẽ enemy
      this.draw();
    }
  
    this.shootTimer += 0.5; // Tăng đếm thời gian
    if (this.shootTimer >= this.shootInterval) {
      this.canShoot = true; // Đủ thời gian để bắn đạn
      this.shootTimer = 0; // Đặt lại đếm thời gian
    }
  
    // Kiểm tra nếu enemy vượt quá góc màn hình phía dưới
    if (this.position && this.position.y + this.height >= canvas.height) {
      // Nếu vượt quá, kết thúc trò chơi
      gameOver(); // Hàm gameOver() cần được triển khai để kết thúc trò chơi
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
export class Player {
  constructor() {

    this.velocity = {
      x: 0,
      y: 0,
    }

    this.rotation = 0;

    const image = new Image()
    image.src = './spaceship.png'

    this.hp = 100; // Khởi tạo máu của người chơi

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

   // Phương thức để giảm máu của người chơi
   decreaseHP(amount) {
    this.hp -= amount;
    if (this.hp < 0) {
        // Ẩn hình ảnh người chơi
        this.image = null;
        playSound('sound6');
        // Tạm dừng trò chơi
       
        // Kích hoạt hiệu ứng nổ của người chơi và chờ 1 giây trước khi thực hiện các hành động tiếp theo
        createExplosion({ object: this });
        setTimeout(() => {
            // Xử lý kết thúc trò chơi
            gameOver();
        }, 500); // Chờ 0.5 giây trước khi kết thúc trò chơi
    }
}


  checkItemCollision(items) {
    items.forEach((item, index) => {
      if (
        this.position.y + this.height >= item.position.y && // Kiểm tra va chạm theo chiều dọc
        this.position.y <= item.position.y + item.height && // Kiểm tra va chạm theo chiều dọc
        this.position.x + this.width >= item.position.x && // Kiểm tra va chạm theo chiều ngang
        this.position.x <= item.position.x + item.width && // Kiểm tra va chạm theo chiều ngang
        player.hp < 100 // Kiểm tra xem HP của người chơi đã dưới 100 chưa
      ) {
        playSound('sound7');

        // Xóa item khi người chơi ăn được
        items.splice(index, 1);
        // Tính toán số lượng HP cần tăng, đảm bảo không vượt quá 100
        const hpToAdd = Math.min(100 - player.hp, 20);
        // Tăng điểm số hoặc thực hiện hành động tương ứng
        score += 50; // Ví dụ: Tăng điểm số lên 50 khi ăn được item
        player.hp += hpToAdd; // Sửa đổi giá trị hp của người chơi
        console.log("Score: ", score);
        console.log("HP: ", player.hp); // Kiểm tra giá trị hp mới
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

export class Boss_Last {
  constructor({ position }) {
    this.width = 500;
    this.height = 350;
    this.position = { x: position.x, y: -this.height }; // Khởi tạo vị trí y ở phía trên màn hình
  this.velocity = { x: 0.5, y: 0.1}; // Đặt vận tốc theo trục y dương
    this.image = new Image();
    this.image.src = './Boss_Last.png';
   
    this.maxHp = 500; // Thêm thuộc tính maxHp để lưu trữ máu tối đa của Boss_Last
    this.hp = this.maxHp; // Đặt máu ban đầu bằng máu tối đa
    this.shootInterval = 1500;
    this.shootTimer = 0;
    this.isReadyToShoot = false;
    this.isLevel3 = true;
    this.hpBarWidth = this.width;
  }

  // Hàm giảm máu của Boss_Last khi bị đánh
  decreaseHP(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

  // Hàm kiểm tra máu và hủy Boss_Last nếu máu dưới mức quy định
  checkHealthAndDestroy(items) {
    if (this.hp <= 0) {
      // Kích hoạt hiệu ứng nổ
      createExplosion({ object: this });
  
      // Tạo item_boss khi Boss_Last bị tiêu diệt
      const newItem = new Item_Boss({ position: this.position });
      newItem.velocity.y = 2;
      items.push(newItem);
  
      // Loại bỏ kẻ địch khỏi grid
      const index = grids[0].enemies.indexOf(this);
      if (index !== -1) {
        grids[0].enemies.splice(index, 1);
      }
    }
  }

  draw() {
    // Vẽ hình ảnh của Boss_Last
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  
    // Vẽ thanh máu
    const hpBarHeight = 10; // Chiều cao của thanh máu
    const hpBarX = this.position.x; // Tọa độ X của thanh máu
    const hpBarY = this.position.y + this.height + 5; // Tọa độ Y của thanh máu
    this.hpBarWidth = this.width; // Chiều rộng tối đa của thanh máu
    const remainingHpWidth = (this.hp / this.maxHp) * this.hpBarWidth*150; // Chiều rộng của thanh máu còn lại
    const remainingHpColor = 'red'; // Màu của thanh máu còn lại
  
    c.fillStyle = remainingHpColor; // Đặt màu cho thanh máu còn lại
    c.fillRect(hpBarX, hpBarY, remainingHpWidth, hpBarHeight); // Vẽ thanh máu còn lại
  }

  update() {
    if (this.position && this.image) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.x + this.width >= canvas.width) {
        this.velocity.x = -Math.abs(this.velocity.x);
      } else if (this.position.x <= 0) {
        this.velocity.x = Math.abs(this.velocity.x);
      }

      this.draw();
    }

    this.shootTimer += 10;
    if (this.shootTimer >= this.shootInterval) {
      this.isReadyToShoot = true;
      this.shootTimer = 0;
    }
  }
  
  destroy() {
    // Thực hiện hành động khi đối tượng bị hủy
    // Ví dụ: Loại bỏ đối tượng khỏi grid
    const index = grids[0].enemies.indexOf(this);
    if (index !== -1) {
      grids[0].enemies.splice(index, 1);
    }
  }

  shoot(enemyBulletArray) {
    if (this.isReadyToShoot) {
      enemyBulletArray.push(
        new EnemyBullet({
          position: { x: this.position.x + this.width / 2, y: this.position.y + this.height },
          velocity: { x: 0, y: 2 }
        })
      );
      this.isReadyToShoot = false;
    }
  }
}


export class Item {
  constructor({ position }) {
    this.position = position;
    this.image = new Image();
    this.image.src = './item_boss.png';

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
let score = 0;

const healthBarWidth = 200;
const healthBarHeight = 20;
const healthBarX = 50;
const healthBarY = 80;

function drawHealthBar() {
  // Vẽ chữ HP
  c.fillStyle = 'white'; // Màu của chữ HP
  c.font = '30px Arial'; // Kiểu chữ và kích thước
  c.fillText('HP:', healthBarX -40, healthBarY + 20); // Vẽ chữ HP tại vị trí xác định

  // Vẽ thanh máu
  c.fillStyle = 'green'; // Màu của thanh máu
  c.fillRect(healthBarX +20, healthBarY, healthBarWidth * (player.hp / 100), healthBarHeight); // Vẽ thanh máu với chiều dài thích hợp dựa trên HP của người chơi
}

function gameOver() {
  // Dừng vòng lặp game
  cancelAnimationFrame(animationId);
  clearInterval(spawnInterval);
  gameOverFlag = true;

  const overlay = document.getElementById('overlay_Die');
  overlay.style.display = 'flex';
  playSound('sound6');
}
let animationId; // Biến lưu trữ ID của requestAnimationFrame

let bossLastDestroyed = false;
let paused = false;
let animationRunning = false;
let shootingSound; // Biến lưu trữ âm thanh bắn đạn

function animate() {
  // Bỏ qua vòng lặp nếu trò chơi đã kết thúc
  if (!paused && !gameOverFlag && !animationRunning )
    {
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

  drawHealthBar(); // Vẽ lại thanh máu

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
      if (frames % (100/1.5) === 0) {
        enemy.spawnEnemyBullet(enemyBullets);
      }

      // Kiểm tra va chạm giữa đạn của kẻ địch và người chơi
  enemyBullets.forEach((enemyBullet, k) => {
    if (
      enemyBullet.position.y <= player.position.y + player.height &&
      enemyBullet.position.y + enemyBullet.height >= player.position.y &&
      enemyBullet.position.x + enemyBullet.width >= player.position.x &&
      enemyBullet.position.x <= player.position.x + player.width
      
    )
     {
      // Khi va chạm xảy ra, giảm máu của người chơi
      player.decreaseHP(10); // Giảm 10 điểm máu khi bị trúng đạn của kẻ địch
      // Xóa đạn của kẻ địch sau khi va chạm
      enemyBullets.splice(k, 1);
      
    }
  });
 

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
          
      
          // Kiểm tra xem enemy có phải là Boss_Last không
          if (enemy instanceof Boss_Last) {
            
            // Nếu là Boss_Last, giảm máu và kiểm tra xem nó có còn sống không
            enemy.decreaseHP(0.1); // Giảm 1 HP cho mỗi viên đạn
            if (enemy.hp <= 0) {
             
              bossLastDestroyed = true;
              grid.enemies.splice(i, 1);
              score += 10;
              console.log("Score: ", score);
              if (score >= 3000) {
                showLevel2Message();
              }
              enemy.destroy(items);
              playSound('sound5');
            }
          } else {
            // Nếu không phải Boss_Last, hủy ngay lập tức
            grid.enemies.splice(i, 1);
            score += 10;
            console.log("Score: ", score);
            if (score >= 3000) {
              showLevel2Message();
            }
            enemy.destroy(items);
            playSound('sound3');
          }
      
          // Xóa viên đạn sau khi va chạm
          Bullets.splice(j, 1);
        }
        enemy.shoot(enemyBullets);
      });
      if (bossLastDestroyed) {
        
       function animate() {
  // Bỏ qua vòng lặp nếu trò chơi đã kết thúc
  if (!paused && !gameOverFlag && !animationRunning)
    {
      animationRunning = true;
  frames++;
  animationRunning = false;
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

  drawHealthBar(); // Vẽ lại thanh máu

   

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

      // Kiểm tra va chạm giữa đạn của kẻ địch và người chơi
  enemyBullets.forEach((enemyBullet, k) => {
    if (
      enemyBullet.position.y <= player.position.y + player.height &&
      enemyBullet.position.y + enemyBullet.height >= player.position.y &&
      enemyBullet.position.x + enemyBullet.width >= player.position.x &&
      enemyBullet.position.x <= player.position.x + player.width
    ) {
      // Khi va chạm xảy ra, giảm máu của người chơi
      player.decreaseHP(10); // Giảm 10 điểm máu khi bị trúng đạn của kẻ địch
      // Xóa đạn của kẻ địch sau khi va chạm
      enemyBullets.splice(k, 1);
      
    }
  });

   


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
      
          // Kiểm tra xem enemy có phải là Boss_Last không
          if (enemy instanceof Boss_Last) {
            // Nếu là Boss_Last, giảm máu và kiểm tra xem nó có còn sống không
            enemy.decreaseHP(0.1); // Giảm 1 HP cho mỗi viên đạn
            if (enemy.hp <= 0) {
              bossLastDestroyed = true;
              grid.enemies.splice(i, 1);
              score += 10;
              console.log("Score: ", score);
              if (score >= 3000) {
                showLevel2Message();
              }
              enemy.destroy(items);
            }
          } else {
            // Nếu không phải Boss_Last, hủy ngay lập tức
            grid.enemies.splice(i, 1);
            score += 10;
            console.log("Score: ", score);
            if (score >= 3000) {
              showLevel2Message();
            }
            enemy.destroy(items);
          }
      
          // Xóa viên đạn sau khi va chạm
          Bullets.splice(j, 1);
        }
        enemy.shoot(enemyBullets);
      });
      if (bossLastDestroyed) {
        
      // Đặt cờ gameOverFlag để ngăn chặn các hoạt động tiếp theo
  gameOverFlag = true;
  // Lập lịch hiển thị thông báo sau một giây
  setTimeout(ThongBaoEndGame, 1000);
      }
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
        playSound('sound1');
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
    
    }
  });
}
}
animate();
      }
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
      playerShoot();
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
    
    }
  });
}
}
animate();


let level2Flag  = false; // Biến đánh dấu liệu game có đang ở màn 2 hay không
let level3Flag = false;

// Hàm để dừng âm thanh
function stopShootingSound() {
  if (shootingSound) {
    shootingSound.pause();
    shootingSound.currentTime = 0;
    shootingSound = null; // Đặt lại biến âm thanh
  }
}
function updateScoreAndCheckOverlay() {
  // Cập nhật điểm số
  // Đoạn code cập nhật điểm số đã có sẵn trong hàm animate(), chỉ cần di chuyển vào đây

  // Kiểm tra điều kiện qua màn 1
  if (score >= 100 && !level2Flag) { // Thêm điều kiện !level2Flag để đảm bảo chỉ hiển thị overlay một lần
    level2Flag = true; // Đánh dấu rằng đã hiển thị overlay màn 2
    ThongBaoNextLevel2();
  }
   // Kiểm tra điều kiện qua màn 2
   if (score >= 200 && level2Flag && !level3Flag) {
    level3Flag = true;
    ThongBaoNextLevel3();
  }

}

function ThongBaoNextLevel3() {
  const overlay3 = document.getElementById('overlay2');
  overlay3.style.display = 'flex'; // Hiển thị overlay
  stopShootingSound();
  // Dừng vòng lặp chính của game
  cancelAnimationFrame(animationId);
  clearInterval(spawnInterval);
  // Đặt sự kiện lắng nghe khi người chơi nhấn phím Enter để tiếp tục
  window.addEventListener('keydown', handleEnterKey2);
}


function ThongBaoEndGame() {
  const overlay4 = document.getElementById('overlay_B');
  overlay4.style.display = 'flex'; // Hiển thị overlay
  stopShootingSound();
  // Dừng vòng lặp chính của game
  cancelAnimationFrame(animationId);
  clearInterval(spawnInterval);
  // Đặt sự kiện lắng nghe khi người chơi nhấn phím Enter để tiếp tục
  window.addEventListener('keydown', handleEnterKey);
 
 
}





// Tạo một biến để kiểm tra xem người chơi đã qua màn 3 hay chưa

function ThongBaoNextLevel2() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex'; // Hiển thị overlay
  stopShootingSound();
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

    // Nếu đã qua màn 3, chuyển về trang index_menu.html
    if (level3Flag) {
      window.location.href = "http://127.0.0.1:5500/TEST_GAME/Menu_Game/index_menu.html";
    } else {
      // Nếu chưa qua màn 3, đặt lại trạng thái của game và bắt đầu màn 2
      resetGame();
      startLevel2();
    }

    // Gỡ bỏ sự kiện lắng nghe phím Enter
    window.removeEventListener('keydown', handleEnterKey);
  }
}

function handleEnterKey2(event) {
  // Người chơi nhấn phím Enter để tiếp tục
  if (event.key === 'Enter') {
    // Ẩn bảng thông báo
    const overlay2 = document.getElementById('overlay2');
    overlay2.style.display = 'none';

    // Đặt lại trạng thái của game và bắt đầu màn 3
    resetGame();
    startLevel3();

    // Đặt biến passedLevel3 thành true khi qua màn 3
    passedLevel3 = true;

    // Gỡ bỏ sự kiện lắng nghe phím Enter
    window.removeEventListener('keydown', handleEnterKey2);
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

function restart() {
   // Đặt lại tất cả các biến và mảng đối tượng của game
  // Xóa toàn bộ các kẻ thù, đạn, v.v.
  grids.length = 0;
  Bullets.length = 0;
  enemyBullets.length = 0;
  Explosions.length = 0;
  score = 0; // Đặt lại điểm số
  animate()
  console.log("Game restarted");
  window.location.href = 'http://127.0.0.1:5500/TEST_GAME/Menu_Game/index_menu.html';
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

function startLevel2() {
  // Bắt đầu màn 2
  // Tạo một môi trường mới cho màn 2
  grids.length = 0; // Xóa các grid của màn trước
  const newGrid = new Grid(); // Tạo một grid mới
  for (let i = 0; i < 20; i++) {
    // Thêm kẻ thù loại boss vào grid mới
    const bossEnemy = new Enemy({
      position: {
        x: Math.random() * canvas.width, // Random vị trí theo chiều ngang
        y: Math.random() * canvas.height * 0.5, // Random vị trí theo chiều dọc (trên một nửa màn hình)
      },
    });
    bossEnemy.isLevel2 = true; // Thiết lập isLevel2 thành true cho màn 2
    bossEnemy.image.src = './boss.png'; // Sử dụng hình ảnh của boss
    newGrid.enemies.push(bossEnemy);

    // Thêm kẻ thù loại alien vào grid mới
    const alienEnemy = new Enemy({
      position: {
        x: Math.random() * canvas.width, // Random vị trí theo chiều ngang
        y: Math.random() * canvas.height * 0.5, // Random vị trí theo chiều dọc (trên một nửa màn hình)
      },
    });
    alienEnemy.isLevel2 = true; // Thiết lập isLevel2 thành true cho màn 2
    alienEnemy.image.src = './alien.png'; // Sử dụng hình ảnh của alien
    newGrid.enemies.push(alienEnemy);
  }
  grids.push(newGrid); // Thêm grid mới vào mảng grids

  // Bắt đầu tạo kẻ thù sau một khoảng thời gian trong màn 2
  spawnEnemies();
  // Bắt đầu vòng lặp game lại
  animate();
}

function startLevel3() {
  // Tạo một môi trường mới cho màn 3
  grids.length = 0; // Xóa các grid của màn trước
  const newGrid = new Grid(); // Tạo một grid mới

  for (let i = 0; i < 10; i++) {
    // Thêm kẻ thù loại boss vào grid mới
    const bossEnemy = new Enemy({
      position: {
        x: Math.random() * canvas.width, // Random vị trí theo chiều ngang
        y: Math.random() * canvas.height * 0.5, // Random vị trí theo chiều dọc (trên một nửa màn hình)
      },
    });
    bossEnemy.isLevel2 = true; // Thiết lập isLevel2 thành true cho màn 2
    bossEnemy.image.src = './boss.png'; // Sử dụng hình ảnh của boss
    newGrid.enemies.push(bossEnemy);

    // Thêm kẻ thù loại alien vào grid mới
    const alienEnemy = new Enemy({
      position: {
        x: Math.random() * canvas.width, // Random vị trí theo chiều ngang
        y: Math.random() * canvas.height * 0.5, // Random vị trí theo chiều dọc (trên một nửa màn hình)
      },
    });
    alienEnemy.isLevel2 = true; // Thiết lập isLevel2 thành true cho màn 2
    alienEnemy.image.src = './alien.png'; // Sử dụng hình ảnh của alien
    newGrid.enemies.push(alienEnemy);
  }

  // Thêm kẻ thù loại Boss_Last vào grid mới
  const bossEnemy2 = new Boss_Last({
    position: {
      x: canvas.width / 2 - 75, // Đặt boss ở giữa màn hình theo chiều ngang
      y: 50, // Đặt boss ở trên cùng của màn hình
    },
  });
  bossEnemy2.isLevel3 = true; // Đặt lại thành true cho màn 3
  bossEnemy2.image.src = 'Boss_Last.png'; // Sử dụng hình ảnh của boss cho màn 3
  bossEnemy2.hp = 3; // Đặt số lần trúng đạn cần để boss chết
  newGrid.enemies.push(bossEnemy2);

  grids.push(newGrid); // Thêm grid mới vào mảng grids

  // Bắt đầu tạo kẻ thù sau một khoảng thời gian trong màn 3
  spawnEnemies();
  // Bắt đầu vòng lặp game lại
  animate();
}


// Tạo một hàm để hiển thị lại menu game
function showGameMenu() {
  // Hiển thị menu game (ví dụ: bằng cách hiển thị overlay)
  const gameMenu = document.getElementById('game-menu');
  gameMenu.style.display = 'block';
}

// Lắng nghe sự kiện keydown
document.addEventListener('keydown', function(event) {
  // Nếu phím Esc được nhấn
  if (event.key === 'Escape') {
      // Chuyển hướng về trang menu_game.html
      window.location.href = 'http://127.0.0.1:5500/TEST_GAME/Menu_Game/index_menu.html';
  }
});



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

document.getElementById('pauseBtn').addEventListener('click', function(e) {
  paused = true;
  document.getElementById("continute").removeAttribute("disabled");
  document.getElementById("resumeBtn").style.opacity = "1"; // Hiển thị nút "Resume" bằng cách tăng độ mờ
  document.getElementById("resumeBtn").style.pointerEvents = "auto"; // Cho phép sự kiện click
  this.style.display = "none"; // Ẩn nút "Pause"
  cancelAnimationFrame(animationId); // Dừng vòng lặp animation frame
  console.log("Game paused");
  console.log('paused: ', paused);
});

document.getElementById('resumeBtn').addEventListener('click', function(e) {
  paused =false;
  document.getElementById("continute").setAttribute("disabled", true);
  document.getElementById("resumeBtn").style.opacity = "0"; // Ẩn nút "Resume" bằng cách làm mờ
  document.getElementById("resumeBtn").style.pointerEvents = "none"; // Không cho phép sự kiện click
  document.getElementById("pauseBtn").style.display = "block"; // Hiển thị nút "Pause"
  if (!paused ) {
    animate();
  }
  console.log('paused: ', paused);
});

document.getElementById('RS_GAME').addEventListener('click', function(e){
   // Đặt lại trạng thái của trò chơi và bắt đầu lại từ đầu
   restart()
   console.log("RSSSSS")
  
})


const audioFiles = {
  sound7: 'Audio_Game/select.mp3',
  sound1: 'Audio_Game/enemyShoot.wav',
  
  sound3: 'Audio_Game/explode.wav',
  sound4: 'Audio_Game/bonus.mp3',
  sound5: 'Audio_Game/bomb.mp3',
  sound6: 'Audio_Game/gameOver.mp3',
  
  // Thêm các tệp âm thanh khác tại đây
};

// Hàm để tạo và phát âm thanh
function playSound(soundName) {
  let sound = new Audio(audioFiles[soundName]);
  sound.play();
}

// Sử dụng hàm playSound để phát âm thanh
playSound('sound1'); // Phát âm thanh sound1.mp3
playSound('sound2'); // Phát âm thanh sound2.wav
playSound('sound3'); // Phát âm thanh sound3.mp3
playSound('sound4'); // Phát âm thanh sound3.mp3
playSound('sound5'); // Phát âm thanh sound3.mp3

// Gọi hàm playSound tại thời điểm thích hợp
function playerShoot() {
  // Logic để bắn đạn của người chơi
  playSound('sound1'); // Phát âm thanh khi bắn đạn
}

// Gọi hàm playerShoot khi người chơi bắn đạn
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' || e.code == 'a'|| e.code == 'd') {
    playerShoot(); // Giả sử người chơi bắn đạn khi nhấn phím Space
  }
});
