const urls = {
  urlGeoserver: "https://cesium.smartantibes.ville-antibes.fr/geoserver",
  urlImagesServer: "https://cesium.smartantibes.ville-antibes.fr/geoserver/www",
  urlTileSetsServer: "http://localhost:8585/geoserver/www/tilesets",
};

const layers = [
  {
    name: "antibes:AIRES_DE_JEUX",
    labelText: "Aires de jeux",
    categorie: "Environnement et Espaces verts",
    icon: urls.urlImagesServer + "/antibes/AIRES_DE_JEUX/AIRES_DE_JEUX.png",
    urlFiches: urls.urlImagesServer + "/antibes/AIRES_DE_JEUX/",
    formatFiches: ".JPG",
    //markerSymbol: "city",
  },
  {
    name: "antibes:CENTRE_DE_LOISIRS",
    labelText: "Centre de loisirs",
    categorie: "Éducation",
    icon: urls.urlImagesServer + "/antibes/CENTRE_DE_LOISIRS/CENTRE_DE_LOISIRS.png",
    urlFiches: urls.urlImagesServer + "/antibes/CENTRE_DE_LOISIRS/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:COLLEGES",
    labelText: "Collèges",
    categorie: "Éducation",
    icon: urls.urlImagesServer + "/antibes/COLLEGES/COLLEGES.png",
    urlFiches: urls.urlImagesServer + "/antibes/COLLEGES/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:ECOLES_ELEMENTAIRES",
    labelText: "Écoles élémentaires",
    categorie: "Éducation",
    icon: urls.urlImagesServer + "/antibes/ECOLES_ELEMENTAIRES/ECOLES_ELEMENTAIRES.png",
    urlFiches: urls.urlImagesServer + "/antibes/ECOLES_ELEMENTAIRES/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:ECOLES_MATERNELLES",
    labelText: "Écoles maternelles",
    categorie: "Éducation",
    icon: urls.urlImagesServer + "/antibes/ECOLES_MATERNELLES/ECOLES_MATERNELLES.png",
    urlFiches: urls.urlImagesServer + "/antibes/ECOLES_MATERNELLES/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:ECOLES_PRIVEES",
    labelText: "Écoles privées",
    categorie: "Éducation",
    icon: urls.urlImagesServer + "/antibes/ECOLES_PRIVEES/ECOLES_PRIVEES.png",
    urlFiches: urls.urlImagesServer + "/antibes/ECOLES_PRIVEES/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_ART_URBAIN",
    labelText: "Art Urbain",
    categorie: "Culture",
    icon: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ART_URBAIN/EQUIPEMENTS_CULTURELS_ART_URBAIN.png",
    urlFiches: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ART_URBAIN/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS",
    labelText: "Établissement culturels",
    categorie: "Culture",
    icon: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS/EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS.png",
    urlFiches: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ETABLISSEMENTS_CULTURELS/",
    formatFiches: ".JPG",
    uniqueIcon: true,
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_PATRIMOINE",
    labelText: "Patrimoine",
    categorie: "Culture",
    icon: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE/EQUIPEMENTS_CULTURELS_PATRIMOINE.png",
    urlFiches: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE/",
    formatFiches: ".JPG",
    uniqueIcon: true,
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE",
    labelText: "Patrimoine durable",
    categorie: "Culture",
    icon: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE/EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE.png",
    urlFiches: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_PATRIMOINE_DURABLE/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT",
    labelText: "Sculpture à ciel ouvert",
    categorie: "Culture",
    icon: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT/EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT.png",
    urlFiches: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_SCULPTURE_A_CIEL_OUVERT/",
    formatFiches: ".JPG",
    uniqueIcon: true,
  },
  {
    name: "antibes:JARDINS_PARTAGES",
    labelText: "Jardins partagés",
    categorie: "Environnement et Espaces verts",
    icon: urls.urlImagesServer + "/antibes/JARDINS_PARTAGES/JARDINS_PARTAGES.png",
    urlFiches: urls.urlImagesServer + "/antibes/JARDINS_PARTAGES/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:LIEUX_ACCUEIL_ENFANTS_PARENTS",
    labelText: "Lieux accueil enfants-parents",
    categorie: "Petite enfance",
    icon: urls.urlImagesServer + "/antibes/LIEUX_ACCUEIL_ENFANTS_PARENTS/LIEUX_ACCUEIL_ENFANTS_PARENTS.png",
    urlFiches: urls.urlImagesServer + "/antibes/LIEUX_ACCUEIL_ENFANTS_PARENTS/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:LUDOTHEQUES",
    labelText: "Ludothèques",
    categorie: "Petite enfance",
    icon: urls.urlImagesServer + "/antibes/LUDOTHEQUES/LUDOTHEQUES.png",
    urlFiches: urls.urlImagesServer + "/antibes/LUDOTHEQUES/",
    formatFiches: ".JPG",
  },
  {
    name: "antibes:EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS",
    labelText: "Artistes et Artisans d'art",
    categorie: "Culture",
    icon: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS/EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS.png",
    urlFiches: urls.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_ARTISTES_ARTISANS/",
    formatFiches: ".JPG",
  },
];

