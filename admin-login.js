// DEMO ADMIN BİLGİLERİ
const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";

document.getElementById("loginBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem("adminAuth", "true");
    window.location.href = "admin.html";
  } else {
    error.innerText = "Kullanıcı adı veya şifre hatalı!";
  }
});
