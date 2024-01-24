import { getEntityName } from "../utils/getEntityName.js";
import { generateTabbedDescriptionForEntity } from "../interfaces/generateTabbedDescriptionForEntity.js";
import { setVerticalPosition } from "../interfaces/setImageEntityVerticalPosition.js";

export function addDataSource(
  viewer,
  baseUrlGeoServer,
  baseUrlImageServer,
  layerName,
  options = {}
) {
  const defaultOptions = {
    urlDataSource:
      baseUrlGeoServer +
      "/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=" +
      layerName +
      "&outputFormat=application/json",
    markerSymbol: "marker",
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
      1.0,
      400000.0
    ),
    distanceDisplayConditionLabel: new Cesium.DistanceDisplayCondition(
      1.0,
      400000.0
    ),
    markerSize: 50,
    billboardWidth: 45,
    billboardHeight: 45,
    labelFont: "14pt sans-serif",
    labelPixelOffset: new Cesium.Cartesian2(0, -65),
  };

  const {
    markerSymbol,
    icon,
    distanceDisplayCondition,
    distanceDisplayConditionLabel,
    markerSize,
    billboardWidth,
    billboardHeight,
    labelFont,
    labelPixelOffset,
    urlDataSource,
    urlFiches,
    formatFiches,
    uniqueIcon,
  } = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    try {
      const promise = Cesium.GeoJsonDataSource.load(urlDataSource, {
        markerSize: markerSize,
        markerSymbol: markerSymbol,
      });

      promise
        .then(function (dataSource) {
          // Get the array of entities
          const entities = dataSource.entities.values;

          //const baseUrlFiches = baseUrlImageServer + "/" + layerGeoJsonName.split(":")[0] + "/" + layerGeoJsonName.split(":")[1];

          //console.log(icon);
          // Display the entity icon

          let iconDataSource;

          if (icon) {
            iconDataSource = icon;
          } else if (iconByServer) {
            // Si urlBillboardImage n'est pas fourni, utilisez l'icône par défaut de GeoServer
            const legendGraphicUrl = `${baseUrlGeoServer}/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layerName}`;
            iconDataSource = legendGraphicUrl;
          } else {
            iconDataSource = Cesium.buildModuleUrl(
              "Assets/Textures/maki/" + markerSymbol + ".png"
            );
          }
          dataSource.icon = iconDataSource;

          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            // Définir les propriétés layerName et id pour l'entité
            entity.properties.layerName = layerName.split(":")[1]; // Supposons que layerGeoJsonData soit de la forme "Antibes:COLLEGES", le layername sera COLLEGES

            //Récupérer l'id de l'entité depuis la couche de donénes
            entity.properties.id = entity.properties._id;

            // Je stocke la position originale dans l'entité pour l'utiliser dans la fonction de mise à jour de la hauteur de l'icône de l'entité
            entity.properties.originalPosition = entity.position.getValue(
              Cesium.JulianDate.now()
            );

            // Display the entity icon
            if (uniqueIcon && icon) {
              const urlUniqueIcon =
                baseUrlImageServer +
                "/" +
                layerName.split(":")[0] +
                "/" +
                layerName.split(":")[1] +
                "/" +
                entity.id.split(".")[1] +
                ".png";
              entity.billboard.image = urlUniqueIcon;
            } else if (icon) {
              entity.billboard.image = iconDataSource;
            } else if (iconByServer) {
              entity.billboard.image = iconDataSource;
            }

            entity.billboard.width = billboardWidth;
            entity.billboard.height = billboardHeight;
            entity.billboard.disableDepthTestDistance =
              Number.POSITIVE_INFINITY;
            entity.billboard.distanceDisplayCondition =
              distanceDisplayCondition;

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

            //Récupérer les propriétés originales et les mettre dans un deuxième onglet
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
              const formatFiche = formatFiches ? formatFiches : "";
              const urlFiche =
                '<img src="' +
                urlFiches +
                entity.properties.id +
                formatFiche +
                '" alt="Image de l\'entité" style="width:100%; height:auto;min-height:500px;">';

              const descriptionContent = urlFiche;
              const codeContent = htmlContent;

              entity.description = generateTabbedDescriptionForEntity(
                descriptionContent,
                codeContent
              );
            } else {
              entity.description = htmlContent;
            }
          }
          resolve(dataSource); // Résolvez la promesse avec la source de données
        })
        .catch(function (error) {
          console.log(
            `Erreur lors du chargement de la couche ${layerName}`,
            error
          );
          reject(error); // Rejetez la promesse avec l'erreur
        });
    } catch (error) {
      reject(error); // Rejetez la promesse avec l'erreur
    }
  });
}

