import {useState} from "react";
import XMLParser from 'react-xml-parser';

function FileUploadButton(props) {
    const [selectedFile, setSelectedFile] = useState();

    // Target file as selectedFile
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    // Read in file
    const handleSubmission = () => {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function (e) {
            var preParseData = e.target.result;
            parseData(preParseData);
        };

        // Parse data
        const parseData = (data) => {
            const jsonDataFromXml = new XMLParser().parseFromString(data);

            // main item to be passed
            const elements = [];


            iterateJson(jsonDataFromXml, elements);
            console.log(elements);

            props.handleElements(elements);
        }

        function iterateJson(json, elements) {
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const value = json[key];

                    switch (key) {
                        case "name":
                            if (typeof value === "object") {
                                iterateJson(value, elements);
                            } else {
                                if (!["DOCTYPE", "--", "---", "platform"].includes(value)) {
                                    const element = {
                                        name: value,
                                        attributes: json.attributes,
                                    };
                                    switch (element.name) {
                                        case "host":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    label: json.attributes.id,
                                                    name: element.name,
                                                    speed: json.attributes.speed,
                                                    type: "rectangle",
                                                },
                                            });
                                            break;
                                        case "link":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    label: "link " + json.attributes.id,
                                                    name: element.name,
                                                    bandwidth: json.attributes.bandwidth,
                                                    latency: json.attributes.latency,
                                                    type: "rhomboid",
                                                },
                                            });
                                            break;
                                        case "router":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    name: element.name,
                                                    label: json.attributes.id,
                                                },
                                            });
                                            break;
                                        case "route":
                                            const routeSrc = json.attributes.src;
                                            const routeDst = json.attributes.dst;
                                            if (json.children.length > 1) {
                                                iterateJson(value, elements);
                                            } else if (json.children.length === 1) {
                                                const childID = json.children[0].attributes.id;
                                                // Edge from route.src - child.id
                                                elements.push({
                                                    data: {
                                                        id: `${routeSrc}-${childID}`,
                                                        label: `${routeSrc}-${childID}`,
                                                        name: element.name,
                                                        source: routeSrc,
                                                        target: childID
                                                    }
                                                })
                                                // Edge from child.id - route.src
                                                elements.push({
                                                    data: {
                                                        id: `${childID}-${routeDst}`,
                                                        label: `${childID}-${routeDst}`,
                                                        name: element.name,
                                                        source: childID,
                                                        target: routeDst
                                                    }
                                                })
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
                            }
                            break;
                        default:
                            // If the value is an object, recursively iterate through its keys
                            if (typeof value === "object") {
                                iterateJson(value, elements);
                            }
                            break;
                    }
                }
            }
        }
    };

    return (
        <div>
            <input type="file" name="file" onChange={changeHandler}/>
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    )
}

export default FileUploadButton;