import { db } from "./firebase-config.js";

import {
  collection,
  onSnapshot,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* =========================
   MENU HAMBURGER
========================= */

const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");
const overlay = document.getElementById("overlay");

function openMenu() {
  menuPanel.classList.add("active");
  overlay.classList.add("active");
}

function closeMenu() {
  menuPanel.classList.remove("active");
  overlay.classList.remove("active");
}

menuBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  openMenu();
});

overlay.addEventListener("click", closeMenu);

document.addEventListener("click", function (event) {
  const clickInsideMenu = menuPanel.contains(event.target);
  const clickOnButton = menuBtn.contains(event.target);

  if (!clickInsideMenu && !clickOnButton) {
    closeMenu();
  }
});

menuPanel.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

/* =========================
   SETTING WEBSITE
========================= */

function setText(id, value) {
  const element = document.getElementById(id);

  if (element && value !== undefined && value !== null && value !== "") {
    element.textContent = value;
  }
}

function setHtml(id, value) {
  const element = document.getElementById(id);

  if (element && value !== undefined && value !== null && value !== "") {
    element.innerHTML = value;
  }
}

function setHref(id, value) {
  const element = document.getElementById(id);

  if (element && value !== undefined && value !== null && value !== "") {
    element.href = value;
  }
}

async function loadWebsiteSetting() {
  try {
    const settingRef = doc(db, "settings", "main");
    const settingSnap = await getDoc(settingRef);

    if (!settingSnap.exists()) {
      return;
    }

    const data = settingSnap.data();

    if (data.storeName) {
      document.title = data.storeName;
      setText("storeLogo", data.storeName);
    }

    setText("heroLabelDisplay", data.heroLabel);
    setText("heroTitleDisplay", data.heroTitle);
    setText("heroDescriptionDisplay", data.heroDescription);
    setText("heroButton1Display", data.heroButton1);
    setText("heroButton2Display", data.heroButton2);

    setText("aboutTitleDisplay", data.aboutTitle);
    setText("aboutDisplay", data.aboutText);

    setText("galleryLabelDisplay", data.galleryLabel);
    setText("galleryTitleDisplay", data.galleryTitle);

    setText("actionLabelDisplay", data.actionLabel);
    setText("actionTitleDisplay", data.actionTitle);

    setText("contactLabelDisplay", data.contactLabel);
    setText("contactTitleDisplay", data.contactTitle);
    setText("contactInfoTitle", data.contactInfoTitle);

    setText("waDisplay", data.whatsappNumber);
    setText("addressDisplay", data.storeAddress);
    setText("openHourDisplay", data.openHour);

    if (data.mapsLink) {
      const mapsFrame = document.getElementById("mapsFrame");
      if (mapsFrame) {
        mapsFrame.src = data.mapsLink;
      }
    }

    setText("footerDisplay", data.footerCopyright);

    if (data.footerNote) {
      const footerDisplay = document.getElementById("footerDisplay");
      if (footerDisplay) {
        footerDisplay.innerHTML = `${data.footerCopyright || ""}<br>${data.footerNote}`;
      }
    }

  } catch (error) {
    console.log("Gagal mengambil setting website:", error.message);
  }
}

loadWebsiteSetting();

/* =========================
   TOMBOL AKSI DINAMIS
========================= */

const buttonContainer = document.getElementById("buttonContainer");

if (buttonContainer) {
  onSnapshot(collection(db, "buttons"), function (snapshot) {
    buttonContainer.innerHTML = "";

    if (snapshot.empty) {
      buttonContainer.innerHTML = "<p>Tombol belum tersedia.</p>";
      return;
    }

    snapshot.forEach(function (item) {
      const data = item.data();

      buttonContainer.innerHTML += `
        <a
          href="${data.link}"
          target="_blank"
          class="social-card"
          style="background:${data.color || "#1f5d2a"}">

          <small>Kunjungi</small>
          <strong>${data.name}</strong>

        </a>
      `;
    });
  });
}

/* =========================
   GALERI DINAMIS
========================= */

const galleryContainer = document.getElementById("galleryContainer");

if (galleryContainer) {
  onSnapshot(collection(db, "gallery"), function (snapshot) {
    galleryContainer.innerHTML = "";

    if (snapshot.empty) {
      galleryContainer.innerHTML = "<p>Galeri belum tersedia.</p>";
      return;
    }

    snapshot.forEach(function (item) {
      const data = item.data();

      if (!data.imageUrl) return;

      galleryContainer.innerHTML += `
        <img
          src="${data.imageUrl}"
          alt="Galeri Sanseveria">
      `;
    });
  });
}