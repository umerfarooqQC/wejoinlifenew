package com.wejoinlife.api.model;

public record SiteRecord(
    String id,
    String suid,
    String name,
    String countryCode,
    String defaultLang,
    Integer createdBy
) {}

