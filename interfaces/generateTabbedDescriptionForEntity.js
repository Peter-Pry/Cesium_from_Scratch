//TODO : Modifier fonction pour générer la description à partir des informations de l'entité au moment du clique

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
