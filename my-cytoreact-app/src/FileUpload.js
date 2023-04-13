import {useState} from "react";
import XMLParser from 'react-xml-parser';
import iterateJson from "./IterateJson";

function FileUploadButton(props) {
    const [selectedFile, setSelectedFile] = useState();

    // Target file as selectedFile
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    // Read in file
    const handleSubmission = () => {
        var preParseData;
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function (e) {
            preParseData = e.target.result;
            console.log(preParseData)
            
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
            props.handlePPD(preParseData);
        }
    };

    return (
      <div>
           <input type="file" name="file" onChange={changeHandler} />
           <div>
               <button onClick={handleSubmission}>Submit</button>
           </div>
       </div>
    )
}

export default FileUploadButton;