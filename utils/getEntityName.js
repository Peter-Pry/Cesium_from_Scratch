export function getEntityName(entity) {
  // Liste des propriétés possibles pour le nom de l'entité
  const possibleNameProperties = ["nom", "NOM", "name", "NAME", "title", "TITLE", "label", "LABEL"];

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
