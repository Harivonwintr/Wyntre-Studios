/**
 * Hand-off between a clicked film frame and CaseStudyModal: the modal reads where the picture was
 * so it can fly the poster from that spot into the player (and back again on close).
 */
export type ModalOrigin = {
  /** The picture element that was clicked; measured again on close since the page may have moved */
  el: HTMLElement
}

let pending: ModalOrigin | null = null

export function setModalOrigin(origin: ModalOrigin) {
  pending = origin
}

/** Returns the origin set by the last click, once */
export function takeModalOrigin() {
  const origin = pending
  pending = null
  return origin
}
