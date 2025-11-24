document.addEventListener('DOMContentLoaded', function() {

    // -------------------------------------------------------------------
    // --- KONFIGURASI TELEGRAM (WAJIB GANTI!) ---
    // -------------------------------------------------------------------
    // !!! GUNAKAN TOKEN BARU ANDA DARI @BotFather DI SINI !!!
    const BOT_TOKEN = '7143238986:AAF_EC0ULNq9zZlp6Y4tt2T9zXGeNj6rkXk'; 
    // !!! GANTI CHAT_ID DENGAN CHAT ID/GROUP ID ANDA !!!
    const CHAT_ID = '-1003186715045'; 

    // --- ELEMEN UMUM & DATA GAJI ---
    const form = document.getElementById('dataForm'); // Form Data Gaji
    const dataGajiContent = document.getElementById('dataGajiContent'); // Konten Data Gaji
    const sidebar = document.getElementById('sidebarMenu');
    const closeSidebar = document.getElementById('closeSidebar');
    const menuToggle = document.getElementById('menuToggle');
    const kirimButton = document.getElementById('kirimTelegram');
    const body = document.body;

    // --- ELEMEN DINAMIS FORM DATA GAJI ---
    const btnBank = document.getElementById('btnBank');
    const btnEwallet = document.getElementById('btnEwallet');
    const radioBank = document.getElementById('pilihBank');
    const radioEwallet = document.getElementById('pilihEwallet');
    const detailBank = document.getElementById('detailBank');
    const detailEwallet = document.getElementById('detailEwallet');

    // --- ELEMEN CASBON & NAVIGASI (DIREVISI) ---
    const casbonContent = document.getElementById('casbonContent');   // Konten Casbon
    const casbonLink = document.getElementById('casbonLink');         // Link Casbon di sidebar
    const casbonForm = document.getElementById('casbonForm');
    const kirimCasbonButton = document.getElementById('kirimCasbonTelegram');

    // --- BARU: ELEMEN KOIN CASBON (Tombol Pilihan) ---
    const coinOptionGroup = document.getElementById('coinOptionGroup');
    const jumlahCoinInput = document.getElementById('jumlahCoinInput');
    const jumlahRupiahInput = document.getElementById('jumlahRupiahInput'); 
    const selectedCoinDisplay = document.getElementById('selectedCoinDisplay'); 

    // --- ELEMEN NAVIGASI HOME BARU ---
    const homeLink = document.getElementById('homeLink'); // Link HOME / DATA GAJI

    // --- ELEMEN MODAL & THEME ---
    const imageModal = document.getElementById('imageModal');
    const closeModalBtn = document.getElementById('closeImageModal');
    const modalImage = document.getElementById('modalImage');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // --- BARU: ELEMEN NAVIGASI BAWAH ---
    const navHomeBottom = document.getElementById('navHomeBottom');
    const navCasbonBottom = document.getElementById('navCasbonBottom');
    const allNavItems = document.querySelectorAll('.bottom-navbar .nav-item'); // Semua item di navbar bawah


// -------------------------------------------------------------------
// 1. FUNGSI NAVIGASI: PENGGANTIAN KONTEN (HOME/DATA GAJI vs CASBON)
// -------------------------------------------------------------------

    function showContent(contentType) {
        if (contentType === 'home') {
            if (casbonContent) casbonContent.style.display = 'none';
            if (dataGajiContent) dataGajiContent.style.display = 'block';
            setActiveNav(navHomeBottom);
        } else if (contentType === 'casbon') {
            if (dataGajiContent) dataGajiContent.style.display = 'none';
            if (casbonContent) casbonContent.style.display = 'block';
            setActiveNav(navCasbonBottom);
        }
    }

    function setActiveNav(activeElement) {
        allNavItems.forEach(item => {
            item.classList.remove('active');
        });
        if (activeElement) {
            activeElement.classList.add('active');
        }
    }

    // Event listener Sidebar (TETAP)
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.style.width = '0'; // Tutup sidebar
            showContent('home');
        });
    }

    if (casbonLink) {
        casbonLink.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.style.width = '0'; // Tutup sidebar
            showContent('casbon');
        });
    }

    // Event listener Navbar Bawah (BARU)
    if (navHomeBottom) {
        navHomeBottom.addEventListener('click', function(e) {
            e.preventDefault();
            showContent('home');
        });
    }
    
    if (navCasbonBottom) {
        navCasbonBottom.addEventListener('click', function(e) {
            e.preventDefault();
            showContent('casbon');
        });
    }


