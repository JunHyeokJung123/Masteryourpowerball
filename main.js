class LottoMachine extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.resultTitles = [
      "Your Lucky Numbers!", "Here's Your Fortune!", "Destiny's Digits!",
      "Your Golden Ticket!", "Future is Now!", "Millionaire's Mix!",
      "The Chosen Ones!", "Your Winning Combo!", "Numbers of Power!", "Luck's Selection!"
    ];
    this.history = [];
  }

  connectedCallback() {
    this.render();
    this.resultsPanel = this.shadowRoot.querySelector('.results-panel');
    this.drawButton = this.shadowRoot.querySelector('button');
    this.historyPanel = this.shadowRoot.querySelector('.history-panel');
    this.themeToggleButton = this.shadowRoot.querySelector('.theme-toggle-button');
    
    this.drawButton.addEventListener('click', () => this.draw());
    this.themeToggleButton.addEventListener('click', () => this.toggleTheme());
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --background-color: #1a1a1a;
          --text-color: #e0e0e0;
          --panel-bg-color: #2a2a2a;
          --panel-shadow-color: rgba(0,0,0,0.5);
          --button-bg-color: #4CAF50;
          --button-text-color: white;
          --history-item-bg-color: #333;

          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
          box-sizing: border-box;
          background-color: var(--background-color);
          transition: background-color 0.3s;
        }

        :host(.light-mode) {
          --background-color: #f0f0f0;
          --text-color: #333;
          --panel-bg-color: #fff;
          --panel-shadow-color: rgba(0,0,0,0.15);
          --button-bg-color: #5cb85c;
          --button-text-color: white;
          --history-item-bg-color: #e9e9e9;
        }
        
        .lotto-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          width: 100%;
        }

        .main-content {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;
          gap: 40px;
          width: 100%;
          max-width: 1200px;
        }

        .ball {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5em;
          font-weight: bold;
          color: #fff;
          box-shadow: inset -5px -5px 10px rgba(0,0,0,0.3);
        }

        .color-1 { background: radial-gradient(circle, #f8a, #c14); }
        .color-2 { background: radial-gradient(circle, #8fa, #1c4); }
        .color-3 { background: radial-gradient(circle, #8af, #14c); }
        .color-4 { background: radial-gradient(circle, #fa8, #c41); }
        .color-5 { background: radial-gradient(circle, #af8, #4c1); }

        .powerball {
          background: radial-gradient(circle, #ffcc00, #ff9900) !important;
          color: #000 !important;
          border: 2px solid #fff;
        }

        button {
          background-color: var(--button-bg-color);
          border: none;
          color: var(--button-text-color);
          padding: 20px 40px;
          text-align: center;
          font-size: 24px;
          cursor: pointer;
          border-radius: 12px;
          transition: background-color 0.3s, transform 0.1s;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        button:hover { filter: brightness(1.1); }
        button:active { transform: scale(0.98); }
        button:disabled { background-color: #555; cursor: not-allowed; }

        .results-panel {
          background-color: var(--panel-bg-color);
          color: var(--text-color);
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 10px 20px var(--panel-shadow-color);
          width: 100%;
          max-width: 550px;
          text-align: center;
          opacity: 0;
          transform: scale(0.9) translateY(20px);
          transition: all 0.4s ease-in-out;
          visibility: hidden;
          max-height: 0;
          order: 2;
        }

        .results-panel.active {
          opacity: 1;
          transform: scale(1) translateY(0);
          visibility: visible;
          max-height: 500px;
        }

        .results-title { margin: 0 0 20px 0; font-size: 2em; color: var(--button-bg-color); }
        .result-balls { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }

        .result-ball-animation {
          animation: growIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform: scale(0);
        }
        
        .history-panel {
          background-color: var(--panel-bg-color);
          color: var(--text-color);
          border-radius: 10px;
          padding: 15px;
          box-shadow: 0 5px 15px var(--panel-shadow-color);
          width: 320px;
          transition: all 0.3s;
          order: 1;
        }
        
        .history-title { margin: 0 0 10px 0; font-size: 1.2em; color: var(--button-bg-color); text-align: center; }
        .history-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        
        .history-item {
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: var(--history-item-bg-color);
            padding: 8px;
            border-radius: 5px;
        }

        .history-number {
            font-size: 1em;
            font-weight: bold;
            color: var(--button-bg-color);
            width: 20px;
            text-align: right;
            margin-right: 5px;
        }
        .history-ball-container { display: flex; gap: 4px; }
        .history-ball { width: 25px; height: 25px; font-size: 0.8em; font-weight: bold; }

        .theme-toggle-button {
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--panel-bg-color);
            border: 2px solid var(--button-bg-color);
            color: var(--button-bg-color);
            width: 45px;
            height: 45px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s;
            z-index: 100;
        }
        .theme-toggle-button:hover { transform: scale(1.1); }

        @keyframes growIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        @media (max-width: 900px) {
          .main-content {
            flex-direction: column;
            align-items: center;
          }
          .history-panel {
            width: 100%;
            max-width: 550px;
            order: 1;
          }
          .results-panel {
            order: 2;
          }
        }
      </style>
      
      <div class="lotto-container">
        <button>Press for Fortune</button>
        <div class="main-content">
            <div class="results-panel">
               <h3 class="results-title">Winning Numbers</h3>
               <div class="result-balls"></div>
            </div>
            <div class="history-panel">
              <h4 class="history-title">Recent Draws</h4>
              <ul class="history-list"></ul>
            </div>
        </div>
      </div>
      <button class="theme-toggle-button">☀️</button>
    `;
  }

  toggleTheme() {
      document.body.classList.toggle('light-mode');
      this.shadowRoot.host.classList.toggle('light-mode');
      this.themeToggleButton.innerHTML = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
  }

  draw() {
    this.drawButton.disabled = true;
    
    if (this.resultsPanel.classList.contains('active')) {
      this.resultsPanel.classList.remove('active');
      setTimeout(() => {
        this.displayResults();
        this.drawButton.disabled = false;
      }, 400);
    } else {
      this.displayResults();
      this.drawButton.disabled = false;
    }
  }

  displayResults() {
      const resultBallsContainer = this.shadowRoot.querySelector('.result-balls');
      const resultsTitle = this.shadowRoot.querySelector('.results-title');
      resultBallsContainer.innerHTML = '';

      resultsTitle.textContent = this.resultTitles[Math.floor(Math.random() * this.resultTitles.length)];

      const whiteBalls = [];
      while (whiteBalls.length < 5) {
        const num = Math.floor(Math.random() * 69) + 1;
        if (!whiteBalls.includes(num)) {
          whiteBalls.push(num);
        }
      }
      
      // Sort the main numbers in ascending order
      whiteBalls.sort((a, b) => a - b);
      
      const powerball = Math.floor(Math.random() * 26) + 1;
      const finalBalls = [...whiteBalls, powerball];
      
      this.addToHistory(finalBalls);

      finalBalls.forEach((number, index) => {
          const colorClass = index < 5 ? `color-${(number % 5) + 1}` : 'powerball';
          const ball = this.createResultBall(number, colorClass);
          ball.style.animationDelay = `${index * 0.1}s`;
          resultBallsContainer.appendChild(ball);
      });
      
      this.resultsPanel.classList.add('active');
  }
  
  addToHistory(numbers) {
      this.history.unshift(numbers);
      if (this.history.length > 10) {
          this.history.pop();
      }
      this.updateHistory();
  }
  
  updateHistory() {
      const historyList = this.shadowRoot.querySelector('.history-list');
      historyList.innerHTML = '';
      
      this.history.forEach((numbers, index) => {
          const item = document.createElement('li');
          item.classList.add('history-item');
          
          const numberEl = document.createElement('span');
          numberEl.classList.add('history-number');
          numberEl.textContent = `${index + 1}.`;
          item.appendChild(numberEl);
          
          const ballContainer = document.createElement('div');
          ballContainer.classList.add('history-ball-container');

          numbers.forEach((number, i) => {
              const colorClass = i < 5 ? `color-${(number % 5) + 1}` : 'powerball';
              const ball = this.createBall(number, colorClass);
              ball.classList.add('history-ball');
              ballContainer.appendChild(ball);
          });
          item.appendChild(ballContainer);
          
          historyList.appendChild(item);
      });
  }

  createBall(number, colorClass) {
    const ballEl = document.createElement('div');
    ballEl.classList.add('ball', colorClass);
    ballEl.textContent = number;
    return ballEl;
  }

  createResultBall(number, colorClass) {
    const ball = this.createBall(number, colorClass);
    ball.classList.add('result-ball-animation');
    return ball;
  }
}

customElements.define('lotto-machine', LottoMachine);

class PartnershipForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
          box-sizing: border-box;
          --background-color: #1a1a1a;
          --text-color: #e0e0e0;
          --panel-bg-color: #2a2a2a;
          --panel-shadow-color: rgba(0,0,0,0.5);
          --button-bg-color: #4CAF50;
          --button-text-color: white;
        }

        :host(.light-mode) {
          --background-color: #f0f0f0;
          --text-color: #333;
          --panel-bg-color: #fff;
          --panel-shadow-color: rgba(0,0,0,0.15);
          --button-bg-color: #5cb85c;
        }
        
        form {
          background-color: var(--panel-bg-color);
          color: var(--text-color);
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 10px 20px var(--panel-shadow-color);
          width: 100%;
          max-width: 550px;
          text-align: center;
        }

        h2 {
          margin: 0 0 20px 0;
          font-size: 2em;
          color: var(--button-bg-color);
        }

        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input, textarea {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #555;
          background-color: #333;
          color: #fff;
          box-sizing: border-box;
        }

        button {
          background-color: var(--button-bg-color);
          border: none;
          color: var(--button-text-color);
          padding: 15px 30px;
          text-align: center;
          font-size: 1.2em;
          cursor: pointer;
          border-radius: 8px;
          transition: background-color 0.3s;
        }

        button:hover {
          filter: brightness(1.1);
        }
      </style>
      <form>
        <h2>Partnership Inquiry</h2>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
  }
}

customElements.define('partnership-form', PartnershipForm);

function handleNavigation() {
  const pages = document.querySelectorAll('.page');
  const links = document.querySelectorAll('nav a');
  const hash = window.location.hash || '#lotto';

  pages.forEach(page => {
    page.style.display = 'none';
  });

  links.forEach(link => {
    link.classList.remove('active');
  });

  const activePage = document.querySelector(hash);
  const activeLink = document.querySelector(`nav a[href="${hash}"]`);

  if (activePage) {
    activePage.style.display = 'flex';
  }

  if (activeLink) {
    activeLink.classList.add('active');
  }
}

window.addEventListener('hashchange', handleNavigation);
window.addEventListener('DOMContentLoaded', handleNavigation);
