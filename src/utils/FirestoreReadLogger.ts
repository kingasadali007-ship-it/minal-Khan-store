/**
 * Development-only FirestoreReadLogger Utility
 * Intercepts and logs Firestore read calls (getDoc, getDocs, onSnapshot)
 * with their origin, collection/path, document count, and timestamp
 * to help diagnose read-quota exhaustion without polling the database.
 */

import {
  getDoc as originalGetDoc,
  getDocs as originalGetDocs,
  onSnapshot as originalOnSnapshot,
  DocumentReference,
  Query,
  DocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';

export interface ReadLogEntry {
  id: string;
  operation: 'getDoc' | 'getDocs' | 'onSnapshot:init' | 'onSnapshot:event';
  collection: string;
  path: string;
  docCount: number;
  origin: string;
  timestamp: string;
  timeMs: number;
}

export interface ReadStats {
  totalReads: number;
  totalCalls: number;
  readsByCollection: Record<string, number>;
  callsByOperation: Record<string, number>;
  activeListeners: Record<string, number>;
  recentLogs: ReadLogEntry[];
}

/**
 * Extracts collection and path from DocumentReference, CollectionReference, or Query
 */
function extractPathAndCollection(refOrQuery: any): { collection: string; path: string } {
  if (!refOrQuery) {
    return { collection: 'unknown', path: 'unknown' };
  }

  let pathStr = '';
  if (typeof refOrQuery.path === 'string') {
    pathStr = refOrQuery.path;
  } else if (refOrQuery._query?.path?.canonicalString) {
    pathStr = refOrQuery._query.path.canonicalString();
  } else if (refOrQuery._query?.path?.segments) {
    pathStr = refOrQuery._query.path.segments.join('/');
  } else if (typeof refOrQuery.id === 'string') {
    pathStr = refOrQuery.id;
  } else {
    pathStr = 'query';
  }

  const segments = pathStr.split('/').filter(Boolean);
  const collectionName = segments.length > 0 ? segments[0] : pathStr;

  return {
    collection: collectionName,
    path: pathStr,
  };
}

/**
 * Extracts the calling function/component and file location from the call stack
 */
function extractCallerOrigin(skipFrames = 3): string {
  try {
    const stack = new Error().stack;
    if (!stack) return 'unknown';

    const lines = stack.split('\n');
    for (let i = skipFrames; i < lines.length; i++) {
      const line = lines[i];
      if (
        !line.includes('FirestoreReadLogger') &&
        !line.includes('firestoreReadLogger') &&
        !line.includes('firestoreDebug') &&
        !line.includes('node_modules') &&
        !line.includes('@firebase')
      ) {
        const cleaned = line.trim().replace(/^at\s+/, '');
        return cleaned;
      }
    }
    return lines[skipFrames]?.trim().replace(/^at\s+/, '') || 'app';
  } catch {
    return 'unknown';
  }
}

/**
 * Central Logger Class for Firestore Read Operations
 */
class FirestoreReadLoggerClass {
  private isDev = Boolean((import.meta as any).env?.DEV);
  private logs: ReadLogEntry[] = [];
  private readsByCollection: Record<string, number> = {};
  private callsByOperation: Record<string, number> = {};
  private activeListenersCount = 0;
  private activeListenersByPath: Record<string, number> = {};
  private totalReads = 0;

  /**
   * Log an intercepted read event
   */
  record(params: {
    operation: 'getDoc' | 'getDocs' | 'onSnapshot:init' | 'onSnapshot:event';
    path: string;
    collection: string;
    docCount: number;
    origin?: string;
  }) {
    if (!this.isDev) return;

    const origin = params.origin || extractCallerOrigin();
    const entry: ReadLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      operation: params.operation,
      collection: params.collection,
      path: params.path,
      docCount: params.docCount,
      origin,
      timestamp: new Date().toLocaleTimeString(),
      timeMs: Date.now(),
    };

    this.logs.push(entry);
    this.totalReads += params.docCount;
    this.readsByCollection[params.collection] = (this.readsByCollection[params.collection] || 0) + params.docCount;
    this.callsByOperation[params.operation] = (this.callsByOperation[params.operation] || 0) + 1;

    // Clean, readable formatted console output with badges
    console.debug(
      `%c[FirestoreReadLogger]%c %c${params.operation}%c on %c${params.path}%c (+${params.docCount} docs | Total: ${this.totalReads})\n  ↳ Origin: ${origin}`,
      'color: #0284c7; font-weight: bold; background: #e0f2fe; padding: 2px 4px; border-radius: 3px;',
      'color: inherit;',
      'color: #d97706; font-weight: 600;',
      'color: inherit;',
      'color: #059669; font-weight: 600;',
      'color: inherit;'
    );
  }

  trackListenerStart(path: string) {
    this.activeListenersCount++;
    this.activeListenersByPath[path] = (this.activeListenersByPath[path] || 0) + 1;
  }

  trackListenerEnd(path: string) {
    this.activeListenersCount = Math.max(0, this.activeListenersCount - 1);
    if (this.activeListenersByPath[path]) {
      this.activeListenersByPath[path]--;
      if (this.activeListenersByPath[path] <= 0) {
        delete this.activeListenersByPath[path];
      }
    }
  }

  getStats(): ReadStats {
    return {
      totalReads: this.totalReads,
      totalCalls: this.logs.length,
      readsByCollection: { ...this.readsByCollection },
      callsByOperation: { ...this.callsByOperation },
      activeListeners: { ...this.activeListenersByPath },
      recentLogs: this.logs.slice(-30),
    };
  }

  getLogs(): ReadLogEntry[] {
    return [...this.logs];
  }

  printSummary() {
    if (typeof console !== 'undefined') {
      console.group('%c[FirestoreReadLogger Summary]', 'color: #0284c7; font-weight: bold;');
      console.log(`Total Document Reads: ${this.totalReads}`);
      console.log(`Total Invocations: ${this.logs.length}`);
      console.log(`Active Listeners: ${this.activeListenersCount}`);
      if (console.table) {
        console.table(this.readsByCollection);
      } else {
        console.log('Reads by Collection:', this.readsByCollection);
      }
      console.groupEnd();
    }
  }

  clear() {
    this.logs = [];
    this.readsByCollection = {};
    this.callsByOperation = {};
    this.totalReads = 0;
  }
}

