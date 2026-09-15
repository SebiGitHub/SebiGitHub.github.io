(() => {
  "use strict";
  const data = window.DEMO_DATA;
  const model = window.DEMO_MODEL;
  const $ = id => document.getElementById(id);
  const usuario = $("usuario"), buscar = $("buscar"), perfil = $("perfil"), lista = $("lista");
  const lecturasBody = $("lecturas"), resultado = $("resultado");
  const storageKey = "tfg-demo-lecturas-v1";
  const iniciales = [
    {usuario:"ana.demo@example.invalid",protocolo:"PR-001",version:2,fecha:"2026-05-05T09:30:00.000Z"},
    {usuario:"bruno.demo@example.invalid",protocolo:"PR-003",version:3,fecha:"2026-05-06T11:15:00.000Z"}
  ];
  const read = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || iniciales; } catch { return iniciales; } };
  const write = value => localStorage.setItem(storageKey, JSON.stringify(value));
  const node = (tag, text, className) => { const el=document.createElement(tag); if(text!==undefined)el.textContent=text; if(className)el.className=className; return el; };

  for (const u of data.usuarios) {
    const option=node("option",u.nombre); option.value=u.correo; usuario.append(option);
  }

  function activeUser(){ return data.usuarios.find(u=>u.correo===usuario.value); }
  function renderProfile(){
    const u=activeUser(); perfil.replaceChildren();
    for(const [label,value] of [["Servicio",data.servicios[u.servicio]],["Categoría",data.categorias[u.categoria]]]){
      perfil.append(node("dt",label),node("dd",value));
    }
  }
  function markRead(p){
    const items=read(); items.unshift({usuario:activeUser().correo,protocolo:p.codigo,version:p.version,fecha:new Date().toISOString()}); write(items); renderReads();
  }
  function renderProtocols(){
    const u=activeUser(), q=buscar.value.trim().toLocaleLowerCase("es");
    const items=model.visibleProtocols(data.protocolos,u,q);
    resultado.textContent=`${items.length} resultado${items.length===1?"":"s"} para ${u.nombre}`;
    lista.replaceChildren();
    if(!items.length){lista.append(node("p","No hay protocolos que coincidan con el perfil y la búsqueda.","empty"));return;}
    for(const p of items){
      const card=node("article",undefined,"protocol"), title=node("h3",p.titulo), desc=node("p",p.descripcion), meta=node("div",undefined,"meta");
      meta.append(node("span",`Versión ${p.version}`,"tag"),node("span",data.servicios[p.servicio],"tag"),node("span",data.categorias[p.categoria],"tag"));
      const button=node("button","Registrar lectura");button.type="button";button.addEventListener("click",()=>markRead(p));
      card.append(title,desc,meta,button);lista.append(card);
    }
  }
  function renderReads(){
    lecturasBody.replaceChildren();
    for(const item of read().filter(x=>x.usuario===activeUser().correo)){
      const p=data.protocolos.find(x=>x.codigo===item.protocolo);
      const row=document.createElement("tr");
      for(const value of [activeUser().nombre,p?.titulo||item.protocolo,String(item.version),new Intl.DateTimeFormat("es-ES",{dateStyle:"short",timeStyle:"short"}).format(new Date(item.fecha))]) row.append(node("td",value));
      lecturasBody.append(row);
    }
    if(!lecturasBody.children.length){const row=document.createElement("tr"),cell=node("td","Todavía no hay lecturas para este usuario.");cell.colSpan=4;row.append(cell);lecturasBody.append(row);}
  }
  function render(){renderProfile();renderProtocols();renderReads();}
  usuario.addEventListener("change",render);buscar.addEventListener("input",renderProtocols);
  $("reiniciar").addEventListener("click",()=>{localStorage.removeItem(storageKey);renderReads();});
  render();
})();
