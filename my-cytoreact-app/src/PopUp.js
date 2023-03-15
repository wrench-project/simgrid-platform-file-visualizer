import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Src - https://codesandbox.io/s/766my2?file=/demo.js:546-587
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
    return (
        <div>
           <Modal open={open} onClose={close}>
                <Box sx={style}>
                    <p>{obj.id}</p>
                    <p>{obj.label}</p>
                </Box>
            </Modal> 
        </div>
    )
}