import {useState} from "react";
import XMLParser from 'react-xml-parser';

function FileUploadButton() {
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
            console.log(jsonDataFromXml);

            const elements = [];
            iterateJson(jsonDataFromXml, elements);
            console.log(elements);
        }

        function iterateJson(json, elements) {
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const value = json[key];

                    if (key === "name") {
                        if (typeof value === "object") {
                            // If the value is an object, recursively iterate through its keys
                            iterateJson(value, elements);
                        } else {
                            // Ignore DOCTYPE and --
                            if (value !== "DOCTYPE" && value !== "--" && value !== "---") {
                                const element = {
                                    name: value,
                                    attributes: json.attributes
                                };
                                if (json.attributes.speed) {
                                    elements.push(
                                        {
                                            data: {
                                                id: json.attributes.id,
                                                name: element.name,
                                                speed: json.attributes.speed
                                            }})
                                } else if (json.attributes.latency) {
                                    elements.push(
                                        {
                                            data: {
                                                id: json.attributes.id,
                                                name: element.name,
                                                bandwidth: json.attributes.bandwidth,
                                                latency: json.attributes.latency
                                            }})
                                } else if (json.attributes.src) {
                                    elements.push(
                                        {
                                            data: {
                                                id: json.attributes.id,
                                                name: element.name,
                                                source: json.attributes.src,
                                                target: json.attributes.dst
                                            }})
                                } else {
                                    elements.push({data: {id: json.attributes.id, name: element.name}});
                                }
                            }

                        }
                    } else if (typeof value === "object") {
                        // If the value is an object, recursively iterate through its keys
                        iterateJson(value, elements);
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