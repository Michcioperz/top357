import "./app.scss";
import App from './App.svelte'
import type { SourceFile } from './sourcetypes';

const sourceFile: SourceFile = await fetch("https://api.lista.radio357.pl/api/charts/current/top").then(resp => resp.json());
const data = sourceFile.data;
const title = `${data.name} #${data.no}`;
const pool = sourceFile.data.tracks;
let pos = 0;

const cacheKey = `top357-${data.id}`;
const selected: Record<number, boolean> = JSON.parse(localStorage.getItem(cacheKey) ?? "{}");

const app = new App({
  target: document.getElementById('app'),
  props: {
    data,
    title,
    pool,
    selected,
    pos,
    changeChoice,
    move,
  },
})

function changeChoice(id: number, chosen: boolean): void {
  selected[id] = chosen;
  app.$set({ selected });
  localStorage.setItem(cacheKey, JSON.stringify(selected));
}

function move(dir: number): void {
  const newPos = pos + dir;
  if (newPos >= 0 && newPos < pool.length) {
    pos = newPos;
    app.$set({ pos });
  }
}

export default app
