// Fonction pour récupérer toutes les entités de type Cesium.GeoJsonDataSource
export function getAllEntities(viewer) {
  let allEntities = [];

  // Parcourir toutes les sources de données du viewer
  viewer.dataSources._dataSources.forEach((dataSource) => {
    // Vérifier si la source de données est de type Cesium.GeoJsonDataSource
    if (dataSource instanceof Cesium.GeoJsonDataSource) {
      // Ajouter toutes les entités de cette source de données à notre tableau
      allEntities = allEntities.concat(dataSource.entities.values);
    }
  });

  return allEntities;
}
