let itemsData = JSON.parse(localStorage.getItem('bodinItems')) || [];

function render() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = itemsData.map(item => `
        <div class="card">
            <h3>${item.name} (${item.type === 'lost' ? 'หาย' : 'พบ'})</h3>
            <p>ที่ไหน: ${item.location}</p>
            <p>ติดต่อ: ${item.contact}</p>
        </div>
    `).join('');
}

document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        name: document.getElementById('itemName').value,
        type: document.querySelector('input[name="itemType"]:checked').value,
        location: document.getElementById('itemLocation').value,
        contact: document.getElementById('itemContact').value
    };
    itemsData.push(newItem);
    localStorage.setItem('bodinItems', JSON.stringify(itemsData));
    render();
    e.target.reset();
});

document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

render();
