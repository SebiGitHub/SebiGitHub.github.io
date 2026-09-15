window.DEMO_DATA = Object.freeze({
  usuarios: [
    {correo:"ana.demo@example.invalid",nombre:"Ana Demo",servicio:"SRV-ADM",categoria:"CAT-ADM"},
    {correo:"bruno.demo@example.invalid",nombre:"Bruno Demo",servicio:"SRV-TEC",categoria:"CAT-TEC"},
    {correo:"carla.demo@example.invalid",nombre:"Carla Demo",servicio:"SRV-ADM",categoria:"CAT-RESP"}
  ],
  servicios: {"SRV-ADM":"Administración de ejemplo","SRV-TEC":"Tecnología de ejemplo","TODOS":"Todos los servicios"},
  categorias: {"CAT-ADM":"Personal administrativo de ejemplo","CAT-TEC":"Personal técnico de ejemplo","CAT-RESP":"Responsable de ejemplo","TODAS":"Todas las categorías"},
  protocolos: [
    {codigo:"PR-001",titulo:"Procedimiento ficticio de acogida",descripcion:"Ejemplo de documento común para todos los perfiles.",servicio:"TODOS",categoria:"TODAS",version:2,publicado:true},
    {codigo:"PR-002",titulo:"Guía ficticia de gestión documental",descripcion:"Ejemplo dirigido al servicio administrativo.",servicio:"SRV-ADM",categoria:"CAT-ADM",version:1,publicado:true},
    {codigo:"PR-003",titulo:"Procedimiento ficticio de soporte",descripcion:"Ejemplo dirigido al perfil técnico.",servicio:"SRV-TEC",categoria:"CAT-TEC",version:3,publicado:true},
    {codigo:"PR-004",titulo:"Borrador ficticio no publicado",descripcion:"Permite comprobar que los borradores no aparecen.",servicio:"SRV-ADM",categoria:"CAT-RESP",version:1,publicado:false}
  ]
});
