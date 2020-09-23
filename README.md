# absensix
Auto-absen untuk sistem informasi akademik ITB berupa plugin chrome.

# WARNING!
Plugin ini masih dalam tahap testing, sehingga reliabilitynya belum bisa dijamin.</br>
Beberapa masalah yang diketahui: </br>
1. Belum bisa mengabsen 2 hari nonstop

2. Login timeout

3. Konfigurasi di popup belum fungsional

# Instalasi
1. Download (Ada 2 cara):<br/>
Cara 1: Download zip file proyek ini dari github: https://github.com/Retorikal/absensix/archive/master.zip, lalu extract<br/>
Cara 2: Clone git repository

2. Buka [chrome://extensions/](chrome://extensions/)

3. Nyalakan Developer Mode (switch di pojok kanan atas)

4. Klik "Load Unpacked"

5. Browse lalu klik folder "absensix" (didapatkan dari langkah pertama)

6. Plugin sudah bisa dipakai. Bila ada pesan muncul saat masuk ke halaman jadwal kelas SiX, maka extension sudah termuat dengan benar.

# Cara pakai

Setelah plugin terpasang, buka halaman jadwal kelas di SiX, lalu biarkan. Selama halaman terbuka, absensi akan berjalan secara otomatis.

# Update

Bila ada update baru, perbarui isi folder absensix (dengan git pull atau download zip dan extract-overwrite), lalu klik tombol reload di sebelah switch untuk mengaktifkan plugin di [chrome://extensions/](chrome://extensions/)

# Development plan

1. Auto-relogin (masih belum bisa dipastikan mungkin tidaknya)

2. Support untuk firefox