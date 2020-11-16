keySelectorComponent.createNew = function createNew(op) {
    return `
        <div id="no-keys-message-${op.containerUUID}" class="row  d-none">
            <div class="col-sm-12">
                <div class="alert alert-warning">
                    No Keys have been added!
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-sm-2">
                <label>Select Key</label>
            </div>
            <div class="col-sm-6">
                <input hidden id="key-type-${op.containerUUID}">
                <select id="key-list-${op.containerUUID}" onchange="keySelectorComponent.changeSelectedKey('${op.containerUUID}')" class="form-control">
                    <option value="">None</option>
                </select>
            </div>
            <div class="col-sm-4">
            </div>
        </div>
        <div class="row mt-3 key-property-${op.containerUUID} hd-key-property-${op.containerUUID}">
            <div class="col-sm-2">
                <label>Fingerprint</label>
            </div>
            <div class="col-sm-6">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">hex</span>
                    </div>
                    <input type="text" id="key-fingerprint-${op.containerUUID}" class="form-control">
                </div>
            </div>
            <div class="col-sm-4">
            </div>
        </div>
        <div class="row mt-3 key-property-${op.containerUUID} hd-key-property-${op.containerUUID}">
            <div class="col-sm-2">
                <label>Path</label>
            </div>
            <div class="col-sm-6">
               
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">path</span>
                    </div>
                    <input type="text" id="key-path-${op.containerUUID}" class="form-control">
                    <div class="input-group-append">
                        <button id="check-hd-path-button-${op.containerUUID}" onclick="keySelectorComponent.checkHDPath('${op.containerUUID}')" class="btn btn-info">
                            Check
                        </button>  
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
            </div>
        </div>
        <div class="row mt-3 key-property-${op.containerUUID}">
            <div class="col-sm-2">
                <label>Public Key</label>
            </div>
            <div class="col-sm-10">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">hex</span>
                    </div>
                    <textarea id="public-key-value-${op.containerUUID}" rows="2" class="form-control"></textarea>
                </div>
            </div>
        </div>
    `;

}

keySelectorComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!containerUUID || !data) {
        return;
    }

    if (!data.keys || !data.keys.length) {
        $(`#no-keys-message-${containerUUID}`).removeClass('d-none');
    } else {
        $(`#no-keys-message-${containerUUID}`).addClass('d-none');
    }

    const keyPairs = (data.keys || []).filter(keyPair => (keyPair && keyPair.publicKey));

    $(`#key-list-${containerUUID}`).empty();
    $(`#key-list-${containerUUID}`).append(`<option value="">None</option>`)
    keyPairs.forEach(keyPair => {
        $(`#key-list-${containerUUID}`).append(`<option value="${keyPair.id}">${keyPair.name || keyPair.publicKey.substring(0,20)}</option>`)
    });

    const selectedKeyPair = keyPairs.find(keyPair => data.fingerprint && (data.fingerprint === keyPair.fingerprint)) ||
        keyPairs.find(keyPair => data.publicKey === keyPair.publicKey);

    if (selectedKeyPair && selectedKeyPair.id) {
        keySelectorComponent.changeSelectedKey(containerUUID, selectedKeyPair.id);
    } else {
        const keyPairType = (data.fingerprint || data.path) ? 'HD' : 'Simple';
        $(`#key-type-${containerUUID}`).val(keyPairType);
        if (keyPairType === 'HD') {
            $(`.hd-key-property-${containerUUID}`).removeClass('d-none');
        } else {
            $(`.hd-key-property-${containerUUID}`).addClass('d-none');
        }
    }

    $(`#key-fingerprint-${containerUUID}`).val(data.fingerprint || '');
    $(`#key-path-${containerUUID}`).val(data.path || '');
    $(`#public-key-value-${containerUUID}`).val(data.publicKey || '');
}

keySelectorComponent.htmlToData = function htmlToData(containerUUID) {
    if (!containerUUID) {
        return {}
    }
    return {
        id: $(`#key-list-${containerUUID}`).val() || '',
        type: $(`#key-type-${containerUUID}`).val() || 'Simple',
        fingerprint: $(`#key-fingerprint-${containerUUID}`).val() || '',
        path: $(`#key-path-${containerUUID}`).val() || '',
        publicKey: $(`#public-key-value-${containerUUID}`).val() || '',
    };
}