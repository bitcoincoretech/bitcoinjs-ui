psbtDataComponent.createNew = function createNew(op) {
    return `
        <input id="psbt-role-${op.containerUUID}" hidden>
        <table class="table table-sm border-bottom">
            <tbody id="psbt-rows-${op.containerUUID}">

                <tr id="version-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2"><label>Version</label></td>
                    <td class="col-sm-10">
                        <div class="input-group w-25">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Int32</span>
                            </div>
                            <input type="number" id="version-${op.containerUUID}" value="2" class="form-control asm">
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
                            <input type="number" id="locktime-${op.containerUUID}" value="0" class="form-control asm">
                        </div>
                    </td>
                </tr>
                <tr id="ins-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2">
                        <div id="label-toggle-ins-${op.containerUUID}"  onclick="psbtDataComponent.toggleInputs('${op.containerUUID}')">
                            <i id="label-collapsed-ins-${op.containerUUID}" class="far fa-caret-square-right pointer"></i>
                            <i id="label-expanded-ins-${op.containerUUID}" class="far fa-caret-square-down pointer d-none"></i>
                            <label id="label-ins-${op.containerUUID}" class="pointer">Inputs
                                <span id="label-count-ins-${op.containerUUID}" class="badge badge-secondary badge-pill">0</span>
                            </label>
                        </div>
                    </td>
                    <td class="col-sm-10">
                        <div id="ins-${op.containerUUID}">

                        </div>
                        <div>
                            <button onclick="psbtDataComponent.addPsbtInput('${op.containerUUID}')" type="button"
                                class="btn btn-info button120 float-right role-create-${op.containerUUID}">Add Input</button>
                        </div>
                    </td>
                </tr>
                <tr id="ins-row-${op.containerUUID}" class="d-flex">
                    <td class="col-sm-2">
                        <div id="label-toggle-outs-${op.containerUUID}" onclick="psbtDataComponent.toggleOutputs('${op.containerUUID}')">
                            <i id="label-collapsed-outs-${op.containerUUID}" class="far fa-caret-square-right pointer"></i>
                            <i id="label-expanded-outs-${op.containerUUID}" class="far fa-caret-square-down pointer d-none"></i>
                            <label id="label-outs-${op.containerUUID}" class="pointer">Outputs
                                <span id="label-count-outs-${op.containerUUID}" class="badge badge-secondary badge-pill">0</span>
                            </label>
                        </div>
                    </td>
                    <td class="col-sm-10">
                        <div id="outs-${op.containerUUID}">

                        </div>
                        <div>
                            <button id="insAdd" onclick="psbtDataComponent.addPsbtOutput('${op.containerUUID}')" type="button"
                                class="btn btn-info button120 float-right role-create-${op.containerUUID}">Add Output</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

psbtDataComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    if (!data || !data.psbt) {
        return;
    }
    const psbt = data.psbt;

    $(`#version-${containerUUID}`).val(psbt.version);
    $(`#locktime-${containerUUID}`).val(psbt.locktime);

    $(`#ins-${containerUUID}`).empty();
    const tx = _extractTx();
    (psbt.txInputs || []).map((input, index) => {
        const previousTx = (psbt.data.inputs[index] || {}).nonWitnessUtxo;
        const witnessScript = (psbt.data.inputs[index] || {}).witnessScript;
        const witnessUtxo = (psbt.data.inputs[index] || {}).witnessUtxo;
        const redeemScript = (psbt.data.inputs[index] || {}).redeemScript;
        const sighashType = (psbt.data.inputs[index] || {}).sighashType;
        const bip32Derivation = ((psbt.data.inputs[index] || {}).bip32Derivation);

        const finalScriptSig = (psbt.data.inputs[index] || {}).finalScriptSig;
        const finalScriptWitness = (psbt.data.inputs[index] || {}).finalScriptWitness;

        const utxo = {};
        if (redeemScript) {
            utxo.redeem = {
                output: redeemScript
            };
        }
        if (witnessUtxo) {
            utxo.value = witnessUtxo.value;
            utxo.script = witnessUtxo.script;
            utxo.witnessScript = witnessScript;
        }

        const witness = finalScriptWitness ? (tx && tx.ins[index].witness) : null;

        const publicKeysList = (bip32Derivation || []).map(derivation => ({
            fingerprint: derivation.masterFingerprint ? derivation.masterFingerprint.toString('hex') : '',
            publicKey: derivation.pubkey ? derivation.pubkey.toString('hex') : '',
            path: derivation.path
        }));

        return {
            sequence: input.sequence,
            index: input.index,
            hash: input.hash ? reverseBuffer(safeBuffer.Buffer.from(input.hash, 'hex')).toString('hex') : '',
            previousTxHex: previousTx ? previousTx.toString('hex') : '',
            utxo,
            script: finalScriptSig,
            redeemScript,
            witnessScript,
            witness,
            sighashType,
            publicKeysList
        }
    }).forEach(input => {
        psbtDataComponent.addPsbtInput(containerUUID, input);
    });


    $(`#outs-${containerUUID}`).empty();
    (psbt.txOutputs || []).map((output, index) => {
        const bip32Derivation = ((psbt.data.outputs[index] || {}).bip32Derivation);

        const publicKeysList = (bip32Derivation || []).map(derivation => ({
            fingerprint: derivation.masterFingerprint ? derivation.masterFingerprint.toString('hex') : '',
            publicKey: derivation.pubkey ? derivation.pubkey.toString('hex') : '',
            path: derivation.path
        }));
        return {
            value: output.value,
            script: output.script,
            address: psbt.txOutputs[index].address || '',
            publicKeysList
        }
    }).forEach(output => {
        psbtDataComponent.addPsbtOutput(containerUUID, output);

    });

    function _extractTx() {
        try {
            return psbt.extractTransaction(true);
        } catch (err) {}
    }
}

