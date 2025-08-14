import { Logger } from "@/utils/logger";
import { CHAIN_IDS } from "@/config/contracts";

export interface WalletProvider {
  name: string;
  icon: string;
  isInstalled: () => boolean;
  isConnected: (_address: string) => Promise<boolean>; // Prefixed as unused in interface
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  switchChain: (_chainId: number | string) => Promise<void>;
}

/**
 * Base class for EVM-compatible wallet providers
 * @class EVMWalletBase
 * @implements {WalletProvider}
 * @description Provides common functionality for Ethereum Virtual Machine compatible wallets.
 * Handles connection, disconnection, chain switching, and account management for EVM wallets.
 * @example
 * ```typescript
 * class CustomWallet extends EVMWalletBase {
 *   constructor() {
 *     super('Custom', 'custom-icon', window.ethereum);
 *   }
 * }
 * ```
 */
class EVMWalletBase implements WalletProvider {
  name: string;
  icon: string;
  protected provider: unknown;
  private disconnectionAttempts = 0;
  private chainParams: Record<number, unknown> | null = null;

  constructor(name: string, icon: string, provider: unknown) {
    this.name = name;
    this.icon = icon;
    this.provider = provider;
  }

  isInstalled(): boolean {
    return Boolean(this.provider);
  }

  async isConnected(address: string): Promise<boolean> {
    try {
      const accounts = await this.provider.request({ method: "eth_accounts" });
      return accounts?.includes(address) || false;
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    try {
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      });

      if (!accounts?.length) {
        throw new Error("No accounts found");
      }

      return accounts[0];
    } catch (error) {
      Logger.error(`${this.name} connection failed`, { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.disconnectionAttempts++;
    // Most EVM wallets don't have a disconnect method
    return Promise.resolve();
  }

  async switchChain(chainId: number): Promise<void> {
    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: unknown) {
      if (error.code === 4902) {
        // Chain not added, add it
        await this.addChain(chainId);
      } else {
        throw error;
      }
    }
  }

  protected async addChain(chainId: number): Promise<void> {
    const chainParams = this.getChainParams(chainId);
    if (!chainParams) throw new Error("Unsupported chain");

    await this.provider.request({
      method: "wallet_addEthereumChain",
      params: [chainParams],
    });
  }

  protected getChainParams(chainId: number) {
    if (!this.chainParams) {
      this.chainParams = {};
    }
    const chains = {
      [CHAIN_IDS.MOONBASE]: {
        chainId: `0x${CHAIN_IDS.MOONBASE.toString(16)}`,
        chainName: "Moonbase Alpha",
        nativeCurrency: {
          name: "DEV",
          symbol: "DEV",
          decimals: 18,
        },
        rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
        blockExplorerUrls: ["https://moonbase.moonscan.io/"],
      },
      [CHAIN_IDS.MOONBEAM]: {
        chainId: `0x${CHAIN_IDS.MOONBEAM.toString(16)}`,
        chainName: "Moonbeam",
        nativeCurrency: {
          name: "GLMR",
          symbol: "GLMR",
          decimals: 18,
        },
        rpcUrls: ["https://rpc.api.moonbeam.network"],
        blockExplorerUrls: ["https://moonbeam.moonscan.io/"],
      },
      [CHAIN_IDS.ASTAR]: {
        chainId: `0x${CHAIN_IDS.ASTAR.toString(16)}`,
        chainName: "Astar",
        nativeCurrency: {
          name: "ASTR",
          symbol: "ASTR",
          decimals: 18,
        },
        rpcUrls: ["https://astar.api.onfinality.io/public"],
        blockExplorerUrls: ["https://blockscout.com/astar"],
      },
      [CHAIN_IDS.POLYGON]: {
        chainId: `0x${CHAIN_IDS.POLYGON.toString(16)}`,
        chainName: "Polygon",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://polygon-rpc.com"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    };
    return chains[chainId as keyof typeof chains];
  }
}

/**
 * MetaMask wallet provider implementation
 * @class MetaMaskWallet
 * @extends EVMWalletBase
 * @description Integrates with MetaMask browser extension for Ethereum transactions.
 * Provides MetaMask-specific functionality including connection management and chain switching.
 * @example
 * ```typescript
 * const metamask = new MetaMaskWallet();
 * if (metamask.isInstalled()) {
 *   const address = await metamask.connect();
 *   console.log('Connected to:', address);
 * }
 * ```
 */
class MetaMaskWallet extends EVMWalletBase {
  private installationChecks = 0;

  constructor() {
    super(
      "MetaMask",
      "metamask",
      window.ethereum?.isMetaMask ? window.ethereum : null,
    );
  }

  isInstalled(): boolean {
    this.installationChecks++;
    return typeof window.ethereum?.isMetaMask !== "undefined";
  }
}

/**
 * Coinbase Wallet provider implementation
 * @class CoinbaseWallet
 * @extends EVMWalletBase
 * @description Integrates with Coinbase Wallet browser extension for cryptocurrency transactions.
 * Provides Coinbase-specific functionality for DeFi interactions and asset management.
 * @example
 * ```typescript
 * const coinbase = new CoinbaseWallet();
 * if (coinbase.isInstalled()) {
 *   const address = await coinbase.connect();
 *   await coinbase.switchChain(1287); // Moonbase Alpha
 * }
 * ```
 */
class CoinbaseWallet extends EVMWalletBase {
  private installationChecks = 0;

  constructor() {
    super(
      "Coinbase Wallet",
      "coinbase",
      window.ethereum?.isCoinbaseWallet ? window.ethereum : null,
    );
  }

  isInstalled(): boolean {
    this.installationChecks++;
    return typeof window.ethereum?.isCoinbaseWallet !== "undefined";
  }
}

/**
 * Tally wallet provider implementation
 * @class TallyWallet
 * @extends EVMWalletBase
 * @description Integrates with Tally wallet browser extension for Ethereum-based transactions.
 * Provides privacy-focused wallet functionality with enhanced security features.
 * @example
 * ```typescript
 * const tally = new TallyWallet();
 * if (tally.isInstalled()) {
 *   const address = await tally.connect();
 *   await tally.switchChain(1284); // Moonbeam
 * }
 * ```
 */
class TallyWallet extends EVMWalletBase {
  private installationChecks = 0;

  constructor() {
    super("Tally", "tally", window.ethereum?.isTally ? window.ethereum : null);
  }

  isInstalled(): boolean {
    this.installationChecks++;
    return typeof window.ethereum?.isTally !== "undefined";
  }
}

/**
 * Brave wallet provider implementation
 * @class BraveWallet
 * @extends EVMWalletBase
 * @description Integrates with Brave browser's built-in cryptocurrency wallet.
 * Provides native browser wallet functionality with privacy-first approach.
 * @example
 * ```typescript
 * const brave = new BraveWallet();
 * if (brave.isInstalled()) {
 *   const address = await brave.connect();
 *   await brave.switchChain(592); // Astar
 * }
 * ```
 */
class BraveWallet extends EVMWalletBase {
  private installationChecks = 0;

  constructor() {
    super(
      "Brave",
      "brave",
      window.ethereum?.isBraveWallet ? window.ethereum : null,
    );
  }

  isInstalled(): boolean {
    this.installationChecks++;
    return typeof window.ethereum?.isBraveWallet !== "undefined";
  }
}

/**
 * Polkadot wallet provider implementation
 * @class PolkadotWallet
 * @implements {WalletProvider}
 * @description Integrates with Polkadot.js extension for Substrate-based blockchain interactions.
 * Currently serves as a placeholder with limited functionality for future Polkadot integration.
 * @example
 * ```typescript
 * const polkadot = new PolkadotWallet();
 * await polkadot.initialize();
 * // Note: Connection functionality is not yet implemented
 * ```
 */
class PolkadotWallet implements WalletProvider {
  name = "Polkadot";
  icon = "polkadot";
  private readonly injector: unknown = null;
  private readonly extensions: unknown[] = [];
  private initializationAttempts = 0;
  private installationChecks = 0;
  private connectionAttempts = 0;
  private disconnectionAttempts = 0;
  private chainSwitchAttempts = 0;

  async initialize() {
    this.initializationAttempts++;
    // Polkadot.js extension functionality removed
  }

  isInstalled(): boolean {
    this.installationChecks++;
    return false;
  }

  async isConnected(_address: string): Promise<boolean> {
    this.connectionAttempts++;
    return false;
  }

  async connect(): Promise<string> {
    this.connectionAttempts++;
    throw new Error("Polkadot wallet connection not implemented");
  }

  async disconnect(): Promise<void> {
    this.disconnectionAttempts++;
    return Promise.resolve();
  }

  async switchChain(chainId: string): Promise<void> {
    this.chainSwitchAttempts++;
    Logger.info("Chain switch requested", { chain: chainId });
  }
}

/**
 * React hook for managing multiple cryptocurrency wallets
 * @function useWallet
 * @description Provides access to various wallet providers including MetaMask, Coinbase, Tally, Brave, and Polkadot.
 * Returns utilities for discovering installed wallets and accessing wallet instances for connection management.
 * @returns {Object} Object containing wallet management utilities
 * @returns {Function} returns.getInstalledWallets - Function that returns array of installed wallet providers
 * @returns {WalletProvider[]} returns.wallets - Array of all available wallet providers
 * @example
 * ```tsx
 * function WalletSelector() {
 *   const { getInstalledWallets, wallets } = useWallet();
 *   const installedWallets = getInstalledWallets();
 *
 *   return (
 *     <div>
 *       {installedWallets.map(wallet => (
 *         <button key={wallet.name} onClick={() => wallet.connect()}>
 *           Connect {wallet.name}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useWallet() {
  const wallets: WalletProvider[] = [
    new MetaMaskWallet(),
    new CoinbaseWallet(),
    new TallyWallet(),
    new BraveWallet(),
    new PolkadotWallet(),
  ];

  const getInstalledWallets = () => {
    return wallets.filter((wallet) => wallet.isInstalled());
  };

  return {
    getInstalledWallets,
    wallets,
  };
}
