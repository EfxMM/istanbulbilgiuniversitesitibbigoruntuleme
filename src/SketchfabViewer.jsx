import { useRef, useEffect, useState } from 'react';

export default function SketchfabViewer({ modelId, activeRegion }) {
  const iframeRef = useRef(null);
  const [apiReady, setApiReady] = useState(null);

  useEffect(() => {
    if (!iframeRef.current || !window.Sketchfab) return;

    const client = new window.Sketchfab(iframeRef.current);
    
    client.init(modelId, {
      success: function onSuccess(api) {
        api.start();
        api.addEventListener('viewerready', function() {
          console.log("Sketchfab Viewer Hazır!");
          setApiReady(api);

          // Eşleştirme Modu için tıklama dinleyicisi
          api.addEventListener('click', function(info) {
            if (info && info.position) {
              console.log("Tıklanan noktanın Koordinatları:", info.position);
              console.log("Tıklanan Parça (instanceID):", info.instanceID);
              // Bu koordinatları tarayıcı konsolundan okuyarak 
              // aşağıdaki setCameraLookAt hedeflerini kusursuz ayarlayabilirsiniz!
            }
          }, { pick: 'fast' });
        });
      },
      error: function onError() {
        console.error('Sketchfab API hatası!');
      },
      ui_theme: 'dark',
      ui_controls: 1, 
      ui_infos: 0,
      ui_watermark: 0,
      transparent: 1 // Bizim şık koyu arka planımız gözüksün
    });
  }, [modelId]);

  // activeRegion değiştiğinde kamerayı hareket ettir
  useEffect(() => {
    if (!apiReady) return;

    // NOT: Bu [x, y, z] koordinatları yeni modele göre tahmini yazılmıştır.
    // Eğer çok uzakta/yakında kalırsa, modele bir kere tıklayıp F12 konsolundan
    // gelen "Koordinatları" kopyalayıp buradaki [hedefX, hedefY, hedefZ] içine yazabilirsiniz.
    if (activeRegion === 'cervical') {
       // Boyun bölgesi için çok daha yakın koordinatlar
       apiReady.setCameraLookAt([0, 6, 8], [0, 6, 0], 2.0);
    } else if (activeRegion === 'thoracic') {
       // Sırt bölgesi için
       apiReady.setCameraLookAt([0, 3.5, 9], [0, 3.5, 0], 2.0);
    } else if (activeRegion === 'lumbar') {
       // Bel bölgesi için
       apiReady.setCameraLookAt([0, 1, 9], [0, 1, 0], 2.0);
    } else {
       // Varsayılan Görünüm: Modeli tam ekrana sığdır
       apiReady.recenterCamera();
       // Veya alternatif: apiReady.setCameraLookAt([0, 3.5, 15], [0, 3.5, 0], 2.0);
    }

  }, [activeRegion, apiReady]);

  return (
    <iframe
      ref={iframeRef}
      title="Sketchfab"
      style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      allow="autoplay; fullscreen; xr-spatial-tracking"
    />
  );
}
