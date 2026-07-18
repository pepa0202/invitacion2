document.addEventListener("DOMContentLoaded", () => {
  const key = document.getElementById("key");
  const lockZone = document.getElementById("lock-zone");
  const lockShackle = document.getElementById("lock-shackle");
  const card = document.getElementById("card");
  const body = document.body;
  const muteBtn = document.getElementById("mute-btn");
  
  // Modal elementos
  const welcomeModal = document.getElementById("welcome-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");

  // Modal lógica
 closeModalBtn.addEventListener("click", () => {
  welcomeModal.classList.add("hidden");
  
  // Iniciar música y sonido de clic
  document.getElementById("bg-music").play();
  document.getElementById("bg-music").volume = 1.0; // Música al 100%
  document.getElementById("sfx-click").play();
  document.getElementById("sfx-click").volume = 0.1; // Música al 100%
});
  

  // Funciones de Animación
  const startAnimation = () => lockZone.classList.add("calling-key");
  const stopAnimation = () => lockZone.classList.remove("calling-key");

  // --- LOGICA PARA MÓVILES ---
  let isDragging = false;
  let startX, startY;
  let initialX = 0, initialY = 0;

  key.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX - initialX;
    startY = e.touches[0].clientY - initialY;
    key.style.transition = "none";
    key.style.cursor = "grabbing";
    startAnimation(); // Activa animación
  }, { passive: false });

  key.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    let currentX = e.touches[0].clientX - startX;
    let currentY = e.touches[0].clientY - startY;
    initialX = currentX; initialY = currentY;
    key.style.transform = `translate(${currentX}px, ${currentY}px)`;
    
    const keyRect = key.getBoundingClientRect();
    const lockRect = lockZone.getBoundingClientRect();
    if (keyRect.left < lockRect.right && keyRect.right > lockRect.left && keyRect.top < lockRect.bottom && keyRect.bottom > lockRect.top) {
      lockZone.classList.add("hovered");
    } else {
      lockZone.classList.remove("hovered");
    }
  }, { passive: false });

  key.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    stopAnimation(); // Detiene animación
    key.style.cursor = "grab";
    
    const keyRect = key.getBoundingClientRect();
    const lockRect = lockZone.getBoundingClientRect();
    if (keyRect.left < lockRect.right && keyRect.right > lockRect.left && keyRect.top < lockRect.bottom && keyRect.bottom > lockRect.top) {
      lockZone.classList.remove("hovered");
      openSequence();
    } else {
      key.style.transition = "transform 0.4s ease";
      key.style.transform = "translate(0px, 0px)";
      initialX = 0; initialY = 0;
      lockZone.classList.remove("hovered");
    }
  });

  // --- LOGICA PARA COMPUTADORAS ---
  key.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    key.style.opacity = "0.4";
    startAnimation(); // Activa animación
  });

  key.addEventListener("dragend", () => {
    key.style.opacity = "1";
    stopAnimation(); // Detiene animación
  });

  lockZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    lockZone.classList.add("hovered");
  });

  lockZone.addEventListener("dragleave", () => {
    lockZone.classList.remove("hovered");
  });

  lockZone.addEventListener("drop", (e) => {
    e.preventDefault();
    lockZone.classList.remove("hovered");
    if (e.dataTransfer.getData("text/plain") === "key") {
      openSequence();
    }
  });

  function openSequence() {
    document.getElementById("sfx-open").play();
    lockShackle.style.transform = "translateY(-6px)";
    setTimeout(() => {
      card.classList.add("open");
      body.classList.add("invitation-open");
      muteBtn.classList.remove("hidden");
    }, 300);
  }
  // Lógica del botón de mute
muteBtn.addEventListener("click", () => {
  const allAudios = document.querySelectorAll('audio');
  
  // Determinamos el nuevo estado (si el primero está muteado, desmuteamos todo)
  const isCurrentlyMuted = allAudios[0].muted; 
  
  // Aplicamos el cambio a todos los sonidos
  allAudios.forEach(audio => {
    audio.muted = !isCurrentlyMuted;
  });
  
  // Cambiamos el icono del botón según el estado
  muteBtn.textContent = !isCurrentlyMuted ? "🔇" : "🔊";
});
});