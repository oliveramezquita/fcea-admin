import drought1 from '@images/seasons/drought1.jpeg'
import largeDrought1 from '@images/seasons/drought1_lg.jpeg'
import drought2 from '@images/seasons/drought2.jpeg'
import largeDrought2 from '@images/seasons/drought2_lg.jpeg'
import drought3 from '@images/seasons/drought3.jpg'
import largeDrought3 from '@images/seasons/drought3_lg.jpeg'
import rain1 from '@images/seasons/rain1.jpeg'
import largeRain1 from '@images/seasons/rain1_lg.jpeg'
import rain2 from '@images/seasons/rain2.jpeg'
import largeRain2 from '@images/seasons/rain2_lg.jpeg'
import rain3 from '@images/seasons/rain3.jpeg'
import largeRain3 from '@images/seasons/rain3_lg.jpeg'

export const setBackgroundSeason = (season, size=null) => {
    const rainList = [rain1, rain2, rain3]
    const droughtList = [drought1, drought2, drought3]
    const largeRainList = [largeRain1, largeRain2, largeRain3]
    const largeDroughtList = [largeDrought1, largeDrought2, largeDrought3]
    const rndInt = Math.floor(Math.random() * 3)
    if (size === 'large')
        return season === 'Lluvias' ? largeRainList[rndInt] : largeDroughtList[rndInt]
    else
        return season === 'Lluvias' ? rainList[rndInt] : droughtList[rndInt]
}
