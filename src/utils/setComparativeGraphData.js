export const cgvOverallQuality = sites => {
    const title = 'Calidad General'
    const series = [{data: []}]
    const categories = []
    const colors = ['#808390']
    sites.forEach(site => {
        if (site.es_sitio_referencia) {
            series[0].data.push(site.scores.total[3])
            categories.push(site.nombre_sitio)
        }  
    })
    sites.forEach(site => {
        if (!site.es_sitio_referencia) {
            series[0].data.push(site.scores.total[3])
            categories.push(site.nombre_sitio)
            colors.push(site.scores.total[2])
        }
    })
    return {
        title: title,
        series: series,
        categories: categories,
        colors: colors,
    }
}
