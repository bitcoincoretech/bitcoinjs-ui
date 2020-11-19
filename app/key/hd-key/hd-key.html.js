hdKeyComponent.createNew = function createNew(op) {
    return `
        <div id="hd-key-${op.containerUUID}">
            <div class="row">
                <label for="hd-key-import-mode-${op.containerUUID}" class="col-sm-2 control-label">
                    Source
                </label>

                <div class="col-sm-5">
                    <select onchange="hdKeyComponent.changeSourceType('${op.containerUUID}')"
                        id="hd-key-import-mode-${op.containerUUID}" name="hd-key-import-mode-${op.containerUUID}" class="form-control">
                        <option value="base58">Base58Check</option>
                        <option value="seed">Word Seed</option>
                    </select>
                </div>
                <div class="col-sm-5"></div>
            </div>
            <div id="hd-key-base58-${op.containerUUID}-row" class="row mt-3">
                <label class="col-sm-2 control-label">
                    HD Key
                </label>
                <div class="col-sm-10">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">base58</span>
                        </div>
                        <textarea id="hd-key-base58-${op.containerUUID}" rows="3" class="form-control"></textarea>
                        <div class="input-group-append">
                            <button onclick="hdKeyComponent.importBase58('${op.containerUUID}')"
                                class="btn btn-info" type="submit">Convert</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="hd-key-seed-${op.containerUUID}-row"  class="row mt-3 d-none">
                <label class="col-sm-2 control-label">
                    Seed
                </label>
                <div class="col-sm-10">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">text</span>
                        </div>
                        <textarea id="hd-key-seed-${op.containerUUID}" rows="3" class="form-control"></textarea>
                        <div class="input-group-append">
                            <button onclick="hdKeyComponent.importSeed('${op.containerUUID}')"
                                class="btn btn-info" type="submit">Convert</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <label for="hd-public-key-value-${op.containerUUID}" class="col-sm-2 control-label">Public
                    Key</label>
                <div class="col-sm-10">
                    <div class="input-group ">
                        <div class="input-group-prepend">
                            <span class="input-group-text">hex</span>
                        </div>
                        <textarea id="hd-public-key-value-${op.containerUUID}" rows="2"
                            class="form-control"></textarea>
                        <input hidden id="hd-private-key-value-${op.containerUUID}">
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <label for="hd-fingerprint-value-${op.containerUUID}" class="col-sm-2 control-label">Fingerprint</label>
                <div class="col-sm-5">
                    <div class="input-group ">
                        <div class="input-group-prepend">
                            <span class="input-group-text">hex</span>
                        </div>
                        <input id="hd-fingerprint-value-${op.containerUUID}" class="form-control">
                    </div>
                </div>
            </div>
        </div>
    `
}

hdKeyComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!containerUUID || !data) {
        return;
    }

    $(`#hd-key-base58-${containerUUID}`).val(data.base58 || '');
    if (data.base58 && data.base58.length) {
        hdKeyComponent.importBase58(containerUUID);
    } else {
        $(`#hd-public-key-value-${containerUUID}`).val(data.publicKey || '');
        $(`#hd-fingerprint-value-${containerUUID}`).val(data.fingerprint || '');
    }

}

hdKeyComponent.htmlToData = function htmlToData(containerUUID) {
    return {
        base58: $(`#hd-key-base58-${containerUUID}`).val() || '',
        publicKey: $(`#hd-public-key-value-${containerUUID}`).val() || '',
        fingerprint: $(`#hd-fingerprint-value-${containerUUID}`).val() || ''
    };
}