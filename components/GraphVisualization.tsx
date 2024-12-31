'use client';

import React, { useMemo, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph").then(mod => mod.ForceGraph2D), {
  ssr: false,
});

interface GraphData {
  nodes: { id: number | string }[];
  links: { source: number | string; target: number | string }[];
}

interface GraphVisualizationProps {
  graphData: GraphData;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ graphData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 450 });

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        setGraphDimensions({
            width: window.innerWidth-96,
            height: 450
        });
    }
    const updateDimensions = () => {
      if (containerRef.current) {
        setGraphDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  if (!graphData || graphData.nodes.length === 0 || graphData.links.length === 0) {
    return <p>No graph data available</p>;
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="id"
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        linkDirectionalArrowColor={() => "white"}
        linkColor={() => "white"}
        width={graphDimensions.width}
        height={graphDimensions.height}
      />
    </div>
  );
};

export default GraphVisualization;
