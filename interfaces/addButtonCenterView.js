export function generateAndAttachViewButtons(views, viewerInstance) {
  return Object.keys(views).map((viewName) => {
    const button = document.createElement("button");
    button.classList.add("button-11");
    button.role = "button";
    button.innerText = views[viewName].name;
    button.addEventListener("click", function () {
      const viewConfig = views[viewName];
      if (viewConfig) {
        viewerInstance.camera.flyTo({
          destination: new Cesium.Cartesian3(...viewConfig.destination),
          orientation: viewConfig.orientation,
          duration: 2, // Durée en secondes
        });
      }
    });
    return button;
  });
}
