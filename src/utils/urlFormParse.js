export const urlFormParse = (url) => {
    if (url) {
        const urlData = url.split('#')
        const params = splitMulti(urlData[1], ['=','&'])

        return {
            url: urlData[0],
            params: params
        }
    }
    return  {
        url: '',
        params: []
    }
}
export const splitMulti = (str, tokens) => {
    const tempChar = tokens[0];
    for(let i = 1; i < tokens.length; i++){
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str
}
