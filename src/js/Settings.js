class Settings {
  static update(update) {
    let key = Object.keys(update)[0];
    let value = Object.values(update)[0];
    let settings = JSON.parse(localStorage.getItem('settings'));
    settings[key] = value;
    localStorage.setItem('settings', JSON.stringify(settings));
  }
  
  static init() {
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify({
        showDescriptions: 0,
        collapseResults: 0,
        resultsDisplay: 0
      }));
    }
  }
  
  static get() {
    return JSON.parse(localStorage.getItem('settings'));
  }
}