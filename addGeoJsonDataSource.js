import { getEntityName, generateTabbedDescriptionForEntity } from "./utils.js";
import { setVerticalPosition } from "./setVerticalPosition.js";

export function addGeoJsonDataSource(viewer, baseUrlGeoServer, baseUrlImageServer, layerGeoJsonName, options = {}) {
  const defaultOptions = {
    urlGeoJsonDataSource: baseUrlGeoServer + "/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=" + layerGeoJsonName + "&outputFormat=application/json",
    markerSymbol: "marker",
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1.0, 400000.0),
    distanceDisplayConditionLabel: new Cesium.DistanceDisplayCondition(1.0, 400000.0),
    markerSize: 50,
    billboardWidth: 45,
    billboardHeight: 45,
    labelFont: "14pt sans-serif",
    labelPixelOffset: new Cesium.Cartesian2(0, -65),
  };

  const {
    markerSymbol,
    icon,
    categorieLabelText,
    distanceDisplayCondition,
    distanceDisplayConditionLabel,
    markerSize,
    billboardWidth,
    billboardHeight,
    labelFont,
    labelPixelOffset,
    urlGeoJsonDataSource,
    urlFiches,
    uniqueIcon,
    iconByServer,
  } = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    try {
      const promise = Cesium.GeoJsonDataSource.load(urlGeoJsonDataSource, {
        markerSize: markerSize,
        markerSymbol: markerSymbol,
      });

      promise
        .then(function (dataSource) {
          // Get the array of entities
          const entities = dataSource.entities.values;

          const baseUrlFiches = baseUrlImageServer + "/" + layerGeoJsonName.split(":")[0] + "/" + layerGeoJsonName.split(":")[1];

          //console.log(icon);
          // Display the entity icon

          let iconDataSource;

          if (icon) {
            iconDataSource = icon;
          } else if (iconByServer) {
            // Si urlBillboardImage n'est pas fourni, utilisez l'icône par défaut de GeoServer
            const legendGraphicUrl = `${baseUrlGeoServer}/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layerGeoJsonName}`;
            iconDataSource = legendGraphicUrl;
          } else {
            iconDataSource = Cesium.buildModuleUrl("Assets/Textures/maki/" + markerSymbol + ".png");
          }
          dataSource.icon = iconDataSource;

          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            // Définir les propriétés layerName et id pour l'entité
            entity.properties.layerName = layerGeoJsonName.split(":")[1]; // Supposons que layerGeoJsonData soit de la forme "Antibes:COLLEGES", le layername sera COLLEGES

            //Récupérer l'id de l'entité depuis la couche de donénes
            entity.properties.id = entity.properties._id;

            // Je stocke la position originale dans l'entité pour l'utiliser dans la fonction de mise à jour de la hauteur de l'icône de l'entité
            entity.properties.originalPosition = entity.position.getValue(Cesium.JulianDate.now());

            // Display the entity icon
            if (uniqueIcon && icon) {
              const urlUniqueIcon = baseUrlImageServer + "/" + layerGeoJsonName.split(":")[0] + "/" + layerGeoJsonName.split(":")[1] + "/" + entity.id.split(".")[1] + ".png";
              entity.billboard.image = urlUniqueIcon;
            } else if (icon) {
              entity.billboard.image = iconDataSource;
            } else if (iconByServer) {
              entity.billboard.image = iconDataSource;
            }

            entity.billboard.width = billboardWidth;
            entity.billboard.height = billboardHeight;
            entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            entity.billboard.distanceDisplayCondition = distanceDisplayCondition;

            // Set a scale based on the distance to the camera
            entity.billboard.scaleByDistance = new Cesium.NearFarScalar(1, 1, 400000.0, 0.005);

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

            //Récupérer les propriétés originales et les mettre dans un deuxième onglet
            const entityProperties = entity.properties;
            const usefulProperties = {};

            // Parcourir le tableau _propertyNames
            entityProperties._propertyNames.forEach((propertyName) => {
              // Récupérer la valeur de chaque propriété
              const value = entityProperties[propertyName];
              // Si la valeur est un objet avec une propriété _value (comme ng), utilisez cette valeur
              usefulProperties[propertyName] = value && value._value !== undefined ? value._value : value;
            });

            let htmlContent = "<table>";
            for (let key in usefulProperties) {
              htmlContent += `<tr><td><strong>${key}</strong></td><td>${usefulProperties[key]}</td></tr>`;
            }
            htmlContent += "</table>";

            entity.name = entityName;

            if (urlFiches) {
              const urlFiche = '<img src="' + urlFiches + entity.properties.id + ".JPG" + '" alt="Image de l\'entité" style="width:100%; height:auto;min-height:500px;">';

              const descriptionContent = urlFiche;
              const codeContent = htmlContent;

              entity.description = generateTabbedDescriptionForEntity(descriptionContent, codeContent);
            } else {
              entity.description = htmlContent;
            }
          }
          resolve(dataSource); // Résolvez la promesse avec la source de données
        })
        .catch(function (error) {
          console.log(`Erreur lors du chargement de la couche ${layerGeoJsonName}`, error);
          reject(error); // Rejetez la promesse avec l'erreur
        });
    } catch (error) {
      reject(error); // Rejetez la promesse avec l'erreur
    }
  });
}