psbtDataComponent.htmlToData = function htmlToData(containerUUID) {
    const data = {
        inputs: [],
        outputs: []
    };
    data.version = +$(`#version-${containerUUID}`).val();
    data.locktime = +$(`#locktime-${containerUUID}`).val();

    $(`#ins-${containerUUID}`).children().each(function (poz) {
        const inputUUID = this.id.split("psbt-input-")[1];
        if (!inputUUID) {
            return;
        }

        try {
            const input = transactionInputComponent.htmlToData(inputUUID);

            const psbtInput = {
                hash: input.hash,
                index: input.index,
                sequence: input.sequence,
            };
            if (input.sighashType) {
                psbtInput.sighashType = input.sighashType;
            }

            if (input.utxo) {
                if (input.utxo.redeem && input.utxo.redeem.output) {
                    psbtInput.redeemScript = input.utxo.redeem.output;
                }
                if (input.scriptType === 'p2wsh') {
                    if (input.utxo.witnessScript) {
                        psbtInput.witnessScript = input.utxo.witnessScript;
                    }
                    psbtInput.witnessUtxo = {
                        value: input.utxo.value,
                        script: input.utxo.script
                    };
                }
            }
            if (input.previousTxHex && !psbtInput.witnessUtxo) {
                psbtInput.nonWitnessUtxo = safeBuffer.Buffer.from(input.previousTxHex, 'hex');
            }

            (input.publicKeysList || []).filter(pk => pk.fingerprint && pk.publicKey && pk.path)
                .forEach(publicKeyDetails => {
                    psbtInput.bip32Derivation = psbtInput.bip32Derivation || [];
                    psbtInput.bip32Derivation.push({
                        masterFingerprint: publicKeyDetails.fingerprint ? safeBuffer.Buffer.from(publicKeyDetails.fingerprint, 'hex') : undefined,
                        pubkey: publicKeyDetails.publicKey ? safeBuffer.Buffer.from(publicKeyDetails.publicKey, 'hex') : undefined,
                        path: publicKeyDetails.path
                    });
                });

            (input.signaturesList || []).forEach(sig => {
                psbtInput.partialSig = psbtInput.partialSig || [];
                psbtInput.partialSig.push({
                    pubkey: sig.publicKey ? safeBuffer.Buffer.from(sig.publicKey, 'hex') : undefined,
                    signature: sig.signature ? safeBuffer.Buffer.from(sig.signature, 'hex') : undefined
                })
            });

            data.inputs.push(psbtInput);
            // TODO: porCommitment: null
        } catch (err) {
            throw new Error(`Error for Input [${poz}]: ${err.message}`);
        }
    });

    $(`#outs-${containerUUID}`).children().each(function (poz) {
        const outputUUID = this.id.split("psbt-output-")[1];
        if (!outputUUID) {
            return;
        }

        try {
            const output = transactionOutputComponent.htmlToData(outputUUID);
            const psbtOutput = {
                value: output.value,
                script: output.script,
                bip32Derivation: []
            };
            (output.publicKeysList || []).forEach(publicKeyDetails => {
                psbtOutput.bip32Derivation.push({
                    masterFingerprint: publicKeyDetails.fingerprint ? safeBuffer.Buffer.from(publicKeyDetails.fingerprint, 'hex') : undefined,
                    pubkey: publicKeyDetails.publicKey ? safeBuffer.Buffer.from(publicKeyDetails.publicKey, 'hex') : undefined,
                    path: publicKeyDetails.path
                })
            });
            data.outputs.push(psbtOutput);
        } catch (err) {
            throw new Error(`Error for Output [${poz}]: ${err.message}`);
        }

    });
    return data;
}

