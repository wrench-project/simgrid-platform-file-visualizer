import { useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import FileUploadButton from './FileUpload';
import PopUp from './PopUp';

// sample data
const elements = [
    // Nodes
    // G1
    {data: {id: 'host1', eleType: 'Host', type: 'rectangle', label: 'Host 1', size: 'big', cores: '4', speed: '43.095Mf'}},
    {data: {id: 'h1c1', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 1'},style: {'background-color': 'red'}},
    {data: {id: 'h1c2', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 2'}},
    {data: {id: 'h1c3', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 3'}},
    {data: {id: 'h1c4', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 4'},style: {'background-color': 'blue'}},

    // G2
    {data: {id: 'host2', eleType: 'Host', type: 'rectangle', label: 'Host 2', cores: '2', speed: '66.195Mf'}, style: {'background-color': 'lightgreen'}},
    {data: {id: 'h2c1', eleType: 'Core', parent: 'host2', type: 'ellipse', label: 'core 1'}},
    {data: {id: 'h2c2', eleType: 'Core', parent: 'host2', type: 'ellipse', label: 'core 2'}},
    
    // G3
    {data: {id: 'connection', eleType: 'extra', type: 'diamond', label: 'connection'},style: {'background-color': 'purple'}},
    
    // G4
    {data: {id: 'disk1', eleType: 'disk', type: 'rectangle', label: 'Disk'}},

    // Edges
    {data: {id: 'disk-to-host1', eleType: 'Link', bandwidth:'44.279125MBps', latency: '59.904us', source: 'disk1', target: 'host1', label: 'link3'}},
    {data: {id: 'host1-connection', eleType: 'Link', bandwidth:'11.216125MBps', latency: '59.234us', source: 'host1', target: 'connection', label: 'Link1'}, style: {width: '10px'}},
    {data: {id: 'host2-connection', eleType: 'Link', bandwidth:'41.269325MBps', latency: '21.904us', source: 'host2', target: 'connection', label: 'Link2'}},
];

const stylesheet = [
    {
        selector: 'node',
        css: {
            'shape': 'data(type)'
        }
    },
    {
        selector: 'edge',
        css: {
            'curve-style': 'bezier',
        }
    },
    {
        selector: ':parent',
        css: {
            'text-valign': 'top',
            'text-halign': 'center',
            'label': 'data(label)'
        }
    },
    {
        selector: ':child',
        css: {
            'background-color': 'black'
        }
    },
    {
        selector: '#disk1',
        css: {
            'background-image': 'https://cdn-icons-png.flaticon.com/512/227/227889.png',
            'height': 120,
            'width': 120,
            'background-fit': 'contain',
            'background-color': '#ffffff',
            'label': 'data(label)'
        }
    },
    {
        selector: '#connection', 
        css: {
            'label': 'data(label)'
        }
    }
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
            // pan={pan}
            layout={layout}
            cy={cy => {
                cy.on("tap", (evt) => {
                    try {
                        var objTest = evt.target    // Testing purposes. Consider deleting after
                        console.log(objTest)        // Testing purposes. Consider deleting after
                        obj = evt.target.data();
                        if (obj.id !== null) {
                            handleOpen();
                        } 
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
