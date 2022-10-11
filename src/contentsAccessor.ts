import {Ping} from "./contents";

export class ContentsAccessor {
  tabId: number;

  constructor(tabId: number) {
    this.tabId = tabId;
  }

  static async generate(): Promise<ContentsAccessor> {
    const tabId = await this.searchTab()
    return new ContentsAccessor(tabId);
  }

  static async searchTab(): Promise<number> {
    const tabs = await browser.tabs.query({status: "complete"});
    for (const tab of tabs) {
      if (tab.id == undefined) continue;
      const res = await browser.tabs.sendMessage(tab.id, JSON.stringify(Ping)).catch(e => undefined);
      if (res) return tab.id;
    }
    throw new Error("Not found contents tab.")
  }

  async sendMessage(message: any, id: number = this.tabId): Promise<any> {
    return this.sendMessageRaw(JSON.stringify(message), id).then(JSON.parse).catch(console.error);
  }

  async sendMessageRaw(message: string, id: number = this.tabId): Promise<string> {
    return await browser.tabs.sendMessage(id, message).catch(console.error);
  }
}
