export const keyBy = (arr, key) => {
    return arr.reduce((acc, current) => {
        acc[current[key]] = current;
        return acc;
    }, {});
}
