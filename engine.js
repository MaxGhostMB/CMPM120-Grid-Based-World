class Engine {
    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {
        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));
        this.actionsGridContainer = document.body.appendChild(document.createElement("div"));
        this.actionsGridContainer.className = "grid";

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, ...data) {
        this.scene = new sceneClass(this);
        this.scene.enter(...data);
    }

    addInteraction(action, ...data){
        let div = this.actionsContainer.appendChild(document.createElement("div"));
        let button = div.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            this.actionsContainer.removeChild(div);
            this.scene.handleInteraction(...data);
        }
    }

    addNavigationCell(action, ...data) {
        let div = this.actionsGridContainer.appendChild(document.createElement("div"));
        div.className = "square";
        let button = div.appendChild(document.createElement("button"));
        button.className = "navigation";
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsGridContainer.firstChild) {
                this.actionsGridContainer.removeChild(this.actionsGridContainer.firstChild)
            }
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleNavigation(...data);
        }
    }

    addTextCell(text) {
        let div = this.actionsGridContainer.appendChild(document.createElement("div"));
        div.className = "square";
        if (text) {
            div.innerText = text;
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    showCaption(msg) {
        let h2 = document.createElement("h2");
        h2.innerHTML = msg;
        this.output.appendChild(h2);
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }

    transition() {
        let hr = document.createElement("hr");
        this.output.appendChild(hr);
    }

    itemString(item){
        let emojicode = ":" + item + ":";
        let emojiu = joypixels.shortnameToUnicode(emojicode);
        if (emojiu != emojicode)
        {
            return emojiu;
        }
        return item;  
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    enter() { }

    update() { }

    handleNavigation(action) {
        console.warn('no choice handler on scene ', this);
    }

    handleInteraction(action) {
        console.warn('no interaction handler on scene ', this);
    }
}