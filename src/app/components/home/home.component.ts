import { Component, OnDestroy, OnInit } from '@angular/core';
import * as $ from 'jquery';

declare const StickyNavigation: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , OnDestroy {

  ngOnInit() {
    new StickyNavigation();
  }

  ngOnDestroy() {
    // Limpiar eventos y objetos relacionados con StickyNavigation para eliminar errores al cambiar de Componente en la NavBar Principal
    $(window).off('scroll');
    $(window).off('resize');
    $('.et-hero-tab').off('click');
    
    // this.stickyNavigation.cleanupMethod();
  }
}
