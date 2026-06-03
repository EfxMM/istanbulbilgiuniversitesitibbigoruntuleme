import { useState, useEffect, useRef, useMemo } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertebraData, regionData } from './data';

// Tüm kemik sıralaması
const BONE_ORDER = [
  'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7',
  't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12',
  'l1', 'l2', 'l3', 'l4', 'l5',
  'femur', 'patella', 'tibia', 'fibula',
  'tarsals', 'metatarsals', 'foot_phalanges',
  'humerus', 'radius', 'ulna', 'klavikula', 'kurek_kemigi',
  'carpals', 'metacarpals', 'phalanges',
  'pelvis', 'sacrum', 'coccyx',
  'sternum', 'costae', 'costa_11', 'costa_12',
  'mandibula', 'upper_teeth', 'lower_teeth',
  'disk'
];

const BONE_REGEX = /^(c[1-7]|t(?:[1-9]|1[0-2])|l[1-5])(?:\s|_|$)/i;

function getRegion(id) {
  if (/^c[1-7]$/i.test(id)) return 'cervical';
  if (/^t([1-9]|1[0-2])$/i.test(id)) return 'thoracic';
  if (/^l[1-5]$/i.test(id)) return 'lumbar';
  // Ayak kemikleri kendi başlarına bir bölge
  if (id === 'tarsals' || id === 'metatarsals' || id === 'foot_phalanges') return id;
  // Diğer kemikler kendi başlarına bir bölge
  return id;
}

// ═══════════════════════════════════════════
// Küçük Rozet (sadece C1, C2, FEMUR gibi)
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// Küçük Rozet (sadece C1, C2, FEMUR gibi)
// ═══════════════════════════════════════════
function VertebraBadge({ position, vertebraId, color, onClick }) {
  let shortName = vertebraId.toUpperCase();
  if (vertebraId === 'disk') {
    shortName = 'DİSK';
  } else if (vertebraId === 'costa_11') {
    shortName = 'C11';
  } else if (vertebraId === 'costa_12') {
    shortName = 'C12';
  } else if (vertebraId.length > 3) {
    shortName = vertebraId.substring(0, 3).toUpperCase();
  }
  const colorVars = {
    '--bone-color': color,
    '--bone-color-alpha': `${color}60`,
    '--bone-color-alpha-low': `${color}30`,
  };

  // Determine direction: left-aligned if coordinate X is significantly negative (screen-left)
  const isLeft = position && position[0] < -0.15;

  return (
    <Html position={position} zIndexRange={[50, 0]} style={{ pointerEvents: 'auto' }}>
      <div
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`three-badge-container ${isLeft ? 'left-aligned' : 'right-aligned'}`}
        style={colorVars}
      >
        <div className="three-badge-dot" />
        <div className="three-badge-line" />
        <div className="three-badge-label">
          {shortName}
        </div>
      </div>
    </Html>
  );
}

