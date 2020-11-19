const sighashComponent = function () {

    function changeSighashModes(containerUUID, inputSighash = '', outputSighash = '') {
        const sighashData = sighashComponent.htmlToData(containerUUID);
        inputSighash = inputSighash || sighashData.inputSighash;
        outputSighash = outputSighash || sighashData.outputSighash;

        sighashComponent.dataToHtml(containerUUID, {
            inputSighash,
            outputSighash
        });

        const sighashValue = _buildHashTypeMode(inputSighash, outputSighash);
        $(`#sighash-value-${containerUUID}`).val('0x' + sighashValue.toString('16'));

        $(`.sighash-description-${containerUUID}`).hide();
        $(`#sighash-description-${bitcoinjs.Transaction[inputSighash]}-${bitcoinjs.Transaction[outputSighash]}-${containerUUID}`).show();
    }

    function setSighashValue(containerUUID, hashTypeHex = 1) {
        const hashType = parseInt(hashTypeHex, 16);
        const inputSighash = (hashType & 0x80) ? "SIGHASH_ANYONECANPAY" : "SIGHASH_ALL";
        const sigMod = hashType & 0x1f;
        const outputSighash = (sigMod === 0x02) ? "SIGHASH_NONE" : ((sigMod === 0x03) ? "SIGHASH_SINGLE" : "SIGHASH_ALL");
        changeSighashModes(containerUUID, inputSighash, outputSighash);
    }



    function getSighashValue(containerUUID) {
        const sighashData = sighashComponent.htmlToData(containerUUID);

        return _buildHashTypeMode(sighashData.inputSighash, sighashData.outputSighash);
    }

    function _buildHashTypeMode(inputSighash, outputSighash) {
        const inputSighashValue = bitcoinjs.Transaction[inputSighash];
        const outputSighashValue = bitcoinjs.Transaction[outputSighash];
        return (inputSighash === 'SIGHASH_ALL') ? outputSighashValue : inputSighashValue | outputSighashValue;
    }

    return {
        changeSighashModes,
        getSighashValue,
        setSighashValue
    }
}();