psbtDataComponent.setRole = function setRole(containerUUID, role) {
    $(`#psbt-role-${containerUUID}`).val(role);
    $(`.role-create-${containerUUID}`).addClass('d-none');
    if (role === 'create') {
        $(`.role-create-${containerUUID}`).removeClass('d-none');
    }
    $(`#ins-${containerUUID}`).children().each(function () {
        const inputUUID = this.id.split("psbt-input-")[1];
        if (!inputUUID) {
            return;
        }
        transactionInputComponent.setRole(inputUUID, role);
    });
    $(`#outs-${containerUUID}`).children().each(function () {
        const outputUUID = this.id.split("psbt-output-")[1];
        if (!outputUUID) {
            return;
        }
        transactionOutputComponent.setRole(outputUUID, role);
    });
}

psbtDataComponent.toggleInputs = function toggleInputs(containerUUID) {
    const isVisible = !$(`#ins-${containerUUID}`).hasClass('d-none');
    if (isVisible) {
        $(`#ins-${containerUUID}`).addClass('d-none');
        $(`#label-expanded-ins-${containerUUID}`).addClass('d-none');
        $(`#label-collapsed-ins-${containerUUID}`).removeClass('d-none');
    } else {
        $(`#ins-${containerUUID}`).removeClass('d-none');
        $(`#label-expanded-ins-${containerUUID}`).removeClass('d-none');
        $(`#label-collapsed-ins-${containerUUID}`).addClass('d-none');
    }
}

psbtDataComponent.toggleOutputs = function toggleOutputs(containerUUID) {
    const isVisible = !$(`#outs-${containerUUID}`).hasClass('d-none');
    if (isVisible) {
        $(`#outs-${containerUUID}`).addClass('d-none');
        $(`#label-expanded-outs-${containerUUID}`).addClass('d-none');
        $(`#label-collapsed-outs-${containerUUID}`).removeClass('d-none');
    } else {
        $(`#outs-${containerUUID}`).removeClass('d-none');
        $(`#label-expanded-outs-${containerUUID}`).removeClass('d-none');
        $(`#label-collapsed-outs-${containerUUID}`).addClass('d-none');
    }
}