import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

const getlanguagesList = state => state.localize.languages

function getCurrentLanguage() {
    const getlanguage = createSelector(
        getlanguagesList,
        languages => languages.find((language) => language.active)
        )
    const currentLanguage = useSelector(getlanguage)

  return currentLanguage.code
}

export default getCurrentLanguage