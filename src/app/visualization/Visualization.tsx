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

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("overflow", "hidden");
        
        const g = svg.append("g");

        zoomRef.current = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });
      svg.call(zoomRef.current);    

        const simulation = d3.forceSimulation<Node>(nodes) 
    .force("link", d3.forceLink<Node, Link>(links).id((d:Node) => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

    function animateLinks(
        linkSelection: d3.Selection<SVGLineElement, { source: string; target: string; status: string }, SVGGElement, unknown>
      ) {
        linkSelection
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", "10") 
          .on("end", function repeat() {
            d3.select(this as SVGLineElement) 
              .attr("stroke-dashoffset", "0") 
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attr("stroke-dashoffset", "10")
              .on("end", repeat); 
          });
      }

      const link = g.selectAll<SVGLineElement, { source: string; target: string; status: string }>(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", d => d.status === "allow" ? "green" : "red")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .each(function () {
        animateLinks(d3.select<SVGLineElement, { source: string; target: string; status: string }>(this));
      });
    

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

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "#222")
            .style("color", "#fff")
            .style("padding", "6px 10px")
            .style("border-radius", "6px")
            .style("visibility", "hidden")
            .style("pointer-events", "none");

                 
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

        simulation.on("tick", () => {
            link.attr("x1", (d: Link) => (d.source as Node).x!)
                .attr("y1", (d: Link) => (d.source as Node).y!)
                .attr("x2", (d: Link) => (d.target as Node).x!)
                .attr("y2", (d: Link) => (d.target as Node).y!);
        
            node.attr("cx", (d: Node) => d.x!)
                .attr("cy", (d: Node) => d.y!);
        });
        
        
        function drag(simulation: d3.Simulation<Node, undefined>) {
            return d3.drag<SVGCircleElement, Node>()
                .on("start", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                });
        }              

        return () => {
            tooltip.remove();
        };

    }, [nodes, links]);

    const handleZoomIn = () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(300)
            .call(zoomRef.current.scaleBy, 1.2);
        }
      };
      
      const handleZoomOut = () => {
        if (svgRef.current && zoomRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(300)
            .call(zoomRef.current.scaleBy, 0.8);
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
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div> <span>Node</span>
    </div>
</div>
        </div>);
};

export default Visualization;
