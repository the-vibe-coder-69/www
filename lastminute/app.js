const state = {
  currentScreen: "home",
  selectedCategory: "Events",
  selectedLocation: "Bangalore",
  selectedListingId: "evt-1",
  search: "",
};

const categories = ["Events", "Comedy", "Concerts", "Buses", "Movies"];

const listings = [
  {
    id: "evt-1",
    title: "Sunburn Arena ft. Martin Garrix",
    category: "Concerts",
    location: "Bangalore",
    venue: "NICE Grounds, Today 8:00 PM",
    seat: "GA • Gate 3",
    originalPrice: 3499,
    askingPrice: 2499,
    expiresAt: Date.now() + 14 * 60 * 1000,
    discount: 29,
    transferability: "Official transfer allowed",
    seller: "Aarav S.",
    trustScore: 4.9,
    transfers: 22,
    note: "Instant transfer through BookMyShow after escrow payment.",
    color: "#0d5bff",
  },
  {
    id: "evt-2",
    title: "Canvas Laugh Club Late Show",
    category: "Comedy",
    location: "Bangalore",
    venue: "Indiranagar, Tonight 9:30 PM",
    seat: "Table for 2",
    originalPrice: 1400,
    askingPrice: 950,
    expiresAt: Date.now() + 9 * 60 * 1000,
    discount: 32,
    transferability: "Official transfer allowed",
    seller: "Ritika M.",
    trustScore: 4.8,
    transfers: 11,
    note: "QR transfer works within 3 minutes. Bought too many seats.",
    color: "#7b4dff",
  },
  {
    id: "evt-3",
    title: "Christ University Fest Night Pass",
    category: "Events",
    location: "Bangalore",
    venue: "Central Campus, Tomorrow 6:00 PM",
    seat: "Festival pass",
    originalPrice: 899,
    askingPrice: 650,
    expiresAt: Date.now() + 48 * 60 * 1000,
    discount: 28,
    transferability: "Name change supported",
    seller: "Karthik R.",
    trustScore: 4.7,
    transfers: 9,
    note: "Student ID check handled through organizer name update.",
    color: "#ff7b2c",
  },
  {
    id: "evt-4",
    title: "Delhi Capitals Premium East Stand",
    category: "Events",
    location: "Delhi",
    venue: "Arun Jaitley Stadium, Today 7:30 PM",
    seat: "East Stand Row F",
    originalPrice: 2800,
    askingPrice: 2100,
    expiresAt: Date.now() + 19 * 60 * 1000,
    discount: 25,
    transferability: "Official transfer allowed",
    seller: "Naman B.",
    trustScore: 4.9,
    transfers: 34,
    note: "Transfer via insider app. Entry confirmed by previous buyers.",
    color: "#005f73",
  },
  {
    id: "evt-5",
    title: "Mumbai to Pune Seater Sleeper",
    category: "Buses",
    location: "Mumbai",
    venue: "Dadar TT, Departs 10:45 PM",
    seat: "Window 14",
    originalPrice: 1800,
    askingPrice: 1320,
    expiresAt: Date.now() + 36 * 60 * 1000,
    discount: 27,
    transferability: "Name change supported",
    seller: "Neha P.",
    trustScore: 4.6,
    transfers: 13,
    note: "Operator supports passenger detail update until boarding minus 2 hours.",
    color: "#00897b",
  },
  {
    id: "evt-6",
    title: "PVR Luxe Dune Night Show",
    category: "Movies",
    location: "Delhi",
    venue: "DLF Promenade, Tonight 11:55 PM",
    seat: "Recliner K7-K8",
    originalPrice: 1200,
    askingPrice: 780,
    expiresAt: Date.now() + 12 * 60 * 1000,
    discount: 35,
    transferability: "Entry QR transfer only",
    seller: "Ishita D.",
    trustScore: 4.5,
    transfers: 7,
    note: "Buyer gets QR and booking ID. Works best for same-day transfer.",
    color: "#9c27b0",
  },
];

