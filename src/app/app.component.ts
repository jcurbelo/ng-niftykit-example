import { Component } from '@angular/core';
import Dropkit from 'dropkit.js';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-niftykit-example';
  drop: Dropkit | null = null;
  apiKey = '';
  isDev = false;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  collection: Collection | null = null;
  quantity = 1;
  tokens: number[] = [];

  constructor() { }

  async initDrop(): Promise<void> {
    const providers = {};
    this.drop = await Dropkit.create(this.apiKey, this.isDev);
  }

  async start(): Promise<void> {
    this.loading$.next(true);
    try {
      await this.initDrop();
      if (!this.drop) {
        throw new Error('Dropkit is not initialized');
      }
      // Builds the object
      this.collection = {
        price: await this.drop.price(),
        maxPerMint: await this.drop.maxPerMint(),
        maxPerWallet: await this.drop.maxPerWallet(),
        maxAmount: await this.drop.maxAmount(),
        walletTokensCount: await this.drop.walletTokensCount(),
        totalSupply: await this.drop.totalSupply(),
        auctionDuration: await this.drop.auctionDuration(),
        auctionStartedAt: await this.drop.auctionStartedAt(),
        auctionPrice: await this.drop.auctionPrice(),
        auctionActive: await this.drop.auctionActive(),
        saleActive: await this.drop.saleActive(),
        presaleActive: await this.drop.presaleActive()
      };

      // Generates the tokens options
      for (let token = 1; token <= this.collection.maxPerMint; token++) {
        this.tokens.push(token);
      }

    } catch (e) {
      alert(e);
    } finally {
      this.loading$.next(false);
    }
  }

  async mint(): Promise<void> {
    this.loading$.next(true);
    try {
      if (!this.drop) {
        throw new Error('Dropkit is not initialized');
      }
      await this.drop.mint(this.quantity);
      alert('Minted 1 token');
    } catch (e) {
      alert(e);
    } finally {
      this.loading$.next(false);
    }
  }

  async quickMint(): Promise<void> {
    this.loading$.next(true);
    try {
      await this.initDrop();
      if (!this.drop) {
        throw new Error('Dropkit is not initialized');
      }
      await this._mint(1);
      alert('Minted 1 token');
    } catch (e) {
      alert(e);
    } finally {
      this.loading$.next(false);
    }
  }

  private async _mint(quantity: number): Promise<void> {
    if (!this.drop) {
      throw new Error('Dropkit is not initialized');
    }
    await this.drop.mint(quantity);
  }

}

interface Collection {
  price: unknown;
  maxPerMint: number;
  maxPerWallet: number;
  maxAmount: number;
  walletTokensCount: number;
  totalSupply: number;
  auctionDuration: number;
  auctionStartedAt: number;
  auctionPrice: unknown;
  auctionActive: boolean;
  saleActive: boolean;
  presaleActive: boolean;
}
