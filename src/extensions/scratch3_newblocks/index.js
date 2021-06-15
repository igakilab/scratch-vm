const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'テキストログ [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "こんにちは"
                        }
                    }
                },
                {
                    opcode: 'reporter1',
                    blockType: BlockType.REPORTER,
                    text: 'reporter [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "こんにちは"
                        }
                    }
                },
                {
                    opcode: 'boolean1',
                    blockType: BlockType.BOOLEAN,
                    text: 'boolean [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "こんにちは"
                        }
                    }
                },
                {
                    opcode: 'hat1',
                    blockType: BlockType.HAT,
                    text: 'hat',
                }
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }
    reporter1 (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
        return 'Argument TEXT is \{args.TEXT}';
    }
    boolean1(args) {
        return args.TEXT == "hello";
    }
    send(args) {
        this.changed = true;
    }
    hat1(args) {
        var rtn = this.changed && (!this.lasthat);
        this.changed = false;
        this.lasthat = rtn;
        return rtn;
    }
}

module.exports = Scratch3NewBlocks;