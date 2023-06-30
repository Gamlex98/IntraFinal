import { Component, OnDestroy, OnInit } from '@angular/core';
import * as $ from 'jquery';

declare const StickyNavigation: any;

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})

export class SolicitudesComponent implements OnInit , OnDestroy {

  ngOnInit() {
    new StickyNavigation();
  }

  ngOnDestroy() {
    // Limpiar eventos y objetos relacionados con StickyNavigation para eliminar errores al cambiar de Componente en la NavBar Principal
    $(window).off('scroll');
    $(window).off('resize');
    $('.et-hero-tab').off('click');
    
    // Si es necesario, llamar a métodos adicionales de limpieza en StickyNavigation
    // this.stickyNavigation.cleanupMethod();
  }

}
