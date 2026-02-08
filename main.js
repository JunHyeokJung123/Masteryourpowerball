
const lotteries = {
  powerball: {
    name: "Powerball",
    tagline: "The original giant jackpot game! Drawings are held every Monday, Wednesday, and Saturday.",
    whiteBalls: { count: 5, max: 69 },
    specialBall: { name: "Powerball", max: 26 },
    info: `
      <h3>About Powerball</h3>
      <p>Powerball is one of the most popular lottery games in the United States, known for its massive jackpots. It began in 1992 and has since delivered some of the largest prizes in lottery history.</p>
      <h3>How to Play</h3>
      <p>Players select five numbers from a set of 69 white balls and one number from a set of 26 red Powerballs. The odds of winning the jackpot are approximately 1 in 292.2 million.</p>
    `
  },
  megamillions: {
    name: "Mega Millions",
    tagline: "Famous for its jaw-dropping jackpots! Drawings are held every Tuesday and Friday.",
    whiteBalls: { count: 5, max: 70 },
    specialBall: { name: "Mega Ball", max: 25 },
    info: `
      <h3>About Mega Millions</h3>
      <p>Mega Millions is another major multi-state lottery in the U.S. It was first introduced in 1996 as "The Big Game" and has grown to become a household name for lottery enthusiasts.</p>
      <h3>How to Play</h3>
      <p>To play, you pick five different numbers from 1 to 70 and one Mega Ball number from 1 to 25. The odds of hitting the jackpot are about 1 in 302.5 million.</p>
    `
  },
  luckyforlife: {
    name: "Lucky for Life",
    tagline: "Win $1,000 a day, for life! Drawings are held every single day.",
    whiteBalls: { count: 5, max: 48 },
    specialBall: { name: "Lucky Ball", max: 18 },
    info: `
      <h3>About Lucky for Life</h3>
      <p>This lottery offers a unique top prize: $1,000 per day for the rest of your life. It started in 2009 in Connecticut and has expanded to many other states.</p>
      <h3>How to Play</h3>
      <p>Players choose five numbers from 1 to 48 and one Lucky Ball from 1 to 18. The odds of winning the top prize are approximately 1 in 30.8 million.</p>
    `
  },
  cash4life: {
    name: "Cash4Life",
    tagline: "Your second chance at a lifetime of winnings! Drawings are held daily.",
    whiteBalls: { count: 5, max: 60 },
    specialBall: { name: "Cash Ball", max: 4 },
    info: `
      <h3>About Cash4Life</h3>
      <p>Similar to Lucky for Life, Cash4Life offers a top prize of $1,000 a day for life, and a second prize of $1,000 a week for life. It is played across several states.</p>
      <h3>How to Play</h3>
      <p>Select five numbers from 1 to 60 and one Cash Ball from 1 to 4. The odds of winning the grand prize are roughly 1 in 21.8 million.</p>
    `
  },
  lottoamerica: {
    name: "Lotto America",
    tagline: "A classic name with a modern twist! Drawings on Monday, Wednesday, and Saturday.",
    whiteBalls: { count: 5, max: 52 },
    specialBall: { name: "Star Ball", max: 10 },
    info: `
      <h3>About Lotto America</h3>
      <p>This game is a revival of the original multi-state lottery from the late 80s. It offers a smaller, but still significant, jackpot compared to Powerball or Mega Millions.</p>
      <h3>How to Play</h3>
      <p>Players pick five numbers from 1 to 52 and one Star Ball from 1 to 10. The odds of winning the main jackpot are about 1 in 25.9 million.</p>
    `
  }
};

