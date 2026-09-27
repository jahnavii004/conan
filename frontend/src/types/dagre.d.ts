declare module 'dagre' {
  export namespace graphlib {
    class Graph {
      constructor(options?: { directed?: boolean; multigraph?: boolean; compound?: boolean });
      setGraph(label: {
        rankdir?: 'TB' | 'BT' | 'LR' | 'RL';
        align?: 'UL' | 'UR' | 'DL' | 'DR';
        nodesep?: number;
        edgesep?: number;
        ranksep?: number;
        marginx?: number;
        marginy?: number;
      }): this;
      setDefaultEdgeLabel(callback: () => Record<string, unknown>): this;
      setNode(name: string, label: { width: number; height: number; [key: string]: unknown }): this;
      setEdge(v: string, w: string, label?: Record<string, unknown>): this;
      node(name: string): { x: number; y: number; width: number; height: number; [key: string]: unknown };
      edge(v: string, w: string): Record<string, unknown>;
      nodes(): string[];
      edges(): Array<{ v: string; w: string }>;
    }
  }

  export function layout(graph: graphlib.Graph): void;

  const dagre: {
    graphlib: {
      Graph: typeof graphlib.Graph;
    };
    layout: typeof layout;
  };

  export default dagre;
}
