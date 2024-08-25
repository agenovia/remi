const createRemindPage = () => {
  // additionaly logic goes here

  return /*html*/ `
    <div class="container">
          <div class="nav-container">
            <button
              class="menu-button"
              hx-trigger="click"
              hx-get="http://localhost:42000/v1/record"
              hx-target="#tab-content"
              hx-swap="innerHTML"
            >
              Record
            </button>
            <button
            class="menu-button"
              hx-trigger="click"
              hx-get="http://localhost:42000/v1/recap"
              hx-target="#tab-content"
              hx-swap="innerHTML"
            >
              Recap
            </button>
            <button
              class="menu-button"
              hx-trigger="click"
              hx-get="http://localhost:42000/v1/recall"
              hx-target="#tab-content"
              hx-swap="innerHTML"
            >
              Recall
            </button>
            <button
              class="menu-button"
              id="selected-menu-button"
            >
              Remind
            </button>
          </div>
        <div class="content">
            <div>Remind</div>
        </div>
    </div>
    `;
};

export default createRemindPage;
