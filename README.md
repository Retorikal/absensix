# absensix
Auto-absen untuk sistem informasi akademik ITB berupa plugin chrome.

Plugin ini dibuat untuk Chrome, tapi diketahui bisa bekerja pada Microsoft Edge. Prosedur instalasi mungkin berbeda.

# WARNING!
Plugin ini masih dalam tahap testing, sehingga reliabilitynya belum bisa dijamin.</br>
Beberapa masalah yang diketahui: </br>
1. Belum bisa mengabsen 2 hari nonstop

2. Login timeout

# Cara pakai
Setelah plugin terpasang, buka halaman jadwal kelas di SiX, lalu biarkan. Selama halaman terbuka, absensi akan berjalan secara otomatis.

# Instalasi untuk Google Chrome
1. Download (Ada 2 cara):<br/>
Cara 1: Download zip file proyek ini dari github: https://github.com/Retorikal/absensix/archive/master.zip, lalu extract<br/>
Cara 2: Clone git repository

2. Buka [chrome://extensions/](chrome://extensions/)

3. Nyalakan Developer Mode (switch di pojok kanan atas)</br>
![Devmode](images/devmode.png?raw=true "Devmode")

4. Klik "Load Unpacked"</br>
![Unpack](images/unpack.png?raw=true "Unpack")

5. Browse lalu klik folder "absensix" (didapatkan dari langkah pertama)

6. Pin icon extension ke taskbar. </br>
![Pin](images/pinning.png?raw=true "Pin")

7. Plugin sudah bisa dipakai. Bila ada pesan muncul saat masuk ke halaman jadwal kelas SiX, maka extension sudah termuat dengan benar.</br>
![Loaded](images/loaded.png?raw=true "Loaded")

# Konfigurasi
Ada 3 parameter yang bisa dikonfigurasi agar perilaku extension lebih cocok dengan pola absensi masing-masing. Konfigurasi ini dapat diakses melalui icon extension di sebelah kanan URL bar.</br>
![Popup](images/popup.png?raw=true "Popup")

1. Begin offset: waktu yang harus ditunggu plugin sebelum kuliah sebelum mulai mencoba mengabsen. Bisa bernilai negatif.

2. End offset: waktu yang harus ditunggu plugin setelah kuliah selesai sebelum menghentikan percobaan absen. Bisa bernilai negatif.

3. Retry interval: Jeda antara percobaan absensi

# Update
Bila ada update baru, perbarui isi folder absensix (dengan git pull atau download zip dan extract-overwrite), lalu klik tombol reload di sebelah switch untuk mengaktifkan plugin di [chrome://extensions/](chrome://extensions/).

# Development plan
1. Auto-relogin (masih belum bisa dipastikan mungkin tidaknya)

2. Support untuk firefox

3. Generate report log txt file