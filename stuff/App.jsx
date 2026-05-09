import {React, useCallback, useEffect, useRef, useState, useMemo, memo} from 'react'
import {reconnectEdge, addEdge, useEdgesState,
	Position, ReactFlow, MarkerType, ReactFlowProvider, useReactFlow, useViewport,
	applyNodeChanges, useNodesState, 
	Panel, Background, BackgroundVariant,
	ConnectionMode} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CircleNode from './CircleNode'
import Origin from './Origin'
import RectangularNode from './RectangularNode'
import {TextEdge, RegEdge} from './TextEdge'
import Text from './TextNode.jsx'
import {DropdownButton, ImportButton, ExportButton} from './TopButtons'
import {Recipes, Oven} from './Nodes'
import {ConnectionBuilder} from './EventHandlers'
import {Settings, Main} from './Layout'
import {LanguageObj, LanguageWords} from './Languages'

const nodeTypes = {circleNode: CircleNode, origin: Origin, RectNode: RectangularNode, text: Text}
const edgeTypes = {textEdge: TextEdge, reg: RegEdge};

const node = [
	{
		id: "og",
		position: {x:0, y:0},
		data: {label:""},
		type: "origin",
		// only false for origin cursor. it should only move on click on pane, includes connecting edges.
		draggable: false
	}
];

const edge = [];
const language = LanguageObj(LanguageWords, window.localStorage.getItem("lang"));

const Inner = memo(({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange, actionBuffer}) =>{
	const handlesCheck = useRef([ ["bottom", "bottom", "top"], ["top", "bottom", "top"]
	, ["right", "right", "left"] , ["left", "right", "left"]]);
	let pos = useRef({x:50, y:50});

	const edgeReconnect = useRef(true);
	const edgeType = useRef("reg");
	const reactFlow = useReactFlow();

	const getAllPropertyNames = () => {
		var names = [];
		var style = getComputedStyle(document.documentElement);
		for (var i = 0; i < style.length; i++) {
			var name = style[i];
			if (!name.startsWith('--')) {
				names.push(name);
			}
		}

		return names;
	}

	const result = useMemo(() => getAllPropertyNames());

	const DropButton = useMemo(() => (new DropdownButton()));
	const ImportButt = useMemo(() => (new ImportButton(DropButton, true, 1, language)));
	const ExportButt = useMemo(() => (new ExportButton(DropButton, reactFlow, node, result)));

	const Recipe = useMemo(() => (new Recipes()), []); 
	const Baker = useMemo(() => {new Oven(Recipe)}, []);
	const connectionBuild = useMemo( () => (new ConnectionBuilder()), []);
		
	connectionBuild.setProps({setEdges});
	connectionBuild.setEdgeDropped(false);
	connectionBuild.setEdgeReconnect(edgeReconnect);
	connectionBuild.setHandlesCheck(handlesCheck.current);
	connectionBuild.setRecipe(Recipe);
	connectionBuild.setSource("right");
	connectionBuild.setTarget("left");
	connectionBuild.setEdgeType(edgeType.current);

	const connectionHandler = useMemo( () => (connectionBuild.build()));

	const getPos = (e) => {
		if (!connectionHandler.edgeDropped){
			const screenPos = {x:e.clientX, y:e.clientY};
			pos.current = reactFlow.screenToFlowPosition(screenPos)

			setNodes((nds) => nds.map((node) =>{
				if (node.id !== "og"){
					return node
				}

			        return Recipe.createNode("og", pos.current, "", "origin", false)
			}))
		}

		connectionHandler.edgeDropped = false;
	}

	const MakeSquare = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos.current, "", "RectNode", true);
		setNodes((nds) => nds.concat(node));

	}, [setNodes]);

	const MakeCircle = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos.current, "", "circleNode", true);
		setNodes((nds) => nds.concat(node));
	}, [setNodes]);

	const TextNode = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos.current, "", "text", true);
		console.log(node)
		setNodes((nds) => nds.concat(node));
	}, [setNodes]);

	const ConnectorEdge = () =>{
		edgeType.current = "textEdge";
		connectionHandler.edgeType =  edgeType.current;

		const e = document.getElementById("nodes-list").children;

		const p = e[2].children;
		
		for (let j = 0; j < p.length; j++){
			if (j != 0){
				p[j].style.backgroundColor = "#6a4d31"
				continue;
			}

			p[j].style.backgroundColor = "#204B6B";
		}
	
	}

	const RegularEdge = () =>{
		edgeType.current = "reg";
		connectionHandler.edgeType = edgeType.current;
		const e = document.getElementById("nodes-list").children;
		console.log("hi")
		const p = e[2].children;
		
		for (let j = 0; j < p.length; j++){
			if (j != 1){
				p[j].style.backgroundColor = "#6a4d31"
				continue;
			}

			p[j].style.backgroundColor = "#204B6B";
		}

	}

	const onNodeDoubleClick = (_, node) =>{
		setNodes((nds) => nds.filter((n) => n.id != node.id)) 
	}

	return 	(
		<div style={{ height: '100%', width: '100%' }}>
		
		<Settings language={language}>
		</Settings>

		<ReactFlow nodes={nodes} 
		edges={edges}

		connectionMode={ConnectionMode.loose}
		onEdgesChange={onEdgesChange} 
		onNodesChange={onNodesChange} 
		nodeTypes={nodeTypes}
		edgeTypes={edgeTypes}
		onPaneClick={getPos}
		onConnectStart={useCallback(connectionHandler.onConnectStart, [])}
		onConnect={useCallback(connectionHandler.onConnect, [])}
		onConnectEnd={useCallback(connectionHandler.onConnectEnd, [])}
		onReconnect={useCallback(connectionHandler.onReconnect, [])}
		onReconnectStart={useCallback(connectionHandler.onReconnectStart, [])}
		onReconnectEnd={useCallback(connectionHandler.onReconnectEnd, [])}
		onNodeDoubleClick={useCallback(onNodeDoubleClick, [])}
		onlyRenderVisibleElements={true}
		>

		<Main ImportButt={ImportButt} RegularEdge={RegularEdge} ConnectorEdge={ConnectorEdge} 
		ExportButt={ExportButt} DropButton={DropButton}
		 nodes={nodes} setEdges={setEdges} TextNode={TextNode} setNodes={setNodes} edges={edges}
		MakeSquare={MakeSquare}
		MakeCircle={MakeCircle}
		language={language}>
		</Main>

		</ReactFlow>
		</div>
 	)
})

