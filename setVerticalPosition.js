/**
 * Met à jour la position verticale de toutes les entités dans un viewer Cesium.
 *
 * @param {Cesium.Viewer} viewer - Le viewer Cesium contenant les entités.
 * @param {number} verticalAmount - La quantité de déplacement vertical.
 */
export function updateEntitiesVerticalPosition(viewer, verticalAmount) {
  // Fonction interne pour mettre à jour la position verticale d'une entité

  const entities = getAllGeoJsonEntities(viewer, verticalAmount);
  //console.log(entities);
  for (let i = 0; i < entities.length; i++) {
    setVerticalPosition(entities[i], verticalAmount);
  }

  // Demander une mise à jour du rendu
  //viewer.scene.requestRender();
}

// Fonction pour récupérer toutes les entités de type Cesium.GeoJsonDataSource
function getAllGeoJsonEntities(viewer) {
  let allGeoJsonEntities = [];

  // Parcourir toutes les sources de données du viewer
  viewer.dataSources._dataSources.forEach((dataSource) => {
    // Vérifier si la source de données est de type Cesium.GeoJsonDataSource
    if (dataSource instanceof Cesium.GeoJsonDataSource) {
      // Ajouter toutes les entités de cette source de données à notre tableau
      allGeoJsonEntities = allGeoJsonEntities.concat(dataSource.entities.values);
    }
  });

  return allGeoJsonEntities;
}

export function setVerticalPosition(entity, verticalAmount) {
  const position = entity.properties.originalPosition;

  const origMagnitude = Cesium.Cartesian3.magnitude(position);
  const newMagnitude = origMagnitude + verticalAmount;
  const scalar = newMagnitude / origMagnitude;
  const newPosition = new Cesium.Cartesian3();
  Cesium.Cartesian3.multiplyByScalar(position, scalar, newPosition);
  entity.position = newPosition;

  // Si l'entité a une ligne verticale, mettez-la à jour également
  if (entity.polyline) {
    entity.polyline.positions = [position, newPosition];
  } else {
    entity.polyline = new Cesium.PolylineGraphics({
      positions: [position, newPosition],
      width: 1,
      material: Cesium.Color.WHITE,
    });
  }
}
