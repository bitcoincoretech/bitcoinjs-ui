sighashComponent.createNew = function createNew(op) {
    return `
        <div class="row">
            <div class="col-sm-6">
                <div class="row">
                    <label for="sighash-input-mode-${op.containerUUID}" class="col-sm-4 control-label">Included
                        Inputs</label>

                    <div class="col-sm-8">
                        <select id="sighash-input-mode-${op.containerUUID}"
                            onchange="sighashComponent.changeSighashModes('${op.containerUUID}', this.value)"
                            class="form-control">
                            <option value="SIGHASH_ALL">ALL</option>
                            <option value="SIGHASH_ANYONECANPAY">ANYONECANPAY</option>
                        </select>
                    </div>
                </div>
                <div class="row mt-3">
                    <label for="sighash-output-mode-${op.containerUUID}" class="col-sm-4 control-label">Included
                        Outputs</label>

                    <div class="col-sm-8">
                        <select id="sighash-output-mode-${op.containerUUID}"
                            onchange="sighashComponent.changeSighashModes('${op.containerUUID}', '', this.value)"
                            class="form-control">
                            <option value="SIGHASH_ALL">ALL</option>
                            <option value="SIGHASH_NONE">NONE</option>
                            <option value="SIGHASH_SINGLE">SINGLE</option>
                        </select>
                    </div>
                </div>
                <div class="row mt-3">
                    <label for="sighash-value-${op.containerUUID}" class="col-sm-4 control-label">
                        Sighash Value
                    </label>

                    <div class="col-sm-8">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Hex</span>
                            </div>
                            <input id="sighash-value-${op.containerUUID}" disabled class="form-control asm role-create-${op.inputUUID} role-update-${op.inputUUID}">
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-6 alert alert-info">
                <i class="fas fa-2x fa-info-circle"></i>
                <span id="sighash-description-1-1-${op.containerUUID}" class="sighash-description-${op.containerUUID}">
                    The default, signs all the inputs and outputs, protecting everything except the
                    signature scripts against modification.
                </span>
                <span id="sighash-description-1-2-${op.containerUUID}" class="sighash-description-${op.containerUUID}">
                    Signs all of the inputs but none of the outputs, allowing anyone to change where
                    the satoshis are going unless other signatures using other signature hash flags
                    protect the outputs.
                </span>
                <span id="sighash-description-1-3-${op.containerUUID}"
                    class="sighash-description-${op.containerUUID}">
                    The only output signed is the one corresponding to this input (the output with
                    the same output index number as this input), ensuring nobody can change your
                    part of the transaction but allowing other signers to change their part of the
                    transaction. The corresponding output must exist or the value “1” will be
                    signed, breaking the security scheme. This input, as well as other inputs, are
                    included in the signature. The sequence numbers of other inputs are not included
                    in the signature, and can be updated.
                </span>
                <span id="sighash-description-128-1-${op.containerUUID}"
                    class="sighash-description-${op.containerUUID}">
                    Signs all of the outputs but only this one input, and it also allows anyone to
                    add or remove other inputs, so anyone can contribute additional satoshis but
                    they cannot change how many satoshis are sent nor where they go.
                </span>
                <span id="sighash-description-128-2-${op.containerUUID}"
                    class="sighash-description-${op.containerUUID}">
                    Signs only this one input and allows anyone to add or remove other inputs or
                    outputs, so anyone who gets a copy of this input can spend it however they’d
                    like.
                </span>
                <span id="sighash-description-128-3-${op.containerUUID}"
                    class="sighash-description-${op.containerUUID}">
                    Signs this one input and its corresponding output. Allows anyone to add or
                    remove other inputs.
                </span>
                <a href="https://developer.bitcoin.org/devguide/transactions.html#signature-hash-types" target="_blank">
                    More <i class="fas fa-external-link-alt"></i></a>
            </div>
        </div>
    `
}


sighashComponent.dataToHtml = function dataToHtml(containerUUID, data) {
    $(`#sighash-input-mode-${containerUUID}`).val(data.inputSighash || 'SIGHASH_ALL');
    $(`#sighash-output-mode-${containerUUID}`).val(data.outputSighash || 'SIGHASH_ALL');
}

sighashComponent.htmlToData = function htmlToData(containerUUID) {
    const inputSighash = $(`#sighash-input-mode-${containerUUID}`).val() || 'SIGHASH_ALL';
    const outputSighash = $(`#sighash-output-mode-${containerUUID}`).val() || 'SIGHASH_ALL';
    return {
        inputSighash,
        outputSighash
    };
}