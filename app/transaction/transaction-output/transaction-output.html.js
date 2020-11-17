transactionOutputComponent.createNew = function createNew(op) {
    return `<div id="output-entry-${op.outputUUID}" class="output-entry-row">
                <input id="public-keys-list-${op.outputUUID}" hidden>
                <table class="table table-sm border-left border-right border-bottom">
                    <thead class="thead-light">
                        <tr class="d-flex">
                            <th class="col-sm-2">
                                <i id="label-collapsed-output-entry-data-${op.outputUUID}" style="display:none" onclick="expandBlock('output-entry-data-${op.outputUUID}')" class="far fa-caret-square-right"></i>
                                <i id="label-expanded-output-entry-data-${op.outputUUID}" onclick="collapseBlock('output-entry-data-${op.outputUUID}')" class="far fa-caret-square-down"></i>
                                <span id="output-entry-title-${op.outputUUID}">Output</span>
                            </th>
                            <th class="col-sm-10">
                                <div id="output-entry-header-container-${op.outputUUID}" class="read-only-hide-${op.outputUUID}"></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="output-entry-data-${op.outputUUID}">
                        <tr class="d-flex">
                            <td class="col-sm-2">
                                <label>Value (sats)</label>
                                <i class="fas fa-coins"></i>
                            </td>
                            <td class="col-sm-10">
                                <div >
                                    <div class="input-group w-50">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Int64</span>
                                        </div>
                                        <input type="number" min="0" max="2100000000000000" value="0" id="outs-value-${op.outputUUID}" 
                                            class="form-control asm read-only-disable-${op.outputUUID} role-create-${op.outputUUID}">
                                    </div>
                                    
                                </div>
                            </td>
                        </tr>
                        <tr class="d-flex role-update-${op.outputUUID}">
                            <td class="col-sm-2">
                                <label>Script</label>
                                <input hidden id="is-read-only-payment-${op.outputUUID}" value="false">
                            </td>
                            <td class="col-sm-10">
                                <div class="output-group">
                                    <table id="outs-script-container-${op.outputUUID}" class="table table-sm">
                                        <thead class="thead-light">
                                            <tr class="d-flex small">
                                                <th class="col-sm-4">
                                                    <span id="outs-script-type-${op.outputUUID}" class="badge badge-secondary"></span>
                                                    <span>Lock Script</span>
                                                </th>
                                                <th class="col-sm-8">
                                                    <div class="float-right">
                                                        <span id="outs-script-address-${op.outputUUID}" class="badge badge-secondary"></span>
                                                        
                                                        <i id="open-payment-${op.outputUUID}" 
                                                            onclick="transactionOutputComponent.openLockScriptModal('${op.outputUUID}')" 
                                                            class="fas fa-edit fa-lg ml-1 text-info pointer read-only-hide-${op.outputUUID}" 
                                                            data-toggle="modal" data-target="#modal-dialog">
                                                        </i>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="d-flex">
                                                <td class="col-sm-12">
                                                    <span id="outs-script-${op.outputUUID}" class="asm"></span>
                                                    <span id="outs-script-asm-${op.outputUUID}" hidden class="asm"></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table id="outs-redeem-script-container-${op.outputUUID}" class="table table-sm d-none">
                                        <thead class="thead-light">
                                            <tr class="d-flex small">
                                                <th class="col-sm-12">                                                    
                                                    <span id="outs-redeem-script-type-${op.outputUUID}" class="badge badge-secondary"></span>
                                                    <span>Redeem Script</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="d-flex">
                                                <td class="col-sm-12">
                                                    <span id="outs-redeem-script-${op.outputUUID}" class="asm"></span>
                                                    <span id="outs-redeem-script-asm-${op.outputUUID}" hidden class="asm"></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table id="outs-witness-script-container-${op.outputUUID}" class="table table-sm d-none">
                                        <thead class="thead-light">
                                            <tr class="d-flex small">
                                                <th class="col-sm-12">                                                    
                                                    <span id="outs-witness-script-type-${op.outputUUID}" class="badge badge-secondary"></span>
                                                    <span>Witness Script</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="d-flex">
                                                <td class="col-sm-12">
                                                    <span id="outs-witness-script-${op.outputUUID}" class="asm"></span>
                                                    <span id="outs-witness-script-asm-${op.outputUUID}" hidden class="asm"></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
}

transactionOutputComponent.dataToHtml = function dataToHtml(outputUUID, output) {
    if (!outputUUID || !output) {
        return;
    }

    $(`#outs-value-${outputUUID}`).val(output.value || 0);

    const scriptType = paymentComponent.classifyOutput(output.script);
    $(`#outs-script-type-${outputUUID}`).text(scriptType || '');

    if (!output.address && scriptType && scriptType !== 'nonstandard') {
        try {
            const outputPaymentData = bitcoinjs.payments[scriptType]({
                output: output.script,
                network: networkComponent.htmlToData('default')
            });
            output.address = (outputPaymentData.address || '').toString('hex');
        } catch (err) {
            console.warn(err);
        }
    }

    $(`#outs-script-address-${outputUUID}`).text(output.address || '');

    const lockScriptAsm = output.script ? bitcoinjs.script.toASM(output.script) : '';
    $(`#outs-script-asm-${outputUUID}`).text(lockScriptAsm);
    if (lockScriptAsm) {
        $(`#outs-script-${outputUUID}`).html(asmToHtml(lockScriptAsm.split(' ')));
    }

    const witnessScriptAsm = (output.witnessScript && output.witnessScript.length) ? bitcoinjs.script.toASM(output.witnessScript) : '';
    $(`#outs-witness-script-asm-${outputUUID}`).text(witnessScriptAsm);
    if (witnessScriptAsm) {
        $(`#outs-witness-script-${outputUUID}`).html(asmToHtml(witnessScriptAsm.split(' ')));
        const witnessScriptType = paymentComponent.classifyOutput(output.witnessScript);
        $(`#outs-witness-script-type-${outputUUID}`).text(witnessScriptType);
        $(`#outs-witness-script-container-${outputUUID}`).removeClass('d-none');
    } else {
        $(`#outs-witness-script-container-${outputUUID}`).addClass('d-none');
        $(`#outs-witness-script-type-${outputUUID}`).text('');
    }

    const redeemScriptAsm = (output.redeem && output.redeem.output) ? bitcoinjs.script.toASM(output.redeem.output) : '';
    $(`#outs-redeem-script-asm-${outputUUID}`).text(redeemScriptAsm);
    if (redeemScriptAsm) {
        $(`#outs-redeem-script-${outputUUID}`).html(asmToHtml(redeemScriptAsm.split(' ')));
        const redeemScriptType = paymentComponent.classifyOutput(output.redeem.output);
        $(`#outs-redeem-script-type-${outputUUID}`).text(redeemScriptType);

        $(`#outs-redeem-script-container-${outputUUID}`).removeClass('d-none');
        $(`#outs-witness-script-container-${outputUUID}`).addClass('d-none');
    } else {
        $(`#outs-redeem-script-container-${outputUUID}`).addClass('d-none');
        $(`#outs-redeem-script-type-${outputUUID}`).text('');
    }

    $(`#public-keys-list-${outputUUID}`).val(JSON.stringify(output.publicKeysList || []));
}

