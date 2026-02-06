
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
        .lotto-container { display: flex; flex-direction: column; align-items: center; gap: 30px; width: 100%; }
        .button-container { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        button { background-color: #48bb78; border: none; color: white; padding: 15px 30px; text-align: center; font-size: 1.1em; font-weight: bold; cursor: pointer; border-radius: 8px; transition: background-color 0.3s, transform 0.1s; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        button:hover { background-color: #38a169; }
        button:active { transform: scale(0.98); }
        button:disabled { background-color: #a0aec0; cursor: not-allowed; }
        .results-panel { background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); width: 100%; text-align: center; opacity: 0; transform: translateY(20px); transition: all 0.5s ease-out; visibility: hidden; max-height: 0; }
        .results-panel.active { opacity: 1; transform: translateY(0); visibility: visible; max-height: 1000px; }
        .results-title { margin: 0 0 25px 0; font-size: 2em; font-weight: bold; color: #2c5282; }
        .result-balls { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .result-set { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
        .ball { width: 55px; height: 55px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.4em; font-weight: bold; color: #fff; box-shadow: inset -3px -3px 8px rgba(0,0,0,0.3); border: 2px solid transparent; }
        .result-ball-animation { animation: growIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transform: scale(0); }
        .white-ball { background-color: #3182ce; }
        .special-ball { background-color: #e53e3e; color: #fff; border-color: #c53030; }
        .history-panel { margin-top: 20px; width: 100%; }
        .history-title { margin: 0 0 15px 0; font-size: 1.5em; color: #2c5282; text-align: center; }
        .history-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .history-item { display: flex; align-items: center; justify-content: center; gap: 10px; background-color: #ffffff; padding: 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
        .history-ball-container { display: flex; gap: 6px; }
        .history-ball { width: 30px; height: 30px; font-size: 0.9em; }
        @keyframes growIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
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
        <ins class="adsbygoogle" style="display:block; margin-top: 30px;" data-ad-client="ca-pub-6278607452967394" data-ad-slot="7639016828" data-ad-format="auto" data-full-width-responsive="true"></ins>
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
            const ball = this.createResultBall(number, isSpecial);
            ball.style.animationDelay = `${i * 0.15 + index * 0.08}s`;
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
      if (this.history.length > 5) this.history.pop();
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
              const ball = this.createBall(number, isSpecial);
              ball.classList.add('history-ball');
              ballContainer.appendChild(ball);
          });
          item.appendChild(ballContainer);
          historyList.appendChild(item);
      });
  }

  createBall(number, isSpecial) {
    const ballEl = document.createElement('div');
    ballEl.classList.add('ball', isSpecial ? 'special-ball' : 'white-ball');
    ballEl.textContent = number;
    return ballEl;
  }

  createResultBall(number, isSpecial) {
    const ball = this.createBall(number, isSpecial);
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
    let currentLotto = '';

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
    }

    Object.keys(lotteries).forEach(key => {
        const li = document.createElement('li');
        li.classList.add('lottery-list-item');
        li.dataset.lotto = key;
        li.textContent = lotteries[key].name;
        li.addEventListener('click', () => switchLotto(key));
        lotteryList.appendChild(li);
    });

    // Set the default lottery on page load
    switchLotto('powerball');
});
