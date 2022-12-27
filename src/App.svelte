<script lang="ts">
  import { afterUpdate } from "svelte";
  import type { Data, Track } from "./sourcetypes";

  export let data: Data;
  export let title: string;
  export let pool: Track[];
  export let selected: Record<number, boolean> = {};
  export let pos: number;
  $: currentTrack = pool[pos];
  $: selectedCount = Object.values(selected).reduce((acc, v) => acc + +v, 0);
  $: initials = generateInitials(pool);
  $: currentInitial = findCurrentInitial(pos, initials);
  export let changeChoice: (id: number, chosen: boolean) => void;
  export let move: (dir: number) => void;
  let currentNode: HTMLElement;
  let results: HTMLElement;
  let scrollside: HTMLElement;

  afterUpdate(() => {
    console.log({ currentNode, currentTrack });
    currentNode.scrollIntoView({ behavior: "smooth", block: "center" });

    const letterChild = scrollside.children[currentInitial] as HTMLElement;
    console.log({ letterChild, currentInitial, scrollside });
    const letterOffset = letterChild.offsetTop - letterChild.offsetHeight;
    scrollside.scrollTo({
      top: letterOffset,
      behavior: "smooth",
    });
  });

  function findCurrentInitial(p: number, is: number[]) {
    const found = is.findIndex((v) => v > pos);
    const next = found == -1 ? is.length : found;
    return next - 1;
  }

  function generateInitials(pool: Track[]) {
    const inis: number[] = [];
    let lastIni: string | undefined = undefined;
    pool.forEach((track, idx) => {
      const newIni = track.artist
        .slice(track.artist.toLowerCase().startsWith("the ") ? 4 : 0)
        .slice(0, 1)
        .toLowerCase();
      if (newIni !== lastIni) {
        inis.push(idx);
      }
      lastIni = newIni;
    });
    console.log(inis);
    return inis;
  }

  function keydown(ev: KeyboardEvent) {
    switch (ev.code) {
      case "ArrowRight":
        upvote();
        break;
      case "ArrowLeft":
        downvote();
        break;
      case "ArrowDown":
        move(1);
        break;
      case "ArrowUp":
        move(-1);
        break;
      default:
        return;
    }
    ev.preventDefault();
  }

  function upvote() {
    changeChoice(pool[pos].id, true);
  }

  function downvote() {
    changeChoice(pool[pos].id, false);
  }
</script>

<svelte:body on:keydown={keydown} />

<div class="grid">
  <div class="nav border padding-small">
    <strong style:font-size="2rem" style:grid-area="brand">{title}</strong>
    <div style:grid-area="progress">
      wybrano:
      {selectedCount}/{data.max_votes_per_user}
      <button
        class="btn-small"
        on:click={() =>
          results.scrollIntoView({ behavior: "smooth", block: "start" })}
      >
        🏆
      </button>
    </div>
    <div style:grid-area="current">
      <strong>{currentTrack.artist}</strong>
      <em>{currentTrack.name.toLowerCase()}</em>
    </div>
    <div style:grid-area="audio">
      <audio
        style:width="100%"
        src={currentTrack.mp3_url}
        autoplay
        loop
        controls
        preload="auto"
      />
    </div>
    <div style:grid-area="buttons">
      <button class="btn-small btn-danger" on:click={downvote}>-</button>
      <button class="btn-small btn-success" on:click={upvote}>+</button>
    </div>
  </div>
  <div class="central">
    <div class="paper container">
      <div class="selection-list flex-spaces">
        {#each pool as track, idx (track.id)}
          {@const chosen = selected[track.id]}
          {@const current = idx == pos}
          <div
            class="alert"
            class:chosen
            class:alert-primary={current}
            on:click={() => move(idx - pos)}
          >
            {#if current}<span bind:this={currentNode} />{/if}
            <ul class="breadcrumb">
              <li>{track.artist}</li>
              <li>{track.name.toLowerCase()}</li>
            </ul>
          </div>
        {/each}
      </div>
    </div>
    <div class="paper container margin-top" bind:this={results}>
      <h2>Twoje wybory</h2>
      <div class="flex-spaces">
        {#each pool as track, idx (track.id)}
          {@const chosen = selected[track.id]}
          {#if chosen}
            <div class="alert">
              <ul class="breadcrumb">
                <li>{track.artist}</li>
                <li>{track.name.toLowerCase()}</li>
              </ul>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
  <aside class="scrollside" bind:this={scrollside}>
    {#each initials as iniIdx, idx (iniIdx)}
      {@const artist = pool[iniIdx].artist.toLowerCase()}
      <p>
        <button
          class:btn-primary={currentInitial === idx}
          on:click={() => move(iniIdx - pos)}
        >
          {artist.slice(artist.startsWith("the ") ? 4 : 0).slice(0, 1)}
        </button>
      </p>
    {/each}
  </aside>
</div>

<style lang="scss">
  .grid {
    display: grid;
    grid-template-areas: "nav nav" "main scrollside";
    grid-template-rows: min-content 1fr;
    grid-template-columns: 1fr min-content;
    overflow: hidden;
    max-height: 100%;
    > div.nav {
      gap: 1em;
      grid-area: nav;
      align-content: center;
      justify-content: center;
      display: grid;
      grid-template-areas: "brand current buttons" "progress audio buttons";
      grid-template-rows: min-content min-content;
      grid-template-columns: max-content 1fr max-content;
      text-align: center;
    }
    > div.central {
      grid-area: main;
      overflow: scroll;
      min-height: 0;
      .selection-list {
        .alert {
          width: 50%;
          &.chosen {
            width: 100%;
          }
          &.alert-primary {
            transition: width 357ms;
          }
        }
      }
    }
    > aside.scrollside {
      position: relative;
      grid-area: scrollside;
      overflow-y: scroll;
      top: 0;
      p {
        text-align: right;
      }
    }
  }
</style>
