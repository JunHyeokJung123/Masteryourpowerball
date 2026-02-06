
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
    this.drawOneButton = this.shadowRoot.querySelector('#draw-one-button');
    this.drawFiveButton = this.shadowRoot.querySelector('#draw-five-button');
    this.historyPanel = this.shadowRoot.querySelector('.history-panel');
    
    this.drawOneButton.addEventListener('click', () => this.draw(1));
    this.drawFiveButton.addEventListener('click', () => this.draw(5));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }

        .lotto-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
        }

        .button-container {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        button {
          background-color: #48bb78; /* Engaging Green */
          border: none;
          color: white;
          padding: 15px 30px;
          text-align: center;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          border-radius: 8px;
          transition: background-color 0.3s, transform 0.1s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        button:hover { background-color: #38a169; }
        button:active { transform: scale(0.98); }
        button:disabled { background-color: #a0aec0; cursor: not-allowed; }

        .results-panel {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          width: 100%;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease-out;
          visibility: hidden;
          max-height: 0;
        }

        .results-panel.active {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
          max-height: 1000px; /* Allow space for multiple results */
        }

        .results-title {
            margin: 0 0 25px 0;
            font-size: 2em;
            font-weight: bold;
            color: #2c5282; /* Trustworthy Blue */
        }

        .result-balls {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        
        .result-set {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .ball {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.4em;
          font-weight: bold;
          color: #fff;
          box-shadow: inset -3px -3px 8px rgba(0,0,0,0.3);
          background-origin: border-box;
          border: 2px solid transparent;
        }
        
        .result-ball-animation {
          animation: growIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform: scale(0);
        }

        .color-1 { background-color: #e53e3e; } /* Red */
        .color-2 { background-color: #3182ce; } /* Blue */
        .color-3 { background-color: #38a169; } /* Green */
        .color-4 { background-color: #dd6b20; } /* Orange */
        .color-5 { background-color: #805ad5; } /* Purple */

        .powerball {
          background-color: #f6e05e; /* Yellow */
          color: #2d3748 !important;
          border-color: #d69e2e;
        }
        
        .history-panel {
          margin-top: 20px;
          width: 100%;
        }
        
        .history-title {
            margin: 0 0 15px 0;
            font-size: 1.5em;
            color: #2c5282;
            text-align: center;
        }
        .history-list { 
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
         }
        
        .history-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background-color: #ffffff;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .history-ball-container { display: flex; gap: 6px; }
        .history-ball { width: 30px; height: 30px; font-size: 0.9em; }

        @keyframes growIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

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

        <ins class="adsbygoogle"
             style="display:block; margin-top: 30px;"
             data-ad-client="ca-pub-6278607452967394"
             data-ad-slot="7639016828"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    `;
  }

  toggleTheme() {
      // This can be re-implemented if needed, but for now we focus on a clean light UI.
  }

  draw(count = 1) {
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
      resultBallsContainer.innerHTML = ''; // Clear previous results

      resultsTitle.textContent = this.resultTitles[Math.floor(Math.random() * this.resultTitles.length)];

      for (let i = 0; i < count; i++) {
        const resultSetDiv = document.createElement('div');
        resultSetDiv.classList.add('result-set');

        const whiteBalls = [];
        while (whiteBalls.length < 5) {
          const num = Math.floor(Math.random() * 69) + 1;
          if (!whiteBalls.includes(num)) {
            whiteBalls.push(num);
          }
        }
        whiteBalls.sort((a, b) => a - b);
        const powerball = Math.floor(Math.random() * 26) + 1;
        const currentSet = [...whiteBalls, powerball];
        
        currentSet.forEach((number, index) => {
            const colorClass = index < 5 ? `color-${(number % 5) + 1}` : 'powerball';
            const ball = this.createResultBall(number, colorClass);
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
      if (this.history.length > 5) { // Show fewer history items to keep it clean
          this.history.pop();
      }
      this.updateHistory();
  }
  
  updateHistory() {
      const historyList = this.shadowRoot.querySelector('.history-list');
      historyList.innerHTML = '';
      if (this.history.length === 0) return;
      
      this.history.forEach((numbers) => {
          const item = document.createElement('li');
          item.classList.add('history-item');
          
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
