function addImagerySource(
    viewer,
    imageryLayersControls,
    parentId
  ) {
    const addedLayers = {}; // Objet pour stocker les références aux couches ajoutées
  
    imageryLayersControls.forEach((control) => {
      const { provider, name, labelText, activeBydefault } = control;
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const layer = new Cesium.ImageryLayer(provider);
      if (activeBydefault) {
        checkbox.checked = true; // Par défaut, la couche est affichée
        viewer.imageryLayers.add(layer);
      }
      addedLayers[name] = layer; // Stockez la référence à la couche ajoutée
  
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          if (!addedLayers[name]) {
            const newLayer = new Cesium.ImageryLayer(provider);
            viewer.imageryLayers.add(newLayer);
            addedLayers[name] = newLayer;
          } else {
            viewer.imageryLayers.add(addedLayers[name]);
          }
        } else {
          viewer.imageryLayers.remove(addedLayers[name]);
          delete addedLayers[name]; // Supprimez la référence pour libérer de la mémoire
        }
      });
  
      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(labelText));
      document.getElementById(parentId).appendChild(listItem);
    });
  
    return addedLayers;
  }

  export default addImagerySource;