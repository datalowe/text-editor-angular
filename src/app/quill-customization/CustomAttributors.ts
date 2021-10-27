import Quill from "quill";

const Parchment = Quill.import('parchment');
export const commentAtt = new Parchment.Attributor.Attribute(
    'comment-text',
    'comment-text', {
    scope: Parchment.Scope.INLINE
});

export const onclickAtt = new Parchment.Attributor.Attribute(
    'onclick',
    'onclick', {
    scope: Parchment.Scope.INLINE
});

export const commentIdAtt = new Parchment.Attributor.Attribute(
    'comment-id',
    'comment-id', {
    scope: Parchment.Scope.INLINE
});
