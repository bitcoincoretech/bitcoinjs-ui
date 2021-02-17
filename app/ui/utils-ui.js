function asmToHtml(chunks = []) {
    let indent = 0;
    return chunks.map(value => {
        try {
            const labelType = value.startsWith('OP_') ? 'dark' : 'secondary';
            if (value.toUpperCase() === 'OP_ELSE' || value.toUpperCase() === 'OP_ENDIF') {
                indent--
            }
            const paddingRight = new Array(indent + 1).join('<span class="ml-4"></span>');
            const badge = `${paddingRight}<span class="badge badge-${labelType} text-wrap text-left mr-4">${value}</span><br>`;
            if (value.toUpperCase() === 'OP_IF' || value.toUpperCase() === 'OP_ELSE') {
                indent++;
            }
            return badge;
        } catch (err) {
            console.error(err);
            return `?${value}?`;
        }
    });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function openToasty(title = '', message = '', isError) {
    $('#toast-title').text(title);
    $('#toast-message').text(message);
    if (isError) {
        $('#toast-message-type').removeClass('alert-success');
        $('#toast-message-type').addClass('alert-danger');
    } else {
        $('#toast-message-type').removeClass('alert-danger');
        $('#toast-message-type').addClass('alert-success');
    }
    $('#toasty').show();
    $('#toasty').toast('show');
    setTimeout(() => {
        $('#toasty').hide();
    }, 5000);
}

function syncHexValue(targetId, value = 0) {
    $(`#${targetId}`).text('0x' + (+value).toString(16));
}

function expandBlock(name) {
    $(`#label-collapsed-${name}`).hide();
    $(`#label-expanded-${name}`).show();
    $(`#${name}`).show();
}

function collapseBlock(name) {
    $(`#label-collapsed-${name}`).show();
    $(`#label-expanded-${name}`).hide();
    $(`#${name}`).hide();
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function revealPasswordField(elementId) {
    const x = document.getElementById(elementId);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function reverseBuffer(buffer) {
    if (buffer.length < 1) return buffer;
    let j = buffer.length - 1;
    let tmp = 0;
    for (let i = 0; i < buffer.length / 2; i++) {
        tmp = buffer[i];
        buffer[i] = buffer[j];
        buffer[j] = tmp;
        j--;
    }
    return buffer;
}