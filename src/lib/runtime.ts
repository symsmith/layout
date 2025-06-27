import type { Block, DefaultedBlock } from "./blocks";

export class Node {
	parent?: Node;
	children?: Node[];
	block: DefaultedBlock;
	x: number = 0;
	y: number = 0;
	width: number = 0;
	height: number = 0;

	constructor(block: Block, parent?: Node, children?: Node[]) {
		this.block = {
			direction: "horizontal",
			height: "fit",
			width: "fit",
			gap: 0,
			padding: 0,
			...block,
		};
		this.children = children;
		this.parent = parent;
	}
}

type Dimension = "width" | "height";

function getGapCount(node: Node | undefined) {
	return Math.max(0, (node?.children?.length || 0) - 1);
}

function getChildrenSize(node: Node | undefined, dimension: Dimension) {
	return node?.children?.reduce((p, c) => p + c[dimension], 0) || 0;
}

function computeTree(block: Block, parent?: Node): Node {
	const node = new Node(block, parent);
	if (block.children) {
		node.children = block.children.map((child) => computeTree(child, node));
	}
	return node;
}

function computeFitSizing(node: Node, dimension: Dimension) {
	node.children?.forEach((child) => computeFitSizing(child, dimension));

	if (typeof node.block[dimension] === "number") {
		// fixed size + padding
		node[dimension] = node.block[dimension] + 2 * node.block.padding;
	} else if (node.block[dimension] === "fit") {
		node[dimension] =
			(node.block.direction ===
			(dimension === "width" ? "vertical" : "horizontal")
				? // max children size in the other direction
				  node.children?.reduce((p, c) => Math.max(p, c[dimension]), 0) || 0
				: // total children size with gaps in same direction
				  getChildrenSize(node, dimension) +
				  getGapCount(node) * node.block.gap) +
			// add padding
			2 * node.block.padding;
	}
	return node;
}

function computeFitWidths(node: Node) {
	return computeFitSizing(node, "width");
}

function computeGrowAndShrinkWidths(node: Node) {
	return computeGrowAndShrinkSizing(node, "width");
}

function computeWrapText(node: Node) {
	return node;
}

function computeGrowAndShrinkSizing(
	node: Node,
	dimension: Dimension,
	availableSpace = 0
) {
	if (node.block[dimension] === "fill") {
		if (
			node.parent?.block.direction ===
			(dimension === "width" ? "horizontal" : "vertical")
		) {
			// in the same direction, use the available space next to the siblings
			node[dimension] = availableSpace;
		} else {
			// in the other direction, use the parent size (without padding)
			node[dimension] =
				(node.parent?.[dimension] || 0) - (node.parent?.block.padding || 0) * 2;
		}
	}

	if (node.children?.length) {
		let remainingSpace = Math.max(
			0,
			// start with node size
			node[dimension] -
				// remove padding
				2 * node.block.padding -
				// remove each child already sized (fixed or fit size)
				getChildrenSize(node, dimension) -
				// remove gaps
				getGapCount(node) * node.block.gap
		);

		// divide remaining space equally between fill size children
		const fillChildrenCount =
			node.children?.filter((child) => child.block[dimension] === "fill")
				.length || 0;
		const spaceForEach = fillChildrenCount
			? remainingSpace / fillChildrenCount
			: 0;

		node.children?.forEach((child) =>
			computeGrowAndShrinkSizing(child, dimension, spaceForEach)
		);
	}

	return node;
}

function computeFitHeights(node: Node) {
	return computeFitSizing(node, "height");
}

function computeGrowAndShrinkHeights(node: Node) {
	return computeGrowAndShrinkSizing(node, "height");
}

function computePositions(
	node: Node,
	{
		runningX = 0,
		runningY = 0,
	}: {
		runningX?: number;
		runningY?: number;
	} = {}
) {
	let siblingRunningX = node.x + node.block.padding;
	let siblingRunningY = node.y + node.block.padding;

	node.x = runningX + (node.parent?.x || 0);
	node.y = runningY + (node.parent?.y || 0);

	node.children?.forEach((child) => {
		computePositions(child, {
			runningX: siblingRunningX,
			runningY: siblingRunningY,
		});
		siblingRunningX +=
			node.block.direction === "horizontal" ? child.width + node.block.gap : 0;
		siblingRunningY +=
			node.block.direction === "vertical" ? child.height + node.block.gap : 0;
	});

	return node;
}

export function getLayout(block: Block, width: number, height: number) {
	const tree = computeTree({ children: [block], width, height });

	const fitWidths = computeFitWidths(tree);
	const grownAndShrinkedWidths = computeGrowAndShrinkWidths(fitWidths);
	const wrappedText = computeWrapText(grownAndShrinkedWidths);
	const fitHeights = computeFitHeights(wrappedText);
	const grownAndShrinkedHeights = computeGrowAndShrinkHeights(fitHeights);
	const positions = computePositions(grownAndShrinkedHeights);

	return positions;
}
