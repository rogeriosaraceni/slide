export default class Slide{
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = {
            finalPosition: 0,
            startX: 0,
            movement: 0
        }
    }

    //metodos:
    transition(active) {
        this.slide.style.transition = active ? 'transform .3s' : '';
    }

    moveSlide(distx) {
        this.dist.movePosition = distx;
        this.slide.style.transform = `translate3d(${distx}px, 0, 0)`;
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.6;
        return this.dist.finalPosition - this.dist.movement;
    }

    onStart(event) {
        let movetype;
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            movetype = 'mousemove';
        }
        else {
            this.dist.startX = event.changedTouches[0].clientX;
            movetype = 'touchmove';
        }

        //ativa o mousemove ou o touch ao clicar
        this.wrapper.addEventListener(movetype, this.onMove);
        this.transition(false);
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) { 
        const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        }
        else if (this.dist.movement < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        }
        else {
            this.changeSlide(this.index.active);
        }
    }

    //adiciona cada evento do slide
    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    //vincular o .this
    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    //Slides config
    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin)
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map(element => {
            const position = this.slidePosition(element);
            return {
                position,
                element
            }
        })
    }

    slideIndexNav(index) { 
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1
        }
    }

    changeSlide(index) {
        const active = this.slideArray[index];
        this.moveSlide(active.position);
        this.slideIndexNav(index)
        this.dist.finalPosition = active.position;
    }

    activePrevSlide() {
        if(this.index.prev !== undefined) this.changeSlide(this.index.prev)
    }
    activeNextSlide() {
        if(this.index.next !== undefined) this.changeSlide(this.index.next)
    }

    //para iniciar os eventos
    init() {
        this.bindEvents();
        this.transition(true);
        this.addSlideEvents();
        this.slidesConfig()
        return this;
    }
}