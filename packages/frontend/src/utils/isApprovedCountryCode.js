import { SMS_BLACKLIST } from '../config';

const isApprovedCountryCode = (countryCode) => {
    return !SMS_BLACKLIST.includes(countryCode);
};

export default isApprovedCountryCode;
