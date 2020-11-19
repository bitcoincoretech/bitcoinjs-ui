networkComponent.createNew = function createNew(op) {
    return `
        
        <div class="input-group mb-3 input-group-sm">
            <select id="network-${op.containerUUID}" class="form-control ">
                <option value="testnet">Test</option>
                <option value="bitcoin">Main</option>            
                <option value="regtest">Regression</option>
            </select>
            <div class="input-group-append">
                <label class="input-group-text" for="network-${op.containerUUID}">Network</label>
            </div>
        </div>
    `;
}

networkComponent.dataToHtml = function (containerUUID, data) {
    if (!containerUUID || !data) {
        return;
    }
    $(`#network-${containerUUID}`).val(data.network || 'testnet');
}

networkComponent.htmlToData = function htmlToData(containerUUID) {
    const networkName = $(`#network-${containerUUID}`).val();
    return bitcoinjs.networks[networkName] || bitcoinjs.networks.bitcoin;
}