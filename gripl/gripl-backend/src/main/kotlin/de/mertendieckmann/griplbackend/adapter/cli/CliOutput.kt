package de.mertendieckmann.griplbackend.adapter.cli

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

object CliOutput {
    fun print(res: Any, mode: String) =
        when (mode.lowercase()) {
            "json" -> println(jacksonObjectMapper().writeValueAsString(res))
            else   -> println(res.toString())
        }
    fun line(any: Any) = any.toString()
}