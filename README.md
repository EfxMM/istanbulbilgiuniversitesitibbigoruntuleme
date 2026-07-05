# 🦴 İskelet ve Omurga Anatomisi 3D Görselleştirici

Bu proje, insan iskelet ve omurga sistemini 3D olarak incelemeye, kemiklerin anatomik fonksiyonlarını öğrenmeye ve yaygın olarak görülen klinik patolojileri (fıtıklar, kırıklar, dejenerasyonlar vb.) keşfetmeye olanak tanıyan, modern web teknolojileri ile geliştirilmiş interaktif bir eğitim uygulamasıdır.

---

## 🚀 Öne Çıkan Özellikler

*   **Etkileşimli 3D Model İnceleme:** `@react-three/fiber` ve `@react-three/drei` altyapısı sayesinde, 3D iskelet modelini fare veya dokunmatik ekran hareketleriyle döndürebilir, yakınlaştırabilir ve kaydırabilirsiniz.
*   **Bölgesel ve Kemik Bazlı Detaylandırma:** Model üzerindeki kemiklere tıklayarak o kemiğe ait anatomik fonksiyonları ve sık görülen klinik patolojileri anında görüntüleyebilirsiniz.
*   **Dinamik Arama & Filtreleme:** Arama kutusu aracılığıyla istediğiniz kemiği arayabilir, kategorize edilmiş sol menü üzerinden ilgili bölgeye (Kafa ve Yüz, Omurga, Göğüs Kafesi vb.) hızlıca odaklanabilirsiniz.
*   **Akıllı Kamera Yönlendirici (Smooth Zoom):** Anterior (Ön), Posterior (Arka), Sol ve Sağ kamera açıları arasında yumuşak geçişler yapabilir; seçilen kemiğe otomatik odaklanan pürüzsüz kamera animasyonlarından yararlanabilirsiniz.
*   **3D Sahne İçi Rozetler (Annotations):** Seçilen bölgedeki kemiklerin üzerine dinamik 3D rozetler yerleştirilir. Bu rozetler sayesinde sahne içinde kaybolmadan doğrudan kemik detaylarına erişebilirsiniz.
*   **Gelişmiş Görsel Efektler:** Bloom ve postprocessing efektleri ile seçilen kemik veya bölgeler neon ışıma efektleriyle vurgulanarak yüksek kaliteli ve modern bir kullanıcı deneyimi sunulur.
*   **Duyarlı Tasarım (Responsive Design):** Hem masaüstü hem de mobil cihazlar için optimize edilmiş arayüz.

---

## 🛠️ Kullanılan Teknolojiler

Proje, güncel ve yüksek performanslı modern web teknolojileri üzerine inşa edilmiştir:

| Teknoloji | Açıklama |
| :--- | :--- |
| **React 19** | Bileşen tabanlı modern arayüz yönetimi |
| **Vite 8** | Yüksek hızlı derleme ve geliştirme sunucusu |
| **Three.js** | Tarayıcı üzerinde 3D grafik oluşturma kütüphanesi |
| **@react-three/fiber** | Three.js için modern React sarmalayıcısı (R3F) |
| **@react-three/drei** | R3F için hazır yardımcılar (OrbitControls, Html, Environment, ContactShadows) |
| **@react-three/postprocessing** | Bloom, parlama ve derinlik gibi sinematik efektler için |
| **Lucide React** | Modern ve şık vektörel arayüz ikonları |
| **Vanilla CSS (Modern)** | Cam efekti (Glassmorphism), pürüzsüz animasyonlar ve özel CSS değişkenleri ile arayüz tasarımı |

---

## 📂 Proje Klasör Yapısı

