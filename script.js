// ====================================
// Perintah ini memberi tahu browser untuk selalu memuat halaman dari atas.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0); 
window.onload = function() {
    window.scrollTo(0, 0); 
}

// ====================================
// DATA DUMMY & VARIABEL GLOBAL
// ====================================
const eventDate = new Date("Nov 22, 2025 18:00:00").getTime(); 
let countdownInterval;
let slideIndex = 1;


// ====================================
// FUNGSI UTAMA: MODAL KUSTOM (Pengganti alert())
// ====================================
function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('custom-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('custom-modal').style.display = 'none';
}

// ====================================
// FUNGSI 1: PERSONILASASI NAMA TAMU DARI URL
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    // Mencari parameter '?to=' di URL
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('to');

    if (guestName) {
        // 1. Ganti underscore (_) dengan spasi
        guestName = guestName.replace(/_/g, ' '); 
        // 2. Format menjadi Title Case (Huruf besar di awal kata)
        guestName = guestName.toLowerCase().split(' ').map((word) => {
            // Menghindari error jika ada spasi berlebihan
            if (word.length === 0) return word; 
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');

        // 3. Tampilkan di cover
        document.getElementById('guest-name').textContent = guestName;
        document.title = `Sweet Seventeen - Ayla & ${guestName}`; 
    } else {
        // Nilai default jika tidak ada parameter 'to'
        document.getElementById('guest-name').textContent = "Tamu Undangan";
    }
});

// ====================================
// FUNGSI 2: BUKA UNDANGAN & PUTAR MUSIK
// ====================================
function openInvitation() {
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    
    // 1. Transisi Halaman (Fade Out Cover)
    coverPage.style.opacity = '0';
    coverPage.style.pointerEvents = 'none';

    // 2. Tampilkan Konten Utama (Fade In)
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.pointerEvents = 'auto';
        coverPage.style.display = 'none'; 
        
        // Mulai semua fungsi dinamis
        startCountdown();
        showSlides(slideIndex);
        autoSlide();
        setupScrollAnimation();
        
        // 3. Putar Musik Latar (DUMMY: Buat elemen Audio)
        // GANTI DENGAN URL MUSIK ASLI JIKA ADA
        const audio = new Audio('music/ocean-bloom-connect.mp3'); 
        audio.loop = true;
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Autoplay diblokir:", e));

    }, 800); 
}

// ====================================
// FUNGSI 3: COUNTDOWN TIMER
// ====================================
function startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "<h3>ACARA SEDANG BERLANGSUNG!</h3>";
        } else {
            countdownElement.innerHTML = `
                <div class="countdown-box"><span>${days.toString().padStart(2, '0')}</span><small>Hari</small></div>
                <div class="countdown-box"><span>${hours.toString().padStart(2, '0')}</span><small>Jam</small></div>
                <div class="countdown-box"><span>${minutes.toString().padStart(2, '0')}</span><small>Menit</small></div>
                <div class="countdown-box"><span>${seconds.toString().padStart(2, '0')}</span><small>Detik</small></div>
            `;
        }
    }, 1000);
}

// ====================================
// FUNGSI 4: ANIMASI SCROLL REVEAL
// ====================================
function setupScrollAnimation() {
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .reveal-element').forEach(el => {
        observer.observe(el);
    });
}


// ====================================
// FUNGSI 5: SLIDESHOW GALLERY (Versi Smooth & Aman)
// ====================================

// CATATAN: Pastikan 'let slideIndex = 1;' sudah ada di Global Vars.
let autoSlideTimeout; // Tambahkan ini di bagian Global Vars jika belum ada

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    if (slides.length === 0) return;

    // Menyesuaikan indeks
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    // Reset: Hapus kelas 'active-slide' (fade out)
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active-slide"); 
    }
    // Reset Dot
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    // Tampilkan: Tambahkan kelas 'active-slide' (fade in)
    slides[slideIndex - 1].classList.add("active-slide"); 
    dots[slideIndex - 1].classList.add("active");
}


function currentSlide(n) {
    // Dipanggil dari dot di HTML
    clearTimeout(autoSlideTimeout); // Hentikan auto-slide saat manual
    slideIndex = n;
    showSlides(slideIndex);
    // Restart auto-slide
    autoSlideTimeout = setTimeout(autoSlide, 4000); 
}

function autoSlide() {
    let slides = document.getElementsByClassName("mySlides");
    
    if (slides.length === 0) return;

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    
    showSlides(slideIndex);
    
    // Set timeout berikutnya
    autoSlideTimeout = setTimeout(autoSlide, 4000); 
}

// Catatan: Pastikan di FUNGSI 2: BUKA UNDANGAN, Anda memanggil:
/*
    slideIndex = 1; 
    showSlides(slideIndex);
    autoSlide();
*/


// ====================================
// FUNGSI 6: FORM SUBMISSION (RSVP & GUESTBOOK)
// ====================================

// RSVP - Dijalankan saat tombol "Kirim RSVP" ditekan
function handleRsvpSubmit(event) {
    // Mencegah navigasi ke halaman Google Form
    event.preventDefault(); 
    
    // Mengambil form
    const form = event.target;
    
    // 1. Melakukan Submission ke Google Form di background
    // Karena form memiliki target="_blank", browser akan membuka tab baru 
    // yang langsung menutup (sesuai setting google form).
    // Cara paling efektif untuk memastikan data terkirim sebelum reset adalah 
    // menggunakan fetch, tapi untuk kemudahan, kita akan biarkan form submit 
    // secara default ke tab baru, lalu me-reset-nya setelah itu.
    form.submit();
    
    // 2. Menampilkan pesan sukses menggunakan modal kustom
    showModal('Konfirmasi RSVP Anda berhasil dikirim! Terima kasih atas informasinya.');
    
    // 3. MERESET FORM SETELAH SUBMIT
    form.reset(); 
}

function handleGuestbookSubmit(event) {
    // Mencegah navigasi ke halaman Google Form
    event.preventDefault(); 
    
    // Mengambil form
    const form = event.target;

    // 1. Melakukan Submission ke Google Form di background
    form.submit();
    
    // 2. Menampilkan pesan sukses menggunakan modal kustom
    showModal('Ucapan Selamat Anda berhasil dikirim! Terima kasih banyak.');
    
    // 3. MERESET FORM SETELAH SUBMIT
    form.reset(); 
}

// Menambahkan listener untuk Guestbook Form (untuk memastikan reset juga berfungsi)
document.getElementById('guestbook-form').addEventListener('submit', handleGuestbookSubmit);

// Catatan: Listener untuk RSVP sudah ada di HTML: onsubmit="handleRsvpSubmit(event)"