class LottoMachine extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.resultTitles = ["Your Lucky Numbers!", "Here's Your Fortune!", "Destiny's Digits!", "Your Golden Ticket!", "Future is Now!"];
    this.history = [];
    this.config = null;
  }

  setConfig(config) {
    this.config = config;
    this.history = [];
    this.updateHistory();
    if (this.resultsPanel && this.resultsPanel.classList.contains('active')) {
        this.resultsPanel.classList.remove('active');
    }
  }

  connectedCallback() {
    this.render();
    this.resultsPanel = this.shadowRoot.querySelector('.results-panel');
    this.drawOneButton = this.shadowRoot.querySelector('#draw-one-button');
    this.drawFiveButton = this.shadowRoot.querySelector('#draw-five-button');
    this.historyPanel = this.shadowRoot.querySelector('.history-panel');
    
    this.drawOneButton.addEventListener('click', () => this.draw(1));
    this.drawFiveButton.addEventListener('click', () => this.draw(5));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }
        .lotto-container { display: flex; flex-direction: column; align-items: center; gap: 25px; width: 100%; }
        .button-container { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        button { background-color: #48bb78; border: none; color: white; padding: 15px 30px; text-align: center; font-size: 1.1em; font-weight: bold; cursor: pointer; border-radius: 8px; transition: background-color 0.3s, transform 0.1s; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        button:hover { background-color: #38a169; }
        button:active { transform: scale(0.98); }
        button:disabled { background-color: #a0aec0; cursor: not-allowed; }
        .results-panel { background-color: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); width: 100%; text-align: center; opacity: 0; transform: translateY(20px); transition: all 0.5s ease-out; visibility: hidden; max-height: 0; }
        .results-panel.active { opacity: 1; transform: translateY(0); visibility: visible; max-height: 1500px; }
        .results-title { margin: 0 0 20px 0; font-size: 1.8em; font-weight: bold; color: #2c5282; }
        
        .result-balls { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px 10px; justify-items: center; }
        .result-balls.single-draw { grid-template-columns: 1fr; }

        .result-set { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .ball { width: 45px; height: 45px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.2em; font-weight: bold; color: #fff; box-shadow: inset -3px -3px 8px rgba(0,0,0,0.3); border: 2px solid transparent; }
        .result-ball-animation { animation: growIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transform: scale(0); }
        .ball-color-1 { background-color: #e53e3e; } .ball-color-2 { background-color: #3182ce; } .ball-color-3 { background-color: #38a169; } .ball-color-4 { background-color: #dd6b20; } .ball-color-5 { background-color: #805ad5; }
        .special-ball { background-color: #f6e05e; color: #2d3748 !important; border: 2px solid #d69e2e !important; }
        
        .history-panel { margin-top: 15px; width: 100%; }
        .history-title { margin: 0 0 15px 0; font-size: 1.5em; color: #2c5282; text-align: center; }
        .history-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .history-item { display: flex; align-items: center; justify-content: center; gap: 8px; background-color: #ffffff; padding: 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
        .history-ball-container { display: flex; gap: 5px; }
        .history-ball { width: 28px; height: 28px; font-size: 0.8em; }
        @keyframes growIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        body.dark-mode .results-panel, body.dark-mode .history-item { background-color: #2d3748; }
        body.dark-mode .results-title, body.dark-mode .history-title { color: #63b3ed; }
      </style>
      <div class="lotto-container">
        <div class="button-container">
          <button id="draw-one-button">Generate 1 Set</button>
          <button id="draw-five-button">Generate 5 Sets</button>
        </div>
        <div class="results-panel">
          <h3 class="results-title">Your Lucky Numbers</h3>
          <div class="result-balls"></div>
        </div>
        <div class="history-panel">
          <h4 class="history-title">Recent Draws</h4>
          <ul class="history-list"></ul>
        </div>
        <ins class="adsbygoogle" style="display:block; margin-top: 20px;" data-ad-client="ca-pub-6278607452967394" data-ad-slot="7639016828" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    `;
  }

  draw(count = 1) {
    if (!this.config) return;
    this.drawOneButton.disabled = true;
    this.drawFiveButton.disabled = true;
    this.displayResults(count);
    setTimeout(() => {
        this.drawOneButton.disabled = false;
        this.drawFiveButton.disabled = false;
    }, 500);
  }

  displayResults(count = 1) {
      const resultBallsContainer = this.shadowRoot.querySelector('.result-balls');
      const resultsTitle = this.shadowRoot.querySelector('.results-title');
      resultBallsContainer.innerHTML = '';

      if (count === 1) {
        resultBallsContainer.classList.add('single-draw');
      } else {
        resultBallsContainer.classList.remove('single-draw');
      }

      resultsTitle.textContent = this.resultTitles[Math.floor(Math.random() * this.resultTitles.length)];

      for (let i = 0; i < count; i++) {
        const resultSetDiv = document.createElement('div');
        resultSetDiv.classList.add('result-set');

        const whiteBalls = [];
        const { whiteBalls: whiteConfig, specialBall: specialConfig } = this.config;
        while (whiteBalls.length < whiteConfig.count) {
          const num = Math.floor(Math.random() * whiteConfig.max) + 1;
          if (!whiteBalls.includes(num)) whiteBalls.push(num);
        }
        whiteBalls.sort((a, b) => a - b);
        const specialBall = Math.floor(Math.random() * specialConfig.max) + 1;
        const currentSet = [...whiteBalls, specialBall];
        
        currentSet.forEach((number, index) => {
            const isSpecial = index === whiteConfig.count;
            const ball = this.createResultBall(number, isSpecial, number);
            ball.style.animationDelay = `${i * 0.1 + index * 0.05}s`;
            resultSetDiv.appendChild(ball);
        });
        resultBallsContainer.appendChild(resultSetDiv);
        this.addToHistory(currentSet);
      }
      
      if (!this.resultsPanel.classList.contains('active')) {
        this.resultsPanel.classList.add('active');
      }
  }
  
  addToHistory(numbers) {
      this.history.unshift(numbers);
      if (this.history.length > 10) { // Keep 10 items
          this.history.pop();
      }
      this.updateHistory();
  }
  
  updateHistory() {
      const historyList = this.shadowRoot.querySelector('.history-list');
      historyList.innerHTML = '';
      if (this.history.length === 0 || !this.config) {
        this.shadowRoot.querySelector('.history-panel').style.display = 'none';
        return;
      };
      this.shadowRoot.querySelector('.history-panel').style.display = 'block';

      this.history.forEach((numbers) => {
          const item = document.createElement('li');
          item.classList.add('history-item');
          const ballContainer = document.createElement('div');
          ballContainer.classList.add('history-ball-container');

          numbers.forEach((number, i) => {
              const isSpecial = i === this.config.whiteBalls.count;
              const ball = this.createBall(number, isSpecial, number);
              ball.classList.add('history-ball');
              ballContainer.appendChild(ball);
          });
          item.appendChild(ballContainer);
          historyList.appendChild(item);
      });
  }

  createBall(number, isSpecial, value) {
    const ballEl = document.createElement('div');
    ballEl.classList.add('ball');
    if (isSpecial) {
        ballEl.classList.add('special-ball');
    } else {
        ballEl.classList.add(`ball-color-${(value % 5) + 1}`);
    }
    ballEl.textContent = number;
    return ballEl;
  }

  createResultBall(number, isSpecial, value) {
    const ball = this.createBall(number, isSpecial, value);
    ball.classList.add('result-ball-animation');
    return ball;
  }
}

customElements.define('lotto-machine', LottoMachine);

document.addEventListener('DOMContentLoaded', () => {
    const lotteryList = document.querySelector('.lottery-list');
    const lottoMachine = document.querySelector('lotto-machine');
    const lottoNameEl = document.getElementById('lotto-name');
    const lottoTaglineEl = document.getElementById('lotto-tagline');
    const lottoInfoEl = document.getElementById('lotto-info');
    const themeToggle = document.getElementById('theme-toggle');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const analysisContentEl = document.getElementById('analysis-content');
    const newsContentEl = document.getElementById('news-content');

    let currentLotto = '';
    let analysisCache = {}; // Cache for analysis data

    function switchLotto(key) {
        if (currentLotto === key) return;
        currentLotto = key;

        const config = lotteries[key];
        lottoNameEl.textContent = config.name;
        lottoTaglineEl.textContent = config.tagline;
        lottoInfoEl.innerHTML = config.info;
        lottoMachine.setConfig(config);

        document.querySelectorAll('.lottery-list-item').forEach(item => {
            item.classList.toggle('active', item.dataset.lotto === key);
        });

        // Reset to generator tab whenever a new lottery is selected
        switchTab('generator');
    }

    function switchTab(tab) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        tabContents.forEach(c => c.classList.toggle('active', c.id === tab));

        if (tab === 'analysis') {
            fetchAnalysisAndNews(currentLotto);
        }
    }

    // Function to generate and render analysis
    function renderAnalysis(lottoKey) {
        const config = lotteries[lottoKey];
        if (!analysisCache[lottoKey]) {
            analysisCache[lottoKey] = generateAnalysis(config);
        }
        const { hotWhite, coldWhite, hotSpecial, coldSpecial } = analysisCache[lottoKey];

        const analysisHTML = `
            <p>This analysis identifies numbers that have been drawn frequently (hot) and infrequently (cold) in the last 200 simulated drawings for ${config.name}. This is for entertainment purposes and does not guarantee future results.</p>
            <br>
            <h3>Hot Numbers</h3>
            <p><strong>White Balls:</strong> ${hotWhite.join(', ' )}</p>
            <p><strong>${config.specialBall.name}:</strong> ${hotSpecial.join(', ' )}</p>
            <br>
            <h3>Cold Numbers</h3>
            <p><strong>White Balls:</strong> ${coldWhite.join(', ' )}</p>
            <p><strong>${config.specialBall.name}:</strong> ${coldSpecial.join(', ' )}</p>`;
        analysisContentEl.innerHTML = analysisHTML;
    }

    // Function to generate mock news
    function renderNews(lottoKey) {
        const config = lotteries[lottoKey];
        const newsHTML = `
            <article>
                <h4>Historic ${config.name} Jackpot Won!</h4>
                <p>A lucky individual in Anytown, USA, has claimed the record-breaking jackpot. The winning ticket was sold at a local convenience store.</p>
                <p><em>(Note: This is a sample news article. In a real application, this would be fed by a live news API.)</em></p>
            </article>
            <br>
            <article>
                <h4>Lottery Scams on the Rise: How to Protect Yourself</h4>
                <p>Officials are warning the public about a recent surge in lottery-related scams. Remember, you never have to pay a fee to collect a legitimate lottery prize.</p>
            </article>`;
        newsContentEl.innerHTML = newsHTML;
    }

    // Main function to fetch and display data
    async function fetchAnalysisAndNews(lottoKey) {
        analysisContentEl.innerHTML = `<p>Loading analysis for ${lotteries[lottoKey].name}...</p>`;
        newsContentEl.innerHTML = `<p>Loading news for ${lotteries[lottoKey].name}...</p>`;

        // Simulate API delay
        setTimeout(() => {
            renderAnalysis(lottoKey);
            renderNews(lottoKey);
        }, 800);
    }

    // Helper function to generate analysis data
    function generateAnalysis(config) {
        const whiteBallFreq = {};
        const specialBallFreq = {};
        const numDrawings = 200;

        for (let i = 0; i < numDrawings; i++) {
            // Generate white balls
            const whiteBalls = new Set();
            while (whiteBalls.size < config.whiteBalls.count) {
                const num = Math.floor(Math.random() * config.whiteBalls.max) + 1;
                whiteBalls.add(num);
            }
            whiteBalls.forEach(num => {
                whiteBallFreq[num] = (whiteBallFreq[num] || 0) + 1;
            });

            // Generate special ball
            const specialBall = Math.floor(Math.random() * config.specialBall.max) + 1;
            specialBallFreq[specialBall] = (specialBallFreq[specialBall] || 0) + 1;
        }

        const sortAndPick = (freqMap, count, ascending = true) => {
            return Object.entries(freqMap)
                .sort(([,a], [,b]) => ascending ? a - b : b - a)
                .slice(0, count)
                .map(([num]) => parseInt(num));
        };

        return {
            hotWhite: sortAndPick(whiteBallFreq, 5, false),
            coldWhite: sortAndPick(whiteBallFreq, 5, true),
            hotSpecial: sortAndPick(specialBallFreq, 1, false),
            coldSpecial: sortAndPick(specialBallFreq, 1, true)
        };
    }

    Object.keys(lotteries).forEach(key => {
        const li = document.createElement('li');
        li.classList.add('lottery-list-item');
        li.dataset.lotto = key;
        li.textContent = lotteries[key].name;
        li.addEventListener('click', () => switchLotto(key));
        lotteryList.appendChild(li);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Theme toggle functionality
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme + '-mode');
    try {
      lottoMachine.shadowRoot.querySelector('body, .lotto-container').classList.add(savedTheme + '-mode');
    } catch (e) {}
    themeToggle.innerHTML = savedTheme === 'light' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        let currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.remove(currentTheme + '-mode');
        document.body.classList.add(newTheme + '-mode');
        try {
          lottoMachine.shadowRoot.querySelector('body, .lotto-container').classList.remove(currentTheme + '-mode');
          lottoMachine.shadowRoot.querySelector('body, .lotto-container').classList.add(newTheme + '-mode');
        } catch (e) {}
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    });

    // Set the default lottery on page load
    switchLotto('powerball');
});
