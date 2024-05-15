// Định nghĩa các tệp âm thanh
const audioFiles = {
    sound1: 'backgroundMusic.wav'
    // Thêm các tệp âm thanh khác tại đây
};

document.addEventListener("DOMContentLoaded", function() {
    playSound('sound1');

    // Lắng nghe sự kiện click vào nút "New-Game"
    document.getElementById("New-Game").addEventListener("click", function(event) {
        // Ngăn chặn hành vi mặc định của thẻ a (chuyển hướng trang)
        event.preventDefault();
        // Chuyển hướng trang đến trang game chính
        window.location.href = "http://127.0.0.1:5500/TEST_GAME/spaceshooter.html";
    });

    // Lắng nghe sự kiện click trên nút Exit-Game
    document.getElementById("Exit-Game").addEventListener("click", function(event){
        // Ngăn chặn hành vi mặc định của thẻ a
        event.preventDefault();
        // Đặt cửa sổ hiện tại sang trạng thái không có nội dung
       window.close();
    });

    // Hàm để phát âm thanh
    function playSound(soundKey) {
        const audio = new Audio(audioFiles[soundKey]);
        audio.play();
    }
});
