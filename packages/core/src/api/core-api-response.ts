import { Nullable } from '../interface/nullable.interface';
import { Code } from '../code/code';

export class CoreApiResponse<T> {
  public readonly timestamp!: number;
  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly data: Nullable<T> = null
  ) {
    this.timestamp = Date.now();
  }

  public static success<T>(data?: Nullable<T>) {
    return new CoreApiResponse<T>(Code.SUCCESS, Code.SUCCESS, data);
  }

  public static fail<T>(
    code: string,
    message: string = '',
    data?: Nullable<T>
  ) {
    return new CoreApiResponse<T>(code, message, data);
  }
}
