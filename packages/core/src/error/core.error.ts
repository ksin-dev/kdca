import { Code } from '../code/code';

type PartialErrorInput = Partial<
  Pick<CoreError, 'message' | 'code' | 'stack' | 'detail'>
>;

const createErrorData = (code: string, error?: PartialErrorInput) => {
  const data = error ?? {};
  return {
    code,
    ...data,
  };
};
export class CoreError extends Error {
  /**
   * NOTE 실제 사용자에게 전달되는 에러내용
   */
  readonly detail?: string;
  /**
   * NOTE  실제 사용자에게 전달되는 코드
   */
  readonly code: string;

  protected constructor(input: PartialErrorInput & { code: string }) {
    super(input.message);
    this.code = input.code;
    this.detail = input.detail;
    if (input.stack) {
      this.stack = input.stack;
    }
  }
}

export class ValidationError extends CoreError {
  constructor(error?: PartialErrorInput) {
    super(createErrorData(Code.VALIDATION, error));
  }
}

export class UseCaseInputValidationError extends ValidationError {}

export class UseCaseOutputValidationError extends ValidationError {}

export class EmptyEntityError extends CoreError {
  constructor(error?: PartialErrorInput) {
    super(createErrorData(Code.NOT_FOUND, error));
  }
}

export class UnknownError extends CoreError {
  constructor(error?: PartialErrorInput) {
    super(createErrorData(Code.UNKNOWN, error));
  }
}

export class DatabaseError extends UnknownError {}

export class NotFoundDependencyError extends UnknownError {}

export class ForbiddenError extends CoreError {
  constructor(error?: PartialErrorInput) {
    super(createErrorData(Code.FORBIDDEN, error));
  }
}

export class UnauthorizedError extends CoreError {
  constructor(error?: PartialErrorInput) {
    super(createErrorData(Code.UNAUTHORIZED, error));
  }
}
