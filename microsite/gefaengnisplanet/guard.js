(() => {
  'use strict';
  // The geometry is never a file. It ships inside the document as packed
  // 16 bit integers, there is no model URL to request, and the canvases give
  // up neither a context menu nor a drag image — so the usual one click routes
  // to a saved model or a saved frame are closed.
  //
  // What this cannot do, and no client side renderer can: stop someone who
  // opens the developer tools. Anything the GPU draws, a determined reader can
  // reconstruct. This raises the floor; it does not lock the door.
  const block = (e) => {
    if (e.target instanceof HTMLCanvasElement) e.preventDefault();
  };
  document.addEventListener('contextmenu', block);
  document.addEventListener('dragstart', block);
})();
