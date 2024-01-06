import { get, omit } from 'lodash';

export class ResponseSerializer {
  constructor() {}

  success(data: Record<string, any> | Array<any> | string, status = 200) {
    return {
      success: true,
      code: status,
      data: data,
    };
  }

  error(error: Record<string, any> | string, status = 401) {
    let message = 'Something went wrong!';
    let errors = null;
    if (error instanceof Object) {
      message = error.message;
      errors = error.errors;
    } else {
      message = error;
    }

    return {
      success: false,
      code: status,
      message: message,
      errors: errors,
    };
  }

  noContent() {
    return {
      success: true,
      code: 200,
      data: {},
    };
  }

  withMeta(data: Record<string, any>, status = 200) {
    return {
      success: true,
      code: status,
      data: get(data, 'data'),
      meta: omit(data, ['data']),
    };
  }
}
