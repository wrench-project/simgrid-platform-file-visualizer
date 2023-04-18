import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { omit } from 'lodash';

export default function DownloadButton(props) {

  // @data = Content of original file from beggining to line BEFORE <platform version='xx.xx'>
  // @eleArr = Array of element defined by author for cytoscape
  // const data = props.props.dlProp.preParseData
  // const modData = data.substring(0, data.indexOf('<platform '))
  const eleArr = props.props.dlProp.elements
  
  const handleClick = () => {
    console.log(eleArr)
    let newArr = cleanArr(eleArr)
    console.log(newArr)
  }

  return (
    <IconButton onClick={handleClick}>
        <DownloadIcon/>
    </IconButton>
  )
}

// Function that takes an array and removes object attributes
function cleanArr(arr) {
  const delAttribute = ['label', 'shape', 'host']
  const delEleType = ['cluster_router', 'cluster_edge', 'cluster_zone']
  const newArr = [];
  arr.forEach(element => {
    let data = element.data
    omit(element.data, delAttribute)                     // Takes out attributes not found in original XML file 
    if (!(delEleType.includes(data.eleType))) {  // Takes out items not found in original XML file
      newArr.push(element)
    }
  });

  return newArr;
}