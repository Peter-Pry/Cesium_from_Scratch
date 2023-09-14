export function makeInfoboxDraggable(infoboxElement) {
  let isDragging = false;
  let offsetX, offsetY;

  const handleMouseDown = (e) => {
    isDragging = true;
    offsetX = e.clientX - infoboxElement.getBoundingClientRect().left;
    offsetY = e.clientY - infoboxElement.getBoundingClientRect().top;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      infoboxElement.style.left = x + "px";
      infoboxElement.style.top = y + "px";
    }
  };

  infoboxElement.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);

  // Fonction de nettoyage pour supprimer les écouteurs d'événements
  return () => {
    infoboxElement.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
  };
}

// Utilisation :
//const infobox = document.querySelector(".custom-infobox");
//const cleanup = makeInfoboxDraggable(infobox);

// Lorsque vous n'avez plus besoin des écouteurs d'événements, appelez cleanup() pour les supprimer.
// cleanup();
