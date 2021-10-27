let commentInputCounter = 0;

function showCommentEditor(commentSpanEl) {
    // if comment editor frame is already open, skip
    if (document.querySelector('.comment-card')) {
        return;
    }
    const commCard = document.createElement('section');
    const commToolbar = document.createElement('div');
    const commTitle = document.createElement('h2');
    const commInput = document.createElement('textarea');
    const commCloseBtn = document.createElement('button');
    const quillEditor = document.querySelector('quill-editor');
    const currentComm = commentSpanEl.getAttribute('comment-text');

    commCard.setAttribute('class', 'comment-card');
    commToolbar.setAttribute('class', 'comment-toolbar');
    commTitle.innerHTML = 'Edit comment';
    commInput.setAttribute('id', `comment-input-${commentInputCounter}`);
    commInput.setAttribute('class', 'comment-input');
    commInput.setAttribute('name', `comment-input-${commentInputCounter}`);
    if (currentComm !== 'LONGPLACEHOLDER') {
        commInput.innerHTML = currentComm;
    }
    commCloseBtn.setAttribute('class', 'comment-close-button');
    commCloseBtn.innerHTML = 'Close';
    commentInputCounter++;

    commToolbar.appendChild(commTitle);
    commCard.append(commToolbar, commInput, commCloseBtn);
    quillEditor.appendChild(commCard);

    const commUpdateListener = () => {
        // ensure that the comment element/attribute hasn't been removed by user
        if (quillEditor.contains(commentSpanEl) && commentSpanEl.hasAttribute('onclick')) {
            commentSpanEl.setAttribute('comment-text', commInput.value);
        } else {
            closeCommentEditor();
        }
    }

    const closeCommentEditor = () => {
        quillEditor.removeChild(commCard);
        if (commentSpanEl.hasAttribute('onclick')) {
            commentSpanEl.focus();
        }
    }

    commInput.addEventListener('input', commUpdateListener);
    commCloseBtn.addEventListener('click', closeCommentEditor);
    setTimeout(
        () => {commInput.focus();},
        20
    );
}