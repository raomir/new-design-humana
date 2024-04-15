export const environment = {
    url: 'http://localhost:9091/api/',
    url_sinergia: 'http://oracle.aleerp.com:8002/api/', //'https://dev08-backend.aleerp.com/api/', // 'https://qa-back.nuevoerp.co/api/', //,
    token: '',
    production: false,
    pantalla: (screen.width < 768) ? 'smarthphone' : 'computer',
    language_datatable: {},
    mapeoSiNo: {
        SI: 1,
        NO: 2
    },
    dominio: "autogestion",
    redireccion: false,
    mostrarBotones: true,
    onlyPermissions: ['talentohumano', 'evaluaciondesempeno', 'bienestar', 'autogestion','relacioneslaborales']
  };
   