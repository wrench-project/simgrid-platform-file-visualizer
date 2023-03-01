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

            const childList = [];
            iterateJson(jsonDataFromXml, childList);
            console.log(childList);
        }

        function iterateJson(json, childList) {
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const value = json[key];

                    if (key === "name") {
                        if (typeof value === "object") {
                            // If the value is an object, recursively iterate through its keys
                            iterateJson(value, childList);
                        } else {
                            // Ignore DOCTYPE and --
                            if (value !== "DOCTYPE" && value !== "--" && value !== "---") {
                                const child = {
                                    name: value,
                                    attributes: json.attributes
                                };
                                childList.push(child);
                            }
                        }
                    } else if (typeof value === "object") {
                        // If the value is an object, recursively iterate through its keys
                        iterateJson(value, childList);
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