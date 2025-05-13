export default class Slide{
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
    }

    //metodos:
    onStart(event) {
        event.preventDefault();

        //ativa o mousemove ao clicar
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    onMove(event) {
    }

    onEnd(event) { 
        this.wrapper.removeEventListener('mousemove', this.onMove);
    }




    //adiciona cada evento do slide
    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
    }


    //vincular o .this
    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    //para iniciar os eventos
    init() {
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}