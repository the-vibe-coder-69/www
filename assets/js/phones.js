// Phone compatibility data from Excel
const phonesData = [
  {
    brand: "Samsung",
    model: "Galaxy S8",
    feature: "DeX (Wired)",
    price: "5,500 - 7,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S8+",
    feature: "DeX (Wired)",
    price: "6,500 - 8,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Note 8",
    feature: "DeX (Wired)",
    price: "7,000 - 8,500",
  },
  {
    brand: "Samsung",
    model: "Galaxy S9",
    feature: "DeX (Wired)",
    price: "7,500 - 9,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S9+",
    feature: "DeX (Wired)",
    price: "8,500 - 10,500",
  },
  {
    brand: "Samsung",
    model: "Galaxy Note 9",
    feature: "DeX (Wired)",
    price: "9,500 - 12,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S10e",
    feature: "DeX (Wired)",
    price: "9,000 - 11,500",
  },
  {
    brand: "Samsung",
    model: "Galaxy S10",
    feature: "DeX (Wired)",
    price: "10,500 - 13,500",
  },
  {
    brand: "Samsung",
    model: "Galaxy S10+",
    feature: "DeX (Wired)",
    price: "12,000 - 15,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Note 10 Lite",
    feature: "DeX (Wired)",
    price: "11,500 - 14,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S20 FE (4G/5G)",
    feature: "DeX (Wired/Wireless)",
    price: "11,000 - 14,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Note 10",
    feature: "DeX (Wired/Wireless)",
    price: "13,000 - 16,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Note 10+",
    feature: "DeX (Wired/Wireless)",
    price: "16,000 - 19,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S20",
    feature: "DeX (Wired/Wireless)",
    price: "13,500 - 16,500",
  },
  {
    brand: "Samsung",
    model: "Galaxy S20+",
    feature: "DeX (Wired/Wireless)",
    price: "15,000 - 18,500",
  },
  {
    brand: "Samsung",
    model: "Galaxy S21 FE 5G",
    feature: "DeX (Wired/Wireless)",
    price: "16,500 - 19,500",
  },
  {
    brand: "Samsung",
    model: "Galaxy S21",
    feature: "DeX (Wired/Wireless)",
    price: "17,500 - 21,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S21+",
    feature: "DeX (Wired/Wireless)",
    price: "19,500 - 24,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Note 20",
    feature: "DeX (Wired/Wireless)",
    price: "18,000 - 22,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S20 Ultra",
    feature: "DeX (Wired/Wireless)",
    price: "20,000 - 25,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Note 20 Ultra",
    feature: "DeX (Wired/Wireless)",
    price: "24,000 - 29,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S21 Ultra",
    feature: "DeX (Wired/Wireless)",
    price: "26,000 - 32,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S22",
    feature: "DeX (Wired/Wireless)",
    price: "24,000 - 28,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S22+",
    feature: "DeX (Wired/Wireless)",
    price: "29,000 - 35,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S23 FE",
    feature: "DeX (Wired/Wireless)",
    price: "28,000 - 33,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Z Fold 2",
    feature: "DeX (Wired/Wireless)",
    price: "25,000 - 30,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S22 Ultra",
    feature: "DeX (Wired/Wireless)",
    price: "38,000 - 45,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S23",
    feature: "DeX (Wired/Wireless)",
    price: "38,000 - 44,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S23+",
    feature: "DeX (Wired/Wireless)",
    price: "45,000 - 52,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    feature: "DeX (Wired/Wireless)",
    price: "58,000 - 68,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S24",
    feature: "DeX (Wired/Wireless)",
    price: "52,000 - 58,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    feature: "DeX (Wired/Wireless)",
    price: "85,000 - 95,000",
  },
  {
    brand: "Samsung",
    model: "Galaxy Tab S6",
    feature: "DeX (On-device/Ext)",
    price: "14,000 - 18,000",
  },
  {
    brand: "Motorola",
    model: "Edge 20 Pro",
    feature: "Ready For (Wired/Wireless)",
    price: "12,000 - 15,000",
  },
  {
    brand: "Motorola",
    model: "Edge 30 Pro",
    feature: "Ready For (Wired/Wireless)",
    price: "18,000 - 22,000",
  },
  {
    brand: "Motorola",
    model: "Edge 30 Fusion",
    feature: "Ready For (Wired/Wireless)",
    price: "17,000 - 21,000",
  },
  {
    brand: "Motorola",
    model: "Edge 40",
    feature: "Ready For (Wireless Only)",
    price: "16,000 - 19,000",
  },
  {
    brand: "Motorola",
    model: "G200 5G",
    feature: "Ready For (Wired)",
    price: "14,000 - 17,000",
  },
  {
    brand: "LG",
    model: "V50 ThinQ",
    feature: "Screen+ (Wired)",
    price: "7,500 - 9,500",
  },
  {
    brand: "LG",
    model: "G8X ThinQ",
    feature: "Screen+ (Wired)",
    price: "8,500 - 11,000",
  },
  {
    brand: "LG",
    model: "V60 ThinQ",
    feature: "Screen+ (Wired)",
    price: "12,000 - 15,000",
  },
  {
    brand: "LG",
    model: "Velvet 5G",
    feature: "Screen+ (Wired)",
    price: "10,000 - 13,000",
  },
  {
    brand: "LG",
    model: "Wing",
    feature: "Desktop Mode (Wired)",
    price: "15,000 - 19,000",
  },
  {
    brand: "Huawei",
    model: "Mate 20 Pro",
    feature: "Desktop Mode (Wired)",
    price: "10,000 - 13,000",
  },
  {
    brand: "Huawei",
    model: "P30 Pro",
    feature: "Desktop Mode (Wired)",
    price: "13,000 - 17,000",
  },
  {
    brand: "Huawei",
    model: "P40 Pro",
    feature: "Desktop Mode (Wired)",
    price: "18,000 - 23,000",
  },
  {
    brand: "Honor",
    model: "View 20",
    feature: "Desktop Mode (Wired)",
    price: "8,000 - 10,500",
  },
  {
    brand: "Google",
    model: "Pixel 8",
    feature: "Desktop/Display Out",
    price: "32,000 - 38,000",
  },
  {
    brand: "Google",
    model: "Pixel 8 Pro",
    feature: "Desktop/Display Out",
    price: "45,000 - 52,000",
  },
];

// Initialize table on page load
document.addEventListener("DOMContentLoaded", function () {
  populateTable(phonesData);
  setupEventListeners();
});

// Populate table with data
function populateTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  data.forEach((phone) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${phone.brand}</td>
            <td>${phone.model}</td>
            <td>${phone.feature}</td>
            <td>${phone.price}</td>
        `;
    tableBody.appendChild(row);
  });
}

// Setup event listeners for filters
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const brandFilter = document.getElementById("brandFilter");
  const featureFilter = document.getElementById("featureFilter");

  searchInput.addEventListener("input", filterTable);
  brandFilter.addEventListener("change", filterTable);
  featureFilter.addEventListener("change", filterTable);
}

// Filter table based on search and select inputs
function filterTable() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const brandFilter = document.getElementById("brandFilter").value;
  const featureFilter = document.getElementById("featureFilter").value;

  const filteredData = phonesData.filter((phone) => {
    const matchSearch =
      phone.brand.toLowerCase().includes(searchInput) ||
      phone.model.toLowerCase().includes(searchInput);
    const matchBrand = !brandFilter || phone.brand === brandFilter;
    const matchFeature =
      !featureFilter || phone.feature.includes(featureFilter);

    return matchSearch && matchBrand && matchFeature;
  });

  populateTable(filteredData);
}
