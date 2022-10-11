import {ClickButton, KittensInfo, RequestKittensInfo} from "./contents";
import {ContentsAccessor} from "./contentsAccessor";

export class KittensAccessor {
  accessor: ContentsAccessor;
  info: KittensInfo;

  constructor(accessor: ContentsAccessor, info: KittensInfo) {
    this.accessor = accessor;
    this.info = info;
  }

  click(...texts: string[]) {
    const ids = texts.map(text => this.info.buttons.find(b => b.text.startsWith(text))!).map(b => b.id);
    this.accessor.sendMessage(new ClickButton(ids)).catch(console.error);
  }

  static async generate(accessor: ContentsAccessor) {
    const info = await accessor.sendMessage(RequestKittensInfo);
    console.log(info.resources);
    console.log(info.buttons);
    return new KittensAccessor(accessor, info);
  }
}
