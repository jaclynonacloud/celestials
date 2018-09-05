// Load globally into all modules.
require.context("./res/", true, /\.png$/);
require.context("./res/", true, /\.json$/);
require.context("./", false, /index.html$/);
require.context("./", false, /package.json$/);
require.context("./styles/", false, /\.css$/);
require.context("./js/", false, /\background.js$/);


// require('./js/background.js');