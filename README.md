# Layout engine

This is an experiment to create a simple layout engine, inspired by [this video](https://www.youtube.com/watch?v=by9lQvpvMIc) by [Nic Barker](https://github.com/nicbarker) on [Clay](https://github.com/nicbarker/clay)'s layout algorithm.

## Features

- Render to a `<canvas>` element
- [Immediate rendering](<https://en.wikipedia.org/wiki/Immediate_mode_(computer_graphics)>) for simple reactive UI
- Horizontal or vertical layouts
- Fixed sizes
- Pseudo-flex algorithm with fill and fit sizing modes
- Gap size between child elements
- Padding
- Background color
- Corner radius
- Time-based rendering

## Example

![an example of an image rendered by this project, mimicking the layout of a webpage, with a header containing links, a sidebar and a main content with a grid of images](demo.png)

This is the layout rendered by the code in [main.ts](./src/main.ts). Frames are usually drawn in around 100µs.

## Todo

- Handle text
- Respond to mouse events
- Handle alignment
