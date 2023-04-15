import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadButton(props) {
  const data = props.props.dlProp.preParseData
  const modData = data
  // const modData = data.substring(0, data.indexOf('<platform '))
  
  const handleClick = () => {
    console.log(typeof(modData), modData)

  }

  return (
    <IconButton onClick={handleClick}>
        <DownloadIcon/>
    </IconButton>
  )
}
