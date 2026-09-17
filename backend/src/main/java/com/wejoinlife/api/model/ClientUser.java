package com.wejoinlife.api.model;

public record ClientUser(
    String id,
    String clientUuid,
    String email,
    String pass,
    String isVerified,
    String isSuperUser,
    String clientProfilId
) {}

