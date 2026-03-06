import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        fontFamily: 'inherit',
      }
    });

    if (containerRef.current && chart) {
      // Clear previous content to avoid duplicate renders
      containerRef.current.innerHTML = '';
      
      try {
        mermaid.render('mermaid-chart', chart).then((result) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = result.svg;
          }
        }).catch(err => {
          console.error("Mermaid rendering failed:", err);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="text-danger-fg text-sm p-4">Failed to render architecture diagram. The AI might have generated invalid Mermaid syntax.</div>`;
          }
        });
      } catch (err) {
        console.error("Mermaid error:", err);
      }
    }
  }, [chart]);

  // Strip markdown backticks if Gemini accidentally included them
  const cleanChart = chart.replace(/```mermaid/g, '').replace(/```/g, '').trim();

  return (
    <div className="mermaid-container w-full overflow-x-auto flex justify-center py-4">
      <div ref={containerRef} className="mermaid">{cleanChart}</div>
    </div>
  );
};

export default MermaidDiagram;
