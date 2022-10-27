import CONFIG from '../config';

const isApprovedCountryCode = (countryCode) => {
    return !CONFIG.SMS_BLACKLIST.includes(countryCode);
};

export default isApprovedCountryCode;
