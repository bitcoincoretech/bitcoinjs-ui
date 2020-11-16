keyManagerComponent.createNew = function createNew(op) {
    return `
    <div id="key-manager-container-${op.containerUUID}">
        <div class="alert alert-danger">
            Do NOT use production keys! This is a testing app!
        </div>
        <table class="table table-sm p-4 mb-4 border-left border-right border-bottom">
            <thead>
                <tr class="d-flex thead-dark">
                    <th class="col-sm-4">Key Name</th>
                    <th class="col-sm-8">Public Key</th>
                </tr>
            </thead>
            <tbody id="key-manager-entries-${op.containerUUID}">           
            </tbody>
        </table>
    </div>
    `
}

keyManagerComponent.createExternalMenu = function createExternalMenu(op) {
    return `
        <button type="button" onclick="keyManagerComponent.addNewKey('${op.containerUUID}', 'HD')"
            class="btn btn-info button120 read-only-hide-${op.containerUUID}">
            Add HD Key
        </button>
        <button type="button" onclick="keyManagerComponent.addNewKey('${op.containerUUID}', 'Simple')"
            class="btn btn-info ml-3 read-only-hide-${op.containerUUID}">
            Add Simple Key
        </button>
`;
}

keyManagerComponent.htmlToData = function htmlToData(containerUUID) {
    if (!containerUUID) {
        return {};
    }
    const data = {
        keys: []
    };
    $(`#key-manager-entries-${containerUUID}`).children().each(function () {
        const keyUUID = this.id.split("key-entry-row-")[1];
        if (!keyUUID) {
            return;
        }
        data.keys.push({
            id: $(`#key-entry-id-${keyUUID}`).val(),
            type: $(`#key-entry-type-${keyUUID}`).text() || 'HD',
            name: $(`#key-entry-name-${keyUUID}`).val() || '',
            publicKey: $(`#key-entry-public-key-${keyUUID}`).val() || '',
            fingerprint: $(`#key-entry-fingerprint-${keyUUID}`).val() || '',
            base58: $(`#key-entry-base58-${keyUUID}`).val() || ''
        });
    });


    return data;
}

keyManagerComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!containerUUID || !data) {
        return;
    }
    $(`#key-manager-entries-${containerUUID}`).empty();
    (data.keys || []).forEach(keyData => {
        keyManagerComponent.addNewKey(containerUUID, keyData.type, keyData);
    });
}