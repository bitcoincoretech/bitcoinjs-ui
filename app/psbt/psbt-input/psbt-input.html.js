psbtInputComponent.createNew = function createNew(op) {
    const txInputHtml = transactionInputComponent.createNew(op);
    return `
        <div id="psbt-input-entry-${op.inputUUID}" class="psbt-input-entry-${op.inputUUID}">
            ${txInputHtml}
        </div>
    `;
}