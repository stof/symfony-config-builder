<script>
    import { config, selectedNode } from './stores.js';
    import { getConfigTreeBuilder, getConfigInYaml } from './Services/ConfigWriter.js';
    import Configuration from './Configuration.svelte';
    import ConfigManager from './Services/ConfigManager.js';
    import Highlight from 'svelte-highlight';
    import { php, yaml as yamlLang } from 'svelte-highlight/languages';

    ConfigManager.load();

    let tree;
    let configuration = [];
    let yaml = false;
    const u = config.subscribe(conf => {
        configuration = conf;
        ConfigManager.save($config);
        buildTree();
    });

    function buildTree() {
        if (configuration.length) {
            tree = getConfigTreeBuilder(configuration);
        }
    }

    let yamlConfig;
    function buildYamlConfig() {
        yaml = !yaml;
        if (yaml) {
            yamlConfig = getConfigInYaml(configuration);
        }
    }

    function clear() {
        ConfigManager.restart();
    }

    let copied = false;
    function copyPHP() {
        copyToClipBoard(tree);
    }

    function copyYaml() {
        copyToClipBoard(yamlConfig);
    }

    function copyToClipBoard(content) {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(content).then(() => {
                    copied = true;
                    setTimeout(() => {copied = false;}, 2000);
                }, () => {
                    console.error('Unable to copy to clipboard.');
                });
            }
        });
    }
</script>

<h1 class="center">Config Tree Builder Builder</h1>
<div class="center">
    {#if configuration.length}
    <button on:click={buildYamlConfig}>{yaml ? 'Builder' : 'To Yaml'}</button>
    <button on:click={clear}>Clear</button>
    {/if}
    {#if copied}
        <div id="copy-message">Copied to clipboard !</div>
    {/if}
</div>
<div class="flexbox-container">
    <div class="configuration" class:yaml>
        {#if yaml}
            <button on:click={copyYaml} class="btn-copy">Copy to clipboard</button>
            <Highlight language={yamlLang} code={yamlConfig}/>
        {:else}
            <Configuration/>
        {/if}
    </div>
    <div id="code-panel">
        <button on:click={copyPHP} class="btn-copy">Copy to clipboard</button>
        <Highlight language={php} code={
`<?php

namespace Acme\\MyBundleConfiguration;

use Symfony\\Component\\Config\\Definition\\Builder\\TreeBuilder;
use Symfony\\Component\\Config\\Definition\\ConfigurationInterface;

class MyConfiguration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
${tree}
    }
}`}
/>
        </div>
</div>
Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

<div id="logos">
    <a href="https://github.com/kevin-verschaeve/symfony-config-builder" target="_blank" title="Contribute">
        <img src="/github.png" alt="Github repository" width="24">
    </a>
</div>
