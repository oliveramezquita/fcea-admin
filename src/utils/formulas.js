export const getColor = (rating) => {
    const colors = ['very-good', 'good', 'average', 'bad', 'very-bad']
    return colors[rating-1]
}
export const calculatePhGrade = (ph, phReference) => {
    if (phReference == null) return null
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
    if (temperatureReference == null) return null
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
    if (turbityReference == null) return null
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

export const calculateNitratesGrade = (nitrates, nitratesReference) => {
    if (nitratesReference == null) return null
    if (nitrates < nitratesReference)
        return getColor(1)
    const magnitudes = (nitrates, nitratesReference) / 0.2
    if (magnitudes <= 0)
        return getColor(1)
    else if (magnitudes < 1)
        return getColor(2)
    else if (magnitudes < 2)
        return getColor(3)
    else if (magnitudes < 3)
        return getColor(4)
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
    if (ammoniumReference == null) return null
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
    if (orthophosphatesReference == null) return null
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


export const calculateSaturationGrade = (saturation, saturationReference) => {
    if (saturationReference == null) return null
    const change = saturation /saturationReference
    if (change >= 0.8)
        return getColor(1)
    else if (change >= 0.6)
        return getColor(2)
    else if (change >= 0.4)
        return getColor(3)
    else if (change >= 0.2)
        return getColor(4)
    else
        return getColor(5)
}

export const getScoreMessage = (grade) => {
    const message = [
        {category: 'Muy Buena', interpretation: 'El ecosistema acuático está conservado y sin contaminación. Los elementos físico-químicos, paisajísticos y biológicos no presentan alteraciones, esto permite el correcto funcionamiento de los elementos vivos y no vivos del ecosistema y la provisión de servicios ecosistémicos.'},
        {category: 'Buena', interpretation: 'Los elementos físico-químicos, paisajísticos y biológicos del ecosistema acuático no presentan alteraciones destacadas. La influencia de las actividades humanas sobre el agua y el ecosistema es moderada, lo cual permite el correcto funcionamiento de los componentes vivos y no vivos del ecosistema.'},
        {category: 'Media', interpretation: 'Los elementos físico-químicos, biológicos y paisajísticos presentan alteraciones que afectan la dinámica natural del ecosistema. El tipo e intensidad de las actividades humanas en la zona disminuyen la calidad del agua y del paisaje, ocasionando condiciones desfavorables para la vida acuática.'},
        {category: 'Mala', interpretation: 'Los elementos físico-químicos, biológicos y paisajísticos del ecosistema acuático se encuentran muy alterados. La intensidad de las actividades humanas está afectando de manera importante al ecosistema, el cual presenta una contaminación alta, un paisaje alterado y condiciones adversas para la vida acuática.'},
        {category: 'Muy Mala', interpretation: 'El ecosistema acuático está afectado drásticamente y presenta una contaminación muy alta. Los elementos físico-químicos, biológicos y paisajísticos se encuentran fuertemente alterados por la influencia humana, lo cual ha generado una ruptura en la dinámica natural del ecosistema con la consecuente disminución de la biodiversidad y pérdida de servicios ecosistémicos.'},
    ]
    return message[grade]
}

export const totalScore = (list) => {
    const colors = ['very-good', 'good', 'average', 'bad', 'very-bad']
    let total = 0
    Object.values(list).forEach(value => {
        if (value != null)
            total = total + colors.indexOf(value)
    })
    let grade = 1
    if (total > 15)
        grade = 2
    else if (total > 25)
        grade = 3
    else if (total > 35)
        grade = 4
    else if (total > 46)
        grade = 5
    return {total: total, color: getColor(grade), message: getScoreMessage(grade)}
}
