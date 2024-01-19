function addImagerySource(viewer, imageryLayersControls, parentId) {
  const addedLayers = {};

  imageryLayersControls.forEach((imageryLayer) => {
    const { provider, name, labelText, activeBydefault } = imageryLayer;
    const listItem = document.createElement("li");

    // Création de la case à cocher
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = activeBydefault;

    // Création du contrôle de transparence
    const opacityControl = document.createElement("input");
    opacityControl.type = "range";
    opacityControl.min = 0;
    opacityControl.max = 1;
    opacityControl.step = 0.01;
    opacityControl.value = activeBydefault ? 1 : 0;

    // Création de boutons pour monter ou descendre les couches
    const raiseButton = document.createElement("button");
    raiseButton.textContent = "⇑";
    const lowerButton = document.createElement("button");
    lowerButton.textContent = "⇓";

    const layer = new Cesium.ImageryLayer(provider, { show: activeBydefault });
    addedLayers[name] = layer;

    if (activeBydefault) {
      viewer.imageryLayers.add(layer);
    }

    checkbox.addEventListener("change", function () {
      if (this.checked) {
        viewer.imageryLayers.add(layer);
        layer.show = true;
      } else {
        layer.show = false;
      }
    });

    opacityControl.addEventListener("input", function () {
      layer.alpha = parseFloat(this.value);
    });

    raiseButton.addEventListener("click", function () {
      viewer.imageryLayers.raise(layer);
    });

    lowerButton.addEventListener("click", function () {
      viewer.imageryLayers.lower(layer);
    });

    // Pour les boutons
    raiseButton.className = "layer-control-button";
    lowerButton.className = "layer-control-button";

    // Pour le contrôle de transparence
    opacityControl.className = "layer-opacity-control";

    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(labelText));
    //listItem.appendChild(opacityControl);
    listItem.appendChild(raiseButton);
    listItem.appendChild(lowerButton);

    document.getElementById(parentId).appendChild(listItem);
  });

  return addedLayers;
}

export default addImagerySource;
