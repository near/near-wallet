import { parse as parseQuery } from 'query-string';

const parseFundingOptions = (queryString) => {
    return JSON.parse(parseQuery(queryString).fundingOptions || 'null');
};

export default parseFundingOptions;