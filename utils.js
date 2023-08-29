
// Fonction pour vérifier si l'image existe à l'URL donnée
export function imageExists(url) {
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


export function getEntityName(entity) {
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


export function generateTabbedDescriptionForEntity(descriptionContent, codeContent) {
  return `
      <div class="tab-buttons">
          <button class="tab-button active" data-tab="description">Description</button>
          <button class="tab-button" data-tab="code">Détails</button>
      </div>
      <div class="tab-content description active">
          ${descriptionContent}
      </div>
      <div class="tab-content code">
          ${codeContent}
      </div>
  `;
}

