// Importation des modules nécessaires
import { config } from "./config.js";
import addSearchModule from "./addressSearchModule.js";
import { initializeSidebarControls } from "./sidebarControls.js";
import { initializeGeoJsonLayers } from "./addGeoJsonDataSource.js";
import addImagerySource from "./addImagerySource.js";
import Add3DTileModels from "./add3DTileModels.js";
import { ToolTipMouseHover, addLeftClickHandler } from "./mouseControls.js";

// Initialisation des contrôles de la barre latérale
// Récupération des éléments du DOM nécessaires
const sidebar = document.getElementById("sidebar");
const closeSidebarButton = document.getElementById("close-sidebar-button");
const openSidebarButton = document.getElementById("open-sidebar-button");
initializeSidebarControls(sidebar, openSidebarButton, closeSidebarButton);

// Création du viewer Cesium avec les configurations spécifiées
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: new Cesium.Terrain(
    Cesium.CesiumTerrainProvider.fromUrl(config.terrainProviderUrl)
  ),
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.TileMapServiceImageryProvider.fromUrl(
      Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
    )
  ),
  baseLayerPicker: false,
  geocoder: false,
  animation: false,
  timeline: false,
  useBrowserRecommendedResolution: true,
});

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
initializeGeoJsonLayers(
  viewer,
  config.layers,
  config.urls.urlGeoserver,
  "layer-list"
).then((results) => {
  console.log("Toutes les couches GeoJson ont été initialisées !");
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
  ]
};

addSearchModule(viewer, "searchBar", options);
