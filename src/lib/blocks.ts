export type Block = {
	direction?: "horizontal" | "vertical";
	align?: "start" | "center" | "end";
	width?: number | "fit" | "fill";
	height?: number | "fit" | "fill";
	gap?: number;
	padding?: number;
	radius?: number;
	backgroundColor?: string;
	text?: string;
	children?: Block[];
};

export type DefaultedBlock = Required<
	Pick<Block, "gap" | "direction" | "height" | "width" | "padding" | "align">
> &
	Block;
