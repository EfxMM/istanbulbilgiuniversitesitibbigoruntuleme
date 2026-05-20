// Bölge bazlı genel veriler (sol menü için)
export const regionData = {
  // KAFA VE YÜZ
  mandibula: { id: 'mandibula', title: 'Mandibula (Alt Çene Kemiği)', color: '#9b59b6' },
  upper_teeth: { id: 'upper_teeth', title: 'Üst Dişler', color: '#ffd700' },
  lower_teeth: { id: 'lower_teeth', title: 'Alt Dişler', color: '#ffb347' },
  
  // OMURGA BÖLGESİ
  cervical: {
    id: 'cervical',
    title: 'Servikal Bölge (Boyun)',
    color: '#ff8f8f',
    description: 'Omurganın boyun kısmını oluşturan ilk 7 omurdan (C1-C7) meydana gelir.',
  },
  thoracic: {
    id: 'thoracic',
    title: 'Torakal Bölge (Sırt)',
    color: '#8fc8ff',
    description: 'Omurganın sırt kısmındaki 12 omurdan (T1-T12) oluşur.',
  },
  lumbar: {
    id: 'lumbar',
    title: 'Lomber Bölge (Bel)',
    color: '#8fedc4',
    description: 'Omurganın bel kısmındaki 5 omurdan (L1-L5) oluşur.',
  },
  disk: {
    id: 'disk',
    title: 'İntervertebral Diskler (Disk Araları)',
    color: '#e58eff',
    description: 'Omurlar arasında yer alan, darbe emici ve esneklik sağlayıcı amortisör disklerdir.',
    name: 'İntervertebral Diskler (Disk Araları)',
    function: 'Omurlar arasında yer alan esnek kıkırdak yapılardır. Omurgaya gelen darbeleri emerek amortisör görevi görürler ve omurganın esnekliğini sağlarlar.',
    pathologies: [
      {
        name: 'Disk Hernisi (Fıtık)',
        detail: 'Diskin dış koruyucu halkasının yırtılması sonucu içteki jelin dışarı sızması. Sinire baskı yaparak boyunda kola, belde bacağa yayılan ağrı, uyuşma ve güçsüzlüğe yol açar.'
      },
      {
        name: 'Disk Dejenerasyonu (Kireçlenme / Aşınma)',
        detail: 'Yaşlanma ile disklerin su kaybedip incelmesi ve aşınması. Omurlar birbirine yaklaşır ve sinir sıkışmasına yol açabilir.'
      }
    ]
  },
  
  // GÖĞÜS KAFESİ
  sternum: { id: 'sternum', title: 'Sternum (Göğüs Kemiği)', color: '#98f5f5' },
  costae: { id: 'costae', title: 'Kaburgalar (Costa 1-10)', color: '#8fe8ff' },
  costa_11: { id: 'costa_11', title: 'Yüzen Kaburga 11', color: '#7ceade' },
  costa_12: { id: 'costa_12', title: 'Yüzen Kaburga 12', color: '#7ceaa4' },
  
  // ÜST EKSTREMİTE (KOLLAR)
  klavikula: { id: 'klavikula', title: 'Klavikula (Köprücük)', color: '#ffcedc' },
  kurek_kemigi: { id: 'kurek_kemigi', title: 'Kürek Kemiği', color: '#ffb3d9' },
  humerus: { id: 'humerus', title: 'Humerus (Kol)', color: '#ff9ebe' },
  radius: { id: 'radius', title: 'Radius (Döner)', color: '#ffaec4' },
  ulna: { id: 'ulna', title: 'Ulna (Dirsek)', color: '#ffbed0' },
  carpals: { id: 'carpals', title: 'El Bilek Kemikleri (Carpals)', color: '#ffbca3' },
  metacarpals: { id: 'metacarpals', title: 'El Tarak Kemikleri (Metacarpals)', color: '#ffe0a3' },
  phalanges: { id: 'phalanges', title: 'El Parmak Kemikleri (Phalanges)', color: '#fff1a3' },
  
  // PELVİS VE ALT EKSTREMİTE
  pelvis: { id: 'pelvis', title: 'Pelvis (Leğen Kemiği)', color: '#ffd1a9' },
  sacrum: { id: 'sacrum', title: 'Sakrum', color: '#ffc491' },
  coccyx: { id: 'coccyx', title: 'Kuyruk Sokumu (Koksiks)', color: '#ffa68d' },
  femur: { id: 'femur', title: 'Femur (Uyluk)', color: '#cbb0ff' },
  patella: { id: 'patella', title: 'Patella (Diz Kapağı)', color: '#d6c2ff' },
  tibia: { id: 'tibia', title: 'Tibia (Kaval)', color: '#e2d4ff' },
  fibula: { id: 'fibula', title: 'Fibula (Baldır)', color: '#eedeff' },
  tarsals: { id: 'tarsals', title: 'Ayak Bilek Kemikleri (Tarsals)', color: '#ff6b9d' },
  metatarsals: { id: 'metatarsals', title: 'Ayak Tarak Kemikleri (Metatarsals)', color: '#ff8fab' },
  foot_phalanges: { id: 'foot_phalanges', title: 'Ayak Parmak Kemikleri (Phalanges)', color: '#ffb3c1' }
};

