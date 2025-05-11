// lib/utils.ts

/**
 * Shortens a wallet address for display.
 * Example: 0x1234...abcd
 */
export function shortenAddress(address: string, chars = 4): string {
    if (!address) return "";
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }
  
  /**
   * Converts a timestamp (or Date object) to a readable string.
   */
  export function formatDate(date: string | number | Date): string {
    return new Date(date).toLocaleString();
  }
  
  /**
   * Capitalizes the first letter of a string.
   */
  export function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  