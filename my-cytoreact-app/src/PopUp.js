import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { omit } from 'lodash';
import { useState } from "react";

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
export default function PopUp({ obj, open, close, handleElements }) {
    const [editedObj, setEditedObj] = useState(obj);
    const [editing, setEditing] = useState(false);

    // Setting the edited object to its key
    const handleEdit = (key, value) => {
        setEditedObj({
            ...editedObj,
            [key]: value
        });
    };

    const handleStartEditing = () => {
        setEditing(true);
        setEditedObj(obj);
    };

    const handleCancelEditing = () => {
        setEditing(false);
        setEditedObj(obj);
    };

    // if data.id === editedObj.id, save the new value
    const handleSave = () => {
        handleElements(prevElements => {
            return prevElements.map(el => {
                if (el.data.id === editedObj.id) {
                    return {
                        ...el,
                        data: {
                            ...el.data,
                            ...editedObj
                        }
                    };
                }
                return el;
            });
        });
        close();
        setEditing(false);
    };

    // Takes node object from props, passes to const DisplayObject as attribute
    // Loops through object attribute. (Should be object data). Display in a <p> tag
    const DisplayObject = ({ obj }) => {
        const doNotShow = ['eleType', 'parent', 'type', 'shape'];
        var newObj = omit(obj, doNotShow); // Deletes keys

        // Edit ID to exclude parentHost
        // This is intended for the <disk>, but will apply to any other modified id for 'uniqueness'
        if (obj.eleType === 'disk') {
            let newStr = newObj.id;
            newStr = newStr.substr(newStr.indexOf(' ') + 1);
            newObj.id = newStr;
        }

        return (
            <div>
                {Object.entries(newObj).map(([key, val]) => (
                    <div key={key}>
                        <label htmlFor={key}>{key}: </label>
                        {key === "id" ? (
                            <span>{val}</span>
                        ) : !editing ? (
                            <span>{val}</span>
                        ) : (
                            <input
                                id={key}
                                type="text"
                                value={editedObj[key]}
                                onChange={(e) => handleEdit(key, e.target.value)}
                                autoFocus
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Modal open={open} onClose={close}>
                <Box sx={style}>
                    <h2>{obj.eleType} Information</h2>
                    <DisplayObject obj={obj} />
                    {!editing ? (
                        <button onClick={handleStartEditing}>Edit</button>
                    ) : (
                        <div>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancelEditing}>Cancel</button>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