transactionOutputComponent.htmlToData = function htmlToData(outputUUID) {
    const outputData = {};

    outputData.value = +($(`#outs-value-${outputUUID}`).val() || 0);
    const scriptAsm = $(`#outs-script-asm-${outputUUID}`).text() || '';
    if (scriptAsm) {
        outputData.script = bitcoinjs.script.fromASM(scriptAsm);
    }
    outputData.scriptType = $(`#outs-script-type-${outputUUID}`).text() || '';

    const redeemScriptAsm = $(`#outs-redeem-script-asm-${outputUUID}`).text() || '';
    if (redeemScriptAsm) {
        outputData.redeem = {
            output: bitcoinjs.script.fromASM(redeemScriptAsm)
        };
        outputData.redeemScriptType = $(`#outs-redeem-script-type-${outputUUID}`).text() || '';
    }

    const witnessScriptAsm = $(`#outs-witness-script-asm-${outputUUID}`).text() || '';
    outputData.witnessScript = witnessScriptAsm ? bitcoinjs.script.fromASM(witnessScriptAsm) : null;
    outputData.witnessScriptType = $(`#outs-witness-script-type-${outputUUID}`).text() || '';

    const publicKeysList = $(`#public-keys-list-${outputUUID}`).val() || '';
    outputData.publicKeysList = publicKeysList ? JSON.parse(publicKeysList) : [];

    return outputData;
}

transactionOutputComponent.setReadOnly = function setReadOnly(outputUUID, isReadOnly = false, allowPaymentView = false) {
    if (isReadOnly === true) {
        $(`.read-only-disable-${outputUUID}`).prop('disabled', true);
        $(`.read-only-hide-${outputUUID}`).hide();
        $(`#open-payment-${outputUUID}`)[allowPaymentView ? 'show' : 'hide']();
        $(`#is-read-only-payment-${outputUUID}`).val(true);
    } else {
        $(`.read-only-disable-${outputUUID}`).prop('disabled', false);
        $(`.read-only-hide-${outputUUID}`).show();
        $(`#is-read-only-payment-${outputUUID}`).val(false);
    }


}

transactionOutputComponent.setRole = function setRole(outputUUID, role) {
    if (role === 'create') {} else if (role === 'update') {} else if (role === 'sign') {}
}