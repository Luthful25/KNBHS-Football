document.addEventListener("DOMContentLoaded", () => {
  const players = document.querySelectorAll(".player-card");
  const savedData = JSON.parse(localStorage.getItem("auctionData")) || {};

  // =========================
  // PLAYER SAVE LOGIC
  // =========================
  players.forEach((card) => {
    const playerName = card.dataset.name;
    const priceInput = card.querySelector(".price-input");
    const teamSelect = card.querySelector(".team-select");
    const saveBtn = card.querySelector(".save-btn");
    const resultBox = card.querySelector(".result");

    // Load previously saved data
    if (savedData[playerName]) {
      priceInput.value = savedData[playerName].price;
      teamSelect.value = savedData[playerName].team;
      resultBox.textContent = `Saved: Tk ${savedData[playerName].price} – ${savedData[playerName].team}`;
      resultBox.style.color = "#7efaff";
    }

    // Save button event
    saveBtn.addEventListener("click", () => {
      const price = priceInput.value.trim();
      const team = teamSelect.value.trim();

      if (!price || !team) {
        resultBox.textContent = "❗ Price & Team Both Required";
        resultBox.style.color = "#ff4d4d";
        return;
      }

      savedData[playerName] = {
        price,
        team,
        image: card.querySelector("img").src,
      };
      localStorage.setItem("auctionData", JSON.stringify(savedData));

      resultBox.textContent = `✔ Saved Successfully: Tk ${price} – ${team}`;
      resultBox.style.color = "#7efaff";

      saveBtn.style.boxShadow = "0 0 20px #00eaff";
      setTimeout(() => (saveBtn.style.boxShadow = "none"), 800);
    });
  });

  // =========================
  // TEAM CLICK → SHOW PLAYERS
  // =========================
  document.querySelectorAll(".team-card").forEach((teamCard) => {
    teamCard.addEventListener("click", () => {
      const teamName = teamCard.textContent.trim();
      const modal = document.getElementById("teamModal");
      const title = document.getElementById("teamModalTitle");
      const listBox = document.getElementById("teamPlayersList");

      title.textContent = `Players Bought by ${teamName}`;
      listBox.innerHTML = "";

      const boughtPlayers = Object.entries(savedData).filter(
        ([_, info]) => info.team.trim() === teamName
      );

      if (boughtPlayers.length === 0) {
        listBox.innerHTML = "<p>No players bought yet.</p>";
      } else {
        boughtPlayers.forEach(([player, info]) => {
          const div = document.createElement("div");
          div.className = "team-player-item";

          div.innerHTML = `
            <div class="team-player-img-box">
              <img src="${info.image}" alt="${player}">
            </div>
            <div class="team-player-info">
              <strong>${player}</strong> – Tk ${info.price}
            </div>
          `;
          listBox.appendChild(div);
        });
      }

      modal.style.display = "flex";
    });
  });

  // Close modal
  document.querySelector(".close-modal").addEventListener("click", () => {
    document.getElementById("teamModal").style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target.id === "teamModal") {
      document.getElementById("teamModal").style.display = "none";
    }
  });

  // =========================
  // SLIDER FUNCTIONALITY
  // =========================
  const slider = document.getElementById("playersSlider");
  const btnLeft = document.querySelector(".slide-btn.left");
  const btnRight = document.querySelector(".slide-btn.right");
  const scrollAmount = 300;

  btnRight.addEventListener("click", () => (slider.scrollLeft += scrollAmount));
  btnLeft.addEventListener("click", () => (slider.scrollLeft -= scrollAmount));
});
