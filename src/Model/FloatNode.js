import ConfigNode from './ConfigNode.js';

export default class FloatNode extends ConfigNode {
    constructor(name = '', options = {}) {
        super(name, Object.assign({}, {min: null, max: null}, options));
    }

    specific(spaces) {
        let php = '';
        if (this.options.defaultValue) {
            php += `\n${spaces}->defaultValue(${parseFloat(this.options.defaultValue)})`;
        }
        if (this.options.min) {
            php += `\n${spaces}->min(${parseFloat(this.options.min)})`;
        }
        if (this.options.max) {
            php += `\n${spaces}->max(${parseFloat(this.options.max)})`;
        }

        return php;
    }

    getType() {
        return 'float';
    }
}