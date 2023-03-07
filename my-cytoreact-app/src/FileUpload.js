import {useState} from "react";
import XMLParser from 'react-xml-parser';

function FileUploadButton(props) {
    const [selectedFile, setSelectedFile] = useState();
    const [elementsGraph, setElementsGraph] = useState();

    const handleElementsGraph = (newElementsGraph) => {
        setElementsGraph(newElementsGraph);
        console.log(elementsGraph);
    }

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
            console.log(jsonDataFromXml);

            // main item to be passed
            const elements = [];
            iterateJson(jsonDataFromXml, elements);
            console.log(elements);

            props.handleElements(elements);
            handleElementsGraph(elements);
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
                                        children: [],
                                    };
                                    switch (element.name) {
                                        case "host":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    label: element.name,
                                                    name: element.name,
                                                    speed: json.attributes.speed,
                                                    type: "rectangle",
                                                },
                                            });
                                            break;
                                        case "route":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    label: "link",
                                                    name: "link",
                                                    source: json.attributes.src,
                                                    target: json.attributes.dst,
                                                },
                                            });
                                            break;
                                        default:
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    name: element.name,
                                                    label: element.name,
                                                    bandwidth: json.attributes.bandwidth,
                                                    latency: json.attributes.latency,
                                                },
                                            });
                                            break;
                                    }}}
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