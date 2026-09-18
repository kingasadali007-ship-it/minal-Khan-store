/**
 * Development-only Firestore Read Diagnostics Utility
 * Tracks and logs Firestore read operations to identify repeated or loop reads
 * without continuously querying Firestore.
 * In production, logging is suppressed.
 */

export interface FirestoreReadLogEntry {
  collection: string;
  operation: 'onSnapshot:initial' | 'onSnapshot:update' | 'getDoc' | 'getDocs';
  caller: string;
  docCount: number;
  timestamp: string;
}

class FirestoreReadTracker {
  private logs: FirestoreReadLogEntry[] = [];
  private collectionReadCounts: Record<string, number> = {};
  private totalDocsRead = 0;
  private isDev = Boolean((import.meta as any).env?.DEV);

  /**
   * Record a Firestore read operation
   */
  logRead(params: {
    collection: string;
    operation: 'onSnapshot:initial' | 'onSnapshot:update' | 'getDoc' | 'getDocs';
    caller: string;
    docCount?: number;
  }) {
    const docCount = params.docCount ?? 1;
    const entry: FirestoreReadLogEntry = {
      collection: params.collection,
      operation: params.operation,
      caller: params.caller,
      docCount,
      timestamp: new Date().toLocaleTimeString(),
    };

    this.logs.push(entry);
    this.totalDocsRead += docCount;
    this.collectionReadCounts[params.collection] = (this.collectionReadCounts[params.collection] || 0) + docCount;

    // Only log to console in development mode
    if (this.isDev) {
      console.debug(
        `%c[Firestore Read]%c ${params.collection} (%c${params.operation}%c by ${params.caller}) -> ${docCount} doc(s) [Total: ${this.totalDocsRead}]`,
        'color: #0284c7; font-weight: bold;',
        'color: inherit;',
        'color: #d97706; font-weight: 600;',
        'color: inherit;'
      );
    }
  }

  /**
   * Get current read statistics
   */
  getStats() {
    return {
      totalDocsRead: this.totalDocsRead,
      totalOperations: this.logs.length,
      byCollection: { ...this.collectionReadCounts },
      recentLogs: this.logs.slice(-20),
    };
  }

  /**
   * Clear session tracking logs
   */
  clear() {
    this.logs = [];
    this.collectionReadCounts = {};
    this.totalDocsRead = 0;
  }
}

export const firestoreTracker = new FirestoreReadTracker();

// Expose diagnostic inspection helper in window for debugging in dev mode
if (typeof window !== 'undefined' && Boolean((import.meta as any).env?.DEV)) {
  (window as any).__FIRESTORE_READ_STATS__ = () => firestoreTracker.getStats();
}
