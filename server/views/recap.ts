const createRecapPage = () => {
  // additionaly logic goes here

  return /*html*/ `
  <div class="container">
        <div class="nav-container">
          <button
            class="menu-button"
            hx-trigger="click"
            hx-get="http://localhost:42000/record"
            hx-target="#tab-content"
            hx-swap="innerHTML"
          >
            Record
          </button>
          <button
            class="menu-button"
            id="selected-menu-button"
          >
            Recap
          </button>
          <button
            class="menu-button"
            hx-trigger="click"
            hx-get="http://localhost:42000/recall"
            hx-target="#tab-content"
            hx-swap="innerHTML"
          >
            Recall
          </button>
          <button
            class="menu-button"
            hx-trigger="click"
            hx-get="http://localhost:42000/remind"
            hx-target="#tab-content"
            hx-swap="innerHTML"
            >
              Remind
          </button>
        </div>
      <div class="content">
          <div class="nav-container">
            <button class="menu-button" hx-post="http://localhost:42000/recap" hx-vals='{"timespan": "1 day"}'>Last Day</button>
            <button class="menu-button">Last Week</button>
            <button class="menu-button">Last Month</button>
          </div>
      </div>
  </div>
  `;
};

export default createRecapPage;
