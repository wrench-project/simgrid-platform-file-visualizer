import { useEffect, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import FileUploadButton from './FileUpload';
import DownloadButton from './DownloadButton';
import PopUp from './PopUp';
import { isEmpty } from 'lodash';
import backboneImage from './backbone.png';
import crossbarImage from './crossbar.png';
import topologyImage from './topology.png';
import cylinderImage from './cylinder.png';
import { Grid } from '@mui/material';

// sample data
// const elements = [
//     // Nodes
//     // G1
//     {data: {id: 'host1', eleType: 'Host', type: 'rectangle', label: 'Host 1', size: 'big', cores: '4', speed: '43.095Mf'}},
//     {data: {id: 'h1c1', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 1'},style: {'background-color': 'red'}},
//     {data: {id: 'h1c2', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 2'}},
//     {data: {id: 'h1c3', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 3'}},
//     {data: {id: 'h1c4', eleType: 'Core', parent: 'host1', type: 'ellipse', label: 'core 4'},style: {'background-color': 'blue'}},

//     // G2
//     {data: {id: 'host2', eleType: 'Host', type: 'rectangle', label: 'Host 2', cores: '2', speed: '66.195Mf'}, style: {'background-color': 'lightgreen'}},
//     {data: {id: 'h2c1', eleType: 'Core', parent: 'host2', type: 'ellipse', label: 'core 1'}},
//     {data: {id: 'h2c2', eleType: 'Core', parent: 'host2', type: 'ellipse', label: 'core 2'}},

//     // G3
//     {data: {id: 'connection', eleType: 'extra', type: 'diamond', label: 'connection'},style: {'background-color': 'purple'}},

//     // G4
//     {data: {id: 'disk1', eleType: 'disk', type: 'rectangle', label: 'Disk'}},

//     // Edges
//     {data: {id: 'disk-to-host1', eleType: 'Link', bandwidth:'44.279125MBps', latency: '59.904us', source: 'disk1', target: 'host1', label: 'link3'}},
//     {data: {id: 'host1-connection', eleType: 'Link', bandwidth:'11.216125MBps', latency: '59.234us', source: 'host1', target: 'connection', label: 'Link1'}, style: {width: '10px'}},
//     {data: {id: 'host2-connection', eleType: 'Link', bandwidth:'41.269325MBps', latency: '21.904us', source: 'host2', target: 'connection', label: 'Link2'}},
// ];

const stylesheet = [
    {
        selector: 'node[eleType="platform"]',
        css: {
            'display': 'none',
            'visibility': 'hidden'
        }
    },
    {
        selector: 'node[eleType="host"]',
        css: {
            'shape': 'data(shape)',
            'label': 'data(label)',
            'background-color': '#161a50',
        }
    },
    {
        selector: 'node[eleType="router"]',
        css: {
            'shape': 'data(shape)',
            'label': 'data(label)',
            'background-color': '#8a0202',
        }
    },
    {
        selector: 'node[eleType="link"]',
        css: {
            'shape': 'data(shape)',
            'label': 'data(label)',
            'background-color': '#9f007f',
        }
    },
    {
        selector: '[eleType="link_ctn"]',
        css: {
            'curve-style': 'bezier',
            'width': 1,
            // 'line-color' : 'black',
            // 'label': 'data(label)'
        }
    },
    {
        selector: '[eleType="zone"]',
        css: {
            'label': 'data(label)',
        }
    },
    {
        selector: '[eleType="disk"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${cylinderImage})`,
            'background-color': '#161a50',
            'height': 30,
            'width': 30,
            'background-fit': 'contain',
        }
    },
    {
        selector: '[eleType="cluster"][cluster_type="backbone"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${backboneImage})`,
            'background-color': 'white',
            'height': 80,
            'width': 80,
            'background-fit': 'contain',
        }
    },
    {
        selector: '[eleType="cluster"][cluster_type="crossbar"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${crossbarImage})`,
            'background-color': 'white',
            'height': 80,
            'width': 80,
            'background-fit': 'contain',
        }
    },
    {
        selector: '[eleType="cluster"][cluster_type="topology"]',
        css: {
            'shape': 'rectangle',
            'background-image': `url(${topologyImage})`,
            'background-color': 'white',
            'height': 80,
            'width': 80,
            'background-fit': 'contain',
        }
    },
];

const style = {
    width: '1440px', 
    height: '650px', 
    margin: 'auto', 
    backgroundColor: "lightgray"
};

const pan = {
    x: 725, 
    y: 300
};

const layout = {
    name: 'cose',
    refresh: 0,
    fit: true,
    animate: false
};

var obj = {};

function App() {
    // Modal Handles
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Element Handles
    const [elements, setElements] = useState([]);
    const handleElements = (newElements) => {
        setElements(newElements);
    }

    // Handle file content
    const [preParseData, setPreParseData] = useState();
    const handlePPD = (data) => {
        setPreParseData(data);
    }


    // Ensures layout do not rerender when clicking on nodes
    const cyRef = useRef(null);
    const runLayout = (cy) => {
        cy.layout(layout).run();
    };
    useEffect(() => {
        if (cyRef.current) {
            runLayout(cyRef.current);
        }
    }, [elements]);

    return (
        <>
            <Grid container style={{ backgroundColor: "lightgray" }}>
                <Grid item xs={6}>
                    <FileUploadButton handleElements={handleElements}/>
                </Grid>
                <Grid item xs={6}>
                    <DownloadButton/>
                </Grid>
            </Grid>
            <PopUp obj={obj} open={open} close={handleClose}/>
            <CytoscapeComponent
                elements={elements}
                style={style}
                stylesheet={stylesheet}
                pan={pan}
                cy={cy => {
                    cyRef.current = cy;
                    cy.on("tap", evt => {
                        try {
                            obj = evt.target.data();
                            if (!(isEmpty(obj))) {
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
