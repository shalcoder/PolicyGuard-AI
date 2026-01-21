"use client";

import React, { useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { ComplianceReport } from "@/types/policy";
import { transformReportToGraph } from "@/lib/graphUtils";

import * as THREE from "three";

// Import ForceGraph3D dynamically to avoid SSR issues with Window
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

interface ComplianceGraphProps {
    report: ComplianceReport;
}

const ComplianceGraph: React.FC<ComplianceGraphProps> = ({ report }) => {
    const fgRef = useRef<any>();
    const graphData = useMemo(() => transformReportToGraph(report), [report]);

    useEffect(() => {
        // Initial Camera Position (Slow orbit effect, stops on interaction)
        if (fgRef.current) {
            fgRef.current.cameraPosition({ x: 200, y: 50, z: 200 });

            // Add slight bloom/glow if possible via custom post-processing, 
            // but for now relying on Emissive Materials.
        }
    }, [graphData]);

    return (
        <div className="h-[600px] w-full border rounded-lg overflow-hidden relative bg-black">
            <div className="absolute top-4 left-4 z-10 bg-black/60 p-3 rounded-lg text-white text-xs border border-white/10 backdrop-blur-md shadow-xl select-none pointer-events-none">
                <h3 className="font-bold text-lg mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">System Topology</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span> Policy (Constraint)</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span> Component (Asset)</div>
                    <div className="flex items-center gap-2">
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        Risk / Violation
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10">
                <button
                    onClick={() => fgRef.current.cameraPosition({ x: 200, y: 50, z: 200 }, { x: 0, y: 0, z: 0 }, 1000)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded border border-white/20 backdrop-blur-sm transition-all"
                >
                    Reset View
                </button>
            </div>

            <ForceGraph3D
                ref={fgRef as any}
                graphData={graphData}
                nodeLabel="name"
                nodeThreeObject={(node: any) => {
                    let geometry;
                    let material;

                    if (node.group === "risk") {
                        // Red Spiky Star (Octahedron)
                        geometry = new THREE.OctahedronGeometry(node.val);
                        material = new THREE.MeshStandardMaterial({
                            color: 0xff0000,
                            emissive: 0xff0000,
                            emissiveIntensity: 0.8,
                            roughness: 0.2,
                            metalness: 0.8
                        });
                    } else if (node.group === "policy") {
                        // Blue Cube
                        geometry = new THREE.BoxGeometry(node.val, node.val, node.val);
                        material = new THREE.MeshLambertMaterial({
                            color: 0x3b82f6,
                            transparent: true,
                            opacity: 0.9
                        });
                    } else {
                        // Purple Sphere
                        geometry = new THREE.SphereGeometry(node.val);
                        material = new THREE.MeshPhongMaterial({
                            color: 0xa855f7,
                            shininess: 100
                        });
                    }
                    return new THREE.Mesh(geometry, material);
                }}
                linkColor={() => "rgba(255,255,255,0.15)"}
                linkWidth={1.5}
                backgroundColor="#000000"
                enableNodeDrag={false}
                showNavInfo={false}
                onNodeClick={(node: any) => {
                    // Fly to node on click
                    const distance = 60;
                    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
                    fgRef.current.cameraPosition(
                        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                        node, // lookAt ({ x, y, z })
                        2000  // ms transition duration
                    );
                }}
            />
        </div>
    );
};

export default ComplianceGraph;
