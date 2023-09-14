let isDragging = false;
let isResizing = false;
let resizeDirection = "";
let startX, startY, startWidth, startHeight;

const infobox = document.querySelector(".custom-infobox");

// Fonction pour ajouter des poignées de redimensionnement
export function addResizeHandles(element) {
  const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
  directions.forEach((dir) => {
    const handle = document.createElement("div");
    handle.classList.add("resize-handle", dir);
    element.appendChild(handle);
  });
}

//addResizeHandles(infobox);

// Gestion du déplacement
infobox.addEventListener("mousedown", (e) => {
  if (!e.target.classList.contains("resize-handle")) {
    isDragging = true;
    startX = e.clientX - infobox.getBoundingClientRect().left;
    startY = e.clientY - infobox.getBoundingClientRect().top;
  }
});

// Gestion du redimensionnement
document.querySelectorAll(".resize-handle").forEach((handle) => {
  handle.addEventListener("mousedown", (e) => {
    isResizing = true;
    resizeDirection = handle.classList[1]; // 'n', 'ne', 'e', etc.
    startX = e.clientX;
    startY = e.clientY;
    startWidth = infobox.offsetWidth;
    startHeight = infobox.offsetHeight;
    e.stopPropagation(); // Empêche le déclenchement de l'événement mousedown de l'infobox
  });
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  isResizing = false;
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const x = e.clientX - startX;
    const y = e.clientY - startY;
    infobox.style.left = x + "px";
    infobox.style.top = y + "px";
  } else if (isResizing) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (resizeDirection.includes("e")) infobox.style.width = startWidth + dx + "px";
    if (resizeDirection.includes("s")) infobox.style.height = startHeight + dy + "px";
    if (resizeDirection.includes("w")) {
      infobox.style.width = startWidth - dx + "px";
      infobox.style.left = infobox.offsetLeft + dx + "px";
    }
    if (resizeDirection.includes("n")) {
      infobox.style.height = startHeight - dy + "px";
      infobox.style.top = infobox.offsetTop + dy + "px";
    }
  }
});
