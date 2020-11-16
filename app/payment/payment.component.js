const paymentComponent = function () {

    const types = {
        p2ms: 'multisig',
        nonstandard: 'nonstandard',
        embed: 'nulldata',
        p2pk: 'pubkey',
        p2pkh: 'pubkeyhash',
        p2sh: 'scripthash',
        p2wpkh: 'witnesspubkeyhash',
        p2wsh: 'witnessscripthash'
    };

    function fromTxInput(containerUUID, inputData) {
        const scriptType = inputData.scriptType === 'nonstandard' ? (inputData.witnessType || 'nonstandard') : inputData.scriptType;
        paymentComponent.changePaymentType(containerUUID, scriptType, 'ins');

        const paymentData = {
            input: inputData.script,
            redeem: {
                output: inputData.redeemScript
            },
            publicKeysList: inputData.publicKeysList,
            signaturesList: inputData.signaturesList,
            witness: inputData.witness
        }
        paymentComponent.dataToHtml(containerUUID, paymentData, true);
    }

    function fromTxOutput(containerUUID, outputData) {
        const paymentType = classifyOutput(outputData.script);
        paymentComponent.changePaymentType(containerUUID, paymentType, 'outs');

        const paymentData = {
            paymentType,
            output: outputData.script,
            redeem: outputData.redeem,
            publicKeysList: outputData.publicKeysList,
            signaturesList: outputData.signaturesList,
            witness: outputData.witness
        }

        paymentComponent.dataToHtml(containerUUID, paymentData, true);
    }

    function changePaymentType(containerId = '0', paymentType, txLocation = '') {
        if (txLocation) {
            $(`#tx-location-${containerId}`).val(txLocation);
        } else {
            txLocation = $(`#tx-location-${containerId}`).val() || '';
        }

        $(`.${containerId}Row`).hide().removeClass('d-flex');

        const oldPaymentType = $(`#payment-type-${containerId}`).val();
        if (paymentType !== oldPaymentType) {
            $(`#payment-type-${containerId}`).val(paymentType);
        }

        $(`#address-type-${containerId}`).text(['p2sh', 'p2pkh'].includes(paymentType) ? 'base58' : 'bech32');
        $(`#witness-script-value-${containerId}`).val('');

        const paymentFields = PAYMENT_FIELDS[paymentType];
        if (paymentFields) {
            paymentFields.forEach(field => {
                if ((txLocation && field.txLocation) && (txLocation !== field.txLocation)) {
                    return;
                }
                $(`#${field.name}-${containerId}Row`).show().addClass('d-flex');
            });
        }
        paymentComponent.dataToHtml(containerId, {});
    }

    function updateComputedValues(containerId) {
        const payment = checkPayment(containerId);
        if (payment) {
            paymentComponent.dataToHtml(containerId, payment);
        }
    }

    function checkPayment(containerId) {
        try {
            const network = networkComponent.htmlToData('default');
            return _checkPaymentByType(network, containerId);
        } catch (err) {
            console.error(err);
            openToasty('Check Payment', err.message, true);
        }
    }

    function clear(containerId) {
        const paymentType = $(`#payment-type-${containerId}`).val() || 'nonstandard';
        const txLocation = $(`#tx-location-${containerId}`).val() || '';
        const container = $(`#payment-container-${containerId}`);
        const parentContainerId = container.parent().attr('id');
        container.remove();

        $(`#${parentContainerId}`).html(paymentComponent.createNew({
            containerUUID: containerId
        }));
        paymentComponent.changePaymentType(containerId, paymentType, txLocation);
    }

    function toggleSinglePublicKeyDetails(containerUUID, publicKeyContainerUUID) {
        const isVisible = !$(`#pubkey-details-${publicKeyContainerUUID}Row`).hasClass('d-none');
        if (isVisible) {
            $(`#pubkey-details-container-${publicKeyContainerUUID}`).empty();
            $(`#pubkey-details-${publicKeyContainerUUID}Row`).removeClass('d-flex').addClass('d-none');
            $(`#single-pubkey-update-button-${publicKeyContainerUUID}`).addClass('d-none');
            $(`#single-pubkey-toggle-button-${publicKeyContainerUUID}`).html('More').removeClass('btn-secondary').addClass('btn-info');
            $(`.${containerUUID}Row`).removeClass('blur-medium');
            return;
        }
        $(`.${containerUUID}Row`).addClass('blur-medium');
        $(`#pubkey-${publicKeyContainerUUID}Row`).removeClass('blur-medium');
        $(`#pubkey-details-${publicKeyContainerUUID}Row`).addClass('d-flex').removeClass('d-none').removeClass('blur-medium');
        $(`#single-pubkey-update-button-${publicKeyContainerUUID}`).removeClass('d-none');
        $(`#single-pubkey-toggle-button-${publicKeyContainerUUID}`).html('Cancel').removeClass('btn-info').addClass('btn-secondary');

        const keyData = keyManagerComponent.htmlToData('default');

        const publicKeyDetailsContainerUUID = uuidv4();
        const keySelectorHtml = keySelectorComponent.createNew({
            containerUUID: publicKeyDetailsContainerUUID
        });
        $(`#pubkey-details-container-${publicKeyContainerUUID}`).html(`<div id="public-key-selector-${publicKeyDetailsContainerUUID}">${keySelectorHtml}</div>`);
        keySelectorComponent.dataToHtml(publicKeyDetailsContainerUUID, {
            keys: keyData.keys,
            publicKey: $(`#pubkey-${publicKeyContainerUUID}`).val() || '',
            fingerprint: $(`#pubkey-fingerprint-${publicKeyContainerUUID}`).val() || '',
            path: $(`#pubkey-path-${publicKeyContainerUUID}`).val() || '',
        });
    }

    function toggleSignatureDetails(containerUUID) {
        const isVisible = !$(`#signature-details-container-${containerUUID}`).hasClass('d-none');
        if (isVisible) {
            $(`#signature-details-container-${containerUUID}`).addClass('d-none');
            $(`#signature-details-toggle-button-${containerUUID}`).html('More');
        } else {
            $(`#signature-details-container-${containerUUID}`).removeClass('d-none');
            $(`#signature-details-toggle-button-${containerUUID}`).html('Less');
        }
    }

    function updateSinglePublicKeyDetails(containerUUID, publicKeyContainerUUID) {
        const keySelectorUUID = (($(`#pubkey-details-container-${publicKeyContainerUUID}`).children()[0] || {}).id || '').split('public-key-selector-')[1];
        const keyData = keySelectorComponent.htmlToData(keySelectorUUID);
        $(`#pubkey-${publicKeyContainerUUID}`).val(keyData.publicKey || '');
        $(`#pubkey-fingerprint-${publicKeyContainerUUID}`).val(keyData.fingerprint || '');
        $(`#pubkey-path-${publicKeyContainerUUID}`).val(keyData.path || '');
        toggleSinglePublicKeyDetails(containerUUID, publicKeyContainerUUID);
    }

    function addNewPublicKey(containerUUID, data) {
        const publicKeyContainerUUID = uuidv4();
        const publicKeyHtml = _createNewPublicKey(containerUUID, publicKeyContainerUUID, data);
        const publicKeyWithDetailsHtml = `
            <tr id="pubkey-${publicKeyContainerUUID}Row" class="d-flex ${containerUUID}Row public-key-row-${containerUUID}">
                <td class="col-sm-2 border-top-0"> </td>
                <td class="col-sm-5 border-top-0">
                    <div id="public-key-entry-container-${publicKeyContainerUUID}" class="public-key-entry-${containerUUID}">
                        ${publicKeyHtml}
                    </div>
                </td>
                <td class="col-sm-5 border-top-0">
                </td>
            </tr>
            <tr id="pubkey-details-${publicKeyContainerUUID}Row" class="d-none ${containerUUID}Row public-key-row-${containerUUID}">
                <td class="col-sm-2 border-bottom"> </td>
                <td class="col-sm-10 border-bottom"> 
                    <div class="alert alert-info">
                        Click OK to update!
                    </div>
                    <div id="pubkey-details-container-${publicKeyContainerUUID}" class="table-active p-3"> </div>
                    <div class="alert alert-info mt-3">
                        Click OK to update!
                    </div>
                </td>
            </tr>
        `;
        const signaturesCountRow = $(`#m-${containerUUID}Row`);
        signaturesCountRow.before(publicKeyWithDetailsHtml);
    }

    function addNewSignature(containerUUID, data = {}) {
        const signatureContainerUUID = uuidv4();
        const signatureHtml = `
            <div id="signature-entry-container-${signatureContainerUUID}" class="mb-2 signature-entry-${containerUUID}">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">hex</span>
                    </div>
                    <textarea id="signature-${signatureContainerUUID}" rows="2" class="form-control asm read-only-disable-${signatureContainerUUID}">${data.signature || ''}</textarea>
                    <div class="input-group-append">
                        <button id="signature-details-toggle-button-${signatureContainerUUID}" onclick="paymentComponent.toggleSignatureDetails('${signatureContainerUUID}')" 
                            class="btn btn-info">
                            More
                        </button>
                        <button onclick="paymentComponent.removeSignature('${signatureContainerUUID}')"
                            class="btn btn-info btn-danger">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div id="signature-details-container-${signatureContainerUUID}" class="d-none">
                    Public Key: 
                    <span id="signature-public-key-${signatureContainerUUID}" 
                        class="asm break-long-words badge badge-secondary text-wrap text-left">${data.publicKey || ''}</span>
                </div>
            </div>
        `;
        $(`#signature-list-${containerUUID}`).append(signatureHtml);
    }

    function addNewWitnessData(containerUUID, data = '') {
        const witnessContainerUUID = uuidv4();
        const witnessHtml = `
            <div id="witness-entry-container-${witnessContainerUUID}" class="mb-2 witness-entry-${containerUUID}">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">hex</span>
                    </div>
                    <textarea id="witness-${witnessContainerUUID}" rows="2" class="form-control asm read-only-disable-${witnessContainerUUID}">${data}</textarea>
                    <div class="input-group-append">
                        <button onclick="paymentComponent.removeWitnessData('${witnessContainerUUID}')"
                            class="btn btn-info btn-danger">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        $(`#witness-list-${containerUUID}`).prepend(witnessHtml);
    }

    function removePublicKey(containerUUID, publicKeyContainerUUID) {
        $(`#pubkey-${publicKeyContainerUUID}Row`).remove();
        $(`#pubkey-details-${publicKeyContainerUUID}Row`).remove();
        $(`.${containerUUID}Row`).removeClass('blur-medium');
    }

    function removeSignature(containerUUID) {
        $(`#signature-entry-container-${containerUUID}`).remove();
    }

    function removeWitnessData(containerUUID) {
        $(`#witness-entry-container-${containerUUID}`).remove();
    }


    function wrappScript(containerUUID, wrapperType = 'p2sh') {
        try {
            const outputScript = ($(`#output-${containerUUID}-expect-value`).val() || '').trim();
            const inputScript = ($(`#input-${containerUUID}-expect-value`).val() || '').trim();
            const witnessScript = ($(`#witness-script-value-${containerUUID}`).val() || '').trim();
            const paymentData = paymentComponent.htmlToData(containerUUID);

            if (!outputScript) {
                throw new Error('No Output Script present!');
            }

            clear(containerUUID);
            changePaymentType(containerUUID, wrapperType);
            const data = {
                redeem: {
                    output: bitcoinjs.script.fromASM(outputScript),
                    input: inputScript ? bitcoinjs.script.fromASM(inputScript) : null,
                },
                witnessScript: wrapperType === 'p2wsh' ? outputScript : witnessScript,
                publicKeysList: paymentData.publicKeysList
            }
            paymentComponent.dataToHtml(containerUUID, data, true);

            updateComputedValues(containerUUID);
        } catch (err) {
            openToasty('Wrap Script', err.message, true);
        }
    }

    function unwrapScript(containerUUID, location = 'out') {
        try {
            const scriptAsm = location === 'out' ? ($(`#redeem-output-${containerUUID}-expect-value`).val() || '').trim() :
                ($(`#redeem-input-${containerUUID}-expect-value`).val() || '').trim();

            const paymentData = paymentComponent.htmlToData(containerUUID);

            if (!scriptAsm || !scriptAsm.length) {
                throw new Error('No script provided!');
            }
            clear(containerUUID);

            const script = bitcoinjs.script.fromASM(scriptAsm);
            const scriptType = location === 'out' ? classifyOutput(script) : classifyInput(script);
            changePaymentType(containerUUID, scriptType);
            const unwrapedPaymentData = {
                input: location === 'out' ? '' : script,
                output: location === 'out' ? script : '',
                publicKeysList: paymentData.publicKeysList
            }
            paymentComponent.dataToHtml(containerUUID, unwrapedPaymentData, true);
            updateComputedValues(containerUUID);
        } catch (err) {
            console.error(err);
            openToasty('Wrap Script', err.message, true);
        }
    }

    function classifyInput(script) {
        const scriptType = (script && script.length) ? classifyScript.input(script) : 'nonstandard';
        return _paymentTypeFromScriptType(scriptType);
    }

    function classifyOutput(script) {
        const scriptType = (script && script.length) ? classifyScript.output(script) : 'nonstandard';
        return _paymentTypeFromScriptType(scriptType);
    }

    function classifyWitnees(script) {
        const scriptType = (script && script.length) ? classifyScript.witness(script) : 'nonstandard';
        return _paymentTypeFromScriptType(scriptType);
    }

    function _createNewPublicKey(containerUUID, publicKeyContainerUUID, data = {}) {
        return `
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">hex</span>
                </div>
                <textarea id="pubkey-${publicKeyContainerUUID}" rows="3" class="form-control asm read-only-disable-${publicKeyContainerUUID}">${data.publicKey || ''}</textarea>
                <input hidden id="pubkey-fingerprint-${publicKeyContainerUUID}" value="${data.fingerprint || ''}">
                <input hidden id="pubkey-path-${publicKeyContainerUUID}" value="${data.path || ''}">
                <div class="input-group-append">
                    <button id="single-pubkey-update-button-${publicKeyContainerUUID}" onclick="paymentComponent.updateSinglePublicKeyDetails('${containerUUID}', '${publicKeyContainerUUID}')" 
                        class="btn btn-success d-none">
                        OK
                    </button> 
                    <button id="single-pubkey-toggle-button-${publicKeyContainerUUID}" onclick="paymentComponent.toggleSinglePublicKeyDetails('${containerUUID}', '${publicKeyContainerUUID}')" 
                        class="btn btn-info">
                        More
                    </button>
                    <button id="single-pubkey-remove-button-${publicKeyContainerUUID}" onclick="paymentComponent.removePublicKey('${containerUUID}', '${publicKeyContainerUUID}')"
                        class="btn btn-danger">
                        <i class="fas fa-trash-alt"></i>
                    </button> 
                </div>
            </div>
        `
    }

    function _paymentTypeFromScriptType(scriptType) {
        return Object.keys(types).find(type => types[type] === scriptType) || 'nonstandard';
    }

    function _checkPaymentByType(network, containerId) {
        const payment = paymentComponent.htmlToData(containerId);
        payment.network = network;
        if (payment.paymentType === 'nonstandard') {
            if (payment.output && payment.output.length) {
                payment.paymentType = classifyOutput(bitcoinjs.script.fromASM(payment.output));
            } else if (payment.input && payment.input.length) {
                payment.paymentType = classifyInput(bitcoinjs.script.fromASM(payment.input));
            } else if (payment.witness && payment.witness.length) {
                payment.paymentType = classifyWitness(bitcoinjs.script.fromASM(payment.witness));
            }
        }
        const dataFields = PAYMENT_FIELDS[payment.paymentType];
        const filteredPaymentData = _filterValuesForPaymentType(payment, dataFields);

        const paymentData = payment.paymentType === 'nonstandard' ? filteredPaymentData : bitcoinjs.payments[payment.paymentType](filteredPaymentData);
        paymentData.publicKeysList = (payment.publicKeysList || []).concat([]);
        paymentData.paymentType = payment.paymentType;
        paymentData.witnessScript = payment.witnessScript;
        return paymentData;
    }

    function _filterValuesForPaymentType(payment, dataFields) {
        return dataFields.reduce((data, field) => {
            const fieldValue = payment[field.name];
            if (fieldValue) {
                if (field.type === 'object' && Object.keys(fieldValue).length) {
                    data[field.name] = _filterValuesForPaymentType(fieldValue, field.fields);
                } else if (field.isList) {
                    data[field.name] = fieldValue.map(val => _fieldFromTextValue(val, field.type));
                } else {
                    data[field.name] = _fieldFromTextValue(fieldValue, field.type);
                }
            }
            return data;
        }, {});
    }

    function _fieldFromTextValue(fieldValue, fieldType) {
        switch (fieldType) {
            case 'asm':
                return bitcoinjs.script.fromASM(fieldValue);
            case 'hex':
                return safeBuffer.Buffer.from(fieldValue, 'hex');
            case 'number':
                return +fieldValue;
            default:
                return fieldValue;
        }
    }

    return {
        changePaymentType,
        checkPayment,
        classifyInput,
        classifyOutput,
        classifyWitnees,
        fromTxInput,
        fromTxOutput,
        updateComputedValues,
        toggleSinglePublicKeyDetails,
        toggleSignatureDetails,
        updateSinglePublicKeyDetails,
        addNewPublicKey,
        addNewSignature,
        addNewWitnessData,
        removePublicKey,
        removeSignature,
        removeWitnessData,
        wrappScript,
        unwrapScript,
        clear
    }
}();