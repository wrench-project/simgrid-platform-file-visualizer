export default function iterateJson(json, elements, parentZone, parentHost) {
    // defData - Properties/Attributes of object
    // cytoData - Data for Cytoscape/Popup to render
    // propData - Unique user defined data that user implement in XML file (<prop> tag)
    // otherData - Properties/Attributes of object that WAS NOT Explicitly defined, but SHOULD HAVE default value.
        // Ex. <host> tags MIGHT not have cores defined, but default is 1 core.
    // mergeData - Combined all data above. This data is to be passed in the elements array
    var defData, cytoData, mergeData, otherData, propData

    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const value = json[key];

            switch (key) {
                case "name":
                    if (!["DOCTYPE", "--", "---", "platform"].includes(value)) {
                        const element = {
                            name: value,
                            attributes: json.attributes,
                        };
                        switch (element.name) {
                            case "zone":
                                // Variables
                                defData = json.attributes
                                cytoData = {
                                    label: json.attributes.id,
                                    eleType: element.name,
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}
                                parentZone = json.attributes.id;
                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;
                            case "host":
                                // Variables
                                defData = json.attributes
                                cytoData = {
                                    label: json.attributes.id,
                                    eleType: element.name,
                                    parent: parentZone,
                                    shape: "rectangle",
                                }
                                otherData = {core: getCores(json.attributes.core)}
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...otherData, ...propData}
                                parentHost = json.attributes.id
                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;
                            case "disk":
                                // Variables
                                defData = json.attributes
                                cytoData = {
                                    id: parentHost + " " + json.attributes.id,
                                    parent: parentHost,
                                    host: parentHost,
                                    eleType: element.name,
                                    label: json.attributes.id,
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}
                                // Push
                                elements.push({
                                    data: mergeData,
                                });
                                break;
                            case "link":
                                // Variable
                                defData = json.attributes
                                cytoData = {
                                    label: json.attributes.id,
                                    eleType: element.name,
                                    parent: parentZone,
                                    shape: "rhomboid",
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}
                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;
                            case "router":
                                // Variable
                                defData = json.attributes
                                cytoData = {
                                    eleType: element.name,
                                    label: json.attributes.id,
                                    parent: parentZone,
                                    shape: "diamond",
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}
                                // Push
                                elements.push({
                                    data: mergeData
                                });
                                break;
                            case "cluster": 
                                // Variable
                                defData = json.attributes
                                cytoData = {
                                    eleType: element.name,
                                    cluster_type: getClusterType(json.attributes),
                                    label: json.attributes.id,
                                    parent: parentZone,
                                    host: parentZone,
                                }
                                propData = getProp(json.children)
                                mergeData = {...defData, ...cytoData, ...propData}
                                elements.push({
                                    data: mergeData
                                });
                                break;
                            // Edges
                            case "route":
                                if (json.children && json.children.length > 1) {
                                    // Connect the source to the first child
                                    const source = json.attributes.src;
                                    const target = json.children[0].attributes.id;
                                    elements.push({
                                        data: {
                                            id: `${source}-${target}`,
                                            label: `${source} to ${target}`,
                                            eleType: element.name,
                                            // parent: parent,
                                            source: source,
                                            target: target,
                                        },
                                    });

                                    // Connect each child to the next child
                                    for (let i = 0; i < json.children.length - 1; i++) {
                                        const sourceId = json.children[i].attributes.id;
                                        const targetId = json.children[i + 1].attributes.id;
                                        if (sourceId && targetId) {
                                            elements.push({
                                                data: {
                                                    id: `${sourceId}-${targetId}`,
                                                    label: `${sourceId} to ${targetId}`,
                                                    eleType: element.name,
                                                    // parent: parent,
                                                    source: sourceId,
                                                    target: targetId,
                                                },
                                            });
                                        }
                                    }

                                    // Connect the last child to the destination
                                    const lastChild = json.children[json.children.length - 1];
                                    const lastChildId = lastChild.attributes.id;
                                    if (lastChildId && json.attributes.dst) {
                                        elements.push({
                                            data: {
                                                id: `${lastChildId}-${json.attributes.dst}`,
                                                label: `${lastChildId} to ${json.attributes.dst}`,
                                                eleType: element.name,
                                                // parent: parent,
                                                source: lastChildId,
                                                target: json.attributes.dst,
                                            },
                                        });
                                    }
                                } else if (json.children && json.children.length === 1) {
                                    // If there's only one child, connect the source to the child and the child to the destination
                                    const source = json.attributes.src;
                                    const target = json.children[0].attributes.id;
                                    if (source && target) {
                                        elements.push({
                                            data: {
                                                id: `${source}-${target}`,
                                                label: `${source} to ${target}`,
                                                eleType: element.name,
                                                // parent: parent,
                                                source: source,
                                                target: target,
                                            },
                                        });
                                    }
                                    const child = json.children[0];
                                    const childId = child.attributes.id;
                                    if (childId && json.attributes.dst) {
                                        elements.push({
                                            data: {
                                                id: `${childId}-${json.attributes.dst}`,
                                                label: `${childId} to ${json.attributes.dst}`,
                                                eleType: element.name,
                                                // parent: parent,
                                                source: childId,
                                                target: json.attributes.dst,
                                            },
                                        });
                                    }
                                } else {
                                    // If there are no children, connect the source to the destination
                                    const source = json.attributes.src;
                                    const target = json.attributes.dst;
                                    if (source && target) {
                                        elements.push({
                                            data: {
                                                id: `${source}-${target}`,
                                                label: `${source} to ${target}`,
                                                eleType: element.name,
                                                // parent: parent,
                                                source: source,
                                                target: target,
                                            },
                                        });
                                    }
                                }
                                break;
                            default:
                                // elements.push({
                                //     data: {
                                //         id: json.attributes.id,
                                //         name: element.name,
                                //         label: element.name,
                                //     },
                                // });
                                break;
                        }
                    }
                    break;
                default:
                    // If the value is an object, recursively iterate through its keys
                    if (typeof value === "object") {
                        iterateJson(value, elements, parentZone, parentHost);
                    }
                    break;
            }
        }
    }
}

const getCores = (core) => {
    if (core > 1) {
        return core
    } else {
        return 1
    }
}

function getProp(children) {
    let props = {}
    children.forEach(child => {
        // check the child name
        if (child.name === "prop") {
            // id: value
            props[child.attributes.id] = child.attributes.value
        }
    })
    return props
}

// @data = obj.attributes
function getClusterType(data) {
    let bb_bw = data.hasOwnProperty('bb_bw')
    let bb_lat = data.hasOwnProperty('bb_lat')
    let top = data.hasOwnProperty('topology')

    if (bb_bw && bb_lat && !top) {
        return 'backbone'
    } else if (!bb_bw && !bb_lat && !top) {
        return 'crossbar'
    } else if (top) {
        return 'topology'
    }
}