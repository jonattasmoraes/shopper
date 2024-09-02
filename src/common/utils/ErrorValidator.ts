import { ClientError } from '../errors/BaseError'

/**
 * Helper function to verify that a promise is rejected with a specific ClientError.
 *
 * @param promise - The promise to test.
 * @param expectedStatusCode - The expected HTTP status code of the error.
 * @param expectedErrorCode - The expected error code of the error.
 * @param expectedErrorDescription - The expected error description of the error.
 */
export function expectClientError(
  promise: Promise<unknown>,
  expectedStatusCode: number,
  expectedErrorCode: string,
  expectedErrorDescription: string,
) {
  return promise
    .then(() => {
      throw new Error('Expected promise to be rejected.')
    })
    .catch((error) => {
      if (error instanceof ClientError) {
        expect(error.statusCode).toBe(expectedStatusCode)
        expect(error.errorCode).toBe(expectedErrorCode)
        expect(error.errorDescription).toBe(expectedErrorDescription)
      } else {
        throw error
      }
    })
}

/**
 * Helper function to verify that a synchronous function throws a specific ClientError.
 *
 * @param func - The function to test.
 * @param expectedStatusCode - The expected HTTP status code of the error.
 * @param expectedErrorCode - The expected error code of the error.
 * @param expectedErrorDescription - The expected error description of the error.
 */
export function expectClientErrorSync(
  func: () => void,
  expectedStatusCode: number,
  expectedErrorCode: string,
  expectedErrorDescription: string,
): void {
  try {
    // Execute the function that is expected to throw
    func()
    // If no error is thrown, indicate test failure
    throw new Error('Expected function to throw an error.')
  } catch (error) {
    // Check if the caught error is an instance of ClientError
    if (error instanceof ClientError) {
      // Verify the error properties
      expect(error.statusCode).toBe(expectedStatusCode)
      expect(error.errorCode).toBe(expectedErrorCode)
      expect(error.errorDescription).toBe(expectedErrorDescription)
    } else {
      // If the error is not a ClientError, rethrow it
      throw error
    }
  }
}
