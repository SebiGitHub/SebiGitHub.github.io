(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DEMO_MODEL = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  "use strict";
  function visibleProtocols(protocolos, usuario, query = "") {
    const text = query.trim().toLocaleLowerCase("es");
    return protocolos.filter(p =>
      p.publicado &&
      (p.servicio === "TODOS" || p.servicio === usuario.servicio) &&
      (p.categoria === "TODAS" || p.categoria === usuario.categoria) &&
      (!text || `${p.titulo} ${p.descripcion}`.toLocaleLowerCase("es").includes(text))
    );
  }
  return Object.freeze({ visibleProtocols });
});
