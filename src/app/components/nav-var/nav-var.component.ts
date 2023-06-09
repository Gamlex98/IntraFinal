import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './nav-data';
import { INavbarData, fadeInOut} from './helper';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './nav-var.component.html',
  styleUrls: ['./nav-var.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', 
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class NavVarComponent implements OnInit{

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  
  collapsed = false;
  screenWidth = 0;
  navData= navbarData;
  multiple: boolean = false;


 

  constructor(public router: Router) {}
  @HostListener('window:resize', ['$event'])
  ngOnInit(): void {
    this.screenWidth= window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed= false;
      this.onToggleSideNav.emit({collapsed:this.collapsed, screenWidth: this.screenWidth});
    } else {
      this.collapsed= true;
      this.onToggleSideNav.emit({collapsed:this.collapsed, screenWidth: this.screenWidth});
    }
  }
  
  togglecollapse():void {
    this.collapsed= !this.collapsed;
    this.onToggleSideNav.emit({collapsed:this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav():void {
    this.collapsed= false;
    this.onToggleSideNav.emit({collapsed:this.collapsed, screenWidth: this.screenWidth});
  }

  handleClick(data: INavbarData): void {
    if (data.items && data.items.length > 0) {
      data.expanded = !data.expanded;
    } else {
      // Aquí puedes agregar el código para redirigir a la página correspondiente
      this.router.navigate([data.routeLink]);
    }
  }
  

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