const chipContainer = document.querySelector("#categoryChips");
const feed = document.querySelector("#listingFeed");
const searchInput = document.querySelector("#searchInput");
const navButtons = document.querySelectorAll(".nav-item");
const screens = document.querySelectorAll(".screen");
const locationButtons = document.querySelectorAll("[data-location]");
const sellShortcut = document.querySelector("#sellShortcut");
const buyNowButton = document.querySelector("#buyNowButton");
const payButton = document.querySelector("#payButton");
const sellForm = document.querySelector("#sellForm");

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCountdown(expiresAt) {
  const diff = Math.max(0, expiresAt - Date.now());
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function getSelectedListing() {
  return listings.find((listing) => listing.id === state.selectedListingId) ?? listings[0];
}

function filteredListings() {
  return listings.filter((listing) => {
    const matchesLocation = listing.location === state.selectedLocation;
    const matchesCategory =
      state.selectedCategory === "Events" ? true : listing.category === state.selectedCategory;
    const query = state.search.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      listing.title.toLowerCase().includes(query) ||
      listing.venue.toLowerCase().includes(query) ||
      listing.category.toLowerCase().includes(query);

    return matchesLocation && matchesCategory && matchesSearch;
  });
}

function renderChips() {
  chipContainer.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `chip${state.selectedCategory === category ? " active" : ""}`;
    button.type = "button";
    button.textContent = category;
    button.addEventListener("click", () => {
      state.selectedCategory = category;
      render();
    });
    chipContainer.appendChild(button);
  });
}

function renderFeed() {
  const items = filteredListings();
  feed.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("article");
    empty.className = "listing-card";
    empty.innerHTML = `
      <div class="section-title compact">
        <div>
          <h4>No matching listings</h4>
          <p>Try another city, category, or search term.</p>
        </div>
      </div>
    `;
    feed.appendChild(empty);
    return;
  }

  items.forEach((listing) => {
    const article = document.createElement("article");
    article.className = "listing-card";
    article.innerHTML = `
      <div class="listing-visual" style="--card-color:${listing.color}">
        <div class="listing-topline">
          <span class="timer-badge">${formatCountdown(listing.expiresAt)}</span>
          <span class="discount-badge">${listing.discount}% off</span>
        </div>
      </div>
      <div>
        <h4>${listing.title}</h4>
        <div class="listing-meta">
          <span>${listing.venue}</span>
          <span>${listing.transferability}</span>
        </div>
      </div>
      <div class="listing-bottom">
        <div class="price-figure">
          <s>${formatPrice(listing.originalPrice)}</s>
          <strong>${formatPrice(listing.askingPrice)}</strong>
        </div>
        <button class="primary-button" type="button">View</button>
      </div>
    `;

    article.addEventListener("click", () => {
      state.selectedListingId = listing.id;
      setScreen("details");
    });

    feed.appendChild(article);
  });
}

function renderDetail() {
  const listing = getSelectedListing();
  document.querySelector("#detailCategory").textContent = listing.category;
  document.querySelector("#detailTitle").textContent = listing.title;
  document.querySelector("#detailTimer").textContent = `${formatCountdown(listing.expiresAt)} left`;
  document.querySelector("#detailDate").textContent = listing.venue.split(",")[1]?.trim() ?? listing.venue;
  document.querySelector("#detailVenue").textContent = listing.venue.split(",")[0];
  document.querySelector("#detailSeat").textContent = listing.seat;
  document.querySelector("#detailTransfer").textContent = listing.transferability;
  document.querySelector("#detailOriginal").textContent = formatPrice(listing.originalPrice);
  document.querySelector("#detailAsking").textContent = formatPrice(listing.askingPrice);
  document.querySelector("#detailSeller").textContent = listing.seller;
  document.querySelector(
    "#detailTrust"
  ).textContent = `${listing.trustScore.toFixed(1)} score from ${listing.transfers} completed transfers.`;
  document.querySelector("#detailScore").textContent = listing.trustScore.toFixed(1);
  document.querySelector("#detailNote").textContent = listing.note;
  document.querySelector("#detailVisual").style.setProperty("--card-color", listing.color);
}

