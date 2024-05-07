// import { canvas, c, Player, Bullet, Explosion,  EnemyBullet, Enemy, Grid } from './app.js';

// let player = new Player(); // Tạo một thực thể mới của lớp Player
// let Bullets = []; // Mảng để lưu trữ các đạn
// let Explosions = []; // Mảng để lưu trữ các vụ nổ
// let enemyBullets = []; // Mảng để lưu trữ các đạn của kẻ thù
// let enemies = []; // Mảng để lưu trữ các kẻ thù
// let grids = [new Grid()]; // Mảng để lưu trữ các lưới

// let score = 0; // Điểm số ban đầu
// let enemySpawnRate = 100; // Tốc độ sinh kẻ thù ban đầu

// function checkScoreAndAdvanceLevel() {
//   if (score >= 100) {
//     alert('Congratulations! You have reached 3000 points and advanced to level 2!');
//     enemySpawnRate = 50; // Giảm thời gian giữa các lần sinh kẻ thù
//   }
// }

// function animate() {
//     if (gameOverFlag) return;

//     frames++;
//     requestAnimationFrame(animate);
//     c.fillStyle = 'black';
//     c.clearRect(0, 0, canvas.width, canvas.height); // Xóa màn hình để vẽ lại
//     player.update();
  
//     Explosions.forEach(explosion => {
//       explosion.update()
//     })
//     // Cập nhật đạn của người chơi
//     Bullets.forEach((bullet, index) => {
//       if (bullet.position.y + bullet.radius <= 0) {
//         setTimeout(() => {
//           Bullets.splice(index, 1);
//         }, 0);
//       } else {
//         bullet.update();
//       }
//     });
  
//     grids.forEach((grid) => {
//       grid.update();
//       grid.enemies.forEach((enemy, i) => {
//         enemy.update({ velocity: grid.velocity });
  
//         // Tạo đạn từ kẻ thù sau mỗi 100 khung hình
//         if (frames % 1000 === 0) {
//           enemy.spawnEnemyBullet(enemyBullets);
//         }
  
//         // Va chạm giữa đạn của người chơi và kẻ địch
//         Bullets.forEach((bullet, j) => {
//           if (
//             bullet.position.y - bullet.radius <= enemy.position.y + enemy.height &&
//             bullet.position.x + bullet.radius >= enemy.position.x &&
//             bullet.position.x - bullet.radius <= enemy.position.x + enemy.width
//           ) {
  
//             createExplosion({
//               object: enemy
//             })
  
  
//             setTimeout(() => {
//               grid.enemies.splice(i, 1);
//               Bullets.splice(j, 1);
//               score += 10;
//               // Hiển thị điểm số mới (nếu cần)
//               console.log("Score: ", score);
//             }, 0);
//           }
//           enemy.shoot(enemyBullets);
//         });
//       });
//     });
  
//     //HIển thị điểm trên màn hình
//     c.fillStyle = 'white'; // Màu của chữ
//     c.font = '30px Arial'; // Kích thước và kiểu chữ
//     c.fillText('Score: ' + score, 10, 50); // Vị trí của chữ trên màn hình
  
//     // Cập nhật đạn của kẻ địch (cần sửa đoạn này)
//     enemyBullets.forEach((enemyBullet) => {
//       enemyBullet.update();
//     });
  
//     if (keys.a.pressed && player.position.x >= 0) {
//       player.velocity.x = -7;
//       player.rotation = -0.15;
//     } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
//       player.velocity.x = 7;
//       player.rotation = 0.15;
//     } else {
//       player.velocity.x = 0;
//       player.rotation = 0;
//     }
  
//     if ((keys.a.pressed && keys.ArrowLeft.pressed) || (keys.d.pressed && keys.ArrowRight.pressed)) {
//       // Kiểm tra xem đã bắn đạn chưa, nếu chưa thì bắt đầu bắn
//       if (!shootingKeyDown) {
//         // Bắt đầu setInterval để tự động bắn đạn mỗi 0.2 giây
//         shootingInterval = setInterval(() => {
//           Bullets.push(
//             new Bullet({
//               position: {
//                 x: player.position.x + player.width / 2,
//                 y: player.position.y,
//               },
//               velocity: {
//                 x: 0,
//                 y: -15,
//               }
//             })
//           );
//         }, 200);
  
//         shootingKeyDown = true; // Đánh dấu rằng phím đã được giữ
//       }
//     } else {
//       // Nếu không giữ phím nữa, dừng bắn và đặt lại trạng thái
//       clearInterval(shootingInterval); // Dừng setInterval
//       shootingKeyDown = false; // Đánh dấu rằng phím không còn được giữ nữa
//     }
  
//     // Kiểm tra va chạm giữa đạn của kẻ địch và người chơi, nếu trò chơi chưa kết thúc
//     enemyBullets.forEach((enemyBullet, k) => {
//       if (
//         enemyBullet.position.y <= player.position.y + player.height &&
//         enemyBullet.position.y + enemyBullet.height >= player.position.y &&
//         enemyBullet.position.x + enemyBullet.width >= player.position.x &&
//         enemyBullet.position.x <= player.position.x + player.width
//       ) {
//         // Khi va chạm xảy ra, gọi hàm gameOver
//         gameOver();
//       }
//     });
  

//   checkScoreAndAdvanceLevel();
// }

// animate();
