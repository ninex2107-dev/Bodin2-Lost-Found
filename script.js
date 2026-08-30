// ตั้งค่า Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDnR8htQoEVm9qcEpz1dxJKoZxQwxNoUcw",
  authDomain: "bodin2-lost-found.firebaseapp.com",
  projectId: "bodin2-lost-found",
  storageBucket: "bodin2-lost-found.firebasestorage.app",
  messagingSenderId: "366439923477",
  appId: "1:366439923477:web:28d23fabda49e02caa731c",
  measurementId: "G-W0VKJ5KXBP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let itemsData = [];
let currentFilter = 'all';

// ระบบ Numpad
let currentPin = '';
let pinResolveCallback = null;

function showPinModal() {
    return new Promise((resolve) => {
        const modalEl = document.getElementById('pinModal');
        if (!modalEl) {
            alert("หน้าต่างรหัสผ่านโหลดไม่สำเร็จ (อาจเกิดจากแคชค้าง) ให้เปิดเว็บใหม่อีกครั้งครับ");
            resolve(false);
            return;
        }
        currentPin = '';
        updatePinDisplay();
        modalEl.classList.add('active');
        pinResolveCallback = resolve;
    });
}

window.pressNum = function(num) {
    if (currentPin.length < 4) {
        currentPin += num;
        updatePinDisplay();
    }
}

window.pressDel = function() {
    if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        updatePinDisplay();
    }
}

function updatePinDisplay() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (dot) {
            if (i <= currentPin.length) {
                dot.textContent = '*';
                dot.classList.add('active');
            } else {
                dot.textContent = '';
                dot.classList.remove('active');
            }
        }
    }
}

window.closePinModal = function(success) {
    const modalEl = document.getElementById('pinModal');
    if(modalEl) modalEl.classList.remove('active');
    if (pinResolveCallback) {
        pinResolveCallback(success);
        pinResolveCallback = null;
    }
}

window.confirmPinModal = function() {
    if (currentPin === "1234") {
        closePinModal(true);
    } else {
        alert("❌ รหัสผ่านไม่ถูกต้อง!");
        currentPin = '';
        updatePinDisplay();
    }
}

// คัดกรองคำหยาบ
const badWordsList = ["เหี้ย", "สัส", "ควย", "เย็ด", "หี", "แตด", "พ่อง", "แม่ง", "เสือก", "ควาย", "fuck", "shit", "อีเวร"];

function containsBadWords(text) {
    if (!text) return false;
    return badWordsList.some(word => text.includes(word));
}

