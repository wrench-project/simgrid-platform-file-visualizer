import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { isUndefined } from 'lodash';

export default function DownloadButton(props) {

  // @data = Content of original file from beggining to line BEFORE <platform version='xx.xx'>
  // @eleArr = Array of element defined by author for cytoscape
  // const data = props.props.dlProp.preParseData
  // const modData = data.substring(0, data.indexOf('<platform '))
  const eleArr = props.props.dlProp.elements
  
  const handleClick = () => {
    console.log(eleArr)
    modifyArr(eleArr)
  }

  return (
    <IconButton onClick={handleClick}>
        <DownloadIcon/>
    </IconButton>
  )
}

// Function that takes an array and removes certain object
function modifyArr(arr) {
  const delEleType = ['cluster_router', 'cluster_edge', 'cluster_zone']
  const newArr = [];
  arr.forEach(element => {
    const data = element.data                // Takes out attributes not found in original XML file 
    if (!(delEleType.includes(data.eleType))) {  // Takes out items not found in original XML file
      newArr.push(element)
    }
  });

  parseArr(newArr)
}

function parseArr(arr) {
  let str = ''
  var currentParent
  const plat = arr[0].data

  const getData = () => {
    let mainStr = ''
    for (var i = 1; i < arr.length; i++) {
      const object = arr[i].data
      if (isUndefined(object.parent)) {
        mainStr += `<${object.eleType}>\n</${object.eleType}`
      } else {
        mainStr += `<${object.eleType}>\n${getData()}\n</${object.eleType}`
      }
    }
    return mainStr
  }

  str += `<${plat.eleType} version="${plat.version}">\n${getData()}\n</${plat.eleType}>`

  console.log(arr)
  console.log(str)
}

// str += `<${data.eleType}>\n</${data.eleType}>\n`