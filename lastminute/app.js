const state = {
  screen: "home",
  location: "Mumbai",
  homeCategory: "All",
  feedCategory: "Concerts",
  feedFilter: "Tonight",
  selectedId: "boiler-room",
};

const deals = [
  {
    id: "boiler-room",
    title: "BOILER ROOM MUMBAI",
    category: "Concerts",
    location: "Mumbai",
    venue: "NSCI DOME",
    time: "TONIGHT 10:30 PM",
    seat: "GA FLOOR",
    seller: "4.9/5 VERIFIED",
    original: 2499,
    price: 999,
    viewers: 3,
    expiresAt: Date.now() + 4 * 60 * 60 * 1000 + 22 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "samay",
    title: "SAMAY LIVE",
    category: "Comedy",
    location: "Mumbai",
    venue: "BANDRA BASEMENT",
    time: "TONIGHT 8:45 PM",
    seat: "TABLE 06",
    seller: "4.8/5 VERIFIED",
    original: 1800,
    price: 799,
    viewers: 5,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000 + 14 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fest-pass",
    title: "NMIMS FEST PASS",
    category: "College Fests",
    location: "Mumbai",
    venue: "VILE PARLE CAMPUS",
    time: "TOMORROW 6:00 PM",
    seat: "DAY PASS",
    seller: "4.7/5 VERIFIED",
    original: 1200,
    price: 699,
    viewers: 2,
    expiresAt: Date.now() + 9 * 60 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bus-goa",
    title: "MUMBAI TO GOA",
    category: "Buses",
    location: "Mumbai",
    venue: "DADAR TT",
    time: "TONIGHT 11:55 PM",
    seat: "SLEEPER 14",
    seller: "4.6/5 VERIFIED",
    original: 2100,
    price: 1299,
    viewers: 1,
    expiresAt: Date.now() + 5 * 60 * 60 * 1000 + 8 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "diljit",
    title: "DILJIT FANPIT",
    category: "Concerts",
    location: "Mumbai",
    venue: "MMRDA GROUNDS",
    time: "SATURDAY 8:00 PM",
    seat: "FANPIT",
    seller: "5.0/5 VERIFIED",
    original: 5999,
    price: 3499,
    viewers: 9,
    expiresAt: Date.now() + 18 * 60 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "khan-delhi",
    title: "KHAN MARKET LATE SET",
    category: "Comedy",
    location: "Delhi",
    venue: "SAKET SOCIAL",
    time: "TONIGHT 9:15 PM",
    seat: "TABLE 03",
    seller: "4.8/5 VERIFIED",
    original: 1500,
    price: 850,
    viewers: 4,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000 + 32 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "indiranagar-noise",
    title: "INDIRANAGAR NOISE SET",
    category: "Concerts",
    location: "Bangalore",
    venue: "DOME YARD",
    time: "TONIGHT 11:00 PM",
    seat: "ENTRY PASS",
    seller: "4.9/5 VERIFIED",
    original: 2200,
    price: 1100,
    viewers: 6,
    expiresAt: Date.now() + 3 * 60 * 60 * 1000 + 18 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "underground",
    title: "UNDERGROUND SET",
    category: "Concerts",
    location: "Mumbai",
    venue: "LOWER PAREL WAREHOUSE",
    time: "TONIGHT 11:30 PM",
    seat: "ENTRY PASS",
    seller: "4.8/5 VERIFIED",
    original: 1600,
    price: 850,
    viewers: 4,
    expiresAt: Date.now() + 3 * 60 * 60 * 1000 + 4 * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  },
];

const homeCategories = ["All", "Concerts", "Comedy", "College Fests", "Buses"];
const feedFilters = ["Tonight", "Under ₹1000", "VIP"];

const homeFeed = document.querySelector("#homeFeed");
const homeCategoriesEl = document.querySelector("#homeCategories");
const feedFiltersEl = document.querySelector("#feedFilters");
const feedGrid = document.querySelector("#feedGrid");
const feedTitle = document.querySelector("#feedTitle");
const feedCount = document.querySelector("#feedCount");
const searchInput = document.querySelector("#searchInput");
const navButtons = document.querySelectorAll(".nav-button");
const screens = document.querySelectorAll(".screen");
const sellEntry = document.querySelector("#sellEntry");
const dropTicket = document.querySelector("#dropTicket");
const locationButton = document.querySelector("#locationButton");
const stealButton = document.querySelector("#stealButton");
const upiSheet = document.querySelector("#upiSheet");
const closeSheet = document.querySelector("#closeSheet");
const confirmBuy = document.querySelector("#confirmBuy");
const ticketForm = document.querySelector("#ticketForm");
const homeHeadline = document.querySelector("#homeHeadline");

