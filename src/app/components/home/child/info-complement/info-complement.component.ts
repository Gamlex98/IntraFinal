import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-complement',
  templateUrl: './info-complement.component.html',
  styleUrls: ['./info-complement.component.css']
})
export class InfoComplementComponent  {

  visible !: boolean;

  showDialog() {
      this.visible = true;
  }
}
