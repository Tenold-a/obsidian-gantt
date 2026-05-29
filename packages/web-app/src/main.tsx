import { render } from 'preact';
import { createGanttStore, GanttChart } from '@obsidian-gantt/ui';

function App() {
  return <div>Gantt Web App</div>;
}

render(<App />, document.getElementById('app')!);
