import { useState } from "react";
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
    reader.onload = function(e) {
      var preParseData = e.target.result;
      parseData(preParseData);
  };

  // Parse data
  const parseData = (data) =>{
    var jsonDataFromXml = new XMLParser().parseFromString(data);
    console.log(jsonDataFromXml);
  }
};

return(
   <div>
        <input type="file" name="file" onChange={changeHandler} />
        <div>
            <button onClick={handleSubmission}>Submit</button>
        </div>
    </div>
	)
}

export default FileUploadButton;