import React, { useRef, useEffect } from 'react';
import { SimulationState, Electron } from '../types';

interface WireSimulationProps {
  simulationState: SimulationState;
}

const WireSimulation: React.FC<WireSimulationProps> = ({ simulationState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const electronsRef = useRef<Electron[]>([]);
  const frameIdRef = useRef<number>(0);

  // Constants for the Circuit Layout
  const PADDING = 60;
  const CORNER_RADIUS = 20;
  
  // Physics Constants
  const NUM_ELECTRONS = 60;
  const BASE_SPEED_MULTIPLIER = 3;

  // Initialize electrons
  useEffect(() => {
    // Approx perimeter for 800x400 canvas with padding
    const approxPerimeter = (800 + 400) * 2; 
    
    const electrons: Electron[] = [];
    for (let i = 0; i < NUM_ELECTRONS; i++) {
      electrons.push({
        distance: Math.random() * approxPerimeter,
        laneOffset: (Math.random() - 0.5) * 16, // Reduced slightly for zigzag fit
        speed: 0,
        size: 3 + Math.random() * 3
      });
    }
    electronsRef.current = electrons;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const { voltage, resistance, isPlaying } = simulationState;
      const width = canvas.width;
      const height = canvas.height;

      // Define Circuit Box Geometry
      const leftX = PADDING;
      const rightX = width - PADDING;
      const topY = PADDING;
      const bottomY = height - PADDING;

      const pathWidth = rightX - leftX;
      const pathHeight = bottomY - topY;
      const perimeter = (pathWidth + pathHeight) * 2;

      // --- Resistor Geometry Calculation ---
      // Make geometry depend on resistance value
      const resWidth = 180;
      const resCenterX = leftX + pathWidth / 2;
      const resStartX = resCenterX - resWidth / 2;
      const resSteps = 14; // Must be even for symmetry
      const resStepWidth = resWidth / resSteps;
      
      // Dynamic Amplitude: Higher resistance = Taller spikes
      // Range: Resistance 1 -> 8px, Resistance 20 -> ~32px
      const resAmplitude = 6 + (resistance * 1.3);
      
      // Dynamic Thickness: Higher resistance = Thicker line
      const resThickness = 5 + (resistance * 0.4);

      // Helper to get Zigzag Y offset at a specific index
      // Pattern: 0 (Center) -> -Amp -> +Amp -> ... -> 0 (Center)
      const getZigZagOffset = (i: number) => {
          if (i <= 0 || i >= resSteps) return 0;
          return (i % 2 !== 0) ? -resAmplitude : resAmplitude;
      };

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // --- Draw Circuit Traces (The "Wire") ---
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Outer Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)'; // Blue glow
      
      // Wire Base
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#334155'; // Dark slate wire
      ctx.beginPath();
      ctx.moveTo(leftX, bottomY - CORNER_RADIUS);
      ctx.lineTo(leftX, topY + CORNER_RADIUS); // Left (Battery side)
      // Top Left Corner
      ctx.quadraticCurveTo(leftX, topY, leftX + CORNER_RADIUS, topY);
      ctx.lineTo(rightX - CORNER_RADIUS, topY); // Top (Resistor side)
      // Top Right Corner
      ctx.quadraticCurveTo(rightX, topY, rightX, topY + CORNER_RADIUS);
      ctx.lineTo(rightX, bottomY - CORNER_RADIUS); // Right
      // Bottom Right Corner
      ctx.quadraticCurveTo(rightX, bottomY, rightX - CORNER_RADIUS, bottomY);
      ctx.lineTo(leftX + CORNER_RADIUS, bottomY); // Bottom
      // Bottom Left Corner
      ctx.quadraticCurveTo(leftX, bottomY, leftX, bottomY - CORNER_RADIUS);
      ctx.stroke();

      // Reset Shadow
      ctx.shadowBlur = 0;

      // --- Draw Components ---

      // 1. Resistor (ZigZag) on Top Edge
      
      // Erase wire behind resistor
      ctx.strokeStyle = '#1e293b'; // Match background to "erase"
      ctx.lineWidth = resThickness + 8; // Erase slightly wider than resistor
      ctx.beginPath();
      ctx.moveTo(resStartX - 5, topY);
      ctx.lineTo(resStartX + resWidth + 5, topY);
      ctx.stroke();

      // Draw Zigzag
      ctx.strokeStyle = '#ef4444'; // Red for resistance
      ctx.lineWidth = resThickness;
      ctx.beginPath();
      ctx.moveTo(resStartX, topY);
      
      for (let i = 1; i <= resSteps; i++) {
        const x = resStartX + (i * resStepWidth);
        const y = topY + getZigZagOffset(i);
        ctx.lineTo(x, y);
      }
      
      // Glow based on Resistance (Heat simulation)
      if (resistance > 1) {
          ctx.shadowBlur = resistance * 2;
          ctx.shadowColor = resistance > 15 ? '#fca5a5' : '#ef4444'; // White-hot ish if very high
          ctx.stroke();
          ctx.shadowBlur = 0;
      } else {
          ctx.stroke();
      }

      // 2. Battery on Left Edge
      const battCenterY = topY + pathHeight / 2;
      const battHeight = 60;
      
      // Erase wire behind battery
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(leftX, battCenterY - battHeight/2 - 10);
      ctx.lineTo(leftX, battCenterY + battHeight/2 + 10);
      ctx.stroke();

      // Draw Battery Symbol
      ctx.strokeStyle = '#eab308'; // Yellow
      ctx.lineWidth = 6;
      
      // Top Plate (Positive - Long)
      ctx.beginPath();
      ctx.moveTo(leftX - 25, battCenterY - 10);
      ctx.lineTo(leftX + 25, battCenterY - 10);
      ctx.stroke();
      
      // Bottom Plate (Negative - Short)
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(leftX - 12, battCenterY + 10);
      ctx.lineTo(leftX + 12, battCenterY + 10);
      ctx.stroke();

      // Labels for + and -
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 20px Fredoka';
      ctx.fillText('+', leftX - 40, battCenterY - 15);
      ctx.fillText('-', leftX - 40, battCenterY + 25);

      // --- Electrons Animation ---
      
      // I = V/R
      const current = voltage / resistance;
      const speed = isPlaying ? current * BASE_SPEED_MULTIPLIER : 0;

      const getPos = (dist: number, offset: number) => {
        let d = dist % perimeter;
        if (d < 0) d += perimeter;

        // 1. Bottom Edge (Left to Right)
        if (d < pathWidth) {
           return { x: leftX + d, y: bottomY + offset };
        }
        d -= pathWidth;

        // 2. Right Edge (Bottom to Top)
        if (d < pathHeight) {
           return { x: rightX + offset, y: bottomY - d };
        }
        d -= pathHeight;

        // 3. Top Edge (Right to Left)
        if (d < pathWidth) {
           let currentX = rightX - d;
           let currentY = topY + offset;

           // Check if electron is inside the resistor area
           if (currentX > resStartX && currentX < resStartX + resWidth) {
               const relX = currentX - resStartX;
               
               // Calculate which segment of the zigzag we are in
               const stepIndex = Math.floor(relX / resStepWidth);
               const t = (relX % resStepWidth) / resStepWidth;
               
               // Get Y positions for start and end of this segment
               const y1 = topY + getZigZagOffset(stepIndex);
               const y2 = topY + getZigZagOffset(stepIndex + 1);
               
               // Interpolate Y (Linear for zigzag)
               const zigzagY = y1 + (y2 - y1) * t;
               
               // Electron follows the zigzag path + its lane offset
               currentY = zigzagY + offset;
           }

           return { x: currentX, y: currentY };
        }
        d -= pathWidth;

        // 4. Left Edge (Top to Bottom) - Go back into battery
        return { x: leftX + offset, y: topY + d };
      };

      electronsRef.current.forEach((electron) => {
        electron.distance += speed;
        
        const pos = getPos(electron.distance, electron.laneOffset);
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, electron.size, 0, Math.PI * 2);

        // Color based on voltage (energy)
        const intensity = Math.min(1, voltage / 20);
        ctx.fillStyle = `rgba(${100 + 155*intensity}, ${255}, ${255}, ${0.8 + 0.2*intensity})`;
        
        // Glow
        ctx.shadowBlur = 5 + intensity * 5;
        ctx.shadowColor = ctx.fillStyle;
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --- Component Labels ---
      ctx.font = '16px Fredoka';
      ctx.fillStyle = '#94a3b8';
      
      // Resistor Label
      ctx.fillText(`Resistencia: ${resistance}Ω`, resCenterX - 50, topY - (resAmplitude + 20));
      
      // Battery Label
      ctx.fillText(`${voltage}V`, leftX - 60, battCenterY + 5);
      
      // Current Label (Middle)
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#facc15';
      ctx.fillText(`I = ${current.toFixed(2)} A`, width/2 - 60, height/2);

      frameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [simulationState]);

  return (
    <div className="w-full h-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700 relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 right-4 text-slate-500 text-xs">
          Diagrama de Circuito
      </div>
    </div>
  );
};

export default WireSimulation;