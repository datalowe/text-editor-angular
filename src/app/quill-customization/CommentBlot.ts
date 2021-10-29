import Quill from 'quill';

let Inline = Quill.import('blots/inline');

export class CommentBlot extends Inline {
  static create(value: any) {
    const node = super.create(value);
    node.setAttribute('comment-id', Math.round(Math.random() * 1000000));
    node.setAttribute('comment-text', 'LONGPLACEHOLDER');
    node.setAttribute('onclick', 'showCommentEditor(this)');
    node.click();
    return node;
  }

  format(name: string, value: string) {
    if (name !== this.statics.blotName || !value) {
      super.format(name, value);
    } else {
      this.domNode.setAttribute('comment-text', value);
    }
  }

  formats() {
    let formats = super.formats();
    formats['comment'] = CommentBlot.formats(this.domNode);
    return formats;
  }
}

CommentBlot.blotName = 'comment';
CommentBlot.tagName = 'span';
