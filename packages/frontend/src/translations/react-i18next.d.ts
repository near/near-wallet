/**
 * @link {https://react.i18next.com/latest/typescript}
 */
import 'react-i18next';
import locales from './locales';

declare module 'react-i18next' {
    interface Resources {
        en: typeof locales.en;
    }
}

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'en';
        resources: {
            en: typeof locales.en;
        };
    }
}
