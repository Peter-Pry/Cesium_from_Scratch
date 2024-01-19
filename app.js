// Importation de la configuration
import { config } from "./config.js";

//Importation des fonctions pour ajouter des couches
import addImagerySource from "./layers/ImagerySource.js";
import { add3DModelsTiles } from "./layers/3DModelsTiles.js";
import { initializeLayers, getLayersFromWorkspace } from "./layers/LayerDataSource.js";

//Importation pour ajouter des fonctionnalités
import addSearchModule from "./features/addressSearchModule.js";

//Importation des fonctions pour ajouter des contrôles à l'application
import { setSidebarOpenable } from "./interfaces/setSidebarOpenable.js";
import { ToolTipMouseHover, addLeftClickHandler } from "./controls/mouseControls.js";

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
const terrainProvider = new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromUrl(config.terrainProviderUrl, { depthTestAgainstTerrain: true }));

// 2 - Terrain fournit par IGO
// const terrainProvider = Cesium.Terrain.fromWorldTerrain({requestWaterMask: true,requestVertexNormals: true,});

// Création du viewer Cesium avec les configurations spécifiées
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: terrainProvider,
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.TileMapServiceImageryProvider.fromUrl(Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"))), //Avoir un fond de carte base résolution par défaut
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
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });

  // Afficher la modale sélectionnée
  const selectedModal = document.getElementById(modalContentId);
  if (selectedModal) {
    selectedModal.style.display = 'block';
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
console.log(closeSpans);

closeSpans.forEach(closeSpan=>{
  closeSpan.onclick = ()=>{
    closeSpan.parentNode.style.display = "none";
  }
})





  // Gestion Onglet dans le menu
  
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active-tab"));
      tabContents.forEach((c) => c.classList.remove("active-content"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active-tab");
      const activeTabContent = document.getElementById(tab.getAttribute("data-tab"));
      activeTabContent.classList.add("active-content");
    });
  });


  

//Suppression des Crédit Cesium ION (si nécessaire)
viewer._cesiumWidget._creditContainer.parentNode.removeChild(viewer._cesiumWidget._creditContainer);

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
initializeLayers(viewer, config.layers, config.urls.urlGeoserver, config.urls.urlImagesServer, "layer-list").then((failedLayers) => {
  if (failedLayers.length === 0) {
    console.log("Toutes les couches GeoJson ont été initialisées !");
  } else {
    console.log(`Les couches suivantes n'ont pas pu être chargées: \n  ${failedLayers.join(",\n  ")}`);
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
document.getElementById("verticalAmountRange").addEventListener("input", function (event) {
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
