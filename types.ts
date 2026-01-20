export interface SimulationState {
  voltage: number;
  resistance: number;
  isPlaying: boolean;
}

export interface Electron {
  distance: number; // Position along the loop (0 to Total Perimeter)
  laneOffset: number; // Random offset from center of wire for thickness
  speed: number;
  size: number;
}

export interface ExplanationResponse {
  markdown: string;
}
