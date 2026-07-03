class AppException(Exception):
    status_code: int = 400
    error_code: str = "APP_ERROR"

    def __init__(self, detail: str, error_code: str | None = None):
        self.detail = detail
        if error_code:
            self.error_code = error_code
        super().__init__(detail)


class NotFoundException(AppException):
    status_code = 404
    error_code = "NOT_FOUND"


class ConflictException(AppException):
    status_code = 409
    error_code = "CONFLICT"


class BadRequestException(AppException):
    status_code = 400
    error_code = "BAD_REQUEST"