# AlgoVisualizer

AlgoVisualizer is a React + TypeScript web application that lets you explore classic pathfinding algorithms in real time. I built the core algorithms myself as a way to truly understand how they work under the hood. You can place start and end points, draw walls to create obstacles, and then watch how each algorithm searches for a path on the grid.

## Features

- **Interactive grid** – click to set the start tile, end tile, and walls.
- **Algorithm choices** – visualize Breadth‑First Search, Depth‑First Search, or the A* algorithm.
- **Step‑by‑step animation** – see nodes as they are visited and watch the final shortest path appear.
- **Notifications** – get feedback on the path length found by each algorithm.

## Getting Started

```bash
# install dependencies
npm install

# run in development mode
npm run dev
```

Open your browser to `http://localhost:5173` (or whatever port Vite shows) and start placing tiles. Make sure to choose an algorithm before clicking **Run**.

To create a production build:

```bash
npm run build
```

You can check your code style with:

```bash
npm run lint
```

## Why I Built It

Implementing BFS, DFS, and A* completely from scratch taught me a lot about data structures and problem solving. Seeing the algorithms animate on screen makes the concepts much clearer than reading about them alone. I hope this project helps anyone else learning these fundamental techniques.

