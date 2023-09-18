/**
 * Ajoute des sources d'imagerie au viewer Cesium et crée des contrôles pour activer/désactiver ces sources.
 *
 * @param {Object} viewer - L'objet viewer Cesium.
 * @param {Array} imageryLayersControls - Un tableau d'objets décrivant les sources d'imagerie et leurs contrôles.
 * @param {string} parentId - L'ID de l'élément DOM parent où les contrôles seront ajoutés.
 * @returns {Object} - Un objet contenant les références aux couches d'imagerie ajoutées.
 */
function addImagerySource(viewer, imageryLayersControls, parentId) {
  const addedLayers = {}; // Objet pour stocker les références aux couches ajoutées

  // Parcourir chaque contrôle de source d'imagerie
  imageryLayersControls.forEach((control) => {
    const { provider, name, labelText, activeBydefault } = control;

    // Créer un élément de liste pour le contrôle
    const listItem = document.createElement("li");

    // Créer une case à cocher pour activer/désactiver la source d'imagerie
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Créer une nouvelle couche d'imagerie
    const layer = new Cesium.ImageryLayer(provider);

    // Si la couche doit être active par défaut, ajoutez-la au viewer
    if (activeBydefault) {
      checkbox.checked = true;
      viewer.imageryLayers.add(layer);
    }

    // Stocker la référence à la couche ajoutée
    addedLayers[name] = layer;

    // Ajouter un écouteur d'événements pour gérer le changement d'état de la case à cocher
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
        delete addedLayers[name]; // Supprimer la référence pour libérer de la mémoire
      }
    });

    // Ajouter la case à cocher et le texte à l'élément de liste
    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(labelText));

    // Ajouter l'élément de liste à l'élément parent
    document.getElementById(parentId).appendChild(listItem);
  });

  return addedLayers;
}

export default addImagerySource;
