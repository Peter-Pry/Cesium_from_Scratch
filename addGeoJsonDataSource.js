import { getEntityName, generateTabbedDescriptionForEntity } from "./utils.js";

export function addGeoJsonDataSource(viewer, baseUrlGeoServer, layerGeoJsonName, options = {}) {
  const defaultOptions = {
    urlGeoJsonDataSource:
    baseUrlGeoServer +
      "/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=" +
      layerGeoJsonName +
      "&outputFormat=application/json",
    markerSymbol: "marker",
    verticalAmount: 100,
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      1.0,
      400000.0
    ),
    distanceDisplayConditionLabel: new Cesium.DistanceDisplayCondition(
      1.0,
      400000.0
    ),
    markerSize: 50,
    polylineWidth: 1,
    billboardWidth: 45,
    billboardHeight: 45,
    labelFont: "14pt sans-serif",
    labelPixelOffset: new Cesium.Cartesian2(0, -65),
  };

  const {
    markerSymbol,
    verticalAmount,
    urlBillboardImage,
    categorieLabelText,
    distanceDisplayCondition,
    distanceDisplayConditionLabel,
    markerSize,
    polylineWidth,
    billboardWidth,
    billboardHeight,
    labelFont,
    labelPixelOffset,
    urlGeoJsonDataSource,
    urlFiches,
  } = { ...defaultOptions, ...options };

  const promise = Cesium.GeoJsonDataSource.load(urlGeoJsonDataSource, {
    markerSize: markerSize,
    markerSymbol: markerSymbol,
  });

  return promise
    .then(function (dataSource) {
      // Get the array of entities
      const entities = dataSource.entities.values;

      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        // Définir les propriétés layerName et id pour l'entité
        entity.properties.layerName = layerGeoJsonName.split(":")[1]; // Supposons que layerGeoJsonData soit de la forme "Antibes:COLLEGES"
        entity.properties.id = entity.id.split(".")[1]; // Ou une autre propriété unique de votre GeoJSON, par exemple entity.properties.someUniqueId

        const position = entity.position.getValue(Cesium.JulianDate.now());

        // Add a vertical offset
        const origMagnitude = Cesium.Cartesian3.magnitude(position);
        const newMagnitude = origMagnitude + verticalAmount;
        const scalar = newMagnitude / origMagnitude;
        const newPosition = new Cesium.Cartesian3();
        Cesium.Cartesian3.multiplyByScalar(position, scalar, newPosition);
        entity.position = newPosition;

        // Add a vertical line
        entity.polyline = new Cesium.PolylineGraphics({
          positions: [position, newPosition],
          width: polylineWidth,
          material: Cesium.Color.WHITE,
        });

        // Display the entity icon
        if (urlBillboardImage) {
          entity.billboard.image = urlBillboardImage;
        }

        entity.billboard.width = billboardWidth;
        entity.billboard.height = billboardHeight;
        entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        entity.billboard.distanceDisplayCondition = distanceDisplayCondition;

        // Set a scale based on the distance to the camera
        entity.billboard.scaleByDistance = new Cesium.NearFarScalar(
          1,
          1,
          400000.0,
          0.005
        );

        const entityName = getEntityName(entity);
        entity.name = entityName;
        entity.label = new Cesium.LabelGraphics({
          text: entityName,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: labelPixelOffset,
          font: labelFont,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 4,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          distanceDisplayCondition: distanceDisplayConditionLabel,
          show: false,
        });

                // Stockez les propriétés originales de l'entité

        //TODO : récupérer les propriétés originales et les mettre dans un deuxième onglet
        const entityProperties = entity.properties;
        const usefulProperties = {};

        // Parcourir le tableau _propertyNames
        entityProperties._propertyNames.forEach((propertyName) => {
          // Récupérer la valeur de chaque propriété
          const value = entityProperties[propertyName];
          // Si la valeur est un objet avec une propriété _value (comme ng), utilisez cette valeur
          usefulProperties[propertyName] =
            value && value._value !== undefined ? value._value : value;
        });

        let htmlContent = "<table>";
        for (let key in usefulProperties) {
          htmlContent += `<tr><td><strong>${key}</strong></td><td>${usefulProperties[key]}</td></tr>`;
        }
        htmlContent += "</table>";

        entity.name = entityName;

        if (urlFiches) {
          const urlFiche ='<img src="' +
            urlFiches +
            entity.properties.id +
            ".jpg" +
            '" alt="Image de l\'entité" style="width:100%; height:auto;min-height:500px;">';

            const descriptionContent = urlFiche;
            const codeContent = htmlContent;
            
            entity.description = generateTabbedDescriptionForEntity(descriptionContent, codeContent);
        }else{
          entity.description = htmlContent;
        }
      }
      return dataSource;
    })
    .catch(function (error) {
      // Display errors encountered during loading.
      console.log(error);
    });
}

export function initializeGeoJsonLayers(viewer, layers, baseUrlGeoServer, parentId) {
  // Créez un tableau pour stocker toutes les promesses
  const allGeoJsonsourcesPromises = layers.map((layer) => {
    return addGeoJsonDataSource(viewer, baseUrlGeoServer, layer.name, {
      urlBillboardImage: layer.icon,
      categorieLabelText: layer.labelText,
      urlFiches: layer.urlFiches,
    }).then((dataSource) => {
      return {
        labelText: layer.labelText,
        dataSource: dataSource,
      };
    });
  });

  // Attendez que toutes les promesses soient résolues
  return Promise.all(allGeoJsonsourcesPromises).then((results) => {
    // Triez les résultats par ordre alphabétique en fonction de labelText
    results.sort((a, b) => a.labelText.localeCompare(b.labelText));

    // Créez la liste
    results.forEach((result) => {
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      // Cochez la case à cocher par défaut et ajoutez la source de données au viewer
      checkbox.checked = true;
      viewer.dataSources.add(result.dataSource);

      checkbox.addEventListener("change", function () {
        // Afficher ou masquer la couche en fonction de l'état de la case à cocher
        if (checkbox.checked) {
          viewer.dataSources.add(result.dataSource);
        } else {
          viewer.dataSources.remove(result.dataSource);
        }
      });

      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(result.labelText));
      document.getElementById(parentId).appendChild(listItem);
    });

    return results; // Retournez les résultats pour une utilisation ultérieure si nécessaire
  });
}