// Her bir kemik için detaylı veri
export const vertebraData = {
  // ══════════════════ SERVİKAL (C1-C7) ══════════════════
  c1: {
    name: 'C1 – Atlas',
    region: 'cervical',
    function: 'Kafatasını taşır ve başın öne-arkaya (evet hareketi) eğilmesini sağlar. Halka şeklinde, gövdesi olmayan özel bir omurdur.',
    pathologies: [
      { name: 'Atlanto-oksipital Dislokasyon', detail: 'Kafa ile atlas arasındaki eklemin çıkması; genellikle yüksek enerjili travmalarda görülür.' }
    ]
  },
  c2: {
    name: 'C2 – Aksis',
    region: 'cervical',
    function: 'Başın sağa-sola dönmesini (hayır hareketi) sağlayan dens (odontoid çıkıntı) yapısını barındırır.',
    pathologies: [
      { name: 'Odontoid Kırığı (Dens Kırığı)', detail: 'Dens çıkıntısının (C2 omurunun yukarı doğru uzanan diş benzeri çıkıntısı) kırılması; özellikle yaşlılarda düşme sonucu sık görülür.' }
    ]
  },
  c3: {
    name: 'C3 – 3. Servikal Omur',
    region: 'cervical',
    function: 'Diyafram sinirinin (n. phrenicus) köklerinden birini barındırır. Boyun hareketlerine katkı sağlar.',
    pathologies: [
      { name: 'Servikal Disk Hernisi', detail: 'C3-C4 disk seviyesinde sinir kökü basısı; boyun ve omuza yayılan ağrı.' }
    ]
  },
  c4: {
    name: 'C4 – 4. Servikal Omur',
    region: 'cervical',
    function: 'Diyafram innervasyonunun (C3-C5 frenik sinir) önemli bir parçasıdır. Omuz kaslarına katkı sağlar.',
    pathologies: [
      { name: 'Servikal Spondiloz (Dejenerasyon)', detail: 'Yaşlanmaya bağlı disk dejenerasyonu (aşınma ve su kaybı) ve kemik çıkıntılarının oluşması.' }
    ]
  },
  c5: {
    name: 'C5 – 5. Servikal Omur',
    region: 'cervical',
    function: 'Deltoid ve biseps kaslarını innerve eden sinir köklerinin çıkış seviyesidir. Kol kaldırma hareketi için kritiktir.',
    pathologies: [
      { name: 'Boyun Fıtığı (C4-C5)', detail: 'Disk materyalinin sinir köküne basısı; kolda uyuşma ve güç kaybı.' }
    ]
  },
  c6: {
    name: 'C6 – 6. Servikal Omur',
    region: 'cervical',
    function: 'El bileği ekstansörlerini innerve eder. Bilek hareketleri ve el kavramasında kritik role sahiptir.',
    pathologies: [
      { name: 'Servikal Miyelopati (Omurilik Basısı)', detail: 'Spinal kanalın daralması sonucu omuriliğe baskı; yürüme bozukluğu ve el beceri kaybı.' }
    ]
  },
  c7: {
    name: 'C7 – Vertebra Prominens',
    region: 'cervical',
    function: 'Boyunda en belirgin çıkıntıya (spinöz proses) sahip omurdur. Boyun eğildiğinde elle hissedilebilir.',
    pathologies: [
      { name: 'C7 Radikülopati (Sinir Kökü Basısı)', detail: 'C6-C7 disk hernisi sonucu sinir kökünün sıkışması; orta parmakta uyuşma, triseps güçsüzlüğü.' }
    ]
  },

  // ══════════════════ TORAKAL (T1-T12) ══════════════════
  t1: {
    name: 'T1 – 1. Torakal Omur',
    region: 'thoracic',
    function: 'Boyun ve göğüs bölgesi arasındaki geçiş noktasıdır. Buradan çıkan sinir kökleri el ve parmak kaslarına sinyal göndererek ince hareketleri mümkün kılar.',
    pathologies: [
      { name: 'T1 Kırığı', detail: 'Yüksekten düşme veya trafik kazası sonucu oluşan kırık; boyun ve kol ağrısına yol açabilir.' }
    ]
  },
  t2: {
    name: 'T2 – 2. Torakal Omur',
    region: 'thoracic',
    function: 'Üst göğüs bölgesinin stabilitesine katkı sağlar. İnterkostal sinirler aracılığıyla göğüs duvarına sinir iletimi (innervasyon: sinir bağlantısı) sağlar.',
    pathologies: [
      { name: 'Skolyoz', detail: 'Üst torakal bölgede omurganın lateral eğriliği.' }
    ]
  },
  t3: {
    name: 'T3 – 3. Torakal Omur',
    region: 'thoracic',
    function: 'Akciğer fonksiyonu için önemli interkostal (kaburga arası) sinirleri barındırır. Bu sinirler kaburga arası kasları hareket ettirerek göğüs kafesinin genişleyip daralmasını sağlar ve böylece solunuma yardımcı olur.',
    pathologies: [
      { name: 'Scheuermann Hastalığı (Gençlik Kamburluğu)', detail: 'Ergenlik döneminde omur gövdelerinin ön kısmının daha yavaş büyümesi sonucu kama şeklini alması; sırt bölgesinde kamburluk (kifoz) artışına yol açar.' }
    ]
  },
  t4: {
    name: 'T4 – 4. Torakal Omur',
    region: 'thoracic',
    function: 'Meme başı hizasındaki deri bölgesine (dermatom: belirli bir omurdan gelen sinirin hissettiği deri alanı) karşılık gelir. Kaburgalarla birleşerek göğüs kafesinin sağlamlığını ve dengeli duruşunu sağlar.',
    pathologies: [
      { name: 'Kifoz (Kamburluk)', detail: 'T4-T8 arası aşırı eğrilik; postüral veya yapısal olabilir.' }
    ]
  },
  t5: {
    name: 'T5 – 5. Torakal Omur',
    region: 'thoracic',
    function: 'Göğüs kafesi ve solunum kaslarına destek verir. Sempatik sinir sistemiyle bağlantılıdır.',
    pathologies: [
      { name: 'Metastatik Tümörler', detail: 'Meme, akciğer gibi kanserlerden omurgaya yayılan (metastaz) tümörler; torakal bölgede sık görülür.' }
    ]
  },
  t6: {
    name: 'T6 – 6. Torakal Omur',
    region: 'thoracic',
    function: 'Ksifoid proses (göğüs kemiği ucu) hizasında yer alır. Diyafram ve karın kasları ile ilişkilidir.',
    pathologies: [
      { name: 'Torakal Disk Hernisi (Fıtık)', detail: 'Nadir görülür ancak omuriliğe bası yapabilir; bacaklarda güçsüzlük.' }
    ]
  },
  t7: {
    name: 'T7 – 7. Torakal Omur',
    region: 'thoracic',
    function: 'Torakal kifozun tepe noktasına yakındır. Solunum ve gövde stabilitesinde önemli rol oynar.',
    pathologies: [
      { name: 'Skolyoz', detail: 'Omurganın yana doğru eğrilmesi; en sık torakal bölgede görülür.' }
    ]
  },
  t8: {
    name: 'T8 – 8. Torakal Omur',
    region: 'thoracic',
    function: 'Diyafram ile göğüs kafesi geçişine yakın konumdadır. Karın organlarına sinir bağlantısı (innervasyon: sinir iletimi) sağlar.',
    pathologies: [
      { name: 'Scheuermann Hastalığı (Gençlik Kamburluğu)', detail: 'Genellikle T7-T10 arası omur gövdelerinde kamalaşma ve kifoz artışı.' }
    ]
  },
  t9: {
    name: 'T9 – 9. Torakal Omur',
    region: 'thoracic',
    function: 'Torakal-lomber geçiş bölgesine yaklaşır. Karın duvarının üst kısmına sinir gönderir (innervasyon: sinir bağlantısı sağlar).',
    pathologies: [
      { name: 'Travmatik Kırık', detail: 'Yüksekten düşme veya trafik kazasında torakal omur kırıkları.' }
    ]
  },
  t10: {
    name: 'T10 – 10. Torakal Omur',
    region: 'thoracic',
    function: 'Göbek (umbilikus) dermatom seviyesine karşılık gelir. Karın kasları ve iç organlarla sinirsel bağlantı noktasıdır.',
    pathologies: [
      { name: 'Torakolomber Burst Kırığı (Patlama Kırığı)', detail: 'Yüksek enerjili travmada omur gövdesinin parçalanarak patlaması; omurilik kanalına kemik parçaları girebilir.' }
    ]
  },
  t11: {
    name: 'T11 – 11. Torakal Omur',
    region: 'thoracic',
    function: 'Yüzen kaburga (11. kaburga) ile eklem yapar. Torakolomber geçiş bölgesinin bir parçasıdır.',
    pathologies: [
      { name: 'Geçiş Bölgesi Kırığı', detail: 'T11-L1 arası travmatik kırıklar sık görülür; mekanik açıdan zayıf bölge.' }
    ]
  },
  t12: {
    name: 'T12 – 12. Torakal Omur',
    region: 'thoracic',
    function: 'Son torakal omurdur. Torakolomber geçiş bölgesinde olup 12. (yüzen) kaburga ile eklem yapar.',
    pathologies: [
      { name: 'Torakolomber Kırık', detail: 'En sık kırılan omurlardan biridir; trafik kazaları ve düşmelerde görülür.' }
    ]
  },

  // ══════════════════ LOMBER (L1-L5) ══════════════════
  l1: {
    name: 'L1 – 1. Lomber Omur',
    region: 'lumbar',
    function: 'Omuriliğin bittiği seviyedir. Göğüs ve bel bölgesi arasındaki geçiş noktasıdır.',
    pathologies: [
      { name: 'Burst Kırığı (Patlama Kırığı)', detail: 'Yukarıdan aşağıya gelen baskı ile omur gövdesinin patlaması; omurilik hasarı riski yüksektir.' }
    ]
  },
  l2: {
    name: 'L2 – 2. Lomber Omur',
    region: 'lumbar',
    function: 'Bel bölgesinin üst kısmında yer alır. Kalça ve bacak hareketlerini kontrol eden sinirlerin çıkış noktasıdır.',
    pathologies: [
      { name: 'Psoas Absesi', detail: 'Psoas kasında (bel omurgasından kalçaya uzanan derin kas) enfeksiyon birikimi; bel ağrısı ve kalça fleksiyon kontraktürü.' }
    ]
  },
  l3: {
    name: 'L3 – 3. Lomber Omur',
    region: 'lumbar',
    function: 'Kuadriseps kasını (diz ekstansiyonu) innerve eden femoral sinirin ana köküdür. Diz refleksi bu seviyeden alınır.',
    pathologies: [
      { name: 'L3 Radikülopati (Sinir Kökü Basısı)', detail: 'L2-L3 disk hernisi sonucu sinir kökünün sıkışması; uyluğun ön yüzünde ağrı ve diz ekstansiyon güçsüzlüğü.' }
    ]
  },
  l4: {
    name: 'L4 – 4. Lomber Omur',
    region: 'lumbar',
    function: 'Ayak bileğini yukarı kaldırma hareketini kontrol eden sinir kökünün çıkış seviyesidir.',
    pathologies: [
      { name: 'L4-L5 Disk Hernisi (Bel Fıtığı)', detail: 'En sık görülen bel fıtığı seviyelerinden biridir; disk içindeki jel dışarı sızarak sinire baskı yapar, bacak dış yüzünde ağrı ve düşük ayak riski.' }
    ]
  },
  l5: {
    name: 'L5 – 5. Lomber Omur',
    region: 'lumbar',
    function: 'Vücut ağırlığının en fazla yüklendiği omurdur. Ayak başparmağı ve ayak bileği hareketlerini kontrol eder.',
    pathologies: [
      { name: 'L5-S1 Disk Hernisi', detail: 'En sık fıtık seviyesidir; siyatik ağrı, baldır ve ayak tabanında uyuşma.' }
    ]
  },

  // ══════════════════ YENİ EKLENEN KEMİKLER ══════════════════
  femur: {
    name: 'Femur (Uyluk Kemiği)',
    region: 'legs',
    function: 'Vücudun en uzun, en kalın ve en güçlü kemiğidir. Vücut ağırlığını kalçadan dize aktarır.',
    pathologies: [
      { name: 'Femur Boynu Kırığı', detail: 'Genellikle yaşlılarda düşme sonucu görülen, kalça protezi gerektirebilen kırık.' },
      { name: 'Osteosarkom', detail: 'En sık femur distal ucunda görülen primer kemik kanseri.' }
    ]
  },
  patella: {
    name: 'Patella (Diz Kapağı)',
    region: 'legs',
    function: 'Diz eklemini korur ve kuadriseps kasının gücünü artırarak kaldıraç görevi görür.',
    pathologies: [
      { name: 'Patella Çıkığı', detail: 'Diz kapağının yuvasından dışarı doğru kayması.' }
    ]
  },
  tibia: {
    name: 'Tibia (Kaval Kemiği)',
    region: 'legs',
    function: 'Bacağın iç kısmındaki (başparmak hizasında) kalın kemiktir. Ağırlığı dizden ayak bileğine aktarır.',
    pathologies: [
      { name: 'Tibia Kırığı', detail: 'Trafik kazası, spor yaralanması veya yüksekten düşme sonucu oluşan kırık; şiddetli ağrı ve yürüyememe ile kendini gösterir.' }
    ]
  },
  fibula: {
    name: 'Fibula (Baldır Kemiği)',
    region: 'legs',
    function: 'Bacağın dış kısmındaki (serçe parmak hizasında) ince kemiktir. Ağırlık taşımaz ancak kas tutunması ve ayak bileği stabilitesi için kritiktir.',
    pathologies: [
      { name: 'Fibula Kırığı', detail: 'Ayak bileği burkulması veya bacağa yan darbe sonucu oluşan kırık; şişlik ve yürüme güçlüğüne yol açar.' }
    ]
  },
  tarsals: {
    name: 'Ayak Bilek Kemikleri (Tarsals)',
    region: 'tarsals',
    function: 'Ayak bileğini ve ayağın arka kısmını oluşturan 7 kemiktir. Vücut ağırlığını taşır ve yürüme sırasında darbeleri emer.',
    pathologies: [
      { name: 'Ayak Bileği Burkulması', detail: 'Ayağın aniden dönmesi sonucu bağ zedelenmesi ve şişlik; en sık spor yaralanmasıdır.' }
    ]
  },
  metatarsals: {
    name: 'Ayak Tarak Kemikleri (Metatarsals)',
    region: 'metatarsals',
    function: 'Ayak tabanını oluşturan 5 uzun kemiktir. Ayak bileği ile ayak parmaklarını birbirine bağlar ve yürürken vücut ağırlığını taşır.',
    pathologies: [
      { name: 'Metatarsal Kırığı', detail: 'Ayak üzerine ağır cisim düşmesi veya aşırı yüklenme sonucu oluşan kırık; ağrı ve şişlikle kendini gösterir.' }
    ]
  },
  foot_phalanges: {
    name: 'Ayak Parmak Kemikleri (Phalanges)',
    region: 'foot_phalanges',
    function: 'Ayak parmaklarındaki küçük kemiklerdir. Her parmakta eklemli olarak dizilmiş 2-3 adet bulunur. Yürürken dengeyi sağlar ve itme gücü verir.',
    pathologies: [
      { name: 'Ayak Parmağı Kırığı', detail: 'Çarpma veya ezilme sonucu oluşan kırık; özellikle küçük parmakta sık görülür, şişlik ve morarma ile kendini gösterir.' }
    ]
  },
  humerus: {
    name: 'Humerus (Kol Kemiği)',
    region: 'arms',
    function: 'Omuzdan dirseğe kadar uzanan kemiktir. Kol hareketleri için kaslara tutunma yüzeyi sağlar.',
    pathologies: [
      { name: 'Humerus Başı Kırığı', detail: 'Omuz üzerine düşme sonucu kol kemiğinin üst ucunun kırılması; yaşlılarda sık görülür.' }
    ]
  },
  radius: {
    name: 'Radius (Döner Kemik)',
    region: 'arms',
    function: 'Önkolun dış (başparmak) hizasındaki kemiktir. Elin dönme hareketlerini sağlar (pronasyon: avuç içini aşağı çevirme, supinasyon: avuç içini yukarı çevirme).',
    pathologies: [
      { name: 'Colles Kırığı (Bilek Kırığı)', detail: 'Açık el üzerine düşme sonucu radius alt ucunun (distal: kemik ucuna yakın kısım) kırılması.' }
    ]
  },
  ulna: {
    name: 'Ulna (Dirsek Kemiği)',
    region: 'arms',
    function: 'Önkolun iç (serçe parmak) hizasındaki kemiktir. Dirsek ekleminin ana menteşesini oluşturur.',
    pathologies: [
      { name: 'Olekranon Kırığı (Dirsek Çıkıntısı Kırığı)', detail: 'Dirsek üzerine düşme sonucu ulna üst ucunun (proksimal: kemiğin gövdeye yakın kısmı) kırılması.' }
    ]
  },
  klavikula: {
    name: 'Klavikula (Köprücük Kemiği)',
    region: 'arms',
    function: 'Gövde ile kol arasındaki tek kemiksel bağlantıdır. Omuzu dışarıda ve arkada tutar.',
    pathologies: [
      { name: 'Klavikula Kırığı', detail: 'Omuz üzerine düşme sonucu en sık kırılan kemiklerden biridir.' }
    ]
  },
  kurek_kemigi: {
    name: 'Scapula (Kürek Kemiği)',
    region: 'arms',
    function: 'Sırtın üst kısmında yer alan yassı üçgen kemiktir. Omuz ekleminin temelini oluşturur.',
    pathologies: [
      { name: 'Skapular Diskinezi (Hareket Bozukluğu)', detail: 'Kürek kemiğinin asimetrik veya düzensiz hareketi; omuz ağrısına yol açar.' }
    ]
  },
  pelvis: {
    name: 'Pelvis (Leğen Kemiği)',
    region: 'pelvis',
    function: 'Vücut ağırlığını bacaklara aktarır ve iç üreme, sindirim organlarını korur.',
    pathologies: [
      { name: 'Pelvis Halkası Kırığı', detail: 'Genellikle yüksek enerjili trafik kazalarında görülen hayati tehlike taşıyan kırık.' }
    ]
  },
  sacrum: {
    name: 'Sacrum (Sağrı Kemiği)',
    region: 'pelvis',
    function: 'Omurganın tabanını oluşturan ve leğen kemiğiyle birleşen, kaynaşmış 5 omurdan oluşan kama şeklinde kemiktir.',
    pathologies: [
      { name: 'Sakrum Kırığı', detail: 'Yüksekten düşme veya trafik kazası sonucu oluşan kırık; bel ve kalça ağrısına yol açar.' }
    ]
  },
  coccyx: {
    name: 'Coccyx (Kuyruk Sokumu)',
    region: 'pelvis',
    function: 'İnsanlarda evrimsel körelmiş kuyruk yapısıdır; otururken destek sağlar ve pelvis taban kaslarına tutunma noktasıdır.',
    pathologies: [
      { name: 'Koksigodini', detail: 'Kuyruk sokumu bölgesinde, genellikle sert zemine düşme sonucu oluşan şiddetli oturma ağrısı.' }
    ]
  },
  sternum: {
    name: 'Sternum (Göğüs Kemiği)',
    region: 'chest',
    function: 'Göğüs kafesinin ön ortasındaki yassı kemiktir. Kalbi korur ve kaburgaların ön tutunma noktasıdır.',
    pathologies: [
      { name: 'Sternum Kırığı', detail: 'Trafik kazalarında direksiyon çarpması sonucu oluşur; kalp kontüzyonu riski taşır.' }
    ]
  },
  carpals: {
    name: 'El Bilek Kemikleri (Carpals)',
    region: 'carpals',
    function: 'Bileği oluşturan ve iki sıra halinde dizilmiş 8 küçük kemiktir. El bileğinin esnekliğini ve çok yönlü hareketini sağlar.',
    pathologies: [
      { name: 'Karpal Tünel Sendromu', detail: 'Bilekteki median sinirin sıkışması sonucu el parmaklarında uyuşma, karıncalanma ve ağrı.' }
    ]
  },
  metacarpals: {
    name: 'El Tarak Kemikleri (Metacarpals)',
    region: 'metacarpals',
    function: 'El ayasını (avuç içini) oluşturan 5 uzun kemiktir. Bilek kemikleri ile parmak kemiklerini birbirine bağlar ve elin kavrama gücünü destekler.',
    pathologies: [
      { name: 'Boksör Kırığı', detail: 'Özellikle yumruk atma sonucu 5. metakarpın (serçe parmak tarak kemiği) boyun kısmında oluşan kırık.' }
    ]
  },
  phalanges: {
    name: 'El Parmak Kemikleri (Phalanges)',
    region: 'phalanges',
    function: 'Parmaklardaki küçük kemiklerdir. Her parmakta eklemli olarak dizilmiş 2-3 adet bulunur. Parmakların bükülmesini ve hassas hareketleri (yazma, tutma, kavrama) mümkün kılar.',
    pathologies: [
      { name: 'Parmak Ucu Kırığı', detail: 'Sıkışma veya darbe sonucu en sık görülen parmak ucu kemiği (distal falanks) kırığı.' }
    ]
  },
  costae: {
    name: 'Kaburgalar (Costa 1-10)',
    region: 'costae',
    function: 'Göğüs kafesinin yan ve ön duvarını oluşturan ilk 10 çift kaburgadır. Akciğerler ve kalbi dış darbelerden korur, solunuma yardımcı olur.',
    pathologies: [
      { name: 'Kaburga Kırığı / Çatlağı', detail: 'Göğse doğrudan gelen travmalar sonucu oluşur; nefes alırken şiddetli batıcı ağrı yapar.' }
    ]
  },
  costa_11: {
    name: 'Yüzen Kaburga 11',
    region: 'costa_11',
    function: 'Ön uçları tamamen serbest olan, göğüs kemiğine (sternum) bağlanmayan 11. kaburga çiftidir. Karın boşluğundaki organları arkadan korur.',
    pathologies: [
      { name: 'Yüzen Kaburga Kırığı', detail: 'Bel ve sırt bölgesine gelen şiddetli darbelerle kırılabilir, böbrek yaralanması riski taşır.' }
    ]
  },
  costa_12: {
    name: 'Yüzen Kaburga 12',
    region: 'costa_12',
    function: 'Göğüs kafesinin en altında yer alan, sternuma bağlanmayan 12. en kısa kaburga çiftidir. Esnek yapısıyla alt sırt korumasına katılır.',
    pathologies: [
      { name: 'Slipping Rib Sendromu', detail: 'Kaburga ucunun yerinden oynayarak yakındaki sinirlere sürtünmesi sonucu oluşan şiddetli yan ağrısı.' }
    ]
  },
  upper_teeth: {
    name: 'Üst Dişler (Maksiller Dişler)',
    region: 'upper_teeth',
    color: '#ffd700',
    function: 'Üst çenede yer alan 16 adet diştir. Besinleri parçalama ve çiğneme işlevini görür.',
    pathologies: [
      { name: 'Diş Çürüğü (Dental Karies)', detail: 'Bakterilerin ürettiği asitlerin diş minesini aşındırması sonucu oluşan kaviteler. Ağrı, hassasiyet ve diş kaybına yol açabilir.' }
    ]
  },
  lower_teeth: {
    name: 'Alt Dişler (Mandibular Dişler)',
    region: 'lower_teeth',
    color: '#ffb347',
    function: 'Alt çenede yer alan 16 adet diştir. Üst dişlerle birlikte çalışarak besinleri öğütür ve çiğner.',
    pathologies: [
      { name: 'Diş Taşı (Dental Kalkülüs)', detail: 'Diş yüzeyinde biriken mineralize plak tabakası. Diş eti iltihabına ve periodontitise (diş eti hastalığı) yol açar.' }
    ]
  },
  mandibula: {
    name: 'Mandibula (Alt Çene Kemiği)',
    region: 'mandibula',
    color: '#9b59b6',
    function: 'Yüzdeki tek hareketli kemiktir. Alt dişleri taşır ve çiğneme, konuşma hareketlerini sağlar.',
    pathologies: [
      { name: 'Mandibula Kırığı', detail: 'Travma sonucu alt çene kemiğinin kırılması. Ağrı, şişlik, dişlerde kapanış bozukluğu ve çiğneme güçlüğüne neden olur.' }
    ]
  }
};

// Eski pathologyData uyumluluğu (sol menü butonları için)
export const pathologyData = regionData;
