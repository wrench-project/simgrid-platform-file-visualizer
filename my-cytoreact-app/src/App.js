import CytoscapeComponent from 'react-cytoscapejs';
import FileUploadButton from './FileUpload';
import popper from 'cytoscape-popper';
import cytoscape from 'cytoscape';
import "./popper.css";
import data from './data.json';
import {useState} from "react";

cytoscape.use(popper);

const stylesheet = [
    {
        selector: 'node',
        css: {
            'shape': 'data(type)',
            'label': 'data(label)'
        }
    },
    {
        selector: ':parent',
        css: {
            'text-valign': 'top',
            'text-halign': 'center',
            'padding': '60px',
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

const handleClick = () => {
    console.log("I've been clicked")
}



function App() {
    const [elements, setElements] = useState([]);
    const handleElements = (newElements) => {
        setElements(newElements);
    }
    return (
        <>
            <FileUploadButton handleElements={handleElements}/>
            <CytoscapeComponent
                elements={elements}
                style={{width: '1800px', height: '1800px'}}
                stylesheet={stylesheet}
                cy={cy => {
                    cy.on("tap", "node", evt => {
                        var node = evt.target;
                        console.log("event", evt);
                        console.log("target", node.data());
                    })
                    cy.elements().unbind("mouseover");
                    cy.elements().bind("mouseover", (event) => {
                        event.target.popperRefObj = event.target.popper({
                            content: () => {
                                let content = document.createElement("div");

                                if (event.target.data("type") === "rectangle") {
                                    content.classList.add("popper-div");
                                    content.innerHTML = event.target.data().speed;
                                } else if (event.target.data("type") !== "rectangle") {
                                    content.classList.add("popper-div");
                                    content.innerHTML = event.target.data().name;
                                }
                                document.body.appendChild(content);
                                return content;
                            },
                        });
                    });

                    cy.elements().unbind("mouseout");
                    cy.elements().bind("mouseout", (event) => {
                        if (event.target.popper) {
                            event.target.popperRefObj.state.elements.popper.remove();
                            event.target.popperRefObj.destroy();
                        }
                    });
                }}
            />
        </>);
}

export default App;
