import React from "react";
import { withLocalize } from "react-localize-redux";

const LanguageToggle = ({languages, activeLanguage, setActiveLanguage}) => {
    const getClass = (languageCode) => {
      return languageCode === activeLanguage.code ? 'active' : ''
    };
  
    return (
        <select className="lang-selector" name="lang" onChange={(e) => setActiveLanguage(e.target.value)}>
            {languages.map(lang => 
                <option key={ lang.code } value={ lang.code }>
                    { lang.name }       
                </option>
            )}
        </select>
    );
};

export default withLocalize(LanguageToggle);