import type { Block } from "./lib/blocks";
import { render } from "./lib/canvasRenderer";

function randomSize() {
	return Math.floor(Math.random() * 120) + 20;
}

function array(count: number, block: (i: number) => Block) {
	return new Array(count).fill(0).map((_, i) => block(i));
}

const sizes = [
	randomSize(),
	randomSize(),
	randomSize(),
	randomSize(),
	randomSize(),
];

function main() {
	const canvas = document.querySelector<HTMLCanvasElement>("#canvas");

	render({ canvas }, () => {
		return {
			width: "fill",
			height: "fill",
			backgroundColor: "oklch(97% 0 0)",
			padding: 10,
			direction: "vertical",
			gap: 10,
			children: [
				{
					width: "fill",
					radius: 35,
					backgroundColor: "oklch(70.8% 0 0)",
					padding: 20,
					gap: 8,
					children: [
						{
							height: 25,
							width: 70,
							radius: 25,
							backgroundColor: "oklch(55.6% 0 0)",
						},
						{
							width: "fill",
						},
						...array(3, (i) => ({
							height: 25,
							width: sizes[i],
							radius: 25,
							backgroundColor: "oklch(55.6% 0 0)",
						})),
					],
				},
				{
					width: "fill",
					height: "fill",
					gap: 10,
					children: [
						{
							width: 200,
							height: "fill",
							radius: 13,
							backgroundColor: "oklch(87% 0 0)",
							padding: 20,
							gap: 12,
							direction: "vertical",
							children: [
								...array(5, (i) => ({
									height: 25,
									width: sizes[i],
									radius: 25,
									backgroundColor: "oklch(70.8% 0 0)",
								})),
							],
						},
						{
							width: "fill",
							height: "fill",
							radius: 13,
							backgroundColor: "oklch(87% 0 0)",
							padding: 20,
							gap: 12,
							direction: "vertical",
							children: array(4, () => ({
								width: "fill",
								height: "fill",
								gap: 12,
								children: array(4, () => ({
									width: "fill",
									height: "fill",
									radius: 5,
									backgroundColor: "oklch(55.6% 0 0)",
								})),
							})),
						},
					],
				},
			],
		};
	});
}

main();
