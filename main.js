// Importation des modules nécessaires
import { config } from "./config.js";
import addSearchModule from "./addressSearchModule.js";
import { initializeSidebarControls } from "./sidebarControls.js";
import {
  initializeGeoJsonLayers,
  getLayersFromWorkspace,
} from "./addGeoJsonDataSource.js";
import addImagerySource from "./addImagerySource.js";
import Add3DTileModels from "./add3DTileModels.js";
import { ToolTipMouseHover, addLeftClickHandler } from "./mouseControls.js";
import {generateAndAttachViewButtons} from './addButtonCenterView.js';

// Initialisation des contrôles de la barre latérale
// Récupération des éléments du DOM nécessaires
const sidebar = document.getElementById("sidebar");
const closeSidebarButton = document.getElementById("close-sidebar-button");
const openSidebarButton = document.getElementById("open-sidebar-button");
initializeSidebarControls(sidebar, openSidebarButton, closeSidebarButton);
const urlImagesServer = "https://cesium.smartantibes.ville-antibes.fr/geoserver/www";
const urlGeoserver = "https://cesium.smartantibes.ville-antibes.fr/geoserver";
const layersOnServer = [
  //TODO: Modifier fonction pour récupérer icône depuis répertoire d'image de la couche + définir url de base dans les propriétés de la couche
  {
    name: "antibes:AIRES_DE_JEUX",
    labelText: "Aires de jeux",
    icon: urlImagesServer + "/antibes/AIRES_DE_JEUX/AIRES_DE_JEUX.png",
    urlFiches: urlImagesServer + "/antibes/AIRES_DE_JEUX/",
  },
  {
    name: "antibes:CENTRE_DE_LOISIRS",
    labelText: "Centre de loisirs",
    icon: urlImagesServer + "/antibes/CENTRE_DE_LOISIRS/CENTRE_DE_LOISIRS.png",
    urlFiches: urlImagesServer + "/antibes/CENTRE_DE_LOISIRS/",
  },
  {
    name: "antibes:COLLEGES",
    labelText: "Collèges",
    icon: urlImagesServer + "/antibes/COLLEGES/COLLEGES.png",
    urlFiches: urlImagesServer + "/antibes/COLLEGES/",
  },
  {
    name: "antibes:ECOLES_ELEMENTAIRES",
    labelText: "Écoles élémentaires",
    icon: urlImagesServer + "/antibes/ECOLES_ELEMENTAIRES/ECOLES_ELEMENTAIRES.png",
    urlFiches: urlImagesServer + "/antibes/ECOLES_ELEMENTAIRES/",
  },
  {
    name: "antibes:ECOLES_MATERNELLES",
    labelText: "Écoles maternelles",
    icon: urlImagesServer + "/antibes/ECOLES_MATERNELLES/ECOLES_MATERNELLES.png",
    urlFiches: urlImagesServer + "/antibes/ECOLES_MATERNELLES/",
  },
  {
    name: "antibes:ECOLES_PRIVEES",
    labelText: "Écoles privées",
    icon: urlImagesServer + "/antibes/ECOLES_PRIVEES/ECOLES_PRIVEES.png",
    urlFiches: urlImagesServer + "/antibes/ECOLES_PRIVEES/",
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_ART_URBAIN",
    labelText: "Art Urbain",
    icon: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ART_URBAIN/EQUIPEMENTS_CULTURELS_ART_URBAIN.png",
    urlFiches: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ART_URBAIN/",
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS",
    labelText: "Établissement culturels",
    icon: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS/EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS.png",
    urlFiches: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS/",
    uniqueIcon : true,
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_PATRIMOINE",
    labelText: "Patrimoine",
    icon: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE/EQUIPEMENTS_CULTURELS_PATRIMOINE.png",
    urlFiches: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE/",
    uniqueIcon : true,
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE",
    labelText: "Patrimoine durable",
    icon: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE/EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE.png",
    urlFiches: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE/",
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT",
    labelText: "Sculpture à ciel ouvert",
    icon: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT/EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT.png",
    urlFiches: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT/",
    uniqueIcon : true,
  },
  {
    name: "antibes:JARDINS_PARTAGES",
    labelText: "Jardins partagés",
    icon: urlImagesServer + "/antibes/JARDINS_PARTAGES/JARDINS_PARTAGES.png",
    urlFiches: urlImagesServer + "/antibes/JARDINS_PARTAGES/",
  },
  {
    name: "antibes:LIEUX_ACCUEIL_ENFANTS_PARENTS",
    labelText: "Lieux accueil enfants-parents",
    icon: urlImagesServer + "/antibes/LIEUX_ACCUEIL_ENFANTS_PARENTS/LIEUX_ACCUEIL_ENFANTS_PARENTS.png",
    urlFiches: urlImagesServer + "/antibes/LIEUX_ACCUEIL_ENFANTS_PARENTS/",
  },
  {
    name: "antibes:LUDOTHEQUES",
    labelText: "Ludothèques",
    icon: urlImagesServer + "/antibes/LUDOTHEQUES/LUDOTHEQUES.png",
    urlFiches: urlImagesServer + "/antibes/LUDOTHEQUES/",
  },
  // {
  //   name: "antibes:EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS",
  //   labelText: "Artistes et Artisans d'art",
  //   icon: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS/EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS.png",
  //   urlFiches: urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS/",
  // },

];

const terrainProvider = new Cesium.Terrain(
  Cesium.CesiumTerrainProvider.fromUrl(config.terrainProviderUrl)
);

// const terrainProvider = await Cesium.GeoserverTerrainProvider({
//   "url": "https://wxs.ign.fr/inspire/inspire/r/wms",
//   "layerName": "EL.GridCoverage"
  
// });
// Création du viewer Cesium avec les configurations spécifiées
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: terrainProvider,
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

const layers2 = await getLayersFromWorkspace(
  config.urls.urlGeoserver,
  "Antibes"
);

// Initialisation et ajout des couches de données GeoJson au viewer
initializeGeoJsonLayers(
  viewer,
  //config.layers,
  //layers2,
  layersOnServer,
  //config.urls.urlGeoserver,
  urlGeoserver,
  //config.urls.urlImagesServer,
  urlImagesServer,
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
  ],
};

addSearchModule(viewer, "searchBar", options);

const buttons = generateAndAttachViewButtons(config.views, viewer);
const container = document.getElementById('views-buttons-container');

buttons.forEach(button => container.appendChild(button));