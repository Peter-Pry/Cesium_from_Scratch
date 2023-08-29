const urls = {
  urlGeoserver: "http://localhost:8585/geoserver",
  urlImagesServer: "http://localhost:8585/geoserver/www/images",
};

// Source Globe OpenStreetMap (OSM) servit par les serveurs d'OSM
const globeOSM = new Cesium.OpenStreetMapImageryProvider({
  url: "https://a.tile.openstreetmap.org/",
});

// Vue aérienne Antibes 2017 (Geoserver)
const antibes2017Provider = new Cesium.WebMapServiceImageryProvider({
  url: "https://sig-test.ville-antibes.fr/geoserver/cesium/wms",
  layers: "Antibes_OrthoVraie_LB93_2017_withmask",
  enablePickFeatures: false,
  parameters: {
    format: "image/png",
    transparent: "true",
  },
});

// Source Vue aérienne Antibes 2017 servit par IGO
const globeIGOProvider = new Cesium.WebMapServiceImageryProvider({
  url: "https://igoprod.igo.fr/SG/Antibes/Imagery",
  layers: "Antibes_Globe.mpt",
  enablePickFeatures: false,
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
    },
    {
      name: "antibes2017Provider",
      provider: antibes2017Provider,
      labelText: "Vue aérienne Antibes 2017 (SIG Antibes)",
      activeBydefault: true,
    },
    { name: "globeOSM", provider: globeOSM, labelText: "Globe OpenStreetMap" },
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
  layers: [
    //TODO: Modifier fonction pour récupérer icône depuis répertoire d'image de la couche + définir url de base dans les propriétés de la couche
    {
      name: "Antibes:COLLEGES",
      labelText: "Collèges",
      icon: urls.urlImagesServer + "/antibes/COLLEGES.png",
      urlFiches: urls.urlImagesServer + "/antibes/COLLEGES/",
    },
    {
      name: "Antibes:AIRES_DE_JEUX",
      labelText: "Aires de jeux",
      icon: urls.urlImagesServer + "/antibes/AIRES_DE_JEUX.png",
      urlFiches: urls.urlImagesServer + "/antibes/AIRES_DE_JEUX/",
    },
    {
      name: "Antibes:EQUIPEMENTS_CULTURELS_STREET_ART",
      labelText: "Street Art",
      icon: urls.urlImagesServer + "/antibes/Art Urbain.png",
      //urlFiches: config.urlImagesServer + "/antibes/EQUIPEMENTS_CULTURELS_STREET_ART/"
    },
    {
      name: "Antibes:ARTISTES_ARTISANS_ART",
      labelText: "Artistes & artisans d'art",
      icon: urls.urlImagesServer + "/antibes/ARTISTES_ARTISANS_ART.png",
      //urlFiches: config.urlImagesServer + "/antibes/ARTISTES_ARTISANS_ART/"
    },
    // ... autres couches
  ],
  mesh3DSources: [
    {
      name: "bati3D_IGO_tileset",
      url: "https://igoprod.igo.fr/SG/antibes/b3dm/Antibes_BatiGlobal.410970/tileset.json",
      labelText: "Bati3D IGO",
    },
    {
      name: "mesh3D_IGO_tileset",
      url: "https://igoprod.igo.fr/SG/antibes/b3dm/AntibesMesh3D/tileset.json",
      labelText: "Mesh3D IGO",
    },
    {
      name: "mesh3D_SIG_tileset",
      url: "https://cesium-dev.ville-antibes.fr/data2/3dtiles/mesh/pyramid/tileset.json",
      labelText: "Mesh3D SIG Antibes",
    },
  ],
  cameraCoordinates: {
    destination: new Cesium.Cartesian3(
      4605135.76386452,
      574914.9092524701,
      4373867.371009422
    ),
    orientation: {
      heading: 6.283185307179586,
      pitch: -0.7870703161505075,
      roll: 6.283185307179586,
    },
  },
};
