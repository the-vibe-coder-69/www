// Donation Website - JavaScript

let selectedAmount = 10000;

function formatCurrency(value) {
  return "₹" + value.toLocaleString("en-IN");
}

function parsePriceRange(price) {
  const cleaned = price.replace(/,/g, "");
  const parts = cleaned.split("-").map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { min: parts[0], max: parts[1] };
  }
  return null;
}

function findPhoneForDonation(amount) {
  let candidate = null;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  phonesData.forEach((phone) => {
    const range = parsePriceRange(phone.price);
    if (!range) return;

    if (amount >= range.min && amount <= range.max) {
      candidate = phone;
      closestDistance = 0;
      return;
    }

    const mid = (range.min + range.max) / 2;
    const distance = Math.abs(amount - mid);
    if (distance < closestDistance) {
      closestDistance = distance;
      candidate = phone;
    }
  });

  return candidate || phonesData[0];
}

function updateDonationInfo(amount) {
  selectedAmount = amount;

  const sliderAmountElem = document.getElementById("sliderAmount");
  const upiAmountElem = document.getElementById("upiAmount");

  if (sliderAmountElem) sliderAmountElem.textContent = formatCurrency(amount);
  if (upiAmountElem) upiAmountElem.textContent = formatCurrency(amount);

  const phone = findPhoneForDonation(amount);

  document.getElementById("phoneBrand").textContent = phone.brand;
  document.getElementById("phoneModel").textContent = phone.model;
  document.getElementById("phoneFeature").textContent = phone.feature;
  document.getElementById("phonePrice").textContent = phone.price;

  const slider = document.getElementById("donationSlider");
  if (slider) slider.value = amount;
}

document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  setupScrollAnimations();
  setupHamburgerMenu();

  const donationSlider = document.getElementById("donationSlider");
  if (donationSlider) {
    donationSlider.addEventListener("input", function () {
      updateDonationInfo(Number(this.value));
    });

    updateDonationInfo(Number(donationSlider.value));
  }
});

// Copy UPI ID to clipboard
function copyUPI(upiId, button) {
  navigator.clipboard
    .writeText(upiId)
    .then(() => {
      if (button) {
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = "Copy";
        }, 2000);
      }
    })
    .catch(() => {
      alert("Failed to copy. Please try manually.");
    });
}

// Proceed to UPI payment
function proceedToUPI() {
  if (!selectedAmount || selectedAmount <= 0) {
    alert("Please select or enter a donation amount");
    return;
  }

  const upiId = "6395906067@ptsbi";
  const payeeName = "Vibe Station";
  const transactionRef = "Donation-" + Date.now();

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${selectedAmount}&tn=${encodeURIComponent("Support Vibe Coder initiative")}&tr=${transactionRef}`;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    window.location.href = upiUrl;
  } else {
    showUPIInstructions();
  }
}

function showUPIInstructions() {
  const instructions = `
UPI Payment Instructions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Amount: ${formatCurrency(selectedAmount)}

1. Open your UPI app (Google Pay, PhonePe, BHIM, etc.)
2. Select "Send Money" or "Pay"
3. Enter UPI ID: 6395906067@ptsbi
4. Enter amount: ${formatCurrency(selectedAmount)}
5. Complete the payment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your support in powering digital inclusion!
`;

  alert(instructions);
}

// Setup navigation
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Setup scroll animations
function setupScrollAnimations() {
  const elements = document.querySelectorAll(
    ".benefit-card, .stat-card, .faq-item, .step-card, .impact-card, .info-panel, .phone-details-card, .payment-section",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  elements.forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "translateY(12px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });
}

// Smooth scroll to top button
window.addEventListener("scroll", function () {
  let scrollButton = document.querySelector(".scroll-to-top");
  if (!scrollButton) {
    const button = document.createElement("button");
    button.className = "scroll-to-top";
    button.innerHTML = "↑";
    button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.5rem;
            display: none;
            z-index: 999;
            transition: all 0.3s;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        `;
    document.body.appendChild(button);

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    scrollButton = button;
  }

  if (window.scrollY > 300) {
    scrollButton.style.display = "flex";
    scrollButton.style.alignItems = "center";
    scrollButton.style.justifyContent = "center";
  } else {
    scrollButton.style.display = "none";
  }
});
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (!hamburger || !navMenu) return;

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // 🔥 CLOSE MENU when clicking any link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}
