export function getConfigTreeBuilder(configuration) {
    let space = '    ';
    let indent = 2;
    let spaces = space.repeat(indent)

    let tree = spaces;
    // write root node first
    // todo, find a way to set root always first, so this for can be removed
    for (let node of configuration) {
        if (node.type == 'root') {
            tree += `${node.php()}\n`;
            break;
        }
    }

    // write others nodes
    for (let node of configuration.filter(n => !n.parent)) {
        if (node.type == 'root') {
            continue;
        }

        tree += `${node.php(space.repeat(indent + 1), space.repeat(indent + 2), configuration)}\n`;
    }
    tree += `${spaces}->end();\n\n${spaces}return $treeBuilder;`;

    return tree;
}

export function getConfigInYaml(configuration, level = 1) {
    let yaml = '';

    for (let node of configuration) {
        if (node.type == 'root') {
            yaml += `${node.yaml()}\n`;
            break;
        }
    }

    for (let node of configuration.filter(n => !n.parent && n.type != 'root')) {
        yaml += `${' '.repeat(2 * level)}${node.yaml()}\n`;
        if (node.type == 'array') {
            yaml += getChildrenConfigInYaml(configuration, node, level + 1);
        }
    }

    return yaml;
}

function getChildrenConfigInYaml(configuration, parent, level) {
    let yaml = '';
    for (let node of configuration.filter(n => n.parent == parent.id)) {
        yaml += `${' '.repeat(2 * level)}${node.yaml()}\n`;
        if (node.type == 'array') {
            yaml += getChildrenConfigInYaml(configuration, node, level + 1);
        }
    }

    return yaml;
}