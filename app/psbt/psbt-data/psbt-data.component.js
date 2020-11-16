const psbtDataComponent = function () {

    function addPsbtInput(containerUUID, inputData) {
        const inputUUID = uuidv4();
        const inputHtml = transactionInputComponent.createNew({
            inputUUID
        });
        $(`#ins-${containerUUID}`).append(`<div id="psbt-input-${inputUUID}" class="shadow mb-2 mt-2 mr-2">${inputHtml}</div>`);
        if (inputData) {
            transactionInputComponent.dataToHtml(inputUUID, inputData);
        }
        const role = $(`#psbt-role-${containerUUID}`).val();
        transactionInputComponent.setRole(inputUUID, role);
        transactionInputComponent.updateHeaderContainer(inputUUID, _buildInputHeader(containerUUID, inputUUID));

        const inputs = $(`#ins-${containerUUID}`).children();
        _updateInputsTitle(inputs);
        $(`#label-count-ins-${containerUUID}`).text(inputs.length || '0');

        $(`#label-collapsed-ins-${containerUUID}`).addClass('d-none');
        $(`#label-expanded-ins-${containerUUID}`).removeClass('d-none');
        $(`#ins-${containerUUID}`).show();
        return inputUUID;
    }

    function removePsbtInput(containerUUID, outputUUID) {
        $(`#psbt-input-${outputUUID}`).remove();
        const inputs = $(`#ins-${containerUUID}`).children();
        _updateInputsTitle(inputs);
        $(`#label-count-ins-${containerUUID}`).text(inputs.length);
    }

    function addPsbtOutput(containerUUID, outputData) {
        const outputUUID = uuidv4();
        const outputHtml = transactionOutputComponent.createNew({
            outputUUID
        });
        $(`#outs-${containerUUID}`).append(`<div id="psbt-output-${outputUUID}" class="shadow mb-2 mt-2 mr-2">${outputHtml}</div>`);
        if (outputData) {
            transactionOutputComponent.dataToHtml(outputUUID, outputData);
        }
        const role = $(`#psbt-role-${containerUUID}`).val();
        transactionOutputComponent.updateHeaderContainer(outputUUID, _buildOutputHeader(containerUUID, outputUUID));


        const outputs = $(`#outs-${containerUUID}`).children();
        _updateOutputsTitle(outputs);
        $(`#label-count-outs-${containerUUID}`).text(outputs.length);

        transactionOutputComponent.setRole(outputUUID, role);

        $(`#label-collapsed-outs-${containerUUID}`).addClass('d-none');
        $(`#label-expanded-outs-${containerUUID}`).removeClass('d-none');
        $(`#outs-${containerUUID}`).show();
        return outputUUID;
    }

    function removePsbtOutput(containerUUID, outputUUID) {
        $(`#psbt-output-${outputUUID}`).remove();
        const outputs = $(`#outs-${containerUUID}`).children();
        _updateOutputsTitle(outputs);
        $(`#label-count-outs-${containerUUID}`).text(outputs.length);
    }


    function _updateInputsTitle(inputs) {
        inputs.each((poz, el) => {
            const inputId = (el.id || '').split('psbt-input-')[1];
            if (inputId) {
                transactionInputComponent.setTitle(inputId, `Input [${poz}]`);
            }
        });
    }

    function _updateOutputsTitle(outputs) {
        outputs.each((poz, el) => {
            const outputId = (el.id || '').split('psbt-output-')[1];
            if (outputId) {
                transactionOutputComponent.setTitle(outputId, `Output [${poz}]`)
            }
        });
    }

    function _buildInputHeader(containerUUID, inputUUID) {
        return `
                <button onclick="psbtDataComponent.removePsbtInput('${containerUUID}','${inputUUID}')" type="button" 
                    class="btn btn-danger btn-sm role-create-${inputUUID}" >
                    <i class="fas fa-trash-alt "></i>
                </button>`;
    }

    function _buildOutputHeader(containerUUID, outputUUID) {
        return `
            <div class="float-right">
                <button onclick="psbtDataComponent.removePsbtOutput('${containerUUID}','${outputUUID}')" type="button" 
                    class="btn btn-danger btn-sm role-create-${outputUUID}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }

    return {
        addPsbtInput,
        removePsbtInput,
        addPsbtOutput,
        removePsbtOutput
    }
}();