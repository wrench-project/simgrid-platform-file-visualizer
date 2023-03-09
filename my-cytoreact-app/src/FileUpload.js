import {useState} from "react";
import XMLParser from 'react-xml-parser';

function FileUploadButton(props) {
    const [selectedFile, setSelectedFile] = useState();
    const [elementsGraph, setElementsGraph] = useState();

    // const handleElementsGraph = (newElementsGraph) => {
    //     setElementsGraph(newElementsGraph);
    //     console.log(elementsGraph);
    // }

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
            const elementsData = [];
            iterateJson(jsonDataFromXml, elements, elementsData);
            console.log(elementsData);
            console.log(elements);

            props.handleElements(elements);
        }

        function iterateJson(json, elements, elementsData) {
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const value = json[key];

                    switch (key) {
                        case "name":
                            if (typeof value === "object") {
                                iterateJson(value, elements, elementsData);
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
                                            elementsData.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    label: json.attributes.id,
                                                    name: element.name,
                                                    bandwidth: json.attributes.bandwidth,
                                                    latency: json.attributes.latency,
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
                                            })
                                        case "route":
                                            if (json.children && json.children.length === 1) {
                                                elements.push({
                                                    data: {
                                                        id: json.attributes.id,
                                                        label: json.attributes.id,
                                                        name: element.name,
                                                        source: json.attributes.src,
                                                        target: json.attributes.dst,
                                                    },
                                                });
                                            } else {
                                                elementsData.push({
                                                    data: {
                                                        id: json.attributes.id,
                                                        label: json.attributes.id,
                                                        name: element.name,
                                                    }
                                                });
                                            }
                                            break;
                                        default:
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    name: element.name,
                                                    label: element.name,
                                                },
                                            });
                                            break;
                                    }
                                }
                            }
                            break;
                        default:
                            // If the value is an object, recursively iterate through its keys
                            if (typeof value === "object") {
                                iterateJson(value, elements, elementsData);
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