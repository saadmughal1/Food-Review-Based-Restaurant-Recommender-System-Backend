class BadRequestError(Exception):
    def __init__(self, message="Bad Request",status=400):
        self.message = message
        self.status = status
        super().__init__(self.message,self.status)
