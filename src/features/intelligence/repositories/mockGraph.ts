import { KnowledgeNode, KnowledgeEdge } from '../models';

export const MOCK_KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'math_algebra', name: 'Algebra', domain: 'Math', importance: 0.9 },
  { id: 'math_geometry', name: 'Geometry', domain: 'Math', importance: 0.8 },
  { id: 'physics_kinematics', name: 'Kinematics', domain: 'Physics', importance: 0.85 },
  { id: 'physics_forces', name: 'Forces and Newton\'s Laws', domain: 'Physics', importance: 0.95 },
];

export const MOCK_KNOWLEDGE_EDGES: KnowledgeEdge[] = [
  { sourceId: 'math_algebra', targetId: 'physics_kinematics', weight: 0.8 }, // Needs algebra to do kinematics
  { sourceId: 'physics_kinematics', targetId: 'physics_forces', weight: 0.9 }, // Needs kinematics to understand forces
];
