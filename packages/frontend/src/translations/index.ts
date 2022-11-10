import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import locales from './locales';

export enum LANG {
    EN = 'en',
    IT = 'it',
    PT = 'pt',
    RU = 'ru',
    TR = 'tr',
    UA = 'ua',
    VI = 'vi',
    ZH_HANS = 'zh-hans',
    ZH_HANT = 'zh-hant',
}


const resources = [
    LANG.EN,
    LANG.IT,
    LANG.PT,
    LANG.RU,
    LANG.TR,
    LANG.UA,
    LANG.VI,
    LANG.ZH_HANS,
    LANG.ZH_HANT,
].reduce((res, lang) => {
    res[lang] = { translation: locales[lang] };

    return res;
}, {});

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('languageCode') || LANG.EN,
        fallbackLng: LANG.EN,
        debug: true,
        interpolation: {
            escapeValue: false
        },
    });

export default i18n;
