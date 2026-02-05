
class LottoMachine extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          text-align: center;
        }
        .lotto-numbers {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .lotto-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 5px;
          font-size: 20px;
          font-weight: bold;
        }
      </style>
      <h1>Lotto Number Generator</h1>
      <button>Generate</button>
      <div class="lotto-numbers"></div>
      <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="YYYYYYYYYY"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    `;
    this.shadowRoot.querySelector('button').addEventListener('click', () => this.generateLottoNumbers());
  }

  generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    const lottoNumbersContainer = this.shadowRoot.querySelector('.lotto-numbers');
    lottoNumbersContainer.innerHTML = '';
    sortedNumbers.forEach(number => {
      const lottoNumberElement = document.createElement('div');
      lottoNumberElement.classList.add('lotto-number');
      lottoNumberElement.textContent = number;
      lottoNumbersContainer.appendChild(lottoNumberElement);
    });
  }
}

customElements.define('lotto-machine', LottoMachine);

class PartnershipForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          text-align: center;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }
        input, textarea {
          width: 300px;
          margin-bottom: 10px;
          padding: 5px;
        }
        button {
          padding: 10px 20px;
        }
      </style>
      <h1>Partnership Inquiry</h1>
      <form>
        <input type="text" placeholder="Name">
        <input type="email" placeholder="Email">
        <textarea placeholder="Message"></textarea>
        <button>Submit</button>
      </form>
    `;
  }
}

customElements.define('partnership-form', PartnershipForm);

const navLinks = document.querySelectorAll('nav a');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    pages.forEach(page => {
      if (page.id === targetId) {
        page.style.display = 'block';
      } else {
        page.style.display = 'none';
      }
    });
    navLinks.forEach(navLink => {
      if (navLink === e.target) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    });
  });
});
