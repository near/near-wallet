import React, {useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import { withLocalize } from 'react-localize-redux';

import { targetValue } from '../../shared/lib/forms/selectors';

const LanguageToggle = ({
    languages,
    activeLanguage,
    setActiveLanguage
}) => {
    const { i18n } = useTranslation();

    const handleChange = useCallback((code) => {
        // @migration to i18next
        i18n.changeLanguage(code);

        // @deprecated react-localize-redux
        setActiveLanguage(code);
    });

    return (
        <select
            className='lang-selector'
            name='lang'
            value={ activeLanguage && activeLanguage.code }
            onChange={targetValue(handleChange)}>
            {languages.map((lang) => (
                <option key={ lang.code } value={ lang.code }>
                    { lang.name }
                </option>
            ))}
        </select>
    );
};

export default withLocalize(LanguageToggle);
