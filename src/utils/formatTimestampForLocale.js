import getUserLocale from './getUserLocale';

export default function formatTimestampForLocale(block_timestamp) {
    const userLocale = getUserLocale();
    return new Date(block_timestamp).toLocaleString(userLocale, {dateStyle: 'short', timeStyle: 'short'});
}