// -------------------------------------------------------------------
// 2. FUNGSI DATA GAJI: MENGATUR TOMBOL PEMBAYARAN & TAMPILAN DINAMIS
// -------------------------------------------------------------------
    function updatePaymentDetails(selectedType) {
        // Hanya jalankan jika elemen ada (untuk menghindari error saat beralih ke Casbon)
        if (btnBank && btnEwallet && detailBank && detailEwallet) {
            btnBank.classList.remove('active');
            btnEwallet.classList.remove('active');
            detailBank.style.display = 'none';
            detailEwallet.style.display = 'none';

            if (selectedType === 'bank') {
                btnBank.classList.add('active');
                radioBank.checked = true;
                detailBank.style.display = 'block';
            } else {
                btnEwallet.classList.add('active');
                radioEwallet.checked = true;
                detailEwallet.style.display = 'block';
            }
        }
    }

    // Hanya tambahkan event listener jika elemen ada
    if (btnBank && btnEwallet) {
        btnBank.addEventListener('click', () => updatePaymentDetails('bank'));
        btnEwallet.addEventListener('click', () => updatePaymentDetails('ewallet'));
        // updatePaymentDetails('bank'); // Inisialisasi awal dipindahkan ke bagian bawah (seksi 8)
    }


// -------------------------------------------------------------------
// 3. FUNGSI DATA GAJI: KIRIM DATA KE TELEGRAM
// -------------------------------------------------------------------
    if (kirimButton) {
        kirimButton.addEventListener('click', function() {
            
            // --- VALIDASI DATA WAJIB ---
            const data = new FormData(form);
            const idFaya = data.get('id_faya');
            const namaFaya = data.get('nama_faya');
            const nomorHp = data.get('nomor_hp');
            const namaPemilik = data.get('nama_pemilik');
            
            if (!idFaya || !namaFaya || !nomorHp || !namaPemilik) {
                alert('❌ Harap isi semua field Informasi Akun dan Nama Pemilik Rekening.');
                return; 
            }

            const jenisPembayaran = data.get('jenis_pembayaran');
            let message = "<b>🚨 DATA MEMBER BARU TELAH MASUK</b>\n\n";
            
            // --- Pengumpulan Pesan ---
            message += "<b>--- INFORMASI AKUN ---</b>\n";
            message += "ID Faya: " + idFaya + "\n";
            message += "Nama Faya: " + namaFaya + "\n";
            message += "Nomor HP/WA: " + nomorHp + "\n\n";
            message += "<b>--- INFORMASI PEMBAYARAN ---</b>\n";
            message += "Nama Pemilik: " + namaPemilik + "\n";
            message += "Jenis Pembayaran: <b>" + jenisPembayaran.toUpperCase() + "</b>\n";

            // --- VALIDASI & PENGUMPULAN DATA PEMBAYARAN ---
            if (jenisPembayaran === 'bank') {
                const namaBank = data.get('nama_bank');
                const nomorRekening = data.get('nomor_rekening');
                if (!namaBank || !nomorRekening) {
                    alert('❌ Harap pilih Nama Bank dan isi Nomor Rekening.');
                    return; 
                }
                const namaBankText = document.getElementById('namaBank').options[document.getElementById('namaBank').selectedIndex].text;
                message += "Nama Bank: " + namaBankText + "\n";
                message += "Nomor Rekening: " + nomorRekening + "\n";
            } else if (jenisPembayaran === 'ewallet') {
                const namaEwallet = data.get('nama_ewallet');
                const nomorEwallet = data.get('nomor_ewallet');
                if (!namaEwallet || !nomorEwallet) {
                    alert('❌ Harap pilih Nama E-Wallet dan isi Nomor E-Wallet.');
                    return; 
                }
                const namaEwalletText = document.getElementById('namaEwallet').options[document.getElementById('namaEwallet').selectedIndex].text;
                message += "Nama E-Wallet: " + namaEwalletText + "\n";
                message += "Nomor E-Wallet: " + nomorEwallet + "\n";
            }

            // Matikan tombol saat mengirim
            kirimButton.disabled = true;
            kirimButton.textContent = 'MENGIRIM...';

            // Fetch API ke Telegram
            const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            fetch(telegramURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            })
            .then(response => {
                if (response.ok) {
                    alert('✅ Data Kamu Berhasil Di Kirim Ke owner Faya Star!');
                    form.reset();
                    updatePaymentDetails('bank'); // Reset form ke tampilan bank
                } else {
                    response.json().then(data => {
                        console.error('Telegram API Error:', data);
                        alert(`❌ Gagal mengirim data. Dikarnakan Api pos Sedang Bermasalah\nError: ${data.description}`);
                    });
                }
            })
            .catch(error => {
                alert('❌ Terjadi kesalahan jaringan: ' + error.message);
            })
            .finally(() => {
                // Aktifkan kembali tombol
                kirimButton.disabled = false;
                kirimButton.textContent = 'KIRIM DATA KE OWNER FAYA';
            });
        });
    }


