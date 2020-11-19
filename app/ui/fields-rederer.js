function buildRows(fields = [], parentFields = [], renderFn) {
    return fields.map(field => {
        return __buildRow(field, parentFields, renderFn);
    });
}

function __buildRow(field, parentFields = [], renderFn) {
    if (field.isList) {
        return __buildListRow(field, parentFields, renderFn);
    }
    if (field.type === 'object') {
        const childRows = buildRows(field.fields, parentFields.concat(field), renderFn);
        return __buildObjectRow(field, childRows, parentFields, renderFn);
    }

    return __buildSimpleRow(field, parentFields, renderFn);
}

function __buildListRow(field, parentFields = [], renderFn) {
    const fullFieldName = parentFields.concat(field).map(f => f.name).join('-');
    return renderFn({
        type: 'list',
        field,
        fullFieldName
    });
}

function __buildObjectRow(field, childRows = [], parentFields = [], renderFn) {
    const fullFieldName = parentFields.concat(field).map(f => f.name).join('-');
    return renderFn({
        type: 'object',
        field,
        fullFieldName,
        childRows
    });
}

function __buildSimpleRow(field, parentFields = [], renderFn) {
    const fullFieldName = parentFields.concat(field).map(f => f.name).join('-');
    return renderFn({
        field,
        fullFieldName
    });
}