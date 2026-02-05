// ================== TELEGRAM AYARLARI ==================
const TELEGRAM_TOKEN = "8572363144:AAFLFLu2b4MKvm-ARzyUAxV9GqPPcQ2xd-4";
const TELEGRAM_CHAT_ID = "1538267112";

// ================== RESİM DEĞİŞTİRME ==================
const images = document.querySelectorAll('.product-images img');
let activeImg = document.querySelector('.active-img');

images.forEach(img => {
  img.addEventListener('click', () => {
    if (activeImg) activeImg.classList.remove('active-img');
    img.classList.add('active-img');
    activeImg = img;
  });
});

// ================== SEPET STATE ==================
let cart = {
  name: "Su Geçirmez Bluetooth Hoparlör",
  price: 500,
  qty: 0
};

// ================== ELEMENTLER ==================
const cartPanel    = document.getElementById('cartPanel');
const cartToggle   = document.getElementById('cartToggle');
const closeCart    = document.getElementById('closeCart');
const addToCartBtn = document.getElementById('addToCart');
const buyNowBtn    = document.getElementById('buyNow');

const panelTitle   = document.getElementById('panelTitle');
const panelContent = document.getElementById('panelContent');
const panelFooter  = document.getElementById('panelFooter');

// ================== PANEL AÇ / KAPAT ==================
cartToggle.addEventListener('click', openCart);

closeCart.addEventListener('click', () => {
  cartPanel.classList.remove('active');
});

addToCartBtn.addEventListener('click', () => {
  cart.qty++;
  openCart();
});

buyNowBtn.addEventListener('click', () => {
  if (cart.qty === 0) cart.qty = 1;
  openCheckout();
});

// ================== SEPET ==================
function openCart() {
  panelTitle.innerText = "Sepetim";

  if (cart.qty === 0) {
    panelContent.innerHTML = `<p>Sepetiniz boş.</p>`;
    panelFooter.innerHTML = ``;
  } else {
    const total = cart.qty * cart.price;

    panelContent.innerHTML = `
      <p><strong>${cart.name}</strong></p>
      <p>Birim Fiyat: ${cart.price} TL</p>

      <div style="display:flex;align-items:center;gap:10px;margin:12px 0;">
        <button onclick="decreaseQty()">➖</button>
        <strong>${cart.qty}</strong>
        <button onclick="increaseQty()">➕</button>
      </div>

      <p><strong>Toplam: ${total} TL</strong></p>
      <button onclick="removeItem()">❌ Ürünü Kaldır</button>
    `;

    panelFooter.innerHTML = `
      <button onclick="openCheckout()">Ödemeye Geç</button>
    `;
  }

  cartPanel.classList.add('active');
}

// ================== ADET ==================
function increaseQty() {
  cart.qty++;
  openCart();
}

function decreaseQty() {
  cart.qty--;
  if (cart.qty < 1) cart.qty = 1;
  openCart();
}

function removeItem() {
  cart.qty = 0;
  openCart();
}

// ================== ÖDEME ==================
function openCheckout() {
  if (cart.qty === 0) {
    alert("Sepet boş!");
    return;
  }

  const total = cart.qty * cart.price;
  panelTitle.innerText = "Güvenli Ödeme";

  panelContent.innerHTML = `
    <label>Kart Üzerindeki İsim</label>
    <input id="name" placeholder="Ad Soyad">

    <label>Telefon</label>
    <input id="phone" placeholder="05xx xxx xx xx">

    <label>Adres</label>
    <textarea id="address" placeholder="Teslimat adresi"></textarea>

    <p style="margin-top:10px;">
      <strong>Toplam: ${total} TL</strong>
    </p>
  `;

  panelFooter.innerHTML = `
    <button onclick="completeOrder()">Ödemeyi Tamamla</button>
  `;

  cartPanel.classList.add('active');
}

// ================== TELEGRAM MESAJ ==================
function sendTelegramMessage(message) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  });
}

// ================== SİPARİŞ TAMAMLAMA ==================
function completeOrder() {
  const name = document.getElementById("name").value || "-";
  const phone = document.getElementById("phone").value || "-";
  const address = document.getElementById("address").value || "-";

  const total = cart.qty * cart.price;

  const message = `
🛒 YENİ SİPARİŞ!

Ürün: ${cart.name}
Adet: ${cart.qty}
Toplam: ${total} TL

👤 ${name}
📞 ${phone}
📍 ${address}
  `;

  sendTelegramMessage(message);

  alert("Siparişiniz alındı ❤️");
  cart.qty = 0;
  cartPanel.classList.remove('active');
}
