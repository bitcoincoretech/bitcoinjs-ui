transactionInputComponent.createNew = function createNew(op) {
    return `
        <div id="input-entry-${op.inputUUID}">
            <input hidden id="previous-tx-hex-${op.inputUUID}">
            <input hidden id="public-keys-list-${op.inputUUID}">
            <input hidden id="signatures-list-${op.inputUUID}">
            <input hidden type="number" id="input-sighash-value-${op.inputUUID}">
            <input hidden id="is-read-only-${op.inputUUID}" value="false">
            <table class="table table-sm border-left border-bottom">
                <thead class="thead-light">
                    <tr class="d-flex">
                        <th class="col-sm-2">
                            <i id="label-collapsed-input-entry-data-${op.inputUUID}" style="display:none"
                                onclick="expandBlock('input-entry-data-${op.inputUUID}')"
                                class="far fa-caret-square-right"></i>
                            <i id="label-expanded-input-entry-data-${op.inputUUID}"
                                onclick="collapseBlock('input-entry-data-${op.inputUUID}')"
                                class="far fa-caret-square-down"></i>
                            <span id="input-entry-title-${op.inputUUID}">Input</span>

                        </th>
                        <th class="col-sm-10">
                            <div id="input-entry-header-container-${op.inputUUID}"
                                class="read-only-hide-${op.inputUUID} float-right">
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody id="input-entry-data-${op.inputUUID}">
                    <tr class="d-flex input-row-${op.inputUUID}">
                        <td class="col-sm-2"><label>Previous TX ID</label></td>
                        <td class="col-sm-10">
                            <div>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Hex</span>
                                    </div>
                                    <textarea id="ins-id-${op.inputUUID}" rows="2"
                                        class="form-control asm read-only-disable-${op.inputUUID}"></textarea>
                                    <div class="input-group-append">
                                        <button type="button" id="set-previous-tx-${op.inputUUID}"
                                            onclick="transactionInputComponent.openTransactionFromHexModal('${op.inputUUID}')"
                                            class="btn btn-sm btn-info read-only-hide-${op.inputUUID}"
                                            data-toggle="modal" data-target="#modal-dialog">
                                            Set TX
                                        </button>

                                        <button type="button" id="view-previous-tx-${op.inputUUID}"
                                            onclick="transactionInputComponent.openPreviousTxModal('${op.inputUUID}')"
                                            class="btn btn-info btn-sm d-none" data-toggle="modal"
                                            data-target="#modal-dialog">
                                            View TX
                                        </button>

                                        <button type="button" id="remove-previous-tx-${op.inputUUID}"
                                            onclick="transactionInputComponent.removePreviousTx('${op.inputUUID}')"
                                            class="btn btn-info btn-sm btn-danger d-none read-only-hide-${op.inputUUID}">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="d-flex input-row-${op.inputUUID} input-utxo-row-${op.inputUUID}">
                        <td class="col-sm-2">
                            <label>Previous Output Index</label>
                        </td>
                        <td class="col-sm-10">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Int32</span>
                                        </div>
                                        <input type="number" id="ins-index-${op.inputUUID}" min=0 value="0"
                                            onchange="transactionInputComponent.changePreviousOutputIndex('${op.inputUUID}')"
                                            class="form-control asm read-only-disable-${op.inputUUID}">

                                        <div class="input-group-append">
                                            <button id="utxo-details-update-button-${op.inputUUID}"
                                                onclick="transactionInputComponent.updateUTXODetails('${op.inputUUID}')"
                                                type="button" class="btn btn-success btn-sm d-none  read-only-hide-${op.inputUUID}">
                                                OK
                                            </button>
                                            <button id="utxo-details-toggle-button-${op.inputUUID}"
                                                onclick="transactionInputComponent.toggleUTXODetails('${op.inputUUID}')"
                                                type="button" class="btn btn-info btn-sm">
                                                More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <span id="utxo-script-type-label-${op.inputUUID}" class="badge badge-secondary"></span>
                                </div>
                            </div>
                            <div id="utxo-${op.inputUUID}-row" class="row mr-2 d-none">
                                <div class="col-sm-12">
                                    <div class="alert alert-info  mt-2">
                                            Click OK to update!
                                    </div>
                                    <div id="utxo-details-container-${op.inputUUID}" class="shadow mb-2 mt-2 mr-2">
                                    </div>
                                    <div class="d-none">
                                        ${transactionOutputComponent.createNew({outputUUID: 'utxo-details-' + op.inputUUID})}
                                    </div>
                                    <div class="alert alert-info mt-2">
                                        Click OK to update!
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="d-flex input-row-${op.inputUUID}">
                        <td class="col-sm-2">
                            <label>Sequence</label>
                        </td>
                        <td class="col-sm-10">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Int32</span>
                                        </div>
                                        <input onchange="syncHexValue('ins-sequence-hex-${op.inputUUID}', this.value)"
                                            value="4294967295" type="number" id="ins-sequence-${op.inputUUID}" min=0
                                            class="form-control asm read-only-disable-${op.inputUUID}">
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="pt-1">
                                        <span> hex: </span>
                                        <span id="ins-sequence-hex-${op.inputUUID}" class="asm"> 0xffffffff</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="d-flex input-row-${op.inputUUID}">
                        <td class="col-sm-2">
                            <label>Script</label>
                        </td>
                        <td class="col-sm-10">
                            <div class="row"> 
                                <div class="col-sm-12">
                                    <span id="coinbase-data-${op.inputUUID}" class="badge badge-secondary d-none"></span>
                                    <table id="ins-script-sig-container-${op.inputUUID}" class="table table-sm shadow">
                                        <thead>
                                            <tr class="d-flex small thead-light">
                                                <th class="col-sm-6">
                                                    <span id="script-type-label-${op.inputUUID}" class="badge badge-secondary mr-3"></span>
                                                    <span>Unlock Script</span>
                                                </th>
                                                
                                                <th class="col-sm-6">
                                                    <i onclick="transactionInputComponent.openUnlockScriptModal('${op.inputUUID}')"
                                                        class="far fa-edit fa-lg pointer mr-3 pt-1 text-info float-right read-only-hide-${op.inputUUID} open-payment-${op.inputUUID}"
                                                        data-toggle="modal" data-target="#modal-dialog"></i>
                                                </th>
                                            </tr>
                                            
                                        </thead>
                                        <tbody>
                                            <tr class="d-flex">
                                                <td class="col-sm-12">
                                                    <span id="ins-script-sig-${op.inputUUID}" class="asm"></span>
                                                    <span id="ins-script-sig-asm-${op.inputUUID}" hidden></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table id="ins-redeem-script-container-${op.inputUUID}" class="table table-sm d-none shadow">
                                        <thead class="thead-light">
                                            <tr class="d-flex small">
                                                <th class="col-sm-12">
                                                    <span id="redeem-script-type-label-${op.inputUUID}" class="badge badge-secondary mr-3"></span>
                                                    <span>Redeem Script</span>
                                                    <i onclick="transactionInputComponent.openRedeemScriptModal('${op.inputUUID}')"
                                                        class="far fa-edit fa-lg text-info float-right mr-3 pt-1 pointer read-only-hide-${op.inputUUID} open-payment-${op.inputUUID}"
                                                        data-toggle="modal" data-target="#modal-dialog">
                                                    </i>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="d-flex">
                                                <td class="col-sm-12">
                                                    <span id="ins-redeem-script-${op.inputUUID}" class="asm"></span>
                                                    <span id="ins-redeem-script-asm-${op.inputUUID}" hidden></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table id="ins-witness-script-container-${op.inputUUID}" class="table table-sm d-none shadow">
                                        <thead class="thead-light">
                                            <tr class="d-flex small">
                                                <th class="col-sm-12">
                                                    <span id="witness-script-type-label-${op.inputUUID}" class="badge badge-secondary mr-3"></span>
                                                    <span>Witness Script</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="d-flex">
                                                <td class="col-sm-12">
                                                    <span id="ins-witness-script-${op.inputUUID}" class="asm"></span>
                                                    <span id="ins-witness-script-asm-${op.inputUUID}" hidden></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="d-flex input-row-${op.inputUUID}">
                        <td class="col-sm-2">
                            <label>Witness</label>
                            <span id="ins-witness-type-${op.inputUUID}" class="badge badge-secondary"></span>
                        </td>
                        <td class="col-sm-10">
                            <div>
                                <span id="ins-witness-${op.inputUUID}" class="asm break-long-words"></span>
                                <input hidden id="ins-witness-value-${op.inputUUID}">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;
}

transactionInputComponent.dataToHtml = function dataToHtml(inputUUID, inputData) {
    if (!inputUUID || !inputData) {
        return;
    }

    const previousTxId = inputData.hash ? reverseBuffer(inputData.hash).toString('hex') : '';
    const isCoinbaseInput = previousTxId === '0000000000000000000000000000000000000000000000000000000000000000';
    $(`#ins-id-${inputUUID}`).val(previousTxId);

    $(`#ins-index-${inputUUID}`).val(inputData.index || 0);
    $(`#ins-sequence-${inputUUID}`).val(inputData.sequence);
    $(`#ins-sequence-${inputUUID}`).change();

    if (inputData.sighashType) {
        $(`#input-sighash-value-${inputUUID}`).val(inputData.sighashType);
    }

    if (inputData.utxo) {
        transactionOutputComponent.dataToHtml(`utxo-details-${inputUUID}`, inputData.utxo);
    }

    $(`#previous-tx-hex-${inputUUID}`).val(inputData.previousTxHex || '');
    if (inputData.previousTxHex) {
        const tx = bitcoinjs.Transaction.fromHex(inputData.previousTxHex);
        _updateFieldsForPreviousTx(inputUUID, tx);
    } else {
        _cleanPreviousTxValues(inputUUID);
    }

    const utxo = transactionOutputComponent.htmlToData(`utxo-details-${inputUUID}`);
    if (utxo.script || utxo.redeem || utxo.witnessScript) {
        inputData.scriptType = utxo.scriptType;
        if (utxo.scriptType === 'p2sh') {
            if (utxo.redeemScriptType === 'p2wsh') {
                inputData.scriptType = 'p2wsh';
                if (utxo.witnessScript && utxo.witnessScript.length) {
                    inputData.witnessScript = utxo.witnessScript;
                    inputData.witnessScriptType = utxo.witnessScriptType;
                }
            } else {
                inputData.redeemScript = utxo.redeem && utxo.redeem.output;
                inputData.redeemScriptType = utxo.redeemScriptType;
            }
        } else if (utxo.scriptType === 'p2wsh') {
            inputData.witnessScript = utxo.witnessScript;
            inputData.witnessScriptType = utxo.witnessScriptType;
        } else {
            delete inputData.redeemScript;
            delete inputData.redeemScriptType;
        }
    }

    const utxoScriptType = utxo.scriptType + (utxo.redeemScriptType ? `-${utxo.redeemScriptType}` : '');
    $(`#utxo-script-type-label-${inputUUID}`).text(utxoScriptType || '');


    if (isCoinbaseInput) {
        const coinbaseData = (inputData.script && inputData.script.length) ? inputData.script.toString('hex') : '';
        $(`#coinbase-data-${inputUUID}`).text(coinbaseData);
        $(`#coinbase-data-${inputUUID}`).removeClass('d-none');
        $(`#ins-script-sig-container-${inputUUID}`).addClass('d-none');
    } else {
        const scriptSigAsm = (inputData.script && inputData.script.length) ? bitcoinjs.script.toASM(inputData.script) : '';
        $(`#ins-script-sig-${inputUUID}`).html(scriptSigAsm ? asmToHtml(scriptSigAsm.split(' ')) : '');
        $(`#ins-script-sig-asm-${inputUUID}`).text(scriptSigAsm);
        $(`#ins-script-sig-container-${inputUUID}`).removeClass('d-none');
        $(`#coinbase-data-${inputUUID}`).addClass('d-none');

        if (scriptSigAsm) {
            $(`#script-type-label-${inputUUID}`).text(paymentComponent.classifyInput(inputData.script));
        } else {
            $(`#script-type-label-${inputUUID}`).text(inputData.scriptType);
        }
    }

    const redeemScriptAsm = (inputData.redeemScript && inputData.redeemScript.length) ? bitcoinjs.script.toASM(inputData.redeemScript) : '';

    if (redeemScriptAsm) {
        $(`#ins-redeem-script-${inputUUID}`).html(redeemScriptAsm ? asmToHtml(redeemScriptAsm.split(' ')) : '');
        $(`#ins-redeem-script-asm-${inputUUID}`).text(redeemScriptAsm);

        const redeemScriptType = paymentComponent.classifyOutput(inputData.redeemScript);
        $(`#redeem-script-type-label-${inputUUID}`).text(redeemScriptType);
        $(`#ins-redeem-script-container-${inputUUID}`).removeClass('d-none');
    } else {
        $(`#ins-redeem-script-container-${inputUUID}`).addClass('d-none');
    }


    const witnessScriptAsm = (inputData.witnessScript && inputData.witnessScript.length) ? bitcoinjs.script.toASM(inputData.witnessScript) : '';
    if (witnessScriptAsm) {
        $(`#ins-witness-script-${inputUUID}`).html(witnessScriptAsm ? asmToHtml(witnessScriptAsm.split(' ')) : '');
        $(`#ins-witness-script-asm-${inputUUID}`).text(witnessScriptAsm);

        const witnessScriptType = paymentComponent.classifyOutput(inputData.witnessScript);
        $(`#witness-script-type-label-${inputUUID}`).text(witnessScriptType);
        $(`#ins-witness-script-container-${inputUUID}`).removeClass('d-none');
        $(`#ins-redeem-script-container-${inputUUID}`).addClass('d-none');
    } else {
        $(`#ins-witness-script-container-${inputUUID}`).addClass('d-none');
    }


    $(`#ins-witness-${inputUUID}`).empty();
    $(`#ins-witness-type-${inputUUID}`).text('');
    if (inputData.witness && inputData.witness.length) {
        const witnessType = paymentComponent.classifyWitness(inputData.witness);
        $(`#ins-witness-type-${inputUUID}`).text(witnessType);
        const witnessHex = (inputData.witness || []).map(v => v.toString('hex'));
        $(`#ins-witness-${inputUUID}`).html(asmToHtml(witnessHex));
        $(`#ins-witness-value-${inputUUID}`).val(JSON.stringify(witnessHex));
    }

    $(`#public-keys-list-${inputUUID}`).val(JSON.stringify(inputData.publicKeysList || []));
    $(`#signatures-list-${inputUUID}`).val(JSON.stringify(inputData.signaturesList || []));

    function _cleanPreviousTxValues(inputUUID) {
        $(`#set-previous-tx-${inputUUID}`).removeClass("d-none");
        $(`#view-previous-tx-${inputUUID}`).addClass("d-none");
        $(`#remove-previous-tx-${inputUUID}`).addClass("d-none");
    }

    function _updateFieldsForPreviousTx(inputUUID, tx) {
        $(`#ins-id-${inputUUID}`).val(tx.getId());
        $(`#set-previous-tx-${inputUUID}`).addClass("d-none");
        $(`#view-previous-tx-${inputUUID}`).removeClass("d-none");
        $(`#remove-previous-tx-${inputUUID}`).removeClass("d-none");

        const outputIndex = +$(`#ins-index-${inputUUID}`).val();
        if (outputIndex < 0 || outputIndex >= (tx.outs || []).length) {
            transactionOutputComponent.dataToHtml(`utxo-details-${inputUUID}`, {});
            return;
        }
        const txOutput = tx.outs[outputIndex];
        const txOutputScriptAsm = txOutput.script ? bitcoinjs.script.toASM(txOutput.script) : '';
        const txOutputScriptType = paymentComponent.classifyOutput(txOutput.script);

        const currentUtxo = transactionOutputComponent.htmlToData(`utxo-details-${inputUUID}`);
        const utxoScriptAsm = currentUtxo.script ? bitcoinjs.script.toASM(currentUtxo.script) : '';
        if (['p2sh', 'p2wsh'].includes(txOutputScriptType) && (!utxoScriptAsm || (utxoScriptAsm === txOutputScriptAsm))) {
            currentUtxo.value = txOutput.value;
            currentUtxo.script = txOutput.script;
            transactionOutputComponent.dataToHtml(`utxo-details-${inputUUID}`, currentUtxo);
        } else {
            transactionOutputComponent.dataToHtml(`utxo-details-${inputUUID}`, txOutput);
        }

    }
}

