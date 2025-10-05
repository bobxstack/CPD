
# Consciousness Phase Diagram (CPD) - User Guide

## 1. Introduction: What is the CPD?

The Consciousness Phase Diagram (CPD) is a parameter-agnostic 3D state explorer designed for visualizing consciousness-related data. It serves as a neutral, modular state-space where researchers, educators, and builders can map any metric to X, Y, and Z axes, observe trajectories over time, and analyze specific states.

**Key Purpose:**
*   Provide a **shared coordinate system** for mind-state data from various sources (e.g., drug research, meditation studies, sleep analysis, BCI).
*   Enable **time-based analysis** of state transitions through animated trajectories.
*   Offer a flexible visualization tool where the **axes are fully user-assignable**.

**Important Disclaimer:** This is a visualization-only research tool. It provides no medical or usage guidance, no clinical diagnostics, and makes no inference about causality.

---

## 2. Core Concepts

To effectively use the CPD, it's helpful to understand these key terms:

*   **Track:** A single time-series dataset representing one session, composed of an array of keyframes.
*   **Sample:** A single point in time (`t`) within a track, containing values for various metrics.
*   **Slice:** A specific view configuration of the data, defined by the axis mapping (X/Y/Z), a time window, filters, and a scaling profile.
*   **Freeze:** The action of pausing the animation to inspect the trajectory at a specific moment. The view remains editable.
*   **Consolidate:** The action of rendering the current trajectory path into an immutable, static geometry. This creates a canonical snapshot for comparison or export.

---

## 3. Data Formatting Guide

To import your data, it must be in a compressed JSON file with a `.json.gz` extension. The internal JSON structure must follow the model below.

### Per-Sample (Timepoint) Object:
Each sample in the `points` array is an array of numbers. The order of these numbers must match the `point_format` array in the metadata.

```json
{
  "t": 123.456,
  "carrier": 0.487,
  "coherence": 0.723,
  // ... other metrics
}
```
*Values should be normalized to a **0.000–1.000** range (Float32).*

### Main `track.json` Structure:
```json
{
  "points": [
    [123.45, 0.487, 0.723, ...],
    [123.55, 0.490, 0.720, ...],
    ...
  ],
  "metrics": {
    "carrier": { "min": 0.0, "max": 1.0 },
    "coherence": { "min": 0.0, "max": 1.0 },
    "entropy": { "min": 0.0, "max": 1.0 }
  },
  "metadata": {
    "point_format": ["t", "carrier", "coherence", ...],
    "duration": 300.5
  }
}
```

---

## 4. Getting Started: Loading Your First Track

1.  **Open the Application:** Launch the Trajectory Visualizer.
2.  **Import Data:** Locate the import area on the left sidebar. You can either drag and drop your `.json.gz` file onto the target area or click "browse" to open a file selector.
3.  **Wait for Processing:** The application will decompress and parse your file. A loading indicator will be displayed.
4.  **Configure Axes:** Once loaded, the Axis Configuration panel will appear. Use the dropdown menus to map the metrics from your file to the X, Y, and Z axes. The 3D visualization will update in real-time.
5.  **Explore:** Use the timeline controls at the bottom of the sidebar to play, pause, and scrub through your data's trajectory.

---

## 5. Feature Guide

### Using the Axis Manager
*   **Metric Mapping:** Assign any metric from your dataset to the X, Y, or Z axis using the dropdowns. To view a 2D projection, set the Z-axis to `-- Select Metric --`.
*   **Presets:** Quickly apply common axis configurations (e.g., 'Neuro') using the preset buttons.
*   **Duplicate Axis Warning:** The UI will alert you if you map the same metric to multiple axes, helping you avoid confusing visualizations.

### Navigating the Visualizer
The central view is a 3D space rendered with `react-three-fiber`.
*   **Rotate:** Left-click and drag horizontally to rotate the camera around the scene.
*   **Zoom:** Use your mouse scroll wheel to zoom in and out.
*   **Pan:** Right-click and drag to pan the camera across the scene.

### Understanding Trajectories
*   **Path Line:** The faint cyan line represents the entire path of your data over the full duration.
*   **Time Marker:** The bright cyan sphere represents the current position in time, which moves along the path during playback.
*   **Animation Controls:** Use the play/pause button and the time slider at the bottom of the sidebar to control the animation. The slider shows the current time and total duration.
