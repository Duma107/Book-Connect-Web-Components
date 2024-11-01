class ThemeManager {
    /**
     * Sets up initial theme based on user's system preferences
     */
    static setupTheme() {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'night' : 'day';
      
      document.querySelector(DOMHandler.selectors.settingsTheme).value = theme;
      ThemeManager.applyTheme(theme);
    }
  
    /**
     * Applies selected theme by updating CSS variables
     * @param {string} theme - Theme name ('night' or 'day')
     */
    static applyTheme(theme) {
      const root = document.documentElement;
      if (theme === 'night') {
        root.style.setProperty('--color-dark', '255, 255, 255');
        root.style.setProperty('--color-light', '10, 10, 20');
      } else {
        root.style.setProperty('--color-dark', '10, 10, 20');
        root.style.setProperty('--color-light', '255, 255, 255');
      }
    }
  }
  