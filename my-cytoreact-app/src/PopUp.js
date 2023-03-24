import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { omit } from 'lodash'

// Box style
// Src and demo - https://codesandbox.io/s/766my2?file=/demo.js:546-587
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


// Takes in a node object, open state and close state from app.js
export default function PopUp({ obj, open, close }) {

    // Takes node object from props, passes to const DisplayObject as attribute
    // Loops through object attribute. (Should be object data). Display in a <p> tag

    const DisplayObject = ({obj}) => {
        const doNotShow = ['label', 'eleType', 'parent', 'type']
        var newObj = omit(obj, doNotShow); // Deletes keys
        console.log(newObj)
        console.log(obj)
        return (
            <div>
                {Object.entries(newObj).map(([key,val]) =>
                    <p>{key}: {val}</p>
                )}
            </div>
        )
    }

    // const DisplayObject = ({obj}) => {
    //     switch (obj.eleType) {
    //         case 'host':
    //             return (
    //                 <div>
    //                     <p>Tag: {obj.eleType}</p>
    //                     <p>ID: {obj.id}</p>
    //                     <p>Cores: {obj.cores}</p>
    //                     <p>Speed: {obj.speed}</p>
    //                 </div>
    //             )
    //         case 'link': 
    //             return (
    //                 <div>
    //                     <p>Tag: {obj.eleType}</p>
    //                     <p>ID: {obj.id}</p>
    //                     <p>Bandwidth: {obj.bandwidth}</p>
    //                     <p>Latency: {obj.latency}</p>
    //                 </div>
    //             )
    //         case 'route':
    //             return (
    //                 <div>
    //                     <p>Tag: {obj.eleType}</p>
    //                     <p>Source: {obj.source}</p>
    //                     <p>Destination: {obj.target}</p>
    //                 </div>
    //             )
    //         case 'router':
    //             return (
    //                 <div>
    //                     <p>Tag: {obj.eleType}</p>
    //                     <p>ID: {obj.id}</p>
    //                     <p>Coordinates: {obj.coordinates}</p>
    //                 </div>
    //             )
    //         case 'zone':
    //             return (
    //                 <div>
    //                     <p>Tag: {obj.eleType}</p>
    //                     <p>ID: {obj.id}</p>
    //                     <p>Routing: {obj.routing}</p>
    //                 </div>
    //             )                
    //         case 'core':
    //             return (
    //                 <div>
    //                     <p>Tag: {obj.eleType}</p>
    //                     <p>Parent: {obj.parent}</p>
    //                 </div>
    //             )
    //         default: 
    //         return (
    //             <div>
    //                 <p>Tag: {obj.eleType}</p>
    //             </div>
    //         )
    //     }
    // }

    // Renders Modal, displaying node/link data attribute
    return (
        <div>
           <Modal open={open} onClose={close}>
                <Box sx={style}>
                    <h2>{obj.eleType} {obj.id} Information</h2>
                    <DisplayObject obj={obj}/>
                </Box>
            </Modal> 
        </div>
    )
}