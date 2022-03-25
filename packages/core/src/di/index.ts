import { createContextToken } from '../context';
import { DB, Transaction, Session } from '../db';
export class CommonDITokens {
  public static readonly DB = createContextToken<DB.DB<any>>('db');
  public static readonly Transaction =
    createContextToken<Transaction>('transaction');
  public static readonly Session = createContextToken<Session>('session');
}
