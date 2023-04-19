import {IconButton} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {omit} from 'lodash';

export default function DownloadButton(props) {

    // @data = Content of original file from beggining to line BEFORE <platform version='xx.xx'>
    // @eleArr = Array of element defined by author for cytoscape
    // const data = props.props.dlProp.preParseData
    // const modData = data.substring(0, data.indexOf('<platform '))
    const eleArr = props.props.dlProp.elements

    const handleClick = () => {
        const newArr = cleanArr(eleArr);
        const xmlStr = toXml(newArr);
        const blob = new Blob([xmlStr], {type: 'text/xml'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'elements.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    function toXml(arr) {
        const doc = document.implementation.createDocument(null, "platform", null);
        const platformNode = doc.documentElement;
        platformNode.setAttribute("version", "4.1");


        // need to add more attributes including disk, router, ...
        arr.forEach((element) => {
            if (element.data.eleType === "zone") {
                const zoneNode = doc.createElement("zone");
                const data = element.data;
                zoneNode.setAttribute("id", data.id);
                zoneNode.setAttribute("routing", data.routing);

                // Add hosts
                arr.forEach((host) => {
                    if (host.data.eleType === "host" && host.data.parent === data.id) {
                        const hostNode = doc.createElement("host");
                        hostNode.setAttribute("id", host.data.id);
                        hostNode.setAttribute("speed", host.data.speed);
                        zoneNode.appendChild(hostNode);
                    }
                });

                // Add links
                arr.forEach((link) => {
                    if (link.data.eleType === "link" && link.data.parent === data.id) {
                        const linkNode = doc.createElement("link");
                        linkNode.setAttribute("id", link.data.id);
                        linkNode.setAttribute("bandwidth", link.data.bandwidth);
                        linkNode.setAttribute("latency", link.data.latency);
                        zoneNode.appendChild(linkNode);
                    }
                });

                // Add routes
                const routes = new Map();
                arr.forEach((route) => {
                    if (route.data.eleType === "link_ctn" && route.data.path === "route" && route.data.source !== undefined && route.data.target !== undefined) {
                        const src = route.data.source;
                        const dst = route.data.target;
                        const id = src + " -> " + dst;
                        if (!routes.has(id)) {
                            routes.set(id, {
                                src: src,
                                dst: dst,
                                linkCtns: []
                            });
                        }
                        routes.get(id).linkCtns.push(route.data.id);
                    }
                });

                routes.forEach((route) => {
                    const routeNode = doc.createElement("route");
                    routeNode.setAttribute("src", route.src);
                    routeNode.setAttribute("dst", route.dst);
                    route.linkCtns.forEach((linkCtnId) => {
                        const linkCtnNode = doc.createElement("link_ctn");
                        linkCtnNode.setAttribute("id", linkCtnId);
                        routeNode.appendChild(linkCtnNode);
                    });
                    zoneNode.appendChild(routeNode);
                });

                platformNode.appendChild(zoneNode);
            }
        });

        return new XMLSerializer().serializeToString(doc);
    }







    return (
        <IconButton onClick={handleClick}>
            <DownloadIcon/>
        </IconButton>
    )
}

// Function that takes an array and removes object attributes
function cleanArr(arr) {
    const delAttribute = ['label', 'shape', 'host']
    const delEleType = ['cluster_router', 'cluster_edge', 'cluster_zone']
    const newArr = [];
    arr.forEach(element => {
        let data = element.data
        omit(element.data, delAttribute)                     // Takes out attributes not found in original XML file
        if (!(delEleType.includes(data.eleType))) {  // Takes out items not found in original XML file
            newArr.push(element)
        }
    });

    return newArr;
}