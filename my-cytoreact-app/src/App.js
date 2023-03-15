import { useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import FileUploadButton from './FileUpload';
import PopUp from './PopUp';

// sample data
const elements = [
    // Nodes
    // G1
    {data: {id: 'host1', type: 'rectangle', label: 'Host 1', size: 'big'}},
    {data: {id: 'h1c1', parent: 'host1', type: 'ellipse', label: 'core 1'},style: {'background-color': 'red'}},
    {data: {id: 'h1c2', parent: 'host1', type: 'ellipse', label: 'core 2'}},
    {data: {id: 'h1c3', parent: 'host1', type: 'ellipse', label: 'core 3'}},
    {data: {id: 'h1c4', parent: 'host1', type: 'ellipse', label: 'core 4'},style: {'background-color': 'blue'}},

    // G2
    {data: {id: 'host2', type: 'rectangle', label: 'Host 2'}, style: {'background-color': 'lightgreen'}},
    {data: {id: 'h2c1', parent: 'host2', type: 'ellipse', label: 'core 1'}},
    {data: {id: 'h2c2', parent: 'host2', type: 'ellipse', label: 'core 2'}},
    
    // G3
    {data: {id: 'connection', type: 'diamond', label: ''},style: {'background-color': 'purple'}},
    
    // G4
    {data: {id: 'disk', type: 'rectangle', label: 'Disk'}},

    // Edges
    {data: {id: 'disk-to-host1', source: 'disk', target: 'host1', label: 'link3'}},
    {data: {id: 'host1-connection', source: 'host1', target: 'connection', label: 'Link1'}, style: {width: '10px'}},
    {data: {id: 'host2-connection', source: 'host2', target: 'connection', label: 'Link2'}},
];

const stylesheet = [
    {
        selector: 'node',
        css: {
            'shape': 'data(type)',
            'label': 'data(label)'
        }
    },
    {
        selector: 'edge',
        css: {
            'curve-style': 'bezier',
            'label': 'data(label)'
        }
    },
    {
        selector: ':parent',
        css: {
            'text-valign': 'top',
            'text-halign': 'center',
        }
    },
    {
        selector: ':child',
        css: {
            'background-color': 'black'
        }
    },
    {
        selector: '#disk',
        css: {
            'background-image': 'https://cdn-icons-png.flaticon.com/512/227/227889.png',
            'height': 120,
            'width': 120,
            'background-fit': 'contain',
            'background-color': '#ffffff',
        }
    },
];

const style = 
    {width: '1440px', height: '600px'};

const pan = 
    {x:725, y:300};

const layout = 
    {name: 'grid', fit: true };

var obj = {};

function App() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <FileUploadButton/>
            <PopUp obj={obj} open={open} close={handleClose}/>
            <CytoscapeComponent
            elements={elements}
            style={style}
            stylesheet={stylesheet}
            pan={pan}
            layout={layout}
            cy={cy => {
                cy.on("tap", evt => {
                    try {
                        obj = evt.target.data();
                        handleOpen();
                    } catch (error) {
                        console.log("Error; Not a node")
                    }
                    
                })
            }}
            />
        </>
    );
}

export default App;
