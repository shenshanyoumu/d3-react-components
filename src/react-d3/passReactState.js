export default (obj, stateData, getState) => {
    let reactId = obj.props['data-react-d3-id']

    if (stateData[reactId] instanceof Object) {
        for (let key in stateData[reactId]) {
            if (obj.props[key]) {
                obj.props[key] = stateData[reactId][key];
            }
        }
    }

    return obj.props;
}