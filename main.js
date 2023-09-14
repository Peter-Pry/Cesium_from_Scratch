// Importation des modules nécessaires
import { config } from "./config.js";
import addSearchModule from "./addressSearchModule.js";
import { initializeSidebarControls } from "./sidebarControls.js";
import { initializeGeoJsonLayers, getLayersFromWorkspace } from "./addGeoJsonDataSource.js";
import addImagerySource from "./addImagerySource.js";
import Add3DTileModels from "./add3DTileModels.js";
import { ToolTipMouseHover, addLeftClickHandler } from "./mouseControls.js";
import { generateAndAttachViewButtons } from "./interfaces/addButtonCenterView.js";
import { updateEntitiesVerticalPosition } from "./setVerticalPosition.js";
import { makeInfoboxDraggable } from "./draggableInfosBox.js";
import { makeInfoboxResizable } from "./resizeInfosBox.js";
import { addResizeHandles } from "./infoBoxControls.js";

// Initialisation des contrôles de la barre latérale
// Récupération des éléments du DOM nécessaires
const sidebar = document.getElementById("sidebar");
const closeSidebarButton = document.getElementById("close-sidebar-button");
const openSidebarButton = document.getElementById("open-sidebar-button");
initializeSidebarControls(sidebar, openSidebarButton, closeSidebarButton);


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
initializeGeoJsonLayers(viewer, config.layers, config.urls.urlGeoserver, config.urls.urlImagesServer, "layer-list").then((failedLayers) => {
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
Add3DTileModels(viewer, config.mesh3DSources, "primitives-list");

// Initialisation et ajout du module de recherche d'adresse au viewer
const options = {
  geocodingServices: [
    { value: "ban", text: "BAN (Base Adresse Nationale)" },
    { value: "nominatim", text: "Nominatim (OpenStreetMap)" },
    { value: "ign", text: "IGN Autocomplétion" }, // Ajout du service IGN
  ],
};

addSearchModule(viewer, "searchBar");

const buttons = generateAndAttachViewButtons(config.views, viewer);
const container = document.getElementById("views-buttons-container");

buttons.forEach((button) => container.appendChild(button));

// Écouteur d'événements pour l'input range
document.getElementById("verticalAmountRange").addEventListener("input", function (event) {
  const newVerticalAmount = parseFloat(event.target.value);
  document.getElementById("rangeValue").textContent = newVerticalAmount; // Mettre à jour le label
  updateEntitiesVerticalPosition(viewer, newVerticalAmount); // Mettre à jour les entités
});

const infobox = document.querySelector(".custom-infobox");
// makeInfoboxDraggable(infobox);
// makeInfoboxResizable(infobox);
addResizeHandles(infobox);
