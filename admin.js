fetch("http://localhost:3000/orders")
.then(r=>r.json())
.then(data=>{
  let html="<tr><th>Müşteri</th><th>Telefon</th><th>Adres</th></tr>";
  data.forEach(o=>{
    html+=`<tr><td>${o.name}</td><td>${o.phone}</td><td>${o.address}</td></tr>`;
  });
  document.getElementById("orders").innerHTML=html;
});
