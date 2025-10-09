package de.mertendieckmann.griplbackend.adapter.web.error

import dev.langchain4j.service.output.OutputParsingException
import org.camunda.bpm.model.xml.ModelParseException
import org.camunda.bpm.model.xml.ModelValidationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.MissingRequestValueException

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ModelParseException::class)
    fun handleInvalidBpmn(ex: ModelParseException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(code = "BPMN_PARSE_ERROR", message = "BPMN XMl could not be parsed"))
            .also { ex.printStackTrace() }

    @ExceptionHandler(ModelValidationException::class)
    fun handleValidationError(ex: ModelValidationException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(code = "BPMN_VALIDATION_ERROR", message = "BPMN XML is not valid"))
            .also { ex.printStackTrace() }

    @ExceptionHandler(org.springframework.web.reactive.resource.NoResourceFoundException::class)
    fun handleNoResourceFoundException(ex: org.springframework.web.reactive.resource.NoResourceFoundException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiError(code = "RESOURCE_NOT_FOUND", message = "The requested resource was not found"))
            .also { ex.printStackTrace() }

    @ExceptionHandler(com.fasterxml.jackson.core.JsonParseException::class)
    fun handleJsonParseException(ex: com.fasterxml.jackson.core.JsonParseException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(code = "JSON_PARSE_ERROR", message = ex.message))
            .also { ex.printStackTrace() }

    @ExceptionHandler(dev.langchain4j.exception.InvalidRequestException::class)
    fun handleInterruptedException(ex: dev.langchain4j.exception.InvalidRequestException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError(code = "INTERRUPTED", message = ex.message))
            .also { print(ex) }

    @ExceptionHandler(RuntimeException::class)
    fun handleRuntimeException(ex: RuntimeException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError(code = "INTERNAL_ERROR", message = "There was an internal error processing your request: ${ex.localizedMessage}"))
            .also { ex.printStackTrace() }

    @ExceptionHandler(MissingRequestValueException::class)
    fun handleMissingRequestValueException(ex: MissingRequestValueException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(code = "MISSING_REQUEST_VALUE", message = ex.message))
            .also { ex.printStackTrace() }

    @ExceptionHandler(dev.langchain4j.exception.AuthenticationException::class)
    fun handleAuthenticationException(ex: dev.langchain4j.exception.AuthenticationException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ApiError(code = "AUTHENTICATION_ERROR", message = ex.message))
            .also { ex.printStackTrace() }

    @ExceptionHandler(dev.langchain4j.exception.RateLimitException::class)
    fun handleRateLimitException(ex: dev.langchain4j.exception.RateLimitException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.TOO_MANY_REQUESTS)
            .body(ApiError(code = "RATE_LIMIT_EXCEEDED", message = ex.message))
            .also { ex.printStackTrace() }

    @ExceptionHandler(OutputParsingException::class)
    fun handleOutputParsingException(ex: OutputParsingException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError(code = "OUTPUT_PARSING_ERROR", message = "There was an error parsing the output from the AI service: ${ex.localizedMessage}"))
            .also { ex.printStackTrace() }

    data class ApiError(val code: String, val message: String?)
}