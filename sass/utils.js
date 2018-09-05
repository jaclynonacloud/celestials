//scss files
const path = require("path");
const resources = [
  "./sass/_main.scss",
  "./sass/_icons.scss",
  "./sass/_celestial.scss",
  "./sass/menus/_components.scss",
  "./sass/menus/_contextMenu.scss",
  "./sass/menus/_overlayMenu.scss",
];
module.exports = resources.map(file => file);