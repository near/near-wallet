export default function getDateAndTime(block_timestamp) {
    return new Date(block_timestamp).toLocaleString('en-US', {dateStyle: 'short', timeStyle: 'short'})
}