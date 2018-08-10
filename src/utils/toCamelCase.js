// As all class attributes is camelCase in React
export default function() {
    return spinalCaseValue.replace(/-[a-zA-Z]/g,
        match => match[1].toUpperCase())
}