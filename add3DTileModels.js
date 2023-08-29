/**
 * Ajoute des modèles 3D Tile au viewer Cesium à partir d'une liste de contrôles.
 * @param {Object} viewer - L'objet viewer Cesium.
 * @param {Array} primitivesSources - Liste des contrôles pour les modèles 3D Tile.
 * @param {string} parentId - ID de l'élément parent où ajouter les éléments de contrôle.
 * @returns {Object} - Un objet contenant les modèles 3D Tile ajoutés.
 */
function Add3DTileModels(viewer, primitivesSources, parentId) {
  // Objet pour stocker les modèles 3D Tile ajoutés
  const addPrimitivesLayers = {};

  // Parcourir chaque contrôle pour ajouter le modèle 3D Tile correspondant
  primitivesSources.forEach((control) => {
    const { name, provider, labelText, url } = control;
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Gestionnaire d'événement pour ajouter ou supprimer un modèle 3D Tile lorsque la case est cochée ou décochée
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        if (!addPrimitivesLayers[name]) {
          // Charger le modèle 3D Tile depuis l'URL et l'ajouter à la scène
          Cesium.Cesium3DTileset.fromUrl(url)
            .then(function (tileset) {
              viewer.scene.primitives.add(tileset);
              addPrimitivesLayers[name] = tileset;
            })
            .catch(function (error) {
              // Afficher une erreur si le chargement du modèle 3D Tile échoue
              console.error(
                "Erreur lors du chargement du jeu de tuiles 3D :",
                error
              );
            });
        } else {
          viewer.scene.primitives.add(addPrimitivesLayers[name]);
        }
      } else {
        // Supprimer le modèle 3D Tile de la scène si la case est décochée
        viewer.scene.primitives.remove(addPrimitivesLayers[name]);
        delete addPrimitivesLayers[name];
      }
    });

    // Ajouter la case à cocher et le label au DOM
    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(labelText));
    document.getElementById(parentId).appendChild(listItem);
  });

  return addPrimitivesLayers;
}

// Exporter la fonction pour une utilisation externe
export default Add3DTileModels;