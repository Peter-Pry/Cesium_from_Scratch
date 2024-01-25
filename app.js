// Importation de la configuration
import { config } from "./config.js";

//Importation des fonctions pour ajouter des couches
import addImagerySource from "./layers/ImagerySource.js";
import { add3DModelsTiles } from "./layers/3DModelsTiles.js";
import {
  initializeLayers,
  getLayersFromWorkspace,
} from "./layers/LayerDataSource.js";

//Importation pour ajouter des fonctionnalités
import addSearchModule from "./features/addressSearchModule.js";

//Importation des fonctions pour ajouter des contrôles à l'application
import { setSidebarOpenable } from "./interfaces/setSidebarOpenable.js";
import {
  ToolTipMouseHover,
  addLeftClickHandler,
} from "./controls/mouseControls.js";

//Importation des fonctions pour ajouter des élèments d'interfaces
import { updateEntitiesVerticalPosition } from "./interfaces/setImageEntityVerticalPosition.js";
import { generateAndAttachViewButtons } from "./interfaces/addButtonCenterView.js";
//import { addResizeHandles } from "./interfaces/setInfoBoxResize.js";
//import { setInfoboxDraggable } from "./interfaces/setInfoboxDraggable.js";
//import { setInfoboxResizable } from "./interfaces/setInfoboxResizable.js";

//Menu
// const menuBtns = document.getElementsByClassName("main-menu-button");
// for (const menubtn of menuBtns){
//   menubtn.addEventListener("click", (item)=>{
//     console.log(item.target.parentNode.getAttribute('data-target'));
// })
// }
//# Choix du terrain
// 1 - Terrain fournit par Seb (Attention décalage de niveau)
const terrainProvider = new Cesium.Terrain(
  Cesium.CesiumTerrainProvider.fromUrl(config.terrainProviderUrl, {
    depthTestAgainstTerrain: true,
  })
);

// 2 - Terrain fournit par IGO
// const terrainProvider = Cesium.Terrain.fromWorldTerrain({requestWaterMask: true,requestVertexNormals: true,});

// Création du viewer Cesium avec les configurations spécifiées
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: terrainProvider,
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.TileMapServiceImageryProvider.fromUrl(
      Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
    )
  ), //Avoir un fond de carte base résolution par défaut
  baseLayerPicker: false,
  geocoder: false,
  animation: false,
  timeline: false,
  useBrowserRecommendedResolution: true,
});



//Gestion Modal
// Fonction pour ouvrir une modale spécifique
function openModal(modalContentId) {
  // Masquer toutes les modales
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });

  // Afficher la modale sélectionnée
  const selectedModal = document.getElementById(modalContentId);
  if (selectedModal) {
    selectedModal.style.display = "block";

    // Trouvez le premier bouton d'onglet dans la modale et déclenchez un clic
    const firstTabButton = selectedModal.querySelector(".tab-button");
    if (firstTabButton) {
      firstTabButton.click();
    }
  }
}

// Attachez un écouteur d'événements à chaque bouton du menu principal
const btns = document.getElementsByClassName("main-menu-button");
for (let btn of btns) {
  btn.addEventListener("click", function () {
    const modalContentId = this.getAttribute("data-modal-id");
    openModal(modalContentId);
  });
}

// Gestion de la fermeture des modales
const closeSpans = document.querySelectorAll(".modal>.close");
closeSpans.forEach((closeSpan) => {
  closeSpan.onclick = () => {
    closeSpan.parentNode.style.display = "none";
  };
});


//Gestion des tabs
// Ajouter le gestionnaire d'événement 'DOMContentLoaded' pour s'assurer que le DOM est chargé
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

// Attacher les gestionnaires d'événements aux boutons d'onglets
tabButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Activer l'onglet sélectionné et désactiver les autres
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    this.classList.add("active");
    const activeTabContent = document.getElementById(this.dataset.tab);
    activeTabContent.classList.add("active");
  });
});

// Gestionnaire pour le bouton de fermeture
// const closeTab = document.querySelector(".tab-close");
// closeTab.addEventListener("click", () => {
//   const tabsContainer = closeTab.closest(".tabs");
//   tabsContainer.style.display = "none";
//   tabContents.forEach((content) => (content.style.display = "none"));
// });

// // Activer le premier onglet par défaut
// if (tabButtons.length > 0) {
//   tabButtons[0].click();
// }

// // Close button functionality (optional)
// document.querySelector(".tab-close").addEventListener("click", function () {
//   this.parentElement.style.display = "none"; // Hides the tab bar
//   // You would also want to hide the content here.
// });




//Suppression des Crédit Cesium ION (si nécessaire)
viewer._cesiumWidget._creditContainer.parentNode.removeChild(
  viewer._cesiumWidget._creditContainer
);

// Positionnement initial de la caméra selon les coordonnées spécifiées dans le fichier de configuration
viewer.camera.setView(config.cameraCoordinates);

// Ajout d'une infobulle qui s'affiche lors du survol d'une entité avec la souris
ToolTipMouseHover(viewer);

// Ajout d'une infobox personnalisée qui s'affiche lors du clic sur une entité
// Récupération des éléments du DOM nécessaires
const customInfoboxElement = document.getElementById("customInfobox");
const infoboxContentElement = document.getElementById("infoboxContent");
// Initialisation de l'infobox personnalisée avec les éléments récupérés
addLeftClickHandler(viewer, customInfoboxElement, infoboxContentElement);

// Initialisation et ajout des couches de données GeoJson au viewer
initializeLayers(
  viewer,
  config.layers,
  config.urls.urlGeoserver,
  config.urls.urlImagesServer,
  "layer-list"
).then(({failedLayers}) => {
  if (failedLayers.length === 0) {
    console.log("Toutes les couches GeoJson ont été initialisées !");
  } else {
    console.log(
      `Les couches suivantes n'ont pas pu être chargées: \n  ${failedLayers.join(
        ",\n  "
      )}`
    );
  }
  updateEntitiesVerticalPosition(viewer, 100);
});

// Ajout des imageries au viewer
addImagerySource(viewer, config.imageryLayersControls, "imageryLayers-list");

// Ajout des modèles 3D au viewer
add3DModelsTiles(viewer, config.mesh3DSources, "primitives-list");

// Initialisation et ajout du module de recherche d'adresse au viewer
addSearchModule(viewer, "searchBar");

//Intialisation des boutons pours les vues
const buttons = generateAndAttachViewButtons(config.views, viewer);
const container = document.getElementById("views-buttons-container");
buttons.forEach((button) => container.appendChild(button));

// Écouteur d'événements pour l'input range pour modifier la hauteur des icônes
document
  .getElementById("verticalAmountRange")
  .addEventListener("input", function (event) {
    const newVerticalAmount = parseFloat(event.target.value);
    document.getElementById("rangeValue").textContent = newVerticalAmount; // Mettre à jour le label
    updateEntitiesVerticalPosition(viewer, newVerticalAmount); // Mettre à jour les entités
  });

// Ajout de
const infobox = document.querySelector(".custom-infobox");
// makeInfoboxDraggable(infobox);
// makeInfoboxResizable(infobox);
//addResizeHandles(infobox);
//
