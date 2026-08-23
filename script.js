import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnR8htQoEVm9qcEpz1dxJKoZxQwxNoUcw",
  authDomain: "bodin2-lost-found.firebaseapp.com",
  projectId: "bodin2-lost-found",
  storageBucket: "bodin2-lost-found.firebasestorage.app",
  messagingSenderId: "366439923477",
  appId: "1:366439923477:web:28d23fabda49e02caa731c",
  measurementId: "G-W0VKJ5KXBP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let itemsData = [];
let currentFilter = 'all';

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
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
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
    if (confirm("คุณต้องการลบประกาศนี้ใช่หรือไม่?")) {
        try {
            await deleteDoc(doc(db, "items", id));
            alert("ลบประกาศเรียบร้อยแล้ว");
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("เกิดข้อผิดพลาดในการลบ: " + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initRealtimeData();

    const searchInput = document.getElementById('searchInput');
    if(searchInput) searchInput.addEventListener('input', filterData);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            filterData();
        });
    });

    const dateInput = document.getElementById('itemDate');
    if(dateInput) dateInput.valueAsDate = new Date();
});

window.setGlobalFilter = function(type) {
    document.querySelectorAll('.filter-btn').forEach(b => {
        if (b.getAttribute('data-filter') === type) {
            b.click();
        }
    });
}

window.setFormType = function(type) {
    const radio = document.querySelector(`input[name="itemType"][value="${type}"]`);
    if(radio) radio.checked = true;
}

function compressImage(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const MAX_HEIGHT = 500;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            callback(dataUrl);
        }
    }
}

const postFormEl = document.getElementById('postForm');
if(postFormEl) {
    postFormEl.addEventListener('submit', async function(e) {
        e.preventDefault();

        const type = document.querySelector('input[name="itemType"]:checked').value;
        const name = document.getElementById('itemName').value;
        const location = document.getElementById('itemLocation').value;
        const date = document.getElementById('itemDate').value;
        const details = document.getElementById('itemDetails').value;
        const contact = document.getElementById('itemContact').value;
        const fileInput = document.getElementById('itemImage');

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่งข้อมูล...';

        const saveToFirestore = async (imageBase64) => {
            try {
                // สร้าง Promise สำหรับส่งข้อมูลเข้า Firebase
                const addPromise = addDoc(collection(db, "items"), {
                    type,
                    name,
                    location,
                    date,
                    details,
                    contact,
                    image: imageBase64,
                    createdAt: Date.now()
                });

                // ตั้งเวลา Timeout ไว้ 8 วินาที ถ้าเกินนี้ให้ตัดจบและแจ้งเตือนทันที
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('เชื่อมต่อเซิร์ฟเวอร์ใช้เวลานานเกินไป กรุณาตรวจสอบอินเทอร์เน็ต')), 8000)
                );

                await Promise.race([addPromise, timeoutPromise]);

                this.reset();
                document.getElementById('itemDate').valueAsDate = new Date();
                alert('ลงประกาศสำเร็จ!');
                window.location.href = '#items-section';
            } catch (error) {
                console.error("Error adding document: ", error);
                alert('เกิดข้อผิดพลาด: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ลงประกาศทันที';
            }
        };

        if (fileInput.files && fileInput.files[0]) {
            compressImage(fileInput.files[0], (compressedDataUrl) => {
                saveToFirestore(compressedDataUrl);
            });
        } else {
            saveToFirestore(null);
        }
    });
}

const hamburger = document.getElementById('hamburger');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
}
