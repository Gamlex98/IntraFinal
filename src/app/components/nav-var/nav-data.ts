
import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [

    {
        routeLink: 'home',              
        icon: 'fal fa-home',
        label: 'Home'
    },
    {
        routeLink: 'upload',
        icon: 'far fa-arrow-alt-circle-up',
        label: 'Upload'
    },
    {
        routeLink: 'documentos/documentosFresmar',              
        icon: 'fa fa-folder',
        label: 'Gestion Documental',
        items : [
            {
                routeLink : 'documentos/documentosFresmar',
                icon: 'fa fa-folder',
                label: 'Comunicados'
            },
            {
                routeLink : 'documentos/plantillasFresmar',
                label : 'Formatos'
            },
            {
                routeLink : 'documentos/manuales-Guias-Fresmar',
                icon: 'fa fa-file',
                label: 'Guias/Procesos'
            },
            {
                routeLink : 'documentos/logosFresmar',
                label: 'Logos'
            },
         
        ]
    },
    {
        routeLink: 'calendario',
        icon: 'fal fa-calendar',
        label: 'Calendario de Eventos'
    },
    {
        routeLink: 'solicitudes',
        icon: 'fal fa-book',
        label: 'Solicitudes'
    },
     {
        href: "http://172.16.1.248/moodle/",
        icon: 'fal fa-graduation-cap',
        label: 'UniFresmar',
        external : true
    },
    {
        href: "http://172.16.1.249:4244/home",
        icon: 'fal fa-university',   
        label: 'Cuadre Caja',
        external:true
    },
    {
        href: "http://www.fresmar.com/",
        icon: 'fal fa-store',   
        label: 'Pagina Web',
        external:true
    },  
    {
        routeLink: 'login',
        icon: 'fal fa-sign-in',
        label: 'Login'
    }
];

