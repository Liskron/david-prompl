let areButtonsDisabled = false;

async function init() {
    bindButtonEvents();
    await showTab1();
}

function bindButtonEvents() {
    const tab1Button = document.querySelector('#tab1-button')
    const tab2Button = document.querySelector('#tab2-button')

    tab1Button.onclick = () => {
        if(!areButtonsDisabled){
            tab1Button.classList.add('active');
            tab2Button.classList.remove('active');

            showTab1();
        }
    };

    tab2Button.onclick = () => {
        if(!areButtonsDisabled) {
            tab2Button.classList.add('active');
            tab1Button.classList.remove('active');

            showTab2();
        }
    };
}

async function showTab1() {
    areButtonsDisabled = true;
    tab2Reset();

    const tabNode = document.querySelector('#tab1');
    tabNode.classList.remove('hidden');

    const rowNodes = [
        document.querySelector("#tab1-row-1"),
        document.querySelector("#tab1-row-2"),
        document.querySelector("#tab1-row-3")];

    for (const rowNode of rowNodes) {
        for (const spanNode of rowNode.children) {
            await spanNode.type();
        }
    }

    const hiddenContentNodes = document.querySelector('#tab1-hidden-content').children;
    for (const hiddenContentNode of hiddenContentNodes) {
        hiddenContentNode.classList.add('animated');
        await sleep(100);
    }
    areButtonsDisabled = false;
}

async function showTab2() {
    areButtonsDisabled = true;

    tab1Reset();

    const tabNode = document.querySelector('#tab2');
    tabNode.classList.remove('hidden');

    const rowNodes = [
        document.querySelector("#tab2-row-1"),
        document.querySelector("#tab2-row-2"),
        document.querySelector("#tab2-row-3")];

    for (const rowNode of rowNodes) {
        for (const spanNode of rowNode.children) {
            await spanNode.type();
        }
    }

    const hiddenContentNodes = document.querySelector('#tab2-hidden-content').children;
    for (const hiddenContentNode of hiddenContentNodes) {
        hiddenContentNode.classList.add('animated');
        await sleep(100);
    }

    areButtonsDisabled = false;
}

function tab1Reset() {
    const tabNode = document.querySelector('#tab1');
    tabNode.classList.add('hidden');
    const rowNodes = [
        document.querySelector("#tab1-row-1"),
        document.querySelector("#tab1-row-2"),
        document.querySelector("#tab1-row-3")];

    for (const rowNode of rowNodes) {
        for (const spanNode of rowNode.children) {
            spanNode.reset();
        }
    }

    const hiddenContentNodes = document.querySelector('#tab1-hidden-content').children;
    for (const hiddenContentNode of hiddenContentNodes) {
        hiddenContentNode.classList.remove('animated');
    }
}

function tab2Reset() {
    const tabNode = document.querySelector('#tab2');
    tabNode.classList.add('hidden');

    const rowNodes = [
        document.querySelector("#tab2-row-1"),
        document.querySelector("#tab2-row-2"),
        document.querySelector("#tab2-row-3")];

    for (const rowNode of rowNodes) {
        for (const spanNode of rowNode.children) {
            spanNode.reset();
        }
    }

    const hiddenContentNodes = document.querySelector('#tab2-hidden-content').children;
    for (const hiddenContentNode of hiddenContentNodes) {
        hiddenContentNode.classList.remove('animated');
    }
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

class TypeAsync extends HTMLSpanElement {

    reset() {
        this.style.visibility = 'hidden';
    }

    async type() {
        let text = this.innerHTML;
        text = text.replace(/&lt;/, '<').replace(/&gt;/, '>');
        this.innerHTML = '';
        this.style.visibility = 'visible'
        this.toggleAnimation();
        for (let character of text) {
            this.innerHTML += character
            await sleep(5)
        }
        this.toggleAnimation();
    }

    toggleAnimation() {
        this.classList.toggle('animation-is-typing');
    }
}

customElements.define('type-async', TypeAsync, {extends: 'span'})

document.addEventListener("DOMContentLoaded", init);
