(function () {
  const chatArea = document.getElementById('chatArea');
  const chatStatus = document.getElementById('chatStatus');
  const sheetStatus = document.getElementById('sheetStatus');
  const newRow = document.getElementById('newRow');
  const replayBtn = document.getElementById('replayBtn');
  if (!chatArea) return;

  const script = [
    { who: 'user', text: 'hlo', time: '10:39 am' },
    { who: 'bot',  text: "Hello 👋 Welcome to Home Innovation Interiors! I'm Priya, your personal design assistant.<br><br>Are you looking to redesign your home, kitchen, bedroom, or any other space? 😊🏠", time: '10:39 am' },
    { who: 'user', text: 'kitcen', time: '10:40 am' },
    { who: 'bot',  text: "Lovely! A beautiful kitchen is the heart of every home. ❤️<br><br>Are you looking for a brand new modular kitchen or a complete kitchen makeover? 😊", time: '10:40 am' },
    { who: 'user', text: 'just one kitchen normal designn', time: '10:40 am' },
    { who: 'bot',  text: "Perfect! A clean, functional kitchen design is a great choice.<br><br>What's your approximate budget range?<br>1️⃣ Under ₹3 Lakhs · 2️⃣ ₹3–7 Lakhs · 3️⃣ ₹7–15 Lakhs · 4️⃣ ₹15L+", time: '10:40 am' },
    { who: 'user', text: '20k', time: '10:41 am' },
    { who: 'bot',  text: "Perfect! Our designer will show you the best budget-friendly options during a FREE home visit.<br><br>May I know your good name, and which area of Hyderabad you're in? 🏠", time: '10:41 am' },
    { who: 'user', text: 'vamshii suchitra', time: '10:41 am' },
    { who: 'bot',  text: "Lovely to meet you, Vamshi! Suchitra is a wonderful area ⭐<br><br>Could you share your WhatsApp number so we can reach you?", time: '10:41 am' },
    { who: 'user', text: '9000420126', time: '10:42 am' },
    { who: 'bot',  text: "Thank you, Vamshi! 🎉 Your details are all noted ✅<br><br>Our lead designer will call you within 2 hours to schedule your FREE home visit.", time: '10:42 am' },
  ];

  let timer = null;

  function wait(ms) { return new Promise(res => { timer = setTimeout(res, ms); }); }

  function addBubble(msg) {
    const b = document.createElement('div');
    b.className = 'bubble ' + (msg.who === 'user' ? 'user' : 'bot');
    b.innerHTML = msg.text + '<span class="tstamp">' + msg.time + (msg.who === 'user' ? ' ✓✓' : '') + '</span>';
    chatArea.appendChild(b);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function addTyping() {
    const t = document.createElement('div');
    t.className = 'typing';
    t.id = 'typingNow';
    t.innerHTML = '<span></span><span></span><span></span>';
    chatArea.appendChild(t);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingNow');
    if (t) t.remove();
  }

  async function playScript() {
    chatArea.innerHTML = '';
    newRow.classList.remove('show', 'settle');
    if (sheetStatus) {
      sheetStatus.classList.remove('live');
      sheetStatus.innerHTML = '<span class="dot"></span> waiting for lead…';
    }
    if (chatStatus) chatStatus.textContent = 'online';

    for (const msg of script) {
      if (msg.who === 'bot') {
        addTyping();
        await wait(750 + Math.random() * 350);
        removeTyping();
        addBubble(msg);
        await wait(450);
      } else {
        await wait(650);
        addBubble(msg);
      }
    }

    await wait(500);
    if (sheetStatus) {
      sheetStatus.classList.add('live');
      sheetStatus.innerHTML = '<span class="dot"></span> lead captured — writing row…';
    }
    await wait(600);
    newRow.classList.add('show');
    await wait(1600);
    newRow.classList.add('settle');
    if (sheetStatus) sheetStatus.innerHTML = '<span class="dot"></span> saved to spreadsheet ✓';
  }

  // Play once the phone scrolls into view
  let played = false;
  const phoneSection = document.querySelector('.demo-wrap');
  if (phoneSection && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !played) {
          played = true;
          playScript();
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(phoneSection);
  } else {
    playScript();
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      clearTimeout(timer);
      document.querySelectorAll('#chatArea .typing').forEach(el => el.remove());
      playScript();
    });
  }
})();
