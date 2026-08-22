// ================= ข้อมูลจำลอง (Mock Data) =================
// ใส่ไว้เผื่อให้เว็บไม่โล่งตอนเปิดครั้งแรก
const initialMockData = [
    {
        id: 1,
        type: 'lost',
        name: 'กระเป๋าสตางค์สีดำ',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400',
        location: 'โรงอาหาร โต๊ะริมหน้าต่าง',
        date: '2026-08-20',
        details: 'กระเป๋าสตางค์หนังสีดำมียี่ห้อ ข้างในมีบัตรนักเรียน ม.4',
        contact: '081-234-5678 (นายเอ)'
    },
    {
        id: 2,
        type: 'found',
        name: 'กุญแจรถมอเตอร์ไซค์ Honda',
        image: 'https://images.unsplash.com/photo-1582201943021-e8e6ab6d36a7?auto=format&fit=crop&q=80&w=400',
        location: 'ลานจอดรถนักเรียน',
        date: '2026-08-21',
        details: 'พวงกุญแจมีตุ๊กตาหมีสีน้ำตาลห้อยอยู่',
        contact: 'ห้องกิจการนักเรียน อาคาร 1'
    },
    {
        id: 3,
        type: 'lost',
        name: 'iPad Pro 11 นิ้ว',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
        location: 'ห้องสมุด โซนอ่านหนังสือชั้น 2',
        date: '2026-08-22',
        details: 'ใส่เคสสีชมพูอ่อน มีสติ๊กเกอร์วงดนตรีติดด้านหลัง',
        contact: 'IG: @student_nam'
    }
];

// ================= ระบบจัดการ State & LocalStorage =================
let itemsData = [];
let currentFilter = 'all'; // all, lost, found

// ดึงข้อมูลตอนโหลดหน้าเว็บ
function init() {
    const savedData = localStorage.getItem('bodin2LostFoundData');
    if (savedData) {
        itemsData = JSON.parse(savedData);
    } else {
        // ถ้าไม่มีข้อมูลใน LocalStorage เลย ให้ใช้ Mock Data ก่อน
        itemsData = initialMockData;
        localStorage.setItem('bodin2LostFoundData', JSON.stringify(itemsData));
    }
    
    // เซ็ตวันที่ปัจจุบันในฟอร์มเป็นค่าเริ่มต้น
    document.getElementById('itemDate').valueAsDate = new Date();
    
    renderCards(itemsData);
}

// บันทึกข้อมูลลง LocalStorage
function saveData() {
    localStorage.setItem('bodin2LostFoundData', JSON.stringify(itemsData));
}

// ================= ระบบแสดงผล (Render) =================
function renderCards(dataToRender) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    if (dataToRender.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">ไม่พบรายการสิ่งของที่ค้นหา</p>`;
        return;
    }

    // เรียงจากใหม่ไปเก่า (id มากไปน้อย)
    const sortedData = [...dataToRender].sort((a, b) => b.id - a.id);

    sortedData.forEach(item => {
        const isLost = item.type === 'lost';
        const badgeClass = isLost ? 'badge-lost' : 'badge-found';
        const badgeText = isLost ? 'ของหาย' : 'เก็บได้';
        const fallbackImage = isLost ? 'https://via.placeholder.com/400x250/2a1b38/ffffff?text=Lost+Item' : 'https://via.placeholder.com/400x250/1b382c/ffffff?text=Found+Item';
        
        // รูปแบบวันที่ให้อ่านง่าย
        const dateObj = new Date(item.date);
        const dateStr = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

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
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// ================= ระบบค้นหาและกรอง (Search & Filter) =================
function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = itemsData.filter(item => {
        // กรองตามประเภท
        const matchType = currentFilter === 'all' || item.type === currentFilter;
        // กรองตามคำค้นหา
        const matchSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.location.toLowerCase().includes(searchTerm) || 
                            (item.details && item.details.toLowerCase().includes(searchTerm));
        
        return matchType && matchSearch;
    });

    renderCards(filtered);
}

// Event Listener สำหรับช่องค้นหา (ค้นหาทันทีที่พิมพ์)
document.getElementById('searchInput').addEventListener('input', filterData);

// Event Listener สำหรับปุ่มกรอง (ทั้งหมด, ของหาย, ของที่พบ)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // อัปเดต UI ปุ่ม
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // อัปเดต State และ Render ใหม่
        currentFilter = e.target.getAttribute('data-filter');
        filterData();
    });
});

// ฟังก์ชันสำหรับลิงก์จาก Navbar / Hero ให้ตั้งค่า Filter หรือ Form Type
function setGlobalFilter(type) {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => {
        if (b.getAttribute('data-filter') === type) {
            b.click();
        }
    });
}

function setFormType(type) {
    const radio = document.querySelector(`input[name="itemType"][value="${type}"]`);
    if(radio) radio.checked = true;
}

// ================= ระบบลงประกาศ (Form Submit) =================
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันการรีโหลดหน้าเว็บ

    // รับค่าจากฟอร์ม
    const type = document.querySelector('input[name="itemType"]:checked').value;
    const name = document.getElementById('itemName').value;
    const location = document.getElementById('itemLocation').value;
    const date = document.getElementById('itemDate').value;
    const details = document.getElementById('itemDetails').value;
    const contact = document.getElementById('itemContact').value;
    const fileInput = document.getElementById('itemImage');

    // ฟังก์ชันสร้างไอเทมใหม่
    const createNewItem = (imageBase64) => {
        const newItem = {
            id: Date.now(), // ใช้ Timestamp เป็น ID แบบง่ายๆ
            type,
            name,
            location,
            date,
            details,
            contact,
            image: imageBase64 // ถ้าไม่มีไฟล์จะเป็น null
        };

        itemsData.push(newItem);
        saveData();       // เซฟลง LocalStorage
        filterData();     // รีเฟรชหน้าจอ (Render ใหม่ตาม Filter ปัจจุบัน)
        
        // รีเซ็ตฟอร์ม และเลื่อนหน้าจอกลับไปดูรายการ
        this.reset();
        document.getElementById('itemDate').valueAsDate = new Date(); // คืนค่าวันที่
        alert('ลงประกาศสำเร็จ!');
        window.location.href = '#items-section';
    };

    // แปลงไฟล์รูปภาพเป็น Base64 เพื่อเก็บใน LocalStorage ได้ (ถ้าผู้ใช้อัปโหลดรูป)
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            createNewItem(event.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        createNewItem(null); // ไม่มีรูปภาพ
    }
});

// ================= ระบบ UI เพิ่มเติม =================
// Hamburger Menu ทพสำหรับมือถือ
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// ปิดเมนูเมื่อคลิกลิงก์บนมือถือ
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// เริ่มทำงานเมื่อเปิดเว็บ
window.addEventListener('DOMContentLoaded', init);
