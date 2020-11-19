const transactionComponent = function () {

    function addTxInput(containerUUID, inputData) {
        const inputUUID = uuidv4();
        const inputHtml = transactionInputComponent.createNew({
            inputUUID
        });
        $(`#ins-${containerUUID}`).append(`<div id="tx-input-${inputUUID}" class="shadow mb-2 mt-2 mr-2">${inputHtml}</div>`);
        if (inputData) {
            transactionInputComponent.dataToHtml(inputUUID, inputData);
        }
        transactionInputComponent.updateHeaderContainer(inputUUID, _buildInputHeader(containerUUID, inputUUID));

        const inputs = $(`#ins-${containerUUID}`).children();
        _updateInputsTitle(inputs);
        $(`#label-count-ins-${containerUUID}`).text(inputs.length || '0');

        expandBlock(`ins-${containerUUID}`);
        return inputUUID;
    }

    function removeTxInput(containerUUID, inputUUID) {
        $(`#tx-input-${inputUUID}`).remove();
        const inputs = $(`#ins-${containerUUID}`).children();
        _updateInputsTitle(inputs);
        $(`#label-count-ins-${containerUUID}`).text(inputs.length);
    }

    function addTxOutput(containerUUID, outputData) {
        const outputUUID = uuidv4();
        const outputHtml = transactionOutputComponent.createNew({
            outputUUID
        });
        $(`#outs-${containerUUID}`).append(`<div id="tx-output-${outputUUID}" class="shadow mb-2 mt-2 mr-2">${outputHtml}</div>`);
        if (outputData) {
            transactionOutputComponent.dataToHtml(outputUUID, outputData);
        }
        transactionOutputComponent.updateHeaderContainer(outputUUID, _buildOutputHeader(containerUUID, outputUUID));

        const outputs = $(`#outs-${containerUUID}`).children();
        _updateOutputsTitle(outputs);
        $(`#label-count-outs-${containerUUID}`).text(outputs.length);

        expandBlock(`outs-${containerUUID}`);
        return outputUUID;
    }

    function removeTxOutput(containerUUID, outputUUID) {
        $(`#tx-output-${outputUUID}`).remove();
        const outputs = $(`#outs-${containerUUID}`).children();
        _updateOutputsTitle(outputs);
        $(`#label-count-outs-${containerUUID}`).text(outputs.length);
    }

    function clear(containerUUID) {
        const container = $(`#transaction-container-${containerUUID}`);
        const parentContainerId = container.parent().attr('id');
        container.remove();

        $(`#${parentContainerId}`).html(transactionComponent.createNew({
            containerUUID
        }));
        transactionComponent.initInOutLists(containerUUID);
    }

    function openTransactionFromHexModal(containerUUID) {
        $('#modal-title').text('Transaction From Hex');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        $('#modal-body').append('<textarea id="txHexEdit" rows="10" style="width: 100%"></textarea>');

        $('#modal-confirm-button').click(function () {
            try {
                // clean all fields first
                const txHexValue = $('#txHexEdit').val();
                const tx = txHexValue ? bitcoinjs.Transaction.fromHex(txHexValue) : null;
                console.log('tx from hex:', tx);
                if (tx) {
                    transactionComponent.dataToHtml(containerUUID, {
                        tx
                    });
                }
            } catch (err) {
                console.error(err);
                openToasty('Transaction From Hex', err.message, true);
            }
        });
    }

    function openTransactionToHexModal(containerUUID) {
        $('#modal-title').text('Transaction To Hex');
        $('#modal-confirm-button').off();
        $('#modal-extra-buttons').empty();
        $('#modal-body').empty();

        try {
            const tx = transactionComponent.htmlToData(containerUUID);
            $('#modal-body').append('<textarea id="txHexView" readonly rows="10" style="width: 100%"></textarea>');
            $(`#txHexView`).val(tx.toHex());
        } catch (err) {
            console.error(err);
            openToasty('Transaction to Hex', err.message, true);
        }

        $('#modal-confirm-button').click(function () {});
    }

    function initInOutLists(containerUUID) {
        [`ins-${containerUUID}`, `outs-${containerUUID}`].forEach(block => {
            $(`#label-toggle-${block}`).click(() => {
                const isCollapsed = $(`#label-collapsed-${block}`).is(':visible');
                if (isCollapsed) {
                    expandBlock(block);
                } else {
                    collapseBlock(block);
                }
            });
            $(`#label-expanded-${block}`).hide();
        });
    }


    function _findInputIndex(containerUUID, inputUUID) {
        let index = undefined;
        $(`#ins-${containerUUID}`).children().each((poz, el) => {
            if (el.id === `tx-input-${inputUUID}`) {
                index = poz;
            }
        });
        return index;
    }

    function _buildInputHeader(containerUUID, inputUUID) {
        return `
                <button onclick="transactionComponent.removeTxInput('${containerUUID}','${inputUUID}')" type="button" class="btn btn-danger btn-sm" >
                    <i class="fas fa-trash-alt "></i>
                </button>
        `;
    }

    function _buildOutputHeader(containerUUID, outputUUID) {
        return `
            <div class="float-right">
                <button onclick="transactionComponent.removeTxOutput('${containerUUID}','${outputUUID}')" type="button" class="btn btn-danger btn-sm" >
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }

    function _updateInputsTitle(inputs) {
        inputs.each((poz, el) => {
            const inputId = (el.id || '').split('tx-input-')[1];
            if (inputId) {
                transactionInputComponent.setTitle(inputId, `Input [${poz}]`)
            }
        });
    }

    function _updateOutputsTitle(inputs) {
        inputs.each((poz, el) => {
            const inputId = (el.id || '').split('tx-output-')[1];
            if (inputId) {
                transactionOutputComponent.setTitle(inputId, `Output [${poz}]`)
            }
        });
    }

    return {
        addTxInput,
        removeTxInput,
        addTxOutput,
        removeTxOutput,
        openTransactionFromHexModal,
        openTransactionToHexModal,
        clear,
        initInOutLists
    }
}();