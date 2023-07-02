async function init(module, id, buttonOptions, logoColumnOptions = {extended: false}) {
    bindButtonEvents(module, buttonOptions);
    await showTab(id, module, logoColumnOptions);
}

function bindButtonEvents(module, options) {
    const {tab1Button, tab2Button} = returnButtons(module);
    options = {isFirstEnabled: true, isSecondEnabled: true, ...options};

    if (options.isFirstEnabled) {
        tab1Button.onclick = () => showTab('tab1', module);
    }
    if (options.isSecondEnabled) {
        tab2Button.onclick = () => showTab('tab2', module);
    }
}

async function showTab(id, module, logoOptions = {extended: false}) {
    tabsReset(module);

    hideButton(oppositeTab(id), module);
    activateButton(id, module);

    hideTabNode(oppositeTab(id), module);
    showTabNode(id, module);

    if(id === 'tab1') await firstTabAnimation(module, logoOptions);
    if(id === 'tab2') await secondTabAnimation(module, logoOptions);
}

async function firstTabAnimation(module, logoOptions) {
    const id = 'tab1';
    renderNumbers(module, 25)
    const {rowNodes, hiddenContentNodes} = returnContentNodes(id, module);

    for (const rowNode of rowNodes) {
        await spanNodeType(rowNode);
    }

    showLogoColumn(id, module, logoOptions);
    await sleep(666);

    for (const hiddenContentNode of hiddenContentNodes) {
        await hiddenContentNodeAnimate(hiddenContentNode);
    }
}

async function secondTabAnimation(module, logoOptions) {
    const id = 'tab2';
    const {rowNodes, hiddenContentNodes} = returnContentNodes(id, module);
    renderNumbers(module, 48)
    for (let i = 0; i < rowNodes.length; i++) {
        await spanNodeType(rowNodes[i]);
        await hiddenContentNodeAnimate(hiddenContentNodes[i]);
    }

    showLogoColumn(id, module, logoOptions);
    await sleep(666);
}

function renderNumbers(module, number) {
    const columnNode = document.querySelector(`[data-module=${module}] [data-number-column]`);
    columnNode.innerHTML = '';

    for (let i = 1; i <= number; i++) {
        const numberRowElement = document.createElement('div');
        numberRowElement.innerText = i;
        numberRowElement.className = 'container__code-container__row-numbers__row';
        columnNode.append(numberRowElement);
    }
}

async function spanNodeType(rowNode) {
    for (const spanNode of rowNode.children) {
        await spanNode.type();
    }
}

async function hiddenContentNodeAnimate(hiddenContentNode) {
    for (const divNode of hiddenContentNode.children) {
        divNode.classList.add('animated');
        await sleep(300);
    }
}

function tabsReset(module) {
    const resetOneTab = (id, module) => {
        hideLogoColumn(id, module);
        hideTabNode(id, module);

        const {rowNodes, hiddenContentNodes} = returnContentNodes(id, module);

        for (const rowNode of rowNodes) {
            for (const spanNode of rowNode.children) {
                spanNode.reset();
            }
        }

        for (const hiddenContentNode of hiddenContentNodes) {
            for (const contentNode of hiddenContentNode.children) {
                contentNode.classList.remove('animated');
            }
        }
    }

    ['tab1', 'tab2'].forEach(id => resetOneTab(id, module))
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

class TypeAsync extends HTMLElement {

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
            await sleep(20)
        }
        this.toggleAnimation();
    }

    toggleAnimation() {
        this.classList.toggle('animation-is-typing');
    }
}

class ContainerLogos extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let template = document.getElementById("container-logos");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    showExtendedContent(id) {
        const extendedContent = this.shadowRoot.querySelector(`[data-tab=${id}] [data-extended-content]`);
        extendedContent.classList.remove('hidden');
    }

    openTab(id) {
        const logoNode = this.shadowRoot.querySelector(`[data-tab=${id}]`)
        logoNode.classList.remove('hidden');
        this.classList.add('fadein');
    }

    hideExtendedContent(id) {
        const extendedContent = this.shadowRoot.querySelector(`[data-tab=${id}] [data-extended-content]`);
        extendedContent.classList.add('hidden');
    }

    hideTab(id) {
        const logoNode = this.shadowRoot.querySelector(`[data-tab=${id}]`)
        logoNode.classList.add('hidden');
        this.classList.remove('fadein');
    }
}

function showLogoColumn(id, module, options= {extended: false}) {
    const logoNode = document.querySelector(`[data-module=${module}] container-logos`);
    logoNode.openTab(id);
    if(options.extended){
        logoNode.showExtendedContent(id);
    }
}

function hideLogoColumn(id, module) {
    const logoNode = document.querySelector(`[data-module=${module}] container-logos`);
    logoNode.hideTab(id);
    logoNode.hideExtendedContent(id);
}

function showTabNode(id, module) {
    document.querySelector(`[data-module=${module}] [data-tab=${id}]`).classList.remove('hidden');
}

function hideTabNode(id, module) {
    document.querySelector(`[data-module=${module}] [data-tab=${id}]`).classList.add('hidden');
}

function activateButton(id, module) {
    document.querySelector(`[data-module=${module}] [data-button=${id}]`).classList.add('active');
}

function hideButton(id, module) {
    document.querySelector(`[data-module=${module}] [data-button=${id}]`).classList.remove('active');
}

function returnContentNodes(id, module) {
    const selector = `[data-module=${module}] [data-tab=${id}]`;

    const rowNodes = [
        document.querySelector(`${selector} [data-row=row-1]`),
        document.querySelector(`${selector} [data-row=row-2]`),
        document.querySelector(`${selector} [data-row=row-3]`)];

    const hiddenContentNodes = [
        document.querySelector(`${selector} [data-hidden-content=hidden-content-1]`),
        document.querySelector(`${selector} [data-hidden-content=hidden-content-2]`),
        document.querySelector(`${selector} [data-hidden-content=hidden-content-3]`)
    ].filter(v => !!v);

    return {rowNodes, hiddenContentNodes};
}

function returnButtons(module) {
    const selector = `[data-module=${module}]`
    const tab1Button = document.querySelector(`${selector} [data-button=tab1]`)
    const tab2Button = document.querySelector(`${selector} [data-button=tab2]`)

    return {tab1Button, tab2Button}
}

function oppositeTab(id) {
    return id === 'tab1' ? 'tab2' : 'tab1';
}

function runObserver(moduleElement) {
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.getAttribute('data-module') === 'module-1') {
                    init('module-1', 'tab1', {isSecondEnabled: false})
                }

                if (entry.target.getAttribute('data-module') === 'module-2') {
                    init('module-2', 'tab1', {isSecondEnabled: false}, {extended: true})
                }
                if (entry.target.getAttribute('data-module') === 'module-3') {
                    init('module-3', 'tab2', {isFirstEnabled: false})
                }
                observer.unobserve(entry.target)
            }
        })
    })
    observer.observe(moduleElement)
}

function initModules() {
    let modules = document.querySelectorAll('[data-module^=module]');
    modules.forEach(runObserver)
}

customElements.define("container-logos", ContainerLogos);
customElements.define('type-async', TypeAsync)
document.addEventListener("DOMContentLoaded", initModules);