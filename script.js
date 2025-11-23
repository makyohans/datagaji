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

    // --- ELEMEN CASBON & NAVIGASI (BARU/DIREVISI) ---
    const casbonContent = document.getElementById('casbonContent');   // Konten Casbon
    const casbonLink = document.getElementById('casbonLink');         // Link Casbon di sidebar
    const casbonForm = document.getElementById('casbonForm');
    const kirimCasbonButton = document.getElementById('kirimCasbonTelegram');
    
    // --- ELEMEN NAVIGASI HOME BARU ---
    const homeLink = document.getElementById('homeLink'); // Link HOME / DATA GAJI
    

    // --- ELEMEN MODAL & THEME ---
    const imageModal = document.getElementById('imageModal');
    const closeModalBtn = document.getElementById('closeImageModal');
    const modalImage = document.getElementById('modalImage');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    
// -------------------------------------------------------------------
// 1. FUNGSI NAVIGASI: PENGGANTIAN KONTEN (HOME/DATA GAJI vs CASBON)
// -------------------------------------------------------------------

    // Menampilkan Form HOME / DATA GAJI saat link 'HOME' diklik
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.style.width = '0'; // Tutup sidebar
            
            // Tampilkan Data Gaji, Sembunyikan Casbon
            if (casbonContent) casbonContent.style.display = 'none';
            if (dataGajiContent) dataGajiContent.style.display = 'block';
        });
    }
    
    // Menampilkan Form CASBON saat link 'CASBON' diklik
    if (casbonLink) {
        casbonLink.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.style.width = '0'; // Tutup sidebar
            
            // Sembunyikan Data Gaji, Tampilkan Casbon
            if (dataGajiContent) dataGajiContent.style.display = 'none';
            if (casbonContent) casbonContent.style.display = 'block';
        });
    }


// -------------------------------------------------------------------
// 2. FUNGSI DATA GAJI: MENGATUR TOMBOL PEMBAYARAN & TAMPILAN DINAMIS
// -------------------------------------------------------------------
    function updatePaymentDetails(selectedType) {
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

    btnBank.addEventListener('click', () => updatePaymentDetails('bank'));
    btnEwallet.addEventListener('click', () => updatePaymentDetails('ewallet'));
    updatePaymentDetails('bank'); // Inisialisasi awal


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
                kirimButton.textContent = 'KIRIM DATA KE TELEGRAM BOT';
            });
        });
    }


// -------------------------------------------------------------------
// 4. FUNGSI CASBON: KIRIM DATA KE TELEGRAM
// -------------------------------------------------------------------
    if (kirimCasbonButton) {
        kirimCasbonButton.addEventListener('click', function() {
            
            const data = new FormData(casbonForm);
            const namaFaya = data.get('casbon_nama_faya');
            const idFaya = data.get('casbon_id_faya');
            const jumlahCoin = data.get('jumlah_coin');
            
            // --- Validasi Data Casbon ---
            if (!namaFaya || !idFaya || !jumlahCoin) {
                alert('❌ Harap lengkapi Nama Faya, ID Faya, dan pilih Jumlah Koin Casbon.');
                return;
            }

            const jumlahCoinText = document.getElementById('jumlahCoin').options[document.getElementById('jumlahCoin').selectedIndex].text;

            let message = "<b>🚨 PENGAJUAN CASBON BARU TELAH MASUK</b>\n\n";
            message += "<b>--- DETAIL CASBON ---</b>\n";
            message += "Nama Faya: " + namaFaya + "\n";
            message += "ID Faya: " + idFaya + "\n";
            message += "Jumlah Koin Diajukan: <b>" + jumlahCoinText + "</b>\n";
            
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
                    alert('✅ Data Casbon Berhasil Di Kirim Ke Owner Faya CB');
                    casbonForm.reset();
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
// 5. FUNGSI SIDEBAR MENU (Hamburger dan Tutup)
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
// 6. FUNGSI MODE GELAP/TERANG (TOGGLE) + FIX ICON
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
});