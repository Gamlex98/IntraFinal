import { Component, OnInit ,AfterViewInit} from '@angular/core';


@Component({
  selector: 'app-info-complement',
  templateUrl: './info-complement.component.html',
  styleUrls: ['./info-complement.component.css']
})
export class InfoComplementComponent implements OnInit , AfterViewInit {

  visible !: boolean;

  isHovered = false; // Variable para controlar el estado del mouse

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const root = document.documentElement;
    const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
    const marqueeContent = document.querySelector("ul.marquee-content");

    if (marqueeContent) {
      root.style.setProperty("--marquee-elements", marqueeContent.children.length.toString());

      for (let i = 0; i < parseInt(marqueeElementsDisplayed); i++) {
        marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
      }
    }
  }

  onMouseEnter(): void {
    this.isHovered = true; // Establecer el estado del mouse como activo cuando se pasa el mouse sobre el elemento
  }

  onMouseLeave(): void {
    this.isHovered = false; // Establecer el estado del mouse como inactivo cuando se sale el mouse del elemento
  }

  showDialog() {
      this.visible = true;
  }
}
