<script>
    import { config, selectedNode } from './stores.js';
    import NodeAdder from './NodeAdder.svelte';
    import RawNode from './RawNode.svelte';
    import NodeConfig from './NodeConfig.svelte';
    import Modal from './Modal.svelte';

    let configuration = [];
    const u = config.subscribe(conf => {
        configuration = conf.filter(n => !n.parent);
    });
</script>

{#each configuration as node}
<RawNode {node}/>
{/each}
<NodeAdder/>

{#if $selectedNode}
<Modal on:close="{() => selectedNode.set(null)}">
    <div class="node-config--modal">
        <NodeConfig node={$selectedNode}/>
    </div>
</Modal>
{/if}