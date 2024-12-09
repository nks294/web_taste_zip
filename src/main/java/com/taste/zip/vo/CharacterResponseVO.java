package com.taste.zip.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CharacterResponseVO {
    private Long characterId;
    private String characterName;
    private String characterImage;
    private boolean isProfileImage;
    private String obtainedDate;
}
