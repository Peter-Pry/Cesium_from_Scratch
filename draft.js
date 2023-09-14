// const tileset = await Cesium.Cesium3DTileset.fromUrl("http://localhost:8585/geoserver/www/tileset/antibes_bati_extract_terraExplorer/tileset.json", {
//   colorBlendAmount: 0, // Essayez de définir ceci à 0
//   colorBlendMode: Cesium.ColorBlendMode.REPLACE, // Ajoutez ceci
// });

const tileset = await Cesium.Cesium3DTileset.fromUrl("http://localhost:8585/geoserver/www/tileset/antibes_zone1/tileset.json", {
  //colorBlendAmount: 0, // Essayez de définir ceci à 0
  //colorBlendMode: Cesium.ColorBlendMode.REPLACE, // Ajoutez ceci
});

// const heightOffset = -50.0;
// const boundingSphere = tileset.boundingSphere;
// const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
// const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
// const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
// const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
// tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

//viewer.scene.primitives.add(tileset);



//const layers2 = await getLayersFromWorkspace(config.urls.urlGeoserver, "Antibes");