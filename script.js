const messages = [
  "Emin misin?",
  "Gerçekten emin misin??",
  "Tam olarak emin olduğunu söyleyebilir misin?",
  "Bir daha düşün lütfen!",
  "Hayır dersen çok üzülürüm...",
  "Gerçekten çok üzülürüm...",
  "Çok ama çok üzülürüm...",
  "Peki tamam, artık sormayacağım...",
  "Şaka yaptım, lütfen evet de! ❤️",
  "Bak üzülüyorum ama"
];


let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

// Discord webhook URL
const DISCORD_WEBHOOK_URL = 'BURAYA_WEBHOOK_URL_YAPIŞTIRIN';

// LocalStorage için son kullanma süresi (10 saniye)
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 10 saniye (milisaniye cinsinden)

// LocalStorage'a veri kaydetme fonksiyonu
function setWithExpiry(key, value) {
    const item = {
        value: value,
        expiry: new Date().getTime() + EXPIRATION_TIME
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// LocalStorage'dan veri okuma fonksiyonu
function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    // Süre dolmuşsa null döndür
    if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

// Sayfa yüklendiğinde kullanıcı adı kontrolü
window.onload = function() {
    const username = getWithExpiry('username');
    if (!username) {
        document.getElementById('usernameSection').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    } else {
        document.getElementById('usernameSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }
}

function handleUsername() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        setWithExpiry('username', username);
        document.getElementById('usernameSection').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        alert('Lütfen bir kullanıcı adı girin!');
    }
}

async function handleYesClick() {
    const lastClickTime = getWithExpiry('lastYesClick');
    
    if (lastClickTime) {
        alert('24 saat içinde sadece bir kez "Evet" diyebilirsin!');
        return;
    }

    const username = getWithExpiry('username');
    const message = {
        content: `**${username}** kullanıcısı **"Evet"** dedi! ❤️`
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });
        
        if (!response.ok) {
            throw new Error('Discord mesajı gönderilemedi');
        }
        
        setWithExpiry('lastYesClick', new Date().getTime());
        window.location.href = "yes_page.html";
    } catch (error) {
        console.error('Hata:', error);
        window.location.href = "yes_page.html";
    }
}