function formatPrice(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function timeCode(expiresAt) {
  const diff = Math.max(0, expiresAt - Date.now());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `T-${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function filteredHomeDeals() {
  return deals.filter((deal) => {
    const matchesCategory =
      state.homeCategory === "All" || deal.category === state.homeCategory;
    const query = searchInput.value.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      deal.title.toLowerCase().includes(query) ||
      deal.category.toLowerCase().includes(query) ||
      deal.venue.toLowerCase().includes(query);

    return matchesCategory && matchesSearch && deal.location === state.location;
  });
}

function filteredFeedDeals() {
  return deals.filter((deal) => {
    if (deal.location !== state.location) {
      return false;
    }

    if (deal.category !== state.feedCategory) {
      return false;
    }

    if (state.feedFilter === "Under ₹1000") {
      return deal.price <= 1000;
    }

    if (state.feedFilter === "VIP") {
      return deal.seat.includes("FANPIT") || deal.price >= 2500;
    }

    return true;
  });
}

function switchScreen(next) {
  state.screen = next;
  screens.forEach((screen) => {
    screen.classList.toggle("screen-active", screen.dataset.screen === next);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === next);
  });
}

function selectedDeal() {
  return deals.find((deal) => deal.id === state.selectedId) || deals[0];
}

function openDetails(id) {
  state.selectedId = id;
  renderDetails();
  switchScreen("details");
}

function renderHomeCategories() {
  homeCategoriesEl.innerHTML = "";

  homeCategories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `category-pill${state.homeCategory === category ? " active" : ""}`;
    button.type = "button";
    button.textContent = category.toUpperCase();
    button.addEventListener("click", () => {
      state.homeCategory = category;
      renderHome();
      if (category !== "All") {
        state.feedCategory = category;
        renderFeed();
      }
    });
    homeCategoriesEl.appendChild(button);
  });
}

function renderHome() {
  renderHomeCategories();
  homeHeadline.textContent = `TONIGHT IN ${state.location.toUpperCase()}`;

  const items = filteredHomeDeals();
  homeFeed.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("article");
    empty.className = "deal-card";
    empty.innerHTML = `
      <div class="card-body" style="grid-template-columns:1fr">
        <div class="card-copy">
          <p class="card-topline">EMPTY</p>
          <h3>CITY'S DEAD TONIGHT.</h3>
          <p>CHANGE LOCATION.</p>
        </div>
      </div>
    `;
    homeFeed.appendChild(empty);
    return;
  }

  items.forEach((deal) => {
    const card = document.createElement("article");
    card.className = "deal-card";
    card.innerHTML = `
      <div class="deal-image">
        <img src="${deal.image}" alt="${deal.title}" />
      </div>
      <div class="card-body">
        <div class="card-copy">
          <p class="card-topline">${deal.category.toUpperCase()} • ${deal.venue}</p>
          <h3>${deal.title}</h3>
          <p>${deal.time}</p>
        </div>
        <div class="card-side">
          <div class="price-block">
            <span>${formatPrice(deal.original)}</span>
            <strong>${formatPrice(deal.price)}</strong>
          </div>
          <button class="grab-button" type="button">GRAB ${formatPrice(deal.price)}</button>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openDetails(deal.id));
    homeFeed.appendChild(card);
  });
}

function renderFeedFilters() {
  feedFiltersEl.innerHTML = "";

  feedFilters.forEach((filter) => {
    const button = document.createElement("button");
    button.className = `filter-chip${state.feedFilter === filter ? " active" : ""}`;
    button.type = "button";
    button.textContent = filter.toUpperCase();
    button.addEventListener("click", () => {
      state.feedFilter = filter;
      renderFeed();
    });
    feedFiltersEl.appendChild(button);
  });
}

