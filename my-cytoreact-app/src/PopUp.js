import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

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
    const DisplayObject = ({obj}) => {
        return (
            <div>
                {Object.entries(obj).map(([key,val]) =>
                    <p key={key}>{key}: {val}</p>
                )}
            </div>
        )
    }
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