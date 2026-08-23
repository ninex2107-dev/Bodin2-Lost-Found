let itemsData = JSON.parse(localStorage.getItem('bodinItems')) || [
    {
        id: 1,
        type: 'lost',
        name: 'กระเป๋าสตางค์สีดำ (ม.ปลาย)',
        location: 'โรงอาหาร 2',
        date: '2026-06-06',
        details: 'ข้างในมีบัตรนักเรียนและเงินสดประมาณ 200 บาท',
        contact: 'IG: @student_b2 หรือโทร 089-123-4567',
        image: ''
    },
    {
        id: 2,
        type: 'found',
        name: 'ร่มพับสีฟ้า ลายการ์ตูน',
        location: 'หน้าเสาธง',
        date: '2026-06-05',
        details: 'เก็บได้ช่วงเช้าหลังเคารพธงชาติ',
        contact: 'ห้องปกครอง หรือโทร 02-111-2222',
        image: ''
    }
];

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
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
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

document.addEventListener('DOMContentLoaded', () => {
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

    renderCards(itemsData);
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

const postFormEl = document.getElementById('postForm');
if(postFormEl) {
    postFormEl.addEventListener('submit', function(e) {
        e.preventDefault();

        const type = document.querySelector('input[name="itemType"]:checked').value;
        const name = document.getElementById('itemName').value;
        const location = document.getElementById('itemLocation').value;
        const date = document.getElementById('itemDate').value;
        const details = document.getElementById('itemDetails').value;
        const contact = document.getElementById('itemContact').value;
        const fileInput = document.getElementById('itemImage');

        const saveItem = (imageBase64) => {
            const newItem = {
                id: Date.now(),
                type,
                name,
                location,
                date,
                details,
                contact,
                image: imageBase64
            };

            itemsData.unshift(newItem);
            localStorage.setItem('bodinItems', JSON.stringify(itemsData));

            this.reset();
            document.getElementById('itemDate').valueAsDate = new Date();
            alert('ลงประกาศสำเร็จ!');
            filterData();
            window.location.href = '#items-section';
        };

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                saveItem(event.target.result);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            saveItem(null);
        }
    });
}

// เปิด-ปิด เมนูบนมือถือ
const hamburger = document.getElementById('hamburger');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
}
