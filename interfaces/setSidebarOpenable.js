//TODO : Reprendre dans ce composant la génération de la sidebar en entier
export function setSidebarOpenable(sidebar, openSidebarButton, closeSidebarButton) {
  closeSidebarButton.addEventListener("click", function () {
    sidebar.style.display = "none";
  });

  openSidebarButton.addEventListener("click", function () {
    sidebar.style.display = "block";
  });
}