```bash
omurga-anatomisi/
├── public/                 # Statik dosyalar
│   └── fullpaket.glb       # 3D İskelet GLTF model dosyası
├── src/
│   ├── assets/             # Görsel ve statik varlıklar
│   ├── data.js             # Tüm anatomik fonksiyon ve patoloji veritabanı (Türkçe)
│   ├── SpineModel.jsx      # 3D model yükleyici, mesh eşleştirici ve kamera mantığı
│   ├── App.jsx             # Ana arayüz, arama ve yan panel bileşenleri
│   ├── App.css             # Uygulamaya özel ek stiller
│   ├── index.css           # Ana tasarım sistemi, cam efekti ve animasyon stilleri
│   └── main.jsx            # Giriş noktası
├── index.html              # HTML şablonu ve Sketchfab API bağlantısı
├── package.json            # Bağımlılıklar ve npm betikleri
└── vite.config.js          # Vite yapılandırması
```

---

## 🩺 Veri Yapısı (`src/data.js`)

Uygulamanın tıbbi veri tabanı tamamen Türkçe olarak tasarlanmış olup şu bölümleri kapsar:

1.  **Kafa ve Yüz:** Alt çene kemiği (Mandibula), üst ve alt dişler.
2.  **Omurga Bölgesi:**
    *   **Servikal (C1-C7):** Atlas (C1), Aksis (C2) ve diğer boyun omurları. Odontoid kırıkları, fıtıklar ve miyelopati detayları.
    *   **Torakal (T1-T12):** Sırt omurları. Skolyoz, Kifoz ve Scheuermann (Gençlik Kamburluğu) hastalıkları.
    *   **Lomber (L1-L5):** Bel omurları. Bel fıtıkları (L4-L5, L5-S1), Burst (Patlama) kırıkları ve kanal daralmaları.
    *   **İntervertebral Diskler:** Omurlar arası disk patolojileri ve aşınmalar.
3.  **Göğüs Kafesi:** Sternum, Kaburgalar (1-10) ve Yüzen Kaburgalar (11-12).
4.  **Üst Ekstremite (Kollar):** Köprücük kemiği (Klavikula), Kürek kemiği (Scapula), Humerus, Radius, Ulna, el bilek/tarak/parmak kemikleri. Karpal Tünel Sendromu ve Boksör kırığı gibi sık karşılaşılan durumlar.
5.  **Pelvis ve Alt Ekstremite (Bacaklar):** Leğen kemiği (Pelvis), Sakrum, Kuyruk sokumu (Koksiks), Femur, Patella, Tibia, Fibula ve ayak bilek/tarak/parmak kemikleri.

---

## 💻 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### Gereksinimler
*   Bilgisayarınızda **Node.js** (v18 veya üzeri önerilir) yüklü olmalıdır.

### 1. Depoyu İndirin / Kopyalayın
Projeyi indirin ve proje dizinine geçiş yapın:
```bash
cd "omurga projesi en iyi haliş"
```

### 2. Bağımlılıkları Yükleyin
Gerekli paketleri kurmak için terminalde şu komutu çalıştırın:
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
Uygulamayı yerel olarak çalıştırmak için:
```bash
npm run dev
```
Tarayıcınızda terminalde belirtilen yerel adresi (genellikle `http://localhost:5173`) açarak projeyi anında inceleyebilirsiniz.

### 4. Üretim Dağıtımı (Build)
Uygulamayı optimize edilmiş bir şekilde derlemek için:
```bash
npm run build
```

---

## 👥 Proje Ekibi

Bu proje, değerli öğretmenimizin rehberliğinde ve öğrencilerimizin yoğun çalışmalarıyla geliştirilmiştir:

*   **Proje Koordinatörü:** Ümit Yaşar Kamacı
*   **Geliştirici Öğrenciler:**
    *   Efecan H.
    *   Birol A.
    *   Mehmet E.
    *   Yusuf B.
    *   Yusuf Emre T.

---

## 📝 3D Model Entegrasyon Notları

Uygulamada kullanılan `fullpaket.glb` modeli içerisindeki mesh (kemik parçaları) isimleri, `SpineModel.jsx` içerisindeki regex motoru tarafından taranarak otomatik olarak `src/data.js` dosyasındaki kimliklerle (ID) eşleştirilir. Bu sayede modele yeni bir kemik eklendiğinde veya isim değişikliği yapıldığında dinamik boyama ve etiketleme sistemi hatasız bir şekilde çalışmaya devam eder.
