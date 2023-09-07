import { getReverseGeocoding } from "./reverseGeocoding.js";
//import { generateInfoboxContent, handleTabs, closeCustomBox } from "./infoBoxGenerator.js";

/**
 * Ajoute une infobulle lors du survol de la souris sur une entité dans le viewer Cesium.
 * @param {Object} viewer - L'objet viewer Cesium.
 */
export function ToolTipMouseHover(viewer) {
  // Crée un élément div pour l'infobulle et l'ajoute au corps du document
  let tooltip = document.createElement("div");
  tooltip.className = "cesium-tooltip";
  document.body.appendChild(tooltip);

  // Ajoute un écouteur d'événements pour le mouvement de la souris sur le canvas du viewer
  viewer.canvas.addEventListener("mousemove", function (e) {
    // Tente de sélectionner une entité sous le curseur de la souris
    var pickedObject = viewer.scene.pick(new Cesium.Cartesian2(e.clientX, e.clientY));

    // Vérifie si une entité a été sélectionnée et si elle possède un identifiant
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
      var entity = pickedObject.id;

      // Si l'entité possède un label, affiche l'infobulle à côté du curseur et met à jour son contenu
      if (entity.label) {
        tooltip.style.display = "block";
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY + 10 + "px";
        tooltip.textContent = entity.name;
      } else {
        // Sinon, cache l'infobulle
        tooltip.style.display = "none";
      }
    } else {
      // Si aucune entité n'est sélectionnée, cache l'infobulle
      tooltip.style.display = "none";
    }
  });
}

/**
 * Ajoute un gestionnaire d'événements pour le clic gauche sur le viewer.
 * @param {Object} viewer - L'objet viewer Cesium.
 * @param {HTMLElement} customInfoboxElement - L'élément DOM de l'infobox personnalisée.
 * @param {HTMLElement} infoboxContentElement - L'élément DOM du contenu de l'infobox.
 */
export function addLeftClickHandler(viewer, customInfoboxElement, infoboxContentElement) {
  let firstClickOnMap = false;
  let previousSelectedEntity = null;

  // Initialise les écouteurs d'événements
  addSelectedEntityChangedListener(viewer, previousSelectedEntity);
  addLeftClickListener(viewer, firstClickOnMap, previousSelectedEntity, customInfoboxElement, infoboxContentElement);
}

/**
 * Ajoute un écouteur d'événements pour détecter les changements d'entité sélectionnée.
 * @param {Object} viewer - L'objet viewer Cesium.
 * @param {Object} previousSelectedEntity - L'entité précédemment sélectionnée.
 */
function addSelectedEntityChangedListener(viewer, previousSelectedEntity) {
  viewer.selectedEntityChanged.addEventListener(function (newEntity) {
    if (previousSelectedEntity && previousSelectedEntity.id === "Adresse du point") {
      viewer.entities.remove(previousSelectedEntity);
    }
    previousSelectedEntity = newEntity;
  });
}

/**
 * Ajoute un écouteur d'événements pour le clic gauche.
 * @param {Object} viewer - L'objet viewer Cesium.
 * @param {Boolean} firstClickOnMap - Indique si c'est le premier clic sur la carte.
 * @param {Object} previousSelectedEntity - L'entité précédemment sélectionnée.
 * @param {HTMLElement} customInfoboxElement - L'élément DOM de l'infobox personnalisée.
 * @param {HTMLElement} infoboxContentElement - L'élément DOM du contenu de l'infobox.
 */
function addLeftClickListener(viewer, firstClickOnMap, previousSelectedEntity, customInfoboxElement, infoboxContentElement) {
  viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    handleLeftClick(movement, viewer, firstClickOnMap, previousSelectedEntity, customInfoboxElement, infoboxContentElement)
      .then((result) => {
        firstClickOnMap = result;
      })
      .catch((error) => {
        console.error("Erreur lors du traitement du clic gauche:", error);
      });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * Gère le clic gauche et effectue des actions en fonction de l'entité cliquée.
 * @param {Object} movement - Informations sur le mouvement de la souris.
 * @param {Object} viewer - L'objet viewer Cesium.
 * @param {Boolean} firstClickOnMap - Indique si c'est le premier clic sur la carte.
 * @param {Object} previousSelectedEntity - L'entité précédemment sélectionnée.
 * @param {HTMLElement} customInfoboxElement - L'élément DOM de l'infobox personnalisée.
 * @param {HTMLElement} infoboxContentElement - L'élément DOM du contenu de l'infobox.
 * @returns {Promise<Boolean>} - Retourne un booléen indiquant si c'était le premier clic sur la carte.
 */
async function handleLeftClick(movement, viewer, firstClickOnMap, previousSelectedEntity, customInfoboxElement, infoboxContentElement) {
  const pickedObject = viewer.scene.pick(movement.position);
  if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
    return handleEntityClick(pickedObject.id, viewer, previousSelectedEntity, customInfoboxElement, infoboxContentElement);
  } else {
    // Supprimez l'entité de recherche si elle existe
    const searchEntity = viewer.entities.getById("SearchAddressEntity");
    if (searchEntity) {
      viewer.entities.remove(searchEntity);
    }
    return handleMapClick(movement, viewer, firstClickOnMap, customInfoboxElement);
  }
}

function handleEntityClick(entity, viewer, previousSelectedEntity, customInfoboxElement, infoboxContentElement) {
  if (previousSelectedEntity === entity) {
    viewer.selectedEntity = undefined;
    customInfoboxElement.style.display = "none";
    previousSelectedEntity = null;
    return false;
  }

  const infoboxContentHtml = generateInfoboxContent(entity);
  infoboxContentElement.innerHTML = infoboxContentHtml;
  customInfoboxElement.style.display = "block";
  handleTabs();
  closeCustomBox(customInfoboxElement);
  previousSelectedEntity = entity;
  return false;
}

async function handleMapClick(movement, viewer, firstClickOnMap, customInfoboxElement) {
  const tempEntityExists = viewer.entities.getById("Adresse du point");
  if (tempEntityExists) {
    viewer.entities.remove(tempEntityExists);
  }

  if (firstClickOnMap) {
    const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
    if (cartesian) {
      const addressInfo = await getAddressInfoFromCartesian(cartesian);
      createTempEntity(viewer, cartesian, addressInfo);
    }
    return false;
  } else {
    viewer.selectedEntity = undefined;
    customInfoboxElement.style.display = "none";
    return true;
  }
}

async function getAddressInfoFromCartesian(cartesian) {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  const longitude = Cesium.Math.toDegrees(cartographic.longitude);
  const latitude = Cesium.Math.toDegrees(cartographic.latitude);
  return await getReverseGeocoding(latitude, longitude);
}

function createTempEntity(viewer, cartesian, addressInfo) {
  const tempEntity = new Cesium.Entity({
    id: "Adresse du point",
    position: cartesian,
    description: addressInfo,
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });

  viewer.entities.add(tempEntity);
  viewer.selectedEntity = tempEntity;
}

function generateInfoboxContent(entity) {
  return `
      <h3>${entity.name}</h3>
      <p>${entity.description}</p>
  `;
}

function handleTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const targetTab = e.target.getAttribute("data-tab");
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));
      e.target.classList.add("active");
      document.querySelector(`.tab-content.${targetTab}`).classList.add("active");
    });
  });
}

function closeCustomBox(customInfoboxElement) {
  customInfoboxElement.querySelector(".close-button").addEventListener("click", function () {
    customInfoboxElement.style.display = "none";
  });
}
