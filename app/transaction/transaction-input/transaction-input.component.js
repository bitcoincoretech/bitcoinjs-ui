const transactionInputComponent = function () {

    function openUnlockScriptModal(inputUUID) {
        $('#modal-title').text('Edit Unlocking Script');
        $('#modal-confirm-button').off();

        const paymentContainerUUID = uuidv4();
        $('#modal-body').html(paymentComponent.createNew({
            containerUUID: paymentContainerUUID
        }));
        $('#modal-extra-buttons').html(paymentComponent.createExternalMenu({
            containerUUID: paymentContainerUUID
        }));
        const inputData = transactionInputComponent.htmlToData(inputUUID);
        const isReadOnly = $(`#is-read-only-${inputUUID}`).val() === 'true';
        try {
            paymentComponent.fromTxInput(paymentContainerUUID, inputData);
            paymentComponent.updateComputedValues(paymentContainerUUID);
            paymentComponent.setReadOnly(paymentContainerUUID, isReadOnly, true);
        } catch (err) {
            console.error(err);
            openToasty('Open Payment', err.message, true);
        }
        $('#modal-confirm-button').click(function () {
            const payment = paymentComponent.checkPayment(paymentContainerUUID);
            if (payment) {
                if ((payment.input && payment.input.length) || (payment.witness && payment.witness.length)) {
                    inputData.script = payment.input;
                    inputData.witness = payment.witness;
                    inputData.redeemScript = payment.redeem && payment.redeem.output;
                    inputData.scriptType = payment.paymentType;
                }
            }
            const paymentData = paymentComponent.htmlToData(paymentContainerUUID);

            if (paymentData.publicKeysList && paymentData.publicKeysList.length) {
                inputData.publicKeysList = paymentData.publicKeysList;
            }
            if (paymentData.signaturesList && paymentData.signaturesList.length) {
                inputData.signaturesList = paymentData.signaturesList;
            }
            transactionInputComponent.dataToHtml(inputUUID, inputData);
        });
    }

    function openRedeemScriptModal(inputUUID) {
        $('#modal-title').text('Edit Redeem Script');
        $('#modal-confirm-button').off();

        const paymentContainerUUID = uuidv4();
        $('#modal-body').html(paymentComponent.createNew({
            containerUUID: paymentContainerUUID
        }));
        $('#modal-extra-buttons').html(paymentComponent.createExternalMenu({
            containerUUID: paymentContainerUUID
        }));
        const inputData = transactionInputComponent.htmlToData(inputUUID);

        const paymentData = {
            paymentType: inputData.redeemScriptType
        };
        if (inputData.script && inputData.script) {
            paymentData.input = inputData.script;
        }
        if (inputData.redeemScript && inputData.redeemScript.length) {
            paymentData.output = inputData.redeemScript;
        }
        if (inputData.publicKeysList) {
            paymentData.publicKeysList = inputData.publicKeysList;
        }
        const isReadOnly = $(`#is-read-only-${inputUUID}`).val() === 'true';
        paymentComponent.changePaymentType(paymentContainerUUID, inputData.redeemScriptType);
        paymentComponent.dataToHtml(paymentContainerUUID, paymentData, true);
        paymentComponent.updateComputedValues(paymentContainerUUID);
        paymentComponent.setReadOnly(paymentContainerUUID, isReadOnly, true);
        $('#modal-confirm-button').click(function () {
            const payment = paymentComponent.checkPayment(paymentContainerUUID);
            if (payment) {
                if (payment.output && payment.output.length) {
                    inputData.redeemScript = payment.output;
                }
            }
            const paymentData = paymentComponent.htmlToData(paymentContainerUUID);

            if (paymentData.publicKeysList && paymentData.publicKeysList.length) {
                inputData.publicKeysList = paymentData.publicKeysList;
            }
            if (paymentData.signaturesList && paymentData.signaturesList.length) {
                inputData.signaturesList = paymentData.signaturesList;
            }
            console.log('paymentDataRedeem', paymentData);
            transactionInputComponent.dataToHtml(inputUUID, inputData);
        });
    }

    function openPreviousTxModal(inputUUID) {
        $('#modal-title').text('Previous Transaction Data');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();
        try {
            const txHex = $(`#previous-tx-hex-${inputUUID}`).val() || '';

            if (!txHex) {
                throw new Error('Please provide the hex value of the Transaction first!')
            }
            const tx = bitcoinjs.Transaction.fromHex(txHex);

            const newContainerUUID = uuidv4();
            $(`#modal-body`).html(transactionComponent.createNew({
                containerUUID: newContainerUUID
            }));
            transactionComponent.initInOutLists(newContainerUUID);
            transactionComponent.dataToHtml(newContainerUUID, {
                tx
            });
            transactionComponent.setReadOnly(newContainerUUID, true);
        } catch (err) {
            console.error(err);
            openToasty('View Previous Trnasaction', err.message, true);
        }
    }

    function openTransactionFromHexModal(inputUUID) {
        $('#modal-title').text('Transaction From Hex');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        $('#modal-body').append('<textarea id="txHexEdit" rows="10" style="width: 100%"></textarea>');

        $('#modal-confirm-button').click(function () {
            try {
                const txHexValue = $('#txHexEdit').val() || '';
                setPreviousTxHex(inputUUID, txHexValue);
            } catch (err) {
                console.error(err);
                openToasty('Transaction From Hex', err.message, true);
            }
        });
    }

    function toggleUTXODetails(inputUUID) {
        try {
            const isVisible = !$(`#utxo-${inputUUID}-row`).hasClass('d-none');
            const isReadOnly = $(`#is-read-only-${inputUUID}`).val() === 'true';
            if (isVisible) {
                _hideUTXODetails(inputUUID);
                return;
            }
            const inputData = transactionInputComponent.htmlToData(inputUUID);
            const outputData = inputData.utxo || {};
            outputData.publicKeysList = (inputData.publicKeysList || []).concat([]);

            const utxoContainerUUID = uuidv4();
            const utxoHtml = transactionOutputComponent.createNew({
                outputUUID: utxoContainerUUID
            });
            $(`#utxo-details-container-${inputUUID}`).html(`<div id="utxo-edit-details-${utxoContainerUUID}">${utxoHtml}</div>`);
            transactionOutputComponent.dataToHtml(utxoContainerUUID, outputData);
            transactionOutputComponent.setReadOnly(utxoContainerUUID, isReadOnly, true);

            $(`#utxo-details-toggle-button-${inputUUID}`).html('Cancel').removeClass('btn-info').addClass('btn-secondary');
            $(`#utxo-details-update-button-${inputUUID}`).removeClass('d-none');
            $(`#utxo-${inputUUID}-row`).removeClass('d-none');
            $(`.input-row-${inputUUID}`).addClass('blur-medium');
            $(`.input-utxo-row-${inputUUID}`).removeClass('blur-medium');
        } catch (err) {
            console.log(err);
            openToasty('UTXO Details', err.message, true);
        }
    }

    function updateUTXODetails(inputUUID) {
        try {
            const utxoContainerUUID = (($(`#utxo-details-container-${inputUUID}`).children()[0] || {}).id || '').split('utxo-edit-details-')[1];
            if (!utxoContainerUUID) {
                return;
            }
            const utxo = transactionOutputComponent.htmlToData(utxoContainerUUID);
            _validateScriptAgainstTx(inputUUID, utxo.script);

            const inputData = transactionInputComponent.htmlToData(inputUUID);
            inputData.utxo = {
                script: utxo.script,
                redeem: utxo.redeem,
                witnessScript: utxo.witnessScript
            }
            if (utxo.publicKeysList && utxo.publicKeysList.length) {
                inputData.publicKeysList = utxo.publicKeysList.concat([]);
            }

            transactionInputComponent.dataToHtml(inputUUID, inputData);
            _hideUTXODetails(inputUUID);
        } catch (err) {
            console.log(err);
            openToasty('Update UTXO Details', err.message, true);
        }
    }

    function removePreviousTx(inputUUID) {
        setPreviousTxHex(inputUUID, '');
    }

    function updateHeaderContainer(inputUUID, html) {
        $(`#input-entry-header-container-${inputUUID}`).append(html);
    }

    function changePreviousOutputIndex(inputUUID) {
        const txHexValue = $(`#previous-tx-hex-${inputUUID}`).val() || '';
        setPreviousTxHex(inputUUID, txHexValue);
    }

    function setTitle(inputUUID, text) {
        $(`#input-entry-title-${inputUUID}`).text(text);
    }

    function setPreviousTxHex(inputUUID, txHexValue) {
        const inputData = transactionInputComponent.htmlToData(inputUUID);
        inputData.previousTxHex = txHexValue;
        transactionInputComponent.dataToHtml(inputUUID, inputData);
        _hideUTXODetails(inputUUID);
    }

    function _hideUTXODetails(inputUUID) {
        $(`#utxo-details-toggle-button-${inputUUID}`).html('More').addClass('btn-info').removeClass('btn-secondary');
        $(`#utxo-details-update-button-${inputUUID}`).addClass('d-none');
        $(`#utxo-${inputUUID}-row`).addClass('d-none')
        $(`#utxo-details-container-${inputUUID}`).empty();
        $(`.input-row-${inputUUID}`).removeClass('blur-medium');
    }

    function _validateScriptAgainstTx(inputUUID, script) {
        const txHexValue = $(`#previous-tx-hex-${inputUUID}`).val();
        if (!txHexValue) {
            return;
        }
        const index = +$(`#ins-index-${inputUUID}`).val();
        const tx = bitcoinjs.Transaction.fromHex(txHexValue);

        const scriptAsm = script ? bitcoinjs.script.toASM(script) : '';
        const txOutScriptAsm = tx.outs[index].script ? bitcoinjs.script.toASM(tx.outs[index].script) : '';
        if (scriptAsm !== txOutScriptAsm) {
            throw new Error(`Script is different than the provided previous transaction output[${index}] script!`);
        }
    }

    return {
        openUnlockScriptModal,
        openRedeemScriptModal,
        removePreviousTx,
        updateHeaderContainer,
        changePreviousOutputIndex,
        setTitle,
        openPreviousTxModal,
        setPreviousTxHex,
        openTransactionFromHexModal,
        toggleUTXODetails,
        updateUTXODetails
    }
}();