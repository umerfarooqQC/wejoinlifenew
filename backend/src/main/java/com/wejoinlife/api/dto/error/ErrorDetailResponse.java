package com.wejoinlife.api.dto.error;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ErrorDetailResponse(
        @JsonProperty("detail") Detail detail
) {
    public record Detail(
            @JsonProperty("code") String code,
            @JsonProperty("message") String message
    ) {}

    public static ErrorDetailResponse of(String code, String message) {
        return new ErrorDetailResponse(new Detail(code, message));
    }
}

