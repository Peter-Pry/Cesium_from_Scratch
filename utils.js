// Fonction pour construire l'URL de l'image
function buildImageUrl(baseurl, layerName, entityId) {
  return (
    baseurl +
    layerName +
    "/" +
    entityId +
    ".jpg"
  );
}

// Fonction pour vérifier si l'image existe à l'URL donnée
function imageExists(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = function () {
      resolve(true);
    };
    img.onerror = function () {
      resolve(false);
    };
    img.src = url;
  });
}

// Fonction pour obtenir le contenu HTML pour l'InfoBox
async function getImageHtmlForEntity(baseurl, layerName, entityId) {
  const imageUrl = buildImageUrl(baseurl, layerName, entityId);
  const exists = await imageExists(imageUrl);

  if (exists) {
    return (
      '<img src="' +
      imageUrl +
      '" alt="Image de l\'entité" style="width:100%; height:auto;min-height:450px;">'
    );
  } else {
    //console.log("L'image n'existe pas à l'URL : " + imageUrl);
    return false;
  }
}

//Fonction pour obtenir les propriétés d'une entité
function getEntityProperties(entity) {
  return {
    layerName: entity.properties.layerName,
    entityId: entity.properties.id,
  };
}

//Fonction pour gérer le clic sur une entité
function handleEntityClick(viewer, click) {
  const pickedObject = viewer.scene.pick(click.position);

  if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
    const entity = pickedObject.id;
    const { layerName, entityId } = getEntityProperties(entity);
    const htmlContent = getImageHtmlForEntity(layerName, entityId);

    // Accédez au div "cesium-infoBox-description" et insérez le contenu
    const descriptionDiv = viewer.infoBox.frame.contentDocument.querySelector(
      ".cesium-infoBox-description"
    );
    if (descriptionDiv) {
      descriptionDiv.innerHTML = htmlContent;
    }

    // Assurez-vous que l'infoBox est visible
    viewer.infoBox.show = true;
  }
}

// //Configurer le gestionnaire d'événements pour le clic de la souris
// viewer.screenSpaceEventHandler.setInputAction(function (click) {
//     handleEntityClick(viewer, click);
// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


function getEntityName(entity) {
    // Liste des propriétés possibles pour le nom de l'entité
    const possibleNameProperties = [
      "nom",
      "NOM",
      "name",
      "NAME",
      "title",
      "TITLE",
      "label",
      "LABEL",
    ];
  
    // Parcourir la liste des propriétés possibles
    for (let i = 0; i < possibleNameProperties.length; i++) {
      const propName = possibleNameProperties[i];
  
      // Vérifier si la propriété existe
      if (entity.properties.hasOwnProperty(propName)) {
        return entity.properties[propName];
      }
    }
  
    // Retourner une valeur par défaut si aucune propriété de nom n'a été trouvée
    return "Unknown";
  }

  


  

export {
  buildImageUrl,
  imageExists,
  getImageHtmlForEntity,
  getEntityProperties,
  handleEntityClick,
  getEntityName,
};

export function stringifySelectedProperties(obj) {
  const seenObjects = new Set();
  const propertyNames = obj._propertyNames; // Récupérez la liste des noms de propriétés

  return JSON.stringify(obj, (key, value) => {
    if (key && !propertyNames.includes(key)) {
      return; // Si la clé n'est pas dans la liste des noms de propriétés, sautez-la
    }

    if (typeof value === 'object' && value !== null) {
      if (seenObjects.has(value)) {
        return; // Si l'objet a déjà été vu, sautez-le pour éviter une référence circulaire
      }
      seenObjects.add(value);
    }
    return value;
  }, 2);
}

export function generateTabbedDescription(entityDescription, entityDetails) {
  const tabContent = `
    <div class="tab-buttons">
      <button class="tab-button active" onclick="showTab('description')">Description</button>
      <button class="tab-button" onclick="showTab('details')">Détails</button>
    </div>
    <div id="description" class="tab-content active">${entityDescription}</div>
    <div id="details" class="tab-content">${entityDetails}</div>
    <script>
      function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => {
          tab.classList.remove('active');
        });
        document.querySelector('#' + tabId).classList.add('active');
        document.querySelectorAll('.tab-button').forEach(button => {
          button.classList.remove('active');
        });
        document.querySelector('.tab-button[onclick="showTab(\'' + tabId + '\')"]').classList.add('active');
      }
    </script>
  `;
  return tabContent;
}