import type { Block } from "./blocks";
import { getLayout, Node } from "./runtime";

function drawNode(ctx: CanvasRenderingContext2D, node: Node) {
	if (node.block.backgroundColor) {
		ctx.beginPath();
		ctx.fillStyle = node.block.backgroundColor;
		ctx.roundRect(node.x, node.y, node.width, node.height, node.block.radius);
		ctx.fill();
	}
	node.children?.map((node) => drawNode(ctx, node));
}

export function render(
	{
		canvas,
		width,
		height,
		debug,
	}: {
		canvas: HTMLCanvasElement | null;
		width: number;
		height: number;
		debug?: boolean;
	},
	definition: (t: number) => Block
) {
	if (!canvas) return;

	canvas.setAttribute("width", String(width));
	canvas.setAttribute("height", String(height));

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.textBaseline = "top";
	const runtimeLoop: FrameRequestCallback = (currentTime) => {
		const start = performance.now();

		ctx.clearRect(0, 0, width, height);
		const layout = getLayout(definition(currentTime), width, height);
		drawNode(ctx, layout);

		const end = performance.now();

		if (debug) {
			const fps = Math.round(1000 / (end - start));

			ctx.fillStyle = "black";
			ctx.font = "16px sans-serif";
			ctx.fillText(`${fps}fps`, 0, 0);
		}

		requestAnimationFrame(runtimeLoop);
	};

	runtimeLoop(0);
}
