import once from 'lodash.once';

function uniq(arr) {
  return arr.filter((el, index, self) => self.indexOf(el) === index);
}

function normalizeLocales(arr) {
  return arr.map((el) => {
    if (!el || el.indexOf('-') === -1 || el.toLowerCase() !== el) {
      return el;
    }

    const splitEl = el.split('-');
    return `${splitEl[0]}-${splitEl[1].toUpperCase()}`;
  });
}

function getUserLocalesInternal() {
  let languageList = [];

  if (typeof window !== 'undefined') {
    const { navigator } = window;

    if (navigator.languages) {
      languageList = languageList.concat(navigator.languages);
    }
    if (navigator.language) {
      languageList.push(navigator.language);
    }
    if (navigator.userLanguage) {
      languageList.push(navigator.userLanguage);
    }
    if (navigator.browserLanguage) {
      languageList.push(navigator.browserLanguage);
    }
    if (navigator.systemLanguage) {
      languageList.push(navigator.systemLanguage);
    }
  }

  languageList.push('en-US'); // Fallback

  return normalizeLocales(uniq(languageList));
}

export const getUserLocales = once(getUserLocalesInternal);

function getUserLocaleInternal() {
  return getUserLocales()[0];
}

export const getUserLocale = once(getUserLocaleInternal);

export default getUserLocale;