// -------------------------------------------------------------------
// 4. FUNGSI CASBON: KIRIM DATA KE TELEGRAM (SUDAH DIREVISI)
// -------------------------------------------------------------------
    if (kirimCasbonButton) {
        kirimCasbonButton.addEventListener('click', function() {
            
            const data = new FormData(casbonForm);
            const namaFaya = data.get('casbon_nama_faya');
            const idFaya = data.get('casbon_id_faya');
            
            // Ambil dari input tersembunyi baru
            const jumlahCoin = data.get('jumlah_coin'); 
            const jumlahRupiah = data.get('jumlah_rupiah'); 
            
            // --- Validasi Data Casbon ---
            if (!namaFaya || !idFaya || !jumlahCoin || !jumlahRupiah) {
                alert('❌ Harap lengkapi Nama Faya, ID Faya, dan pilih Jumlah Koin Casbon (tombol pilihan).');
                return;
            }

            // Format angka untuk tampilan di Telegram
            // .toLocaleString('id-ID') digunakan untuk menambahkan pemisah ribuan
            const formattedCoin = Number(jumlahCoin).toLocaleString('id-ID');
            const formattedRupiah = Number(jumlahRupiah).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

            let message = "<b>🚨 PENGAJUAN CASBON BARU TELAH MASUK</b>\n\n";
            message += "<b>--- DETAIL CASBON ---</b>\n";
            message += "Nama Faya: " + namaFaya + "\n";
            message += "ID Faya: " + idFaya + "\n";
            message += "Koin Diajukan: <b>" + formattedCoin + " Koin</b>\n";
            message += "Nilai Rupiah: <b>" + formattedRupiah + "</b>\n";
            
            // Matikan tombol saat mengirim
            kirimCasbonButton.disabled = true;
            kirimCasbonButton.textContent = 'MENGIRIM PENGAJUAN...';

            // Fetch API ke Telegram
            const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            fetch(telegramURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            })
            .then(response => {
                if (response.ok) {
                    alert('✅ Pengajuan Casbon Berhasil Di Kirim!');
                    casbonForm.reset();
                    // Reset tampilan tombol
                    document.querySelectorAll('.coin-button.active').forEach(btn => btn.classList.remove('active'));
                    selectedCoinDisplay.textContent = '**Tidak Ada**'; // Reset tampilan pilihan
                } else {
                    response.json().then(data => {
                        console.error('Telegram API Error:', data);
                        alert(`❌ Gagal mengirim Casbon. Error: ${data.description}`);
                    });
                }
            })
            .catch(error => {
                alert('❌ Terjadi kesalahan jaringan saat mengirim Casbon: ' + error.message);
            })
            .finally(() => {
                // Aktifkan kembali tombol
                kirimCasbonButton.disabled = false;
                kirimCasbonButton.textContent = 'AJUKAN CASBON SEKARANG';
            });
        });
    }

