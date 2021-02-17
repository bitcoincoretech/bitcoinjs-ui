transactionComponent.createNew = function createNew(op) {
    return `

    <div id="transaction-container-${op.containerUUID}">
        <div id="txNote" class="alert alert-info d-none">
            
        </div>
        <table class="table table-sm border-bottom">
            <tbody>
                <tr class="d-flex">
                    <td class="col-sm-2"><label>ID</label></td>
                    <td class="col-sm-10">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Hex</span>
                            </div>
                            <textarea id="id-${op.containerUUID}" disabled="true" rows="1" class="form-control asm"></textarea>
                        </div>
                    </td>
                </tr>

                <tr id="version-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2"><label>Version</label></td>
                    <td class="col-sm-10">
                        <div class="input-group w-25">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Int32</span>
                            </div>
                            <input type="number" id="version-${op.containerUUID}" value="1" class="form-control asm read-only-disable-${op.containerUUID}">
                        </div>
                    </td>
                </tr>
                <tr id="locktime-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2">
                        <label>Locktime</label>
                        <i class="fas fa-clock"></i>
                    </td>
                    <td class="col-sm-10">
                        <div class="input-group w-25">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Int32</span>
                            </div>
                            <input type="number" id="locktime-${op.containerUUID}" value="0" class="form-control asm read-only-disable-${op.containerUUID}">
                        </div>
                    </td>
                </tr>
                <tr id="ins-row-${op.containerUUID}"  class="d-flex">
                    <td class="col-sm-2">
                        <div id="label-toggle-ins-${op.containerUUID}">
                            <i id="label-collapsed-ins-${op.containerUUID}" class="far fa-caret-square-right pointer"></i>
                            <i id="label-expanded-ins-${op.containerUUID}" class="far fa-caret-square-down pointer"></i>
                            <label id="label-ins-${op.containerUUID}" class="pointer">Inputs
                                <span id="label-count-ins-${op.containerUUID}" class="badge badge-secondary badge-pill">0</span>
                            </label>
                        </div>
                    </td>
                    <td class="col-sm-10">
                        <div id="ins-${op.containerUUID}">

                        </div>
                        <div>
                            <button onclick="transactionComponent.addTxInput('${op.containerUUID}')" type="button"
                                class="btn btn-info button120 float-right read-only-hide-${op.containerUUID}">Add Input</button>
                        </div>
                    </td>
                </tr>
                <tr id="ins-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2">
                        <div id="label-toggle-outs-${op.containerUUID}">
                            <i id="label-collapsed-outs-${op.containerUUID}" class="far fa-caret-square-right pointer"></i>
                            <i id="label-expanded-outs-${op.containerUUID}" class="far fa-caret-square-down pointer"></i>
                            <label id="label-outs-${op.containerUUID}" class="pointer">Outputs
                                <span id="label-count-outs-${op.containerUUID}" class="badge badge-secondary badge-pill">0</span>
                            </label>
                        </div>
                    </td>
                    <td class="col-sm-10">
                        <div id="outs-${op.containerUUID}">

                        </div>
                        <div>
                            <button id="insAdd" onclick="transactionComponent.addTxOutput('${op.containerUUID}')" type="button"
                                class="btn btn-info button120 float-right read-only-hide-${op.containerUUID}">Add Output</button>
                        </div>
                    </td>
                </tr>

                <tr id="vsize-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2"><label>Virtual Size</label></td>
                    <td class="col-sm-10">
                        <div> <textarea id="vsize-${op.containerUUID}" disabled="true" rows="1" class="form-control w-25 asm"></textarea>
                        </div>
                    </td>
                </tr>
                <tr id="weight-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2"><label>Weight</label></td>
                    <td class="col-sm-10">
                        <div> <textarea id="weight-${op.containerUUID}" disabled="true" rows="1" class="form-control w-25 asm"></textarea>
                        </div>
                    </td>
                </tr>
                <tr id="isCoinbase-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2"><label>Is Coinbase</label></td>
                    <td class="col-sm-10">
                        <div> <textarea id="isCoinbase-${op.containerUUID}" disabled="true" rows="1" class="form-control w-25 asm"></textarea>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `;
}

