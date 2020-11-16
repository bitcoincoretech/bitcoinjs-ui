signInputComponent.createNew = function createNew(op) {
    return `
        <input hidden id="base64-psbt-${op.containerUUID}">
        <input hidden id="psbt-phase-${op.containerUUID}">

        <div class="row mb-3 role-sign-${op.containerUUID} read-only-hide-${op.containerUUID}">
            <div class="col-sm-2"><label>Key for Signing</label></div>
            <div class="col-sm-4">
                <select id="key-list-${op.containerUUID}"  class="form-control">
                    <option value="">None</option>
                </select>
            </div>
            <div class="col-sm-6">
                <div id="sign-input-no-keys-${op.containerUUID}" class="alert alert-warning d-none">
                    No Keys have been added!
                </div>
                <div id="sign-input-select-key-${op.containerUUID}" class="alert alert-info d-none">
                    Select a key in order to sign an input.
                </div>
            </div>
        </div>

        <div id="inputs-list-container-${op.containerUUID}"></div>
    `;
}

signInputComponent.createNewInputEntry = function createNewInputEntry(containerUUID, data) {
    return `
        <table class="table table-sm shadow mb-5">
            <thead class="thead-light">
                <tr class="d-flex">
                    <th class="col-sm-6">
                        <span>Input [${data.index}]</span>
                    </th>
                    <th class="col-sm-6">
                        <button onclick="signInputComponent.signInput('${data.inputContainerUUID}', ${data.index})" 
                            type="button" class="btn btn-warning btn-sm float-right button120 role-sign-${data.inputContainerUUID} read-only-hide-${data.inputContainerUUID}">
                            Sign
                            <i class="fas fa-signature ml-1"></i>
                        </button>
                        <button onclick="signInputComponent.finalizeInput('${data.inputContainerUUID}', ${data.index})" 
                            type="button" class="btn btn-success btn-sm float-right button120 role-finalize-${data.inputContainerUUID} read-only-hide-${data.inputContainerUUID}">
                            Finalize
                            <i class="fas fa-check ml-1"></i>
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody id="input-signature-container-${containerUUID}">
        
            </tbody>
        </table>
    `
}

signInputComponent.createNewSignatureEntry = function createNewSignatureEntry(containerUUID, data) {
    return `
        <tr class="d-flex">
            <td class="col-sm-2">
                
            </td>
            <td class="col-sm-10">
                <table class="table table-sm small shadow">
                    <thead class="thead-light">
                        <tr class="d-flex small">
                            <th class="col-sm-6">
                                <span id="signature-index-${containerUUID}">Signer</span>
                            </th>
                            <th class="col-sm-6">
                                
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="d-flex">
                            <td class="col-sm-2">
                                <label>Public Key</label>
                            </td>
                            <td class="col-sm-10">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Hex</span>
                                    </div>
                                    <textarea id="public-key-${containerUUID}" disabled="true" rows="1"
                                        class="form-control asm">${data.publicKey || ''}</textarea>
                                </div>
                            </td>
                        </tr>
                        
                        <tr id="signature-row-${containerUUID}" class="d-flex">
                            <td class="col-sm-2">
                                <label>Signature</label>
                            </td>
                            <td class="col-sm-10">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Hex</span>
                                    </div>
                                    <textarea id="signature-value-${containerUUID}" disabled="true" rows="2"
                                        class="form-control asm">${data.signature || ''}</textarea>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
            
        </tr>
    `;
}

signInputComponent.createSighash = function createSighash(containerUUID, data) {
    return `
        <tr class="d-flex">
            <td class="col-sm-2">
                <label>Sighash</label>
            </td>
            <td class="col-sm-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Hex</span>
                    </div>
                    <input type="text" disabled id="input-sighash-${containerUUID}" value="${data.sighashValueHex || 'default (0x1)'}" 
                        class="form-control asm">
                    <input type="number" hidden id="input-sighash-value-${containerUUID}" value="${data.sighashValue || ''}">
                    <div class="input-group-append read-only-hide-${containerUUID}">
                        <button id="input-sighash-update-button-${containerUUID}" onclick="signInputComponent.updateSighash('${data.containerUUID}', '${containerUUID}', ${data.index})" 
                            class="btn btn-success d-none">
                            OK
                        </button>
                        <button id="input-sighash-toggle-button-${containerUUID}" type="button" onclick="signInputComponent.toggleSighash('${containerUUID}')"
                            class="btn btn-info">
                            More
                        </button>
                    </div>
                </div>
            </td>
            <td class="col-sm-6">
            </td>
        </tr>
        <tr id="input-sighash-details-${containerUUID}" class="d-none">
            <td class="col-sm-2"> </td>
            <td class="col-sm-10">
                <div class="alert alert-info">
                Click OK to update!
                </div>
                <div id="input-sighash-container-${containerUUID}" class="mr-5"> </div>
                <div class="alert alert-info mt-3">
                    Click OK to update!
                </div>
            </td>
        </tr>`;
}

signInputComponent.createExternalMenu = function createExternalMenu(op) {
    return `
        <div class="read-only-hide-${op.containerUUID}">
            <button onclick="signInputComponent.signInput('${op.containerUUID}')" 
                type="button" class="btn btn-warning button120 role-sign-${op.containerUUID}">
                Sign All
                <i class="fas fa-signature ml-1"></i>
            </button>
            <button onclick="signInputComponent.finalizeInput('${op.containerUUID}')" 
                type="button" class="btn btn-success role-finalize-${op.containerUUID} read-only-hide-${op.containerUUID}">
                Finalize All
                <i class="fas fa-check ml-1"></i>
            </button>
        </div>
`;
}

signInputComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!containerUUID || !data) {
        return;
    }
    $(`#inputs-list-container-${containerUUID}`).empty();

    const keyPairs = (data.keys || []).filter(keyPair => (keyPair && keyPair.publicKey));
    if (!keyPairs.length) {
        $(`#sign-input-no-keys-${containerUUID}`).removeClass('d-none');
        $(`#sign-input-select-key-${containerUUID}`).addClass('d-none');
    } else {
        $(`#sign-input-no-keys-${containerUUID}`).addClass('d-none');
        $(`#sign-input-select-key-${containerUUID}`).removeClass('d-none');
    }
    $(`#key-list-${containerUUID}`).empty();
    $(`#key-list-${containerUUID}`).append(`<option value="">None</option>`)
    keyPairs.forEach(keyPair => {
        $(`#key-list-${containerUUID}`).append(`<option value="${keyPair.id}">${keyPair.name || keyPair.publicKey.substring(0,20)}</option>`)
    });
    if (data.selectedKeyId) {
        $(`#key-list-${containerUUID}`).val(data.selectedKeyId);
    }

    $(`#base64-psbt-${containerUUID}`).val(data.psbtBase64 || '');
    const network = networkComponent.htmlToData('default');
    const psbt = data.psbtBase64 ? bitcoinjs.Psbt.fromBase64(data.psbtBase64, {
        network
    }) : null;

    if (!psbt) {
        return;
    }

    const tx = _extractTx();
    (psbt.data.inputs || []).forEach((input, index) => {
        const inputContainerUUID = uuidv4();
        const inputEntryHtml = signInputComponent.createNewInputEntry(inputContainerUUID, {
            index,
            inputContainerUUID: containerUUID
        });
        $(`#inputs-list-container-${containerUUID}`).append(inputEntryHtml);
        if (input.finalScriptSig || input.finalScriptWitness) {
            if (input.finalScriptSig && input.finalScriptSig.length) {
                const scriptSigAsm = bitcoinjs.script.toASM(input.finalScriptSig);
                const unlockScriptHtml = _wrapInTable('Unlock Script', asmToHtml(scriptSigAsm.split(' ')).join(''));
                $(`#input-signature-container-${inputContainerUUID}`).append(unlockScriptHtml);
            }

            if (input.finalScriptWitness && input.finalScriptWitness.length) {
                const witness = tx && tx.ins[index].witness;
                const witnessAsm = witness ? bitcoinjs.script.toASM(witness) : '';
                const witnessScriptHtml = _wrapInTable('Witness', asmToHtml(witnessAsm.split(' ')).join(''));
                $(`#input-signature-container-${inputContainerUUID}`).append(witnessScriptHtml);
            }
            return;
        }

        $(`#input-signature-container-${inputContainerUUID}`).append(signInputComponent.createSighash(inputContainerUUID, {
            containerUUID,
            index,
            sighashValue: input.sighashType ? input.sighashType : '',
            sighashValueHex: input.sighashType ? `0x${input.sighashType.toString('16')}` : ''
        }));

        (input.bip32Derivation || []).map(derivation => ({
            fingerprint: (derivation.masterFingerprint || '').toString('hex'),
            path: derivation.path,
            publicKey: (derivation.pubkey || '').toString('hex'),
        })).forEach(keyPair => {
            const partialSig = (input.partialSig || []).find(sig => (sig.pubkey || '').toString('hex') === keyPair.publicKey) || '';
            keyPair.signature = partialSig ? ((partialSig.signature || '').toString('hex')) : '';
            const signContainerUUID = uuidv4();
            const signEntryHtml = signInputComponent.createNewSignatureEntry(signContainerUUID, keyPair);
            $(`#input-signature-container-${inputContainerUUID}`).append(signEntryHtml);
        });
    });

    function _wrapInTable(title, content) {
        return `
            <tr class="d-flex">
                <td class="col-sm-1"> </td>
                <td class="col-sm-11">
                    <table class="table table-sm">
                        <thead>
                            <tr class="d-flex small thead-light">
                                <th class="col-sm-12">  <span>${title}</span> </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="d-flex">
                                <td class="col-sm-12">
                                    <span class="asm">${content}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        `
    }

    function _extractTx() {
        try {
            return psbt.extractTransaction(true);
        } catch (err) {}
    }
}

signInputComponent.htmlToData = function htmlToData(containerUUID) {
    if (!containerUUID) {
        return;
    }
    return {
        psbtBase64: $(`#base64-psbt-${containerUUID}`).val() || ''
    };
}

signInputComponent.setRole = function setRole(containerUUID, role) {
    role = role || $(`#psbt-phase-${containerUUID}`).val(role) || 'no-role';

    $(`.role-sign-${containerUUID}`).addClass('d-none');
    $(`.role-combine-${containerUUID}`).addClass('d-none');
    $(`.role-finalize-${containerUUID}`).addClass('d-none');

    if (role === 'sign') {
        $(`.role-sign-${containerUUID}`).removeClass('d-none');
    } else if (role === 'finalize') {
        $(`.role-finalize-${containerUUID}`).removeClass('d-none');
    }
}

signInputComponent.setReadOnly = function setReadOnly(containerUUID, isReadOnly = false) {
    if (isReadOnly === true) {
        $(`.read-only-disable-${containerUUID}`).prop('disabled', true);
        $(`.read-only-hide-${containerUUID}`).addClass('d-none')
    } else {
        $(`.read-only-disable-${containerUUID}`).prop('disabled', false);
        $(`.read-only-hide-${containerUUID}`).removeClass('d-none');
    }
}