transactionInputComponent.htmlToData = function htmlToData(inputUUID) {
    if (!inputUUID) {
        return;
    }
    const inputData = {};
    const previousTxIdHex = $(`#ins-id-${inputUUID}`).val() || '';
    if (previousTxIdHex) {
        inputData.hash = reverseBuffer(safeBuffer.Buffer.from(previousTxIdHex, 'hex'));
    }

    inputData.previousTxHex = $(`#previous-tx-hex-${inputUUID}`).val() || '';
    inputData.index = +($(`#ins-index-${inputUUID}`).val() || 0);
    inputData.sequence = +($(`#ins-sequence-${inputUUID}`).val() || 0);
    inputData.sighashType = +$(`#input-sighash-value-${inputUUID}`).val() || '';

    const utxo = transactionOutputComponent.htmlToData(`utxo-details-${inputUUID}`);
    inputData.utxo = {
        value: utxo.value,
        script: utxo.script,
        redeem: utxo.redeem,
        witnessScript: utxo.witnessScript,
        witnessScriptType: utxo.witnessScriptType
    }

    const scriptSigAsm = $(`#ins-script-sig-asm-${inputUUID}`).text() || '';
    if (scriptSigAsm) {
        inputData.script = bitcoinjs.script.fromASM(scriptSigAsm);
    }

    const redeemScriptAsm = $(`#ins-redeem-script-asm-${inputUUID}`).text() || '';
    if (redeemScriptAsm) {
        inputData.redeemScript = bitcoinjs.script.fromASM(redeemScriptAsm);
        inputData.redeemScriptType = $(`#redeem-script-type-label-${inputUUID}`).text() || '';
    }

    const witnessScriptAsm = $(`#ins-witness-script-asm-${inputUUID}`).text() || '';
    if (witnessScriptAsm) {
        inputData.witnessScript = bitcoinjs.script.fromASM(witnessScriptAsm);
        inputData.witnessScriptType = $(`#witness-script-type-label-${inputUUID}`).text();
    }

    inputData.scriptType = $(`#script-type-label-${inputUUID}`).text();
    inputData.witnessType = $(`#ins-witness-type-${inputUUID}`).text();



    const witness = $(`#ins-witness-value-${inputUUID}`).val() || '';
    if (witness.length) {
        inputData.witness = JSON.parse(witness);
    }

    const publicKeysList = $(`#public-keys-list-${inputUUID}`).val() || '';
    inputData.publicKeysList = publicKeysList ? JSON.parse(publicKeysList) : [];

    const signaturesList = $(`#signatures-list-${inputUUID}`).val() || '';
    inputData.signaturesList = signaturesList ? JSON.parse(signaturesList) : [];
    return inputData;
}

transactionInputComponent.setReadOnly = function setReadOnly(inputUUID, isReadOnly = false, allowPaymentView = false) {
    $(`#is-read-only-${inputUUID}`).val(isReadOnly);
    if (isReadOnly === true) {
        $(`.read-only-disable-${inputUUID}`).prop('disabled', true);
        $(`.read-only-hide-${inputUUID}`).hide();
        $(`.open-payment-${inputUUID}`)[allowPaymentView ? 'show' : 'hide']();
    } else {
        $(`.read-only-disable-${inputUUID}`).prop('disabled', false);
        $(`.read-only-hide-${inputUUID}`).show();
        $(`.open-payment-${inputUUID}`).show();
    }
}

transactionInputComponent.setRole = function setRole(inputUUID, role) {
    if (!role) {
        return;
    }
    if (role === 'create' || role === 'update') {
        transactionInputComponent.setReadOnly(inputUUID, false);
    } else {
        transactionInputComponent.setReadOnly(inputUUID, true, true);
    }
}