transactionComponent.createExternalMenu = function createExternalMenu(op) {
    return `
            <button type="button" onclick="transactionComponent.openTransactionFromHexModal('${op.containerUUID}')" class="btn btn-info ml-5 button120"
                data-toggle="modal" data-target="#modal-dialog">Import</button>
            </button>
            <button type="button" onclick="transactionComponent.openTransactionToHexModal('${op.containerUUID}')" class="btn btn-info ml-3 button120"
                data-toggle="modal" data-target="#modal-dialog">Export</button>
            </button>
    
            <button type="button" onclick="transactionComponent.clear('${op.containerUUID}')" class="btn btn-secondary ml-5 button120">
                Clear
                <i class="fas fa-eraser"></i>
            </button>
    `;
}

transactionComponent.htmlToData = function htmlToData(containerUUID) {
    const tx = new bitcoinjs.Transaction();
    tx.version = +$(`#version-${containerUUID}`).val();
    tx.locktime = +$(`#locktime-${containerUUID}`).val();

    $(`#ins-${containerUUID}`).children().each(function (poz) {
        const inputUUID = this.id.split("tx-input-")[1];
        if (!inputUUID) {
            return;
        }
        const txInput = transactionInputComponent.htmlToData(inputUUID);
        try {
            tx.addInput(txInput.hash, txInput.index, txInput.sequence, txInput.script);
            tx.setWitness(poz, (txInput.witness || []).map(w => safeBuffer.Buffer.from(w, 'hex')));
        } catch (err) {
            throw new Error(`Error for Input [${poz}]: ${err.message}`);
        }
    });

    $(`#outs-${containerUUID}`).children().each(function (poz) {
        const outputUUID = this.id.split("tx-output-")[1];
        if (!outputUUID) {
            return;
        }
        const txOutput = transactionOutputComponent.htmlToData(outputUUID);

        try {
            tx.addOutput(txOutput.script, txOutput.value);
        } catch (err) {
            throw new Error(`Error for Output [${poz}]: ${err.message}`);
        }

    });

    return tx;
}


transactionComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!data || !data.tx) {
        return;
    }
    const annot = data.annot || {
        inputs: [],
        outputs: []
    }
    $(`#id-${containerUUID}`).val(data.tx.getId ? data.tx.getId() : '');
    $(`#vsize-${containerUUID}`).val(data.tx.virtualSize ? data.tx.virtualSize() : 0);
    $(`#weight-${containerUUID}`).val(data.tx.weight ? data.tx.weight() : 0);
    $(`#version-${containerUUID}`).val(data.tx.version || 1);
    $(`#locktime-${containerUUID}`).val(data.tx.locktime || 0);
    $(`#isCoinbase-${containerUUID}`).val((data.tx.isCoinbase && data.tx.isCoinbase()) ? 'Yes' : 'No');
    $(`#ins-${containerUUID}`).empty();
    (data.tx.ins || []).forEach((input, index) => {
        transactionComponent.addTxInput(containerUUID, input, annot.inputs[index]);
    });
    $(`#outs-${containerUUID}`).empty();
    (data.tx.outs || []).forEach((output, index) => {
        transactionComponent.addTxOutput(containerUUID, output, annot.outputs[index]);
    });

    if (annot.txNote) {
        $(`#txNote`).text(annot.txNote);
        $(`#txNote`).removeClass('d-none')
    }
}

transactionComponent.setReadOnly = function setReadOnly(containerUUID, isReadOnly = false) {
    if (isReadOnly === true) {
        $(`.read-only-disable-${containerUUID}`).prop('disabled', true);
        $(`.read-only-hide-${containerUUID}`).hide();
    } else {
        $(`.read-only-disable-${containerUUID}`).prop('disabled', false);
        $(`.read-only-hide-${containerUUID}`).show();
    }

    $(`#ins-${containerUUID}`).children().each((poz, el) => {
        const inputId = (el.id || '').split('tx-input-')[1];
        if (inputId) {
            transactionInputComponent.setReadOnly(inputId, isReadOnly);
        }
    });

    $(`#outs-${containerUUID}`).children().each((poz, el) => {
        const inputId = (el.id || '').split('tx-output-')[1];
        if (inputId) {
            transactionOutputComponent.setReadOnly(inputId, isReadOnly);
        }
    });

}