export const FirestoreReadLogger = new FirestoreReadLoggerClass();
export default FirestoreReadLogger;

/**
 * Intercepted getDoc wrapper
 */
export async function loggedGetDoc<AppModelType = any, DbModelType = any>(
  reference: DocumentReference<AppModelType, DbModelType>
): Promise<DocumentSnapshot<AppModelType, DbModelType>> {
  const origin = extractCallerOrigin();
  const { collection, path } = extractPathAndCollection(reference);

  const snapshot = await originalGetDoc(reference);
  const docCount = snapshot.exists() ? 1 : 0;

  FirestoreReadLogger.record({
    operation: 'getDoc',
    collection,
    path,
    docCount,
    origin,
  });

  return snapshot;
}

/**
 * Intercepted getDocs wrapper
 */
export async function loggedGetDocs<AppModelType = any, DbModelType = any>(
  query: Query<AppModelType, DbModelType>
): Promise<QuerySnapshot<AppModelType, DbModelType>> {
  const origin = extractCallerOrigin();
  const { collection, path } = extractPathAndCollection(query);

  const snapshot = await originalGetDocs(query);
  const docCount = snapshot.size;

  FirestoreReadLogger.record({
    operation: 'getDocs',
    collection,
    path,
    docCount,
    origin,
  });

  return snapshot;
}

/**
 * Intercepted onSnapshot wrapper
 */
export function loggedOnSnapshot(
  target: any,
  ...args: any[]
): Unsubscribe {
  const origin = extractCallerOrigin();
  const { collection, path } = extractPathAndCollection(target);

  FirestoreReadLogger.trackListenerStart(path);

  let userOnNext: ((snap: any) => void) | undefined;
  let userOnError: ((err: any) => void) | undefined;
  let options: any = undefined;

  let argIndex = 0;
  if (typeof args[0] === 'object' && !('next' in args[0]) && typeof args[1] === 'function') {
    options = args[0];
    argIndex = 1;
  }

  if (typeof args[argIndex] === 'function') {
    userOnNext = args[argIndex];
  } else if (typeof args[argIndex] === 'object' && typeof (args[argIndex] as any)?.next === 'function') {
    userOnNext = (snap: any) => (args[argIndex] as any).next(snap);
    userOnError = (err: any) => (args[argIndex] as any)?.error?.(err);
  }

  if (typeof args[argIndex + 1] === 'function') {
    userOnError = args[argIndex + 1];
  }

  let isFirst = true;

  const wrappedOnNext = (snap: any) => {
    const docCount = snap?.size ?? (snap?.exists?.() ? 1 : 0);
    FirestoreReadLogger.record({
      operation: isFirst ? 'onSnapshot:init' : 'onSnapshot:event',
      collection,
      path,
      docCount,
      origin,
    });
    isFirst = false;

    if (userOnNext) {
      userOnNext(snap);
    }
  };

  const wrappedOnError = (err: any) => {
    if (userOnError) {
      userOnError(err);
    }
  };

  const callArgs = options
    ? [target, options, wrappedOnNext, wrappedOnError]
    : [target, wrappedOnNext, wrappedOnError];

  const originalUnsubscribe = (originalOnSnapshot as any)(...callArgs);

  return () => {
    FirestoreReadLogger.trackListenerEnd(path);
    if (typeof originalUnsubscribe === 'function') {
      originalUnsubscribe();
    }
  };
}

// Global window helpers for in-browser interactive inspection
if (typeof window !== 'undefined' && Boolean((import.meta as any).env?.DEV)) {
  (window as any).FirestoreReadLogger = FirestoreReadLogger;
  (window as any).__FIRESTORE_READ_LOGGER__ = FirestoreReadLogger;
  (window as any).getFirestoreReadStats = () => FirestoreReadLogger.getStats();
  (window as any).printFirestoreReadSummary = () => FirestoreReadLogger.printSummary();
}
