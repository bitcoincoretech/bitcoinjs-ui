const signInputComponent = function () {

    function signInput(containerUUID, index = -1) {
        try {
            const selectedKeyId = $(`#key-list-${containerUUID}`).val() || '';
            if (!selectedKeyId) {
                throw new Error('No Key selected for signing!');
            }

            const keyData = keyManagerComponent.htmlToData('default');
            const keyPair = keyData.keys.find(key => key.id === selectedKeyId);
            if (!keyPair) {
                throw new Error('Key not found!');
            }

            const psbtBase64 = $(`#base64-psbt-${containerUUID}`).val();
            if (!psbtBase64) {
                throw new Error('PSBT not found for signing!');
            }
            const network = networkComponent.htmlToData('default');
            const psbt = bitcoinjs.Psbt.fromBase64(psbtBase64, {
                network
            });

            if (keyPair.type === 'HD') {
                const hdKeyPair = bitcoinjs.bip32.fromBase58(keyPair.base58, network);
                const signedPsbt = _signHD(psbt, index, hdKeyPair);
                const signedPsbtBase64 = signedPsbt.toBase64();
                signInputComponent.dataToHtml(containerUUID, {
                    psbtBase64: signedPsbtBase64,
                    keys: keyData.keys,
                    selectedKeyId
                });
            } else {
                const ecPair = bitcoinjs.ECPair.fromWIF(keyPair.base58, network);
                const signedPsbt = _signSimple(psbt, index, ecPair);
                const signedPsbtBase64 = signedPsbt.toBase64();
                signInputComponent.dataToHtml(containerUUID, {
                    psbtBase64: signedPsbtBase64,
                    keys: keyData.keys,
                    selectedKeyId
                });
            }
            signInputComponent.setRole(containerUUID, 'sign');
        } catch (err) {
            console.error(err);
            openToasty(`Sign Input [${index === -1 ? 'All': index}]`, err.message, true);
        }
    }

    function finalizeInput(containerUUID, index = -1) {
        try {
            const psbtBase64 = $(`#base64-psbt-${containerUUID}`).val();
            if (!psbtBase64) {
                throw new Error('PSBT not found for signing!');
            }
            const network = networkComponent.htmlToData('default');
            const psbt = bitcoinjs.Psbt.fromBase64(psbtBase64, {
                network
            });

            const finalizedPsbt = _finalizeInput(psbt, index);
            const finalizedPsbtBase64 = finalizedPsbt.toBase64();
            signInputComponent.dataToHtml(containerUUID, {
                psbtBase64: finalizedPsbtBase64
            });
            signInputComponent.setRole(containerUUID, 'finalize');
        } catch (err) {
            console.error(err);
            openToasty(`Finalize Input [${index === -1 ? 'All': index}]`, err.message, true);
        }
    }

    function toggleSighash(containerUUID) {
        const isVisible = !$(`#input-sighash-details-${containerUUID}`).hasClass('d-none');
        if (isVisible) {
            $(`#input-sighash-details-${containerUUID}`).addClass('d-none').removeClass('d-flex');
            $(`#input-sighash-toggle-button-${containerUUID}`).html('More').removeClass('btn-secondary').addClass('btn-info');
            $(`#input-sighash-update-button-${containerUUID}`).addClass('d-none');
            $(`#input-sighash-container-${containerUUID}`).empty();
        } else {
            $(`#input-sighash-details-${containerUUID}`).removeClass('d-none').addClass('d-flex');
            $(`#input-sighash-toggle-button-${containerUUID}`).html('Cancel').addClass('btn-secondary').removeClass('btn-info');
            $(`#input-sighash-update-button-${containerUUID}`).removeClass('d-none');

            const sighashUUID = uuidv4();
            const sighashHtml = sighashComponent.createNew({
                containerUUID: sighashUUID
            });
            $(`#input-sighash-container-${containerUUID}`).html(`<div id="sighash-id-${sighashUUID}">${sighashHtml}</div>`);
            const sighashValue = $(`#input-sighash-value-${containerUUID}`).val() || '';
            sighashComponent.setSighashValue(sighashUUID, sighashValue);
        }
    }

    function updateSighash(containerUUID, inputContainerUUID, index = -1) {
        try {
            const psbtBase64 = $(`#base64-psbt-${containerUUID}`).val();
            if (!psbtBase64) {
                throw new Error('PSBT not found for signing!');
            }
            if (index === -1) {
                throw new Error('No input index specified!');
            }
            const network = networkComponent.htmlToData('default');

            const sighashUUID = (($(`#input-sighash-container-${inputContainerUUID}`).children()[0] || {}).id || '').split('sighash-id-')[1];
            const psbt = bitcoinjs.Psbt.fromBase64(psbtBase64, {
                network
            });

            const sighashType = sighashComponent.getSighashValue(sighashUUID);



            psbt.updateInput(index, {
                sighashType
            });

            signInputComponent.dataToHtml(containerUUID, {
                psbtBase64: psbt.toBase64()
            });

            signInputComponent.setRole(containerUUID);
        } catch (err) {
            console.error(err);
            openToasty(`Sighash [${index === -1 ? 'All': index}]`, err.message, true);
        }
    }

    function _signSimple(psbt, index, ecPair) {
        if (index !== -1) {
            return psbt.signInput(index, ecPair);
        }
        return psbt.signAllInputs(ecPair);
    }

    function _signHD(psbt, index, hdKeyPair) {
        if (index !== -1) {
            return psbt.signInputHD(index, hdKeyPair);
        }
        return psbt.signAllInputsHD(hdKeyPair);
    }

    function _finalizeInput(psbt, index) {
        if (index !== -1) {
            return psbt.finalizeInput(index);
        }
        return psbt.finalizeAllInputs();
    }

    return {
        signInput,
        finalizeInput,
        toggleSighash,
        updateSighash
    }
}();