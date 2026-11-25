//every singular js 
  document.querySelectorAll("v-player").forEach((player) => {
    const gifUrl = player.getAttribute("href") || "";
    const pauseUrl = "https://beecau.github.io/untitled.png";

    player.innerHTML = `
      <div class="player-screen">
        <img src="${gifUrl}" alt="VIDEO">
      </div>
      <svg class="player-frame" viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#141414"/>
            <stop offset="100%" stop-color="#3a3a3a"/>
          </linearGradient>
          <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#0b0b0b"/>
            <stop offset="50%" stop-color="#2b2b2b"/>
            <stop offset="100%" stop-color="#0b0b0b"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="480" height="38" fill="url(#barGrad)"/>
        <rect x="0" y="305" width="480" height="55" fill="url(#barGrad)"/>
        <rect x="0" y="38" width="74" height="267" fill="url(#sideGrad)"/>
        <rect x="397" y="38" width="83" height="267" fill="url(#sideGrad)"/>
        <text x="10" y="28" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="28">VIDEO</text>
      </svg>
    `;

    const screen = player.querySelector(".player-screen");
    const img = screen.querySelector("img");
    let paused = false;

    screen.addEventListener("click", () => {
      paused = !paused;
      img.src = paused ? pauseUrl : gifUrl;
    });
  });
