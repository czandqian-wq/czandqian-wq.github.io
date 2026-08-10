type Props = {
  projectId: number;
};

export default function ProjectVisual({ projectId }: Props) {
  return (
    <div className={`project-visual visual-${projectId}`} aria-hidden="true">
      <div className="visual-grid" />
      <span className="visual-orbit orbit-a" />
      <span className="visual-orbit orbit-b" />
      <span className="visual-node node-a" />
      <span className="visual-node node-b" />
      <span className="visual-node node-c" />
      <span className="visual-node node-d" />
      <span className="visual-line line-one" />
      <span className="visual-line line-two" />
      <strong>0{projectId}</strong>
    </div>
  );
}
