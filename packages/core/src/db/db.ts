import {Transaction} from './transaction'
export interface DB<T extends Transaction> {
  readonly client: T;
}

export const of = <T extends Transaction>(client: T): DB<T> => ({ client });

export const map =
  <T extends Transaction, R>(f: (client: T) => R) =>
  (db: DB<T>) => {
    return f(db.client);
  };

export const mapFirst =
  <T extends Transaction, R>(f: (client: T) => R) =>
  (db: DB<T>) => {
    f(db.client);
    return db;
  };