// Source Globe OpenStreetMap (OSM) servit par les serveurs d'OSM
const globeOSM = new Cesium.OpenStreetMapImageryProvider({
  url: "https://a.tile.openstreetmap.org/",
});

//Vue aérienne Antibes 2017 (Geoserver Seb)
const antibes2017Provider = new Cesium.WebMapServiceImageryProvider({
  url: "https://sig-test.ville-antibes.fr/geoserver/cesium/wms",
  layers: "Antibes_OrthoVraie_LB93_2017_withmask",
  enablePickFeatures: false,
  parameters: {
    format: "image/png",
    transparent: "true",
  },
});

//Vue aérienne Antibes 2017 (Geoserver SmartAntibes)
//TODO : problème de résolution à l'affichage. L'imagery est trop volumineuse pour être affichée.
// const antibes2017Provider = new Cesium.WebMapServiceImageryProvider({
//   url: "https://cesium.smartantibes.ville-antibes.fr/geoserver/wms",
//   layers: "antibes:ANTIBES_ORTHOVRAIE_LB93_2017_WITHMASK",
//   enablePickFeatures: false,
//   parameters: {
//     format: "image/png",
//     transparent: "true",
//   },
// });

// Source Vue aérienne Antibes 2017 servit par IGO
const globeIGOProvider = new Cesium.WebMapServiceImageryProvider({
  url: "https://igoprod.igo.fr/SG/Antibes/Imagery",
  layers: "Antibes_Globe.mpt",
  enablePickFeatures: false,
  parameters: {
    format: "image/png",
    transparent: "true",
  },
});

// Source Vue aérienne IGN
const orthoIgnProvider = new Cesium.WebMapServiceImageryProvider({
  url: "https://wxs.ign.fr/inspire/inspire/r/wms",
  layers: "OI.OrthoimageCoverage",
  enablePickFeatures: false,
  parameters: {
    format: "image/png",
    transparent: "true",
  },
});

// Source Vue aérienne IGN
const IgnProvider = new Cesium.WebMapTileServiceImageryProvider({
  url: "https://wxs.ign.fr/cartes/geoportail/wmts",
  layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
  style: "normal",
  format: "image/png",
  tileMatrixSetID: "PM",
});

