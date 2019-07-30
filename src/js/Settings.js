class Settings {
  static update(update) {
    let key = Object.keys(update)[0];
    let value = Object.values(update)[0];
    let settings = JSON.parse(localStorage.getItem('settings'));
    settings[key] = parseInt(value);
    console.log(settings)
    localStorage.setItem('settings', JSON.stringify(settings));
  }
  
  static init() {
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify({
        showDescriptions: 1,
        collapseResults: 1,
        resultsDisplay: 1
      }));
    }
  }
  
  static get() {
    return JSON.parse(localStorage.getItem('settings'));
  }
}