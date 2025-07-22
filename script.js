const answers = {
  general: [
    "فککککککک نککککنم",
    "خودت چی فکر می‌کنی؟",
    "ول کن جهان را قهوه‌ات یخ کرد",
    "باید از ماتریکس خارج بشی",
    "ان‌شاءالله به لطف پروردگار و یاری ائمه‌اطهار خوب است",
    "من با تو شوخی دارم؟",
    "ترجیح میدم سکوت کنم",
    "(نگاه عاقل اندر سفیه)",
    "مریخ میگه خوبه",
    "این دیگه پرسیدن داره؟ معلومه که خوبه.",
    "امروزو دست نگه دار",
    "صبر کن خودش درست میشه"
    
  ],
  love: [
  "عشق در هر خونه رو فقط یه بار میزنه",
  "مگه سیب زمینی پیازه؟",
  "عشق زوری نمیشه",
  "دکمه آسانسور رو هر چی بیشتر بزنی زودتر نمیرسه",
  "به نظرم یه جور دیگه حالتو خوب کن",
  "اونم مثل توعه",
  "به نظر من بیخیال شو",
  "در حد سرگرمی خوبه",
  "مشکل از هورموناته",
  "نمیدونم ولی ستاره‌ها میگن که یا تو یا اون هنوز تو فکر قبلی‌این",
  "اگه شک داری یعنی عاشقی",
  "اول باید حالتو خوب کنی"

  ],
  work: [
    "کار امروز رو به فردا بنداز!",
    "موفقیت نزدیکه، منتظر باش",
    "تا کی میخوای بقیه رو خوشحال کنی؟",
    "کارهای عقب مونده زیادن!",
    "مرخصی‌هاتو نمیتونی ببری اون دنیا",
    "رزومه بفرست",
    "امتحان کن، موفق میشی",
    "یه تغییر اساسی لازمه، مثلا میتونی شغلتو عوض کنی.",
    "اینو باید از یه متخصص بپرسی",
    "برات نریدن",
    "JUST DO IT!",
    "فکککککک نککککککککنم"
  ],
  funny: [
    "قراره بمیری! یوهاهاهاها!",
    "مگه من مسخره توام؟ اول نیت کن!",
    "این قضیه شوخی بردار نیست. برو توی یه دسته‌بندی دیگه.",
    "جمع کن خودتو برو یه کار مفید بکن",
    "تو یه بازنده‌ای",
    "امروز روز شانسته، برو به یه دسته بندی دیگه",
    "چیل کن",
    "حالا خارج از شوخی... خودتو به یه روانشناس نشون بده."
  ]
};

const ball = document.getElementById("ball");
const answerEl = document.getElementById("answer");
const shakeBtn = document.getElementById("shakeBtn");
const categorySelect = document.getElementById("category");
const historyList = document.getElementById("historyList");
const toggleThemeBtn = document.getElementById("toggleTheme");
const shakeSound = document.getElementById("shakeSound");

let isShaking = false;
let currentTheme = "light";

function saveHistory(history) {
  localStorage.setItem("magicBallHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("magicBallHistory") || "[]");
  return history;
}

function formatTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "چند لحظه پیش";
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} ساعت پیش`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} روز پیش`;
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = "";
  history.forEach((item, idx) => {
    const li = document.createElement("li");
    li.classList.add("history-item");

    const time = document.createElement("div");
    time.classList.add("history-time");
    time.textContent = formatTime(new Date(item.timestamp));

    const text = document.createElement("div");
    text.textContent = item.answer;

    const note = document.createElement("textarea");
    note.classList.add("note");
    note.placeholder = "میتونی نیتت رو اینجا بنویسی که یادت نره...";
    note.value = item.note || "";
    note.addEventListener("input", e => {
      history[idx].note = e.target.value;
      saveHistory(history);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.title = "حذف این مورد";
    deleteBtn.addEventListener("click", () => {
      history.splice(idx, 1);
      saveHistory(history);
      renderHistory();
    });

    li.appendChild(deleteBtn);
    li.appendChild(text);
    li.appendChild(time);
    li.appendChild(note);
    historyList.appendChild(li);
  });
}

function getRandomAnswer(category) {
  const arr = answers[category] || answers.general;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function toggleTheme() {
  if (currentTheme === "dark") {
    document.body.classList.add("light");
    toggleThemeBtn.textContent = "🌙";
    currentTheme = "light";
  } else {
    document.body.classList.remove("light");
    toggleThemeBtn.textContent = "☀️";
    currentTheme = "dark";
  }
}

shakeBtn.addEventListener("click", () => {
  if (isShaking) return;
  isShaking = true;

  if (navigator.vibrate) navigator.vibrate(150);
  shakeSound.currentTime = 0;
  shakeSound.play();

  answerEl.style.opacity = "0.3";
  answerEl.textContent = "";

  let elapsed = 0;
  const duration = 4000;
  const intervalTime = 100;
  const interval = setInterval(() => {
    elapsed += intervalTime;
    answerEl.textContent = getRandomAnswer(categorySelect.value);
    if (elapsed >= duration) {
      clearInterval(interval);

      const finalAnswer = getRandomAnswer(categorySelect.value);
      answerEl.textContent = finalAnswer;

      const history = loadHistory();
      history.unshift({
        answer: finalAnswer,
        category: categorySelect.value,
        timestamp: Date.now(),
        note: ""
      });
      saveHistory(history);
      renderHistory();

      isShaking = false;
    }
  }, intervalTime);
});

toggleThemeBtn.addEventListener("click", toggleTheme);

window.addEventListener("load", () => {
  renderHistory();
  toggleTheme(); // پیش‌فرض روی حالت شب قرار می‌گیره
});
// === فعال‌سازی تکون دادن گوشی ===
let lastShake = Date.now();
window.addEventListener("devicemotion", function(event) {
  const acc = event.accelerationIncludingGravity;
  const shakeThreshold = 15; // میزان حساسیت

  if (!acc) return;

  const totalForce = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
  if (totalForce > shakeThreshold && Date.now() - lastShake > 2000) {
    lastShake = Date.now();
    shakeBtn.click();
  }
}, false);

// === کلیک روی توپ ===
document.getElementById("ball").addEventListener("click", () => {
  shakeBtn.click();
});
