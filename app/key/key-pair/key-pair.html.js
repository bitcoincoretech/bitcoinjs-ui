keyPairComponent.createNew = function createNew(op) {
    return `
        <div id="key-pair-container-${op.containerUUID}">
            <div class="row">
                <label for="key-pair-generation-mode-${op.containerUUID}" class="col-sm-2 control-label">Source</label>
                <div class="col-sm-5">
                    <select onchange="keyPairComponent.changeSourceType('${op.containerUUID}')" id="key-pair-generation-mode-${op.containerUUID}"
                        name="key-pair-generation-mode-${op.containerUUID}" class="form-control">
                        <option value="wif-text">From WIF Text</option>
                        <option value="wif-file">From WIF File</option>
                        <option id="key-pair-random-generation-mode-option-${op.containerUUID}" value="random" >Random</option>
                    </select>
                </div>
                <div id="key-pair-random-${op.containerUUID}-row" class="col-sm-5" >
                    <button onclick="keyPairComponent.newRandomECPair('${op.containerUUID}')" type="button" class="btn btn-info">
                        New Public Key
                        <i class="fas fa-random"></i>
                    </button>
                </div>
            </div>
            <div id="wif-value-${op.containerUUID}-row" class="row mt-3">
                <label  class="col-sm-2 control-label">WIF Text</label>
                <div class="col-sm-10">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">base58</span>
                        </div>
                        <textarea id="wif-value-${op.containerUUID}" rows="2" class="form-control"></textarea>
                        <div class="input-group-append">
                            <button onclick="keyPairComponent.importWIFText('${op.containerUUID}')"
                                class="btn btn-info" type="submit">Convert</button>  
                        </div>
                    </div>
                </div>
            </div>
            <div id="wif-file-${op.containerUUID}-row" class="row mt-3">
                <label  class="col-sm-2 control-label">WIF File</label>
                <div class="custom-file col-sm-8">
                    <input type="file" id="wif-file-${op.containerUUID}" onchange="keyPairComponent.selectedFileChanged('${op.containerUUID}', this.value)" class="custom-file-input button120"  name="wif-file-${op.containerUUID}">
                    <label id="wif-file-label-${op.containerUUID}" class="custom-file-label ml-3" for="wif-file-${op.containerUUID}">Select File</label>
                </div>
                <div class="col-sm-2">
                    <button onclick="keyPairComponent.uploadWIFFile('${op.containerUUID}')" class="btn btn-info float-right button120">Import</button> 
                </div>
            </div>

            <div class="row mt-3">
                <label for="public-key-value-${op.containerUUID}" class="col-sm-2 control-label">Public Key</label>
                <div class="col-sm-10">
                    <div class="input-group ">
                        <div class="input-group-prepend">
                            <span class="input-group-text">hex</span>
                        </div>
                        <textarea id="public-key-value-${op.containerUUID}"  rows="2" class="form-control"></textarea>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <label for="private-key-value-${op.containerUUID}" class="col-sm-2 control-label">Private Key</label>
                <div class="col-sm-10">
                    <div class="input-group ">
                        <div class="input-group-prepend">
                            <span class="input-group-text">hex</span>
                        </div>
                        <input type="password" id="private-key-value-${op.containerUUID}" name="private-key-value-${op.containerUUID}" class="form-control">
                        <div class="input-group-append">
                            <button class="btn btn-secondary" onclick="revealPasswordField('private-key-value-${op.containerUUID}')" type="button">Show</button>  
                            <button class="btn btn-info" onclick="keyPairComponent.downloadWIFFile('${op.containerUUID}')" type="button">Export WIF</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

keyPairComponent.htmlToData = function htmlToData(containerUUID) {
    if (!containerUUID) {
        return {}
    }
    const data = {};
    data.publicKey = $(`#public-key-value-${containerUUID}`).val() || '';
    data.privateKey = $(`#private-key-value-${containerUUID}`).val() || '';
    if (data.privateKey) {
        data.wif = keyPairComponent.exportWIFText(containerUUID);
    }
    return data;
}

keyPairComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!containerUUID || !data) {
        return;
    }

    if (data.wif && data.wif.length) {
        $(`#wif-value-${containerUUID}`).val(data.wif);
        keyPairComponent.importWIFText(containerUUID);
    } else {
        $(`#public-key-value-${containerUUID}`).val(data.publicKey || '');
        $(`#private-key-value-${containerUUID}`).val(data.privateKey || '');
    }


}