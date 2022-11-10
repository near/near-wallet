export const formatCreatedAt = (date) =>
    new Date(date).toDateString().replace(/^\S+\s/,'');
