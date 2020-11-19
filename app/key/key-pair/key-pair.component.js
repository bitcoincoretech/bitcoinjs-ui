const keyPairComponent = function () {

    function changeSourceType(containerUUID, sourceType = '') {
        sourceType = sourceType || $(`#key-pair-generation-mode-${containerUUID}`).val() || 'wif-text';
        $(`#key-pair-generation-mode-${containerUUID}`).val(sourceType);

        $(`#key-pair-random-${containerUUID}-row`).hide();
        $(`#wif-value-${containerUUID}-row`).hide();
        $(`#wif-file-${containerUUID}-row`).hide();

        switch (sourceType) {
            case 'random':
                $(`#key-pair-random-${containerUUID}-row`).show();
                break;
            case 'wif-text':
                $(`#wif-value-${containerUUID}-row`).show();
                break;
            case 'wif-file':
                $(`#wif-file-${containerUUID}-row`).show();
                break;
        }
        $(`#public-key-value-${containerUUID}`).val('');
        $(`#private-key-value-${containerUUID}`).val('');

    }

    function allowRandomGeneration(containerUUID, isAllowed) {
        if (isAllowed) {
            $(`#key-pair-random-generation-mode-option-${containerUUID}`).show();
        } else {
            $(`#key-pair-random-generation-mode-option-${containerUUID}`).hide();
        }
    }

    function newRandomECPair(containerUUID) {
        const network = networkComponent.htmlToData('default');
        const ecPair = bitcoinjs.ECPair.makeRandom({
            network
        });
        $(`#public-key-value-${containerUUID}`).val(ecPair.publicKey.toString('hex') || '');
        $(`#private-key-value-${containerUUID}`).val(ecPair.privateKey.toString('hex') || '');
    }

    function importWIFText(containerUUID) {
        const network = networkComponent.htmlToData('default');

        try {
            const wifText = $(`#wif-value-${containerUUID}`).val();
            const ecPair = bitcoinjs.ECPair.fromWIF(wifText, network);
            $(`#public-key-value-${containerUUID}`).val(ecPair.publicKey.toString('hex') || '');
            $(`#private-key-value-${containerUUID}`).val(ecPair.privateKey.toString('hex') || '');
        } catch (err) {
            console.error(err);
            openToasty('Check Payment', err.message, true);
        }
    }

    function exportWIFText(containerUUID) {
        const network = networkComponent.htmlToData('default');

        try {
            const privateKey = $(`#private-key-value-${containerUUID}`).val() || '';
            const privateKeyBuffer = safeBuffer.Buffer.from(privateKey, 'hex');
            const ecPair = bitcoinjs.ECPair.fromPrivateKey(privateKeyBuffer, {
                network
            });
            return ecPair.toWIF();
        } catch (err) {
            console.error(err);
            openToasty('Key Pair Export', err.message, true);
        }
    }

    function downloadWIFFile(containerUUID) {
        try {
            const wifText = exportWIFText(containerUUID);
            downloadFile(`${uuidv4()}.wif`, wifText);
        } catch (err) {
            console.error(err);
            openToasty('Key pair download', err.message, true);
        }

    }

    function uploadWIFFile(containerUUID) {
        try {
            const fileToLoad = document.getElementById(`wif-file-${containerUUID}`).files[0];
            if (!fileToLoad) {
                throw new Error('No file selected!');
            }
            const fileReader = new FileReader()
            fileReader.onload = function (fileLoadedEvent) {
                try {
                    const wifText = fileLoadedEvent.target.result;
                    $(`#wif-value-${containerUUID}`).val(wifText);
                    keyPairComponent.importWIFText(containerUUID);
                } catch (err) {
                    console.error(err);
                    openToasty('WIF File Import', err.message, true);
                }
            };

            fileReader.readAsText(fileToLoad, "UTF-8");
        } catch (err) {
            console.error(err);
            openToasty('WIF File Import', err.message, true);
        }
    }

    function selectedFileChanged(containerUUID, filePath = '') {
        const filePathTokens = filePath.split('\\');
        const fileName = filePathTokens[filePathTokens.length - 1];
        $(`#wif-file-label-${containerUUID}`).text(fileName);
        openToasty('WIF File Selected', "You can now import the WIF file!");
    }

    return {
        changeSourceType,
        newRandomECPair,
        downloadWIFFile,
        uploadWIFFile,
        importWIFText,
        exportWIFText,
        selectedFileChanged,
        allowRandomGeneration
    }
}();