export const generateArrayOfYears = () => {
    const max = new Date().getFullYear()
    const min = max - 10
    const years = []

    for (let i = max; i >= min; i--) {
        years.push(i)
    }
    return years
}
