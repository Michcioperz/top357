<script lang="ts">
  import { afterUpdate } from "svelte";
  import type { Data, Track } from "./sourcetypes";

  export let data: Data;
  export let title: string;
  export let pool: Track[];
  export let selected: Record<number, boolean> = {};
  export let pos: number;
  $: currentTrack = pool[pos];
  $: prevTrack = pool[pos - 1];
  $: nextTrack = pool[pos + 1];
  export let changeChoice: (id: number, chosen: boolean) => void;
  export let move: (dir: number) => void;
  let currentNode: Element;

  afterUpdate(() => {
    console.log(currentNode, currentTrack);
    currentNode.scrollIntoView({ behavior: "smooth", block: "center" });
  });

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
<nav class="border flex-center fixed margin-bottom split-nav">
  <div class="nav-brand">
    <h3>{title}</h3>
  </div>
  <span>{currentTrack.artist}</span>
  <span>{currentTrack.name.toLowerCase()}</span>
  <audio
    src={currentTrack.mp3_url}
    autoplay
    loop
    controls
    preload="auto"
  />
  <button on:click={downvote}>👎</button>
  <button on:click={upvote}>👍</button>
</nav>

<main class="paper container">
  <h1>{title}</h1>
  <div class="flex-spaces">
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
</main>

<style lang="scss">
  .alert {
    width: 50%;
    &.chosen {
      width: 100%;
    }
    &.alert-primary {
      transition: width 357ms;
    }
  }
</style>
