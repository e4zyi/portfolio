// Dùng biến toàn cục để quản lý danh sách bài hát
let songs = [];
let currentSongIndex = 0;

// Khai báo các phần tử giao diện MỘT LẦN DUY NHẤT
const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const disk = document.getElementById('disk');
const cover = document.getElementById('cover');
const playIcon = playBtn.querySelector('i');

// 1. Hàm khởi tạo máy nghe nhạc
async function initPlayer() {
    try {
        const response = await fetch('playlist.json');
        const data = await response.json();
        songs = data.songs;

        if (songs.length > 0) {
            // Chọn ngẫu nhiên bài đầu tiên khi mới vào trang (thay cho hàm loadRandomSong cũ)
            currentSongIndex = Math.floor(Math.random() * songs.length);
            loadSong(currentSongIndex);
        }
    } catch (error) {
        console.error("Lỗi: Không thể tải danh sách nhạc từ playlist.json", error);
    }
}

// 2. Hàm cập nhật thông tin bài hát lên giao diện
function loadSong(index) {
    const song = songs[index];
    audio.src = song.audio;
    cover.src = song.cover;
    
    // Cập nhật tiêu đề console để kiểm tra
    console.log(`🎵 Đang phát: ${song.title} - ${song.artist}`);
    
    audio.load(); 
}

// 3. Xử lý sự kiện Play/Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        // Sử dụng .play() với Promise để tránh lỗi Autoplay của trình duyệt
        audio.play().then(() => {
            disk.classList.add('playing');
            playIcon.classList.replace('fa-play', 'fa-pause');
        }).catch(err => {
            console.warn("Nhạc chưa thể phát ngay do chính sách trình duyệt. Hãy tương tác với trang trước.");
        });
    } else {
        audio.pause();
        disk.classList.remove('playing');
        playIcon.classList.replace('fa-pause', 'fa-play');
    }
});

// 4. Nút chuyển bài tiếp theo
nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    // Tự động phát khi chuyển bài
    audio.play();
    disk.classList.add('playing');
    playIcon.classList.replace('fa-play', 'fa-pause');
});

// 5. Nút quay lại bài trước
prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    disk.classList.add('playing');
    playIcon.classList.replace('fa-play', 'fa-pause');
});

// 6. Tự động chuyển bài khi kết thúc bài hiện tại
audio.addEventListener('ended', () => {
    nextBtn.click();
});

// Chạy khởi tạo khi trang sẵn sàng
initPlayer();

// Giữ lại tính năng click tiêu đề của bạn cho vui
const title = document.querySelector('h1');
if (title) {
    title.addEventListener('click', () => alert("Chào Danh! Chúc bạn nghe nhạc vui vẻ."));
}

const enterBtn = document.getElementById('enter-btn');
const welcomeScreen = document.getElementById('welcome-screen');

enterBtn.addEventListener('click', () => {
    // 1. Ẩn màn hình chào
    welcomeScreen.classList.add('hidden');

    // 2. Phát nhạc ngay lập tức
    if (audio.paused) {
        audio.play().then(() => {
            disk.classList.add('playing');
            playIcon.classList.replace('fa-play', 'fa-pause');
        }).catch(err => console.log("Lỗi tự động phát:", err));
    }
});