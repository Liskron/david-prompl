async function init() {
    bindButtonEvents();
    await showTab('tab1');
}

function bindButtonEvents() {
    const tab1Button = document.querySelector('#tab1-button')
    const tab2Button = document.querySelector('#tab2-button')

    tab1Button.onclick = () => {
        tab1Button.classList.add('active');
        tab2Button.classList.remove('active');
        tabsReset()
        showTab('tab1');
    };

    tab2Button.onclick = () => {
        tab2Button.classList.add('active');
        tab1Button.classList.remove('active');
        tabsReset()
        showSecondTab('tab2');
    };
}

async function showTab(id) {
    const logoNode = document.querySelector(`#container-${id}`)
    logoNode.classList.remove('hidden');
    const tabNode = document.querySelector(`#${id}`);
    tabNode.classList.remove('hidden');


    renderNumbers(27)

    const rowNodes = [
        document.querySelector(`#${id}-row-1`),
        document.querySelector(`#${id}-row-2`),
        document.querySelector(`#${id}-row-3`)];


    for (const rowNode of rowNodes) {
        await spanNodeType(rowNode);
    }
    const hiddenContentNodes = document.querySelector(`#${id}-hidden-content`);
    await hiddenContentNodeAnimate(hiddenContentNodes);

}

function renderNumbers(number) {
    const columnNode = document.getElementById('number-column');
    columnNode.innerHTML = '';

    for (let i = 1; i <= number; i++ ) {
        const numberRowElement = document.createElement('div');
        numberRowElement.innerText = i;
        numberRowElement.className = 'container__code-container__row-numbers__row';
        columnNode.append(numberRowElement);
    }
}

async function showSecondTab(id) {
    const logoNode = document.querySelector(`#container-${id}`)
    logoNode.classList.remove('hidden');
    const tabNode = document.querySelector(`#${id}`)
    tabNode.classList.remove('hidden');

    renderNumbers(48)

    const rowNodes = [
        document.querySelector(`#${id}-row-1`),
        document.querySelector(`#${id}-row-2`),
        document.querySelector(`#${id}-row-3`)];

    const hiddenContentNodes = [
        document.querySelector(`#${id}-hidden-content-1`),
        document.querySelector(`#${id}-hidden-content-2`),
        document.querySelector(`#${id}-hidden-content-3`)
    ]

    await spanNodeType(rowNodes[0]);
    await hiddenContentNodeAnimate(hiddenContentNodes[0]);
    await spanNodeType(rowNodes[1]);
    await hiddenContentNodeAnimate(hiddenContentNodes[1]);
    await spanNodeType(rowNodes[2]);
    await hiddenContentNodeAnimate(hiddenContentNodes[2]);
}

async function spanNodeType(rowNode) {
    for(const spanNode of rowNode.children){
        await spanNode.type();
    }
}

async function hiddenContentNodeAnimate(hiddenContentNode) {
    for (const divNode of hiddenContentNode.children) {
        divNode.classList.add('animated');
        await sleep(100);
    }
}

function tabsReset() {
    const resetOneTab = (id) => {
        const logoNode = document.querySelector(`#container-${id}`)
        logoNode.classList.add('hidden');
        const tabNode = document.querySelector(`#${id}`);
        tabNode.classList.add('hidden');

        const rowNodes = [
            document.querySelector(`#${id}-row-1`),
            document.querySelector(`#${id}-row-2`),
            document.querySelector(`#${id}-row-3`)];

        const hiddenContentNodes = [
            document.querySelector(`#${id}-hidden-content`),
            document.querySelector(`#${id}-hidden-content-1`),
            document.querySelector(`#${id}-hidden-content-2`),
            document.querySelector(`#${id}-hidden-content-3`)
        ].filter(v=> !!v);

        for (const rowNode of rowNodes) {
            for (const spanNode of rowNode.children) {
                spanNode.reset();
            }
        }

        for (const hiddenContentNode of hiddenContentNodes) {
            for (const contentNode of hiddenContentNode.children){
                contentNode.classList.remove('animated');
            }
        }
    }

    ['tab1', 'tab2'].forEach(id => resetOneTab(id))
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

class TypeAsync extends HTMLSpanElement {

    reset() {
        this.style.visibility = 'hidden';
    }

    async type() {
        let text = this.attributes.getNamedItem('data-text').value;
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
