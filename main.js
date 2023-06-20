async function init1() {
    bindButtonEvents("module-1");
    await showTab('tab1', "module-1");
}

async function init2() {
    bindButtonEvents('module-2');
    await showTab('tab1', 'module-2')
}

function bindButtonEvents(module) {
    const selector = `[data-module=${module}]`
    const tab1Button = document.querySelector(`${selector} [data-button=tab1]`)
    const tab2Button = document.querySelector(`${selector} [data-button=tab2]`)

    tab1Button.onclick = () => {
        tab1Button.classList.add('active');
        tab2Button.classList.remove('active');
        tabsReset(module)
        showTab('tab1', module);
    };

    tab2Button.onclick = () => {
        tab2Button.classList.add('active');
        tab1Button.classList.remove('active');
        tabsReset(module)
        showSecondTab('tab2', module);
    };
}

async function showTab(id, module) {
    showLogoColumn(id, module);
    const selector = `[data-module=${module}] [data-tab=${id}]`

    const tabNode = document.querySelector(selector);
    tabNode.classList.remove('hidden');

    renderNumbers(module, 27)


    const rowNodes = [
        document.querySelector(`${selector} [data-row=row-1]`),
        document.querySelector(`${selector} [data-row=row-2]`),
        document.querySelector(`${selector} [data-row=row-3]`)];

    const hiddenContentNodes = document.querySelector(`${selector} [data-hidden-content=hidden-content-1]`)

    for (const rowNode of rowNodes) {
        await spanNodeType(rowNode);
    }
    await hiddenContentNodeAnimate(hiddenContentNodes);

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

async function showSecondTab(id, module) {
    showLogoColumn(id, module)
    showTabNode(id, module)

    renderNumbers(module, 48)

    const selector = `[data-module=${module}] [data-tab=${id}]`
    const rowNodes = [
        document.querySelector(`${selector} [data-row=row-1]`),
        document.querySelector(`${selector} [data-row=row-2]`),
        document.querySelector(`${selector} [data-row=row-3]`)];

    const hiddenContentNodes = [
        document.querySelector(`${selector} [data-hidden-content=hidden-content-1]`),
        document.querySelector(`${selector} [data-hidden-content=hidden-content-2]`),
        document.querySelector(`${selector} [data-hidden-content=hidden-content-3]`)
    ].filter(v => !!v);

    await spanNodeType(rowNodes[0]);
    await hiddenContentNodeAnimate(hiddenContentNodes[0]);
    await spanNodeType(rowNodes[1]);
    await hiddenContentNodeAnimate(hiddenContentNodes[1]);
    await spanNodeType(rowNodes[2]);
    await hiddenContentNodeAnimate(hiddenContentNodes[2]);
}

async function spanNodeType(rowNode) {
    for (const spanNode of rowNode.children) {
        await spanNode.type();
    }
}

async function hiddenContentNodeAnimate(hiddenContentNode) {
    for (const divNode of hiddenContentNode.children) {
        divNode.classList.add('animated');
        await sleep(100);
    }
}

function tabsReset(module) {
    const resetOneTab = (id, module) => {
        hideLogoNode(id, module);

        const selector = `[data-module=${module}] [data-tab=${id}]`

        document.querySelector(selector).classList.add('hidden');

        const rowNodes = [
            document.querySelector(`${selector} [data-row=row-1]`),
            document.querySelector(`${selector} [data-row=row-2]`),
            document.querySelector(`${selector} [data-row=row-3]`)];

        const hiddenContentNodes = [
            document.querySelector(`${selector} [data-hidden-content=hidden-content-1]`),
            document.querySelector(`${selector} [data-hidden-content=hidden-content-2]`),
            document.querySelector(`${selector} [data-hidden-content=hidden-content-3]`)
        ].filter(v => !!v);

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
            await sleep(5)
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

    openTab(id) {
        const logoNode = this.shadowRoot.querySelector(`[data-tab=${id}]`)
        logoNode.classList.remove('hidden');
    }

    hideTab(id) {
        const logoNode = this.shadowRoot.querySelector(`[data-tab=${id}]`)
        logoNode.classList.add('hidden');
    }
}

function showLogoColumn(id, module) {
    document.querySelector(`[data-module=${module}] container-logos`).openTab(id)
}

function hideLogoNode(id, module) {
    document.querySelector(`[data-module=${module}] container-logos`).hideTab(id)
}

function showTabNode(id, module) {
    document.querySelector(`[data-module=${module}] [data-tab=${id}]`).classList.remove('hidden');
}

function runObserver(moduleElement) {
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.getAttribute('data-module') === 'module-1') {
                    init1()
                }

                if (entry.target.getAttribute('data-module') === 'module-2') {
                    init2()
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