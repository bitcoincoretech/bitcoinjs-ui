const transactionOutputComponent = function () {

    function openLockScriptModal(outputUUID) {
        $('#modal-title').text('Edit Locking Script');
        $('#modal-confirm-button').off();

        try {
            const paymentContainerUUID = `output-payment-${outputUUID}`;
            $('#modal-body').html(paymentComponent.createNew({
                containerUUID: paymentContainerUUID
            }));
            $('#modal-extra-buttons').html(paymentComponent.createExternalMenu({
                containerUUID: paymentContainerUUID
            }));

            const outputData = transactionOutputComponent.htmlToData(outputUUID);
            paymentComponent.fromTxOutput(paymentContainerUUID, outputData);
            paymentComponent.updateComputedValues(paymentContainerUUID);

            const isReadOnlyPayment = $(`#is-read-only-payment-${outputUUID}`).val() === 'true';
            paymentComponent.setReadOnly(paymentContainerUUID, isReadOnlyPayment);
            $('#modal-confirm-button').click(function () {
                try {
                    const payment = paymentComponent.checkPayment(paymentContainerUUID);
                    const paymentData = paymentComponent.htmlToData(paymentContainerUUID);
                    outputData.script = payment.output;
                    outputData.redeem = payment.redeem;
                    outputData.pubkey = payment.pubkey;

                    outputData.publicKeysList = paymentData.publicKeysList;
                    outputData.witnessScript = paymentData.witnessScript ? bitcoinjs.script.fromASM(paymentData.witnessScript) : '';
                    transactionOutputComponent.dataToHtml(outputUUID, outputData);
                } catch (err) {
                    console.error(err);
                    openToasty('Lock Script', err.message, true);
                }
            });
        } catch (err) {
            console.error(err);
            openToasty('Lock Script', err.message, true);
        }
    }

    function updateHeaderContainer(outputUUID, html) {
        $(`#output-entry-header-container-${outputUUID}`).html(html);
    }

    function setTitle(outputUUID, text) {
        $(`#output-entry-title-${outputUUID}`).text(text);
    }

    return {
        openLockScriptModal,
        updateHeaderContainer,
        setTitle
    }
}();