export function initializeLayers(
  viewer,
  layers,
  baseUrlGeoServer,
  baseUrlImageServer,
  parentId
) {
  // Créez un tableau pour stocker toutes les promesses
  const allDataSourcesPromises = layers.map((layer) => {
    // console.log(layer);
    const options = {};
    if (layer.name) options.name = layer.name;
    if (layer.urlDataSource) options.urlDataSource = layer.urlDataSource;
    if (layer.labelText) options.labelText = layer.labelText;
    if (layer.categorie) options.categorie = layer.categorie;

    if (layer.urlFiches) options.urlFiches = layer.urlFiches;
    if (layer.formatFiches) options.formatFiches = layer.formatFiches;

    if (layer.distanceDisplayCondition)
      options.distanceDisplayCondition = layer.distanceDisplayCondition;
    if (layer.distanceDisplayConditionLabel)
      options.distanceDisplayConditionLabel =
        layer.distanceDisplayConditionLabel;

    if (layer.labelFont) options.labelFont = layer.labelFont;
    if (layer.labelPixelOffset)
      options.labelPixelOffset = layer.labelPixelOffset;

    if (layer.markerSize) options.markerSize = layer.markerSize;
    if (layer.billboardWidth) options.billboardWidth = layer.billboardWidth;
    if (layer.billboardHeight) options.billboardHeight = layer.billboardHeight;
    if (layer.markerSymbol) options.markerSymbol = layer.markerSymbol;
    if (layer.icon) options.icon = layer.icon;
    if (layer.uniqueIcon) options.uniqueIcon = layer.uniqueIcon;
    if (layer.iconByServer) options.iconByServer = layer.iconByServer;

    //console.log(options);

    return addDataSource(
      viewer,
      baseUrlGeoServer,
      baseUrlImageServer,
      layer.name,
      options
    )
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
  return Promise.all(allDataSourcesPromises)
    .then((results) => {
      const validResults = results.filter(
        (result) => typeof result !== "string"
      );
      const failedLayers = results.filter(
        (result) => typeof result === "string"
      );

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
      // Pour chaque catégorie, créez une liste déroulable
      Object.keys(groupedByCategory).forEach((category) => {
        // Conteneur principal pour chaque catégorie
        const container = document.getElementById(parentId);

        // Bouton pour chaque catégorie
        const collapsible = document.createElement("button");
        collapsible.classList.add("collapsible");
        collapsible.innerText = category;

        // Conteneur pour les éléments de la catégorie
        const content = document.createElement("div");
        content.classList.add("content");

        // Liste pour les éléments
        const subList = document.createElement("ul");

        // Ajout des éléments à la liste
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

        // Ajoutez la liste au conteneur de contenu
        content.appendChild(subList);

        // Ajoutez le bouton et le contenu au conteneur principal
        container.appendChild(collapsible);
        container.appendChild(content);

        // Gestionnaire d'événements pour rendre la liste déroulante
        collapsible.addEventListener("click", function () {
          this.classList.toggle("active");
          const displayStyle =
            content.style.display === "block" ? "none" : "block";
          content.style.display = displayStyle;
        });
      });

      //return validResults; // Retournez les résultats pour une utilisation ultérieure si nécessaire
      return {
        validLayers: results.filter((result) => typeof result !== "string"),
        failedLayers: results.filter((result) => typeof result === "string"),
      };
    })
    .catch((error) => console.error(error));
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
