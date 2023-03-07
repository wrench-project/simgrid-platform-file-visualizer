import CytoscapeComponent from 'react-cytoscapejs';
import FileUploadButton from './FileUpload';
import popper from 'cytoscape-popper';
import cytoscape from 'cytoscape';
import "./popper.css";
import { useState } from "react";

cytoscape.use(popper);


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
                //  stylesheet={stylesheet}
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
