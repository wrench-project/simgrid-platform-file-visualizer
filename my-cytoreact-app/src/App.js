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
        selector: 'node[eleType="cluster_router"]',
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
        selector: '[eleType="cluster_zone"]',
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

    const dlProp = {preParseData, elements}

    return (
        <>
            <FileUploadButton handleElements={handleElements} handlePPD={handlePPD}/>
            <DownloadButton props={{dlProp}}/>
            <PopUp obj={obj} open={open} close={handleClose} handleElements={handleElements}/>
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
