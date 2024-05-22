export const graphData = (sites, graphItem) => {
    const series = [{data: []}]
    const categories = []
    const colors = []
    
    if (sites && graphItem) {
        sites.forEach(site => {
            if (site.es_sitio_referencia) {
                categories.push(site.nombre_sitio)
                switch(graphItem.value) {
                    case 'calidad-general':
                        series[0].data.push(site.scores.total[3])
                        colors.push(site.scores.total[2])
                        break
                    case 'coliformes-totales':
                        series[0].data.push(site.scores.fecal_coliforms[0])
                        colors.push(site.scores.fecal_coliforms[1])
                        break
                    case 'caudal':
                        series[0].data.push(site.caudal)
                        colors.push('#808390')
                        break
                    default:
                        const keys = graphItem.value.split(',')
                        series[0].data.push(site[keys[0]])
                        if (site.scores[keys[1]]) 
                            colors.push(site.scores[keys[1]][1])
                        else
                            colors.push('#808390')
                        break
                }
            }  
        })
        sites.forEach(site => {
            if (!site.es_sitio_referencia) {
                categories.push(site.nombre_sitio)
                switch(graphItem.value) {
                    case 'calidad-general':
                        series[0].data.push(site.scores.total[3])
                        colors.push(site.scores.total[2])
                        break
                    case 'coliformes-totales':
                        series[0].data.push(site.scores.fecal_coliforms[0])
                        colors.push(site.scores.fecal_coliforms[1])
                        break
                    case 'caudal':
                        series[0].data.push(site.caudal)
                        colors.push('#808390')
                        break
                    default:
                        const keys = graphItem.value.split(',')
                        series[0].data.push(site[keys[0]])
                        colors.push(site.scores[keys[1]][1])
                        break
                }
            }
        })
    }
    return {
        series: series,
        categories: categories,
        colors: colors,
    }
}