function renderFeed() {
  renderFeedFilters();
  feedTitle.textContent = `${state.feedCategory.toUpperCase()} GRID`;

  const items = filteredFeedDeals();
  feedCount.textContent = `${String(items.length).padStart(2, "0")} LEFT`;
  feedGrid.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("article");
    empty.className = "grid-card muted";
    empty.style.gridColumn = "1 / -1";
    empty.innerHTML = `
      <div>
        <p class="time-code">EMPTY</p>
        <h3>NO GIG TICKETS LEFT.</h3>
      </div>
      <p>CHECK COMEDY.</p>
    `;
    feedGrid.appendChild(empty);
    return;
  }

  items.forEach((deal) => {
    const card = document.createElement("article");
    card.className = "grid-card";
    card.innerHTML = `
      <div>
        <p class="time-code">${timeCode(deal.expiresAt)}</p>
        <h3>${deal.title}</h3>
        <p>${deal.venue}</p>
      </div>
      <div class="grid-price">${formatPrice(deal.price)}</div>
    `;
    card.addEventListener("click", () => openDetails(deal.id));
    feedGrid.appendChild(card);
  });
}

function renderDetails() {
  const deal = selectedDeal();
  document.querySelector("#detailImage").src = deal.image;
  document.querySelector("#detailImage").alt = deal.title;
  document.querySelector("#detailCategory").textContent = deal.category.toUpperCase();
  document.querySelector("#detailName").textContent = deal.title;
  document.querySelector(
    "#detailUrgency"
  ).textContent = `HOT RIGHT NOW • ${deal.viewers} PEOPLE LOOKING AT THIS TICKET`;
  document.querySelector("#detailTime").textContent = deal.time;
  document.querySelector("#detailVenue").textContent = deal.venue;
  document.querySelector("#detailSeller").textContent = deal.seller;
  document.querySelector("#detailSeat").textContent = deal.seat;
  document.querySelector("#detailCountdown").textContent = timeCode(deal.expiresAt);
  document.querySelector("#detailOriginal").textContent = formatPrice(deal.original);
  document.querySelector("#detailPrice").textContent = formatPrice(deal.price);
  document.querySelector("#sheetTitle").textContent = deal.title;
  document.querySelector("#sheetPrice").textContent = formatPrice(deal.price);
}

function cycleLocation() {
  const locations = ["Mumbai", "Delhi", "Bangalore"];
  const nextIndex = (locations.indexOf(state.location) + 1) % locations.length;
  state.location = locations[nextIndex];
  locationButton.textContent = state.location.toUpperCase();
  const firstInCity = deals.find((deal) => deal.location === state.location);
  if (firstInCity) {
    state.feedCategory = firstInCity.category;
    state.selectedId = firstInCity.id;
  }
  renderHome();
  renderFeed();
  renderDetails();
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => switchScreen(button.dataset.target));
});

sellEntry.addEventListener("click", () => switchScreen("seller"));
dropTicket.addEventListener("click", () => switchScreen("form"));
locationButton.addEventListener("click", cycleLocation);
searchInput.addEventListener("input", renderHome);

stealButton.addEventListener("click", () => {
  renderDetails();
  upiSheet.classList.remove("hidden");
});

closeSheet.addEventListener("click", () => {
  upiSheet.classList.add("hidden");
});

upiSheet.addEventListener("click", (event) => {
  if (event.target === upiSheet) {
    upiSheet.classList.add("hidden");
  }
});

document.querySelectorAll(".upi-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".upi-option").forEach((option) => {
      option.classList.remove("active");
    });
    button.classList.add("active");
  });
});

confirmBuy.addEventListener("click", () => {
  confirmBuy.textContent = "UPI DRAWER OPENED";
  setTimeout(() => {
    confirmBuy.textContent = "PAY WITH UPI";
    upiSheet.classList.add("hidden");
  }, 1200);
});

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(ticketForm);
  const price = Number(form.get("price"));
  const original = Number(form.get("original"));
  const created = {
    id: `custom-${Date.now()}`,
    title: String(form.get("title")).toUpperCase(),
    category: String(form.get("category")),
    location: state.location,
    venue: String(form.get("venue")).toUpperCase(),
    time: "JUST DROPPED",
    seat: String(form.get("seat")).toUpperCase() || "GA",
    seller: "5.0/5 VERIFIED",
    original,
    price,
    viewers: 1,
    expiresAt: Date.now() + Number(form.get("expires")) * 60 * 1000,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  };

  deals.unshift(created);
  state.selectedId = created.id;
  state.feedCategory = created.category;
  state.homeCategory = "All";
  ticketForm.reset();
  renderHome();
  renderFeed();
  openDetails(created.id);
});

setInterval(() => {
  renderHome();
  renderFeed();
  if (state.screen === "details") {
    renderDetails();
  }
}, 1000);

renderHome();
renderFeed();
renderDetails();
