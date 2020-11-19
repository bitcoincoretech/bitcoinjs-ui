paymentComponent.createNew = function createNew(op) {
    return `
        <div id="payment-container-${op.containerUUID}">
            <input hidden id="witness-script-value-${op.containerUUID}">
            <input hidden id="is-read-only-${op.containerUUID}" value="false">
            <table class="table table-sm p-4 mb-4 border-left border-right border-bottom">
                <thead>
                    <tr class="d-flex thead-dark">
                        <th class="col-sm-2 rounded-left">Property</th>
                        <th class="col-sm-5">Provided Value</th>
                        <th class="col-sm-5 rounded-right">Computed Value</th>
                    </tr>
                    <tr id="payment-type-${op.containerUUID}Row" class="d-flex">
                        <td class="col-sm-2">
                            <label>Payment Type</label>
                        </td>
                        <td class="col-sm-5">
                            <select id="payment-type-${op.containerUUID}" onchange="paymentComponent.changePaymentType('${op.containerUUID}', this.value, ${op.txLocation || ''})"
                            class="form-control read-only-disable-${op.containerUUID}">
                                <option value="nonstandard">Nonstandard</option>
                                <option value="embed">Embed</option>
                                <option value="p2pk">P2PK (Pay to Public Key)</option>
                                <option value="p2pkh">P2PKH (Pay to Public Key Hash)</option>
                                <option value="p2sh">P2SH (Pay to Script Hash)</option>
                                <option value="p2ms">P2MS (Pay To Multisig)</option>
                                <option value="p2wpkh">P2WPKH (Pay to Witness Public Key Hash)</option>
                                <option value="p2wsh">P2WSH (Pay to Witness Script Hash)</option>
                            </select>
                            <input type="text" hidden id="tx-location-${op.containerUUID}">
                        </td>
                        <td class="col-sm-5">
                            <h5>
                                <span id="payment-type-${op.containerUUID}-expect"
                                class="asm break-long-words badge badge-secondary text-wrap text-left"></span>
                            </h5>
                        </td>
                    </tr>
                </thead>
                <tbody id="paymentFields-${op.containerUUID}">
                    <tr id="pubkey-${op.containerUUID}Row" class="d-flex  ${op.containerUUID}Row">
                        <td class="col-sm-2">
                            <label>Public Key</label>
                        </td>
                        <td class="col-sm-5">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">hex</span>
                                </div>
                                <textarea id="pubkey-${op.containerUUID}" rows="3" class="form-control asm read-only-disable-${op.containerUUID}" ></textarea>
                                <input hidden id="pubkey-fingerprint-${op.containerUUID}">
                                <input hidden id="pubkey-path-${op.containerUUID}">
                                <div class="input-group-append">
                                    <button id="single-pubkey-update-button-${op.containerUUID}" onclick="paymentComponent.updateSinglePublicKeyDetails('${op.containerUUID}', '${op.containerUUID}')" 
                                        class="btn btn-success d-none read-only-hide-${op.containerUUID}">
                                        OK
                                    </button> 
                                    <button id="single-pubkey-toggle-button-${op.containerUUID}" onclick="paymentComponent.toggleSinglePublicKeyDetails('${op.containerUUID}', '${op.containerUUID}')"
                                        class="btn btn-info">
                                        More
                                    </button>  
                                </div>
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="pubkey-${op.containerUUID}-expect" class="asm break-long-words badge badge-secondary text-wrap text-left"></span>
                                <input hidden id="pubkey-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="pubkey-details-${op.containerUUID}Row" class="d-none ${op.containerUUID}Row">
                        <td class="col-sm-2"></td>
                        <td class="col-sm-10">
                            <div class="alert alert-info">
                                Click OK to update!
                            </div>
                            <div id="pubkey-details-container-${op.containerUUID}" class="table-active p-3"> </div>
                            <div class="alert alert-info mt-3">
                                Click OK to update!
                            </div>
                        </td>
                    </tr>
                    <tr id="address-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2">
                            <label>Address</label>
                        </td>
                        <td class="col-sm-5">
                            <div class="input-group ">
                                <div class="input-group-prepend">
                                    <span id="address-type-${op.containerUUID}" class="input-group-text">text</span>
                                </div>
                                <textarea id="address-${op.containerUUID}" rows="2" class="form-control asm read-only-disable-${op.containerUUID}"></textarea>
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="address-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="address-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="hash-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"><label>Hash</label></td>
                        <td class="col-sm-5">
                            <div class="input-group ">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">hex</span>
                                </div>
                                <textarea id="hash-${op.containerUUID}" rows="2" class="form-control asm read-only-disable-${op.containerUUID}"></textarea>
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="hash-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="hash-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="n-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"><label>Public Keys (N)</label></td>
                        <td class="col-sm-5">
                            <div class="input-group ">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">number</span>
                                </div>
                                <input type="number" id="n-${op.containerUUID}" class="form-control asm read-only-disable-${op.containerUUID}">
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="n-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="n-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="pubkeys-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"> <label>Public Keys</label> </td>
                        <td class="col-sm-5">
                            <div>
                                <button id="pubkeys-${op.containerUUID}Add" type="button"
                                    onclick="paymentComponent.addNewPublicKey('${op.containerUUID}')" 
                                    class="btn btn-info btn-sm float-right read-only-hide-${op.containerUUID}">Add Public Key</button>
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="pubkeys-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="pubkeys-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="m-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"><label>Signatures (M)</label></td>
                        <td class="col-sm-5">
                            <div class="input-group ">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">number</span>
                                </div>
                                <input type="number" id="m-${op.containerUUID}" class="form-control asm read-only-disable-${op.containerUUID}">
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="m-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="m-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="signatures-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"> <label>Signatures</label> </td>
                        <td class="col-sm-5">
                            <div class="row">
                                <div class="col-sm-12 mb-2">
                                    <button id="signatures-${op.containerUUID}Add" onclick="paymentComponent.addNewSignature('${op.containerUUID}')" type="button"
                                        class="btn btn-info btn-sm float-right read-only-hide-${op.containerUUID}">
                                        Add Signature
                                    </button>
                                </div>
                            </div>
                            <div id="signature-list-${op.containerUUID}">
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="signatures-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="signatures-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="input-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2">
                            <label>Input</label>
                        </td>
                        <td class="col-sm-5">
                            <div class="input-group ">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">asm</span>
                                </div>
                                <textarea id="input-${op.containerUUID}"  rows="5" class="form-control asm read-only-disable-${op.containerUUID}"></textarea>
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="input-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="input-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="signature-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"><label>Signature</label></td>
                        <td class="col-sm-5">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">hex</span>
                                </div>
                                <textarea id="signature-${op.containerUUID}" rows="2" class="form-control asm read-only-disable-${op.containerUUID}"></textarea>
                                <div class="input-group-append">
                                    <button id="signature-details-toggle-button-${op.containerUUID}" onclick="paymentComponent.toggleSignatureDetails('${op.containerUUID}')" class="btn btn-info">
                                        More
                                    </button>
                                </div>
                            </div>
                            <div id="signature-details-container-${op.containerUUID}" class="d-none">
                                Public Key: <span id="signature-public-key-${op.containerUUID}" class="asm break-long-words badge badge-secondary text-wrap text-left"></span>
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="signature-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="signature-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                    <tr id="output-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"><label>Output</label></td>
                        <td class="col-sm-5">
                            <div class="input-group ">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">asm</span>
                                </div>
                                <textarea id="output-${op.containerUUID}" rows="5" class="form-control asm read-only-disable-${op.containerUUID}" ></textarea>
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div class="row">
                                <div class="col-sm-12">
                                    <span id="output-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                    <input hidden id="output-${op.containerUUID}-expect-value">
                                </div>
                                <div class="col-sm-12 mt-3">
                                    <div class="float-right" id="wrap-script-actions-${op.containerUUID}">
                                        <button onclick="paymentComponent.wrappScript('${op.containerUUID}', 'p2sh')" type="button" 
                                            class="btn btn-info btn-sm read-only-hide-${op.containerUUID}">Wrap in P2SH
                                        </button>
                                        <button onclick="paymentComponent.wrappScript('${op.containerUUID}', 'p2wsh')" type="button" 
                                            class="btn btn-info btn-sm read-only-hide-${op.containerUUID}">Wrap in P2WSH
                                        </button>
                                    </div>        
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr id="data-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"> <label>Data</label> </td>
                        <td class="col-sm-5">
                            <div class="row">
                                <div class="col-sm-12 mb-2">
                                    <button id="data-${op.containerUUID}Add" onclick="paymentComponent.addNewDataEntry('${op.containerUUID}')" type="button"
                                        class="btn btn-info btn-sm float-right button120 read-only-hide-${op.containerUUID}">
                                        Add Data
                                    </button>
                                </div>
                            </div>
                            <div id="data-list-${op.containerUUID}">
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="data-entry-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="data-entry-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>

                    <tr id="redeem-${op.containerUUID}Row" class="thead-light ${op.containerUUID}Row">
                        <td colspan="3" class="w-100">
                            <table class="table table-sm ml-3 shadow p-4 mb-4 border-left border-bottom w-95">
                                <thead class="thead-light">
                                    <tr>
                                        <th colspan="3">Redeem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="redeem-input-${op.containerUUID}Row" class="d-flex">
                                        <td class="col-sm-2"><label>Input</label></td>
                                        <td class="col-sm-5">
                                            <div class="input-group ">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">asm</span>
                                                </div>
                                                <textarea id="redeem-input-${op.containerUUID}"  rows="5"
                                                    class="form-control asm read-only-disable-${op.containerUUID}"></textarea>
                                            </div>
                                        </td>
                                        <td class="col-sm-5">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <span id="redeem-input-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                                    <input hidden id="redeem-input-${op.containerUUID}-expect-value">
                                                </div>
                                                <div class="col-sm-12 mt-3">
                                                    <div class="float-right" id="unwrap-input-script-actions-${op.containerUUID}">
                                                        <button onclick="paymentComponent.unwrapScript('${op.containerUUID}', 'in')" type="button" 
                                                            class="btn btn-info btn-sm read-only-hide-${op.containerUUID}">Unwrap Input
                                                        </button>
                                                    </div>        
                                                </div>
                                            </div>
                                        </td>
                                        
                                    </tr>
                                    <tr id="redeem-output-${op.containerUUID}Row" class="d-flex">
                                        <td class="col-sm-2"><label>Output</label></td>
                                        <td class="col-sm-5">
                                            <div class="input-group ">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">asm</span>
                                                </div>
                                                <textarea id="redeem-output-${op.containerUUID}" rows="5" 
                                                    class="form-control asm read-only-disable-${op.containerUUID}"></textarea>
                                            </div>
                                        </td>
                                        <td class="col-sm-5">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <span id="redeem-output-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                                    <input hidden id="redeem-output-${op.containerUUID}-expect-value">
                                                </div>
                                                <div class="col-sm-12 mt-3">
                                                    <div class="float-right" id="unwrap-output-script-actions-${op.containerUUID}">
                                                        <button onclick="paymentComponent.unwrapScript('${op.containerUUID}', 'out')" type="button" 
                                                            class="btn btn-info btn-sm read-only-hide-${op.containerUUID}">Unwrap Output
                                                        </button>
                                                    </div>        
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="redeem-witness-${op.containerUUID}Row" class="d-flex">
                                        <td class="col-sm-2"> 
                                        <label>Witness</label> 
                                        <i class="fas fa-eye"></i>
                                        </td>
                                        <td class="col-sm-5">
                                            <div>
                                                <button onclick="paymentComponent.addNewWitnessData('redeem-${op.containerUUID}')" type="button"
                                                    class="btn btn-info btn-sm float-right mb-2 read-only-hide-${op.containerUUID}">
                                                    Add Witness Data</button>
                                            </div>
                                            <div id="witness-list-redeem-${op.containerUUID}">
                                            </div>
                                        </td>
                                        <td class="col-sm-5">
                                            <div>
                                                <span id="redeem-witness-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                                <input hidden id="redeem-witness-${op.containerUUID}-expect-value">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr id="witness-${op.containerUUID}Row" class="d-flex ${op.containerUUID}Row">
                        <td class="col-sm-2"> 
                            <label>Witness</label> 
                            <i class="fas fa-eye"></i>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <button id="witness-${op.containerUUID}Add"
                                    onclick="paymentComponent.addNewWitnessData('${op.containerUUID}')" type="button"
                                    class="btn btn-info btn-sm float-right mb-2 read-only-hide-${op.containerUUID}">
                                Add Witness Data</button>
                            </div>
                            <div id="witness-list-${op.containerUUID}">
                            </div>
                        </td>
                        <td class="col-sm-5">
                            <div>
                                <span id="witness-${op.containerUUID}-expect" class="asm break-long-words"></span>
                                <input hidden id="witness-${op.containerUUID}-expect-value">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

paymentComponent.createExternalMenu = function createExternalMenu(op) {
    return `
        <button type="button" onclick="paymentComponent.updateComputedValues('${op.containerUUID}')" 
            class="btn btn-info button120 read-only-hide-${op.containerUUID}">
            Check
        </button>
        <button type="button" onclick="paymentComponent.clear('${op.containerUUID}')" 
            class="btn btn-secondary ml-3 button120 read-only-hide-${op.containerUUID}">
            Clear
            <i class="fas fa-eraser"></i>
        </button>
    `;
}

paymentComponent.dataToHtml = function dataToHtml(containerUUID, data = {}, updateProvidedValues = false) {
    if (!containerUUID) {
        return;
    }
    $(`#payment-type-${containerUUID}-expect`).text(data.paymentType || data.name || '');

    $(`#pubkey-${containerUUID}-expect`).text((data.pubkey || '').toString('hex'));
    $(`#pubkey-${containerUUID}-expect-value`).val((data.pubkey || '').toString('hex'));
    const publicKeyDetails = data.publicKeyDetails || (data.publicKeysList || [])[0];
    if (publicKeyDetails) {
        $(`#pubkey-${containerUUID}`).val(publicKeyDetails.publicKey || '');
        $(`#pubkey-fingerprint-${containerUUID}`).val(publicKeyDetails.fingerprint || '');
        $(`#pubkey-path-${containerUUID}`).val(publicKeyDetails.path || '');
    }

    $(`#address-${containerUUID}-expect`).text((data.address || '').toString('hex'));
    $(`#address-${containerUUID}-expect-value`).val((data.address || '').toString('hex'));
    updateProvidedValues ? $(`#address-${containerUUID}`).val((data.address || '').toString('hex')) : null;


    $(`#hash-${containerUUID}-expect`).text((data.hash || '').toString('hex'));
    $(`#hash-${containerUUID}-expect-value`).val((data.hash || '').toString('hex'));
    updateProvidedValues ? $(`#hash-${containerUUID}`).val((data.hash || '').toString('hex')) : null;

    $(`#n-${containerUUID}-expect`).text(data.n || '');
    $(`#n-${containerUUID}-expect-value`).val(data.n || '');
    updateProvidedValues ? $(`#n-${containerUUID}`).val(data.n || '') : null;

    const pubKeysHex = (data.pubkeys || []).map(v => v.toString('hex'));
    $(`#pubkeys-${containerUUID}-expect`).html(asmToHtml(pubKeysHex));
    $(`#pubkeys-${containerUUID}-expect-value`).val(pubKeysHex.join(' '));

    $(`.public-key-row-${containerUUID}`).remove();
    (data.publicKeysList || []).forEach(publicKeyDetails => {
        paymentComponent.addNewPublicKey(containerUUID, publicKeyDetails);
    });
    if (data.paymentType !== 'p2ms') {
        $(`.public-key-row-${containerUUID}`).removeClass('d-flex').addClass('d-none');
    }

    $(`#m-${containerUUID}-expect`).text(data.m || '');
    $(`#m-${containerUUID}-expect-value`).val(data.m || '');
    updateProvidedValues ? $(`#m-${containerUUID}`).val(data.m || '') : null;

    const dataListHex = (data.data || []).map(v => v.toString('hex'));
    $(`#data-entry-${containerUUID}-expect`).html(asmToHtml(dataListHex));
    $(`#data-entry-${containerUUID}-expect-value`).val(dataListHex.join(' '));
    updateProvidedValues ? (dataListHex || []).forEach(v => {
        paymentComponent.addNewDataEntry(containerUUID, v);
    }) : null;


    const signaturesHex = (data.signatures || []).map(v => v.toString('hex'));
    $(`#signatures-${containerUUID}-expect`).html(asmToHtml(signaturesHex));
    $(`#signatures-${containerUUID}-expect-value`).val(signaturesHex.join(' '));


    (data.signaturesList || []).forEach(signatureDetails => {
        paymentComponent.addNewSignature(containerUUID, signatureDetails);
    });

    const inputAsm = (data.input && data.input.length) ? bitcoinjs.script.toASM(data.input) : '';
    $(`#input-${containerUUID}-expect`).html(asmToHtml(inputAsm.split(' ')));
    $(`#input-${containerUUID}-expect-value`).val(inputAsm);
    updateProvidedValues ? $(`#input-${containerUUID}`).val(inputAsm) : null;


    $(`#signature-${containerUUID}-expect`).text((data.signature || '').toString('hex'));
    $(`#signature-${containerUUID}-expect-value`).val((data.signature || '').toString('hex'));
    updateProvidedValues ? $(`#signature-${containerUUID}`).val((data.signature || '').toString('hex')) : '';

    const outputAsm = (data.output && data.output.length) ? bitcoinjs.script.toASM(data.output) : '';
    $(`#output-${containerUUID}-expect`).html(asmToHtml(outputAsm.split(' ')));
    $(`#output-${containerUUID}-expect-value`).val(outputAsm);
    updateProvidedValues ? $(`#output-${containerUUID}`).val(outputAsm) : '';

    if (outputAsm) {
        $(`#wrap-script-actions-${containerUUID}`).show();
    } else {
        $(`#wrap-script-actions-${containerUUID}`).hide();
    }

    if (data.redeem) {
        const redeemInputAsm = (data.redeem.input && data.redeem.input.length) ? bitcoinjs.script.toASM(data.redeem.input) : '';
        $(`#redeem-input-${containerUUID}-expect`).html(asmToHtml(redeemInputAsm.split(' ')));
        $(`#redeem-input-${containerUUID}-expect-value`).val(redeemInputAsm);
        updateProvidedValues ? $(`#redeem-input-${containerUUID}`).val(redeemInputAsm) : null;

        const redeemOutputAsm = (data.redeem.output && data.redeem.output.length) ? bitcoinjs.script.toASM(data.redeem.output) : '';
        $(`#redeem-output-${containerUUID}-expect`).html(asmToHtml(redeemOutputAsm.split(' ')));
        $(`#redeem-output-${containerUUID}-expect-value`).val(redeemOutputAsm);
        updateProvidedValues ? $(`#redeem-output-${containerUUID}`).val(redeemOutputAsm) : null;

        const witnessHex = (data.redeem.witness || []).map(v => v.toString('hex'));
        $(`#redeem-witness-${containerUUID}-expect`).html(asmToHtml(witnessHex));
        $(`#redeem-witness-${containerUUID}-expect-value`).val(witnessHex.join(' '));
        updateProvidedValues ? witnessHex.forEach(w => paymentComponent.addNewWitnessData(`redeem-${containerUUID}`, w)) : null;
    }

    $(`#witness-script-value-${containerUUID}`).val(data.witnessScript || '');

    if (data.redeem && data.redeem.input && data.redeem.input.length) {
        $(`#unwrap-input-script-actions-${containerUUID}`).show();
    } else {
        $(`#unwrap-input-script-actions-${containerUUID}`).hide();
    }

    if (data.redeem && data.redeem.output && data.redeem.output.length) {
        $(`#unwrap-output-script-actions-${containerUUID}`).show();
    } else {
        $(`#unwrap-output-script-actions-${containerUUID}`).hide();
    }

    const witnessHex = (data.witness || []).map(v => v.toString('hex'));
    $(`#witness-${containerUUID}-expect`).html(asmToHtml(witnessHex));
    $(`#witness-${containerUUID}-expect-value`).val(witnessHex.join(' '));
    updateProvidedValues ? witnessHex.forEach(w => paymentComponent.addNewWitnessData(containerUUID, w)) : null;
}

