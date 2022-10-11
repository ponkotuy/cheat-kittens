import {KittensInfo, Resource} from "./contents";
import {KittensAccessor} from "./kittensAccessor";
import {ContentsAccessor} from "./contentsAccessor";

function isFull(resource: Resource) {
  return resource.max * 0.9 < resource.amount;
}

function maxStrategy(info: KittensInfo) {
  info.resources.forEach(resource => {
    if(resource != undefined && isFull(resource)) {
      switch (resource.name) {
        case 'catnip':
          break;
        default:
          break;
      }
    }
  });
}

let tickBackground: NodeJS.Timer | null = null;
browser.runtime.onMessage.addListener(initialize);

function initialize(message: string) {
  if(tickBackground) clearInterval(tickBackground);
  Background.generate().then(background => {
    setInterval(() => background.run(), 100);
  });
}

class Background {
  kittens: KittensAccessor

  constructor(kittens: KittensAccessor) {
    this.kittens = kittens;
  }

  run() {
    this.kittens.click('キャットニップの収穫');
  }

  static async generate(): Promise<Background> {
    const accessor = await ContentsAccessor.generate();
    const kittens = await KittensAccessor.generate(accessor);
    return new Background(kittens);
  }
}
