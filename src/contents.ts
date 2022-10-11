
// Save Value
let buttons = new Map<number, SavedButton>();
class SavedButton {
  id: number;
  text: string;
  html: HTMLElement;

  constructor(id: number, text: string, html: HTMLElement) {
    this.id = id;
    this.text = text;
    this.html = html;
  }
}


// Receive Instruction Type
export class ClickButton {
  type: 'ClickButton' = 'ClickButton';
  ids: number[];

  constructor(ids: number[]) {
    this.ids = ids;
  }
}

export const RequestKittensInfo = {type: 'RequestKittensInfo'};
export const Ping = {type: 'Ping'};


// Send Value
export const DoneInitialize = {type: 'DoneInitialize'};

export class KittensInfo {
  type: 'KittensInfo' = 'KittensInfo';
  buttons: Button[];
  resources: Resource[];

  constructor(buttons: Button[], resources: Resource[]) {
    this.buttons = buttons;
    this.resources = resources;
  }
}

class Button {
  id: number;
  text: string;

  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
  }
}

export class Resource {
  name: string;
  text: string;
  amount: number;
  max: number;
  tick: number;

  constructor(name: string, text: string, amount: number, max: number, tick: number) {
    this.name = name;
    this.text = text;
    this.amount = amount;
    this.max = max;
    this.tick = tick;
  }
}

export const Pong = {type: 'Pong'};


// Set Listener
browser.runtime.onMessage.addListener((raw: string) => {
  const message = JSON.parse(raw);
  if(message.type === 'ClickButton') {
    const button = message as ClickButton;
    button.ids.forEach(id => {
      if(buttons.get(id)?.html.click() == undefined) throw new Error(`Button id=${id} is not found`);
    });
    return Promise.resolve(JSON.stringify(Pong));
  }
  else if(message.type === 'RequestKittensInfo') {
    const info = collectInfo();
    return Promise.resolve(JSON.stringify(info));
  }
  else if(message.type === 'Ping') {
    return Promise.resolve(JSON.stringify(Pong));
  }
});

document.addEventListener('DOMContentLoaded', initialize);


// Functions
function initialize(ev: Event) {
  const interval = setInterval(() => {
    const loadingDisplay = document.getElementById("loadingContainer")?.style.display;
    if(loadingDisplay == "none") {
      browser.runtime.sendMessage(DoneInitialize);
      clearInterval(interval);
    }
  }, 100);
}

const ID_ATTR = 'data_ponkotuy_id'
function updateButtons() {
  [...document.querySelectorAll<HTMLElement>('div.btnContent')].forEach((elem, idx) => {
    const idAttr = elem.getAttribute(ID_ATTR);
    if(idAttr == null) {
      const nextId = buttons.size;
      elem.setAttribute(ID_ATTR, nextId.toString())
      buttons.set(nextId, new SavedButton(nextId, elem.textContent!, elem));
    }
  });
}

const SI = ['K', 'M', 'G'];
function fixSI(text: string): number {
  const idx = SI.indexOf(text.slice(-1));
  const numberText = text.match(/[-.\d]+/);
  if(numberText == null) return 0;
  const number = parseFloat(numberText[0]);
  if (idx < 0) return number;
  return Math.pow(1000, idx + 1) * number;
}

const NAME_RE = /^resource_([a-z]+)$/g;
function getResources(): Resource[] {
  return [...document.querySelectorAll<HTMLElement>(`div.res-row`)].map(row => {
    const name = [...row.classList].flatMap(cls => [...cls.matchAll(NAME_RE)])[0].slice(1)[0];
    const text = row.querySelector('div.res-cell.resource-name')!.getAttribute('title')!;
    const amountText = row.querySelector('div.res-cell.resAmount')!.textContent!
    const maxText = row.querySelector('div.res-cell.maxRes')!.textContent!
    const tickText = row.querySelector('div.res-cell.resPerTick')!.textContent!
    return new Resource(name, text, fixSI(amountText), fixSI(maxText), fixSI(tickText));
  });
}

function collectInfo(): KittensInfo {
  updateButtons();
  return new KittensInfo([...buttons.values()], getResources());
}
