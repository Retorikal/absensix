setInterval(poll, 2000);

function dispatchClick(node) {
  let event = document.createEvent("MouseEvents");
  event.initEvent("click", true, false);
  node.dispatchEvent(event);
}

function poll() {
  let clickAdmit = (node) => {
    if (node.nodeName == "#text" &&
        (node.textContent.indexOf("Admit") != -1 ||
         node.textContent.indexOf("承諾") != -1)) {
      dispatchClick(node);
    }
  }
  traceDOM(document.body, [clickAdmit]);
}

function traceDOM(node, interceptors) {
  if (!node) return;
  for (let interceptor of interceptors) {
    interceptor(node);
  }
  if (node.nodeName === "IFRAME") {
    try {
      node = node.contentDocument;
      if (!node) return;
    } catch (e) {
      return;
    }
  }
  for (let childNode = node.firstChild; childNode; childNode = childNode.nextSibling) {
    traceDOM(childNode, interceptors);
  }
}
