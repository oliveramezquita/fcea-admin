export const getColor = (rating) => {
    const colors = ['very-good', 'good', 'average', 'bad', 'very-bad']
    return colors[rating-1]
}
export const calculatePhGrade = (ph, phReference) => {
    const magnitudes = Math.abs(ph - phReference)
    if (magnitudes <= 0.5)
        return getColor(1)
    else if (magnitudes <= 1.0)
        return getColor(2)
    else if (magnitudes <= 1.5)
        return getColor(3)
    else if (magnitudes <= 2.0)
        return getColor(4)
    else
        return getColor(5)
}

export const calculateTemperatureGrade = (temperature, temperatureReference) => {
    if (temperature < temperatureReference)
        return getColor(1)
    const ratio = temperatureReference / temperature
    if (ratio >= 0.8)
        return getColor(1)
    else if (ratio >= 0.6)
        return getColor(2)
    else if (ratio >= 0.4)
        return getColor(3)
    else if (ratio >= 0.2)
        return getColor(4)
    else
        return getColor(5)
}

export const calculateOxygenGrade = (disolvedOxygen) => {
    if (disolvedOxygen >= 6 && disolvedOxygen <= 12)
        return getColor(2)
    else if ((disolvedOxygen >= 3 && disolvedOxygen < 6) || disolvedOxygen > 12)
        return getColor(3)
    else
        return getColor(5)
    
}

export const calculateTurbidityGrade = (turbity, turbityReference) => {
    const change = turbity - turbityReference
    if (change < 5)
        return getColor(1)
    else if (change <= 10)
        return getColor(2)
    else if (change <= 15)
        return getColor(3)
    else if (change <= 20)
        return getColor(4)
    else
        return getColor(5)
}

export const calculateLakeNitratesGrade = (nitrates) => {
    if (nitrates <= 1)
        return getColor(2)
    else if (nitrates <= 10)
        return getColor(3)
    else
        return getColor(5)
}

export const getPositionsDifference = (ammonium, ammoniumReference) => {
    const scales = [0, 0.05, 0.1, 0.25, 0.5, 1.0, 1.5, 2.0]
    let referencePosition = 0
    let position = 0
    scales.forEach(value => {
        if (ammonium >= value)
            position++
        if (ammoniumReference >= value)
            referencePosition++
    })
    return position - referencePosition
}

export const calculateAmmoniumGrade = (ammonium, ammoniumReference) => {
    const positionsDifference = getPositionsDifference(ammonium, ammoniumReference)
    if (positionsDifference <= 0)
        return getColor(1)
    else if (positionsDifference <= 1)
        return getColor(2)
    else if (positionsDifference <= 2)
        return getColor(3)
    else if (positionsDifference <= 3)
        return getColor(4)
    else
        return getColor(5)
}

export const calculateOrthophosphatesGrade = (orthophosphates, orthophosphatesReference) => {
    if (orthophosphates < orthophosphatesReference)
        return getColor(1)
    const magnitudes = (orthophosphates - orthophosphatesReference) / 0.2
    if (magnitudes <= 0)
        return getColor(1)
    else if (magnitudes <= 1)
        return getColor(2)
    else if (magnitudes <= 2)
        return getColor(3)
    else if (magnitudes <= 3)
        return getColor(4)
    else
        return getColor(5)
}

export const calculateChGrade = (ch) => {
    if (ch > 100)
        return getColor(1)
    else if (ch >= 85)
        return getColor(2)
    else if (ch >= 47)
        return getColor(3)
    else if (ch >= 13)
        return getColor(4)
    else
        return getColor(5)
}

export const calculateCbrGrade = (cbr) => {
    if (cbr > 95)
        return getColor(1)
    else if (cbr >= 75)
        return getColor(2)
    else if (cbr >= 55)
        return getColor(3)
    else if (cbr >= 30)
        return getColor(4)
    else
        return getColor(5)
}

export const calculateColiformsGrade = (coliforms) => {
    return !coliforms ? getColor(1) : getColor(3)
}

export const calculateBioticGrade = (macroinvertebrateScore) => {
    if (macroinvertebrateScore >= 6.1)
        return getColor(1)
    else if (macroinvertebrateScore >= 5.1)
        return getColor(2)
    else if (macroinvertebrateScore >= 4.1)
        return getColor(3)
    else if (macroinvertebrateScore >= 3.1)
        return getColor(4)
    else
        return getColor(5)
}