export default function App() {
	const addBorderRadius = useEffect(() =>{
		const dropdowns = document.getElementsByClassName("dropdown-content");
		dropdowns[0].children[0].style.borderRadius = "0px 0px 10px 10px";
		dropdowns[1].children[1].style.borderRadius = "0px 0px 10px 10px";

	}, []);

	const actionBuffer = useRef([])
	const edgeReconnect = useRef(true)
	const [nodes, setNodes, onNodesChange] = useNodesState(node);
	const [edges, setEdges, onEdgesChange] = useEdgesState(edge)

	const removeLatestNode = (n,i,a) =>{
		if (n !== a[a.length-1 || n.id  == "og"]){
			return n
		}

		else{
			actionBuffer.current.push(n);
		}
	}

	const Shortcuts = useEffect(() =>{
		document.addEventListener("keydown", (event) =>{
			if (event.altKey && event.key == "z"){
				setNodes((nds) => nds.filter(removeLatestNode));
			}

			// redo shortcut
			if (event.altKey && event.key == "x" && actionBuffer.current.length != 0){
				setNodes((nds) => nds.concat(actionBuffer.current.pop()))
			}
		})

	}, [setNodes, setEdges]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
	  <ReactFlowProvider>
	  <Inner setEdges={setEdges} 
	  edges={edges}
	  onEdgesChange={onEdgesChange} 
	  setNodes={setNodes} 
	  nodes={nodes} 
	  onNodesChange={onNodesChange}
	  actionBuffer={actionBuffer}/>
	  </ReactFlowProvider>
    </div>
  );
}
