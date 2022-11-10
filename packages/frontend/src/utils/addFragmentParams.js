import { stringify } from 'query-string';

export function addFragmentParams(baseUrl, fragmentParams) {
    const url = new URL(baseUrl);
    url.hash = stringify(fragmentParams, { skipNull: true } );
    return url.toString();
}
