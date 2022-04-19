<<<<<<< HEAD
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const getlanguagesList = state => state.localize.languages
=======
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const getlanguagesList = (state) => state.localize.languages;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

function getCurrentLanguage() {
    const getlanguage = createSelector(
        getlanguagesList,
<<<<<<< HEAD
        languages => languages.find((language) => language.active)
        )
    const currentLanguage = useSelector(getlanguage)

  return currentLanguage.code
}

export default getCurrentLanguage
=======
        (languages) => languages.find((language) => language.active)
        );
    const currentLanguage = useSelector(getlanguage);

  return currentLanguage.code;
}

export default getCurrentLanguage;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
