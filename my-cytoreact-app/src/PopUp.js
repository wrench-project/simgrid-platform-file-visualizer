import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

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

    // // Takes node object from props, passes to const DisplayObject as attribute
    // // Loops through object attribute. (Should be object data). Display in a <p> tag
    // const DisplayObject = ({obj}) => {
    //     return (
    //         <div>
    //             {Object.entries(obj).map(([key,val]) =>
    //                 <p key={key}>{key}: {val}</p>
    //             )}
    //         </div>
    //     )
    // }

    const DisplayObject = ({obj}) => {
        switch (obj.eleType) {
            case 'Host':
                return (
                    <div>
                        <p>Tag: {obj.eleType}</p>
                        <p>ID: {obj.id}</p>
                        <p>Cores: {obj.cores}</p>
                        <p>Speed: {obj.speed}</p>
                    </div>
                )
            case 'Link': 
                return (
                    <div>
                        <p>Tag: {obj.eleType}</p>
                        <p>ID: {obj.id}</p>
                        <p>Bandwidth: {obj.bandwidth}</p>
                        <p>Latency: {obj.latency}</p>
                    </div>
                )
            case 'Core':
                return (
                    <div>
                        <p>Tag: {obj.eleType}</p>
                        <p>Parent: {obj.parent}</p>
                    </div>
                )
            default: 
            return (
                <div>
                    <p>Tag: {obj.eleType}</p>
                </div>
            )
        }
    }

    // Renders Modal, displaying node/link data attribute
    return (
        <div>
           <Modal open={open} onClose={close}>
                <Box sx={style}>
                    <h2>{obj.id} Information</h2>
                    <DisplayObject obj={obj}/>
                </Box>
            </Modal> 
        </div>
    )
}