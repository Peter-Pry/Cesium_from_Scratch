function Add3DTileModels(viewer, primitivesControls, parentId) {
    const addPrimitivesLayers = {};
  
    primitivesControls.forEach((control) => {
      const { name, provider, labelText, url } = control;
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
  
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          if (!addPrimitivesLayers[name]) {
            Cesium.Cesium3DTileset.fromUrl(url)
              .then(function (tileset) {
                viewer.scene.primitives.add(tileset);
                addPrimitivesLayers[name] = tileset;
              })
              .catch(function (error) {
                console.error(
                  "Erreur lors du chargement du jeu de tuiles 3D :",
                  error
                );
              });
          } else {
            viewer.scene.primitives.add(addPrimitivesLayers[name]);
          }
        } else {
          viewer.scene.primitives.remove(addPrimitivesLayers[name]);
          delete addPrimitivesLayers[name];
        }
      });
  
      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(labelText));
      document.getElementById(parentId).appendChild(listItem);
    });
  
    return addPrimitivesLayers;
  }

  export default Add3DTileModels;