import { parse as parseQuery } from 'query-string'

const parseFundingOptions = (string) => {
    return JSON.parse(parseQuery(string).fundingOptions || 'null')
}

export default parseFundingOptions;