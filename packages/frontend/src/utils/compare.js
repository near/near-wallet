export default function compare({key, order = 'asc', sortingOrder}) {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
		
        const first = (a[key].toLowerCase() in sortingOrder) ? sortingOrder[a[key]] : Number.MAX_SAFE_INTEGER;
        const second = (b[key].toLowerCase() in sortingOrder) ? sortingOrder[b[key]] : Number.MAX_SAFE_INTEGER;

        let result = 0;
        if (first < second)
            result = -1;
        else if (first > second)
            result = 1;
        return (order === 'desc') ? ~result : result;
    };
};
