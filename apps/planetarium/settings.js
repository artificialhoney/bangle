// make sure to enclose the function in parentheses
(function(back) {
    let settings = require('Storage').readJSON('planetarium.json',1)||{};
    function save(key, value) {
      settings[key] = value;
      require('Storage').write('planetarium.json',settings);
    }
    const appMenu = {
      '': {'title': 'Planetarium Settings'},
      '< Back': back,
      'Star names': {
        value: settings.starnames,
        format: v => v ? 'Yes' : 'No',
        onchange: (v) => {save('starnames', !settings.starnames)}
      },
      'Constellations': {
        value: settings.constellations,
        format: v => v ? 'Yes' : 'No',
        onchange: (v) => {save('constellations', !settings.constellations)}
      }   
    };
    E.showMenu(appMenu)
  })