function renderCheckout() {
  const listing = getSelectedListing();
  const fee = Math.round(listing.askingPrice * 0.04 + 35);
  document.querySelector("#checkoutTitle").textContent = listing.title;
  document.querySelector("#checkoutMeta").textContent = `${listing.venue} • ${listing.transferability}`;
  document.querySelector("#checkoutPrice").textContent = formatPrice(listing.askingPrice);
  document.querySelector("#checkoutFee").textContent = formatPrice(fee);
  document.querySelector("#checkoutTotal").textContent = formatPrice(listing.askingPrice + fee);
  payButton.textContent = "Pay Securely";
  payButton.disabled = false;
}

function renderHeader() {
  const title = document.querySelector("#headerTitle");
  const label = document.querySelector("#headerLabel");
  const action = document.querySelector("#headerAction");

  const config = {
    home: { title: "LastMinute", label: state.selectedLocation, action: "Search" },
    details: { title: "Listing details", label: "Verified transfer", action: "Share" },
    sell: { title: "Sell ticket", label: "Fast listing", action: "Help" },
    checkout: { title: "Secure checkout", label: "Escrow active", action: "Encrypted" },
    trust: { title: "Trust center", label: "Profile safety", action: "Support" },
  }[state.currentScreen];

  title.textContent = config.title;
  label.textContent = config.label;
  action.textContent = config.action;
}

function setScreen(screen) {
  state.currentScreen = screen;
  screens.forEach((section) => {
    section.classList.toggle("screen-active", section.dataset.screen === screen);
  });
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === screen);
  });
  renderHeader();
  if (screen === "details") {
    renderDetail();
  }
  if (screen === "checkout") {
    renderCheckout();
  }
}

function renderLocationState() {
  locationButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.location === state.selectedLocation);
  });
}

function render() {
  renderHeader();
  renderLocationState();
  renderChips();
  renderFeed();
  renderDetail();
  renderCheckout();
}

locationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedLocation = button.dataset.location;
    const firstVisible = filteredListings()[0];
    if (firstVisible) {
      state.selectedListingId = firstVisible.id;
    }
    render();
  });
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setScreen(button.dataset.target);
  });
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderFeed();
});

sellShortcut.addEventListener("click", () => {
  setScreen("sell");
});

buyNowButton.addEventListener("click", () => {
  setScreen("checkout");
});

payButton.addEventListener("click", () => {
  payButton.textContent = "Transfer requested";
  payButton.disabled = true;
});

sellForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(sellForm);
  const askingPrice = Number(data.get("askingPrice"));
  const originalPrice = Number(data.get("originalPrice"));
  const expiresIn = Number(data.get("expiresIn"));
  const category = data.get("category");

  const listing = {
    id: `custom-${Date.now()}`,
    title: data.get("title"),
    category,
    location: state.selectedLocation,
    venue: data.get("venue"),
    seat: category === "Buses" ? "Passenger transfer" : "Seller provided after verification",
    originalPrice,
    askingPrice,
    expiresAt: Date.now() + expiresIn * 60 * 1000,
    discount: Math.max(5, Math.round(((originalPrice - askingPrice) / originalPrice) * 100)),
    transferability: data.get("transferable"),
    seller: "You",
    trustScore: 4.8,
    transfers: 3,
    note: data.get("note"),
    color: "#004ac6",
  };

  listings.unshift(listing);
  state.selectedListingId = listing.id;
  state.selectedCategory = category === "Events" ? "Events" : category;
  sellForm.reset();
  render();
  setScreen("details");
});

setInterval(() => {
  if (state.currentScreen === "home") {
    renderFeed();
  } else if (state.currentScreen === "details") {
    renderDetail();
  }
}, 1000);

render();
setScreen("home");
