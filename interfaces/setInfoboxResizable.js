export function setInfoboxResizable(infoboxElement) {
  let isResizing = false;
  let startWidth, startHeight, startX, startY;

  // Créez un élément de poignée pour le redimensionnement
  const resizeHandle = document.createElement("div");
  resizeHandle.style.width = "10px";
  resizeHandle.style.height = "10px";
  resizeHandle.style.background = "black";
  resizeHandle.style.position = "absolute";
  resizeHandle.style.right = "0";
  resizeHandle.style.bottom = "0";
  resizeHandle.style.cursor = "se-resize"; // Curseur de redimensionnement sud-est
  infoboxElement.appendChild(resizeHandle);

  const handleMouseDown = (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = infoboxElement.offsetWidth;
    startHeight = infoboxElement.offsetHeight;
  };

  const handleMouseUp = () => {
    isResizing = false;
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      infoboxElement.style.width = startWidth + dx + "px";
      infoboxElement.style.height = startHeight + dy + "px";
    }
  };

  resizeHandle.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);

  // Fonction de nettoyage pour supprimer les écouteurs d'événements
  return () => {
    resizeHandle.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
  };
}

// // Utilisation :
// const infobox = document.querySelector(".custom-infobox");
// const cleanupResize = makeInfoboxResizable(infobox);

// Lorsque vous n'avez plus besoin des écouteurs d'événements, appelez cleanupResize() pour les supprimer.
// cleanupResize();