function renderCards(dataToRender) {
    const container = document.getElementById('cardsContainer');
    if(!container) return;
    container.innerHTML = '';

    if (dataToRender.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">ยังไม่มีประกาศสิ่งของในระบบ</p>`;
        return;
    }

    dataToRender.forEach(item => {
        const isLost = item.type === 'lost';
        const badgeClass = isLost ? 'badge-lost' : 'badge-found';
        const badgeText = isLost ? 'ของหาย' : 'เก็บได้';
        const fallbackImage = isLost ? 'https://placehold.co/400x250/2a1b38/ffffff?text=Lost+Item' : 'https://placehold.co/400x250/1b382c/ffffff?text=Found+Item';
        
        let dateStr = item.date;
        try {
            const dateObj = new Date(item.date);
            dateStr = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch(e) {}

        const cardHTML = `
            <div class="card glass">
                <div class="card-img-wrapper">
                    <span class="card-badge ${badgeClass}">${badgeText}</span>
                    <img src="${item.image || fallbackImage}" alt="${item.name}" onerror="this.src='${fallbackImage}'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-desc">${item.details || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                    
                    <div class="card-meta">
                        <div><i class="fas fa-map-marker-alt"></i> ${item.location}</div>
                        <div><i class="fas fa-calendar-alt"></i> ${dateStr}</div>
                    </div>
                    
                    <div class="card-contact">
                        <i class="fas fa-address-book"></i> ติดต่อ: ${item.contact}
                    </div>

                    <button class="delete-btn" onclick="deleteItem('${item.id}')">
                        <i class="fas fa-trash-alt"></i> ลบประกาศนี้
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function initRealtimeData() {
    db.collection("items").orderBy("createdAt", "desc").onSnapshot((querySnapshot) => {
        itemsData = [];
        querySnapshot.forEach((doc) => {
            itemsData.push({ id: doc.id, ...doc.data() });
        });
        filterData();
    }, (error) => {
        console.error("Error fetching data: ", error);
    });
}

function filterData() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filtered = itemsData.filter(item => {
        const matchType = currentFilter === 'all' || item.type === currentFilter;
        const matchSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.location.toLowerCase().includes(searchTerm) || 
                            (item.details && item.details.toLowerCase().includes(searchTerm));
        return matchType && matchSearch;
    });

    renderCards(filtered);
}

window.deleteItem = async function(id) {
    const success = await showPinModal();
    if (success) {
        if (confirm("รหัสถูกต้อง! คุณต้องการลบประกาศนี้ใช่หรือไม่?")) {
            try {
                await db.collection("items").doc(id).delete();
                alert("ลบประกาศเรียบร้อยแล้ว");
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert("เกิดข้อผิดพลาดในการลบ: " + error.message);
            }
        }
    }
}

function compressImage(file, callback) {
    try {
        const reader = new FileReader();
        reader.onerror = () => callback(null);
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const img = new Image();
            img.onerror = () => callback(null);
            img.src = event.target.result;
            img.onload = function () {
                try {
                    const canvas = document.createElement('canvas');
                    let width = img.width, height = img.height;
                    const max = 500;
                    if (width > height) { if (width > max) { height *= max / width; width = max; } } 
                    else { if (height > max) { width *= max / height; height = max; } }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    callback(canvas.toDataURL('image/jpeg', 0.6));
                } catch (err) { callback(null); }
            }
        }
    } catch (err) { callback(null); }
}

// 📌 เปลี่ยนมาใช้ฟังก์ชันธรรมดาแทนการดักจับ Form Submit (เพื่อแก้ปัญหาเว็บค้าง)
window.processPost = async function() {
    try {
        const typeEl = document.querySelector('input[name="itemType"]:checked');
        const nameEl = document.getElementById('itemName');
        const locEl = document.getElementById('itemLocation');
        const dateEl = document.getElementById('itemDate');
        const detEl = document.getElementById('itemDetails');
        const contEl = document.getElementById('itemContact');
        const fileInput = document.getElementById('itemImage');
        const submitBtn = document.getElementById('submitBtn');

        // ตรวจสอบว่าดึง Element ได้ครบถ้วนหรือไม่ (ป้องกัน Error ลึกลับ)
        if(!typeEl || !nameEl || !locEl || !dateEl || !contEl) {
            alert("❌ ระบบโหลดไม่สมบูรณ์ กรุณารีเฟรชหน้าเว็บหนึ่งครั้งครับ");
            return;
        }

        const type = typeEl.value;
        const name = nameEl.value.trim();
        const location = locEl.value.trim();
        const date = dateEl.value;
        const details = detEl.value.trim();
        const contact = contEl.value.trim();

        if (!name || !location || !date || !contact) {
            alert('⚠️ กรุณากรอกข้อมูลในช่องที่มีเครื่องหมายดอกจัน (*) ให้ครบถ้วนก่อนลงประกาศครับ');
            return;
        }

        const success = await showPinModal();
        if (!success) return;

        if (containsBadWords(name) || containsBadWords(details)) {
            alert('🚫 ขออภัยครับ! ระบบตรวจพบคำไม่สุภาพ กรุณาแก้ไขข้อความก่อนลงประกาศครับ');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่งข้อมูล...';

        const saveToFirestore = async (imageBase64) => {
            try {
                await db.collection("items").add({
                    type, name, location, date, details, contact,
                    image: imageBase64,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                // ล้างค่าฟอร์มแบบ Manual เพราะเราถอดแท็ก form ออกแล้ว
                nameEl.value = ''; locEl.value = ''; detEl.value = ''; contEl.value = '';
                if(fileInput) fileInput.value = '';
                dateEl.valueAsDate = new Date();
                
                alert('✅ ลงประกาศสำเร็จ!');
                window.location.hash = '#items-section'; // เลื่อนขึ้นไปดูประกาศ
            } catch (error) {
                console.error("Error adding document: ", error);
                alert('❌ เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ลงประกาศทันที';
            }
        };

        if (fileInput && fileInput.files && fileInput.files[0]) {
            compressImage(fileInput.files[0], (compressedDataUrl) => {
                saveToFirestore(compressedDataUrl);
            });
        } else {
            saveToFirestore(null);
        }
    } catch (err) {
        alert("❌ ระบบขัดข้อง: " + err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initRealtimeData();
    const dateInput = document.getElementById('itemDate');
    if(dateInput) dateInput.valueAsDate = new Date();
});

window.setGlobalFilter = function(type) {
    document.querySelectorAll('.filter-btn').forEach(b => {
        if (b.getAttribute('data-filter') === type) { b.click(); }
    });
}

window.setFormType = function(type) {
    const radio = document.querySelector(`input[name="itemType"][value="${type}"]`);
    if(radio) radio.checked = true;
}

const hamburger = document.getElementById('hamburger');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
}