export function initializeGeoJsonLayers(viewer, layers, baseUrlGeoServer, baseUrlImageServer, parentId) {
  // Créez un tableau pour stocker toutes les promesses
  const allGeoJsonsourcesPromises = layers.map((layer) => {
    // console.log(layer);
    const options = {};
    if (layer.name) options.name = layer.name;
    if (layer.labelText) options.labelText = layer.labelText;
    if (layer.markerSymbol) options.markerSymbol = layer.markerSymbol;
    if (layer.icon) options.icon = layer.icon;
    if (layer.categorieLabelText) options.categorieLabelText = layer.categorieLabelText;
    if (layer.distanceDisplayCondition) options.distanceDisplayCondition = layer.distanceDisplayCondition;
    if (layer.distanceDisplayConditionLabel) options.distanceDisplayConditionLabel = layer.distanceDisplayConditionLabel;
    if (layer.markerSize) options.markerSize = layer.markerSize;
    if (layer.billboardWidth) options.billboardWidth = layer.billboardWidth;
    if (layer.billboardHeight) options.billboardHeight = layer.billboardHeight;
    if (layer.labelFont) options.labelFont = layer.labelFont;
    if (layer.labelPixelOffset) options.labelPixelOffset = layer.labelPixelOffset;
    if (layer.urlGeoJsonDataSource) options.urlGeoJsonDataSource = layer.urlGeoJsonDataSource;
    if (layer.urlFiches) options.urlFiches = layer.urlFiches;
    if (layer.uniqueIcon) options.uniqueIcon = layer.uniqueIcon;
    if (layer.iconByServer) options.iconByServer = layer.iconByServer;
    if (layer.categorie) options.categorie = layer.categorie;

    //console.log(options);

    return addGeoJsonDataSource(viewer, baseUrlGeoServer, baseUrlImageServer, layer.name, options)
      .then((dataSource) => {
        return {
          labelText: layer.labelText,
          dataSource: dataSource,
          iconSource: dataSource.icon,
          categorie: layer.categorie,
        };
      })
      .catch((error) => {
        //console.log("Erreur lors de l'ajout de la source de données GeoJson: ", error);
        return layer.name; // Retournez le nom de la couche qui a échoué
      });
  });

  // Attendez que toutes les promesses soient résolues
  return Promise.all(allGeoJsonsourcesPromises)
    .then((results) => {
      const validResults = results.filter((result) => typeof result !== "string");
      const failedLayers = results.filter((result) => typeof result === "string");

      // Triez les résultats par catégorie, puis par ordre alphabétique en fonction de labelText
      validResults.sort((a, b) => {
        const categorieA = a.categorie || "Autres POI";
        const categorieB = b.categorie || "Autres POI";

        if (categorieA === "Autres POI" && categorieB !== "Autres POI") {
          return 1; // Placez categorieA après categorieB
        } else if (categorieB === "Autres POI" && categorieA !== "Autres POI") {
          return -1; // Placez categorieB après categorieA
        } else if (categorieA === categorieB) {
          return a.labelText.localeCompare(b.labelText);
        } else {
          return categorieA.localeCompare(categorieB);
        }
      });

      //console.log(validResults);
      // Groupez les couches par catégorie
      const groupedByCategory = validResults.reduce((acc, curr) => {
        const category = curr.categorie || "Autres POI";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(curr);
        return acc;
      }, {});

      // Pour chaque catégorie, créez une sous-liste et ajoutez-y les couches
      Object.keys(groupedByCategory).forEach((category) => {
        const container = document.getElementById(parentId);

        // Utilisez un élément <h4> pour le titre de la catégorie
        const categoryTitle = document.createElement("h4");
        categoryTitle.innerText = category;
        container.appendChild(categoryTitle);

        const subList = document.createElement("ul");
        container.appendChild(subList);

        groupedByCategory[category].forEach((result) => {
          const listItem = document.createElement("li");
          listItem.classList.add("layer-list-li");

          const checkbox = document.createElement("input");
          checkbox.classList.add("cm-toggle");
          checkbox.type = "checkbox";
          checkbox.checked = true;
          checkbox.id = "checkbox_" + result.labelText; // Assurez-vous que cet ID est unique
          viewer.dataSources.add(result.dataSource);

          const domImg = document.createElement("img");
          domImg.src = result.iconSource;
          domImg.classList.add("ico-data");

          const label = document.createElement("label");
          label.setAttribute("for", checkbox.id); // Associez le label à la checkbox
          label.appendChild(domImg);
          label.appendChild(document.createTextNode(result.labelText));

          checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
              viewer.dataSources.add(result.dataSource);
            } else {
              viewer.dataSources.remove(result.dataSource);
            }
          });

          listItem.appendChild(checkbox);
          listItem.appendChild(label);
          subList.appendChild(listItem);
        });
      });

      //return validResults; // Retournez les résultats pour une utilisation ultérieure si nécessaire
      return failedLayers; // Retournez la liste des noms des couches qui ont échoué
    })
    .catch((error) => console.log(error));
}

// Fonction pour obtenir les noms des couches disponibles dans l'espace de travail 'antibes'
export function getLayersFromWorkspace(baseUrlGeoServer, workspaceName) {
  const url = `${baseUrlGeoServer}/wms?service=WMS&version=1.3.0&request=GetCapabilities`;

  return fetch(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      // Ajoutez d'autres en-têtes CORS si nécessaire
    },
  })
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      // Trouver toutes les couches dans le document XML
      const layers = xmlDoc.querySelectorAll("Layer > Name");
      // Filtrer les couches basées sur l'espace de travail
      const layerNames = [];
      layers.forEach((layer) => {
        const name = layer.textContent;
        if (name.startsWith(workspaceName + ":")) {
          layerNames.push({ name: name, labelText: name.split(":")[1] });
        }
      });
      return layerNames;
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des couches :", error);
    });
}
