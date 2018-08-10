// parse html tag string
export default (string) => {
    return string.slice(string.indexOf('<'), string.indexOf('>') + 1)
}