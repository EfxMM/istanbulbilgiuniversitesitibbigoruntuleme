import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Info, Search, Menu, X } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import SpineModel from './SpineModel';
import { pathologyData, vertebraData, regionData } from './data';
import './index.css';

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

  const handleRegionSelect = (regionId) => {
    setActiveRegion(activeRegion === regionId ? null : regionId);
    setSelectedBone(null);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting a region
  };

  const filteredRegions = Object.values(pathologyData).filter(region =>
    region.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kemikleri mantıksal kategorilere ayırma
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

  return (
    <div className="app-container">
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
                modelPath="/fullpaket.glb"
                activeRegion={activeRegion}
                setActiveRegion={setActiveRegion}
                hoveredRegion={hoveredRegion}
                selectedBone={selectedBone}
                setSelectedBone={setSelectedBone}
                cameraViewTrigger={cameraViewTrigger}
              />
              <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2} far={10} />
            </React.Suspense>

            <EffectComposer disableNormalPass>
              <Bloom mipmapBlur intensity={0.15} luminanceThreshold={0.4} luminanceSmoothing={0.1} />
            </EffectComposer>

            <OrbitControls
              makeDefault
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
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
          <button 
            className="menu-toggle-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Menüyü Aç/Kapat"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="header-title-container">
            <h1>İskelet Anatomisi</h1>
            <p>Bölgeleri incelemek için soldan seçin veya arayın, detay için kemiklere tıklayın.</p>
          </div>
        </header>

        {/* Sol Menü (Arama ve Liste) */}
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
                <div className="sidebar-credits-role">Öğretmen</div>
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

        {/* 📋 Sağ Detay Paneli (Sağdan kayarak açılan şık cam panel) */}
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

        {/* 🎛️ Kamera Yön Seçici Kontrolleri */}
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

        {/* Alt Talimatlar */}
        <div className="instruction-toast" style={{ pointerEvents: 'auto' }}>
          <Info size={18} />
          <span className="desktop-instructions">Fare ile döndürün (Sol Tık), Kaydırın (Sağ Tık), Yakınlaştırın (Tekerlek).</span>
          <span className="mobile-instructions">Döndür: Tek parmak | Yakınlaş/Kaydır: İki parmak</span>
        </div>

        {/* Credits (Ekip) */}
        <div className="credits-panel" style={{ pointerEvents: 'auto' }}>
          <div className="credits-title">Proje Ekibi</div>
          <div className="credits-content">
            <div className="credits-section">
              <div className="credits-role">Öğretmen</div>
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
      </div>
      <SpeedInsights />
    </div>
  );
}