paymentComponent.htmlToData = function htmlToData(containerUUID) {
    if (!containerUUID) {
        return {}
    }
    const data = {
        paymentType: $(`#payment-type-${containerUUID}`).val(),
        publicKeyDetails: {
            publicKey: $(`#pubkey-${containerUUID}`).val() || '',
            fingerprint: $(`#pubkey-fingerprint-${containerUUID}`).val() || '',
            path: $(`#pubkey-path-${containerUUID}`).val()
        },
        publicKeysList: [],
        signaturesList: []
    };

    if (data.publicKeyDetails.publicKey) {
        data.pubkey = $(`#pubkey-${containerUUID}`).val().trim();
    }
    if ($(`#address-${containerUUID}`).val()) {
        data.address = $(`#address-${containerUUID}`).val().trim();
    }
    if ($(`#hash-${containerUUID}`).val()) {
        data.hash = $(`#hash-${containerUUID}`).val().trim();
    }
    if ($(`#n-${containerUUID}`).val()) {
        data.n = +$(`#n-${containerUUID}`).val().trim();
    }
    $(`.public-key-entry-${containerUUID}`).each(function () {
        const keyUUID = this.id.split("public-key-entry-container-")[1];
        if (!keyUUID) {
            return;
        }
        data.pubkeys = data.pubkeys || [];
        data.pubkeys.push(($(`#pubkey-${keyUUID}`).val() || '').trim());
        data.publicKeysList.push({
            publicKey: ($(`#pubkey-${keyUUID}`).val() || '').trim(),
            fingerprint: ($(`#pubkey-fingerprint-${keyUUID}`).val() || '').trim(),
            path: ($(`#pubkey-path-${keyUUID}`).val() || '').trim()
        });
    });
    if (!data.publicKeysList.length && (data.publicKeyDetails.fingerprint && data.publicKeyDetails.path)) {
        data.publicKeysList = [data.publicKeyDetails];
    }

    if ($(`#m-${containerUUID}`).val()) {
        data.m = +$(`#m-${containerUUID}`).val().trim();
    }
    $(`.signature-entry-${containerUUID}`).each(function () {
        const keyUUID = this.id.split("signature-entry-container-")[1];
        if (!keyUUID) {
            return;
        }
        data.signatures = data.signatures || [];
        data.signatures.push(($(`#signature-${keyUUID}`).val() || '').trim());
        data.signaturesList.push({
            signature: ($(`#signature-${keyUUID}`).val() || '').trim(),
            publicKey: ($(`#signature-public-key-${keyUUID}`).text() || '').trim()
        });
    });

    $(`.data-entry-${containerUUID}`).each(function () {
        const dataEntryUUID = this.id.split("data-entry-container-")[1];
        if (!dataEntryUUID) {
            return;
        }
        data.data = data.data || [];
        data.data.push(($(`#data-entry-${dataEntryUUID}`).val() || '').trim());
    });

    if ($(`#input-${containerUUID}`).val()) {
        data.input = $(`#input-${containerUUID}`).val().trim();
    }
    if ($(`#signature-${containerUUID}`).val()) {
        data.signature = $(`#signature-${containerUUID}`).val().trim();
    }
    if ($(`#output-${containerUUID}`).val()) {
        data.output = $(`#output-${containerUUID}`).val().trim();
    }

    if ($(`#redeem-input-${containerUUID}`).val()) {
        data.redeem = data.redeem || {};
        data.redeem.input = $(`#redeem-input-${containerUUID}`).val().trim();
    }
    if ($(`#redeem-output-${containerUUID}`).val()) {
        data.redeem = data.redeem || {};
        data.redeem.output = $(`#redeem-output-${containerUUID}`).val().trim();
    }
    data.witnessScript = ($(`#witness-script-value-${containerUUID}`).val() || '').trim();

    $(`.witness-entry-redeem-${containerUUID}`).each(function () {
        const keyUUID = this.id.split("witness-entry-container-")[1];
        if (!keyUUID) {
            return;
        }
        data.redeem = data.redeem || {};
        data.redeem.witness = data.redeem.witness || [];
        data.redeem.witness.push(($(`#witness-${keyUUID}`).val() || '').trim());
    });

    $(`.witness-entry-${containerUUID}`).each(function () {
        const keyUUID = this.id.split("witness-entry-container-")[1];
        if (!keyUUID) {
            return;
        }
        data.witness = data.witness || [];
        data.witness.push(($(`#witness-${keyUUID}`).val() || '').trim());
    });

    return data;

}


paymentComponent.setReadOnly = function setReadOnly(containerUUID, isReadOnly = false) {
    $(`#is-read-only-${containerUUID}`).val(isReadOnly);
    if (isReadOnly === true) {
        $(`.read-only-disable-${containerUUID}`).prop('disabled', true);
        $(`.read-only-hide-${containerUUID}`).hide();
    } else {
        $(`.read-only-disable-${containerUUID}`).prop('disabled', false);
        $(`.read-only-hide-${containerUUID}`).show();
    }
}