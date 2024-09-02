const createRecallPage = () => {
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
             hx-trigger="click"
             hx-get="http://localhost:42000/recap"
             hx-target="#tab-content"
             hx-swap="innerHTML"
            >
              Recap
            </button>
            <button
              class="menu-button"
              id="selected-menu-button"
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
            <div>Recall</div>
        </div>
    </div>
    `;
};

export default createRecallPage;
