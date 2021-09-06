const generateRandomNumberInRange = ({ from, to }) => {
    const min = Math.ceil(from);
    const max = Math.floor(to);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateNUniqueRandomNumbersInRange = (range, n) => {
    const nums = new Set();
    while (nums.size !== n) {
        nums.add(generateRandomNumberInRange(range));
    }
    return [...nums];
};

module.exports = {
    generateRandomNumberInRange,
    generateNUniqueRandomNumbersInRange
}
