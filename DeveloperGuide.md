
# Consciousness Phase Diagram (CPD) - Developer Guide

This document provides developers with the information needed to understand the project's architecture, run it locally, and contribute to its development.

---

## 1. Local Setup

The project is built with React and TypeScript and uses CDN-hosted dependencies, so no `npm install` step is required.

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```
2.  **Serve the Application:**
    You need a simple local web server to serve the `index.html` file and handle module imports correctly.
    ```bash
    # If you have Python 3
    python3 -m http.server

    # Or use the `serve` package
    npx serve .
    ```
3.  **Open in Browser:**
    Navigate to `http://localhost:8000` (or the port specified by your server) in your web browser.

---

## 2. Architecture Overview

The application is a client-side single-page application (SPA) built on a modern frontend stack.

*   **Framework:** **React** is used for building the user interface declaratively.
*   **3D Rendering:** **`@react-three/fiber`** and **`@react-three/drei`** are used to create and manage the 3D scene with Three.js in a declarative, component-based manner. This is the core of the visualizer.
*   **State Management:** A custom global state management solution built with **`useSyncExternalStore`** is implemented in `store/store.tsx`. It acts like a lightweight version of Zustand or Redux, providing a single source of truth for the application state.
*   **Styling:** **Tailwind CSS** (via CDN) is used for utility-first styling.
*   **Dependencies:** All major dependencies (React, Three.js, pako) are loaded via a CDN specified in `index.html`'s import map. This simplifies the build process for this project's context.

---

## 3. State Management (`store/store.tsx`)

All application state is managed within a single global store, created by the `createStore` function. This approach centralizes state logic and makes data flow predictable.

### State Slices
The `AppState` is conceptually divided into slices:
*   `trackData`: Holds the main trajectory data, loading status, and any processing errors.
*   `view`: Contains UI-related state, primarily the `axisMapping` which dictates how data is visualized.
*   `playback`: Manages the animation state, including `isPlaying` and `currentTime`.

### Accessing State and Actions
*   **`useStore(selector)`:** A custom hook to subscribe a component to a specific piece of state. The selector function ensures that the component only re-renders when the selected state changes.
    ```tsx
    const trackData = useStore(state => state.trackData);
    ```
*   **`useStoreActions()`:** A custom hook that returns all available action functions (e.g., `loadTrack`, `setAxis`, `togglePlay`). This hook does not cause re-renders when state changes.
    ```tsx
    const { loadTrack } = useStoreActions();
    ```

---

## 4. Component Library

The project is broken down into reusable components, primarily located in the `/components` directory.

*   **`App.tsx`:** The root component that assembles the main layout (sidebar, main view) and handles conditional rendering based on loading state.
*   **`SceneController.tsx`:** The main 3D visualization component. It sets up the `react-three-fiber` `Canvas`, manages the animation loop via `useEffect`, and orchestrates the rendering of child 3D components.
*   **`AxisManager.tsx`:** A container for the axis and preset selectors. It also displays warnings for duplicate axis mappings.
*   **`AxisSelector.tsx` / `PresetSelector.tsx`:** UI controls for changing axis mappings.
*   **`Timeline.tsx`:** A container for the `PlayPauseButton` and `TimeSlider`.
*   **`ImportButton.tsx` / `ExportButton.tsx`:** Components responsible for file I/O logic.
*   **`AxesAndGrid.tsx`:** A 3D component that renders the grid and colored axis lines/labels within the scene.
*   **`Trajectory.tsx`:** A 3D component that calculates the scaled points and renders the trajectory line and the animated time point marker.

---

## 5. Contribution Guide

We welcome contributions to improve the CPD tool.

1.  **Fork the Repository:** Create your own fork of the project.
2.  **Create a Branch:** Make your changes in a dedicated branch with a descriptive name (e.g., `feature/add-slicing-tool`).
3.  **Commit Your Changes:** Follow conventional commit standards for your commit messages.
4.  **Open a Pull Request:** Submit a pull request from your fork to the main repository's `main` branch, detailing the changes you've made.
