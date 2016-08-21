// input, textarea cusor problem
function setCaretPosition(elemId, caretPos) {
    var el = document.getElementById(elemId);

    el.value = el.value;
    // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

    if (el !== null) {

        if (el.createTextRange) {
            var range = el.createTextRange();
            range.move('character', caretPos);
            range.select();
            return true;
        } else {
            // (el.selectionStart === 0 added for Firefox bug)
            if (el.selectionStart || el.selectionStart === 0) {
                el.focus();
                el.setSelectionRange(caretPos, caretPos);
                return true;
            } else { // fail city, fortunately this never happens (as far as I've tested) :)
                el.focus();
                return false;
            }
        }
    }
}

function selection(input, start, end) {
    // input为输入框，如input、textarea
    // start为光标起始位置，如 0
    // end为光标结束为止，如 10
    // TODO
    var el = document.getElementById(input);

    el.value = el.value;
    // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

    if (el !== null) {

        if (el.createTextRange) {
            var range = el.createTextRange();
            range.move('character', start);
            range.select(start, end);
            return true;
        } else {
            // (el.selectionStart === 0 added for Firefox bug)
            if (el.selectionStart || el.selectionStart === 0) {
                el.focus();
                el.setSelectionRange(start, end);
                return true;
            } else { // fail city, fortunately this never happens (as far as I've tested) :)
                el.focus();
                return false;
            }
        }
    }
}

// ？
function getInputSelection(el) {
    var userSelection;
    if (window.getSelection) {
        userSelection = window.getSelection();
    } else if (document.selection) { // Opera
        userSelection = document.selection.createRange();
    }

    var range;
    if (userSelection.getRangeAt) {
        range = userSelection.getRangeAt(0);
    } else { // Safari
        range = document.createRange();
        range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
        range.setEnd(userSelection.focusNode, userSelection.focusOffset);
    }

}