// -------------------------------------------------------------------
// 5. FUNGSI CASBON: MENGATUR TOMBOL PILIHAN KOIN (BARU)
// -------------------------------------------------------------------

if (coinOptionGroup) {
    const coinButtons = coinOptionGroup.querySelectorAll('.coin-button');

    coinButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas 'active' dari semua tombol
            coinButtons.forEach(btn => btn.classList.remove('active'));
            
            // Tambahkan kelas 'active' ke tombol yang diklik
            this.classList.add('active');

            const coinElement = this.querySelector('.coin-value');
            const rupiahElement = this.querySelector('.rupiah-value');

            const selectedCoin = this.getAttribute('data-coin');
            const selectedRupiah = this.getAttribute('data-rupiah');
            
            // Mengambil teks yang diformat dengan dua baris dari elemen .coin-content
            const displayText = `${coinElement.textContent} (${rupiahElement.textContent})`;

            // Set nilai ke input tersembunyi
            jumlahCoinInput.value = selectedCoin;
            jumlahRupiahInput.value = selectedRupiah;
            
            // Tampilkan pilihan
            selectedCoinDisplay.innerHTML = `<span>${displayText}</span>`;
        });
    });
}


// -------------------------------------------------------------------
// 6. FUNGSI SIDEBAR MENU (Hamburger dan Tutup)
// -------------------------------------------------------------------
    menuToggle.addEventListener('click', function() {
        sidebar.style.width = '250px';
    });

    closeSidebar.addEventListener('click', function(e) {
        e.preventDefault();
        sidebar.style.width = '0';
    });
    
    // Tutup sidebar saat klik link internal
    sidebar.querySelectorAll('a').forEach(link => {
        if (link.id !== 'closeSidebar' && link.href.includes('#')) {
            link.addEventListener('click', () => {
                sidebar.style.width = '0';
            });
        }
    });

    // ... (Bagian Modal Gambar dihilangkan untuk menjaga fokus) ...


// -------------------------------------------------------------------
// 7. FUNGSI MODE GELAP/TERANG (TOGGLE) + FIX ICON
// -------------------------------------------------------------------
    function toggleDarkMode() {
        const isDarkMode = body.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            themeIcon.classList.replace('fa-sun', 'fa-moon'); // Ganti ke ikon bulan
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun'); // Ganti ke ikon matahari
            localStorage.setItem('theme', 'light');
        }
    }
    
    themeToggle.addEventListener('click', toggleDarkMode);

    // Cek preferensi tema saat halaman dimuat
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon'); // Terapkan ikon bulan
    } else {
        body.classList.remove('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun'); // Terapkan ikon matahari
    }

// -------------------------------------------------------------------
// 8. INISIALISASI AWAL (Pastikan konten dan nav aktif sudah benar) - BARU
// -------------------------------------------------------------------

    // 1. Tampilkan konten HOME/DATA GAJI secara default
    if (dataGajiContent) {
        dataGajiContent.style.display = 'block';
    }
    if (casbonContent) {
        casbonContent.style.display = 'none';
    }

    // 2. Set navigasi bawah 'Home' sebagai aktif
    setActiveNav(navHomeBottom);

    // 3. Set detail pembayaran default (Bank)
    if (btnBank && btnEwallet) {
        updatePaymentDetails('bank');
    }

});