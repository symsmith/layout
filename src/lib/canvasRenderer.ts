import type { Block } from "./blocks";
import { getLayout, Node } from "./runtime";

function drawNode(ctx: CanvasRenderingContext2D, node: Node) {
	if (node.block.backgroundColor) {
		const scale = window.devicePixelRatio;
		ctx.beginPath();
		ctx.fillStyle = node.block.backgroundColor;
		ctx.roundRect(
			node.x * scale,
			node.y * scale,
			node.width * scale,
			node.height * scale,
			(node.block.radius || 0) * scale
		);
		ctx.fill();
	}
	node.children?.map((node) => drawNode(ctx, node));
}

export function render(
	{
		canvas,
		debug,
	}: {
		canvas: HTMLCanvasElement | null;
		debug?: boolean;
	},
	definition: (t: number) => Block
) {
	if (!canvas) return;

	const runtimeLoop: FrameRequestCallback = (currentTime) => {
		const width = document.body.offsetWidth;
		const height = document.body.offsetHeight;

		const scale = window.devicePixelRatio;
		const scaledWidth = width * window.devicePixelRatio;
		const scaledHeight = height * window.devicePixelRatio;

		canvas.width = scaledWidth;
		canvas.height = scaledHeight;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.textBaseline = "top";

		const start = performance.now();

		ctx.clearRect(0, 0, scaledWidth, scaledHeight);
		const layout = getLayout(definition(currentTime), width, height);
		drawNode(ctx, layout);

		const end = performance.now();

		if (debug) {
			const fps = Math.round(1000 / (end - start));

			ctx.fillStyle = "black";
			ctx.font = `${16 * scale}px sans-serif`;
			ctx.fillText(`${fps}fps`, 0, 0);
		}

		requestAnimationFrame(runtimeLoop);
	};

	runtimeLoop(0);
}