// ═══════════════════════════════════════════
// Genişletilmiş Detay Kartı (tek kemik için)
// ═══════════════════════════════════════════
function VertebraDetail({ position, vertebraId, color, onClose }) {
  const data = vertebraData[vertebraId] || regionData[vertebraId];
  if (!data) return null;

  let shortName = vertebraId.toUpperCase();
  if (vertebraId === 'disk') {
    shortName = 'DİSK';
  } else if (vertebraId === 'costa_11') {
    shortName = 'C11';
  } else if (vertebraId === 'costa_12') {
    shortName = 'C12';
  } else if (vertebraId.length > 3) {
    shortName = vertebraId.substring(0, 3).toUpperCase();
  }
  const colorVars = {
    '--bone-color': color,
    '--bone-color-alpha': `${color}60`,
    '--bone-color-alpha-low': `${color}30`,
    '--bone-color-alpha-very-low': `${color}25`
  };

  // Determine direction: left-aligned if coordinate X is significantly negative (screen-left)
  const isLeft = position && position[0] < -0.15;

  return (
    <Html position={position} center={false} zIndexRange={[100, 0]} style={{ pointerEvents: 'auto' }}>
      <div className={`three-detail-container ${isLeft ? 'left-aligned' : 'right-aligned'}`} style={colorVars}>
        <div className="three-detail-dot" />
        <div className="three-detail-line" />
        <div className="three-detail-card">
          <div className="three-detail-header">
            <div className="three-detail-title-wrapper">
              <span className="three-detail-badge">
                {shortName}
              </span>
              <span className="three-detail-title">
                {data.name.replace(/^[A-Z]\d+\s*–\s*/i, '')}
              </span>
            </div>
            <div
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="three-detail-close"
            >
              ✕
            </div>
          </div>

          <div className="three-detail-section-box">
            <div className="three-detail-section-title">
              Fonksiyon
            </div>
            <p className="three-detail-section-text">
              {data.function}
            </p>
          </div>

          <div className="three-detail-pathologies-title">
            Sık Görülen Patolojiler
          </div>

          {data.pathologies.map((p, i) => (
            <div key={i} className="three-detail-pathology-card">
              <div className="three-detail-pathology-name">
                {p.name}
              </div>
              <div className="three-detail-pathology-desc">
                {p.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
}

export default function SpineModel({ activeRegion, setActiveRegion, hoveredRegion, selectedBone, setSelectedBone, cameraViewTrigger, modelPath, isTourActive }) {
  const { scene } = useGLTF(modelPath);
  const { camera, controls } = useThree();

  const [modelOffset, setModelOffset] = useState(new THREE.Vector3(0, 0, 0));
  const [modelScale, setModelScale] = useState(1);
  const [bonePositions, setBonePositions] = useState({});
  const expandedVertebra = selectedBone;
  const setExpandedVertebra = setSelectedBone;
  const [clickedPosMap, setClickedPosMap] = useState({});
  const initialized = useRef(false);

  useEffect(() => {
    if (!scene || initialized.current) return;

    scene.updateWorldMatrix(true, true);

    const box = new THREE.Box3().setFromObject(scene);
    if (box.isEmpty()) return;

    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const offset = new THREE.Vector3(-center.x, -center.y, -center.z);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModelOffset(offset);

    const targetSize = 18;
    const scale = maxDim > 0 ? (targetSize / maxDim) : 1;
    setModelScale(scale);

    camera.position.set(0, 0, 22);
    camera.lookAt(0, 0, 0);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }

    const bonePositionMap = {};
    const rHandJoint = new THREE.Vector3();
    const rMidJoint = new THREE.Vector3();
    let foundRHand = false;
    let foundRMid = false;

    scene.traverse((child) => {
      const lowerName = (child.name || '').toLowerCase();
      
      // Geçici debug: Tüm mesh isimlerini yazdır
      if (child.isMesh && child.name) {
        console.log(`[GLB Mesh] "${child.name}" (Parent: "${child.parent?.name || 'none'}")`);
      }
      
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#d1d5db', roughness: 0.8, metalness: 0.05,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // Capture right hand joints for placing carpals/metacarpals/phalanges labels (always by exact name)
      if (child.name) {
        if (lowerName === 'rhand_020') {
          child.getWorldPosition(rHandJoint);
          foundRHand = true;
        }
        if (lowerName === 'rmid2_029') {
          child.getWorldPosition(rMidJoint);
          foundRMid = true;
        }
      }

      // Identify the bone ID (look up hierarchy if child itself doesn't match)
      let id = null;
      let temp = child;
      let matchedName = '';

      // First, check if there is an explicit 11th or 12th rib in the ancestry chain
      // to prevent the mesh-level "ribs" name from shadowing "11 costalar" or "12 costalar".
      let checkTemp = child;
      while (checkTemp) {
        if (checkTemp.name) {
          const tName = checkTemp.name.toLowerCase();
          if (tName.includes('11') && (tName.includes('costa') || tName.includes('kaburga') || tName.includes('rib'))) {
            matchedName = 'costa_11';
            break;
          }
          if (tName.includes('12') && (tName.includes('costa') || tName.includes('kaburga') || tName.includes('rib'))) {
            matchedName = 'costa_12';
            break;
          }
        }
        checkTemp = checkTemp.parent;
      }

      // If we didn't find 11 or 12 ribs, do the standard hierarchy search
      if (!matchedName) {
        temp = child;
        while (temp) {
          if (temp.name) {
            const tName = temp.name.toLowerCase();
            if (
              tName.includes('göğüs') ||
              tName.includes('gögüs') ||
              tName.includes('costae') ||
              tName.includes('ribs') ||
              tName.includes('diş') ||
              tName.includes('teeth') ||
              tName.includes('mandibula') ||
              tName.includes('lowerjaw') ||
              tName.includes('metacarpals') ||
              tName.includes('carpals') ||
              tName.includes('aphalanges') ||
              tName.includes('phalanges') ||
              tName.includes('metatarsals') || tName.includes('metatarsal') ||
              tName.includes('tarsals') || tName.includes('tarsal') ||
              tName.includes('femur') ||
              tName.includes('patella') ||
              tName.includes('tibia') ||
              tName.includes('fibula') ||
              tName.includes('humerus') ||
              tName.includes('radius') ||
              tName.includes('ulna') ||
              tName.includes('klavikula') ||
              tName.includes('kürek') || tName.includes('scapula') ||
              (tName.includes('pelvis') && !tName.includes('eleman')) ||
              tName.includes('sacrum') ||
              tName.includes('coccyx') ||
              tName.includes('sternum') ||
              tName.includes('disk') || tName.includes('diskler') ||
              /^(c[1-7]|t(?:[1-9]|1[0-2])|l[1-5])(?:\s|_|$)/i.test(tName)
            ) {
              matchedName = tName;
              break;
            }
          }
          temp = temp.parent;
        }
      }

      if (matchedName) {
        if (matchedName === 'costa_11') {
          id = 'costa_11';
        } else if (matchedName === 'costa_12') {
          id = 'costa_12';
        } else {
          const match = matchedName.match(BONE_REGEX);
          if (match) {
            id = match[1];
          } else if (matchedName.includes('femur')) id = 'femur';
          else if (matchedName.includes('patella')) id = 'patella';
          else if (matchedName.includes('tibia')) id = 'tibia';
          else if (matchedName.includes('fibula')) id = 'fibula';
          else if (matchedName.includes('humerus')) id = 'humerus';
          else if (matchedName.includes('radius')) id = 'radius';
          else if (matchedName.includes('ulna')) id = 'ulna';
          else if (matchedName.includes('klavikula')) id = 'klavikula';
          else if (matchedName.includes('kürek') || matchedName.includes('scapula')) id = 'kurek_kemigi';
          else if (matchedName.includes('pelvis') && !matchedName.includes('eleman')) id = 'pelvis';
          else if (matchedName.includes('sacrum')) id = 'sacrum';
          else if (matchedName.includes('coccyx')) id = 'coccyx';
          else if (matchedName.includes('sternum')) id = 'sternum';
          else if (matchedName.includes('disk') || matchedName.includes('diskler')) id = 'disk';
          else if (matchedName.includes('metacarpals')) id = 'metacarpals';
          else if (matchedName.includes('carpals')) id = 'carpals';
          else if (matchedName.includes('aphalanges')) id = 'foot_phalanges';
          else if (matchedName.includes('phalanges')) {
            // Phalanges hem el hem ayak için kullanılıyor, parent'a bakarak ayırt edelim
            let checkParent = temp;
            let isFootPhalanges = false;
            while (checkParent) {
              const parentName = (checkParent.name || '').toLowerCase();
              if (parentName.includes('foot') || parentName.includes('ayak') || 
                  parentName.includes('rfoot') || parentName.includes('lfoot') ||
                  parentName.includes('rtoes') || parentName.includes('ltoes') ||
                  parentName.includes('toes') || parentName.includes('toe') ||
                  parentName.includes('metatarsal') || parentName.includes('tarsal') ||
                  parentName.includes('ankle') || parentName.includes('bilek')) {
                isFootPhalanges = true;
                break;
              }
              // Eğer hand, el, finger gibi kelimeler varsa kesinlikle el parmağı
              if (parentName.includes('hand') || parentName.includes('el') ||
                  parentName.includes('finger') || parentName.includes('parmak') ||
                  parentName.includes('rhand') || parentName.includes('lhand')) {
                isFootPhalanges = false;
                break;
              }
              checkParent = checkParent.parent;
            }
            id = isFootPhalanges ? 'foot_phalanges' : 'phalanges';
          }
          else if (matchedName.includes('metatarsals') || matchedName.includes('metatarsal')) id = 'metatarsals';
          else if (matchedName.includes('tarsals') || matchedName.includes('tarsal')) id = 'tarsals';
          else if (matchedName.includes('göğüs') || matchedName.includes('gögüs') || matchedName.includes('costae') || matchedName.includes('ribs')) id = 'costae';
          else if (matchedName.includes('11')) id = 'costa_11';
          else if (matchedName.includes('12')) id = 'costa_12';
          else if (matchedName.includes('üst') && matchedName.includes('diş')) id = 'upper_teeth';
          else if (matchedName.includes('alt') && matchedName.includes('diş')) id = 'lower_teeth';
          else if (matchedName.includes('upperteeth')) id = 'upper_teeth';
          else if (matchedName.includes('lowerteeth')) id = 'lower_teeth';
          else if (matchedName.includes('mandibula') || matchedName.includes('lowerjaw')) id = 'mandibula';
        }
      }

      if (id && child.isMesh) {
        console.log(`[Anatomy Debug] Matched mesh "${child.name}" to ID "${id}" (Region: "${getRegion(id)}")`);
      }
      if (id) {
        const isVertebra = /^(c[1-7]|t(?:[1-9]|1[0-2])|l[1-5])$/i.test(id);

        if (isVertebra) {
          // Omurlar için sadece Mesh'lerin görsel merkezini (bounding box center) kullanıyoruz.
          if (child.isMesh) {
            child.userData.vertebraId = id;
            child.userData.region = getRegion(id);

            const pos = new THREE.Vector3();
            const box = new THREE.Box3().setFromObject(child);
            if (!box.isEmpty()) {
              box.getCenter(pos);
            } else {
              child.getWorldPosition(pos);
            }
            bonePositionMap[id] = pos;
          }
        } else {
          // Ekstremiteler (kol, bacak, pelvis, sternum vb.) için
          if (child.isMesh) {
            child.userData.vertebraId = id;
            child.userData.region = getRegion(id);
          }

          // Tibia (kaval), Fibula (baldır), Pelvis (leğen kemiği), Kürek Kemiği (scapula), Klavikula (köprücük), Kaburgalar, Dişler, Mandibula ve Ayak kemikleri için özel yerleşimler:
          if (id === 'tibia' || id === 'fibula' || id === 'pelvis' || id === 'kurek_kemigi' || id === 'klavikula' || id === 'costae' || id === 'costa_11' || id === 'costa_12' || id === 'upper_teeth' || id === 'lower_teeth' || id === 'mandibula' || id === 'tarsals' || id === 'metatarsals' || id === 'foot_phalanges') {
            if (id === 'pelvis') {
              // Pelvisin etiketini ve noktasını tam ortadan (Sacrum ve Coccyx ile çakışan alandan) kurtarıp,
              // sağ leğen kemiği kanadı (iliac crest) üzerine şık bir şekilde yerleştiriyoruz.
              if (child.isBone || !bonePositionMap['pelvis']) {
                const pos = new THREE.Vector3();
                if (child.isMesh && !child.isBone) {
                  const box = new THREE.Box3().setFromObject(child);
                  if (!box.isEmpty()) {
                    box.getCenter(pos);
                  } else {
                    child.getWorldPosition(pos);
                  }
                } else {
                  child.getWorldPosition(pos);
                }

                pos.x -= 1.0; // Kalça kemiği sağ kanadı üzerine milimetrik yerleştir (havada asılı kalmasın)
                pos.y += 0.5; // Üst leğen kemiği kenarına (iliac crest) doğru hafifçe kaldır
                pos.z += 0.5; // Okun çıkacağı yere doğru hafifçe öne çek
                bonePositionMap[id] = pos;
              }
            } else if (id === 'kurek_kemigi') {
              // Kürek kemiğinin etiket noktasını omuz ekleminden kurtarıp sağ scapula gövdesine hizalamak için rScapula kemiğini kullanıyoruz.
              if (lowerName.includes('rscapula')) {
                const pos = new THREE.Vector3();
                child.getWorldPosition(pos);

                pos.x += 0.5; // Sağ kürek kemiğinin düz kanadı üzerine kaydır
                pos.y -= 0.6; // Kürek kemiğinin ortasına doğru hafifçe aşağı kaydır
                pos.z -= 0.2; // Sırta yerleşmesi için hafifçe arkaya çek
                bonePositionMap[id] = pos;
              }
            } else if (id === 'klavikula') {
              // Klavikula etiket noktasını "2 klavikula" mesh'inin merkezinden (göğüs ortasından) alıp,
              // sağ köprücük kemiğinin üzerine denk gelecek şekilde sağa kaydırıyoruz.
              if (lowerName.includes('klavikula')) {
                const pos = new THREE.Vector3();
                if (child.isMesh) {
                  const box = new THREE.Box3().setFromObject(child);
                  if (!box.isEmpty()) {
                    box.getCenter(pos);
                  } else {
                    child.getWorldPosition(pos);
                  }
                } else {
                  child.getWorldPosition(pos);
                }

                pos.x -= 1.6; // Göğüs ortasındaki merkezden sağ köprücük kemiğinin üzerine kaydır
                pos.y += 0.2; // Hafifçe yukarı kaldır
                pos.z += 0.3; // Hafifçe öne çek
                bonePositionMap[id] = pos;
              }
            } else if (id === 'costae' || id === 'costa_11' || id === 'costa_12') {
              // Kaburga ve Yüzen kaburga etiket noktalarını göğüs merkezinden (veya sırt ortasından) alıp,
              // sağ taraftaki kaburgaların üzerine denk gelecek şekilde sağa/dışa kaydırıyoruz.
              if (child.isMesh && !bonePositionMap[id]) {
                const pos = new THREE.Vector3();
                const box = new THREE.Box3().setFromObject(child);
                if (!box.isEmpty()) {
                  box.getCenter(pos);
                } else {
                  child.getWorldPosition(pos);
                }

                if (id === 'costae') {
                  pos.x -= 1.1; // Sağ yan kaburgalar dış duvarı üzerine tam oturt (havada asılı kalmasın)
                  pos.y -= 0.2; // Göğüs kafesinin dikey olarak ortasına doğru
                  pos.z += 1.0; // Ön-dış kısma doğru çıkar
                } else if (id === 'costa_11') {
                  pos.x -= 0.70; // Sağ alt yüzen kaburga üzerine tam oturt (havada asılı kalmasın)
                  pos.y -= 0.1; // Yüzen kaburga 11 yüksekliğine uygun hafif dikey kaydırma
                  pos.z += 0.6; // Kemik yüzeyinden dışarı öne çek
                } else if (id === 'costa_12') {
                  pos.x -= 0.55; // Sağ en alt yüzen kaburga üzerine tam oturt (havada asılı kalmasın)
                  pos.y -= 0.1; // Yüzen kaburga 12 yüksekliğine uygun hafif dikey kaydırma
                  pos.z += 0.5; // Kemik yüzeyinden dışarı öne çek
                }
                bonePositionMap[id] = pos;
              }
            } else if (id === 'upper_teeth' || id === 'lower_teeth') {
              // Dişler için özel pozisyonlama
              if (child.isMesh && !bonePositionMap[id]) {
                const pos = new THREE.Vector3();
                const box = new THREE.Box3().setFromObject(child);
                if (!box.isEmpty()) {
                  box.getCenter(pos);
                } else {
                  child.getWorldPosition(pos);
                }

                if (id === 'upper_teeth') {
                  // Üst dişler - kafanın ön kısmında, üst çene hizasında
                  pos.x -= 0.3; // Sağ tarafa kaydır
                  pos.y += 0.1; // Hafifçe yukarı
                  pos.z += 0.8; // Öne çek (yüzün ön tarafına)
                } else if (id === 'lower_teeth') {
                  // Alt dişler - üst dişlerin biraz altında
                  pos.x -= 0.3; // Sağ tarafa kaydır
                  pos.y -= 0.2; // Aşağı (alt çene)
                  pos.z += 0.8; // Öne çek (yüzün ön tarafına)
                }
                bonePositionMap[id] = pos;
              }
            } else if (id === 'mandibula') {
              // Mandibula (alt çene kemiği) için özel pozisyonlama
              if (child.isMesh && !bonePositionMap[id]) {
                const pos = new THREE.Vector3();
                const box = new THREE.Box3().setFromObject(child);
                if (!box.isEmpty()) {
                  box.getCenter(pos);
                } else {
                  child.getWorldPosition(pos);
                }

                // Mandibula - yüzün ön kısmında, alt dişlerin hemen altında
                pos.x -= 0.4; // Sağ tarafa kaydır
                pos.y -= 0.4; // Alt çene hizasına (aşağı)
                pos.z += 0.7; // Öne çek (yüzün ön tarafına)
                bonePositionMap[id] = pos;
              }
            } else if (id === 'tarsals' || id === 'metatarsals' || id === 'foot_phalanges') {
              // Ayak kemikleri için özel pozisyonlama
              if (child.isMesh && !bonePositionMap[id]) {
                const pos = new THREE.Vector3();
                const box = new THREE.Box3().setFromObject(child);
                if (!box.isEmpty()) {
                  box.getCenter(pos);
                } else {
                  child.getWorldPosition(pos);
                }

                if (id === 'tarsals') {
                  // Ayak bilek kemikleri - ayak bileği hizasında
                  pos.x -= 0.3; // Sağ ayak bileği üzerine
                  pos.y -= 0.8; // Çok daha aşağı (pembe kemiğin ortasına)
                  pos.z += 0.4; // Daha öne (ayak bileği kemiğine)
                } else if (id === 'metatarsals') {
                  // Ayak tarak kemikleri - ayak ortası
                  pos.x -= 0.3; // Sağ ayak üzerine
                  pos.y -= 0.1; // Hafifçe aşağı
                  pos.z += 0.5; // Ayak ortasına doğru
                } else if (id === 'foot_phalanges') {
                  // Ayak parmak kemikleri - ayak ucu
                  pos.x -= 0.3; // Sağ ayak üzerine
                  pos.y -= 0.2; // Daha aşağı
                  pos.z += 0.7; // Ayak ucuna doğru
                }
                bonePositionMap[id] = pos;
              }
            } else if (child.isBone && (lowerName.includes('rtibia') || lowerName.includes('rfibula'))) {
              const pos = new THREE.Vector3();
              child.getWorldPosition(pos);

              if (id === 'tibia') {
                pos.y -= 1.8; // Kaval kemiğinin şık ve net duracağı orta hizaya indir
                pos.x -= 0.08; // Milimetrik olarak kaval kemiği merkezine yanaştır
              } else {
                pos.y -= 2.6; // Baldır kemiğinin biraz daha aşağısına indir (Tibia ile üst üste binmesin)
                pos.x -= 0.35; // Dıştaki ince baldır kemiğine doğru dışa (negatif X'e) kaydır
              }
              bonePositionMap[id] = pos;
            }
          } else {
            // Diğer ekstremiteler (humerus, femur, pelvis vb.) için orijinal joint/mesh mantığı
            if (child.isBone || !bonePositionMap[id]) {
              const pos = new THREE.Vector3();
              if (child.isMesh && !child.isBone) {
                const box = new THREE.Box3().setFromObject(child);
                if (!box.isEmpty()) {
                  box.getCenter(pos);
                } else {
                  child.getWorldPosition(pos);
                }
              } else {
                child.getWorldPosition(pos);
              }
              bonePositionMap[id] = pos;
            }
          }
        }
      }
    });

    if (foundRHand) {
      const carpalsPos = rHandJoint.clone();
      carpalsPos.x -= 0.08;
      carpalsPos.y += 0.05;
      carpalsPos.z += 0.18;
      bonePositionMap['carpals'] = carpalsPos;

      const metacarpalsPos = rHandJoint.clone();
      metacarpalsPos.x -= 0.18;
      metacarpalsPos.y -= 0.35;
      metacarpalsPos.z += 0.2;
      bonePositionMap['metacarpals'] = metacarpalsPos;
    }

    if (foundRMid) {
      const phalangesPos = rMidJoint.clone();
      phalangesPos.x -= 0.1;
      phalangesPos.y -= 0.05;
      phalangesPos.z += 0.2;
      bonePositionMap['phalanges'] = phalangesPos;
    }

    setBonePositions(bonePositionMap);
    initialized.current = true;
  }, [scene, camera, controls]);

  // ──── BOYAMA ────
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh && child.userData.region) {
        child.material.color.set('#d1d5db');
        child.material.emissive.set('#000000');
        if (activeRegion && child.userData.region === activeRegion) {
          const regionInfo = regionData[activeRegion];
          const matColor = new THREE.Color(regionInfo ? regionInfo.color : '#ffffff');
          child.material.color.copy(matColor);
          child.material.emissive.copy(matColor).multiplyScalar(0.45);
        } else if (hoveredRegion && child.userData.region === hoveredRegion) {
          const regionInfo = regionData[hoveredRegion];
          const matColor = new THREE.Color(regionInfo ? regionInfo.color : '#ffffff');
          child.material.color.copy(matColor);
          child.material.emissive.copy(matColor).multiplyScalar(0.2); // Tıklanmadığı ama üzerine gelindiği için biraz daha az parlak
        }
      }
    });
  }, [activeRegion, hoveredRegion, scene]);

  // ──── KAMERA ODAKLANMA (SMOOTH ZOOM) ────
  const targetData = useRef({ target: new THREE.Vector3(0, 0, 0), camera: new THREE.Vector3(0, 0, 22), active: false });

  useEffect(() => {
    if (!initialized.current || !controls || !camera) return;

    let repBoneId = null;
    let distance = 22; // Uzak varsayılan

    if (expandedVertebra) {
      repBoneId = expandedVertebra;
      distance = 6; // Detay için çok yakın
    } else if (activeRegion) {
      if (activeRegion === 'cervical') repBoneId = 'c4';
      else if (activeRegion === 'thoracic') repBoneId = 't6';
      else if (activeRegion === 'lumbar') repBoneId = 'l3';
      else repBoneId = activeRegion;
      distance = 12; // Bölge için orta mesafe
    }

    if (repBoneId && bonePositions[repBoneId]) {
      const rawPos = bonePositions[repBoneId];
      // Ham kemik pozisyonunu, modele uyguladığımız scale ve offset'e göre gerçek dünya koordinatlarına çeviriyoruz
      const bonePos = rawPos.clone().multiplyScalar(modelScale).add(modelOffset);

      targetData.current.target.copy(bonePos);

      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      if (dir.lengthSq() === 0) dir.set(0, 0, 1);

      targetData.current.camera.copy(bonePos).add(dir.multiplyScalar(distance));
      targetData.current.active = true;
    } else if (!activeRegion && !expandedVertebra) {
      targetData.current.target.set(0, 0, 0);
      const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      if (dir.lengthSq() === 0) dir.set(0, 0, 1);
      targetData.current.camera.copy(targetData.current.target).add(dir.multiplyScalar(22));
      targetData.current.active = true;
    }
  }, [activeRegion, expandedVertebra, bonePositions, camera, controls]);

  useFrame((state, delta) => {
    if (!controls || !targetData.current.active) return;
    const tData = targetData.current;

    // Tur aktifken çok daha yavaş, yumuşak ve sinematik (1.8), normal tıklamalarda daha hızlı (5)
    const speed = isTourActive ? 1.8 : 5;
    const lerpFactor = 1 - Math.exp(-speed * delta);
    
    controls.target.lerp(tData.target, lerpFactor);
    camera.position.lerp(tData.camera, lerpFactor);
    controls.update();

    if (controls.target.distanceTo(tData.target) < 0.05 && camera.position.distanceTo(tData.camera) < 0.05) {
      tData.active = false;
    }
  });

  // Kullanıcı fareyle döndürmeye/kaydırmaya başladığında kamera animasyonunu durdur
  useEffect(() => {
    if (!controls) return;
    const stopAnim = () => { targetData.current.active = false; };
    controls.addEventListener('start', stopAnim);
    return () => controls.removeEventListener('start', stopAnim);
  }, [controls]);

  // Yön kontrolleri tıklandığında kamerayı ilgili açıya uçur
  useEffect(() => {
    if (!cameraViewTrigger || !controls || !camera) return;
    const { view } = cameraViewTrigger;

    const target = new THREE.Vector3(0, 0, 0);
    const cameraPos = new THREE.Vector3();
    const distance = 22; // Varsayılan mesafe

    if (view === 'anterior') {
      cameraPos.set(0, 0, distance);
    } else if (view === 'posterior') {
      cameraPos.set(0, 0, -distance);
    } else if (view === 'left') {
      cameraPos.set(-distance, 0, 0);
    } else if (view === 'right') {
      cameraPos.set(distance, 0, 0);
    } else if (view === 'reset') {
      cameraPos.set(0, 0, 22);
    } else if (view === '__tour__') {
      // Tur modu: boneId ile pozisyonu bul, kamerayı o kemiğe odakla
      const { boneId } = cameraViewTrigger;
      const rawPos = bonePositions[boneId];
      if (rawPos) {
        const bonePos = rawPos.clone().multiplyScalar(modelScale).add(modelOffset);
        targetData.current.target.copy(bonePos);
        
        // Kemik tipine göre özel sinematik kamera açıları (offset)
        let offset = new THREE.Vector3(3, 2, 14); // Varsayılan
        
        switch(boneId) {
          case 'mandibula':
            offset.set(0, 1, 9); // Hafif önden ve yakından
            break;
          case 'c1':
            offset.set(2, 1.5, 8); // Servikal için daha yakın ve hafif sağdan
            break;
          case 't6':
            offset.set(4, 2, 12);
            break;
          case 'l3':
            offset.set(5, 3, 14);
            break;
          case 'disk':
            offset.set(3, 1, 8); // Disklere çok yakın
            break;
          case 'costae':
            offset.set(8, 2, 16); // Göğüs kafesini görecek kadar geniş
            break;
          case 'klavikula':
            offset.set(4, 3, 10);
            break;
          case 'humerus':
            offset.set(10, 0, 14); // Kol için daha dışarıdan
            break;
          case 'pelvis':
            offset.set(0, 4, 18); // Pelvis için tam önden ve geniş
            break;
          case 'femur':
            offset.set(6, 2, 18);
            break;
          default:
            offset.set(3, 2, 14);
        }
        
        targetData.current.camera.copy(bonePos).add(offset);
      } else {
        targetData.current.target.set(0, 0, 0);
        targetData.current.camera.set(0, 0, 22);
      }
      targetData.current.active = true;
      return;
    }

    targetData.current.target.copy(target);
    targetData.current.camera.copy(cameraPos);
    targetData.current.active = true;
  }, [cameraViewTrigger, camera, controls, bonePositions, modelScale, modelOffset]);

  useEffect(() => { setExpandedVertebra(null); }, [activeRegion]);

  // Seçili bölgedeki kemikleri filtrele
  const activeAnnotations = useMemo(() => {
    if (!activeRegion) return [];
    return BONE_ORDER
      .filter(id => getRegion(id) === activeRegion && bonePositions[id])
      .map(id => ({ id, position: bonePositions[id] }));
  }, [activeRegion, bonePositions]);

  const handlePointerDown = (e) => {
    if (isTourActive) return;
    targetData.current.active = false; // Stop camera animation if user interacts
    e.stopPropagation();
    if (e.object && e.object.userData.region) {
      setActiveRegion(e.object.userData.region);
      if (e.object.userData.vertebraId) {
        setExpandedVertebra(e.object.userData.vertebraId);
        if (e.point) {
          const localPoint = e.point.clone();
          scene.worldToLocal(localPoint);
          setClickedPosMap(prev => ({ ...prev, [e.object.userData.vertebraId]: localPoint }));
        }
      }
    }
  };

  return (
    <group scale={modelScale}>
      <group position={modelOffset} dispose={null}>
        <primitive
          object={scene}
          onPointerDown={handlePointerDown}
          onPointerOver={() => { if (!isTourActive) document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        />

        {/* ═══ ANNOTATION SİSTEMİ ═══ */}
        {activeAnnotations.map((item) => {
          const color = regionData[activeRegion]?.color || '#fff';
          const basePos = expandedVertebra === item.id && clickedPosMap[item.id] ? [clickedPosMap[item.id].x, clickedPosMap[item.id].y, clickedPosMap[item.id].z] : [item.position.x, item.position.y, item.position.z];

          if (expandedVertebra) {
            if (item.id === expandedVertebra) {
              return (
                <VertebraDetail
                  key={item.id}
                  position={basePos}
                  vertebraId={item.id}
                  color={color}
                  onClose={() => setExpandedVertebra(null)}
                />
              );
            }
            return null;
          }

          return (
            <VertebraBadge
              key={item.id}
              position={[item.position.x, item.position.y, item.position.z]}
              vertebraId={item.id}
              color={color}
              onClick={() => {
                setExpandedVertebra(item.id);
                setClickedPosMap(prev => ({ ...prev, [item.id]: item.position }));
              }}
            />
          );
        })}
      </group>
    </group>
  );
}

useGLTF.preload('/fullpaket.glb');
