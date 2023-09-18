export function initializeSidebarControls(sidebar, openSidebarButton, closeSidebarButton) {
  closeSidebarButton.addEventListener("click", function () {
    sidebar.style.display = "none";
  });

  openSidebarButton.addEventListener("click", function () {
    sidebar.style.display = "block";
  });
}
