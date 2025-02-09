"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Node, Link } from "@/types";
import { ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  nodes: Node[];
  links: Link[];
}

const Visualization: React.FC<Props> = ({ nodes, links }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);


    useEffect(() => {
        if (!svgRef.current || !nodes.length || !links.length) return;
      
        const width = 800;
        const height = 600;

        // Clear previous SVG elements
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("overflow", "hidden");
        
        const g = svg.append("g");

        // Force simulation setup
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

       // Create link elements (edges)
const link = g.selectAll(".link")
.data(links)
.enter()
.append("line")
.attr("class", "link")
.attr("stroke", d => d.status === "allow" ? "green" : "red")
.attr("stroke-width", 2)
.attr("stroke-dasharray", "5,5") 
.each(function () {
    animateLinks(d3.select(this)); 
});

function animateLinks(linkSelection) {
linkSelection
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", "10")
    .on("end", function repeat() {
        d3.select(this)
            .attr("stroke-dashoffset", "0") // ✅ Reset position
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", "10")
            .on("end", repeat); // ✅ Loop animation
    });
}



        // Create node elements (circles)
        const node = g.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .attr("fill", "blue")
            .on("click", (_, d) => {
                setSelectedNode(d);
            }) 
            .call(drag(simulation));

        // Create tooltip div (positioned absolutely)
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#222")
            .style("color", "#fff")
            .style("padding", "6px 10px")
            .style("border-radius", "6px")
            .style("visibility", "hidden")
            .style("pointer-events", "none");

                 

        // Tooltip Event Handlers
        node.on("mouseover", (event, d) => {
            tooltip.html(`<strong>${d.id}</strong>`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`)
                .style("visibility", "visible");
        })
        .on("mousemove", (event) => {
            tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });

        // Simulation tick update
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x!)
                .attr("y1", d => d.source.y!)
                .attr("x2", d => d.target.x!)
                .attr("y2", d => d.target.y!);

            node.attr("cx", d => d.x!)
                .attr("cy", d => d.y!);
        });
        
        // Drag functionality
        function drag(simulation) {
            return d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                });
        }        

        // Cleanup on unmount
        return () => {
            tooltip.remove();
        };

    }, [nodes, links]);

    const handleZoomIn = () => {
        if (svgRef.current && zoomRef.current) {
            d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.2);
        }
    };

    const handleZoomOut = () => {
        if (svgRef.current && zoomRef.current) {
            d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.8);
        }
    };

    return (
        <div className="relative w-full h-full">

            <div className="absolute top-4 left-4 bg-gray-900 p-2 rounded-md shadow-md flex gap-2">
            <button onClick={handleZoomIn} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center justify-center">
            <ZoomIn size={20} className="text-white" />
            </button>
            <button onClick={handleZoomOut} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center justify-center">
            <ZoomOut size={20} className="text-white" />
            </button>
            </div>

            <svg ref={svgRef} className="w-full h-full"></svg>
            
            {selectedNode && (
                <div className="absolute right-4 top-20 bg-gray-800 p-4 rounded-md w-80 shadow-lg">
                    <h3 className="text-lg font-bold text-white">{selectedNode.id}</h3>
                    <p className="text-gray-400">Type: {selectedNode.group}</p>
                    <button onClick={() => setSelectedNode(null)} className="mt-2 bg-red-500 px-3 py-1 rounded">
                        Close
                    </button>
                </div>
            )}

<div className="absolute bottom-4 left-4 bg-gray-800 p-3 rounded-md text-white">
    <h3 className="font-semibold mb-2">Legend</h3>
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div> <span>Allowed Connection</span>
    </div>
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-500 rounded-full"></div> <span>Blocked Connection</span>
    </div>
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div> <span>Server</span>
    </div>
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div> <span>Firewall</span>
    </div>
</div>
        </div>);
};

export default Visualization;
