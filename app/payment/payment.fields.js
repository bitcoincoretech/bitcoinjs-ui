const PAYMENT_FIELDS = {
    nonstandard: [{
            name: 'output',
            label: 'Output',
            type: 'asm',
            txLocation: 'outs'
        }, {
            name: 'input',
            label: 'Input',
            type: 'asm',
            txLocation: 'ins'
        },
        {
            name: 'witness',
            label: 'Witness',
            type: 'hex',
            isList: true,
            txLocation: 'ins'
        }
    ],
    embed: [{
        name: 'data',
        label: 'Data',
        type: 'hex',
        isList: true,
        txLocation: 'outs'
    }, {
        name: 'output',
        label: 'Output',
        type: 'asm',
        txLocation: 'outs'
    }],
    p2pk: [{
            name: 'pubkey',
            label: 'Public Key',
            type: 'hex'
        },
        {
            name: 'output',
            label: 'Output',
            type: 'asm',
            txLocation: 'outs'
        },
        {
            name: 'input',
            label: 'Input',
            type: 'asm',
            txLocation: 'ins'
        },
        {
            name: 'signature',
            label: 'Signature',
            type: 'hex',
            txLocation: 'ins'
        },
    ],
    p2pkh: [{
            name: 'pubkey',
            label: 'Public Key',
            type: 'hex'
        },
        {
            name: 'address',
            label: 'Address',
        },
        {
            name: 'output',
            label: 'Output',
            type: 'asm',
            txLocation: 'outs'
        },
        {
            name: 'input',
            label: 'Input',
            type: 'asm',
            txLocation: 'ins'
        },
        {
            name: 'signature',
            label: 'Signature',
            type: 'hex',
            txLocation: 'ins'
        },
        {
            name: 'hash',
            label: 'Hash',
            type: 'hex',
            txLocation: 'outs'
        }
    ],
    p2sh: [{
            name: 'address',
            label: 'Address',
        },
        {
            name: 'hash',
            label: 'Hash',
            type: 'hex'
        },
        {
            name: 'input',
            label: 'Input',
            type: 'asm',
            txLocation: 'ins'
        },
        {
            name: 'output',
            label: 'Output',
            type: 'asm',
            txLocation: 'outs'
        },
        {
            name: 'redeem',
            label: 'Redeem',
            type: 'object',
            fields: [{
                    name: 'input',
                    label: 'Input',
                    type: 'asm',
                    txLocation: 'ins'
                },
                {
                    name: 'output',
                    label: 'Output',
                    type: 'asm'
                },
                {
                    name: 'witness',
                    label: 'Witness',
                    type: 'hex',
                    isList: true,
                    txLocation: 'ins'
                }
            ]
        },
        {
            name: 'witness',
            label: 'Witness',
            type: 'hex',
            isList: true,
            txLocation: 'ins'
        }
    ],
    p2ms: [{
            name: 'n',
            label: 'Number of Public Keys (N)',
            type: 'number',
            txLocation: 'outs'
        }, {
            name: 'pubkeys',
            label: 'Public Keys',
            type: 'hex',
            isList: true,
            txLocation: 'outs'
        },
        {
            name: 'm',
            label: 'Number of Signatures (M)',
            type: 'number'
        },
        {
            name: 'signatures',
            label: 'Signatures',
            type: 'hex',
            isList: true,
            txLocation: 'ins'
        },
        {
            name: 'input',
            label: 'Input',
            type: 'asm',
            txLocation: 'ins'
        },
        {
            name: 'output',
            label: 'Output',
            type: 'asm',
            txLocation: 'outs'
        }
    ],
    p2wpkh: [{
            name: 'pubkey',
            label: 'Public Key',
            type: 'hex'
        },
        {
            name: 'address',
            label: 'Address',
        },
        {
            name: 'output',
            label: 'Output',
            type: 'asm',
            txLocation: 'outs'
        },
        {
            name: 'input',
            label: 'Input',
            type: 'asm',
            txLocation: 'ins'
        },
        {
            name: 'signature',
            label: 'Signature',
            type: 'hex',
            txLocation: 'ins'
        },
        {
            name: 'hash',
            label: 'Hash',
            type: 'hex',
            txLocation: 'outs'
        },
        {
            name: 'witness',
            label: 'Witness',
            type: 'hex',
            isList: true,
            txLocation: 'ins'
        }
    ],
    p2wsh: [{
            name: 'address',
            label: 'Address',
        },
        {
            name: 'hash',
            label: 'Hash',
            type: 'hex'
        },
        {
            name: 'input',
            label: 'Input',
            type: 'asm',
            txLocation: 'ins'
        },
        {
            name: 'output',
            label: 'Output',
            type: 'asm',
            txLocation: 'outs'
        },
        {
            name: 'redeem',
            label: 'Redeem',
            type: 'object',
            fields: [{
                    name: 'input',
                    label: 'Input',
                    type: 'asm',
                    txLocation: 'ins'
                },
                {
                    name: 'output',
                    label: 'Output',
                    type: 'asm'
                },
                {
                    name: 'witness',
                    label: 'Witness',
                    type: 'hex',
                    isList: true,
                    txLocation: 'ins'
                }
            ]
        },
        {
            name: 'witness',
            label: 'Witness',
            type: 'hex',
            isList: true,
            txLocation: 'ins'
        }
    ],
}