export const config = {
  urls: urls,
  terrainProviderUrl: "https://cesium-dev.ville-antibes.fr/tilesets/quantized/",
  imageryLayersControls: [
    {
      name: "IgnProvider",
      provider: IgnProvider,
      labelText: "Vue IGN",
      activeBydefault: true,
      credit: new Cesium.Credit("IGN", "http://wxs.ign.fr/static/logos/IGN/IGN.gif", "http://www.ign.fr/"),
    },
    {
      name: "antibes2017Provider",
      provider: antibes2017Provider,
      labelText: "Vue aérienne Antibes 2017 (SIG Antibes)",
      activeBydefault: true,
    },
    //{ name: "globeOSM", provider: globeOSM, labelText: "Globe OpenStreetMap" },
    {
      name: "igo2017Provider",
      provider: globeIGOProvider,
      labelText: "Vue aérienne France IGO",
    },
    {
      name: "orthoIgnProvider",
      provider: orthoIgnProvider,
      labelText: "Vue aérienne France IGN",
    },
  ],
  layers: layers,
  mesh3DSources: [
    {
      name: "bati3D_IGO_tileset",
      url: "https://igoprod.igo.fr/SG/antibes/b3dm/Antibes_BatiGlobal.410970/tileset.json",
      labelText: "Bati3D IGO",
    },
    // {
    //   name: "mesh3D_IGO_tileset",
    //   url: "https://igoprod.igo.fr/SG/antibes/b3dm/AntibesMesh3D/tileset.json",
    //   labelText: "Mesh3D IGO",
    // },
    // {
    //   name: "mesh3D_SIG_tileset",
    //   url: "https://cesium-dev.ville-antibes.fr/data2/3dtiles/mesh/pyramid/tileset.json",
    //   labelText: "Mesh3D SIG Antibes",
    // },
    {
      name: "mesh3D_tileset_localHost",
      url: "http://localhost:8585/geoserver/www/tileset/antibes_3Dmesh/tileset.json",
      labelText: "Mesh3D Antibes LocalHost",
    },
    // {
    //   name: "mesh3D_tileset_localHost_new_release",
    //   url: "http://localhost:8585/geoserver/www/tileset/antibes_3Dmesh_new_release/tileset.json",
    //   labelText: "Mesh3D Antibes LocalHost New release",
    // },
    // {
    //   name: "mesh3D_tileset_localHost_new_release",
    //   url: "http://localhost:8585/geoserver/www/tileset/antibes_3Dmesh_new_release_gzip/tileset.json",
    //   labelText: "Mesh3D Antibes LocalHost New release Gzip",
    // },
    {
      name: "Fort_carre_hd",
      url: "http://localhost:8585/geoserver/www/tileset/fort_carre/tileset.json",
      labelText: "Fort carré HD",
    },
    // {
    //   name: "bati_antibes",
    //   url: "http://localhost:8585/geoserver/www/tileset/antibes_bati/tileset.json",
    //   labelText: "bati antibes",
    // },
    // {
    //   name: "bati_antibes_new",
    //   url: "http://localhost:8585/geoserver/www/tileset/antibes_bati_extract_terraExplorer/tileset.json",
    //   labelText: "bati antibes new",
    // },
    // {
    //   name: "mesh3D_fort_carre_tileset",
    //   url: urls.urlTileSetsServer+"/fort_carre/tileset.json",
    //   labelText: "Mesh3D Fort Carré (Geoserver local)",
    // },
    // {
    //   name: "mesh3D_antibes_tileset",
    //   url: urls.urlTileSetsServer+"/antibes/tileset.json",
    //   labelText: "Mesh3D Antibes (Geoserver local)",
    // },
  ],
  views: {
    antibes: {
      name: "Antibes",
      destination: [4605135.76386452, 574914.9092524701, 4373867.371009422],
      orientation: {
        heading: 6.283185307179586,
        pitch: -0.7870703161505075,
        roll: 6.283185307179586,
      },
    },
    antibes_centre: {
      name: "Centre",
      destination: [4592113.451525292, 574445.367525959, 4374454.623695505],
      orientation: {
        heading: 5.425059983218845,
        pitch: -0.4521988345390495,
        roll: 6.280361263179284,
      },
    },
    fort_carre: {
      name: "Fort Carré",
      destination: [4591491.266512864, 574128.7943305084, 4375245.716108861],
      orientation: {
        heading: 6.283185307179586,
        pitch: -0.7870703146044944,
        roll: 6.283185307179586,
      },
    },
  },
  cameraCoordinates: {
    destination: new Cesium.Cartesian3(4605135.76386452, 574914.9092524701, 4373867.371009422),
    orientation: {
      heading: 6.283185307179586,
      pitch: -0.7870703161505075,
      roll: 6.283185307179586,
    },
  },
};
