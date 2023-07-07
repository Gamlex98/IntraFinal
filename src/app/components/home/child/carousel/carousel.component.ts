import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})

export class CarouselComponent implements OnInit {
  @ViewChild('carousel', { static: true }) carouselRef!: ElementRef;
  @ViewChild('slides', { static: true }) slidesRef!: ElementRef;

  carousel!: HTMLElement;
  slides!: HTMLElement;
  dots!: NodeListOf<Element>;

  slideCount!: number;
  activeIndex!: number;

  autoPlayTimer!: any;
  canAutoPlay!: boolean;

  isMouseOverImage: boolean = false;
  
  ngOnInit() {
    this.carousel = this.carouselRef.nativeElement as HTMLElement;
    this.slides = this.slidesRef.nativeElement as HTMLElement;
    this.dots = this.carousel.querySelectorAll('.dot a');
    this.slideCount = this.dots.length;
    this.activeIndex = 0;

    this.setActiveIndex(this.activeIndex);
    this.autoPlay();
  }

  pauseAutoPlay() {
    if (this.isMouseOverImage) return;
    this.isMouseOverImage = true;
    clearInterval(this.autoPlayTimer);
  }

  resumeAutoPlay() {
    if (!this.isMouseOverImage) return;
    this.isMouseOverImage = false;
    this.autoPlay();
  }

  setActiveIndex(activeIndex: number) {
    this.dots.forEach(dot => dot.classList.remove('active'));
    this.dots[activeIndex].classList.add('active');
    this.carousel.style.setProperty('--active-index', `${activeIndex}`);
  }
  
  scrollLeft() {
    let minIndex = false;
    this.activeIndex--;
    if (this.activeIndex === -1) {
      minIndex = true;
      this.activeIndex = this.slideCount - 1;
    }
    this.setActiveIndex(this.activeIndex);
    if (minIndex) {
      this.slides.scrollBy(this.carousel.offsetWidth * (this.slideCount - 1), 0);
    } else {
      this.slides.scrollBy(-this.carousel.offsetWidth, 0);
    }
  }

  scrollRight() {
    let maxIndex = false;
    this.activeIndex++;
    if (this.activeIndex === this.slideCount) {
      maxIndex = true;
      this.activeIndex = 0;
    }
    this.setActiveIndex(this.activeIndex);
    if (maxIndex) {
      this.slides.scrollBy(-this.carousel.offsetWidth * (this.slideCount - 1), 0);
    } else {
      this.slides.scrollBy(this.carousel.offsetWidth, 0);
    }
  }

  autoPlay() {
    this.autoPlayTimer = setInterval(() => {
      this.scrollRight();
    }, 4000);
    this.canAutoPlay = this.carousel.classList.contains('auto-play');
    if (!this.canAutoPlay) {
      clearInterval(this.autoPlayTimer);
    }
  }

  resetTimer() {
    if (this.canAutoPlay) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = setInterval(() => {
        this.scrollRight();
      }, 4000);
    }
  }

  onDotClick(activeIndex: number, event: Event) {
    event.preventDefault(); // Evita la navegación predeterminada del enlace
    this.resetTimer();
    this.setActiveIndex(activeIndex);
  }

  onLeftArrowClick() {
    this.resetTimer();
    this.scrollLeft();
  }

  onRightArrowClick() {
    this.resetTimer();
    this.scrollRight();
  }
}
