const TRANSACTION_FIELDS = [{
        name: 'id',
        label: 'ID',
        type: 'hex',
        isReadOnly: true
    }, {
        name: 'version',
        label: 'Version',
        type: 'number'
    },
    {
        name: 'size',
        label: 'Size',
        isReadOnly: true
    },
    {
        name: 'vsize',
        label: 'Virtual Size',
        isReadOnly: true
    },
    {
        name: 'weight',
        label: 'Weight',
        isReadOnly: true
    },
    {
        name: 'locktime',
        label: 'Locktime',
        type: 'number'
    },
    {
        name: 'ins',
        label: 'Inputs',
        isList: true,
        type: 'object',
        fields: [{
            name: 'id',
            label: 'ID',
            type: 'hex'
        }, {
            name: 'index',
            label: 'Index',
            type: 'number'
        }]
    },
    {
        name: 'outs',
        label: 'Outputs',
        type: 'data',
        fields: []
    }
];