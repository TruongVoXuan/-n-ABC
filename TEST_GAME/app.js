
export const canvas = document.querySelector('canvas')
export const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight   // Sử dụng document.documentElement.clientHeight thay vì innerHeight



export class Bullet {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 10;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'red';
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
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
      y: 0.06, // Thêm tốc độ y để kẻ thù di chuyển xuống
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
        y: 1.5, // Tốc độ di chuyển của đạn
      }
    }));
  }
  
  destroy(items) {
    // Kích hoạt hiệu ứng nổ
  createExplosion({ object: this });
  // Kiểm tra xem enemy là ở màn 2 hay không
  if (this.isLevel2) {
    // Nếu ở màn 2, kiểm tra lại với Math.random() để quyết định có item hay không
    if (Math.random() < 0.2) { // Ví dụ: tỷ lệ là 90%
      const newItem = new Item({ position: this.position, type: 'item_boss' }); // Tạo mới item với loại là 'item_boss'
      newItem.velocity.y = 1; // Gán vận tốc cho item để rơi xuống
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
  
    this.shootTimer += 0.9; // Tăng đếm thời gian
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

class BulletEvol extends Bullet {
  constructor({ position, velocity }) {
      super({ position, velocity }); // Gọi constructor của lớp cha
      this.radius = 15; // Đặt bán kính lớn hơn cho đạn tiến hóa
      this.color = 'blue'; // Thêm thuộc tính color và đặt màu là blue
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color; // Đặt màu fill của đạn là màu blue
    c.fill();
    c.closePath();
    c.restore();
}
  // Phương thức kiểm tra va chạm với kẻ địch
  checkCollisionWithEnemy(enemy) {
      // Kiểm tra xem vị trí của đạn có chạm vào kẻ địch không
      if (
          this.position.y >= enemy.position.y &&
          this.position.y <= enemy.position.y + enemy.height &&
          this.position.x >= enemy.position.x &&
          this.position.x <= enemy.position.x + enemy.width
      ) {
          return true;
      }
      return false;
  }
}


export class Player {
  constructor() {
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.hp = 500; // Initial health points
    this.bullets = []; // Array to store bullets
    this.itemCount = 0; // Keep track of the number of items collected

    const image = new Image();
    image.src = './spaceship.png';

    image.onload = () => {
      this.image = image;
      this.width = image.width * 0.2;
      this.height = image.height * 0.2;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    c.save();
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.rotate(this.rotation);
    c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    c.restore();
  }

  shoot() {
    const baseBullet = {
      position: { x: this.position.x + this.width / 2, y: this.position.y },
      velocity: { x: 0, y: -10 },
    };
    this.bullets.push(new Bullet(baseBullet));

    if (this.isEvolved) {
      const angles = [0, 45, 90, 135, 180, 225, 270, 315]; // Angles in degrees for bullet directions
      angles.forEach(angle => {
        const radians = (angle * Math.PI) / 180;
        const velocity = {
          x: Math.sin(radians) * 5,
          y: -Math.cos(radians) * 5,
        };
        this.bullets.push(new Bullet({
          position: { x: this.position.x + this.width / 2, y: this.position.y },
          velocity: velocity,
        }));
      });
    }
  }

  decreaseHP(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.image = null;
      playSound('sound6');
      createExplosion({ object: this });
      setTimeout(() => {
        gameOver();
      }, 500);
    }
  }
  collectItem() {
    this.itemCount++;
    console.log("Item collected! Bullets evolved.");

    // Tạo một loạt đạn tiến hóa khi thu thập item
    const numBullets = 8; // Số lượng đạn tiến hóa muốn tạo

    // Góc ban đầu cho các viên đạn
    const initialAngle = -Math.PI / 2; // Góc ban đầu là vuông góc trên

    // Góc giữa các viên đạn
    const angleIncrement = (2 * Math.PI) / numBullets;

    // Tạo từng viên đạn tiến hóa và thêm vào mảng bullets
    for (let i = 0; i < numBullets; i++) {
        const angle = initialAngle + i * angleIncrement;
        const velocity = {
            x: Math.sin(angle) * 10,
            y: -Math.cos(angle) * 10,
        };
        const newBullet = new BulletEvol({
            position: { x: this.position.x + this.width / 2, y: this.position.y },
            velocity: velocity,
        });
        this.bullets.push(newBullet);
    }
}

  checkItemCollision(items) {
    items.forEach((item, index) => {
      if (
        this.position.y + this.height >= item.position.y &&
        this.position.y <= item.position.y + item.height &&
        this.position.x + this.width >= item.position.x &&
        this.position.x <= item.position.x + item.width
      ) {
       
        playSound('sound7');
        items.splice(index, 1);
        this.collectItem();
        score += 50;
        const hpToAdd = Math.min(1000 - this.hp, 20);
        this.hp += hpToAdd;
        console.log("Score: ", score);
        console.log("HP: ", this.hp);
      }
    });
  }

  update() {
    if (this.image) {
        this.draw();
        this.position.x += this.velocity.x;
        this.bullets.forEach(bullet => bullet.update());
    }
    
    // Tạo một mảng chứa chỉ số các viên đạn cần xóa
    let bulletsToRemove = [];

    this.bullets.forEach((bullet, bulletIndex) => {
        if (bullet.position.y + bullet.radius <= 0) {
            // Xóa đạn khi vượt ra khỏi màn hình
            bulletsToRemove.push(bulletIndex);
        } else {
            // Kiểm tra va chạm giữa đạn và kẻ địch
            grids.forEach(grid => {
                grid.enemies.forEach((enemy, enemyIndex) => {
                    if (bullet instanceof BulletEvol && bullet.checkCollisionWithEnemy(enemy)) {
                        // Kiểm tra xem enemy có phải là Boss_Last không
                        if  (enemy instanceof Boss_Last) {
                            // Nếu là Boss_Last, giảm máu và kiểm tra xem nó có còn sống không
                            enemy.decreaseHP(0.1); // Giảm 1 HP cho mỗi viên đạn
                            if (enemy.hp <= 0) {
                                bossLastDestroyed = true;
                                score += 10;
                                console.log("Score: ", score);
                                if (score >= 3000) {
                                    showLevel2Message();
                                }
                                enemy.destroy(items);
                                playSound('sound5');
                                // Đánh dấu viên đạn cần xóa
                                bulletsToRemove.push(bulletIndex);
                            }
                        }
                        // Tạo hiệu ứng nổ khi đạn va chạm với kẻ địch
                        createExplosion({ object: enemy });
                        // Nếu không phải Boss_Last, đánh dấu kẻ địch cần xóa
                        if (!(enemy instanceof Boss_Last)) {
                            grid.enemies.splice(enemyIndex, 1);
                        }
                    }
                });
            });
        }
    });

    // Xóa đạn khỏi mảng
    bulletsToRemove.reverse().forEach(index => {
        this.bullets.splice(index, 1);
    });
}

  
}
export class Boss_Last {
  constructor({ position }) {
    this.width = 500;
    this.height = 350;
    this.position = { x: position.x, y: -this.height };
    this.velocity = { x: 0.3, y: 0.05 };
    this.image = new Image();
    this.image.src = './Boss_Last.png';

    this.maxHp = 500;
    this.hp = this.maxHp;
    this.shootInterval = 4000; // Thời gian giữa các lần bắn
    this.shootTimer = 0;
    this.isReadyToShoot = false;
    this.isLevel3 = true;
    this.hpBarWidth = this.width;
  }

  decreaseHP(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

  checkHealthAndDestroy(items) {
    if (this.hp <= 0) {
      createExplosion({ object: this });
      const newItem = new Item_Boss({ position: this.position });
      newItem.velocity.y = 2;
      items.push(newItem);
      const index = grids[0].enemies.indexOf(this);
      if (index !== -1) {
        grids[0].enemies.splice(index, 1);
      }
    }
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    const hpBarHeight = 10;
    const hpBarX = this.position.x;
    const hpBarY = this.position.y + this.height + 5;
    this.hpBarWidth = this.width;
    const remainingHpWidth = (this.hp / this.maxHp) * this.hpBarWidth * 150;
    const remainingHpColor = 'red';

    c.fillStyle = remainingHpColor;
    c.fillRect(hpBarX, hpBarY, remainingHpWidth, hpBarHeight);
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

    this.shootTimer += 100;
    if (this.shootTimer >= this.shootInterval) {
      this.isReadyToShoot = true;
      this.shootTimer = 0;
    }
  }

  destroy() {
    const index = grids[0].enemies.indexOf(this);
    if (index !== -1) {
      grids[0].enemies.splice(index, 1);
    }
  }

  shoot(enemyBulletArray) {
    if (this.isReadyToShoot) {
      const warningPosition = { x: this.position.x + this.width / 2, y: this.position.y + this.height };
      enemyBulletArray.push(new LaserWarning({ position: warningPosition }));

      setTimeout(() => {
        enemyBulletArray.push(new LaserBullet({ position: warningPosition }));
      }, 2000);

      this.isReadyToShoot = false;
    }
  }
}


// Lớp LaserWarning để vẽ đường cảnh báo
class LaserWarning {
  constructor({ position }) {
    this.position = position;
    this.width = 50;
    this.height = canvas.height;
    this.isWarning = true; // Thêm thuộc tính để nhận biết đây là cảnh báo
  }

  draw() {
    c.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(this.position.x, this.position.y);
    c.lineTo(this.position.x, this.position.y + this.height);
    c.stroke();
  }

  update() {
    this.draw();
  }
}


// Lớp LaserBullet để vẽ và cập nhật đạn laser
class LaserBullet {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: 8 };
    this.width = 50;
    this.height = canvas.height;
    this.isWarning = false; // Thêm thuộc tính để nhận biết đây là đạn thật
  }

  draw() {
    let gradient = c.createRadialGradient(
      this.position.x + this.width / 2, this.position.y, 100,
      this.position.x + this.width / 2, this.position.y, this.width / 2000
    );
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

    c.fillStyle = gradient;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
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
  c.fillRect(healthBarX +20, healthBarY, healthBarWidth * (player.hp / 500), healthBarHeight); // Vẽ thanh máu với chiều dài thích hợp dựa trên HP của người chơi
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
  if (!paused && !gameOverFlag && !animationRunning) {
    frames++;
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.clearRect(0, 0, canvas.width, canvas.height); // Xóa màn hình để vẽ lại
    player.update();

    Explosions.forEach(explosion => {
      explosion.update();
    });

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
        if (frames % (100 / 1.5) === 0) {
          enemy.spawnEnemyBullet(enemyBullets);
        }

        // Kiểm tra va chạm giữa đạn của kẻ địch và người chơi
        enemyBullets.forEach((enemyBullet, k) => {
          if (enemyBullet.isWarning) {
            return; // Bỏ qua các đối tượng cảnh báo
          }

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
            });

            // Kiểm tra xem enemy có phải là Boss_Last không
            if (enemy instanceof Boss_Last) {
              // Nếu là Boss_Last, giảm máu và kiểm tra xem nó có còn sống không
              enemy.decreaseHP(0.05); // Giảm 0.05 HP cho mỗi viên đạn
              if (enemy.hp <= 0) {
                bossLastDestroyed = true;
                grid.enemies.splice(i, 1);
                score += 10;
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

        // Chỉ hiển thị pháo hoa và thông báo khi bossLastDestroyed đã thực sự biến mất
        if (bossLastDestroyed && grid.enemies.length === 0) {
          showFireworks();
          setTimeout(() => {
            ThongBaoEndGame();
            gameOverFlag = true; // Đặt cờ gameOverFlag để ngăn chặn các hoạt động tiếp theo
          }, 10); // Lập lịch hiển thị thông báo sau một giây
        }
      });
    });

    // Vẽ tất cả các item có trong mảng items
    items.forEach(item => {
      item.update();
    });

    // HIển thị điểm trên màn hình
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
      if (!shootingKeyDown) {
        playerShoot();
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

        shootingKeyDown = true;
      }
    } else {
      clearInterval(shootingInterval);
      shootingKeyDown = false;
    }
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
  if (score >= 200 && !level2Flag) { // Thêm điều kiện !level2Flag để đảm bảo chỉ hiển thị overlay một lần
    level2Flag = true; // Đánh dấu rằng đã hiển thị overlay màn 2
    ThongBaoNextLevel2();
  }
   // Kiểm tra điều kiện qua màn 2
   if (score >= 500 && level2Flag && !level3Flag) {
    level3Flag = true;
    ThongBaoNextLevel3();
  }

}

function ThongBaoNextLevel3() {
  const overlay3 = document.getElementById('overlay2');
  overlay3.style.display = 'flex'; // Hiển thị overlay
  stopShootingSound();
  playSound('sound8');
  
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
  playSound('sound8');

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
      window.location.href = "http://127.0.0.1:5500/TEST_GAME/Menu_Game/index.html";
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
  // score = 0; // Đặt lại điểm số
  
}

function restart() {
   // Đặt lại tất cả các biến và mảng đối tượng của game
  // Xóa toàn bộ các kẻ thù, đạn, v.v.
  grids.length = 0;
  Bullets.length = 0;
  enemyBullets.length = 0;
  Explosions.length = 0;
  // score = 0; // Đặt lại điểm số
  animate()
  console.log("Game restarted");
  window.location.href = 'http://127.0.0.1:5500/TEST_GAME/Menu_Game/index.html';
}




let spawnInterval;
function spawnEnemies() {
  // Tạo một kẻ thù mới và thêm vào mảng grids
  grids.push(new Grid());

  // Thiết lập một khoảng thời gian để tạo ra kẻ thù tiếp theo
  spawnInterval = setTimeout(spawnEnemies, 7000); // Tạo ra một kẻ thù mới mỗi 2 giây
}

// Bắt đầu tạo kẻ thù
spawnEnemies();

function startLevel2() {
  // Bắt đầu màn 2
  // Tạo một môi trường mới cho màn 2
  grids.length = 0; // Xóa các grid của màn trước
  const newGrid = new Grid(); // Tạo một grid mới
  for (let i = 0; i < 40; i++) {
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

  for (let i = 0; i < 15; i++) {
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
  bossEnemy2.hp = 5; // Đặt số lần trúng đạn cần để boss chết
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
      window.location.href = 'http://127.0.0.1:5500/TEST_GAME/Menu_Game/index.html';
  }
});



let spaceKeyDown = false; // Biến cờ để kiểm tra xem phím Space đã được nhấn hay chưa
let spaceCooldown = false; // Biến cờ để kiểm tra xem có đang trong thời gian chờ không
const spaceCooldownTime = 200; // Thời gian chờ giữa các lần bắn (milliseconds)

addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      player.velocity.x = -7;
      keys.a.pressed = true
      keys.ArrowLeft.pressed = true
      break;
    case 'd':
    case 'ArrowRight':
      player.velocity.x = 7;
      keys.d.pressed = true
      keys.ArrowRight.pressed = true
      break;
    case ' ':
      if (!spaceKeyDown && !spaceCooldown) { // Chỉ bắn nếu chưa nhấn phím Space và không đang trong thời gian chờ
        spaceKeyDown = true;
        spaceCooldown = true; // Bắt đầu thời gian chờ
        setTimeout(() => {
          spaceCooldown = false; // Sau khi thời gian chờ kết thúc, cho phép bắn tiếp theo
        }, spaceCooldownTime);
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
        );
      }
      break;
  }
});

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      player.velocity.x = -7;
      keys.a.pressed = false;
      keys.ArrowLeft.pressed = false;
      break;
    case 'd':
    case 'ArrowRight':
      player.velocity.x = 7;
      keys.d.pressed = false
      keys.ArrowRight.pressed = false
      break;
    case ' ':
      spaceKeyDown = false; // Đặt biến cờ về false khi người chơi thả phím Space
      break;
  }
});

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
  sound8: 'Audio_Game/start.mp3',
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


 // Hàm để hiển thị pháo hoa chúc mừng
 function showFireworks() {
  confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
  });
  setTimeout(showFireworks, 4000);
}