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
        }
    }, [graphData]);

    // Helper to create text sprites
    const createTextSprite = (text: string, color: string = 'white') => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const fontSize = 24; // Resolution of text
        if (!context) return new THREE.Object3D();

        // Calculate text width to adjust canvas size
        context.font = `Bold ${fontSize}px Sans-Serif`;
        const metrics = context.measureText(text);
        const textWidth = metrics.width;

        canvas.width = textWidth + 20; // Padding
        canvas.height = fontSize + 20;

        // Re-apply font after resize
        context.font = `Bold ${fontSize}px Sans-Serif`;
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Add a slight shadow for readability
        context.shadowColor = 'rgba(0,0,0,0.8)';
        context.shadowBlur = 4;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;

        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);

        // Scale sprite to be readable in 3D space
        // Aspect ratio * generic scale factor
        const scaleFactor = 10;
        sprite.scale.set((canvas.width / canvas.height) * scaleFactor, scaleFactor, 1);
        sprite.position.y = -12; // Position below node

        return sprite;
    };

    return (
        <div className="h-[600px] w-full border rounded-lg overflow-hidden relative bg-black group">
            {/* Legend / Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-black/60 p-3 rounded-lg text-white text-xs border border-white/10 backdrop-blur-md shadow-xl select-none pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-100">
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

            {/* Controls Info */}
            <div className="absolute bottom-4 left-4 z-10 text-[10px] text-gray-500 pointer-events-none bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                Left Click: Rotate | Right Click: Pan | Scroll: Zoom | Drag Nodes: Move
            </div>

            <div className="absolute bottom-4 right-4 z-10">
                <button
                    onClick={() => fgRef.current?.cameraPosition({ x: 200, y: 50, z: 200 }, { x: 0, y: 0, z: 0 }, 1000)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded border border-white/20 backdrop-blur-sm transition-all"
                >
                    Reset View
                </button>
            </div>

            <ForceGraph3D
                ref={fgRef as any}
                graphData={graphData}
                nodeLabel="desc" // Show description on hover instead of name
                nodeThreeObject={(node: any) => {
                    const group = new THREE.Group();
                    let geometry;
                    let material;
                    let labelColor = 'white';

                    // 1. Create Shape
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
                        labelColor = '#ff8888';
                    } else if (node.group === "policy") {
                        // Blue Cube
                        geometry = new THREE.BoxGeometry(node.val, node.val, node.val);
                        material = new THREE.MeshLambertMaterial({
                            color: 0x3b82f6,
                            transparent: true,
                            opacity: 0.9
                        });
                        labelColor = '#88ccff';
                    } else {
                        // Purple Sphere
                        geometry = new THREE.SphereGeometry(node.val);
                        material = new THREE.MeshPhongMaterial({
                            color: 0xa855f7,
                            shininess: 100
                        });
                        labelColor = '#d8b4fe';
                    }
                    const mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);

                    // 2. Create Label
                    const label = createTextSprite(node.name, labelColor);
                    group.add(label);

                    return group;
                }}
                linkColor={() => "rgba(255,255,255,0.15)"}
                linkWidth={1.5}
                backgroundColor="#000000"
                enableNodeDrag={true} // Enable dragging
                showNavInfo={false}
                onNodeClick={(node: any) => {
                    // Fly to node on click
                    const distance = 80;
                    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
                    fgRef.current.cameraPosition(
                        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                        node, // lookAt ({ x, y, z })
                        2000  // ms transition duration
                    );
                }}
                // Physics tweaks for better stability
                cooldownTicks={100}
                d3VelocityDecay={0.1}
            />
        </div>
    );
};

export default ComplianceGraph;
