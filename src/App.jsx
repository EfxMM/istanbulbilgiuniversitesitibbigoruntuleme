import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Info, Search, Menu, X, Play, Square, ChevronLeft, ChevronRight, Video, Check, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import SpineModel from './SpineModel';
import { pathologyData, vertebraData, regionData } from './data';
import './index.css';

const TOUR_STEPS = [
  {
    regionId: 'mandibula',
    boneId: 'mandibula',
    title: 'Mandibula — Alt Çene Kemiği',
    description: 'İnsan yüzündeki tek hareketli kemiktir. Çiğneme ve konuşma hareketlerini sağlar. Travma sonucu kırılabilir, ağrı ve kapanış bozukluğuna yol açar.',
    color: '#9b59b6',
  },
  {
    regionId: 'cervical',
    boneId: 'c1',
    title: 'C1 (Atlas) — Boyun Bölgesi',
    description: 'Kafatasını taşıyan ve "evet" hareketini sağlayan özel omurdur. Halka şeklindedir; gövdesi yoktur. Atlanto-oksipital dislokasyon gibi ağır travmalar bu bölgeyi etkiler.',
    color: '#ff8f8f',
  },
  {
    regionId: 'thoracic',
    boneId: 't6',
    title: 'Torakal Bölge — Sırt Omurları',
    description: 'T1–T12 arası 12 omurdan oluşur. Her omur bir çift kaburga ile eklem yapar ve göğüs kafesinin sağlamlığını oluşturur. Skolyoz ve Kifoz bu bölgede sık görülür.',
    color: '#8fc8ff',
  },
  {
    regionId: 'lumbar',
    boneId: 'l3',
    title: 'Lomber Bölge — Bel Omurları',
    description: 'L1–L5 arası vücudun en yüklü 5 omurudur. L4–L5 ve L5–S1 seviyeleri en sık bel fıtığı görülen bölgelerdir. Siyatik ağrısının kaynağı genellikle burasıdır.',
    color: '#8fedc4',
  },
  {
    regionId: 'disk',
    boneId: 'disk',
    title: 'İntervertebral Diskler',
    description: 'Omurlar arasındaki amortisör disklerdir. İçlerindeki jel (nucleus pulposus) yırtılan dış halka nedeniyle dışarı sızarsa sinir köklerine baskı yaparak fıtık oluşturur.',
    color: '#e58eff',
  },
  {
    regionId: 'costae',
    boneId: 'costae',
    title: 'Kaburgalar (Costa 1–10)',
    description: 'Akciğer ve kalbi dış darbelerden koruyan 10 çift kaburga, hem omurgaya hem de göğüs kemiğine (sternum) bağlıdır. Solunum hareketine aktif olarak katılırlar.',
    color: '#8fe8ff',
  },
  {
    regionId: 'klavikula',
    boneId: 'klavikula',
    title: 'Klavikula — Köprücük Kemiği',
    description: 'Gövde ile kol arasındaki tek kemiksel bağlantıdır. Omuzu dışarıda ve arkada tutar. Omuz üzerine düşmelerde en sık kırılan kemikler arasında yer alır.',
    color: '#ffcedc',
  },
  {
    regionId: 'humerus',
    boneId: 'humerus',
    title: 'Humerus — Kol Kemiği',
    description: 'Omuzdan dirseğe uzanan koldaki tek uzun kemiktir. Deltoid ve biseps gibi büyük kaslara tutunma noktası sağlar. Başının kırıkları yaşlılarda sık görülür.',
    color: '#ff9ebe',
  },
  {
    regionId: 'pelvis',
    boneId: 'pelvis',
    title: 'Pelvis — Leğen Kemiği',
    description: 'Vücut ağırlığını bacaklara aktaran büyük kemik halkasıdır. İç organları (mesane, rahim, bağırsaklar) korur. Yüksek enerjili trafik kazalarında ciddi kırıklar oluşabilir.',
    color: '#ffd1a9',
  },
  {
    regionId: 'femur',
    boneId: 'femur',
    title: 'Femur — Uyluk Kemiği',
    description: 'İnsan vücudunun en uzun, en kalın ve en güçlü kemiğidir. Kalçadan dize vücut ağırlığını aktarır. Femur boynu kırıkları yaşlılarda sık görülür ve kalça protezi gerektirebilir.',
    color: '#cbb0ff',
  },
];

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("3D render error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#ff8f8f', background: 'rgba(10, 10, 18, 0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 16,
          padding: '2rem', height: '100%', textAlign: 'center', boxSizing: 'border-box'
        }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>3D Model Yüklenemedi</h3>
          <p style={{ fontSize: '0.9rem', color: '#8892b0', maxWidth: 300, lineHeight: 1.5, margin: 0 }}>
            Model dosyası bulunamadı veya yükleme sırasında bir tarayıcı hatası oluştu. Lütfen sayfayı yenilemeyi deneyin.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedBone, setSelectedBone] = useState(null);
  const [cameraViewTrigger, setCameraViewTrigger] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Sistem bileşenleri yükleniyor...");

  useEffect(() => {
    const statusTimer1 = setTimeout(() => setLoadingStatus("3D İskelet modeli yükleniyor..."), 600);
    const statusTimer2 = setTimeout(() => setLoadingStatus("Anatomik veri yapıları çözümleniyor..."), 1400);
    const statusTimer3 = setTimeout(() => setLoadingStatus("Görselleştirme paneli hazırlandı..."), 2000);
    const fadeTimer = setTimeout(() => setSplashFading(true), 2400);
    const hideTimer = setTimeout(() => setShowSplash(false), 3200);
    
    return () => {
      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);
      clearTimeout(statusTimer3);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const [isTourActive,    setIsTourActive]    = useState(false);
  const [isTourPaused,    setIsTourPaused]    = useState(false);
  const [tourStep,        setTourStep]        = useState(0);
  const [tourCardVisible, setTourCardVisible] = useState(false);
  const isTourPausedRef = useRef(false);

  const TOUR_DURATION   = 7000;
  const tourTimerRef    = useRef(null);
  const tourStepRef     = useRef(0);   // interval stale closure olmadan güncel adımı tutar

  const clearTourTimer = useCallback(() => {
    if (tourTimerRef.current) {
      clearInterval(tourTimerRef.current);
      tourTimerRef.current = null;
    }
  }, []);

  const applyTourStep = useCallback((idx) => {
    const step = TOUR_STEPS[idx];
    if (!step) return;
    setActiveRegion(step.regionId);
    setSelectedBone(null);
    setTourCardVisible(false);
    setTimeout(() => {
      setCameraViewTrigger({ view: '__tour__', boneId: step.boneId, regionId: step.regionId, time: Date.now() });
    }, 80);
    setTimeout(() => setTourCardVisible(true), 420);
  }, []);

  const stopTour = useCallback(() => {
    clearTourTimer();
    setTourCardVisible(false);
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    setTimeout(() => {
      setIsTourActive(false);
      setTourStep(0);
      tourStepRef.current = 0;
      setActiveRegion(null);
      setSelectedBone(null);
      setCameraViewTrigger({ view: 'reset', time: Date.now() });
    }, 350);
  }, [clearTourTimer]);

  const startTimer = useCallback(() => {
    clearTourTimer();
    tourTimerRef.current = setInterval(() => {
      const next = tourStepRef.current + 1;
      if (next >= TOUR_STEPS.length) {
        setTimeout(() => {
          clearTourTimer();
          setTourCardVisible(false);
          setTimeout(() => {
            setIsTourActive(false);
            setTourStep(0);
            tourStepRef.current = 0;
            setActiveRegion(null);
            setSelectedBone(null);
            setCameraViewTrigger({ view: 'reset', time: Date.now() });
          }, 350);
        }, 0);
        return;
      }
      tourStepRef.current = next;
      setTourStep(next);
      applyTourStep(next);
    }, TOUR_DURATION);
  }, [clearTourTimer, applyTourStep]);

  const pauseTour = useCallback(() => {
    clearTourTimer();
    setIsTourPaused(true);
    isTourPausedRef.current = true;
  }, [clearTourTimer]);

  const resumeTour = useCallback(() => {
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    startTimer();
  }, [startTimer]);

  const togglePause = useCallback(() => {
    if (isTourPausedRef.current) resumeTour();
    else pauseTour();
  }, [pauseTour, resumeTour]);

  const startTour = useCallback(() => {
    clearTourTimer();
    tourStepRef.current = 0;
    setTourStep(0);
    setIsTourActive(true);
    setIsSidebarOpen(false);
    setSelectedBone(null);
    applyTourStep(0);
    startTimer();
  }, [clearTourTimer, applyTourStep, startTimer]);

  const tourNext = useCallback(() => {
    const next = tourStepRef.current + 1;
    if (next >= TOUR_STEPS.length) { stopTour(); return; }
    tourStepRef.current = next;
    setTourStep(next);
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    applyTourStep(next);
    startTimer();
  }, [stopTour, applyTourStep, startTimer]);

  const tourPrev = useCallback(() => {
    const prev = Math.max(0, tourStepRef.current - 1);
    tourStepRef.current = prev;
    setTourStep(prev);
    setIsTourPaused(false);
    isTourPausedRef.current = false;
    applyTourStep(prev);
    startTimer();
  }, [applyTourStep, startTimer]);

  useEffect(() => () => clearTourTimer(), [clearTourTimer]);

  const handleRegionSelect = (regionId) => {
    if (isTourActive) return; // Tur aktifken sol menü devre dışı
    setActiveRegion(activeRegion === regionId ? null : regionId);
    setSelectedBone(null);
    setIsSidebarOpen(false);
  };

  const filteredRegions = Object.values(pathologyData).filter(region =>
    region.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedRegions = {
    'Kafa ve Yüz': [],
    'Omurga Bölgesi': [],
    'Göğüs Kafesi': [],
    'Üst Ekstremite (Kollar)': [],
    'Pelvis ve Alt Ekstremite': [],
  };

  filteredRegions.forEach(region => {
    if (['mandibula', 'upper_teeth', 'lower_teeth'].includes(region.id)) {
      groupedRegions['Kafa ve Yüz'].push(region);
    } else if (['cervical', 'thoracic', 'lumbar', 'disk'].includes(region.id)) {
      groupedRegions['Omurga Bölgesi'].push(region);
    } else if (['sternum', 'costae', 'costa_11', 'costa_12'].includes(region.id)) {
      groupedRegions['Göğüs Kafesi'].push(region);
    } else if (['klavikula', 'kurek_kemigi', 'humerus', 'radius', 'ulna', 'carpals', 'metacarpals', 'phalanges'].includes(region.id)) {
      groupedRegions['Üst Ekstremite (Kollar)'].push(region);
    } else if (['pelvis', 'sacrum', 'coccyx', 'femur', 'patella', 'tibia', 'fibula', 'tarsals', 'metatarsals', 'foot_phalanges'].includes(region.id)) {
      groupedRegions['Pelvis ve Alt Ekstremite'].push(region);
    } else {
      groupedRegions['Pelvis ve Alt Ekstremite'].push(region);
    }
  });

  const selectedBoneData = (selectedBone && selectedBone !== 'disk')
    ? vertebraData[selectedBone]
    : ((activeRegion === 'disk' || selectedBone === 'disk') ? regionData.disk : null);

  const activeRegionColor = selectedBoneData
    ? (selectedBoneData.color || regionData[selectedBone]?.color || regionData[selectedBoneData.region]?.color || '#ff4d4d')
    : '#ff4d4d';

  const currentTourStep = TOUR_STEPS[tourStep];

  return (
    <div className="app-container">
      {/* ═══ SPLASH SCREEN ═══ */}
      {showSplash && (
        <div className={`splash-screen ${splashFading ? 'fade-out' : ''}`}>
          <div className="splash-content">
            {/* Academic Logo Shield */}
            <div className="splash-logo-container">
              <img src="/Istanbul_Bilgi_University_icon.png" alt="İstanbul Bilgi Üniversitesi Logo" className="splash-logo" />
            </div>

            {/* University Title & Project Subtitle */}
            <h1 className="splash-title">İstanbul Bilgi Üniversitesi</h1>
            <p className="splash-subtitle">Tıbbi Görüntüleme — 3D İskelet Anatomisi</p>

            {/* Linear Progress Loader and Academic Status Message */}
            <div className="splash-loader">
              <div className="splash-loader-bar"></div>
            </div>
            <div className="splash-status">{loadingStatus}</div>
          </div>
        </div>
      )}
      {/* 3D Canvas Alanı */}
      <div className="canvas-container">
        <ErrorBoundary>
          <Canvas
            shadows
            camera={{ position: [0, 0, 40], fov: 45 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <ambientLight intensity={0.25} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.6}
              castShadow
              shadow-mapSize={2048}
            />
            <pointLight position={[-10, -10, -5]} intensity={0.15} />
            <Environment preset="city" />

            <React.Suspense fallback={null}>
              <SpineModel
                activeRegion={activeRegion}
                setActiveRegion={setActiveRegion}
                hoveredRegion={hoveredRegion}
                selectedBone={selectedBone}
                setSelectedBone={setSelectedBone}
                cameraViewTrigger={cameraViewTrigger}
                modelPath="/fullpaket.glb"
                isTourActive={isTourActive}
                onLoaded={() => setModelLoaded(true)}
              />
              <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2} far={10} />
            </React.Suspense>

            <EffectComposer disableNormalPass>
              <Bloom mipmapBlur intensity={isTourActive ? 0.25 : 0.15} luminanceThreshold={0.4} luminanceSmoothing={0.1} />
            </EffectComposer>

            <OrbitControls
              makeDefault
              enablePan={!isTourActive}
              enableZoom={!isTourActive}
              enableRotate={!isTourActive}
              minDistance={0.1}
              maxDistance={100}
            />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Arayüz (UI) Katmanı */}
      <div className="ui-overlay" style={{ pointerEvents: 'none' }}>
        {/* Mobil Sidebar Karartma Arka Planı */}
        {isSidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
            style={{ pointerEvents: 'auto' }}
          />
        )}

        {/* Üst Bilgi Başlığı */}
        <header className="header" style={{ pointerEvents: 'auto' }}>
          {!isTourActive && (
            <button
              className="menu-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Menüyü Aç/Kapat"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <div className="header-title-container">
            <h1>İskelet Anatomisi</h1>
            <p>
              {isTourActive
                ? `Rehberli Tur — ${tourStep + 1} / ${TOUR_STEPS.length}`
                : 'Bölgeleri incelemek için soldan seçin veya arayın, detay için kemiklere tıklayın.'}
            </p>
          </div>
          <div className="header-actions">
            {!isTourActive ? (
              <button className="tour-header-btn" onClick={startTour}>
                <Video size={16} />
                <span>Turu Başlat</span>
              </button>
            ) : (
              <button className="tour-header-close-btn" onClick={stopTour}>
                <span>Turu Bittri</span>
              </button>
            )}
            <button className="qr-header-btn qr-mobile-only" onClick={() => setIsQrModalOpen(true)} title="QR Kod ile Paylaş">
              <QrCode size={18} />
            </button>
          </div>
        </header>

        {/* Floating Alt Merkez Butonlar (Desktop) */}
        {!isTourActive && (
          <div className="bottom-center-actions" style={{ pointerEvents: 'auto' }}>
            <button className="tour-start-btn" onClick={startTour}>
              <Video size={20} />
              Turu Başlat
            </button>
            <button className="qr-desktop-btn" onClick={() => setIsQrModalOpen(true)} title="Mobil ile Paylaş">
              <QrCode size={20} />
            </button>
          </div>
        )}

        {/* Floating Turu Bitir Butonu */}
        {isTourActive && (
          <button className="tour-stop-btn" onClick={stopTour} style={{ pointerEvents: 'auto' }}>
            Turu Bitir
          </button>
        )}

        {/* Sol Menü — Tur aktifken gizli */}
        {!isTourActive && (
          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ pointerEvents: 'auto' }}>
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-box"
                placeholder="Kemik ara... (örn: Femur)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="region-list">
              {filteredRegions.length > 0 ? (
                Object.entries(groupedRegions).map(([groupName, regions]) => (
                  regions.length > 0 && (
                    <div key={groupName} className="region-group">
                      <div className="region-group-title">{groupName}</div>
                      {regions.map((region) => (
                        <button
                          key={region.id}
                          className={`region-btn ${activeRegion === region.id ? 'active' : ''}`}
                          onClick={() => handleRegionSelect(region.id)}
                          onMouseEnter={() => setHoveredRegion(region.id)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        >
                          <span
                            className="color-indicator"
                            style={{ backgroundColor: region.color, boxShadow: `0 0 10px ${region.color}` }}
                          />
                          {region.title}
                        </button>
                      ))}
                    </div>
                  )
                ))
              ) : (
                <div style={{ color: '#aaa', fontSize: '0.9rem', padding: '1rem', textAlign: 'center' }}>
                  Kemik bulunamadı.
                </div>
              )}

              {/* Credits - Menü İçinde */}
              <div className="sidebar-credits">
                <div className="sidebar-credits-title">Proje Ekibi</div>
                <div className="sidebar-credits-section">
                  <div className="sidebar-credits-role">Koordinatör</div>
                  <div className="sidebar-credits-name">Ümit Yaşar Kamacı</div>
                </div>
                <div className="sidebar-credits-section">
                  <div className="sidebar-credits-role">Öğrenciler</div>
                  <div className="sidebar-credits-name">Efecan Hasırcı</div>
                  <div className="sidebar-credits-name">Birol Aktaş</div>
                  <div className="sidebar-credits-name">Mehmet Erdem</div>
                  <div className="sidebar-credits-name">Yusuf Burak</div>
                  <div className="sidebar-credits-name">Yusuf Emre Tuğtekin</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📋 Sağ Detay Paneli */}
        {!isTourActive && (
          <div className={`info-panel ${selectedBoneData ? 'open' : 'closed'}`} style={{ pointerEvents: 'auto' }}>
            <div className="bottom-sheet-handle" />
            {selectedBoneData ? (
              <>
                <div className="info-panel-header">
                  <div className="info-panel-title-wrapper">
                    <span className="info-panel-badge" style={{ backgroundColor: activeRegionColor }}>
                      {selectedBone ? selectedBone.toUpperCase() : 'DİSK'}
                    </span>
                    <h2>{selectedBoneData.name.replace(/^[A-Z]\d+\s*–\s*/i, '')}</h2>
                  </div>
                  <button className="info-panel-close" onClick={() => {
                    setSelectedBone(null);
                    if (activeRegion === 'disk') setActiveRegion(null);
                  }}>✕</button>
                </div>

                <div className="info-panel-content">
                  <div className="info-section">
                    <h3 style={{ color: activeRegionColor, opacity: 0.95 }}>Anatomik Fonksiyon</h3>
                    <p>{selectedBoneData.function}</p>
                  </div>

                  <div className="info-section">
                    <h3 style={{ color: activeRegionColor, opacity: 0.95 }}>Sık Görülen Klinik Patolojiler</h3>
                    <div className="pathology-list">
                      {selectedBoneData.pathologies.map((p, i) => (
                        <div key={i} className="pathology-card" style={{ borderLeftColor: activeRegionColor }}>
                          <h4 style={{ color: activeRegionColor }}>{p.name}</h4>
                          <p>{p.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: '#8892b0', fontSize: '0.9rem', textAlign: 'center', margin: 'auto' }}>
                Detayları görmek için modelden bir kemik seçin.
              </div>
            )}
          </div>
        )}

        {/* 🎬 SİNEMATİK TUR KARTI — DESKTOP */}
        {isTourActive && currentTourStep && (
          <div className={`tour-overlay tour-overlay-desktop ${tourCardVisible ? 'visible' : ''}`} style={{ pointerEvents: 'auto' }}>
            <div className="tour-card" style={{ borderColor: `${currentTourStep.color}50` }}>
              <div className="tour-card-stripe" style={{ background: `linear-gradient(90deg, ${currentTourStep.color}, transparent)` }} />
              <div className="tour-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <div className="tour-card-badge" style={{ backgroundColor: currentTourStep.color }}>
                    {tourStep + 1} / {TOUR_STEPS.length}
                  </div>
                  <div className="tour-progress-dots">
                    {TOUR_STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`tour-dot ${i === tourStep ? 'active' : i < tourStep ? 'done' : ''}`}
                        style={i === tourStep ? { backgroundColor: currentTourStep.color, boxShadow: `0 0 8px ${currentTourStep.color}` } : {}}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="tour-card-title" style={{ color: currentTourStep.color }}>{currentTourStep.title}</h2>
                <p className="tour-card-desc">{currentTourStep.description}</p>
              </div>
              <div className="tour-progress-bar-wrap">
                <div
                  className="tour-progress-bar-fill"
                  key={`d-${tourStep}-${isTourPaused}`}
                  style={{ backgroundColor: currentTourStep.color, animationDuration: `${TOUR_DURATION}ms`, animationPlayState: isTourPaused ? 'paused' : 'running' }}
                />
              </div>
            </div>
            <div className="tour-controls">
              <button className="tour-nav-btn" onClick={tourPrev} disabled={tourStep === 0}><ChevronLeft size={18} />Önceki</button>
              <button className="tour-nav-btn tour-nav-pause" onClick={togglePause}>
                {isTourPaused ? <><Play size={14} /> Devam Et</> : <><Square size={14} /> Durdur</>}
              </button>
              {tourStep === TOUR_STEPS.length - 1
                ? <button className="tour-nav-btn" onClick={stopTour}>Bitir</button>
                : <button className="tour-nav-btn" onClick={tourNext}>Sonraki<ChevronRight size={18} /></button>
              }
            </div>
          </div>
        )}

        {/* 🎛️ Kamera Yön Seçici — Tur aktifken gizli */}
        {!isTourActive && (
          <div className="view-selector" style={{ pointerEvents: 'auto' }}>
            <div className="view-selector-title">Kamera Açısı (Yönler)</div>
            <div className="view-selector-buttons">
              <button onClick={() => setCameraViewTrigger({ view: 'anterior', time: Date.now() })}>
                Anterior (Ön)
              </button>
              <button onClick={() => setCameraViewTrigger({ view: 'posterior', time: Date.now() })}>
                Posterior (Arka)
              </button>
              <button onClick={() => setCameraViewTrigger({ view: 'left', time: Date.now() })}>
                Sol
              </button>
              <button onClick={() => setCameraViewTrigger({ view: 'right', time: Date.now() })}>
                Sağ
              </button>
              <button
                className="reset-btn"
                onClick={() => {
                  setCameraViewTrigger({ view: 'reset', time: Date.now() });
                  setActiveRegion(null);
                  setSelectedBone(null);
                }}
              >
                Sıfırla
              </button>
            </div>
          </div>
        )}

        {/* Alt Talimatlar */}
        {!isTourActive && (
          <div className="instruction-toast" style={{ pointerEvents: 'auto' }}>
            <Info size={18} />
            <span className="desktop-instructions">Fare ile döndürün (Sol Tık), Kaydırın (Sağ Tık), Yakınlaştırın (Tekerlek).</span>
            <span className="mobile-instructions">Döndür: Tek parmak | Yakınlaş/Kaydır: İki parmak</span>
          </div>
        )}

        {/* Credits (Ekip) */}
        {!isTourActive && (
          <div className="credits-panel" style={{ pointerEvents: 'auto' }}>
            <div className="credits-title">Proje Ekibi</div>
            <div className="credits-content">
              <div className="credits-section">
                <div className="credits-role">Koordinatör</div>
                <div className="credits-name">Ümit Yaşar Kamacı</div>
              </div>
              <div className="credits-section">
                <div className="credits-role">Öğrenciler</div>
                <div className="credits-name">Efecan Hasırcı</div>
                <div className="credits-name">Birol Aktaş</div>
                <div className="credits-name">Mehmet Erdem</div>
                <div className="credits-name">Yusuf Burak</div>
                <div className="credits-name">Yusuf Emre Tuğtekin</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📱 MOBİL TUR BOTTOM SHEET — ui-overlay dışında, position:fixed */}
      {isTourActive && currentTourStep && (
        <div className={`tour-mobile-sheet ${tourCardVisible ? 'visible' : ''}`}>
          {/* Renkli ince üst şerit */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${currentTourStep.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />

          {/* İlerleme çubuğu */}
          <div className="tour-progress-bar-wrap">
            <div
              className="tour-progress-bar-fill"
              key={`mob-${tourStep}-${isTourPaused}`}
              style={{ backgroundColor: currentTourStep.color, animationDuration: `${TOUR_DURATION}ms`, animationPlayState: isTourPaused ? 'paused' : 'running' }}
            />
          </div>

          <div className="tour-mobile-sheet-body">
            {/* Üst satır: badge + noktalar */}
            <div className="tour-mobile-sheet-top">
              <div className="tour-card-badge" style={{ backgroundColor: currentTourStep.color }}>
                {tourStep + 1} / {TOUR_STEPS.length}
              </div>
              <div className="tour-progress-dots">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`tour-dot ${i === tourStep ? 'active' : i < tourStep ? 'done' : ''}`}
                    style={i === tourStep ? { backgroundColor: currentTourStep.color, boxShadow: `0 0 8px ${currentTourStep.color}` } : {}}
                  />
                ))}
              </div>
            </div>

            {/* Başlık */}
            <h2 className="tour-card-title" style={{ color: currentTourStep.color, fontSize: '1rem', margin: '0.4rem 0 0.3rem' }}>
              {currentTourStep.title}
            </h2>

            {/* Açıklama */}
            <p className="tour-card-desc" style={{ fontSize: '0.76rem', lineHeight: 1.55, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {currentTourStep.description}
            </p>

            {/* Kontrol butonları */}
            <div className="tour-mobile-controls">
              <button className="tour-nav-btn" onClick={tourPrev} disabled={tourStep === 0}>
                <ChevronLeft size={16} />Önceki
              </button>
              <button className="tour-nav-btn tour-nav-pause" onClick={togglePause}>
                {isTourPaused ? <><Play size={13} /> Devam</> : <><Square size={13} /> Durdur</>}
              </button>
              {tourStep === TOUR_STEPS.length - 1
                ? <button className="tour-nav-btn" onClick={stopTour}>Bitir</button>
                : <button className="tour-nav-btn" onClick={tourNext}>Sonraki<ChevronRight size={16} /></button>
              }
            </div>
          </div>
        </div>
      )}

      {/* 📷 QR KOD / PAYLAŞ MODAL */}
      {isQrModalOpen && (
        <div className="qr-modal-overlay" onClick={() => { setIsQrModalOpen(false); setIsQrZoomed(false); }}>
          <div className={`qr-modal-content ${isQrZoomed ? 'zoomed' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => { setIsQrModalOpen(false); setIsQrZoomed(false); }}>
              <X size={20} />
            </button>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#e2e8f0', textAlign: 'center' }}>Siteyi Paylaş</h2>
            
            <div className={`qr-code-wrapper ${isQrZoomed ? 'zoomed' : ''}`} onClick={() => setIsQrZoomed(!isQrZoomed)} title="Büyütmek/Küçültmek için tıklayın">
              <QRCodeSVG
                value={window.location.hostname === 'localhost' ? 'https://istanbulbilgiuniversitesitibbigorun.vercel.app/' : window.location.href}
                size={isQrZoomed ? (window.innerWidth <= 768 ? 260 : 340) : (window.innerWidth <= 768 ? 180 : 280)}
                bgColor={"#ffffff"}
                fgColor={"#dc2626"}
                level={"H"}
                includeMargin={false}
                imageSettings={{
                  src: "/Istanbul_Bilgi_University_icon.png",
                  x: undefined,
                  y: undefined,
                  height: isQrZoomed ? 60 : 48,
                  width: isQrZoomed ? 60 : 48,
                  excavate: true,
                }}
              />
            </div>
            
            <p className="qr-modal-hint" style={{ marginTop: '0.5rem', marginBottom: '1.2rem', fontSize: '0.8rem', color: '#8892b0', textAlign: 'center', lineHeight: 1.4 }}>
              Büyütmek için QR koda tıklayın veya yandaki arkadaşınıza okutun.
            </p>

            <div className="qr-share-buttons" style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button 
                className="qr-action-btn"
                onClick={() => {
                  navigator.clipboard.writeText('https://istanbulbilgiuniversitesitibbigorun.vercel.app/');
                  alert("Link kopyalandı!");
                }}
              >
                Linki Kopyala
              </button>
              
              {navigator.share && (
                <button 
                  className="qr-action-btn primary"
                  onClick={() => {
                    navigator.share({
                      title: 'İskelet Anatomisi',
                      text: 'Bu harika 3D iskelet anatomisi uygulamasını incele!',
                      url: 'https://istanbulbilgiuniversitesitibbigorun.vercel.app/',
                    }).catch(console.error);
                  }}
                >
                  Paylaş
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

